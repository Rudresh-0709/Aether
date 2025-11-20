import { useState, useCallback } from 'react';
import { memoryService } from '../services/memoryService';
import { llmService } from '../services/llmService';

export function useNPCMemory(npc) {
    const [isTyping, setIsTyping] = useState(false);

    // Initialize memory on mount (or when NPC changes)
    // In a real app, we'd check if memory exists first
    if (npc) {
        memoryService.initMemory(npc.id, npc);
    }

    const chat = useCallback(async (interaction) => {
        if (!npc) return;

        setIsTyping(true);
        
        // 1. Update Memory with Player Interaction (Stringified for now)
        const memoryLog = `[${interaction.tone}] ${interaction.intent} ${interaction.targetClueId ? `(Clue: ${interaction.targetClueId})` : ''}`;
        memoryService.updateMemory(npc.id, memoryLog, "Player");

        // 2. Get Context
        const context = memoryService.getMemoryContext(npc.id);

        // 3. Call LLM with Interaction Object
        const response = await llmService.chatWithNPC(npc, interaction, context);

        // 4. Update Memory with NPC Response
        memoryService.updateMemory(npc.id, response, "NPC");

        setIsTyping(false);
        return response;
    }, [npc]);

    return { chat, isTyping };
}
