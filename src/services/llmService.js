import { GoogleGenerativeAI } from "@google/generative-ai";
import { validationService } from './validationService';

// Initialize Gemini API
// Note: In a production app, you might want to proxy this through a backend to hide the key.
// For this client-side prototype, we use the env var directly.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper to parse JSON from LLM response (strips markdown)
function parseJSON(text) {
    try {
        // Remove markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse JSON:", text);
        throw new Error("Invalid JSON response from AI");
    }
}

export const llmService = {
    async generateMystery(theme) {
        if (!API_KEY) {
            console.warn("No API Key found. Using Mock Data.");
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
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const mystery = parseJSON(text);

            // Validate
            const validation = validationService.validateMystery(mystery);
            if (!validation.valid) {
                console.error("Generated mystery invalid:", validation.errors);
                throw new Error("Generated mystery schema validation failed");
            }

            return mystery;
        } catch (error) {
            console.error("LLM Error:", error);
            return this.generateMockMystery(); // Fallback
        }
    },

    async generateRoomLayout(mysteryContext) {
        if (!API_KEY) return this.generateMockRoom();

        console.log("Generating room layout...");
        
        const prompt = `
        Based on this mystery: ${JSON.stringify(mysteryContext).substring(0, 500)}...
        Generate a room layout for the crime scene.
        Return ONLY a valid JSON object:
        {
            "width": 10,
            "depth": 10,
            "walls": [ { "x": 0, "z": 0, "width": 0.5, "depth": 10, "height": 3 } ],
            "furniture": [ 
                { "id": "f1", "type": "box", "x": 2, "z": 2, "width": 1, "depth": 1, "height": 1, "color": "#hex" } 
            ]
        }
        Include walls to enclose the room and furniture relevant to the clues/mystery.
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const room = parseJSON(response.text());
            
            const validation = validationService.validateRoom(room);
            if (!validation.valid) {
                return validation.sanitizedData || this.generateMockRoom();
            }
            return room;
        } catch (error) {
            console.error("LLM Room Error:", error);
            return this.generateMockRoom();
        }
    },

    async chatWithNPC(npcProfile, playerMessage, memoryContext) {
        if (!API_KEY) return `[MOCK] I am ${npcProfile.name}. You said: ${playerMessage}`;

        const prompt = `
        You are acting as an NPC in a murder mystery.
        Name: ${npcProfile.name}
        Role: ${npcProfile.role}
        Traits: ${npcProfile.traits}
        Knowledge: ${memoryContext.summary}
        Recent Chat: ${memoryContext.recentHistory}
        
        The player asks: "${playerMessage}"
        
        Respond in character. Keep it short (under 2 sentences).
        If you are the killer, do not confess unless cornered with solid evidence.
        If you are innocent, be helpful but suspicious.
        `;

        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            return "I... I can't speak right now.";
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
            width: 10, depth: 10,
            walls: [],
            furniture: [
                { id: "desk", type: "box", x: 0, z: 0, width: 2, depth: 1, height: 1, color: "#4a3b2a" }
            ]
        };
    }
};
