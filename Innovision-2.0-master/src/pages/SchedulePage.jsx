import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Users, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const scheduleData = {
    "Day 1": {
        date: "5 February 2025",
        events: [
            {
                id: 1,
                name: "BGMI Esports Tournament",
                category: "E-Sports",
                time: "9:00 AM - 12:00 PM",
                venue: "College Campus",
                teamSize: "4 Members",
                color: "from-orange-500 to-red-600"
            },
            {
                id: 2,
                name: "Fashion Flex",
                category: "Fun / Cultural",
                time: "11:00 AM - 1:00 PM",
                venue: "Auditorium",
                teamSize: "Individual",
                color: "from-purple-500 to-pink-600"
            }
        ]
    },
    "Day 2": {
        date: "6 February 2025",
        events: [
            {
                id: 3,
                name: "BGMI Esports Tournament",
                category: "E-Sports",
                time: "9:00 AM - 12:00 PM",
                venue: "College Campus",
                teamSize: "4 Members",
                color: "from-orange-500 to-red-600"
            },
            {
                id: 4,
                name: "Tech Triathlon",
                category: "Technical / Fun",
                time: "11:00 AM - 12:00 PM",
                venue: "Computer Lab",
                teamSize: "Individual",
                color: "from-yellow-500 to-amber-600"
            },
            {
                id: 5,
                name: "Fun Fusion",
                category: "Fun",
                time: "12:00 PM - 2:00 PM",
                venue: "Activity Zone",
                teamSize: "4-6 Members",
                color: "from-indigo-500 to-violet-600"
            }
        ]
    },
    "Day 3": {
        date: "7 February 2025",
        events: [
            {
                id: 6,
                name: "Free Fire Esports Tournament",
                category: "E-Sports",
                time: "9:00 AM - 11:00 AM",
                venue: "College Campus",
                teamSize: "4 Members",
                color: "from-blue-500 to-cyan-500"
            },
            {
                id: 7,
                name: "Hackastra",
                category: "Technical",
                time: "11:00 AM - 2:00 PM",
                venue: "Seminar Hall",
                teamSize: "2-3 Members",
                color: "from-green-500 to-emerald-600"
            }
        ]
    }
};

const EventCard = ({ event, index, isLeft }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        
        gsap.fromTo(card,
            {
                opacity: 0,
                x: isLeft ? -100 : 100,
                scale: 0.9
            },
            {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.6,
                delay: index * 0.15,
                ease: "power3.out"
            }
        );
    }, [index, isLeft]);

    return (
        <motion.div
            ref={cardRef}
            whileHover={{ scale: 1.03, y: -5 }}
            className={`relative group ${isLeft ? 'mr-auto' : 'ml-auto'} w-full sm:w-[85%] md:w-[75%] lg:w-[45%]`}
        >
            <div className={`absolute inset-0 bg-gradient-to-r ${event.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`}></div>
            
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-white/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className={`inline-block px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold rounded-full bg-gradient-to-r ${event.color} text-white`}>
                        {event.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-[10px] sm:text-xs">
                        <Calendar size={12} className="mr-1 sm:mr-1.5" />
                        <span className="hidden sm:inline">Event #{event.id}</span>
                        <span className="sm:hidden">#{event.id}</span>
                    </div>
                </div>

                <h3 className="text-base sm:text-lg md:text-xl font-orbitron font-bold text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyber-blue group-hover:to-neon-purple transition-all">
                    {event.name}
                </h3>

                <div className="space-y-2 sm:space-y-2.5">
                    <div className="flex items-center text-gray-300 text-xs sm:text-sm">
                        <Clock size={14} className="sm:w-4 sm:h-4 mr-2 text-cyber-blue flex-shrink-0" />
                        <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-xs sm:text-sm">
                        <MapPin size={14} className="sm:w-4 sm:h-4 mr-2 text-neon-purple flex-shrink-0" />
                        <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-xs sm:text-sm">
                        <Users size={14} className="sm:w-4 sm:h-4 mr-2 text-green-500 flex-shrink-0" />
                        <span>{event.teamSize}</span>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-cyber-blue/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </motion.div>
    );
};

const SchedulePage = () => {
    const [selectedDay, setSelectedDay] = useState("Day 1");
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);

    // Smooth scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".schedule-title", {
                opacity: 0,
                y: -30,
                duration: 0.8,
                ease: "power3.out"
            });

            // Removed day-tab animation that was causing visibility issues

            if (timelineRef.current) {
                gsap.from(timelineRef.current, {
                    scaleY: 0,
                    transformOrigin: "top",
                    duration: 1,
                    delay: 0.5,
                    ease: "power2.out"
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        gsap.to(".timeline-dot", {
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
            duration: 2,
            stagger: 0.2,
            repeat: -1,
            ease: "power1.inOut"
        });
    }, [selectedDay]);

    const currentSchedule = scheduleData[selectedDay];

    const handleBackToHome = () => {
        // Smooth fade out before navigation
        gsap.to(sectionRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
            onComplete: () => navigate('/')
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen bg-void-black text-white overflow-x-hidden"
        >
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                onClick={handleBackToHome}
                className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg backdrop-blur-md transition-all duration-300 group text-xs sm:text-sm"
            >
                <ArrowLeft size={16} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
            </motion.button>

            <section ref={sectionRef} className="relative min-h-screen py-16 sm:py-20 md:py-24 lg:py-28 px-3 sm:px-4 md:px-6 lg:px-10 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] right-[-5%] w-[250px] sm:w-[350px] md:w-[450px] lg:w-[500px] h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] bg-neon-purple/20 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute bottom-[20%] left-[-5%] w-[250px] sm:w-[350px] md:w-[450px] lg:w-[500px] h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] bg-cyber-blue/15 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
                </div>

                <div className="container mx-auto relative z-10 max-w-7xl">
                    {/* Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 schedule-title"
                    >
                        <h2 className="text-cyber-blue tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] text-[10px] sm:text-xs md:text-sm lg:text-base font-bold mb-2 sm:mb-3 md:mb-4 uppercase">
                            Timeline
                        </h2>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-orbitron font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
                            EVENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyber-blue">SCHEDULE</span>
                        </h3>
                        <div className="w-16 sm:w-20 md:w-24 lg:w-32 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent mx-auto mt-3 sm:mt-4 md:mt-6"></div>
                    </motion.div>

                    {/* Day Selector - HIGHLY VISIBLE */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-8 sm:mb-12 md:mb-16 lg:mb-20 flex-wrap px-2 sm:px-4"
                    >
                        {Object.keys(scheduleData).map((day, index) => (
                            <motion.button
                                key={day}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ 
                                    delay: 0.7 + index * 0.15, 
                                    duration: 0.6,
                                    ease: "easeOut"
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    console.log('Clicked:', day);
                                    setSelectedDay(day);
                                }}
                                className={`day-tab relative px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-lg sm:rounded-xl font-orbitron font-bold text-xs sm:text-sm md:text-base lg:text-lg tracking-wider transition-all duration-300 border-2 ${
                                    selectedDay === day
                                        ? 'bg-gradient-to-r from-neon-purple to-cyber-blue text-white shadow-[0_0_30px_rgba(168,85,247,0.6)] scale-105 sm:scale-110 border-neon-purple'
                                        : 'bg-gray-800 text-white hover:bg-gray-700 border-gray-600 hover:border-gray-400 shadow-lg'
                                }`}
                                style={{ minWidth: '80px' }}
                            >
                                {day}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Date Display */}
                    <motion.div
                        key={selectedDay}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
                    >
                        <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                            {currentSchedule.date}
                        </p>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        <div 
                            ref={timelineRef}
                            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-full bg-gradient-to-b from-cyber-blue via-neon-purple to-cyber-blue hidden lg:block"
                        ></div>

                        <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16 xl:space-y-20">
                            <AnimatePresence mode="wait">
                                {currentSchedule.events.map((event, index) => {
                                    const isLeft = index % 2 === 0;
                                    
                                    return (
                                        <motion.div 
                                            key={event.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ 
                                                duration: 0.5, 
                                                delay: index * 0.08,
                                                ease: "easeOut"
                                            }}
                                            className="relative"
                                        >
                                            <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                                <div className="timeline-dot w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-cyber-blue to-neon-purple shadow-lg shadow-cyber-blue/50"></div>
                                                <div className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-cyber-blue to-neon-purple animate-ping opacity-75"></div>
                                            </div>

                                            <EventCard event={event} index={index} isLeft={isLeft} />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default SchedulePage;
