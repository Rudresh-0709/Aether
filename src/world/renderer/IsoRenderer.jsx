import React from 'react';
import { IsoObject } from './IsoObject';

export function IsoRenderer({ sceneGraph, onInteract }) {
    if (!sceneGraph) return null;

    const renderLayer = (layer) => {
        if (!layer.visible) return null;
        return layer.nodes.map(node => (
            <IsoObject
                key={node.id}
                entity={{
                    ...node,
                    x: node.gridPosition.x,
                    z: node.gridPosition.y, // Map grid Y to 3D Z
                    rotation: node.metadata?.original?.transform?.rotation || 0
                }}
                onClick={onInteract}
            />
        ));
    };

    return (
        <group>
            {/* Render Layers in Order */}
            {renderLayer(sceneGraph.layers.background)}
            {renderLayer(sceneGraph.layers.terrain)}
            {renderLayer(sceneGraph.layers.structure)}
            {renderLayer(sceneGraph.layers.objects)}
            {renderLayer(sceneGraph.layers.text)}

            {/* Ground Plane (Debug) - Optional, maybe remove if background layer covers it */}
            {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#222" />
            </mesh> */}
        </group>
    );
}
