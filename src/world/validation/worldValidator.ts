import { World, Zone, Room, Prop, Clue, Vector3, Size } from '../types/world';
import { DEFAULT_WORLD_SIZE, DEFAULT_METADATA, DEFAULT_COLORS, LIMITS } from '../config/defaultWorldValues';

export class WorldValidator {

    static validateWorld(world: Partial<World>): World {
        const validatedWorld: World = {
            metadata: { ...DEFAULT_METADATA, ...world.metadata },
            size: this.validateSize(world.size, DEFAULT_WORLD_SIZE),
            zones: [],
            paths: world.paths || [],
            spawnPoints: world.spawnPoints || { player: { x: 0, y: 0, z: 0 }, npcs: [] }
        };

        // Validate Zones
        if (world.zones && Array.isArray(world.zones)) {
            validatedWorld.zones = world.zones.map(zone => this.validateZone(zone));
        }

        // Enforce World Limits
        if (validatedWorld.zones.length > LIMITS.maxZones) {
            console.warn(`WorldValidator: Too many zones (${validatedWorld.zones.length}). Truncating to ${LIMITS.maxZones}.`);
            validatedWorld.zones = validatedWorld.zones.slice(0, LIMITS.maxZones);
        }

        return validatedWorld;
    }

    static validateZone(zone: Partial<Zone>): Zone {
        const validatedZone: Zone = {
            id: zone.id || `zone_${Math.random().toString(36).substr(2, 9)}`,
            name: zone.name || "Unknown Zone",
            type: zone.type || "indoor",
            position: this.validateVector3(zone.position),
            size: this.validateSize(zone.size, { width: 10, depth: 10 }),
            rooms: [],
            biome: zone.biome || "generic"
        };

        if (zone.rooms && Array.isArray(zone.rooms)) {
            validatedZone.rooms = zone.rooms.map(room => this.validateRoom(room));
        }

        return validatedZone;
    }

    static validateRoom(room: Partial<Room>): Room {
        const validatedRoom: Room = {
            id: room.id || `room_${Math.random().toString(36).substr(2, 9)}`,
            name: room.name || "Unknown Room",
            size: this.validateSize(room.size, { width: 5, depth: 5 }),
            position: this.validateVector3(room.position),
            props: [],
            clues: []
        };

        // Apply Padding Logic (Auto-spacing if needed)
        // In a real builder, we'd check overlaps here. For data validation, we just ensure valid structures.

        if (room.props && Array.isArray(room.props)) {
            validatedRoom.props = room.props.map(prop => this.validateProp(prop));
        }

        if (room.clues && Array.isArray(room.clues)) {
            validatedRoom.clues = room.clues.map(clue => this.validateClue(clue));
        }

        return validatedRoom;
    }

    static validateProp(prop: Partial<Prop>): Prop {
        return {
            id: prop.id || `prop_${Math.random().toString(36).substr(2, 9)}`,
            name: prop.name || "Unknown Prop",
            type: prop.type || "decoration",
            transform: {
                position: this.validateVector3(prop.transform?.position),
                rotation: prop.transform?.rotation || 0,
                scale: this.validateVector3(prop.transform?.scale, { x: 1, y: 1, z: 1 })
            },
            color: prop.color || DEFAULT_COLORS.prop,
            collider: prop.collider !== undefined ? prop.collider : true
        };
    }

    static validateClue(clue: Partial<Clue>): Clue {
        return {
            id: clue.id || `clue_${Math.random().toString(36).substr(2, 9)}`,
            name: clue.name || "Unknown Clue",
            type: "clue",
            clueType: clue.clueType || "generic",
            description: clue.description || "A mysterious object.",
            relevance: clue.relevance || "medium",
            transform: {
                position: this.validateVector3(clue.transform?.position),
                rotation: clue.transform?.rotation || 0,
                scale: this.validateVector3(clue.transform?.scale, { x: 0.5, y: 0.5, z: 0.5 })
            },
            color: clue.color || DEFAULT_COLORS.clue
        };
    }

    // --- Helpers ---

    static validateVector3(vec?: Partial<Vector3>, defaultVec: Vector3 = { x: 0, y: 0, z: 0 }): Vector3 {
        if (!vec) return defaultVec;
        return {
            x: typeof vec.x === 'number' ? vec.x : defaultVec.x,
            y: typeof vec.y === 'number' ? vec.y : defaultVec.y,
            z: typeof vec.z === 'number' ? vec.z : defaultVec.z
        };
    }

    static validateSize(size?: Partial<Size>, defaultSize: Size = { width: 1, depth: 1, height: 1 }): Size {
        if (!size) return defaultSize;
        return {
            width: Math.max(1, size.width || defaultSize.width),
            depth: Math.max(1, size.depth || defaultSize.depth),
            height: Math.max(1, size.height || defaultSize.height || 1)
        };
    }
}
