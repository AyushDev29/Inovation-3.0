import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Zap, ArrowRight, Sparkles, Crown, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Sponsors = () => {
    const sectionRef = useRef(null);

    // Sample featured sponsors - you can replace with your actual data
    const featuredSponsors = [
        {
            id: 1,
            name: "TechCorp Solutions",
            tier: "Title Sponsor",
            logo: "/images/sponsor1.png",
            description: "Leading technology solutions provider",
            color: "from-yellow-400 to-orange-500"
        },
        {
            id: 2,
            name: "InnovateTech",
            tier: "Platinum Sponsor", 
            logo: "/images/sponsor2.png",
            description: "Innovation in technology",
            color: "from-gray-300 to-gray-500"
        },
        {
            id: 3,
            name: "FutureSoft",
            tier: "Platinum Sponsor",
            logo: "/images/sponsor3.png", 
            description: "Software development excellence",
            color: "from-gray-300 to-gray-500"
        },
        {
            id: 4,
            name: "CodeMasters",
            tier: "Gold Sponsor",
            logo: "/images/sponsor4.png",
            description: "Coding bootcamp and training",
            color: "from-yellow-400 to-yellow-600"
        }
    ];

    useEffect(() => {
        // Add sponsor-specific mobile CSS
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
                
                .sponsors-page .sponsor-card-main {
                    transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
                    transform-style: preserve-3d;
                }
                
                .sponsors-page .sponsor-card-main .logo-area,
                .sponsors-page .sponsor-card-main .sliding-bg,
                .sponsors-page .sponsor-card-main h3,
                .sponsors-page .sponsor-card-main p,
                .sponsors-page .sponsor-card-main .particle-effect,
                .sponsors-page .sponsor-card-main .crown-icon {
                    transition: all 0.1s ease;
                }
            }
        `;
        document.head.appendChild(sponsorStyles);

        const ctx = gsap.context(() => {
            // Animated background elements
            gsap.fromTo(".floating-shape", 
                { opacity: 0, scale: 0, rotation: 0 },
                {
                    opacity: 0.1,
                    scale: 1,
                    rotation: 360,
                    duration: 2,
                    stagger: 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Section reveal with slide effect
            gsap.fromTo(".sponsors-section-header", 
                { opacity: 0, y: 60, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        end: "bottom 25%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Sponsor cards with wave animation
            gsap.fromTo(".sponsor-card-main", 
                { opacity: 0, y: 80, rotationX: 45 },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.8,
                    stagger: {
                        amount: 0.6,
                        from: "start"
                    },
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".sponsors-grid",
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Mobile scroll-triggered hover effects with scroll speed responsiveness
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Mobile: Enhanced scroll-responsive hover effects for each card
                document.querySelectorAll('.sponsor-card-main').forEach((card, index) => {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top 65%", // Card starts entering at 65% from top (35% visible)
                        end: "bottom 35%", // Card exits when 35% from bottom (65% visible)
                        scrub: 1, // Makes animation follow scroll speed
                        onUpdate: (self) => {
                            const progress = self.progress;
                            const velocity = Math.abs(self.getVelocity() / 1000); // Normalize velocity
                            const isActive = progress > 0 && progress < 1; // Active when card is 35% visible
                            
                            if (isActive) {
                                // Enhanced hover effects based on scroll speed
                                const intensity = Math.min(1 + velocity * 0.5, 2); // Max 2x intensity
                                
                                card.classList.add('mobile-hover-active');
                                
                                // Dynamic scale and lift based on scroll speed
                                gsap.to(card, {
                                    scale: 1.02 + (velocity * 0.03),
                                    y: -5 - (velocity * 5),
                                    rotationY: (index % 2 === 0 ? 1 : -1) * velocity * 2,
                                    duration: 0.1,
                                    ease: "none"
                                });
                                
                                // Enhanced logo effects
                                const logoArea = card.querySelector('.logo-area');
                                if (logoArea) {
                                    gsap.to(logoArea, {
                                        borderColor: `rgba(6, 182, 212, ${0.3 + velocity * 0.3})`,
                                        boxShadow: `0 0 ${10 + velocity * 20}px rgba(6, 182, 212, ${0.2 + velocity * 0.3})`,
                                        duration: 0.1,
                                        ease: "none"
                                    });
                                }
                                
                                // Dynamic sliding background
                                const slidingBg = card.querySelector('.sliding-bg');
                                if (slidingBg) {
                                    gsap.to(slidingBg, {
                                        x: `${-100 + (progress * 200)}%`,
                                        opacity: 0.1 + velocity * 0.2,
                                        duration: 0.1,
                                        ease: "none"
                                    });
                                }
                                
                                // Enhanced text effects
                                const title = card.querySelector('h3');
                                const description = card.querySelector('p');
                                if (title) {
                                    gsap.to(title, {
                                        color: `rgb(${6 + velocity * 50}, ${182 + velocity * 50}, 212)`,
                                        textShadow: `0 0 ${5 + velocity * 10}px rgba(6, 182, 212, ${0.3 + velocity * 0.4})`,
                                        letterSpacing: `${velocity * 0.02}em`,
                                        duration: 0.1,
                                        ease: "none"
                                    });
                                }
                                
                                // Particle effects
                                const particles = card.querySelectorAll('.particle-effect');
                                particles.forEach((particle, i) => {
                                    gsap.to(particle, {
                                        opacity: velocity * 0.8,
                                        scale: 1 + velocity * 0.5,
                                        rotation: velocity * 180 * (i % 2 === 0 ? 1 : -1),
                                        duration: 0.1,
                                        ease: "none"
                                    });
                                });
                                
                            } else {
                                // Reset effects when not in active zone
                                card.classList.remove('mobile-hover-active');
                                
                                gsap.to(card, {
                                    scale: 1,
                                    y: 0,
                                    rotationY: 0,
                                    duration: 0.3,
                                    ease: "power2.out"
                                });
                                
                                const logoArea = card.querySelector('.logo-area');
                                if (logoArea) {
                                    gsap.to(logoArea, {
                                        borderColor: 'rgba(255, 255, 255, 0.1)',
                                        boxShadow: 'none',
                                        duration: 0.3,
                                        ease: "power2.out"
                                    });
                                }
                                
                                const slidingBg = card.querySelector('.sliding-bg');
                                if (slidingBg) {
                                    gsap.to(slidingBg, {
                                        x: '-100%',
                                        opacity: 0,
                                        duration: 0.3,
                                        ease: "power2.out"
                                    });
                                }
                            }
                        }
                    });
                });

                // Enhanced title sponsor scroll effects
                const titleSponsor = document.querySelector('.title-sponsor-card');
                if (titleSponsor) {
                    ScrollTrigger.create({
                        trigger: titleSponsor,
                        start: "top 65%", // Trigger when 35% of card is visible
                        end: "bottom 35%", // End when 35% from bottom
                        scrub: 1,
                        onUpdate: (self) => {
                            const progress = self.progress;
                            const velocity = Math.abs(self.getVelocity() / 1000);
                            const isActive = progress > 0 && progress < 1; // Active when 35% visible
                            
                            if (isActive) {
                                titleSponsor.classList.add('mobile-hover-active');
                                
                                // Enhanced crown animation
                                const crown = titleSponsor.querySelector('.crown-icon');
                                if (crown) {
                                    gsap.to(crown, {
                                        scale: 1.05 + (velocity * 0.1),
                                        rotation: velocity * 180,
                                        filter: `drop-shadow(0 0 ${5 + velocity * 15}px rgba(251, 191, 36, ${0.4 + velocity * 0.4}))`,
                                        duration: 0.1,
                                        ease: "none"
                                    });
                                }
                                
                                // Enhanced background glow
                                const bgGlow = titleSponsor.querySelector('.bg-glow');
                                if (bgGlow) {
                                    gsap.to(bgGlow, {
                                        opacity: 0.1 + velocity * 0.3,
                                        scale: 1 + velocity * 0.2,
                                        duration: 0.1,
                                        ease: "none"
                                    });
                                }
                                
                            } else {
                                titleSponsor.classList.remove('mobile-hover-active');
                                
                                const crown = titleSponsor.querySelector('.crown-icon');
                                if (crown) {
                                    gsap.to(crown, {
                                        scale: 1,
                                        rotation: 0,
                                        filter: 'none',
                                        duration: 0.4,
                                        ease: "elastic.out(1, 0.3)"
                                    });
                                }
                            }
                        }
                    });
                }
            }

            // Tier badges with bounce
            gsap.fromTo(".tier-badge", 
                { opacity: 0, scale: 0, rotation: -180 },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "elastic.out(1, 0.5)",
                    scrollTrigger: {
                        trigger: ".sponsors-grid",
                        start: "top 70%",
                        end: "bottom 30%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // View all button with magnetic effect
            gsap.fromTo(".view-all-sponsors", 
                { opacity: 0, y: 40, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)",
                    scrollTrigger: {
                        trigger: ".view-all-sponsors",
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // CTA section with slide up
            gsap.fromTo(".sponsor-cta", 
                { opacity: 0, y: 50, rotationX: 30 },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".sponsor-cta",
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play reverse play reverse"
                    }
                }
            );

            // Continuous floating animation for shapes
            gsap.to(".floating-shape", {
                y: "random(-20, 20)",
                x: "random(-15, 15)",
                rotation: "random(-10, 10)",
                duration: "random(3, 6)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.2
            });
        }, sectionRef);

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

    const getTierIcon = (tier) => {
        switch(tier) {
            case 'Title Sponsor': return <Crown className="w-5 h-5 text-yellow-400" />;
            case 'Platinum Sponsor': return <Trophy className="w-5 h-5 text-gray-300" />;
            case 'Gold Sponsor': return <Award className="w-5 h-5 text-yellow-500" />;
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

    return (
        <section ref={sectionRef} className="sponsors-page py-20 md:py-32 bg-void-black relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="floating-shape absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyber-blue/10 to-neon-purple/10 rounded-full blur-xl" />
                <div className="floating-shape absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-neon-purple/15 to-cyber-blue/15 rounded-full blur-lg" />
                <div className="floating-shape absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-yellow-400/5 to-orange-500/5 rounded-full blur-2xl" />
                <div className="floating-shape absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-r from-cyber-blue/8 to-neon-purple/8 rounded-full blur-xl" />
            </div>

            {/* Geometric Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyber-blue rotate-45 animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-neon-purple rotate-12 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-yellow-400 rotate-45 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-cyber-blue rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div className="sponsors-section-header text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyber-blue/20 to-neon-purple/20 border border-cyber-blue/30 rounded-full text-sm font-mono text-cyber-blue mb-8 backdrop-blur-sm"
                    >
                        <Sparkles size={18} className="animate-pulse" />
                        POWERED BY INNOVATION
                        <Sparkles size={18} className="animate-pulse" />
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-6 leading-tight">
                        OUR <span className="bg-gradient-to-r from-cyber-blue via-neon-purple to-cyber-blue bg-clip-text text-transparent animate-pulse">VISIONARY</span>
                        <br />
                        <span className="text-cyber-blue">SPONSORS</span>
                    </h2>
                    
                    <p className="text-gray-400 text-xl max-w-4xl mx-auto leading-relaxed">
                        Meet the industry leaders who fuel our mission to advance technology education 
                        and create opportunities for the next generation of innovators.
                    </p>
                </div>

                {/* Creative Sponsors Grid */}
                <div className="sponsors-grid mb-16">
                    {/* Title Sponsor - Full Width */}
                    {featuredSponsors.filter(s => s.tier === "Title Sponsor").map((sponsor) => (
                        <motion.div
                            key={sponsor.id}
                            className="sponsor-card-main title-sponsor-card mb-12 relative"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="relative bg-gradient-to-r from-black/60 via-black/40 to-black/60 border border-yellow-400/30 rounded-3xl p-8 md:p-12 overflow-hidden group hover:border-yellow-400/60 transition-all duration-500"
                                 style={{
                                     clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))"
                                 }}>
                                
                                {/* Enhanced inverted corners and glow */}
                                <div className="bg-glow absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 mobile-hover-active:opacity-100 transition-opacity duration-500"
                                     style={{
                                         mask: "radial-gradient(circle at 30px 30px, transparent 20px, black 21px), radial-gradient(circle at calc(100% - 30px) 30px, transparent 20px, black 21px), radial-gradient(circle at 30px calc(100% - 30px), transparent 20px, black 21px), radial-gradient(circle at calc(100% - 30px) calc(100% - 30px), transparent 20px, black 21px)",
                                         maskComposite: "intersect"
                                     }} />
                                
                                {/* Enhanced particle system */}
                                <div className="particle-effect absolute top-8 right-8 w-3 h-3 bg-yellow-400 rounded-full opacity-0 blur-sm" />
                                <div className="particle-effect absolute top-12 right-16 w-2 h-2 bg-orange-500 rounded-full opacity-0 blur-sm" />
                                <div className="particle-effect absolute bottom-8 left-8 w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-0 blur-sm" />
                                <div className="particle-effect absolute bottom-12 left-16 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-0 blur-sm" />
                                
                                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-yellow-400/30 group-hover:border-yellow-400/60 mobile-hover-active:border-yellow-400/60 transition-colors duration-300">
                                        <Crown size={48} className="crown-icon text-yellow-400 group-hover:scale-110 mobile-hover-active:scale-110 transition-transform duration-300" />
                                    </div>
                                    
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="tier-badge inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full mb-4">
                                            <Crown size={16} className="text-yellow-400" />
                                            <span className="text-yellow-400 font-mono text-sm uppercase tracking-wider">Title Sponsor</span>
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-3 group-hover:text-yellow-400 mobile-hover-active:text-yellow-400 transition-colors duration-300">
                                            {sponsor.name}
                                        </h3>
                                        <p className="text-gray-300 text-lg leading-relaxed">
                                            {sponsor.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Other Sponsors - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredSponsors.filter(s => s.tier !== "Title Sponsor").map((sponsor, index) => (
                            <motion.div
                                key={sponsor.id}
                                className="sponsor-card-main group relative"
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -10,
                                    rotateY: index % 2 === 0 ? 5 : -5,
                                    transition: { duration: 0.3, ease: "power2.out" }
                                }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Inverted Border Radius Card */}
                                <div className="relative bg-gradient-to-br from-black/60 to-black/40 border border-white/10 rounded-2xl p-6 overflow-hidden hover:border-cyber-blue/50 transition-all duration-500 h-full"
                                     style={{
                                         clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))"
                                     }}>
                                    
                                    {/* Animated background gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${sponsor.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                    
                                    {/* Enhanced particle effects */}
                                    <div className="particle-effect absolute top-4 right-4 w-2 h-2 bg-cyber-blue rounded-full opacity-0 transition-opacity duration-300" />
                                    <div className="particle-effect absolute top-6 right-8 w-1 h-1 bg-neon-purple rounded-full opacity-0 transition-opacity duration-300" />
                                    <div className="particle-effect absolute bottom-4 left-4 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 transition-opacity duration-300" />
                                    <div className="particle-effect absolute bottom-6 left-8 w-1 h-1 bg-cyber-blue rounded-full opacity-0 transition-opacity duration-300" />
                                    
                                    {/* Floating orbs */}
                                    <div className="particle-effect absolute top-1/2 left-2 w-3 h-3 bg-gradient-to-r from-cyber-blue/30 to-neon-purple/30 rounded-full blur-sm opacity-0 transition-all duration-300" />
                                    <div className="particle-effect absolute top-1/3 right-2 w-2 h-2 bg-gradient-to-r from-neon-purple/40 to-yellow-400/40 rounded-full blur-sm opacity-0 transition-all duration-300" />
                                    
                                    <div className="relative z-10 h-full flex flex-col">
                                        {/* Logo Area with inverted corners */}
                                        <div className="logo-area w-full h-24 bg-gradient-to-br from-white/5 to-white/10 rounded-xl mb-6 flex items-center justify-center border border-white/10 group-hover:border-cyber-blue/30 mobile-hover-active:border-cyber-blue/30 transition-colors duration-300 relative overflow-hidden">
                                            <div className="text-white/60 text-sm font-mono group-hover:text-cyber-blue/80 mobile-hover-active:text-cyber-blue/80 transition-colors duration-300 z-10">LOGO</div>
                                            {/* Sliding background effect */}
                                            <div className="sliding-bg absolute inset-0 bg-gradient-to-r from-transparent via-cyber-blue/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        </div>

                                        {/* Tier Badge */}
                                        <div className="tier-badge flex items-center gap-2 mb-4">
                                            {getTierIcon(sponsor.tier)}
                                            <span className={`text-xs font-mono uppercase tracking-wider bg-gradient-to-r ${getTierColor(sponsor.tier)} bg-clip-text text-transparent`}>
                                                {sponsor.tier}
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-orbitron font-bold text-white group-hover:text-cyber-blue mobile-hover-active:text-cyber-blue transition-colors duration-300 mb-3 leading-tight">
                                                {sponsor.name}
                                            </h3>
                                            
                                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 mobile-hover-active:text-gray-300 transition-colors duration-300">
                                                {sponsor.description}
                                            </p>
                                        </div>

                                        {/* Hover indicator */}
                                        <div className="mt-4 opacity-0 group-hover:opacity-100 mobile-hover-active:opacity-100 transition-opacity duration-300">
                                            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* View All Sponsors Button */}
                <div className="view-all-sponsors text-center mb-20">
                    <Link to="/sponsors">
                        <motion.button
                            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-cyber-blue/20 to-neon-purple/20 border-2 border-cyber-blue/30 rounded-2xl text-white font-orbitron font-bold text-lg tracking-wider hover:from-cyber-blue/30 hover:to-neon-purple/30 hover:border-cyber-blue/60 transition-all duration-500 overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))"
                            }}
                        >
                            <span className="relative z-10">EXPLORE ALL SPONSORS</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                            
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/0 via-cyber-blue/30 to-cyber-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </motion.button>
                    </Link>
                </div>

                {/* Sponsor CTA */}
                <motion.div
                    className="sponsor-cta text-center p-10 bg-gradient-to-r from-black/60 via-black/40 to-black/60 border border-white/10 rounded-3xl backdrop-blur-sm hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                    style={{
                        clipPath: "polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px))"
                    }}
                >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-neon-purple/5 to-cyber-blue/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-6">
                            Become Our <span className="text-cyber-blue">Partner</span>
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                            Join our community of innovative sponsors and help shape the future of technology education. 
                            Partner with us to reach the brightest minds in tech.
                        </p>
                        <motion.button 
                            className="px-8 py-4 bg-gradient-to-r from-neon-purple to-cyber-blue text-white font-bold font-orbitron tracking-wider rounded-xl hover:opacity-90 transition-opacity duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Partner With Us
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Sponsors;