import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Users, Calendar, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scheduleData = {
    "Day 1": {
        date: "5 February 2025",
        events: [
            {
                id: 1,
                name: "BGMI Tournament",
                category: "E-Sports",
                time: "9:00 AM - 12:00 PM",
                venue: "College Campus",
                teamSize: "4 Members",
                color: "from-orange-500 to-red-600"
            },
            {
                id: 2,
                name: "Ramp Walk",
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
                name: "BGMI Tournament",
                category: "E-Sports",
                time: "9:00 AM - 12:00 PM",
                venue: "College Campus",
                teamSize: "4 Members",
                color: "from-orange-500 to-red-600"
            },
            {
                id: 4,
                name: "Blind Typing",
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
                name: "Free Fire Tournament",
                category: "E-Sports",
                time: "9:00 AM - 11:00 AM",
                venue: "College Campus",
                teamSize: "4 Members",
                color: "from-blue-500 to-cyan-500"
            },
            {
                id: 7,
                name: "Hackathon",
                category: "Technical",
                time: "11:00 AM - 2:00 PM",
                venue: "Seminar Hall",
                teamSize: "2-4 Members",
                color: "from-green-500 to-emerald-600"
            }
        ]
    }
};

const EventCard = ({ event, index, isLeft }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        
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
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, [index, isLeft]);

    return (
        <motion.div
            ref={cardRef}
            whileHover={{ scale: 1.03, y: -5 }}
            className={`relative group ${isLeft ? 'mr-auto' : 'ml-auto'} w-full sm:w-[85%] md:w-[75%] lg:w-[45%]`}
        >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${event.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`}></div>
            
            {/* Card */}
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-white/30 transition-all duration-300">
                {/* Category Badge */}
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

                {/* Event Name */}
                <h3 className="text-base sm:text-lg md:text-xl font-orbitron font-bold text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyber-blue group-hover:to-neon-purple transition-all">
                    {event.name}
                </h3>

                {/* Event Details */}
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

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-cyber-blue/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
        </motion.div>
    );
};

const Schedule = () => {
    const [selectedDay, setSelectedDay] = useState("Day 1");
    const sectionRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title animation
            gsap.from(".schedule-title", {
                opacity: 0,
                y: -30,
                duration: 0.8,
                ease: "power3.out"
            });

            // Day tabs animation
            gsap.from(".day-tab", {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.5,
                delay: 0.3,
                ease: "power2.out"
            });

            // Timeline animation
            gsap.from(timelineRef.current, {
                scaleY: 0,
                transformOrigin: "top",
                duration: 1,
                delay: 0.5,
                ease: "power2.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Animate timeline dots
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

    return (
        <section id="schedule" ref={sectionRef} className="relative min-h-screen py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 lg:px-10 bg-void-black overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-neon-purple/20 rounded-full blur-[100px] sm:blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-cyber-blue/15 rounded-full blur-[100px] sm:blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
            </div>

            <div className="container mx-auto relative z-10 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12 md:mb-16 schedule-title">
                    <h2 className="text-cyber-blue tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs md:text-sm font-bold mb-2 sm:mb-3 uppercase">
                        Timeline
                    </h2>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold text-white mb-2 sm:mb-3">
                        EVENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-cyber-blue">SCHEDULE</span>
                    </h3>
                    <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-cyber-blue to-transparent mx-auto mt-3 sm:mt-4 md:mt-6"></div>
                </div>

                {/* Day Selector */}
                <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 md:mb-16 flex-wrap">
                    {Object.keys(scheduleData).map((day) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`day-tab px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-orbitron font-bold text-xs sm:text-sm md:text-base tracking-wider transition-all duration-300 ${
                                selectedDay === day
                                    ? 'bg-gradient-to-r from-neon-purple to-cyber-blue text-white shadow-lg shadow-neon-purple/50 scale-105'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Date Display */}
                <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-10 md:mb-12"
                >
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg font-medium">
                        {currentSchedule.date}
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Center Line */}
                    <div 
                        ref={timelineRef}
                        className="absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-full bg-gradient-to-b from-cyber-blue via-neon-purple to-cyber-blue hidden lg:block"
                    ></div>

                    {/* Events */}
                    <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
                        <AnimatePresence mode="wait">
                            {currentSchedule.events.map((event, index) => {
                                const isLeft = index % 2 === 0;
                                
                                return (
                                    <div key={event.id} className="relative">
                                        {/* Timeline Dot (Desktop only) */}
                                        <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                            <div className="timeline-dot w-4 h-4 rounded-full bg-gradient-to-r from-cyber-blue to-neon-purple shadow-lg shadow-cyber-blue/50"></div>
                                            <div className="absolute inset-0 w-4 h-4 rounded-full bg-gradient-to-r from-cyber-blue to-neon-purple animate-ping opacity-75"></div>
                                        </div>

                                        {/* Event Card */}
                                        <EventCard event={event} index={index} isLeft={isLeft} />
                                    </div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Schedule;
