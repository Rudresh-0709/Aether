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

    const chat = useCallback(async (message) => {
        if (!npc) return;

        setIsTyping(true);
        
        // 1. Update Memory with Player Message
        memoryService.updateMemory(npc.id, message, "Player");

        // 2. Get Context
        const context = memoryService.getMemoryContext(npc.id);

        // 3. Call LLM
        const response = await llmService.chatWithNPC(npc, message, context);

        // 4. Update Memory with NPC Response
        memoryService.updateMemory(npc.id, response, "NPC");

        setIsTyping(false);
        return response;
    }, [npc]);

    return { chat, isTyping };
}
