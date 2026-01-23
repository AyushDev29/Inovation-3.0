import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const rulesData = {
    1: { // BGMI Tournament
        title: "BGMI Esports Tournament",
        sections: [
            {
                heading: "Prize Pool & Event Essentials",
                items: [
                    "🏆 Prize Pool: ₹7,000",
                    "Time: 09:00 AM – 12:00 PM",
                    "Mode: Squad (Third Person Perspective)",
                    "Platform: Mobile devices only",
                    "Team Size: 4 players",
                    "Total Teams: Approximately 65 teams",
                    "Lobby Timing: Teams must be in the lobby 10 minutes prior to the start time",
                    "Room Details: Room ID and Password will be shared 10 minutes before the match via the official group"
                ]
            },
            {
                heading: "Player Eligibility and Device Restrictions",
                items: [
                    "Device Restriction: Handheld mobile devices only",
                    "Tablets, iPads, Emulators, Triggers, GFX Tools and other third party app involvement are strictly prohibited",
                    "Identity: Players must use the exact In-Game Name provided during registration",
                    "Smurfing (playing on another account) is not allowed and will result in disqualification"
                ]
            },
            {
                heading: "General Rules and Fair Play",
                items: [
                    "Fair Play: Cheating, scripting, or third-party tools result in immediate disqualification",
                    "Teaming: Collaborating with opponents is strictly banned",
                    "Map Downloads: Ensure all maps (Erangel, Miramar, Sanhok) are downloaded before joining",
                    "Glitches: Exploiting game bugs (e.g., rock glitches) is prohibited"
                ]
            },
            {
                heading: "Technical Guidelines and Code of Conduct",
                items: [
                    "Disconnects: Matches will not restart for individual disconnects. Restarts occur only for global server failures",
                    "Ping/Lag: Players are responsible for their own internet connection",
                    "Behavior: Toxic language, slurs, or harassment in All-Chat or groups leads to a ban",
                    "Organizer's Decision: The organizer's decision is final in all disputes and no arguments will not been entertained with the orgainizers "
                ]
            }
        ]
    },
    2: { // Free Fire Tournament
        title: "Free Fire Esports Tournament",
        sections: [
            {
                heading: "Prize Pool & Event Essentials",
                items: [
                    "🏆 Prize Pool: ₹3,000",
                    "Mode: Clash Squad (4v4)",
                    "Platform: Mobile devices only",
                    "Team Size: 4 players",
                    "Tournament Format: Clash Squad mode",
                    "Timing: Teams must be reached in the provided classroom, 10 minutes prior to the scheduled slot",
                    "Room Details: Room ID and Password will be shared on the spot",
                    "Entry Requirement: College ID is mandatory. No ID = No Entry"
                ]
            },
            {
                heading: "Standard Room Settings",
                items: [
                    "Default Coin: 1500",
                    "HP: 200",
                    "Character Skills: YES (Subject to change based on organizer discretion)",
                    "Gun Attributes/Properties: YES",
                    "Limited Ammo: YES",
                    "Airdrop: NO"
                ]
            },
            {
                heading: "Player Eligibility and Device Restrictions",
                items: [
                    "Device Restriction: Handheld mobile devices only",
                    "Strictly Prohibited: Tablets, iPads, Emulators (PC), Triggers, and shoulder buttons",
                    "Identity: Players must use the exact In-Game Name and UID provided during registration",
                    "Smurfing (playing on someone else's account) will lead to disqualification"
                ]
            },
            {
                heading: "General Rules and Technical Guidelines",
                items: [
                    "Fair Play: Any use of hacks, scripts, GFX tools, or modified game files will result in immediate team disqualification",
                    "Glitches: Exploiting game bugs is strictly prohibited. No wall glitches (hiding inside gloo walls) or map glitches (going under the map)",
                    "Map Downloads: Players must ensure the Bermuda and Alpine maps are downloaded before joining to avoid Download Center errors",
                    "Disconnects: The match will not restart if an individual player disconnects or crashes. Restarts occur only if the lobby crashes globally",
                    "Ping/Lag: Players are responsible for their own data connection. High ping is not grounds for a rematch"
                ]
            },
            {
                heading: "Code of Conduct",
                items: [
                    "Behavior: Toxic language, slurs, or harassment in All-Chat (Mic/Text) or WhatsApp groups leads to an immediate ban",
                    "Punctuality: Late entry is not allowed. If a team is not present when the match starts, it is an automatic forfeit",
                    "Organizer's Decision: The organizer's decision regarding points, disqualification, or disputes is final and binding"
                ]
            }
        ]
    },
    3: { // Tech Triathlon
        title: "Tech Triathlon",
        sections: [
            {
                heading: "Competition Format",
                items: [
                    "Individual participation only",
                    "Three rounds: Typing Speed, Debugging Challenge, Logic Problem Solving",
                    "Time: 11:00 AM – 12:00 PM",
                    "Venue: Computer Laboratory",
                    "Each round carries 100 points",
                    "The total score (out of 300) will decide the final winner",
                    "In case of a tie, the participant with the higher Round 3 score will be ranked higher"
                ]
            },
            {
                heading: "Round 1: Blind Typing (100 Points)",
                items: [
                    "Participants must type the given paragraph on a blank screen",
                    "Accuracy and typing speed will both be considered for scoring",
                    "The time limit will be fixed and announced before the round begins",
                    "Participants must write solutions clearly and neatly; code readability will be considered"
                ]
            },
            {
                heading: "Round 2: Error Out (100 Points)",
                items: [
                    "Participants will be given code containing syntax errors and logical errors",
                    "They must identify the error and write the corrected version of the code",
                    "The programming language will be specified before the round",
                    "Marks depend on how accurately the mistake is identified and how correctly the error is fixed",
                    "Explanations are optional, unless specifically asked"
                ]
            },
            {
                heading: "Round 3: Logic Building (100 Points)",
                items: [
                    "Participants will be given 2–3 logical problems",
                    "They must write complete and working code for the given problems",
                    "The specified programming language must be strictly followed",
                    "Marks will be awarded based on logical correctness, code efficiency, and proper use of syntax",
                    "Code must be error-free and executable",
                    "Proper indentation and readability will be considered during evaluation"
                ]
            },
            {
                heading: "General Rules",
                items: [
                    "Judges' decisions regarding evaluation, scoring, and penalties will be final and binding",
                    "Hacks, scripts, automated tools, or external assistance result in immediate disqualification",
                    "No use of external devices, references, or internet resources during competition",
                    "All work must be original and completed individually",
                    "Technical issues must be reported immediately to supervisors"
                ]
            }
        ]
    },
    4: { // Fashion Flex
        title: "Fashion Flex",
        sections: [
            {
                heading: "Event Structure",
                items: [
                    "The event will be conducted in two rounds",
                    "Only duo participation is allowed (2 members per team)",
                    "Time: 11:00 AM – 1:00 PM",
                    "Venue: Main Auditorium",
                    "Report 15 minutes before the event"
                ]
            },
            {
                heading: "Round 1: Ramp Walk",
                items: [
                    "Participants must perform in pairs (duo only)",
                    "Time limit: 1–2 minutes per duo",
                    "Any decent attire allowed (traditional / western / fusion / creative)",
                    "Performance should highlight coordination, creativity, confidence and stage presence",
                    "BGM must be provided by participants in advance",
                    "Props are allowed (must be safe and non-damaging)"
                ]
            },
            {
                heading: "Round 2: Question & Answer",
                items: [
                    "Only shortlisted duos will qualify for this round",
                    "Time limit to answer: 1 minute",
                    "Questions based on: Outfit/styling/concept, Confidence/thoughts/values, Simple situational or opinion-based topics"
                ]
            },
            {
                heading: "Rules & Regulations",
                items: [
                    "Only duo participation is allowed",
                    "Outfits must be appropriate for a college event",
                    "Vulgar, offensive or revealing outfits are strictly prohibited",
                    "Props must be safe and non-damaging",
                    "BGM must be submitted before the event",
                    "Maintain discipline and decorum",
                    "Rule violation may lead to disqualification",
                    "Time limits must be followed",
                    "Judges decision will be final"
                ]
            },
            {
                heading: "Judging Criteria",
                items: [
                    "Outfit & Styling",
                    "Creativity & Duo Coordination",
                    "Confidence & Stage Presence",
                    "Walk, Posture & Expressions",
                    "Q&A Response",
                    "Overall Presentation"
                ]
            }
        ]
    },
    5: { // Hackastra
        title: "Hackastra",
        sections: [
            {
                heading: "Team Requirements",
                items: [
                    "Students can participate in teams of 2-3 members",
                    "Minimum team size: 2 members",
                    "Maximum team size: 3 members", 
                    "Solo participation is not allowed",
                    "Each participant must register separately and mention their team name",
                    "Online registration is compulsory and must be done before the deadline",
                    "Participants must bring their college ID card on the event day"
                ]
            },
            {
                heading: "Challenge Format and Rules",
                items: [
                    "Problem statements will be given on the spot when the hackathon starts",
                    "Projects should be started only after the hackathon begins",
                    "Using old or pre-made projects is not allowed",
                    "Students must follow college IT rules",
                    "Any illegal access or unethical activity will result in disqualification",
                    "Fighting, arguing, or misbehaving with volunteers or organizers is strictly not allowed"
                ]
            },
            {
                heading: "Technical Guidelines",
                items: [
                    "Only DeepSeek AI is allowed for assistance",
                    "Allowed coding tools/editors: VS Code, Jupyter Notebook, Notepad++",
                    "Copied or pre-made projects will be disqualified",
                    "If using college systems: Participants must bring a pre-loaded pendrive with necessary tools & tech stack (e.g., VS Code, Node.js, MongoDB, etc.)",
                    "A USB cable is required for data access",
                    "Participants can bring their own systems (preferred): machines will also be provided",
                    "Mobile phones are permitted for login purposes only"
                ]
            },
            {
                heading: "Final Rules",
                items: [
                    "Judge's Decision: The decision of the judges will be final",
                    "Time management and collaboration skills essential",
                    "Teams must present and defend their solutions to judges",
                    "Original thinking and creative problem-solving approaches are highly encouraged",
                    "Judge evaluation focuses on innovation, technical merit, and presentation quality"
                ]
            }
        ]
    },
    6: { // Fun Fusion
        title: "Fun Fusion",
        sections: [
            {
                heading: "Event Format",
                items: [
                    "3 Rounds of Surprise Games, Revealed on the Spot!",
                    "Team size: 4-6 members",
                    "Mixed participation encouraged",
                    "Time: 12:00 PM – 2:00 PM",
                    "Venue: Activity Zone",
                    "Multiple indoor game stations and team challenges"
                ]
            },
            {
                heading: "Fun Fusion Rules",
                items: [
                    "Maintain Discipline: Keep it fun, keep it cool",
                    "Be Punctual: Show up on time, don't make us wait",
                    "Volunteer's Decision is Final: Trust the volunteer, they're the boss",
                    "Keep It PG-ish: Fun Fusion's all about fun, keep it decent",
                    "Laugh It Off: If someone messes up, laugh together",
                    "Encourage Others: Make sure everyone joins in",
                    "Have Fun!: That's the ultimate rule",
                    "NO OFFENSE: Maintain the Fun Decorum"
                ]
            },
            {
                heading: "Activity Structure",
                items: [
                    "Rotation system between different activity zones",
                    "Points accumulated across all challenge stations",
                    "Team coordination and strategy important for success",
                    "Fun and engaging activities designed for all skill levels",
                    "All team members must participate actively in challenges"
                ]
            },
            {
                heading: "Participation Guidelines",
                items: [
                    "Fair play and sportsmanship expected from all participants",
                    "Cheating, rule violations, or unsportsmanlike behavior results in point deductions or disqualification",
                    "Respect for other teams and activity coordinators is mandatory",
                    "Safety guidelines must be followed at all activity stations",
                    "Disputes or rule clarifications should be addressed to activity supervisors immediately",
                    "Positive attitude and team spirit are encouraged throughout the competition"
                ]
            }
        ]
    }
};

const RulesModal = ({ eventId, onClose }) => {
    const rules = rulesData[eventId];

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!rules) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-white/10 p-4 md:p-6 z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg md:text-xl font-orbitron font-bold text-white">
                                    {rules.title}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">Rules & Guidelines</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        {rules.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="space-y-4">
                                {/* Section Header */}
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-6 bg-gradient-to-b from-cyber-blue to-neon-purple rounded-full"></div>
                                    <h3 className="text-lg font-bold text-cyber-blue font-orbitron">
                                        {section.heading}
                                    </h3>
                                </div>

                                {/* Section Items */}
                                <div className="ml-4 space-y-3">
                                    {section.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="flex items-start gap-3 group">
                                            <div className="w-2 h-2 bg-neon-purple rounded-full mt-2 flex-shrink-0 group-hover:bg-cyber-blue transition-colors"></div>
                                            <p className="text-gray-300 leading-relaxed text-sm md:text-base group-hover:text-white transition-colors">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Warning Footer */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-400 text-sm font-bold">⚠</span>
                                </div>
                                <p className="text-red-400 font-medium text-sm">
                                    Violation of any rules will result in immediate disqualification. 
                                    All decisions made by judges are final.
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-gradient-to-r from-neon-purple to-cyber-blue text-white font-bold font-orbitron tracking-wider rounded-xl hover:opacity-90 transition-opacity"
                            >
                                GOT IT
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RulesModal;