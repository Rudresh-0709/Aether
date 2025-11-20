import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export default function Player() {
    const ref = useRef();
    const speed = 5;
    const keys = useRef({});

    // Input Handling
    React.useEffect(() => {
        const handleKeyDown = (e) => keys.current[e.code] = true;
        const handleKeyUp = (e) => keys.current[e.code] = false;
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Movement Loop
    useFrame((state, delta) => {
        if (!ref.current) return;

        const move = new Vector3(0, 0, 0);
        if (keys.current['KeyW'] || keys.current['ArrowUp']) move.z -= 1;
        if (keys.current['KeyS'] || keys.current['ArrowDown']) move.z += 1;
        if (keys.current['KeyA'] || keys.current['ArrowLeft']) move.x -= 1;
        if (keys.current['KeyD'] || keys.current['ArrowRight']) move.x += 1;

        if (move.length() > 0) {
            move.normalize().multiplyScalar(speed * delta);
            ref.current.position.add(move);
        }
    });

    return (
        <mesh ref={ref} position={[0, 1, 2]} castShadow>
            <boxGeometry args={[0.5, 2, 0.5]} />
            <meshStandardMaterial color="#0AC8B9" emissive="#0AC8B9" emissiveIntensity={0.8} />
        </mesh>
    );
}
