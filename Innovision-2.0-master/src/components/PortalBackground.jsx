import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const DigitalGrid = () => {
    return (
        <group>
            {/* Main Floor Grid */}
            <gridHelper
                args={[60, 60, 0x06b6d4, 0x111827]}
                position={[0, -2, 0]}
            />

            {/* Ceiling Grid (Faint) */}
            <gridHelper
                args={[60, 60, 0x06b6d4, 0x111827]}
                position={[0, 10, 0]}
                rotation={[0, 0, 0]}
            />
        </group>
    );
};



const FloatingDataPoints = () => {
    // Simulated "Data Packets" moving vertically
    const packetRef = useRef();
    useFrame((state) => {
        // Simple animation placeholder
    });

    return (
        <group>
            {/* Placeholder for particles if needed, keeping it clean for now */}
        </group>
    )
}

const PortalBackground = () => {
    return (
        <div className="absolute inset-0 z-0 bg-void-black">
            {/* 3D Canvas Removed by User Request */}

            {/* Vignette Overlay for Screen Look */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)] pointer-events-none opacity-80" />

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
        </div>
    );
};

export default PortalBackground;
