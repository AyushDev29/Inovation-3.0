import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { cleanRegistrationData, getPlaceholderExamples } from '../utils/dataCleaners';

const FashionFlexRegistration = () => {
    const navigate = useNavigate();
    const event = {
        id: 4,
        title: "Fashion Flex",
        teamSize: "2 Members (Duo)",
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
        college: '', // This will be the TEAM college (common for all members)
        roll_no: '',
        team_name: '',
        player2_name: '',
        player2_roll_no: '',
        player2_class: '' // Changed from player2_college to player2_class
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
            // Validate file type (Images only: JPEG, JPG, PNG, WEBP)
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload only image files (JPEG, JPG, PNG, WEBP) for college ID verification.');
                return;
            }
            
            // Validate file size (max 10MB for images)
            if (file.size > 10 * 1024 * 1024) {
                alert('Image size must be less than 10MB.');
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
            
            // Try to upload file if provided, but don't fail if bucket doesn't exist
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
            
            // Clean all form data before saving
            const cleanedFormData = cleanRegistrationData(formData);
            
            const payload = {
                name: cleanedFormData.name,
                email: cleanedFormData.email,
                phone: cleanedFormData.phone,
                class: cleanedFormData.class,
                college: cleanedFormData.college,
                roll_no: cleanedFormData.roll_no,
                event_id: eventData.id,
                team_name: cleanedFormData.team_name,
                player2_name: cleanedFormData.player2_name,
                player2_roll_no: cleanedFormData.player2_roll_no,
                player2_class: cleanedFormData.player2_class,
                college_id_url: uploadedFiles.college_id_url || null
            };

            const { error: insertError } = await supabase
                .from('registrations')
                .insert([payload]);

            if (insertError) throw insertError;

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
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-4">{message}</p>
                            
                            {/* WhatsApp Group Link - Enhanced Professional UI */}
                            <div className="relative bg-gradient-to-br from-gray-900/80 via-black/60 to-gray-800/80 border border-white/10 rounded-2xl p-6 mb-6 w-full max-w-md backdrop-blur-sm overflow-hidden">
                                {/* Animated Background Elements */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5"></div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-xl"></div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                                            </svg>
                                        </div>
                                    </div>
                                    
                                    <div className="text-center mb-5">
                                        <h4 className="text-white font-bold text-lg mb-2 font-orbitron">Join the Style Squad</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            Connect with fellow fashionistas and get real-time updates about the ramp walk
                                        </p>
                                    </div>
                                    
                                    <a
                                        href="https://chat.whatsapp.com/LKknLBgpyMb7JrYcYglQMU"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                                        </svg>
                                        <span className="relative z-10">Join Fashion Flex Team</span>
                                        <div className="relative z-10 w-2 h-2 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                                    </a>
                                    
                                    <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                        <span>Style tips • Event updates • Team coordination</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                type="button"
                                onClick={() => navigate('/#events')}
                                className="mt-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-xs sm:text-sm font-medium"
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
                                <div className="text-[8px] sm:text-[9px] text-yellow-400 mt-1 flex items-center gap-1">
                                    <span>⚠️</span>
                                    <span>All team members must be from the same college</span>
                                </div>
                            </div>

                            {/* College ID Photo Upload */}
                            <div className="space-y-1">
                                <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                    Team College IDs Photo (Both Members)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        capture="environment"
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
                                                📸 Take Photo (max 10MB)
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 mt-2">
                                    <p className="text-xs sm:text-sm text-yellow-400 font-semibold mb-2">
                                        ⚠️ IMPORTANT REQUIREMENTS:
                                    </p>
                                    <ul className="text-[11px] sm:text-xs text-yellow-300 space-y-1 ml-3 leading-relaxed">
                                        <li>• Both team members' college IDs must be clearly visible in ONE photo</li>
                                        <li>• Arrange both ID cards together and take a clear photo</li>
                                        <li>• Ensure all text and photos on IDs are readable</li>
                                        <li>• Poor visible/blur photos and fake entries and photos may lead to disqualification</li>
                                    </ul>
                                </div>
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
                                
                                {/* Partner */}
                                <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                    <div className="text-[9px] text-gray-300 mb-1 font-semibold">Partner</div>
                                    <input
                                        type="text"
                                        name="player2_name"
                                        required
                                        value={formData.player2_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                        placeholder="Partner Name"
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
                                            name="player2_class"
                                            required
                                            value={formData.player2_class}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                            placeholder="Class (e.g., SYBSCIT, TYBCA)"
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

export default FashionFlexRegistration;