import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

const RegistrationModal = ({ event, onClose }) => {
    const isBGMI = event.title.includes("BGMI");
    const isFreeFire = event.title.includes("Free Fire");
    const isHackathon = event.title.includes("Hackathon");
    const isFunFusion = event.title.includes("Fun Fusion");
    const isTeamEvent = isBGMI || isFreeFire || isHackathon || isFunFusion;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        class: '',
        college: '',
        team_name: '',
        player2_name: '',
        player3_name: '',
        player4_name: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'
    const [message, setMessage] = useState('');

    // Lock background scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        // Stop Lenis smooth scroll
        const lenisInstance = window.lenis;
        if (lenisInstance) {
            lenisInstance.stop();
        }

        // Handle ESC key to close modal
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        
        return () => {
            document.body.style.overflow = '';
            
            // Restart Lenis
            if (lenisInstance) {
                lenisInstance.start();
            }
            window.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for phone number - only allow digits and max 10
        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: digitsOnly });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        setMessage('');

        try {
            // 1. Get Event ID
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('id')
                .eq('event_name', event.title)
                .single();

            if (eventError || !eventData) {
                console.error("Event mismatch:", event.title);
                throw new Error("Event not found in database. Please contact admin.");
            }

            // 2. Prepare payload
            const payload = {
                name: formData.name, // IGL Name
                email: formData.email, // IGL Email
                phone: formData.phone, // IGL Phone
                class: formData.class,
                college: formData.college,
                event_id: eventData.id
            };

            if (isTeamEvent) {
                payload.team_name = formData.team_name;
                payload.player2_name = formData.player2_name;
                payload.player3_name = formData.player3_name;
                payload.player4_name = formData.player4_name;
            }

            const { error: insertError } = await supabase
                .from('registrations')
                .insert([payload]);

            if (insertError) {
                if (insertError.code === '23505') {
                    throw new Error("You/Team have already registered for this event with this email.");
                }
                throw insertError;
            }

            setStatus('success');
            setMessage('Registration successful! Get ready for the event.');
            setFormData({
                name: '', email: '', phone: '', class: '', college: '',
                team_name: '', player2_name: '', player3_name: '', player4_name: ''
            });

        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative z-[2001] w-full sm:w-[92vw] md:w-[85vw] lg:w-[75vw] xl:w-[65vw] max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] md:max-h-[88vh] lg:max-h-[85vh]"
            >
                {/* Header - Fixed at top */}
                <div className="flex-shrink-0 bg-[#0f0f0f] border-b border-white/10 px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-3.5 md:py-4 flex items-start justify-between rounded-t-xl sm:rounded-t-2xl">
                    <div className="flex-1 pr-2">
                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-orbitron font-bold text-white leading-tight">
                            Register for <span className="text-neon-purple">{event.title}</span>
                        </h2>
                        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm mt-1">Fill in your details to secure your spot.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        <X size={18} className="sm:hidden" />
                        <X size={20} className="hidden sm:block md:hidden" />
                        <X size={22} className="hidden md:block" />
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div 
                    className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 custom-scrollbar"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'contain'
                    }}
                >

                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 text-center">
                                <CheckCircle size={56} className="sm:hidden text-green-500 mb-4" />
                                <CheckCircle size={64} className="hidden sm:block md:hidden text-green-500 mb-4" />
                                <CheckCircle size={72} className="hidden md:block text-green-500 mb-5" />
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Success!</h3>
                                <p className="text-gray-300 text-sm sm:text-base md:text-lg">{message}</p>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm sm:text-base md:text-lg font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
                                {status === 'error' && (
                                    <div className="flex items-start p-3 sm:p-3.5 md:p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-xs sm:text-sm md:text-base">
                                        <AlertCircle size={16} className="sm:hidden mr-2 mt-0.5 flex-shrink-0" />
                                        <AlertCircle size={18} className="hidden sm:block mr-2.5 mt-0.5 flex-shrink-0" />
                                        <span>{message}</span>
                                    </div>
                                )}

                        <div className="space-y-1 sm:space-y-1.5">
                            <label className="text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-wider ml-1">
                                {isFreeFire ? "IGL Name" : (isTeamEvent ? "Leader Name" : "Full Name")}
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                placeholder={isFreeFire ? "Enter IGL Name" : (isTeamEvent ? "Enter Leader Name" : "Enter your full name")}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-wider ml-1">
                                    {isFreeFire ? "IGL Email" : (isTeamEvent ? "Leader Email" : "Email")}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-wider ml-1">
                                    {isFreeFire ? "IGL Phone" : (isTeamEvent ? "Leader Phone" : "Phone")}
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    pattern="[0-9]{10}"
                                    maxLength="10"
                                    minLength="10"
                                    title="Please enter exactly 10 digits"
                                    className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="10-digit number"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-wider ml-1">Class</label>
                                <input
                                    type="text"
                                    name="class"
                                    required
                                    value={formData.class}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="e.g. SYBSCIT"
                                />
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-wider ml-1">College</label>
                                <input
                                    type="text"
                                    name="college"
                                    required
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="College Name"
                                />
                            </div>
                        </div>

                        {/* Team Specific Fields */}
                        {isTeamEvent && (
                            <>
                                <div className="space-y-0.5 sm:space-y-1">
                                    <label className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase tracking-wider ml-1">Team Name</label>
                                    <input
                                        type="text"
                                        name="team_name"
                                        required
                                        value={formData.team_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder="Enter Team Name"
                                    />
                                </div>
                                <div className="space-y-2 sm:space-y-2.5 md:space-y-3 pt-1 sm:pt-1.5 md:pt-2">
                                    <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-white">
                                        {isFreeFire ? "Squad Members" : "Team Members"}
                                    </span>
                                    <input
                                        type="text"
                                        name="player2_name"
                                        required
                                        value={formData.player2_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder={isFreeFire ? "Player 2 Name" : "Member 2 Name"}
                                    />
                                    <input
                                        type="text"
                                        name="player3_name"
                                        required
                                        value={formData.player3_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder={isFreeFire ? "Player 3 Name" : "Member 3 Name"}
                                    />
                                    <input
                                        type="text"
                                        name="player4_name"
                                        required={isFreeFire ? true : false}
                                        value={formData.player4_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-md sm:rounded-lg px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder={isFreeFire ? "Player 4 Name" : "Member 4 Name (Optional)"}
                                    />
                                </div>
                            </>
                        )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-3 sm:mt-4 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-neon-purple to-cyber-blue text-white font-bold font-orbitron tracking-wider rounded-lg sm:rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                                >
                                    {loading ? 'REGISTERING...' : 'CONFIRM REGISTRATION'}
                                </button>
                            </form>
                        )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RegistrationModal;
