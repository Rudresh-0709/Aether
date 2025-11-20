import { useState, useEffect } from 'react';
import { llmService } from '../services/llmService';
import { imageService } from '../services/imageService';

export function useGenerativeMystery() {
    const [worldData, setWorldData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function generate() {
            try {
                setLoading(true);
                
                // 1. Generate Mystery
                const mystery = await llmService.generateMystery("Steampunk Noir");

                // 2. Generate Room Layout
                const room = await llmService.generateRoomLayout(mystery);

                // 3. Generate Assets (Sprites)
                const npcsWithAssets = await Promise.all(mystery.suspects.map(async (npc) => {
                    const spriteUrl = await imageService.generateCharacterSprite(npc.traits);
                    // Find NPC position from room data or assign random
                    // For now, we'll just map them to the room's NPC slots if available, or random
                    return {
                        ...npc,
                        x: (Math.random() * 8) - 4,
                        z: (Math.random() * 8) - 4,
                        spriteUrl,
                        color: npc.role === 'Killer' ? '#ff00ff' : '#00ffff' // Keep debug colors for now too
                    };
                }));

                setWorldData({
                    mystery,
                    room: room,
                    npcs: npcsWithAssets
                });

            } catch (err) {
                console.error("Generation failed:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        generate();
    }, []);

    return { worldData, loading, error };
}
