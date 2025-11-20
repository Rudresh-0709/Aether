import { Vector3, Size, ColorHex } from './types/world';

export interface SceneNode {
    id: string;
    type: string; // "zone", "room", "prop", "wall", "floor", "text"
    name: string;

    // Grid Coordinates
    gridPosition: Vector3;
    gridSize: Size;

    // Isometric Coordinates (Computed)
    isoPosition: { x: number; y: number };
    zIndex: number; // For sorting

    // Visuals
    color: ColorHex;
    visible: boolean;

    // Hierarchy
    children: SceneNode[];
    parentId?: string;

    // Metadata
    tags?: string[];
    metadata?: Record<string, any>;
    asset?: any; // Hydrated asset data
}

export interface SceneLayer {
    id: string;
    name: string;
    nodes: SceneNode[];
    zIndex: number;
    visible: boolean;
}

export interface SceneGraph {
    width: number; // In pixels (approx)
    height: number; // In pixels (approx)

    layers: {
        background: SceneLayer;
        terrain: SceneLayer; // Zones/Ground
        structure: SceneLayer; // Rooms/Walls/Floors
        objects: SceneLayer; // Props/Items
        text: SceneLayer; // Labels/Debug info
    };

    // Lookup for quick access
    nodeMap: Map<string, SceneNode>;
}

export function createSceneGraph(): SceneGraph {
    return {
        width: 0,
        height: 0,
        layers: {
            background: { id: 'layer_bg', name: 'Background', nodes: [], zIndex: 0, visible: true },
            terrain: { id: 'layer_terrain', name: 'Terrain', nodes: [], zIndex: 10, visible: true },
            structure: { id: 'layer_struct', name: 'Structure', nodes: [], zIndex: 20, visible: true },
            objects: { id: 'layer_obj', name: 'Objects', nodes: [], zIndex: 30, visible: true },
            text: { id: 'layer_text', name: 'Text', nodes: [], zIndex: 100, visible: true }
        },
        nodeMap: new Map()
    };
}
