import React from 'react';
import { IsoObject } from './IsoObject';
import { getAsset } from '../data/AssetRegistry';
import { normalizeName } from './assetMapper';

export function IsoRenderer({ sceneGraph, onInteract }) {
    if (!sceneGraph) return null;

    // Centering: compute offsets so map is centered around origin
    const allNodes = [
      ...sceneGraph.layers.background.nodes,
      ...sceneGraph.layers.terrain.nodes,
      ...sceneGraph.layers.structure.nodes,
      ...sceneGraph.layers.objects.nodes,
      ...sceneGraph.layers.text.nodes
    ].filter(Boolean);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    allNodes.forEach(n => {
      const gx = n.gridPosition?.x ?? 0;
      const gy = n.gridPosition?.y ?? 0;
      minX = Math.min(minX, gx);
      maxX = Math.max(maxX, gx);
      minY = Math.min(minY, gy);
      maxY = Math.max(maxY, gy);
    });
    if (!isFinite(minX)) { minX = maxX = minY = maxY = 0; }
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const renderLayer = (layer) => {
        if (!layer?.visible) return null;
        return layer.nodes.map(node => {
            // normalize the node name and lookup an asset
            const normalized = normalizeName(node.name || node.label || node.type || "");
            const asset = getAsset(normalized); // returns default asset when not found

            // compute world x,z and center it so the map sits near origin
            const worldX = (node.gridPosition?.x ?? 0) - centerX;
            const worldZ = (node.gridPosition?.y ?? 0) - centerY;

            return (
                <IsoObject
                    key={node.id}
                    entity={{
                        ...node,
                        x: worldX,
                        z: worldZ, // Map grid Y to 3D Z
                        rotation: node.metadata?.original?.transform?.rotation || 0,
                        asset // attach resolved asset here
                    }}
                    onClick={onInteract}
                />
            );
        });
    };

    return (
        <group>
            {renderLayer(sceneGraph.layers.background)}
            {renderLayer(sceneGraph.layers.terrain)}
            {renderLayer(sceneGraph.layers.structure)}
            {renderLayer(sceneGraph.layers.objects)}
            {renderLayer(sceneGraph.layers.text)}
            {/* debug helpers while tuning */}
            <gridHelper args={[200, 40]} />
            <axesHelper args={[5]} />
        </group>
    );
}