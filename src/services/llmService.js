import OpenAI from 'openai';
import { Groq } from 'groq-sdk';
import { validationService } from './validationService';

// Initialize OpenAI API
// Note: dangerouslyAllowBrowser is true because this is a client-side prototype.
// In production, calls should go through a backend.
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;

let openai;
if (OPENAI_KEY) {
    openai = new OpenAI({
        apiKey: OPENAI_KEY,
        dangerouslyAllowBrowser: true
    });
}

let groq;
if (GROQ_KEY) {
    groq = new Groq({
        apiKey: GROQ_KEY,
        dangerouslyAllowBrowser: true
    });
}

export const llmService = {
    async generateMystery(theme) {
        if (!openai) {
            console.warn("No OpenAI API Key found. Using Mock Data.");
            return this.generateMockMystery();
        }

        console.log(`Generating mystery with theme: ${theme}`);

        const prompt = `
        Generate a murder mystery scenario in a "${theme}" setting.
        Return ONLY a valid JSON object with the following structure:
        {
            "victim": "Name",
            "killer": "Name",
            "motive": "Reason",
            "weapon": "Object",
            "timeline": {
                "09:00": { "SuspectName": "Activity", "VictimName": "Activity" },
                ...
            },
            "suspects": [
                { "id": "s1", "name": "Name", "role": "Killer/Innocent", "traits": "Adjectives", "alibi": "Explanation", "color": "#hex" }
            ],
            "clues": [
                { "id": "c1", "description": "Item", "location": "Where", "relevant": true/false }
            ]
        }
        Ensure there are at least 3 suspects (1 killer) and 3 clues.
        `;

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a creative mystery writer. Output valid JSON only." },
                    { role: "user", content: prompt }
                ],
                model: "gpt-4o-mini", // Cost-effective and fast
                response_format: { type: "json_object" }
            });

            const text = completion.choices[0].message.content;
            const mystery = JSON.parse(text);

            // Validate
            const validation = validationService.validateMystery(mystery);
            if (!validation.valid) {
                console.error("Generated mystery invalid:", validation.errors);
                throw new Error("Generated mystery schema validation failed");
            }

            return mystery;
        } catch (error) {
            console.error("OpenAI Error:", error);
            return this.generateMockMystery(); // Fallback
        }
    },

    async generateRoomLayout(mysteryContext) {
        if (!openai) return this.generateMockRoom();

        console.log("Generating room layout...");

        const prompt = `
        You are an expert 3D world designer for a mystery investigation game.
        Based on this mystery context: ${JSON.stringify(mysteryContext).substring(0, 1200)}

        Generate a LARGE WORLD layout, not just a room.

        Return ONLY valid JSON with this structure:

        {
        "world": {
            "width": number,
            "depth": number,
            
            "zones": [
            {
                "id": "string",
                "type": "indoor" | "outdoor",
                "name": "string",
                "x": number,
                "z": number,
                "width": number,
                "depth": number,

                "rooms": [
                {
                    "id": "string",
                    "name": "string",
                    "width": number,
                    "depth": number,
                    "walls": [],
                    "furniture": [],
                    "clues": [
                    {
                        "id": "string",
                        "type": "fingerprint" | "weapon" | "note" | "blood" | "footprint",
                        "x": number,
                        "z": number
                    }
                    ]
                }
                ]
            }
            ],

            "paths": [
            { "from": "zone_id", "to": "zone_id", "type": "hallway" | "road" }
            ],

            "spawnPoints": {
            "player": { "x": number, "z": number },
            "npcs": [ { "id": string, "x": number, "z": number } ]
            }
        }
        }

        Rules:
        - Make the world multi-room and multi-zone.
        - Include indoor (house/building) and outdoor (garden/street/yard) if relevant.
        - Ensure zones and rooms do NOT overlap.
        - Place clues in logical places tied to the mystery.
        - Return ONLY valid JSON.

        `;

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a 3D level designer. Output valid JSON only." },
                    { role: "user", content: prompt }
                ],
                model: "gpt-4o-mini",
                response_format: { type: "json_object" }
            });

            const room = JSON.parse(completion.choices[0].message.content);

            // Strict Validation using WorldParser
            // We try to parse it here to ensure it's valid. If not, we fallback.
            try {
                // We don't need the result, just checking if it throws
                const { WorldParser } = await import('../world/data/WorldParser');
                WorldParser.parse(room);
                return room;
            } catch (validationError) {
                console.warn("LLM World Schema Validation Failed:", validationError);
                return this.generateMockRoom();
            }
        } catch (error) {
            console.error("OpenAI Room Error:", error);
            return this.generateMockRoom();
        }
    },

    async chatWithNPC(npcProfile, interaction, memoryContext) {
        // Use Groq if available, otherwise fallback to OpenAI or Mock
        if (!groq) {
            if (openai) return this.chatWithOpenAI(npcProfile, interaction, memoryContext);
            return `[MOCK] I am ${npcProfile.name}. You asked about ${interaction.intent}.`;
        }

        // Import constants dynamically or assume they are available if we imported them at top
        // For now, I'll hardcode the mapping logic here to avoid circular deps or extra imports if not needed
        // But ideally we import INTENT_PROMPTS from constants.

        const INTENT_PROMPTS = {
            "AskAboutVictim": "The player asks you about the victim and your relationship with them.",
            "AskAboutAlibi": "The player asks where you were at the time of the murder.",
            "AskAboutTimeline": "The player asks what you remember about the events during the timeline.",
            "AskAboutLocation": "The player asks about the crime scene location.",
            "AskAboutRelationship": "The player asks about your relationship with another suspect.",
            "AskAboutClue": "The player asks about this clue: {clueContext}",
            "AskAboutWeapon": "The player asks about the possible murder weapon.",
            "AskAboutMotive": "The player asks if anyone had a motive.",
            "SoftAccusation": "The player is gently accusing you.",
            "HardAccusation": "The player is directly accusing you.",
            "ConfrontWithEvidence": "The player presents evidence against you: {clueContext}"
        };

        let basePrompt = INTENT_PROMPTS[interaction.intent] || "The player asks a question.";
        if (interaction.targetClueId) {
            basePrompt = basePrompt.replace("{clueContext}", `Clue ID: ${interaction.targetClueId}`);
        }

        const systemPrompt = `
        You are acting as an NPC in a murder mystery.
        Name: ${npcProfile.name}
        Role: ${npcProfile.role}
        Traits: ${npcProfile.traits}
        Knowledge: ${memoryContext.summary}
        
        Player Intent: ${interaction.intent}
        Player Tone: ${interaction.tone}
        Prompt: ${basePrompt}

        Rules:
        - NEVER reveal the killer unless cornered with strong evidence AND the intent is "HardAccusation" or "ConfrontWithEvidence".
        - Keep responses short (1–2 sentences).
        - Maintain internal consistency with timeline, alibis, and clues.
        - If evidence contradicts your alibi, react accordingly.
        - If innocent, provide helpful but uncertain details.
        - If guilty, deflect, lie subtly, or redirect conversation.
        `;

        try {
            console.log("Using Groq (Llama 3.1) for chat...");
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Recent Chat History:\n${memoryContext.recentHistory}\n\nPlayer Action: [${interaction.tone}] ${interaction.intent}` }
                ],
                model: "llama-3.1-8b-instant",
                temperature: 1,
                max_completion_tokens: 1024,
                top_p: 1,
                stream: false,
                stop: null
            });

            return completion.choices[0]?.message?.content || "...";
        } catch (error) {
            console.error("Groq Error:", error);
            return "I... I can't speak right now.";
        }
    },

    async chatWithOpenAI(npcProfile, interaction, memoryContext) {
        const systemPrompt = `You are ${npcProfile.name}. Player Intent: ${interaction.intent}. Tone: ${interaction.tone}.`;
        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Respond to the player's action." }
                ],
                model: "gpt-4o-mini",
            });
            return completion.choices[0].message.content;
        } catch (e) {
            return "Error in fallback chat.";
        }
    },

    // --- MOCK FALLBACKS ---
    generateMockMystery() {
        return {
            victim: "Baroness Vane",
            killer: "Doctor Thorne",
            motive: "Greed",
            weapon: "Poison",
            timeline: { "09:00": { "Doctor Thorne": "Buying poison" } },
            suspects: [
                { id: "s1", name: "Doctor Thorne", role: "Killer", traits: "Nervous", alibi: "Clinic", color: "#ff0000" },
                { id: "s2", name: "Butler James", role: "Innocent", traits: "Stoic", alibi: "Kitchen", color: "#00ff00" }
            ],
            clues: [
                { id: "c1", description: "Vial", location: "Desk", relevant: true }
            ]
        };
    },

    generateMockRoom() {
        return {
            world: {
                width: 20,
                depth: 20,
                zones: [
                    {
                        id: "zone_main",
                        type: "indoor",
                        name: "Manor Hall",
                        x: 0, z: 0,
                        width: 10, depth: 10,
                        rooms: [
                            {
                                id: "room_study",
                                name: "Study",
                                width: 10, depth: 10,
                                x: 0, z: 0,
                                furniture: [
                                    { id: "desk", name: "victorian_desk", x: 2, z: 2, rotation: 0 },
                                    { id: "shelf", name: "bookshelf", x: 8, z: 2, rotation: 1.57 }
                                ],
                                clues: [
                                    { id: "c1", type: "note", description: "A torn letter", x: 2.5, z: 2.2 }
                                ]
                            }
                        ]
                    }
                ],
                paths: [],
                spawnPoints: {
                    player: { x: 5, z: 5 },
                    npcs: [
                        { id: "s1", x: 3, z: 3 },
                        { id: "s2", x: 7, z: 7 }
                    ]
                }
            }
        };
    }
};
