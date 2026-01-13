import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Phone, Send, Github, Linkedin, Instagram } from 'lucide-react';

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

                    {/* Contact Form */}
                    <div className="contact-form-container bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/10 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none"></div>

                        <form className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-cyber-blue uppercase tracking-wider">Codename / Name</label>
                                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all outline-none" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-cyber-blue uppercase tracking-wider">Transmission Frequency / Email</label>
                                    <input type="email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all outline-none" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-cyber-blue uppercase tracking-wider">Subject</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all outline-none" placeholder="Inquiry / Registration Issue" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-cyber-blue uppercase tracking-wider">Message Payload</label>
                                <textarea rows="4" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-all outline-none resize-none" placeholder="Your message here..."></textarea>
                            </div>

                            <button type="button" className="w-full py-4 bg-gradient-to-r from-cyber-blue to-blue-600 text-white font-bold font-orbitron tracking-widest rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group-hover:from-cyber-blue group-hover:to-neon-purple">
                                <Send size={18} /> INITIALIZE TRANSMISSION
                            </button>
                        </form>
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
                                        contact@innovision30.com<br />
                                        support@kvp-it.edu.in
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-4 bg-white/5 rounded-full border border-white/10 group-hover:border-green-500/50 group-hover:bg-green-500/10 transition-all duration-300">
                                    <Phone className="text-gray-400 group-hover:text-green-500 transition-colors" size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1 font-orbitron">Emergency Line</h4>
                                    <p className="text-gray-400 text-sm">
                                        +91 98765 43210 (Student Rep)<br />
                                        +91 0251 123456 (College Admin)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-8 border-t border-white/10">
                            <h5 className="text-white/60 text-sm font-bold mb-4 uppercase tracking-widest">Connect With Us</h5>
                            <div className="flex gap-4">
                                <a href="#" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 hover:text-cyber-blue transition-all border border-white/5 hover:border-cyber-blue/30"><Github size={20} /></a>
                                <a href="#" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 hover:text-blue-500 transition-all border border-white/5 hover:border-blue-500/30"><Linkedin size={20} /></a>
                                <a href="#" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 hover:text-pink-500 transition-all border border-white/5 hover:border-pink-500/30"><Instagram size={20} /></a>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Contact;
