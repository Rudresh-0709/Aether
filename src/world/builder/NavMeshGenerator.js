export class NavMeshGenerator {
    constructor(gridSystem) {
        this.gridSystem = gridSystem;
        this.walkableGrid = []; // 2D array: 0 = walkable, 1 = blocked
    }

    /**
     * Scans the GridSystem and builds the walkable grid.
     */
    build() {
        const width = this.gridSystem.width;
        const depth = this.gridSystem.depth;

        this.walkableGrid = Array(depth).fill(0).map(() => Array(width).fill(0));

        for (let z = 0; z < depth; z++) {
            for (let x = 0; x < width; x++) {
                if (this.gridSystem.isBlocked(x, z)) {
                    this.walkableGrid[z][x] = 1;
                }
            }
        }

        console.log("NavMesh Built:", this.walkableGrid);
        return this.walkableGrid;
    }

    /**
     * Simple A* Pathfinding (Placeholder for now).
     * Returns a list of grid coordinates {x, z}.
     */
    findPath(startX, startZ, endX, endZ) {
        // TODO: Implement A* algorithm
        // For now, return direct line if unblocked, or empty if blocked
        if (this.walkableGrid[endZ] && this.walkableGrid[endZ][endX] === 1) {
            return []; // Destination blocked
        }
        return [{ x: endX, z: endZ }];
    }
}
