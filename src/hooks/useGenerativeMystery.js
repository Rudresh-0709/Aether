import { useState, useEffect } from 'react';
import { llmService } from '../services/llmService';
import { WorldParser } from '../world/data/WorldParser';
import { WorldBuilder } from '../world/WorldBuilder';

export function useGenerativeMystery() {
    const [worldData, setWorldData] = useState(null);
    const [sceneData, setSceneData] = useState(null); // SceneGraph
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function generate() {
            try {
                setLoading(true);

                // 1. Generate Mystery
                const mystery = await llmService.generateMystery("Steampunk Noir");

                // 2. Generate World Layout (Raw JSON)
                const rawWorld = await llmService.generateRoomLayout(mystery);

                // 3. Parse & Validate
                const validatedWorld = WorldParser.parse(rawWorld);

                // 4. Adapt to World Interface
                const worldInterface = {
                    metadata: { theme: mystery.theme || "noir", tone: "dark" },
                    size: { width: validatedWorld.width, depth: validatedWorld.depth },
                    zones: validatedWorld.zones.map(z => ({
                        ...z,
                        position: { x: z.x, y: 0, z: z.z },
                        size: { width: z.width, depth: z.depth },
                        rooms: z.rooms.map(r => ({
                            ...r,
                            position: { x: r.x, y: 0, z: r.z },
                            size: { width: r.width, depth: r.depth },
                            props: r.furniture.map(f => ({
                                ...f,
                                type: f.type || 'furniture',
                                transform: { position: { x: f.x, y: f.z, z: 0 }, rotation: f.rotation }
                            })),
                            clues: r.clues.map(c => ({
                                ...c,
                                type: 'clue',
                                clueType: c.type,
                                transform: { position: { x: c.x, y: c.z, z: 0 } }
                            }))
                        }))
                    })),
                    paths: validatedWorld.paths || [],
                    spawnPoints: {
                        player: { x: validatedWorld.spawnPoints.player.x, y: 0, z: validatedWorld.spawnPoints.player.z },
                        npcs: validatedWorld.spawnPoints.npcs.map(n => ({ id: n.id, position: { x: n.x, y: 0, z: n.z } }))
                    }
                };

                // 5. Build Scene (WorldBuilder)
                const builder = new WorldBuilder(worldInterface);
                const sceneGraph = builder.build();

                // 6. Hydrate NPCs (Add to Objects Layer)
                // We need to place suspects.
                mystery.suspects.forEach((npc, index) => {
                    const spawn = worldInterface.spawnPoints.npcs[index]?.position || { x: 0, y: 0, z: 0 };

                    // Create NPC Node manually for now, or add to WorldBuilder logic
                    // We'll just add it to the scene graph here
                    const npcNode = {
                        id: npc.id,
                        type: 'npc',
                        name: npc.name,
                        gridPosition: { x: spawn.x, y: spawn.z, z: 0 }, // Map to grid x/y
                        gridSize: { width: 1, depth: 1, height: 2 },
                        isoPosition: { x: 0, y: 0 }, // Should calculate, but IsoRenderer uses gridPosition
                        zIndex: 50,
                        color: npc.color || '#ff00ff',
                        visible: true,
                        children: [],
                        asset: { size: { width: 0.8, depth: 0.8, height: 1.8 }, color: npc.color || '#ff00ff' },
                        metadata: { original: npc }
                    };
                    sceneGraph.layers.objects.nodes.push(npcNode);
                });

                setWorldData({ mystery, rawWorld: validatedWorld });
                setSceneData(sceneGraph);

            } catch (err) {
                console.error("Generation failed:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        generate();
    }, []);

    return { worldData, sceneData, loading, error };
}
