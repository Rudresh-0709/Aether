import { GridSystem } from './GridSystem';
import { NavMeshGenerator } from './NavMeshGenerator';
import { getAsset } from '../data/AssetRegistry';

export class SceneAssembler {
    constructor() {
        this.gridSystem = null;
        this.navMesh = null;
        this.entities = [];
    }

    /**
     * Assembles the world from the validated WorldData.
     * @param {object} worldData - The validated world data from WorldParser.
     */
    assemble(worldData) {
        console.log("SceneAssembler: Building world...", worldData);

        // 1. Initialize Grid
        this.gridSystem = new GridSystem(worldData.width, worldData.depth);

        // 2. Flatten and Instantiate Entities
        this.entities = this._instantiateEntities(worldData);

        // 3. Populate Grid
        this.entities.forEach(entity => {
            this.gridSystem.addEntity(entity);
        });

        // 4. Build NavMesh
        this.navMesh = new NavMeshGenerator(this.gridSystem);
        this.navMesh.build();

        return {
            grid: this.gridSystem,
            navMesh: this.navMesh,
            entities: this.entities
        };
    }

    _instantiateEntities(worldData) {
        const instances = [];

        // Helper to add instance
        const add = (data, type, assetName) => {
            const asset = getAsset(assetName || data.name);
            instances.push({
                ...data,
                asset, // Hydrated asset data (sprite, size, etc.)
                collider: asset.collider
            });
        };

        worldData.zones.forEach(zone => {
            zone.rooms.forEach(room => {
                // Furniture
                room.furniture.forEach(item => {
                    add({
                        id: item.id,
                        x: zone.x + room.x + item.x,
                        z: zone.z + room.z + item.z,
                        rotation: item.rotation,
                        name: item.name
                    }, "furniture");
                });

                // Clues
                room.clues.forEach(clue => {
                    add({
                        id: clue.id,
                        x: zone.x + room.x + clue.x,
                        z: zone.z + room.z + clue.z,
                        name: clue.type, // Use type as key for registry
                        description: clue.description
                    }, "clue");
                });
            });
        });

        return instances;
    }
}
