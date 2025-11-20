import { z } from 'zod';

// --- Primitives ---
// --- Primitives ---
const CoordinateSchema = z.object({
    x: z.number(),
    z: z.number()
});

const SizeSchema = z.object({
    width: z.number(),
    depth: z.number()
});

// --- Entities ---
const ClueSchema = z.object({
    id: z.string(),
    type: z.string(), // Relaxed from enum
    description: z.string().optional(),
    x: z.number(),
    z: z.number()
});

const FurnitureSchema = z.object({
    id: z.string().optional(),
    name: z.string(), // Semantic tag, e.g., "victorian_desk"
    x: z.number(),
    z: z.number(),
    rotation: z.number().optional().default(0)
});

// --- Structure ---
const RoomSchema = z.object({
    id: z.string(),
    name: z.string(),
    width: z.number(),
    depth: z.number(),
    // Local coordinates relative to Zone
    x: z.number().optional().default(0),
    z: z.number().optional().default(0),
    furniture: z.array(FurnitureSchema).optional().default([]),
    clues: z.array(ClueSchema).optional().default([])
});

const ZoneSchema = z.object({
    id: z.string(),
    type: z.string(), // Relaxed from enum
    name: z.string(),
    x: z.number(), // Global coordinates
    z: z.number(),
    width: z.number(),
    depth: z.number(),
    rooms: z.array(RoomSchema).optional().default([])
});

const PathSchema = z.object({
    from: z.string(), // Zone ID
    to: z.string(),   // Zone ID
    type: z.string()  // Relaxed from enum
});

const SpawnPointsSchema = z.object({
    player: CoordinateSchema,
    npcs: z.array(z.object({
        id: z.string(),
        x: z.number(),
        z: z.number()
    })).optional().default([])
});

// --- Root ---
export const WorldSchema = z.object({
    world: z.object({
        width: z.number(),
        depth: z.number(),
        zones: z.array(ZoneSchema),
        paths: z.array(PathSchema).optional().default([]),
        spawnPoints: SpawnPointsSchema
    })
});
