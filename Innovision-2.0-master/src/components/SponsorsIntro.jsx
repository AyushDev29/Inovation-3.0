import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Real sponsor data - Updated with actual sponsors and links
const sponsorsData = [
    {
        id: 1,
        name: "Pretty Moon",
        logo: "/images/sponsors/prettymoon.jpg",
        handle: "@prettymoon_official",
        platform: "Instagram",
        url: "https://www.instagram.com/prettymoon.in?igsh=MTg5MHg4ZjU0dW92NA=="
    },
    {
        id: 2,
        name: "Kalastra", 
        logo: "/images/sponsors/kala_stra.jpg",
        handle: "@kalastra_official",
        platform: "Instagram",
        url: "https://www.instagram.com/kala_stra?igsh=MTdsZG1oMGMxMHBjaw=="
    },
    {
        id: 3,
        name: "Kaam Done",
        logo: "/images/sponsors/kaam.done.jpg",
        handle: "@kaamdone_official",
        platform: "Instagram",
        url: "https://www.instagram.com/kaam.done?igsh=Z2xxa2RoazNoenRn"
    },
    {
        id: 4,
        name: "Oriflame",
        logo: "/images/sponsors/oriflame.png",
        handle: "@oriflame_india",
        platform: "Website",
        url: "https://www.oriflame.com/"
    },
    {
        id: 5,
        name: "SB Gaming Cafe",
        logo: "/images/sponsors/SB-Gaming-Cafe..jpg",
        handle: "@sbgaming._",
        platform: "Instagram",
        url: "https://www.instagram.com/sbgaming._?igsh=cDY1cDlxNXFyMjR1"
    }
];

const SponsorsIntro = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Ensure cards are visible by default
            gsap.set(".sponsor-card", { opacity: 1, y: 0 });
            
            // Title animation with reverse
            gsap.fromTo(".sponsors-title", 
                { opacity: 0, y: 50, scale: 0.9 },
                {
                    scrollTrigger: {
                        trigger: ".sponsors-title",
                        start: "top 85%",
                        toggleActions: "play reverse play reverse"
                    },
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );

            // Sponsor cards animation - complete when user reaches 30% visibility
            gsap.fromTo(".sponsor-card", 
                { opacity: 0, y: 60 },
                {
                    scrollTrigger: {
                        trigger: ".sponsors-grid",
                        start: "top 85%", // Start animation early
                        end: "top 70%",   // Complete at 30% visibility (70% from top = 30% visible)
                        scrub: 1,         // Smooth scrub animation
                    },
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,    // Faster stagger for scrub animation
                    ease: "power2.out"
                }
            );

            // View all button animation - complete at 10% visibility
            gsap.fromTo(".view-all-btn",
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: ".view-all-btn",
                        start: "top 95%", // Start early
                        end: "top 90%",   // Complete at 10% visibility (90% from top = 10% visible)
                        scrub: 1,         // Smooth scrub animation
                    },
                    opacity: 1,
                    y: 0,
                    ease: "power2.out"
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative py-16 md:py-20 px-4 md:px-10 bg-void-black">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] right-[-5%] w-[300px] h-[300px] bg-cyber-blue/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-neon-purple/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto relative z-10">
                {/* Section Title */}
                <div className="text-center mb-12 md:mb-16 sponsors-title">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Star className="text-cyber-blue" size={20} />
                        <h2 className="text-cyber-blue tracking-[0.3em] text-sm font-bold uppercase">
                            Powered By Excellence
                        </h2>
                        <Star className="text-cyber-blue" size={20} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyber-blue">Sponsors</span>
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
                        Meet the visionary partners who make Innovision 3.0 possible. Together, we're shaping the future of technology and innovation.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent mx-auto mt-6"></div>
                </div>

                {/* Sponsors Grid */}
                <div className="sponsors-grid mb-12">
                    {/* 5 sponsors with better responsive layout */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {sponsorsData.map((sponsor, index) => (
                            <div 
                                key={sponsor.id}
                                className={`sponsor-card group relative p-4 md:p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-cyber-blue/50 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                                    index === 4 ? 'col-span-2 md:col-span-3 lg:col-span-1 max-w-[200px] md:max-w-[250px] lg:max-w-none mx-auto lg:mx-0' : ''
                                }`}
                                onClick={() => window.open(sponsor.url, '_blank')}
                            >
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/20 to-neon-purple/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                                
                                <div className="relative z-10 text-center">
                                    <div className="mb-4 flex items-center justify-center h-20 bg-gray-800/30 rounded-lg border border-gray-700/50 p-3">
                                        <img 
                                            src={sponsor.logo} 
                                            alt={`${sponsor.name} logo`}
                                            className="max-h-full max-w-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                                            onError={(e) => {
                                                // Show sponsor name if logo fails to load
                                                e.target.style.display = 'none';
                                                e.target.nextElementSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden items-center justify-center text-white font-orbitron font-bold text-sm">
                                            {sponsor.name}
                                        </div>
                                    </div>
                                    <h4 className="text-white font-orbitron font-semibold text-sm mb-1 group-hover:text-cyber-blue transition-colors">
                                        {sponsor.name}
                                    </h4>
                                    <div className="text-xs text-gray-400 group-hover:text-neon-purple transition-colors font-medium">
                                        {sponsor.handle}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {sponsor.platform}
                                    </div>
                                </div>

                                {/* Corner decorations */}
                                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyber-blue/30 group-hover:border-cyber-blue transition-colors"></div>
                                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyber-blue/30 group-hover:border-cyber-blue transition-colors"></div>
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-cyber-blue/30 group-hover:border-cyber-blue transition-colors"></div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyber-blue/30 group-hover:border-cyber-blue transition-colors"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All Button */}
                <div className="text-center view-all-btn">
                    <a 
                        href="/sponsors"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyber-blue/20 to-neon-purple/20 border border-cyber-blue/50 hover:border-cyber-blue hover:from-cyber-blue/30 hover:to-neon-purple/30 text-white font-orbitron font-semibold rounded-xl transition-all duration-300 group hover:scale-105"
                    >
                        <span>Explore All sponsors</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default SponsorsIntro;