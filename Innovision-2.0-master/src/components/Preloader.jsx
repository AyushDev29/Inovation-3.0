import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
    const [counter, setCounter] = useState(0);
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 20);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (counter === 100) {
            const tl = gsap.timeline({
                onComplete: onComplete
            });

            tl.to(textRef.current, {
                opacity: 0,
                y: -50,
                duration: 0.5,
                ease: 'power2.in'
            })
                .to(containerRef.current, {
                    y: '-100%',
                    duration: 1,
                    ease: 'power4.inOut'
                });
        }
    }, [counter, onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[99999] bg-void-black flex items-center justify-center"
        >
            <div ref={textRef} className="text-center">
                <h1 className="text-6xl md:text-9xl font-orbitron font-bold text-white mb-4">
                    {counter}%
                </h1>
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                    <div
                        className="h-full bg-neon-purple transition-all duration-75 ease-out"
                        style={{ width: `${counter}%` }}
                    />
                </div>
                <p className="mt-4 text-cyber-blue tracking-widest text-sm uppercase animate-pulse">
                    Opening the Innovision Portal ....
                </p>
            </div>
        </div>
    );
};

export default Preloader;
