import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import WorldBuilder from './WorldBuilder';
import Player from './Player';
import { useGenerativeMystery } from '../hooks/useGenerativeMystery';

export default function GameCanvas({ onInteract, onLoadComplete }) {
    const { worldData, loading, error } = useGenerativeMystery();

    useEffect(() => {
        if (worldData) {
            onLoadComplete(worldData);
        }
    }, [worldData, onLoadComplete]);

    if (loading) {
        return <div className="text-arcane-gold text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Generating Mystery...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Error: {error.message}</div>;
    }

    return (
        <Canvas shadows className="bg-arcane-bg">
            {/* Isometric Camera */}
            <OrthographicCamera makeDefault position={[20, 20, 20]} zoom={40} near={-50} far={200} />
            <OrbitControls enableZoom={true} enableRotate={false} />

            {/* Lighting - Paper Noir Style */}
            <ambientLight intensity={0.3} color="#2a1a35" />
            <pointLight position={[10, 10, 10]} intensity={1} color="#c8aa6e" castShadow />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#0AC8B9" />

            {/* Game World */}
            <Suspense fallback={null}>
                <group position={[0, -1, 0]}>
                    <WorldBuilder data={worldData} onInteract={onInteract} />
                    <Player />
                </group>
            </Suspense>

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#151720" />
            </mesh>
        </Canvas>
    );
}
