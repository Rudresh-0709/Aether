import { OrbitControls } from "@react-three/drei";

export function IsoCamera() {
    return (
        <>
            <OrbitControls makeDefault />
            <perspectiveCamera 
                makeDefault
                position={[10, 10, 10]}
                fov={45}
            />
        </>
    );
}
