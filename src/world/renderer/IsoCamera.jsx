import React, { useEffect } from 'react';
import { OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export function IsoCamera({ zoom = 40 }) {
    const { set } = useThree();

    useEffect(() => {
        // Isometric Angle: 
        // Rotate X by 35.264 degrees (Math.atan(1 / Math.sqrt(2)))
        // Rotate Y by 45 degrees
        // But in React Three Fiber/Three.js, we can just position it isometrically.
    }, []);

    return (
        <OrthographicCamera
            makeDefault
            position={[20, 20, 20]} // High up and offset
            rotation={[-Math.atan(1 / Math.sqrt(2)), Math.PI / 4, 0]} // True Isometric Rotation
            zoom={zoom}
            near={-100}
            far={100}
        />
    );
}
