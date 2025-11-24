export class GridSystem {
    constructor(width, depth, cellSize = 1) {
        this.width = width;
        this.depth = depth;
        this.cellSize = cellSize;
        this.grid = new Map(); // Key: "x,z", Value: Entity[]
    }

    /**
     * Converts world coordinates to grid coordinates.
     */
    toGrid(x, z) {
        return {
            x: Math.floor(x / this.cellSize),
            z: Math.floor(z / this.cellSize)
        };
    }

    /**
     * Converts grid coordinates to world coordinates (center of tile).
     */
    toWorld(gridX, gridZ) {
        return {
            x: (gridX * this.cellSize) + (this.cellSize / 2),
            z: (gridZ * this.cellSize) + (this.cellSize / 2)
        };
    }

    /**
     * Marks a cell as occupied by an entity.
     */
    addEntity(entity) {
        const { x, z } = this.toGrid(entity.x, entity.z);
        const key = `${x},${z}`;

        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(entity);
    }

    /**
     * Checks if a cell is occupied by a collider.
     */
    isBlocked(gridX, gridZ) {
        const key = `${gridX},${gridZ}`;
        const entities = this.grid.get(key);
        if (!entities) return false;

        return entities.some(e => e.collider);
    }

    /**
     * Returns all entities at a specific grid location.
     */
    getEntitiesAt(gridX, gridZ) {
        return this.grid.get(`${gridX},${gridZ}`) || [];
    }
}
