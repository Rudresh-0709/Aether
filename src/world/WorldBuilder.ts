import { World, Zone, Room, Vector3, Size } from './types/world';
import { SceneGraph, SceneNode, createSceneGraph } from './SceneGraph';
import { toIso, toGridUnits } from '../utils/iso';
import { PALETTE, getZoneColor, getPropColor } from '../utils/colorPalette';
import { getAsset } from './data/AssetRegistry.ts';

export class WorldBuilder {
    private scene: SceneGraph;
    private world: World;

    // Configuration
    private config = {
        zonePadding: 4, // Grid units
        roomPadding: 2, // Grid units
        propPadding: 1, // Grid units
        defaultZoneSize: { width: 20, depth: 20, height: 1 },
        defaultRoomSize: { width: 8, depth: 8, height: 1 }
    };

    constructor(world: World) {
        this.world = world;
        this.scene = createSceneGraph();
    }

    public build(): SceneGraph {
        console.log("Building world...");

        // 1. Setup Background
        this.buildBackground();

        // 2. Process Zones (Terrain Layer)
        let currentX = 0;
        this.world.zones.forEach(zone => {
            this.buildZone(zone, currentX);
            // Increment X for next zone with padding
            const zoneWidth = Math.max(zone.size.width, this.config.defaultZoneSize.width);
            currentX += toGridUnits(zoneWidth) + this.config.zonePadding;
        });

        return this.scene;
    }

    private buildBackground() {
        // Add a large background plane
        const bgNode: SceneNode = {
            id: 'world_bg',
            type: 'background',
            name: 'World Background',
            gridPosition: { x: 0, y: 0, z: -1 },
            gridSize: { width: 1000, depth: 1000, height: 0 }, // Massive
            isoPosition: { x: 0, y: 0 },
            zIndex: -100,
            color: PALETTE.background,
            visible: true,
            children: []
        };
        this.scene.layers.background.nodes.push(bgNode);
    }

    private buildZone(zone: Zone, startX: number) {
        // Normalize Size
        const width = zone.size.width > 0 ? toGridUnits(zone.size.width) : this.config.defaultZoneSize.width;
        const depth = zone.size.depth > 0 ? toGridUnits(zone.size.depth) : this.config.defaultZoneSize.depth;

        // Position
        const gridPos: Vector3 = { x: startX, y: 0, z: 0 };
        const isoPos = toIso(gridPos.x, gridPos.y, gridPos.z);

        const zoneNode: SceneNode = {
            id: zone.id,
            type: 'zone',
            name: zone.name,
            gridPosition: gridPos,
            gridSize: { width, depth, height: 1 },
            isoPosition: isoPos,
            zIndex: 0,
            color: getZoneColor(zone.type),
            visible: true,
            children: [],
            metadata: { original: zone }
        };

        this.scene.layers.terrain.nodes.push(zoneNode);
        this.scene.nodeMap.set(zoneNode.id, zoneNode);

        // Build Rooms inside Zone
        this.buildRooms(zone, zoneNode);
    }

    private buildRooms(zone: Zone, zoneNode: SceneNode) {
        if (!zone.rooms || zone.rooms.length === 0) return;

        // Simple layout: place rooms in a grid within the zone
        // For now, just sequential placement to avoid overlap
        let currentRoomX = zoneNode.gridPosition.x + this.config.zonePadding;
        let currentRoomY = zoneNode.gridPosition.y + this.config.zonePadding;

        zone.rooms.forEach(room => {
            const width = room.size.width > 0 ? toGridUnits(room.size.width) : this.config.defaultRoomSize.width;
            const depth = room.size.depth > 0 ? toGridUnits(room.size.depth) : this.config.defaultRoomSize.depth;

            // Check if we need to wrap to next row (simple logic)
            if (currentRoomX + width > zoneNode.gridPosition.x + zoneNode.gridSize.width) {
                currentRoomX = zoneNode.gridPosition.x + this.config.zonePadding;
                currentRoomY += depth + this.config.roomPadding;
            }

            const gridPos: Vector3 = { x: currentRoomX, y: currentRoomY, z: 1 }; // Z=1 to sit on top of zone
            const isoPos = toIso(gridPos.x, gridPos.y, gridPos.z);

            const roomNode: SceneNode = {
                id: room.id,
                type: 'room',
                name: room.name,
                gridPosition: gridPos,
                gridSize: { width, depth, height: 1 },
                isoPosition: isoPos,
                zIndex: 10,
                color: PALETTE.room.floor,
                visible: true,
                children: [],
                parentId: zoneNode.id,
                metadata: { original: room }
            };

            this.scene.layers.structure.nodes.push(roomNode);
            this.scene.nodeMap.set(roomNode.id, roomNode);
            zoneNode.children.push(roomNode);

            // Build Props inside Room
            this.buildProps(room, roomNode);

            // Build Clues inside Room
            this.buildClues(room, roomNode);

            // Advance X
            currentRoomX += width + this.config.roomPadding;
        });
    }

    private buildProps(room: Room, roomNode: SceneNode) {
        if (!room.props || room.props.length === 0) return;

        // Place props inside the room
        // Simple logic: Scatter them for now, or use existing relative positions if available
        // If positions are 0,0,0, we auto-place

        let propOffsetX = 1;
        let propOffsetY = 1;

        room.props.forEach(prop => {
            // Determine position
            let relX = prop.transform.position.x;
            let relY = prop.transform.position.y;

            // Auto-layout if missing or zero
            if (relX === 0 && relY === 0) {
                relX = propOffsetX;
                relY = propOffsetY;

                propOffsetX += 2; // Move next prop
                if (propOffsetX >= roomNode.gridSize.width - 1) {
                    propOffsetX = 1;
                    propOffsetY += 2;
                }
            }

            const gridPos: Vector3 = {
                x: roomNode.gridPosition.x + relX,
                y: roomNode.gridPosition.y + relY,
                z: roomNode.gridPosition.z // On floor
            };

            const isoPos = toIso(gridPos.x, gridPos.y, gridPos.z);

            const propNode: SceneNode = {
                id: prop.id,
                type: 'prop',
                name: prop.name,
                gridPosition: gridPos,
                gridSize: { width: 1, depth: 1, height: 1 }, // Default prop size
                isoPosition: isoPos,
                zIndex: 20 + relY + relX, // Simple depth sorting
                color: getPropColor(prop.type),
                visible: true,
                children: [],
                parentId: roomNode.id,
                metadata: { original: prop },
                asset: getAsset(prop.type || prop.name) // Hydrate asset
            };

            this.scene.nodeMap.set(propNode.id, propNode);
            roomNode.children.push(propNode);
        });
    }

    private buildClues(room: Room, roomNode: SceneNode) {
        if (!room.clues || room.clues.length === 0) return;

        room.clues.forEach(clue => {
            const relX = clue.transform.position.x;
            const relY = clue.transform.position.y;

            const gridPos: Vector3 = {
                x: roomNode.gridPosition.x + relX,
                y: roomNode.gridPosition.y + relY,
                z: roomNode.gridPosition.z
            };

            const isoPos = toIso(gridPos.x, gridPos.y, gridPos.z);

            const clueNode: SceneNode = {
                id: clue.id,
                type: 'clue',
                name: `Clue: ${clue.clueType}`,
                gridPosition: gridPos,
                gridSize: { width: 0.5, depth: 0.5, height: 0.5 },
                isoPosition: isoPos,
                zIndex: 25, // Above props
                color: '#ff0000', // Default clue color
                visible: true,
                children: [],
                parentId: roomNode.id,
                metadata: { original: clue },
                asset: getAsset(clue.clueType) // Lookup by specific clue type
            };

            this.scene.layers.objects.nodes.push(clueNode);
            this.scene.nodeMap.set(clueNode.id, clueNode);
            roomNode.children.push(clueNode);
        });
    }
}
