import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function WorldBuilder({ data, onInteract }) {
    if (!data || !data.room) return null;

    return (
        <group>
            {/* Walls */}
            {data.room.walls.map((wall, idx) => (
                <mesh key={`wall-${idx}`} position={[wall.x, wall.height / 2, wall.z]} castShadow receiveShadow>
                    <boxGeometry args={[wall.width, wall.height, wall.depth]} />
                    <meshStandardMaterial color="#2a1a35" roughness={0.8} />
                </mesh>
            ))}

            {/* Furniture */}
            {data.room.furniture.map((item) => (
                <mesh key={item.id} position={[item.x, item.height / 2, item.z]} castShadow receiveShadow>
                    <boxGeometry args={[item.width, item.height, item.depth]} />
                    <meshStandardMaterial color={item.color} />
                </mesh>
            ))}

            {/* NPCs */}
            {data.npcs.map((npc) => (
                <BillboardChar key={npc.id} npc={npc} onClick={() => onInteract(npc)} />
            ))}
        </group>
    );
}

function BillboardChar({ npc, onClick }) {
    // In a real app, we'd use useLoader(TextureLoader, npc.spriteUrl)
    // But since our placeholder is a data URI, we can use it directly or just a colored box for now if texture loading fails
    // For stability with data URIs in R3F, simple mesh is safer for this prototype

    return (
        <mesh
            position={[npc.x, 1, npc.z]}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
        >
            <boxGeometry args={[0.5, 2, 0.5]} />
            <meshStandardMaterial color={npc.color} emissive={npc.color} emissiveIntensity={0.5} />
            {/* 
                To implement actual sprites later:
                <sprite>
                    <spriteMaterial map={texture} />
                </sprite>
            */}
        </mesh>
    );
}
