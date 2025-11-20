import { Size, WorldMetadata } from '../types/world';

export const DEFAULT_WORLD_SIZE: Size = { width: 100, depth: 100, height: 20 };

export const DEFAULT_METADATA: WorldMetadata = {
    theme: "noir",
    tone: "dark",
    weather: "fog",
    timeOfDay: "night"
};

export const SPACING_RULES = {
    worldPadding: 5,
    zonePadding: 2,
    roomPadding: 1,
    defaultTileSize: 1,
    isoScale: 40 // Camera zoom level
};

export const DEFAULT_COLORS = {
    wall: "#2c3e50",
    floor: "#34495e",
    prop: "#7f8c8d",
    clue: "#e74c3c",
    npc: "#f1c40f",
    player: "#3498db"
};

export const DEFAULT_PREFABS = {
    wall: "wall_basic",
    floor: "floor_basic",
    prop: "crate_generic",
    clue: "marker_clue"
};

export const LIMITS = {
    maxWorldSize: 200,
    maxZones: 10,
    maxRoomsPerZone: 20,
    maxPropsPerRoom: 50
};
