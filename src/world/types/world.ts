export type Vector3 = { x: number; y: number; z: number };
export type ColorHex = string; // e.g., "#ff0000"

// --- Primitives ---
export interface Size {
    width: number;
    depth: number;
    height?: number;
}

export interface Transform {
    position: Vector3;
    rotation?: number; // Y-axis rotation in radians
    scale?: Vector3;
}

// --- Assets & Prefabs ---
export interface PrefabMapping {
    type: string; // e.g., "chair", "wall_brick"
    prefabId: string; // e.g., "prop_chair_01"
    defaultSize?: Size;
    renderHints?: {
        castShadow?: boolean;
        receiveShadow?: boolean;
        layerDepthOffset?: number; // For isometric sorting adjustments
    };
}

// --- Entities ---
export interface EntityBase {
    id: string;
    name: string;
    transform: Transform;
    prefabId?: string; // Resolved asset ID
    color?: ColorHex;
}

export interface Prop extends EntityBase {
    type: "furniture" | "decoration" | "obstacle";
    isInteractive?: boolean;
    collider?: boolean;
}

export interface Clue extends EntityBase {
    type: "clue";
    clueType: "fingerprint" | "weapon" | "note" | "blood" | "footprint" | "generic";
    description: string;
    relevance: "high" | "medium" | "low";
}

export interface NPC extends EntityBase {
    type: "npc";
    role: "killer" | "suspect" | "innocent" | "witness";
    traits: string[];
    alibi?: string;
}

// --- Structure ---
export interface Room {
    id: string;
    name: string;
    size: Size;
    position: Vector3; // Relative to Zone
    props: Prop[];
    clues: Clue[];
    walls?: EntityBase[]; // Generated walls
    floor?: EntityBase;   // Generated floor
}

export interface Zone {
    id: string;
    name: string;
    type: "indoor" | "outdoor";
    position: Vector3; // Global position
    size: Size;
    rooms: Room[];
    biome?: string; // e.g., "manor", "garden", "street"
}

export interface Path {
    fromZoneId: string;
    toZoneId: string;
    type: "hallway" | "road" | "door";
    width?: number;
}

export interface SpawnPoints {
    player: Vector3;
    npcs: { id: string; position: Vector3 }[];
}

export interface WorldMetadata {
    theme: string;
    tone: "dark" | "spooky" | "neutral" | "warm";
    weather?: "clear" | "rain" | "fog";
    timeOfDay?: "day" | "night" | "sunset";
}

// --- Root ---
export interface World {
    metadata: WorldMetadata;
    size: Size; // Total world bounds
    zones: Zone[];
    paths: Path[];
    spawnPoints: SpawnPoints;
}
