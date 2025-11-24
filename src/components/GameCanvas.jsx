import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { IsoCamera } from '../world/renderer/IsoCamera';
import { IsoRenderer } from '../world/renderer/IsoRenderer';
import { useGenerativeMystery } from '../hooks/useGenerativeMystery';

export default function GameCanvas({ onInteract, onLoadComplete }) {
    const { worldData, sceneData, loading, error } = useGenerativeMystery();

    useEffect(() => {
        if (worldData && sceneData) {
            onLoadComplete({ mystery: worldData.mystery, ...sceneData });
        }
    }, [worldData, sceneData, onLoadComplete]);

    if (loading) {
        return <div className="text-arcane-gold text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-serif tracking-widest animate-pulse">CONSTRUCTING REALITY...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold">ERROR: {error.message}</div>;
    }

    return (
        <Canvas shadows className="bg-arcane-bg">
            <IsoCamera />

            {/* Lighting */}
            {/* <ambientLight intensity={0.4} color="#2a1a35" /> */}
            <pointLight position={[10, 20, 10]} intensity={0.8} color="#c8aa6e" castShadow />
            <pointLight position={[-10, 10, -10]} intensity={0.5} color="#0AC8B9" />
            <ambientLight intensity={1} />
            <directionalLight
                position={[20, 50, 20]}
                intensity={2}
                castShadow
            />

            <Suspense fallback={null}>
                <group position={[0, 0, 0]}>
                    {sceneData && (
                        <IsoRenderer
                            sceneGraph={sceneData}
                            onInteract={onInteract}
                        />
                    )}
                </group>
            </Suspense>
        </Canvas>
    );
}
