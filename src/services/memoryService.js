const memoryStore = new Map();

export const memoryService = {
    initMemory(npcId, profile) {
        memoryStore.set(npcId, {
            shortTerm: [], // Last 5 messages
            longTerm: `You are ${profile.name}. ${profile.role}. Personality: ${profile.traits}.`,
            emotionalState: "Neutral"
        });
    },

    updateMemory(npcId, message, sender) {
        const memory = memoryStore.get(npcId);
        if (!memory) return;

        // Add to short term
        memory.shortTerm.push({ sender, text: message });
        if (memory.shortTerm.length > 5) {
            memory.shortTerm.shift();
        }

        // Update emotional state (Simple keyword matching for now)
        if (message.toLowerCase().includes("murder") || message.toLowerCase().includes("killer")) {
            memory.emotionalState = "Nervous";
        }
    },

    getMemoryContext(npcId) {
        const memory = memoryStore.get(npcId);
        if (!memory) return null;

        return {
            summary: memory.longTerm,
            recentHistory: memory.shortTerm.map(m => `${m.sender}: ${m.text}`).join("\n"),
            emotion: memory.emotionalState
        };
    }
};
