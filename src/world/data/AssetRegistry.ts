import { Size } from '../types/world';

export interface Asset {
    type: string;
    sprite: string;
    size: Size;
    collider: boolean;
    color: string;
}

export const ASSET_REGISTRY: Record<string, Asset> = {
    // Furniture
    "victorian_desk": {
        type: "furniture",
        sprite: "desk_v1", // Placeholder for sprite key
        size: { width: 2, depth: 1, height: 1 },
        collider: true,
        color: "#8B4513"
    },
    "bookshelf": {
        type: "furniture",
        sprite: "bookshelf_v1",
        size: { width: 1, depth: 0.5, height: 2 },
        collider: true,
        color: "#5D4037"
    },
    "armchair": {
        type: "furniture",
        sprite: "armchair_velvet",
        size: { width: 1, depth: 1, height: 1 },
        collider: true,
        color: "#4A0404"
    },
    "generic_box": {
        type: "furniture",
        sprite: "crate",
        size: { width: 1, depth: 1, height: 1 },
        collider: true,
        color: "#888888"
    },

    // Clues
    "blood_stain": {
        type: "clue",
        sprite: "blood_splatter",
        size: { width: 1, depth: 1, height: 0.01 },
        collider: false,
        color: "#FF0000"
    },
    "weapon_knife": {
        type: "clue",
        sprite: "knife",
        size: { width: 0.5, depth: 0.5, height: 0.1 },
        collider: false,
        color: "#C0C0C0"
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
    return ASSET_REGISTRY[name] || ASSET_REGISTRY["default"];
};
