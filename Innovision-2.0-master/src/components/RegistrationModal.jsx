import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

const RegistrationModal = ({ event, onClose }) => {
    const isFreeFire = event.title.includes("Free Fire");
    const isTeamEvent = isFreeFire || event.title.includes("Hackathon");

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-8 my-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
                        Register for <span className="text-neon-purple">{event.title}</span>
                    </h2>
                    <p className="text-gray-400 text-sm">Fill in your details to secure your spot.</p>
                </div>

                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <CheckCircle size={64} className="text-green-500 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
                        <p className="text-gray-300">{message}</p>
                        <button
                            onClick={onClose}
                            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status === 'error' && (
                            <div className="flex items-start p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                                <AlertCircle size={16} className="mr-2 mt-0.5" />
                                <span>{message}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase tracking-wider ml-1">
                                {isFreeFire ? "IGL Name" : (isTeamEvent ? "Leader Name" : "Full Name")}
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                placeholder={isFreeFire ? "Enter IGL Name" : (isTeamEvent ? "Enter Leader Name" : "Enter your full name")}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider ml-1">
                                    {isFreeFire ? "IGL Email" : (isTeamEvent ? "Leader Email" : "Email")}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider ml-1">
                                    {isFreeFire ? "IGL Phone" : (isTeamEvent ? "Leader Phone" : "Phone")}
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="Number"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider ml-1">Class</label>
                                <input
                                    type="text"
                                    name="class"
                                    required
                                    value={formData.class}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="e.g. SYBSCIT"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase tracking-wider ml-1">College</label>
                                <input
                                    type="text"
                                    name="college"
                                    required
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="College Name"
                                />
                            </div>
                        </div>

                        {/* Team Specific Fields */}
                        {isTeamEvent && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider ml-1">Team Name</label>
                                    <input
                                        type="text"
                                        name="team_name"
                                        required
                                        value={formData.team_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder="Enter Team Name"
                                    />
                                </div>
                                <div className="space-y-3 pt-2">
                                    <span className="text-sm font-semibold text-white">
                                        {isFreeFire ? "Squad Members" : "Team Members"}
                                    </span>
                                    <input
                                        type="text"
                                        name="player2_name"
                                        required
                                        value={formData.player2_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder={isFreeFire ? "Player 2 Name" : "Member 2 Name"}
                                    />
                                    <input
                                        type="text"
                                        name="player3_name"
                                        required
                                        value={formData.player3_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder={isFreeFire ? "Player 3 Name" : "Member 3 Name"}
                                    />
                                    <input
                                        type="text"
                                        name="player4_name"
                                        required={isFreeFire ? true : false}
                                        value={formData.player4_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder={isFreeFire ? "Player 4 Name" : "Member 4 Name (Optional)"}
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-3 bg-gradient-to-r from-neon-purple to-cyber-blue text-white font-bold font-orbitron tracking-wider rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'REGISTERING...' : 'CONFIRM REGISTRATION'}
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
};

export default RegistrationModal;
