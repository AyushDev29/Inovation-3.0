import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Trophy } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RegistrationModal from './RegistrationModal';
import useScrollHover from '../hooks/useScrollHover';

gsap.registerPlugin(ScrollTrigger);

const eventsData = [
    {
        id: 1,
        title: "Free Fire Max: Battle Royale",
        category: "E-Sports",
        description: "Survival of the fittest. Drop into the battleground, loot, and outlast your opponents in this intense Battle Royale.",
        date: "Day 1 - 10:00 AM",
        venue: "Gaming Lab A",
        teamSize: "4 Members",
        prize: "₹10,000",
        image: "/images/free_fire.png",
        color: "from-orange-500 to-red-600",
        registrationLink: "" // No longer needed
    },
    {
        id: 2,
        title: "Rocket League: Star Drift",
        category: "E-Sports",
        description: "Soccer meets driving in a zero-g arena. Master the aerials and claim victory among the stars.",
        date: "Day 2 - 11:00 AM",
        venue: "Gaming Lab B",
        teamSize: "3 Members",
        prize: "₹5,000",
        image: "/images/rocket_league.png",
        color: "from-blue-500 to-cyan-500",
        registrationLink: ""
    },
    {
        id: 3,
        title: "Orbital Hackathon",
        category: "Technical",
        description: "24-hour coding marathon. Build solutions that solve real-world problems using futuristic tech stacks.",
        date: "Day 1 - 9:00 AM",
        venue: "Main Auditorium",
        teamSize: "2-4 Members",
        prize: "₹20,000",
        image: "/images/hackathon.png",
        color: "from-green-500 to-emerald-600",
        registrationLink: ""
    },
    {
        id: 4,
        title: "Blind Type",
        category: "Technical",
        description: "Test your touch-typing skills. Type accurate code without looking at the screen or seeing what you type.",
        date: "Day 2 - 2:00 PM",
        venue: "Lab 3",
        teamSize: "Individual",
        prize: "₹3,000",
        image: "/images/blind_type.png",
        color: "from-yellow-500 to-amber-600",
        registrationLink: ""
    },
    {
        id: 5,
        title: "Nebula UI/UX",
        category: "Technical",
        description: "Design the interfaces of tomorrow. Create user experiences that are out of this world.",
        date: "Day 1 - 1:00 PM",
        venue: "Design Studio",
        teamSize: "Individual",
        prize: "₹4,000",
        image: "/images/ui_ux.png",
        color: "from-purple-500 to-pink-600",
        registrationLink: ""
    },
    {
        id: 6,
        title: "Cyber-Security CTF",
        category: "Technical",
        description: "Capture The Flag. Hack your way through security layers and find the hidden flags.",
        date: "Day 2 - 10:00 AM",
        venue: "Cyber Lab",
        teamSize: "2 Members",
        prize: "₹6,000",
        image: "/images/cyber_security.png",
        color: "from-indigo-500 to-violet-600",
        registrationLink: ""
    },
    {
        id: 7,
        title: "Tech-Quiz Event Horizon",
        category: "Fun",
        description: "Test your knowledge of the tech universe. From silicon chips to supernovas.",
        date: "Day 1 - 3:00 PM",
        venue: "Seminar Hall",
        teamSize: "2 Members",
        prize: "₹2,000",
        image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1000&auto=format&fit=crop",
        color: "from-orange-500 to-red-500",
        registrationLink: ""
    },
    {
        id: 8,
        title: "Robo-Sumo: Anti-G",
        category: "Fun",
        description: "Battle of the bots. Push your opponent out of the ring in this high-torque showdown.",
        date: "Day 2 - 4:00 PM",
        venue: "Open Arena",
        teamSize: "3-5 Members",
        prize: "₹8,000",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop",
        color: "from-slate-500 to-gray-600",
        registrationLink: ""
    }
];

const EventCardLeft = ({ event, onClick }) => {
    return (
        <div
            className="event-left-card p-6 sm:p-8 border-l-4 border-cyber-blue bg-white/5 backdrop-blur-sm rounded-r-xl hover:bg-white/10 transition-colors duration-300 cursor-pointer group"
            onClick={() => onClick(event)}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-white/10"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${event.color} text-white`}>
                            {event.category}
                        </span>
                        <span className="text-neon-purple font-bold text-sm">
                            {event.prize}
                        </span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-orbitron font-bold text-white mb-2 group-hover:text-cyber-blue transition-colors">
                        {event.title}
                    </h4>
                </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base mb-4">
                {event.description}
            </p>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                    <span>{event.date}</span>
                    <span className="mx-2">•</span>
                    <span>{event.venue}</span>
                </div>
                <div className="flex items-center text-cyber-blue font-medium">
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
            className="event-right-card p-6 sm:p-8 border-r-4 border-neon-purple bg-white/5 backdrop-blur-sm rounded-l-xl text-right hover:bg-white/10 transition-colors duration-300 cursor-pointer group"
            onClick={() => onClick(event)}
        >
            <div className="flex items-start gap-4 mb-4 justify-end">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                        <span className="text-neon-purple font-bold text-sm">
                            {event.prize}
                        </span>
                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${event.color} text-white`}>
                            {event.category}
                        </span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-orbitron font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">
                        {event.title}
                    </h4>
                </div>
                <div className="flex-shrink-0">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-white/10"
                    />
                </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base mb-4">
                {event.description}
            </p>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-neon-purple font-medium">
                    <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span>View Details</span>
                </div>
                <div className="flex items-center text-gray-500">
                    <span>{event.venue}</span>
                    <span className="mx-2">•</span>
                    <span>{event.date}</span>
                </div>
            </div>
        </div>
    );
};

const EventModal = ({ event, onClose, onRegister }) => {
    if (!event) return null;

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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center"><Trophy size={14} className="mr-1" /> Prize</span>
                            <span className="text-white font-medium text-neon-purple text-sm sm:text-base">{event.prize}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onRegister(event)}
                        className="block w-full py-3 sm:py-4 bg-gradient-to-r from-neon-purple to-cyber-blue text-white text-center font-bold font-orbitron tracking-wider rounded-xl hover:opacity-90 transition-opacity text-sm sm:text-base"
                    >
                        REGISTER NOW
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Events = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registeringEvent, setRegisteringEvent] = useState(null);
    const containerRef = useRef(null);

    // Auto-trigger hover effects on mobile when scrolling
    useScrollHover('.event-card', { threshold: 0.5, removeOnExit: true });

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
                        onClose={() => setSelectedEvent(null)}
                        onRegister={(event) => {
                            setSelectedEvent(null);
                            setRegisteringEvent(event);
                        }}
                    />
                )}
                {registeringEvent && (
                    <RegistrationModal
                        event={registeringEvent}
                        onClose={() => setRegisteringEvent(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Events;
