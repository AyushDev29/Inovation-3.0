import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const rulesData = {
    1: { // BGMI Tournament
        title: "BGMI Esports Tournament",
        sections: [
            {
                heading: "Match Details",
                items: [
                    "Mode: Squad (TPP)",
                    "Team: 4 players",
                    "Time: 09:00 AM – 12:00 PM",
                    "Mobile only",
                    "Join lobby 10 minutes early"
                ]
            },
            {
                heading: "Rules",
                items: [
                    "No emulators, tablets, triggers",
                    "No cheating, teaming, or glitches",
                    "Maps must be pre-downloaded",
                    "No restart for individual disconnects",
                    "Toxic behavior = ban",
                    "Admin decision is final"
                ]
            }
        ]
    },
    2: { // Free Fire Tournament
        title: "Free Fire Esports Tournament",
        sections: [
            {
                heading: "Match Details",
                items: [
                    "Mode: Clash Squad (4v4)",
                    "Team: 4 players (+1 optional substitute)",
                    "Platform: Mobile only",
                    "College ID mandatory",
                    "Report 10 minutes early"
                ]
            },
            {
                heading: "Room Settings",
                items: [
                    "Default coins: 1500 | HP: 200",
                    "Skills & gun attributes: ON",
                    "Limited ammo: ON | Airdrop: OFF"
                ]
            },
            {
                heading: "Rules",
                items: [
                    "No emulators, tablets, triggers, or mods",
                    "No hacks, glitches, or unfair play",
                    "Same IGN & UID as registration",
                    "No restarts for individual disconnects",
                    "Toxic behavior = ban",
                    "Organizer's decision is final"
                ]
            }
        ]
    },
    3: { // Blind Typing
        title: "Blind Typing Competition",
        sections: [
            {
                heading: "Format",
                items: [
                    "3 Rounds | 100 points each",
                    "Total score: 300"
                ]
            },
            {
                heading: "Rounds",
                items: [
                    "Blind Typing – Speed & accuracy",
                    "Error Out – Identify & fix code errors",
                    "Logic Building – Write correct & efficient code"
                ]
            },
            {
                heading: "Rules",
                items: [
                    "Clean, readable code required",
                    "Language will be specified",
                    "Tie-breaker: Higher Round 3 score",
                    "Judges' decision is final"
                ]
            }
        ]
    },
    4: { // Ramp Walk
        title: "Fashion Flex – Style Your Way (Ramp Walk)",
        sections: [
            {
                heading: "Event Structure",
                items: [
                    "2 Rounds",
                    "Round 1: Duo Ramp Walk (1–2 min)",
                    "Round 2: Q&A (Shortlisted duos only, 1 min)"
                ]
            },
            {
                heading: "Performance Guidelines",
                items: [
                    "Duo participation only",
                    "Attire: Traditional / Western / Fusion / Creative (college-appropriate)",
                    "Focus on coordination, creativity, confidence & stage presence",
                    "Props allowed (safe only)",
                    "Background music must be submitted in advance"
                ]
            },
            {
                heading: "Q&A Topics",
                items: [
                    "Outfit concept & styling",
                    "Confidence, values & opinions",
                    "Simple situational questions"
                ]
            },
            {
                heading: "Rules",
                items: [
                    "Vulgar/offensive outfits strictly prohibited",
                    "Maintain discipline & decorum",
                    "Report 15 minutes early",
                    "Follow time limits",
                    "Rule violation = disqualification",
                    "Judges' decision is final"
                ]
            },
            {
                heading: "Judging Criteria",
                items: [
                    "Outfit & styling",
                    "Creativity & coordination",
                    "Walk, posture & expressions",
                    "Confidence & stage presence",
                    "Q&A response",
                    "Overall presentation"
                ]
            }
        ]
    },
    5: { // Hackathon
        title: "Hackathon",
        sections: [
            {
                heading: "Participation",
                items: [
                    "Teams of 4 members",
                    "Separate registration required",
                    "College ID mandatory"
                ]
            },
            {
                heading: "Rules",
                items: [
                    "Problem statements given on the spot",
                    "No pre-made or copied projects",
                    "Only DeepSeek AI allowed",
                    "Allowed tools: VS Code, Jupyter, Notepad++",
                    "Mobile allowed for login only",
                    "Misbehavior = disqualification",
                    "Judges' decision is final"
                ]
            }
        ]
    },
    6: { // Fun Fusion
        title: "Fun Fusion (Surprise Games)",
        sections: [
            {
                heading: "Format",
                items: [
                    "3 surprise rounds (revealed on the spot)"
                ]
            },
            {
                heading: "Rules",
                items: [
                    "Be punctual & disciplined",
                    "Keep it decent (no offense)",
                    "Volunteer's decision is final",
                    "Encourage others & enjoy",
                    "Have fun — that's the rule"
                ]
            }
        ]
    }
};

const RulesModal = ({ eventId, onClose }) => {
    const rules = rulesData[eventId];

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Handle ESC key
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!rules) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="rules-modal relative w-full max-w-4xl bg-[#0a0a0a] border border-cyber-blue/30 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-cyber-blue/20 p-6 pt-20 flex items-center justify-between z-10">
                    <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white">
                        {rules.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {rules.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="space-y-4">
                            <h3 className="text-xl font-orbitron font-bold text-cyber-blue border-l-4 border-neon-purple pl-4">
                                {section.heading}
                            </h3>
                            <ul className="space-y-2 ml-4">
                                {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="flex items-start gap-3 text-gray-300">
                                        <div className="w-2 h-2 bg-cyber-blue rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gradient-to-t from-[#0a0a0a] to-transparent p-6 pt-12">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm mb-4">
                            For any queries, contact the event organizers
                        </p>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-gradient-to-r from-cyber-blue to-neon-purple text-white font-orbitron font-bold rounded-xl hover:opacity-90 transition-opacity"
                        >
                            GOT IT
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RulesModal;