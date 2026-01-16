import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const navLinks = [
        { name: 'Home', href: '/', id: '01', isRoute: true },
        { name: 'Events', href: '#events', id: '02', isRoute: false },
        { name: 'Schedule', href: '/schedule', id: '03', isRoute: true },
        { name: 'About', href: '#about', id: '04', isRoute: false },
        { name: 'Contact', href: '#contact', id: '05', isRoute: false },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[999] transition-all duration-300 ${scrolled ? 'glass-panel py-4' : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <a href="#" className="relative z-[1000] text-2xl font-orbitron font-bold tracking-wider text-white neon-text">
                    INNOVISION<span className="text-neon-purple">3.0</span>
                </a>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8">
                    {navLinks.map((link) => (
                        link.isRoute ? (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-gray-300 hover:text-white transition-colors relative group font-medium"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-purple transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ) : (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors relative group font-medium"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-purple transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        )
                    ))}
                </div>

                {/* Mobile Menu Button - High Z-Index to stay above overlay */}
                <button
                    className="relative z-[1000] md:hidden text-white focus:outline-none p-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={32} className="text-neon-purple" /> : <Menu size={32} />}
                </button>
            </div>

            {/* Mobile Menu Overlay - Portaled to Body */}
            {createPortal(
                <div
                    className={`fixed inset-0 bg-void-black/95 backdrop-blur-xl z-[998] flex flex-col justify-center transition-all duration-500 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyber-blue/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="container mx-auto px-8 relative z-10 flex flex-col h-full justify-center">
                        <div className="flex flex-col space-y-6">
                            {navLinks.map((link, index) => (
                                link.isRoute ? (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={`group flex items-center justify-between text-3xl font-orbitron text-white border-b border-white/10 pb-4 transition-all duration-500 delay-[${index * 100}ms] ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="relative">
                                            <span className="text-xs font-mono text-neon-purple/70 absolute -top-3 -left-2">{link.id}</span>
                                            {link.name}
                                        </span>
                                        <ChevronRight className="text-white/20 group-hover:text-neon-purple group-hover:translate-x-2 transition-all duration-300" />
                                    </Link>
                                ) : (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className={`group flex items-center justify-between text-3xl font-orbitron text-white border-b border-white/10 pb-4 transition-all duration-500 delay-[${index * 100}ms] ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <span className="relative">
                                            <span className="text-xs font-mono text-neon-purple/70 absolute -top-3 -left-2">{link.id}</span>
                                            {link.name}
                                        </span>
                                        <ChevronRight className="text-white/20 group-hover:text-neon-purple group-hover:translate-x-2 transition-all duration-300" />
                                    </a>
                                )
                            ))}
                        </div>

                        {/* CTA in Menu */}
                        <div className={`mt-12 transition-all duration-500 delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    setTimeout(() => {
                                        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 300);
                                }}
                                className="w-full py-4 bg-gradient-to-r from-neon-purple to-violet-600 text-white font-bold font-orbitron tracking-widest rounded-sm shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-shadow active:scale-95"
                            >
                                REGISTER NOW
                            </button>
                        </div>

                        {/* Social/Footer Info */}
                        <div className={`absolute bottom-8 left-0 w-full px-8 text-center text-gray-500 text-xs font-mono transition-all duration-500 delay-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                            <p>© 2026 INNOVISION</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </nav>
    );
};

export default Navbar;
