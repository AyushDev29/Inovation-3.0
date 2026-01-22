import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const FunFusionRegistration = () => {
    const navigate = useNavigate();
    const event = {
        id: 6,
        title: "Fun Fusion",
        teamSize: "4 Members",
        prize: ""
    };

    // Scroll to top when component mounts (only for form positioning)
    useEffect(() => {
        // Only scroll to top if we're coming from a direct navigation
        // Don't scroll if we're coming from browser back button
        if (window.performance && window.performance.navigation.type !== 2) {
            window.scrollTo(0, 0);
        }
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        class: '',
        college: '',
        roll_no: '',
        team_name: '',
        player2_name: '',
        player2_roll_no: '',
        player2_college: '',
        player3_name: '',
        player3_roll_no: '',
        player3_college: '',
        player4_name: '',
        player4_roll_no: '',
        player4_college: ''
    });
    const [files, setFiles] = useState({
        college_id: null
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for phone number - only allow digits and max 10
        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({
                ...prev,
                [name]: digitsOnly
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload only PDF files');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            setFiles(prev => ({
                ...prev,
                [fieldName]: file
            }));
        }
    };

    const uploadFile = async (file, fileName) => {
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            
            const { data, error } = await supabase.storage
                .from('college-ids')
                .upload(filePath, file);
            
            if (error) throw error;
            return data.path;
        } catch (error) {
            console.error('File upload error:', error);
            throw new Error(`Failed to upload ${fileName}: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        setMessage('');

        try {
            const { data: eventData, error: eventError } = await supabase
                .from('events')
                .select('id')
                .eq('event_name', event.title)
                .single();

            if (eventError) throw new Error('Event not found');

            let uploadedFiles = {};
            
            // Upload file if provided
            if (files.college_id) {
                try {
                    setMessage('Uploading college ID documents...');
                    uploadedFiles.college_id_url = await uploadFile(files.college_id, 'college_id');
                } catch (uploadError) {
                    console.warn('File upload failed, continuing without file:', uploadError);
                    // Continue registration without file upload
                }
            }

            setMessage('Saving registration...');
            
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                class: formData.class,
                college: formData.college,
                roll_no: formData.roll_no,
                event_id: eventData.id,
                team_name: formData.team_name,
                player2_name: formData.player2_name,
                player2_roll_no: formData.player2_roll_no,
                player2_college: formData.player2_college,
                player3_name: formData.player3_name,
                player3_roll_no: formData.player3_roll_no,
                player3_college: formData.player3_college,
                player4_name: formData.player4_name,
                player4_roll_no: formData.player4_roll_no,
                player4_college: formData.player4_college,
                college_id_url: uploadedFiles.college_id_url || null
            };

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
            
        } catch (error) {
            console.error(error);
            setStatus('error');
            setMessage(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void-black flex items-center justify-center p-2 sm:p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm sm:max-w-md bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
                    <div>
                        <h2 className="text-sm sm:text-base font-orbitron font-bold text-white">
                            {event.title}
                        </h2>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                            {event.teamSize}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/#events')}
                        className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <X size={16} className="sm:hidden" />
                        <X size={18} className="hidden sm:block md:hidden" />
                        <X size={20} className="hidden md:block" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                            <CheckCircle size={48} className="sm:hidden text-green-500 mb-3" />
                            <CheckCircle size={56} className="hidden sm:block md:hidden text-green-500 mb-4" />
                            <CheckCircle size={64} className="hidden md:block text-green-500 mb-4" />
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Success!</h3>
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base">{message}</p>
                            <button
                                type="button"
                                onClick={() => navigate('/#events')}
                                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-xs sm:text-sm font-medium"
                            >
                                Back to Events
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4">
                            {status === 'error' && (
                                <div className="flex items-start p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-[10px] sm:text-xs">
                                    <AlertCircle size={14} className="sm:hidden mr-2 mt-0.5 flex-shrink-0" />
                                    <AlertCircle size={16} className="hidden sm:block mr-2.5 mt-0.5 flex-shrink-0" />
                                    <span>{message}</span>
                                </div>
                            )}

                            {/* Leader Name */}
                            <div className="space-y-1">
                                <label className="text-[9px] sm:text-[10px] md:text-xs text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                    Leader Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="Enter Leader Name"
                                />
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                <div className="space-y-1">
                                    <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                        Leader Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                        Leader Phone
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
                                        className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder="10-digit number"
                                    />
                                </div>
                            </div>

                            {/* Class & Roll Number */}
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                <div className="space-y-1">
                                    <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">Class</label>
                                    <input
                                        type="text"
                                        name="class"
                                        required
                                        value={formData.class}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder="e.g. SYBSCIT"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">Roll Number</label>
                                    <input
                                        type="text"
                                        name="roll_no"
                                        required
                                        value={formData.roll_no}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                        placeholder="e.g. 2023001"
                                    />
                                </div>
                            </div>

                            {/* College */}
                            <div className="space-y-1">
                                <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">College</label>
                                <input
                                    type="text"
                                    name="college"
                                    required
                                    value={formData.college}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="College Name"
                                />
                            </div>

                            {/* College ID Upload */}
                            <div className="space-y-1">
                                <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                    Team College IDs (All Members in One PDF)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'college_id')}
                                        className="hidden"
                                        id="college_id_upload"
                                        required
                                    />
                                    <label
                                        htmlFor="college_id_upload"
                                        className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs text-white hover:border-neon-purple transition-all cursor-pointer flex items-center gap-1.5"
                                    >
                                        <Upload size={14} />
                                        {files.college_id ? (
                                            <span className="text-green-400 truncate">{files.college_id.name}</span>
                                        ) : (
                                            <span className="text-gray-400 text-[10px] sm:text-[11px]">
                                                Upload All Team College IDs (PDF, max 5MB)
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <p className="text-[9px] text-gray-300 mt-0.5 ml-1">
                                    📄 Combine all team members' college IDs into one PDF
                                </p>
                            </div>

                            {/* Team Name */}
                            <div className="space-y-1">
                                <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">Team Name</label>
                                <input
                                    type="text"
                                    name="team_name"
                                    required
                                    value={formData.team_name}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="Enter Team Name"
                                />
                            </div>

                            {/* Team Members */}
                            <div className="space-y-1.5 pt-1">
                                <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-200">
                                    Team Members
                                </span>
                                
                                {/* Member 2 */}
                                <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                    <div className="text-[9px] text-gray-300 mb-1 font-semibold">Member 2</div>
                                    <input
                                        type="text"
                                        name="player2_name"
                                        required
                                        value={formData.player2_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                        placeholder="Member 2 Name"
                                    />
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <input
                                            type="text"
                                            name="player2_roll_no"
                                            required
                                            value={formData.player2_roll_no}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                            placeholder="Roll Number"
                                        />
                                        <input
                                            type="text"
                                            name="player2_college"
                                            required
                                            value={formData.player2_college}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                            placeholder="College Name"
                                        />
                                    </div>
                                </div>

                                {/* Member 3 */}
                                <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                    <div className="text-[9px] text-gray-300 mb-1 font-semibold">Member 3</div>
                                    <input
                                        type="text"
                                        name="player3_name"
                                        required
                                        value={formData.player3_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                        placeholder="Member 3 Name"
                                    />
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <input
                                            type="text"
                                            name="player3_roll_no"
                                            required
                                            value={formData.player3_roll_no}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                            placeholder="Roll Number"
                                        />
                                        <input
                                            type="text"
                                            name="player3_college"
                                            required
                                            value={formData.player3_college}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                            placeholder="College Name"
                                        />
                                    </div>
                                </div>

                                {/* Member 4 */}
                                <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                    <div className="text-[9px] text-gray-300 mb-1 font-semibold">Member 4</div>
                                    <input
                                        type="text"
                                        name="player4_name"
                                        required
                                        value={formData.player4_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                        placeholder="Member 4 Name"
                                    />
                                    <div className="grid grid-cols-2 gap-1.5">
                                        <input
                                            type="text"
                                            name="player4_roll_no"
                                            required
                                            value={formData.player4_roll_no}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                            placeholder="Roll Number"
                                        />
                                        <input
                                            type="text"
                                            name="player4_college"
                                            required
                                            value={formData.player4_college}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                            placeholder="College Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Loading Message */}
                            {loading && message && (
                                <div className="text-center text-cyber-blue text-[10px] sm:text-xs">
                                    {message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 sm:mt-3 py-2 sm:py-2.5 bg-gradient-to-r from-neon-purple to-cyber-blue text-white font-bold font-orbitron tracking-wider rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-[11px] sm:text-xs md:text-sm"
                            >
                                {loading ? 'REGISTERING...' : 'CONFIRM REGISTRATION'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default FunFusionRegistration;