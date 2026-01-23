import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Phone, User, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {

            // Header Animation
            gsap.from(".contact-header", {
                scrollTrigger: {
                    trigger: ".contact-header",
                    start: "top 85%",
                    toggleActions: "play reverse play reverse"
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });

            // Contact Form Animation - Smooth Fade Up
            gsap.from(".contact-form-container", {
                scrollTrigger: {
                    trigger: ".contact-container",
                    start: "top 80%",
                    toggleActions: "play reverse play reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.1,
                ease: "power2.out"
            });

            // Contact Info Animation - Smooth Fade Up
            gsap.from(".contact-info-container", {
                scrollTrigger: {
                    trigger: ".contact-container",
                    start: "top 80%",
                    toggleActions: "play reverse play reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                ease: "power2.out"
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="contact" className="relative py-24 px-4 bg-void-black overflow-hidden font-mono">

            {/* Purple Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">

                <div className="text-center mb-16 contact-header">
                    <h2 className="text-neon-purple tracking-[0.5em] text-sm font-bold mb-4 uppercase">Get In Touch</h2>
                    <h3 className="text-4xl md:text-5xl font-orbitron font-bold text-white">
                        CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-neon-purple">HQ</span>
                    </h3>
                </div>

                <div className="contact-container grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Coordinators Info */}
                    <div className="contact-form-container space-y-6">
                        
                        {/* Coordinator 1 - Yash */}
                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-cyber-blue/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/10 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
                            
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-cyber-blue/20 to-neon-purple/20 rounded-full border border-cyber-blue/30">
                                        <User className="text-cyber-blue" size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-2xl font-orbitron">YASH RAJBHAR</h4>
                                        <p className="text-cyber-blue text-sm uppercase tracking-wider">Event Coordinator</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pl-2">
                                    <div className="flex items-center gap-3 group/item">
                                        <Phone className="text-gray-400 group-hover/item:text-green-500 transition-colors" size={18} />
                                        <span className="text-gray-300 group-hover/item:text-white transition-colors">
                                            +91 90297 03989
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 group/item">
                                        <Mail className="text-gray-400 group-hover/item:text-cyber-blue transition-colors" size={18} />
                                        <span className="text-gray-300 group-hover/item:text-white transition-colors">
                                            innovision.it.dept@gmail.com
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coordinator 2 - Minnoli */}
                        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-neon-purple/30 transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>
                            
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-gradient-to-br from-neon-purple/20 to-pink-500/20 rounded-full border border-neon-purple/30">
                                        <User className="text-neon-purple" size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-2xl font-orbitron">MINNOLI MADHYAN</h4>
                                        <p className="text-neon-purple text-sm uppercase tracking-wider">Event Coordinator</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pl-2">
                                    <div className="flex items-center gap-3 group/item">
                                        <Phone className="text-gray-400 group-hover/item:text-green-500 transition-colors" size={18} />
                                        <span className="text-gray-300 group-hover/item:text-white transition-colors">
                                            +91 75063 03940
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 group/item">
                                        <Mail className="text-gray-400 group-hover/item:text-neon-purple transition-colors" size={18} />
                                        <span className="text-gray-300 group-hover/item:text-white transition-colors">
                                            innovision.it.dept@gmail.com
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Contact Info */}
                    <div className="contact-info-container flex flex-col justify-center space-y-10">

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 group">
                                <div className="p-4 bg-white/5 rounded-full border border-white/10 group-hover:border-neon-purple/50 group-hover:bg-neon-purple/10 transition-all duration-300">
                                    <MapPin className="text-gray-400 group-hover:text-neon-purple transition-colors" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1 font-orbitron">Base Location</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        K.V. Pendharkar College of Arts, Science and Commerce<br />
                                        Plot No. SPL-4, Opposite MIDC Office,<br />
                                        Dombivli East, Maharashtra 421203
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-4 bg-white/5 rounded-full border border-white/10 group-hover:border-cyber-blue/50 group-hover:bg-cyber-blue/10 transition-all duration-300">
                                    <Mail className="text-gray-400 group-hover:text-cyber-blue transition-colors" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1 font-orbitron">Comms Channel</h4>
                                    <p className="text-gray-400 text-sm">
                                        innovision.it.dept@gmail.com
                                    </p>
                                </div>
                            </div>

                            {/* <div className="flex items-start gap-4 group">
                                <div className="p-4 bg-white/5 rounded-full border border-white/10 group-hover:border-green-500/50 group-hover:bg-green-500/10 transition-all duration-300">
                                    <Phone className="text-gray-400 group-hover:text-green-500 transition-colors" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1 font-orbitron">Event head Contact</h4>
                                    <p className="text-gray-400 text-sm">
                                        +91 90281 05269 (Rupali Patil Mam)
                                    </p>
                                </div>
                            </div> */}

                            <div className="flex items-start gap-4 group">
                                <div className="p-4 bg-white/5 rounded-full border border-white/10 group-hover:border-pink-500/50 group-hover:bg-pink-500/10 transition-all duration-300">
                                    <Instagram className="text-gray-400 group-hover:text-pink-500 transition-colors" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1 font-orbitron">Follow Us</h4>
                                    <a 
                                        href="https://www.instagram.com/innovision_it?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-gray-400 text-sm hover:text-pink-500 transition-colors"
                                    >
                                        @innovision_it
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Contact;
