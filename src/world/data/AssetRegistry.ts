import { Size } from '../types/world';

export interface Asset {
    type: string;
    sprite: string;
    modelPath?: string;
    size: Size;
    collider: boolean;
    color: string;
}

export const ASSET_REGISTRY: Record<string, Asset> = {
    // Furniture
    "desk": {
        type: "furniture",
        sprite: "desk_v1",
        modelPath: "/models/tabledesk.glb",
        size: { width: 2, depth: 1, height: 1 },
        collider: true,
        color: "#8B4513"
    },
    "chair": {
        type: "furniture",
        sprite: "chair_v1",
        modelPath: "/models/chair.glb",
        size: { width: 1, depth: 1, height: 1 },
        collider: true,
        color: "#5D4037"
    },
    "bookshelf": {
        type: "furniture",
        sprite: "bookshelf_v1",
        modelPath: "/models/bookshelf.glb",
        size: { width: 1, depth: 0.5, height: 2 },
        collider: true,
        color: "#5D4037"
    },
    "cabinet": {
        type: "furniture",
        sprite: "cabinet_v1",
        modelPath: "/models/cabinet.glb",
        size: { width: 1, depth: 1, height: 2 },
        collider: true,
        color: "#4A3B2C"
    },
    "bed": {
        type: "furniture",
        sprite: "bed_v1",
        modelPath: "/models/bed.glb",
        size: { width: 2, depth: 2, height: 1 },
        collider: true,
        color: "#333333"
    },
    "lamp": {
        type: "furniture",
        sprite: "lamp_v1",
        modelPath: "/models/lamp.glb",
        size: { width: 0.5, depth: 0.5, height: 1.5 },
        collider: true,
        color: "#FFD700"
    },
    "sofa": {
        type: "furniture",
        sprite: "sofa_v1",
        modelPath: "/models/lounge_sofa.glb",
        size: { width: 2, depth: 1, height: 1 },
        collider: true,
        color: "#550000"
    },
    "rug": {
        type: "furniture",
        sprite: "rug_v1",
        modelPath: "/models/rug.glb",
        size: { width: 2, depth: 2, height: 0.1 },
        collider: false,
        color: "#660000"
    },

    // Clues
    "magnifying_glass": {
        type: "clue",
        sprite: "magnifying_glass",
        modelPath: "/models/magnifying_glass.glb",
        size: { width: 0.5, depth: 0.5, height: 0.1 },
        collider: false,
        color: "#C0C0C0"
    },
    "bottle": {
        type: "clue",
        sprite: "bottle",
        modelPath: "/models/old_bottle.glb",
        size: { width: 0.3, depth: 0.3, height: 0.5 },
        collider: false,
        color: "#00FF00"
    },
    "weapon": {
        type: "clue",
        sprite: "weapon",
        modelPath: "/models/revolver.glb",
        size: { width: 0.5, depth: 0.5, height: 0.2 },
        collider: false,
        color: "#333333"
    },

    // Fallback
    "default": {
        type: "unknown",
        sprite: "error_cube",
        size: { width: 1, depth: 1, height: 1 },
        collider: true,
        color: "#FF00FF"
    }
};

export const getAsset = (name: string): Asset => {
    if (!name) return ASSET_REGISTRY["default"];
    const key = name.toString().toLowerCase();
    return ASSET_REGISTRY[key] || ASSET_REGISTRY["default"];
};

