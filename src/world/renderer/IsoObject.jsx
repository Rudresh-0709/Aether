import React, { useMemo } from 'react';
import { Billboard, Text } from '@react-three/drei';

export function IsoObject({ entity, onClick }) {
    const { x, z, asset, rotation } = entity;

    // Visual Position (Center of tile)
    // In our GridSystem, x/z are already world coordinates (center of tile)
    // But we might need to adjust Y based on height/layering.
    const position = [x, asset.size.height / 2, z];

    // Color fallback
    const color = asset.color || "#ffffff";

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick(entity); }}>
            {/* Placeholder Mesh - Replace with Sprite later */}
            <mesh castShadow receiveShadow rotation={[0, rotation || 0, 0]}>
                <boxGeometry args={[asset.size.width, asset.size.height, asset.size.depth]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Debug Label */}
            <Billboard position={[0, 1, 0]}>
                <Text fontSize={0.3} color="white" outlineWidth={0.02} outlineColor="black">
                    {entity.name}
                </Text>
            </Billboard>
        </group>
    );
}
