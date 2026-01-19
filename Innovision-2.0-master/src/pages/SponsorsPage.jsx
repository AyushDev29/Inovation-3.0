import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const SponsorsPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Sample sponsor data - you can replace this with your actual data
    const sponsors = {
        title: [
            {
                id: 1,
                name: "TechCorp Solutions",
                logo: "/images/sponsor1.png", // You'll add actual logos
                tier: "Title Sponsor",
                description: "Leading technology solutions provider",
                website: "https://techcorp.com"
            }
        ],
        platinum: [
            {
                id: 2,
                name: "InnovateTech",
                logo: "/images/sponsor2.png",
                tier: "Platinum Sponsor",
                description: "Innovation in technology",
                website: "https://innovatetech.com"
            },
            {
                id: 3,
                name: "FutureSoft",
                logo: "/images/sponsor3.png",
                tier: "Platinum Sponsor", 
                description: "Software development excellence",
                website: "https://futuresoft.com"
            }
        ],
        gold: [
            {
                id: 4,
                name: "CodeMasters",
                logo: "/images/sponsor4.png",
                tier: "Gold Sponsor",
                description: "Coding bootcamp and training",
                website: "https://codemasters.com"
            },
            {
                id: 5,
                name: "DataFlow Systems",
                logo: "/images/sponsor5.png",
                tier: "Gold Sponsor",
                description: "Data analytics and insights",
                website: "https://dataflow.com"
            }
        ],
        silver: [
            {
                id: 6,
                name: "StartupHub",
                logo: "/images/sponsor6.png",
                tier: "Silver Sponsor",
                description: "Startup incubation platform",
                website: "https://startuphub.com"
            }
        ]
    };

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

    const getTierIcon = (tier) => {
        switch(tier) {
            case 'Title Sponsor': return <Award className="w-5 h-5 text-yellow-400" />;
            case 'Platinum Sponsor': return <Star className="w-5 h-5 text-gray-300" />;
            case 'Gold Sponsor': return <Zap className="w-5 h-5 text-yellow-500" />;
            default: return <Star className="w-4 h-4 text-gray-400" />;
        }
    };

    const getTierColor = (tier) => {
        switch(tier) {
            case 'Title Sponsor': return 'from-yellow-400 to-orange-500';
            case 'Platinum Sponsor': return 'from-gray-300 to-gray-500';
            case 'Gold Sponsor': return 'from-yellow-400 to-yellow-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const SponsorCard = ({ sponsor }) => (
        <motion.div
            className="sponsor-card group relative bg-black/40 border border-white/10 rounded-xl p-6 hover:border-cyber-blue/50 transition-all duration-300 hover:bg-black/60"
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Sponsor Logo Placeholder */}
            <div className="w-full h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center border border-white/10 group-hover:border-cyber-blue/30 transition-colors duration-300">
                <div className="text-white/50 text-sm font-mono group-hover:text-cyber-blue/70 transition-colors duration-300">LOGO</div>
            </div>

            {/* Sponsor Info */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    {getTierIcon(sponsor.tier)}
                    <span className={`text-xs font-mono uppercase tracking-wider bg-gradient-to-r ${getTierColor(sponsor.tier)} bg-clip-text text-transparent`}>
                        {sponsor.tier}
                    </span>
                </div>
                
                <h3 className="text-lg font-orbitron font-bold text-white group-hover:text-cyber-blue transition-colors duration-300">
                    {sponsor.name}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {sponsor.description}
                </p>

                {/* Visit Website Button */}
                <button className="w-full mt-4 py-2 px-4 bg-white/5 border border-white/20 rounded-lg text-xs font-mono text-white hover:bg-cyber-blue/20 hover:border-cyber-blue/50 transition-all duration-300">
                    Visit Website
                </button>
            </div>

            {/* Simple hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyber-blue/0 via-cyber-blue/5 to-neon-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
    );

    const TierSection = ({ title, sponsors, delay = 0 }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
            className="mb-12"
        >
            <div className="tier-header flex items-center gap-3 mb-6">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent flex-1" />
                <h2 className="text-xl md:text-2xl font-orbitron font-bold text-white tracking-wider">
                    {title}
                </h2>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent flex-1" />
            </div>
            
            <div className={`grid gap-6 ${
                sponsors.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                sponsors.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
                {sponsors.map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                ))}
            </div>
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

                {/* Sponsors by Tier */}
                <div className="max-w-7xl mx-auto">
                    {sponsors.title.length > 0 && (
                        <TierSection title="TITLE SPONSORS" sponsors={sponsors.title} delay={0.1} />
                    )}
                    
                    {sponsors.platinum.length > 0 && (
                        <TierSection title="PLATINUM SPONSORS" sponsors={sponsors.platinum} delay={0.2} />
                    )}
                    
                    {sponsors.gold.length > 0 && (
                        <TierSection title="GOLD SPONSORS" sponsors={sponsors.gold} delay={0.3} />
                    )}
                    
                    {sponsors.silver.length > 0 && (
                        <TierSection title="SILVER SPONSORS" sponsors={sponsors.silver} delay={0.4} />
                    )}
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