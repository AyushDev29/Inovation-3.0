import React from 'react';
import { Github, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import gsap from 'gsap';

const Footer = () => {
    const scrollToTop = () => {
        const rocket = document.getElementById('rocket-btn');

        // Rocket launch animation
        gsap.to(rocket, {
            y: -1000,
            opacity: 0,
            duration: 1,
            ease: 'power4.in',
            onComplete: () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Reset rocket
                gsap.set(rocket, { y: 100, opacity: 0 });
                gsap.to(rocket, { y: 0, opacity: 1, duration: 0.5, delay: 1 });
            }
        });
    };

    return (
        <footer className="relative bg-black border-t border-white/10 pt-20 pb-10 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div>
                        <h2 className="text-3xl font-orbitron font-bold text-white mb-6">
                            INNOVISION<span className="text-neon-purple">3.0</span>
                        </h2>
                        <p className="text-gray-400 max-w-xs">
                            Join us.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-orbitron font-bold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-neon-purple transition-colors">Home</a></li>
                            <li><a href="#events" className="hover:text-neon-purple transition-colors">Events</a></li>
                            <li><a href="#about" className="hover:text-neon-purple transition-colors">About Us</a></li>
                            <li><a href="#contact" className="hover:text-neon-purple transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-orbitron font-bold text-white mb-6">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="https://github.com/Sachin844123" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-purple hover:text-white transition-all duration-300">
                                <Github size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyber-blue hover:text-white transition-all duration-300">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all duration-300">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/sachin-singh-5977b5306" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <Linkedin size={20} />
                            </a>
                        </div>
                        <div className="mt-8">
                            <h4 className="text-sm font-bold text-gray-300 mb-2">Faculty Coordinators</h4>
                            <p className="text-gray-500 text-sm">Prof. 1</p>
                            <p className="text-gray-500 text-sm">Prof. 2</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center">
                    <p className="text-gray-500 text-sm mb-3">
                        © 2026 Innovision 3.0.
                    </p>
                    <p className="text-gray-500 text-sm">
                        Designed by Department of IT
                    </p>
                </div>
            </div>

            {/* Rocket Back to Top */}
            <button
                id="rocket-btn"
                onClick={scrollToTop}
                className="absolute bottom-10 right-10 w-12 h-12 bg-gradient-to-r from-neon-purple to-cyber-blue rounded-full flex items-center justify-center text-white shadow-lg shadow-neon-purple/30 hover:scale-110 transition-transform z-50 group"
            >
                <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            </button>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        </footer>
    );
};

export default Footer;
