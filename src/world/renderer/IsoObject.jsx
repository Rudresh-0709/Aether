import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Billboard, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Helper component that loads and renders a GLTF safely
function ModelRenderer({ modelPath, targetSize = { width: 1, depth: 1, height: 1 } }) {
    const groupRef = useRef();
    const { scene } = useGLTF(modelPath);

    // Clone the scene so we can modify it without affecting the cache
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useEffect(() => {
        if (!clonedScene || !groupRef.current) return;

        // Reset transforms on the clone to ensure clean state
        clonedScene.position.set(0, 0, 0);
        clonedScene.scale.set(1, 1, 1);
        clonedScene.rotation.set(0, 0, 0);

        // compute bounding box and auto scale to fit targetSize
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        box.getSize(size);

        const maxDim = Math.max(size.x, size.y, size.z, 0.0001);
        const targetMax = Math.max(targetSize.width, targetSize.height, targetSize.depth);
        const scaleFactor = targetMax / maxDim;

        // Apply scale to the scene
        clonedScene.scale.setScalar(scaleFactor);

        // Re-measure after scale to center it
        const box2 = new THREE.Box3().setFromObject(clonedScene);
        const center2 = new THREE.Vector3();
        box2.getCenter(center2);
        const size2 = new THREE.Vector3();
        box2.getSize(size2);

        // Center the model and lift it so it sits on the floor
        clonedScene.position.sub(center2);
        clonedScene.position.y += size2.y * 0.5;

    }, [clonedScene, targetSize]);

    return <primitive ref={groupRef} object={clonedScene} />;
}

export function IsoObject({ entity, onClick }) {
    const { x, z, asset, rotation = 0, gridSize } = entity;
    const size = asset?.size || gridSize || { width: 1, depth: 1, height: 1 };
    const position = [x, size.height / 2, z]; // place at half height so item sits on ground
    const color = asset?.color || entity.color || "#ffffff";

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick?.(entity); }} rotation={[0, rotation, 0]}>
            <Suspense fallback={
                // fallback visible placeholder while GLTF loads
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[size.width, size.height, size.depth]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            }>
                {asset?.modelPath ? (
                    <ModelRenderer modelPath={asset.modelPath} targetSize={size} />
                ) : (
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[size.width, size.height, size.depth]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                )}
            </Suspense>

            <Billboard position={[0, size.height + 0.5, 0]}>
                <Text fontSize={0.25} color="white" outlineWidth={0.02} outlineColor="black">
                    {entity.name}
                </Text>
            </Billboard>
        </group>
    );
}
