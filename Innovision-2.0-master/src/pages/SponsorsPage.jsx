import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const SponsorsPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Updated sponsor data with correct Instagram URLs
    const sponsors = [
        {
            id: 1,
            name: "Pretty Moon",
            logo: "/images/sponsors/prettymoon.jpg",
            instagram: "@prettymoon_official",
            instagramUrl: "https://www.instagram.com/prettymoon.in?igsh=MTg5MHg4ZjU0dW92NA=="
        },
        {
            id: 2,
            name: "Kalastra",
            logo: "/images/sponsors/kala_stra.jpg",
            instagram: "@kalastra_official",
            instagramUrl: "https://www.instagram.com/kala_stra?igsh=MTdsZG1oMGMxMHBjaw=="
        },
        {
            id: 3,
            name: "Kaam Done",
            logo: "/images/sponsors/kaam.done.jpg",
            instagram: "@kaamdone_official",
            instagramUrl: "https://www.instagram.com/kaam.done?igsh=Z2xqa2RoazNoenRn"
        },
        {
            id: 4,
            name: "Oriflame",
            logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNEY0NkU1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk9yaWZsYW1lPC90ZXh0Pgo8L3N2Zz4K",
            instagram: "@oriflame_india",
            instagramUrl: null // No Instagram link for 4th sponsor as requested
        }
    ];

    useEffect(() => {
        // Add sponsor-specific mobile CSS for the sponsors page
        const sponsorStyles = document.createElement('style');
        sponsorStyles.textContent = `
            @media (max-width: 768px) {
                .sponsors-page .mobile-hover-active {
                    transform: scale(1.05) translateY(-10px) !important;
                }
                
                .sponsors-page .mobile-hover-active .logo-area {
                    border-color: rgba(6, 182, 212, 0.5) !important;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.3) !important;
                }
                
                .sponsors-page .mobile-hover-active .sliding-bg {
                    transform: translateX(100%) !important;
                    opacity: 0.2 !important;
                }
                
                .sponsors-page .mobile-hover-active h3 {
                    color: rgb(6, 182, 212) !important;
                    text-shadow: 0 0 8px rgba(6, 182, 212, 0.4) !important;
                }
                
                .sponsors-page .mobile-hover-active p {
                    color: rgb(209, 213, 219) !important;
                }
                
                .sponsors-page .mobile-hover-active .crown-icon {
                    transform: scale(1.1) rotate(360deg) !important;
                    filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.6)) !important;
                }
                
                .sponsors-page .mobile-hover-active .particle-effect {
                    opacity: 0.8 !important;
                    animation: float 2s ease-in-out infinite !important;
                }
                
                .sponsors-page .mobile-hover-active .bg-glow {
                    opacity: 0.15 !important;
                    transform: scale(1.05) !important;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
                    25% { transform: translateY(-5px) scale(1.1) rotate(90deg); }
                    50% { transform: translateY(-8px) scale(1.2) rotate(180deg); }
                    75% { transform: translateY(-3px) scale(1.1) rotate(270deg); }
                }
                
                .sponsors-page .sponsor-card {
                    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                }
                
                .sponsors-page .sponsor-card .logo-area,
                .sponsors-page .sponsor-card .sliding-bg,
                .sponsors-page .sponsor-card h3,
                .sponsors-page .sponsor-card p,
                .sponsors-page .sponsor-card .particle-effect,
                .sponsors-page .sponsor-card .crown-icon {
                    transition: all 0.1s ease;
                }
            }
        `;
        document.head.appendChild(sponsorStyles);

        const ctx = gsap.context(() => {
            // Simple page header animation
            gsap.fromTo(".sponsors-header", 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8,
                    ease: "power2.out"
                }
            );

            // Simple sponsor cards animation - fade up with stagger
            gsap.fromTo(".sponsor-card", 
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    delay: 0.3
                }
            );

            // Simple tier headers animation
            gsap.fromTo(".tier-header", 
                { opacity: 0, y: 20 },
                { 
                    opacity: 1, 
                    y: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power2.out",
                    delay: 0.2
                }
            );

            // Simple CTA animation
            gsap.fromTo(".sponsors-cta", 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.8
                }
            );
        }, containerRef);

        return () => {
            ctx.revert();
            // Clean up sponsor-specific styles
            const sponsorStyleElements = document.querySelectorAll('style');
            sponsorStyleElements.forEach(style => {
                if (style.textContent.includes('.sponsors-page')) {
                    style.remove();
                }
            });
        };
    }, []);

    const handleBackToHome = () => {
        gsap.to(".sponsors-container", {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => navigate('/')
        });
    };

    const SponsorCard = ({ sponsor }) => (
        <motion.div
            className="sponsor-card group relative bg-black/40 border border-white/10 rounded-xl p-6 hover:border-cyber-blue/50 transition-all duration-300 hover:bg-black/60"
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Sponsor Logo Placeholder */}
            <div className="w-full h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center border border-white/10 group-hover:border-cyber-blue/30 transition-colors duration-300">
                <img 
                    src={sponsor.logo} 
                    alt={`${sponsor.name} logo`}
                    className="max-h-full max-w-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300 p-2"
                    onError={(e) => {
                        // Show fallback text if logo fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                    }}
                />
                <div className="hidden items-center justify-center text-white/50 text-sm font-mono group-hover:text-cyber-blue/70 transition-colors duration-300">
                    {sponsor.name}
                </div>
            </div>

            {/* Sponsor Info */}
            <div className="space-y-3 text-center">
                <h3 className="text-lg font-orbitron font-bold text-white group-hover:text-cyber-blue transition-colors duration-300">
                    {sponsor.name}
                </h3>
                
                <p className="text-cyber-blue text-sm font-mono group-hover:text-neon-purple transition-colors duration-300">
                    {sponsor.instagram}
                </p>

                {/* Visit Instagram Button */}
                {sponsor.instagramUrl ? (
                    <button 
                        onClick={() => window.open(sponsor.instagramUrl, '_blank')}
                        className="w-full mt-4 py-2 px-4 bg-white/5 border border-white/20 rounded-lg text-xs font-mono text-white hover:bg-cyber-blue/20 hover:border-cyber-blue/50 transition-all duration-300"
                    >
                        Follow on Instagram
                    </button>
                ) : (
                    <div className="w-full mt-4 py-2 px-4 bg-gray-500/20 border border-gray-500/30 rounded-lg text-xs font-mono text-gray-500 cursor-not-allowed">
                        Follow on Instagram
                    </div>
                )}
            </div>

            {/* Simple hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-blue/0 via-cyber-blue/5 to-neon-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
    );


    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sponsors-page sponsors-container min-h-screen bg-void-black text-white relative overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-void-black via-purple-950/20 to-void-black" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyber-blue/10 rounded-full blur-3xl animate-pulse" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="sponsors-header text-center mb-12">
                    <motion.button
                        onClick={handleBackToHome}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-sm font-mono text-white hover:bg-white/10 hover:border-cyber-blue/50 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </motion.button>

                    <h1 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-4">
                        OUR <span className="text-cyber-blue">SPONSORS</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        We are grateful to our amazing sponsors who make Innovision 3.0 possible. 
                        Their support drives innovation and excellence in technology.
                    </p>
                </div>

                {/* Sponsors Grid */}
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent flex-1" />
                            <h2 className="text-xl md:text-2xl font-orbitron font-bold text-white tracking-wider">
                                OUR SPONSORS
                            </h2>
                            <div className="h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent flex-1" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {sponsors.map((sponsor) => (
                                <SponsorCard key={sponsor.id} sponsor={sponsor} />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="sponsors-cta text-center mt-16 p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-400"
                >
                    <h3 className="text-2xl font-orbitron font-bold text-white mb-4">
                        Interested in Sponsoring?
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Join our community of innovative sponsors and help shape the future of technology education.
                    </p>
                    <button className="px-8 py-3 bg-gradient-to-r from-neon-purple to-cyber-blue text-white font-bold font-orbitron tracking-wider rounded-xl hover:opacity-90 transition-opacity">
                        Contact Us
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SponsorsPage;