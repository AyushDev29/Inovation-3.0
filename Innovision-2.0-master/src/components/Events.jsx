import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Trophy, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RulesModal from './RulesModal';
import { useScrollHover } from '../hooks/useScrollHover';

gsap.registerPlugin(ScrollTrigger);

const eventsData = [
    {
        id: 1,
        title: "BGMI Esports Tournament",
        category: "E-Sports",
        description: "Competitive BGMI battle with ranked matches across two days",
        date: "Day 1 & Day 2 (5–6 Feb), 9:00 AM – 12:00 PM",
        venue: "College Campus",
        teamSize: "4 Members",
        prize: "₹7,000",
        image: "/images/BGMI.png",
        color: "from-orange-500 to-red-600",
        registrationLink: ""
    },
    {
        id: 2,
        title: "Free Fire Esports Tournament",
        category: "E-Sports",
        description: "High-intensity Free Fire Clash Squad tournament",
        date: "Day 3 (7 Feb), 9:00 AM – 11:00 AM",
        venue: "College Campus",
        teamSize: "4 Members",
        prize: "₹3,000",
        image: "/images/free_fire.png",
        color: "from-blue-500 to-cyan-500",
        registrationLink: ""
    },
    {
        id: 3,
        title: "Tech Triathlon",
        category: "Technical / Fun",
        description: "From flawless typing to sharp debugging and logical thinking, Tech Triathlon tests every core skill a modern coder needs.",
        date: "Day 2 (6 Feb), 11:00 AM – 12:00 PM",
        venue: "Computer Lab",
        teamSize: "Individual",
        prize: "",
        image: "/images/blind_type.png",
        color: "from-yellow-500 to-amber-600",
        registrationLink: ""
    },
    {
        id: 4,
        title: "Fashion Flex",
        category: "Fun / Cultural",
        description: "Style Your way attire ramp walk competition with Q&A round",
        date: "Day 1 (5 Feb), 11:00 AM – 1:00 PM",
        venue: "Auditorium",
        teamSize: "2 Members (Duo)",
        prize: "",
        image: "/images/ui_ux.png",
        color: "from-purple-500 to-pink-600",
        registrationLink: ""
    },
    {
        id: 5,
        title: "Hackastra",
        category: "Technical",
        description: "From bold ideas to powerful execution, Hackastra challenges participants to think creatively, code efficiently, and build innovative solutions in a high-intensity coding environment.",
        date: "Day 3 (7 Feb), 11:00 AM – 2:00 PM",
        venue: "Seminar Hall",
        teamSize: "2-3 Members",
        prize: "",
        image: "/images/hackathon.png",
        color: "from-green-500 to-emerald-600",
        registrationLink: ""
    },
    {
        id: 6,
        title: "Fun Fusion",
        category: "Fun",
        description: "Individual indoor games and challenges",
        date: "Day 2 (6 Feb), 12:00 PM – 2:00 PM",
        venue: "Auditorium",
        teamSize: "Individual",
        prize: "",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop",
        color: "from-indigo-500 to-violet-600",
        registrationLink: ""
    }
];

const EventCardLeft = ({ event, onClick }) => {
    return (
        <div
            className="event-left-card h-64 sm:h-72 md:h-80 p-4 sm:p-6 md:p-8 border-l-4 border-cyber-blue bg-white/5 backdrop-blur-sm rounded-r-xl hover:bg-white/10 transition-colors duration-300 cursor-pointer group flex flex-col"
            onClick={() => onClick(event)}
        >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-shrink-0">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg border border-white/10"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-gradient-to-r ${event.color} text-white whitespace-nowrap`}>
                            {event.category}
                        </span>
                        {event.prize && (
                            <span className="text-neon-purple font-bold text-xs sm:text-sm">
                                {event.prize}
                            </span>
                        )}
                    </div>
                    <h4 className="text-base sm:text-lg md:text-xl font-orbitron font-bold text-white mb-1 sm:mb-2 group-hover:text-cyber-blue transition-colors leading-tight">
                        {event.title}
                    </h4>
                </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base mb-3 flex-1 overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {event.description}
            </p>
            
            {/* Event Details Section */}
            <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Users size={14} className="text-cyber-blue flex-shrink-0" />
                    <span className="text-gray-300 font-medium">{event.teamSize}</span>
                    <span className="text-gray-600">•</span>
                    <MapPin size={14} className="text-cyber-blue flex-shrink-0" />
                    <span className="text-gray-300 font-medium truncate">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Calendar size={14} className="text-cyber-blue flex-shrink-0" />
                    <span className="text-gray-300 font-medium truncate">{event.date}</span>
                </div>
            </div>
            
            <div className="flex items-center justify-end text-xs sm:text-sm mt-auto">
                <div className="flex items-center text-cyber-blue font-medium whitespace-nowrap">
                    <span>View Details</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const EventCardRight = ({ event, onClick }) => {
    return (
        <div
            className="event-right-card h-64 sm:h-72 md:h-80 p-4 sm:p-6 md:p-8 border-r-4 border-neon-purple bg-white/5 backdrop-blur-sm rounded-l-xl text-right hover:bg-white/10 transition-colors duration-300 cursor-pointer group flex flex-col"
            onClick={() => onClick(event)}
        >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4 justify-end">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2 justify-end">
                        {event.prize && (
                            <span className="text-neon-purple font-bold text-xs sm:text-sm">
                                {event.prize}
                            </span>
                        )}
                        <span className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-gradient-to-r ${event.color} text-white whitespace-nowrap`}>
                            {event.category}
                        </span>
                    </div>
                    <h4 className="text-base sm:text-lg md:text-xl font-orbitron font-bold text-white mb-1 sm:mb-2 group-hover:text-neon-purple transition-colors leading-tight">
                        {event.title}
                    </h4>
                </div>
                <div className="flex-shrink-0">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg border border-white/10"
                    />
                </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base mb-3 flex-1 overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {event.description}
            </p>
            
            {/* Event Details Section */}
            <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm justify-end">
                    <span className="text-gray-300 font-medium truncate">{event.venue}</span>
                    <MapPin size={14} className="text-neon-purple flex-shrink-0" />
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-300 font-medium">{event.teamSize}</span>
                    <Users size={14} className="text-neon-purple flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm justify-end">
                    <span className="text-gray-300 font-medium truncate">{event.date}</span>
                    <Calendar size={14} className="text-neon-purple flex-shrink-0" />
                </div>
            </div>
            
            <div className="flex items-center justify-start text-xs sm:text-sm mt-auto">
                <div className="flex items-center text-neon-purple font-medium whitespace-nowrap">
                    <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span>View Details</span>
                </div>
            </div>
        </div>
    );
};

const EventModal = ({ event, onClose, onViewRules, navigate }) => {
    if (!event) return null;

    const getRegistrationPath = (eventTitle) => {
        const pathMap = {
            "BGMI Esports Tournament": "/register/bgmi",
            "Free Fire Esports Tournament": "/register/freefire",
            "Tech Triathlon": "/register/tech-triathlon",
            "Fashion Flex": "/register/fashion-flex",
            "Hackastra": "/register/hackastra",
            "Fun Fusion": "/register/fun-fusion"
        };
        return pathMap[eventTitle] || "/";
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="event-modal relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-30"
                >
                    <X size={20} />
                </button>

                <div className="relative h-48 sm:h-64">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent z-10" />
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 p-4 sm:p-8 z-20">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${event.color} text-white mb-3`}>
                            {event.category}
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">{event.title}</h2>
                    </div>
                </div>

                <div className="p-4 sm:p-6 md:p-8 pt-0">
                    <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                        {event.description}
                    </p>

                    <div className={`grid grid-cols-2 ${event.prize ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 sm:gap-6 mb-6 sm:mb-8`}>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center"><Calendar size={14} className="mr-1" /> Date</span>
                            <span className="text-white font-medium text-sm sm:text-base">{event.date}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center"><MapPin size={14} className="mr-1" /> Venue</span>
                            <span className="text-white font-medium text-sm sm:text-base">{event.venue}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center"><Users size={14} className="mr-1" /> Team Size</span>
                            <span className="text-white font-medium text-sm sm:text-base">{event.teamSize}</span>
                        </div>
                        {event.prize && (
                            <div className="flex flex-col">
                                <span className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center"><Trophy size={14} className="mr-1" /> Prize</span>
                                <span className="text-white font-medium text-neon-purple text-sm sm:text-base">{event.prize}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => onViewRules(event.id)}
                            className="block w-full py-3 sm:py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white text-center font-bold font-orbitron tracking-wider rounded-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                        >
                            <FileText size={18} />
                            VIEW RULES
                        </button>
                        <button
                            onClick={() => navigate(getRegistrationPath(event.title))}
                            className="block w-full py-3 sm:py-4 bg-gradient-to-r from-neon-purple to-cyber-blue text-white text-center font-bold font-orbitron tracking-wider rounded-xl hover:opacity-90 transition-opacity text-sm sm:text-base"
                        >
                            REGISTER NOW
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Events = () => {
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rulesEventId, setRulesEventId] = useState(null);
    const containerRef = useRef(null);

    // Auto-trigger hover effects on mobile when scrolling
    useScrollHover('.event-card', { threshold: 0.5, removeOnExit: true });

    const getRegistrationPath = (eventTitle) => {
        const pathMap = {
            "BGMI Esports Tournament": "/register/bgmi",
            "Free Fire Esports Tournament": "/register/freefire",
            "Tech Triathlon": "/register/tech-triathlon",
            "Fashion Flex": "/register/fashion-flex",
            "Hackastra": "/register/hackastra",
            "Fun Fusion": "/register/fun-fusion"
        };
        return pathMap[eventTitle] || "/";
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Section Title Animation
            gsap.from(".events-title", {
                scrollTrigger: {
                    trigger: ".events-title",
                    start: "top 85%",
                    end: "bottom 60%",
                    scrub: 1,
                },
                y: 50,
                opacity: 0,
                scale: 0.9,
            });

            // Individual Left Side Event Cards Animation
            document.querySelectorAll(".event-left-card").forEach((card) => {
                gsap.from(card, {
                    x: -100,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 70%",
                        toggleActions: "play reverse play reverse"
                    }
                });
            });

            // Individual Right Side Event Cards Animation
            document.querySelectorAll(".event-right-card").forEach((card) => {
                gsap.from(card, {
                    x: 100,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 70%",
                        toggleActions: "play reverse play reverse"
                    }
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="events" className="relative py-20 px-4 md:px-10 min-h-screen bg-void-black" ref={containerRef}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-cyber-blue/15 rounded-full blur-[120px]" />
                <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-16 events-title">
                    <h2 className="text-cyber-blue tracking-[0.3em] text-sm font-bold mb-2 uppercase">Explore The Unknown</h2>
                    <h3 className="text-4xl md:text-5xl font-orbitron font-bold text-white neon-text">
                        EVENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyber-blue">HORIZON</span>
                    </h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent mx-auto mt-6"></div>
                </div>

                <div className="events-grid grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
                    {/* Left Column - Events sliding from left */}
                    <div className="events-left space-y-8">
                        {eventsData.filter((_, index) => index % 2 === 0).map((event) => (
                            <EventCardLeft key={event.id} event={event} onClick={setSelectedEvent} />
                        ))}
                    </div>

                    {/* Right Column - Events sliding from right */}
                    <div className="events-right space-y-8">
                        {eventsData.filter((_, index) => index % 2 === 1).map((event) => (
                            <EventCardRight key={event.id} event={event} onClick={setSelectedEvent} />
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {selectedEvent && (
                    <EventModal
                        event={selectedEvent}
                        navigate={navigate}
                        onClose={() => {
                            // Scroll to events section when closing
                            const eventsSection = document.getElementById('events');
                            if (eventsSection) {
                                eventsSection.scrollIntoView({ behavior: 'smooth' });
                            }
                            setSelectedEvent(null);
                        }}
                        onViewRules={(eventId) => {
                            setRulesEventId(eventId);
                        }}
                    />
                )}
                {rulesEventId && (
                    <RulesModal
                        eventId={rulesEventId}
                        onClose={() => {
                            // Scroll to events section when closing
                            const eventsSection = document.getElementById('events');
                            if (eventsSection) {
                                eventsSection.scrollIntoView({ behavior: 'smooth' });
                            }
                            setRulesEventId(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Events;
