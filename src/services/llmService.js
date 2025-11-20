import { validationService } from './validationService';

// Mock Data
const MOCK_MYSTERY = {
    victim: "Baroness Vane",
    killer: "Doctor Thorne",
    motive: "Greed (Inheritance)",
    weapon: "Poisoned Wine",
    timeline: {
        "09:00": { "Doctor Thorne": "Buying poison", "Baroness Vane": "Breakfast" },
        "12:00": { "Doctor Thorne": "Visiting Mansion", "Baroness Vane": "Found Dead" }
    },
    suspects: [
        { id: "suspect1", name: "Doctor Thorne", role: "Killer", traits: "Calculated, Nervous", alibi: "I was at the clinic." },
        { id: "suspect2", name: "Butler James", role: "Innocent", traits: "Loyal, Stoic", alibi: "I was polishing silver." }
    ],
    clues: [
        { id: "clue1", description: "Empty Vial", location: "Desk", relevant: true },
        { id: "clue2", description: "Will Testament", location: "Safe", relevant: true }
    ]
};

const MOCK_ROOM = {
    width: 10,
    depth: 10,
    walls: [
        { x: -5, z: 0, width: 0.5, depth: 10, height: 3 },
        { x: 5, z: 0, width: 0.5, depth: 10, height: 3 },
        { x: 0, z: -5, width: 10, depth: 0.5, height: 3 }
    ],
    furniture: [
        { id: "desk", type: "box", x: 0, z: -3, width: 2, depth: 1, height: 1, color: "#4a3b2a" },
        { id: "safe", type: "box", x: 4, z: -4, width: 1, depth: 1, height: 1.5, color: "#333" }
    ]
};

export const llmService = {
    async generateMystery(theme) {
        console.log(`Generating mystery with theme: ${theme}`);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mystery = MOCK_MYSTERY;
        
        // Validate
        const validation = validationService.validateMystery(mystery);
        if (!validation.valid) {
            console.error("Generated mystery invalid:", validation.errors);
            throw new Error("Failed to generate valid mystery");
        }

        return mystery;
    },

    async generateRoomLayout(mysteryContext) {
        console.log("Generating room layout...");
        await new Promise(resolve => setTimeout(resolve, 500));

        const room = MOCK_ROOM;
        
        // Validate
        const validation = validationService.validateRoom(room);
        if (!validation.valid) {
            console.error("Generated room invalid:", validation.errors);
            // Attempt to sanitize/fix
            return validation.sanitizedData || MOCK_ROOM;
        }

        return room;
    },

    async chatWithNPC(npcProfile, playerMessage, memoryContext) {
        console.log(`Chatting with ${npcProfile.name}...`);
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock Logic for response
        if (npcProfile.role === "Killer" && playerMessage.toLowerCase().includes("poison")) {
            return "I... I don't know what you're talking about! (Sweats)";
        }
        
        return `I am ${npcProfile.name}. I didn't do it!`;
    }
};
