export const TILE_SIZE = 32;
export const ISO_SCALE = 1;

/**
 * Converts 2D grid coordinates to isometric screen coordinates.
 * @param x Grid X position
 * @param y Grid Y position
 * @param z Height/Elevation (optional, defaults to 0)
 * @returns {x, y} Isometric screen coordinates
 */
export function toIso(x: number, y: number, z: number = 0): { x: number; y: number } {
    const isoX = (x - y) * TILE_SIZE * ISO_SCALE;
    const isoY = (x + y) * TILE_SIZE * 0.5 * ISO_SCALE - z * TILE_SIZE;
    return { x: isoX, y: isoY };
}

/**
 * Converts isometric screen coordinates back to 2D grid coordinates.
 * Note: This ignores the Z component (height), assuming Z=0 (flat plane).
 * @param isoX Isometric Screen X
 * @param isoY Isometric Screen Y
 * @returns {x, y} Grid coordinates
 */
export function fromIso(isoX: number, isoY: number): { x: number; y: number } {
    const y = (isoY / (0.5 * TILE_SIZE * ISO_SCALE) - isoX / (TILE_SIZE * ISO_SCALE)) / 2;
    const x = (isoY / (0.5 * TILE_SIZE * ISO_SCALE) + isoX / (TILE_SIZE * ISO_SCALE)) / 2;
    return { x, y };
}

/**
 * Snaps a value to the nearest grid increment.
 * @param value The value to snap
 * @param gridSize The grid size (defaults to TILE_SIZE)
 * @returns Snapped value
 */
export function snapToGrid(value: number, gridSize: number = TILE_SIZE): number {
    return Math.round(value / gridSize) * gridSize;
}

/**
 * Normalizes world units to grid units.
 * @param value World unit value
 * @returns Grid unit value (integer)
 */
export function toGridUnits(value: number): number {
    return Math.ceil(value / TILE_SIZE);
}
