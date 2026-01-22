import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PortalBackground from './PortalBackground';
import './mobile.css';

gsap.registerPlugin(ScrollTrigger);

// Enhanced HUDBox with Hover & Touch Effects
const HUDBox = ({ title, value, subtext, delay }) => {
    return (
        <div className={`relative p-6 border border-cyber-blue/30 bg-void-black/50 backdrop-blur-sm rounded-sm animate-fade-in-up hover:scale-105 hover:border-cyber-blue hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-105 active:border-cyber-blue active:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 group cursor-default`} style={{ animationDelay: `${delay}ms` }}>
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-blue group-hover:w-full group-hover:h-full group-active:w-full group-active:h-full transition-all duration-500 opacity-50"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-blue"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-blue"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-blue"></div>

            <h3 className="text-cyber-blue font-mono text-xs tracking-widest mb-2 opacity-70 group-hover:opacity-100 group-active:opacity-100 transition-opacity">{title}</h3>
            <div className="text-3xl font-orbitron font-bold text-white mb-1 group-hover:text-cyber-blue group-active:text-cyber-blue group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] group-active:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)] transition-all">{value}</div>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider group-hover:text-gray-300 group-active:text-gray-300">{subtext}</p>
        </div>
    );
};

const Hero = () => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        // Clock
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        // Context for GSAP
        const ctx = gsap.context(() => {
            // Initial Reveal
            gsap.fromTo(titleRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out", delay: 0.1 }
            );

            // Scroll Parallax/Fade Effect
            gsap.to(".hero-content", {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                },
                y: 100,
                opacity: 0,
                scale: 0.9
            });

            gsap.to(".hud-top-container, .hud-grid", {
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "40% top",
                    scrub: 1
                },
                opacity: 0,
                y: -50
            });

        }, heroRef); // Scoped to the main section

        return () => {
            clearInterval(timer);
            ctx.revert();
        };
    }, []);

    const handleEnter = () => {
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section ref={heroRef} className="hero-section relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-mono">

            {/* Animated Purple/Black Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-void-black via-purple-950/40 to-void-black z-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-cyan-900/10 animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-purple-800/10 to-transparent animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
            </div>

            {/* Purple Glow Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>

            {/* 3D Background */}
            <div className="absolute inset-0 w-full h-full z-0">
                <PortalBackground />
            </div>

            {/* HUD OVERLAY LAYER */}
            <div className="absolute inset-0 z-10 p-4 md:p-10 pointer-events-none flex flex-col justify-between">
                {/* Top HUD */}
                <div className="hud-top-container flex justify-between items-start opacity-80 mt-20 md:mt-24">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 group cursor-pointer pointer-events-auto">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse group-hover:bg-green-400 group-active:bg-green-400 group-hover:shadow-[0_0_10px_#4ade80] group-active:shadow-[0_0_10px_#4ade80]"></div>
                            <span className="hud-label text-green-400 text-xs tracking-widest group-hover:text-green-300 group-active:text-green-300 transition-colors">SYSTEM ONLINE</span>
                        </div>
                        <span className="hud-text-sm text-cyber-blue/50 text-[10px]">V.2.0.4.1</span>
                    </div>
                    <div className="text-right">
                        <span className="hud-label text-cyber-blue text-xs tracking-[0.2em] hover:text-white active:text-white transition-colors cursor-default pointer-events-auto">{currentTime}</span>
                        <div className="w-32 h-[1px] bg-cyber-blue/30 mt-1"></div>
                        <span className="hud-text-sm text-cyber-blue/50 text-[10px]">SERVER: ASIA-SOUTH</span>
                    </div>
                </div>

                {/* Bottom HUD - Decorative Lines */}
                <div className="w-full flex items-end opacity-60">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent w-full"></div>
                </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="hero-content relative z-20 text-center px-4 max-w-5xl w-full pointer-events-auto">

                {/* Main Title */}
                <div className="mb-8 md:mb-12 group cursor-default">
                    {/* College Name & Department - Top */}
                    <div className="mb-4 md:mb-6">
                        <h2 className="text-sm sm:text-base md:text-xl font-orbitron font-bold text-white tracking-[0.1em] sm:tracking-[0.15em] uppercase group-hover:text-cyber-blue group-active:text-cyber-blue transition-all duration-300 leading-tight">
                            K.V. Pendharkar College of Arts, Science & Commerce (Autonomous)
                        </h2>
                        <p className="mt-1 md:mt-2 text-neon-purple tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm md:text-base font-semibold uppercase group-hover:text-cyber-blue group-active:text-cyber-blue transition-colors leading-tight">
                             The Department of Information Technology 
                             <p >Presents</p>
                        </p>
                    </div>

                    {/* INNOVISION Title - Below */}
                    <div className="text-center">
                        <h1 ref={titleRef} className="hero-title text-6xl sm:text-7xl md:text-9xl font-orbitron font-black text-white relative inline-block transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] group-active:drop-shadow-[0_0_25px_rgba(6,182,212,0.6)] leading-tight">
                            INNOVISION
                            <span className="hero-subtitle text-cyber-blue absolute -top-2 -right-2 sm:-top-3 sm:-right-4 md:-top-6 md:-right-16 text-xl sm:text-2xl md:text-5xl group-hover:text-neon-purple group-active:text-neon-purple group-hover:rotate-12 group-active:rotate-12 group-hover:scale-110 group-active:scale-110 transition-all duration-300 origin-bottom-left">3.0</span>
                        </h1>
                    </div>
                </div>

                {/* Data Grid */}
                <div className="hud-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-12">
                    <HUDBox
                        title="EVENT DATES"
                        value="5 - 7 FEB"
                        subtext="Tech Fest 2026"
                        delay="200"
                    />
                    <HUDBox
                        title="VENUE"
                        value="K.V. PENDHARKAR"
                        subtext="College Campus"
                        delay="400"
                    />
                    <HUDBox
                        title="DAILY TIMING"
                        value="9 AM - 2 PM"
                        subtext="All Events Active"
                        delay="600"
                    />
                </div>

                {/* Main CTA */}
                <button
                    onClick={handleEnter}
                    className="cta-button relative px-12 py-4 bg-cyber-blue/10 border border-cyber-blue hover:bg-cyber-blue/20 active:bg-cyber-blue/20 transition-all duration-300 group hover:scale-110 active:scale-95 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyber-blue group-hover:h-[100%] group-active:h-[100%] transition-all duration-300"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-cyber-blue group-hover:h-[100%] group-active:h-[100%] transition-all duration-300"></div>

                    <span className="cta-text font-orbitron font-bold text-white tracking-widest text-lg group-hover:text-cyber-blue group-active:text-cyber-blue transition-colors">
                        DEPLOY REGISTRATION
                    </span>
                </button>

            </div>

        </section>
    );
};

export default Hero;
