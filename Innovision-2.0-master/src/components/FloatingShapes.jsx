import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const WaveLines = () => {
    const linesRef = useRef();

    // Create multiple concentric lines with organic distortion
    const count = 20;
    const radius = 8;

    const lines = useMemo(() => {
        return new Array(count).fill(0).map((_, i) => {
            const y = (i - count / 2) * 0.5;
            const pts = [];
            const segments = 100;
            for (let j = 0; j <= segments; j++) {
                const theta = (j / segments) * Math.PI * 2;
                // Base circle
                let x = Math.cos(theta) * radius;
                let z = Math.sin(theta) * radius;

                // Add noise/distortion
                const noise = Math.sin(theta * 5 + i) * 0.5 + Math.cos(theta * 3 - i) * 0.5;
                const scale = 1 + noise * 0.1 * (i % 3 === 0 ? 1.5 : 0.5); // Vary scale per line

                x *= scale;
                z *= scale;

                pts.push(new THREE.Vector3(x, y, z));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(pts);
            return { geometry, y, speed: (Math.random() * 0.2 + 0.1) * (i % 2 === 0 ? 1 : -1) };
        });
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (linesRef.current) {
            linesRef.current.children.forEach((child, i) => {
                // Rotate each line slowly
                child.rotation.y = time * 0.1 + i * 0.05;
                // Gentle floating wave
                child.position.y = lines[i].y + Math.sin(time * 0.5 + i) * 0.2;
            });
        }
    });

    return (
        <group ref={linesRef} rotation={[0.4, 0, 0]} position={[4, 0, 0]}>
            {lines.map((line, i) => (
                <line key={i} geometry={line.geometry}>
                    <lineBasicMaterial
                        color={new THREE.Color().setHSL(0.7 + i * 0.01, 1, 0.6)}
                        transparent
                        opacity={0.6 - Math.abs(i - count / 2) * 0.04}
                        linewidth={2}
                    />
                </line>
            ))}
        </group>
    );
};

const FloatingShapes = () => {
    return (
        <div className="absolute inset-0 z-0 bg-void-black">
            <Canvas camera={{ position: [0, 0, 15], fov: 40 }}>
                <ambientLight intensity={0.2} />

                <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={0.5} />

                <WaveLines />

                {/* Subtle fog for depth */}
                <fog attach="fog" args={['#0a0a0a', 10, 25]} />
            </Canvas>

            {/* Gradient Overlay for blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-void-black via-transparent to-transparent pointer-events-none" />
        </div>
    );
};

export default FloatingShapes;
