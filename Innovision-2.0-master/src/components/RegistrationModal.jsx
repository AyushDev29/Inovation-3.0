import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react';
import { supabase } from '../supabaseClient';

const RegistrationModal = ({ event, onClose }) => {
    const isBGMI = event.title.includes("BGMI");
    const isFreeFire = event.title.includes("Free Fire");
    const isHackastra = event.title.includes("Hackastra");
    const isFunFusion = event.title.includes("Fun Fusion");
    const isFashionFlex = event.title.includes("Fashion Flex");
    const isTeamEvent = isBGMI || isFreeFire || isHackastra || isFunFusion || isFashionFlex;

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
        player2_class: '', // Changed from player2_college to player2_class
        player3_name: '',
        player3_roll_no: '',
        player3_class: '', // Changed from player3_college to player3_class
        player4_name: '',
        player4_roll_no: '',
        player4_class: '' // Changed from player4_college to player4_class
    });
    const [files, setFiles] = useState({
        college_id: null
    });
    const [uploadProgress, setUploadProgress] = useState({});
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error'
    const [message, setMessage] = useState('');
    const handleClose = () => {
        onClose();
    };

    // Lock background scroll when modal is open
    useEffect(() => {
        // Only lock background scroll, don't fix position
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        
        // Add modal-open class for mobile-specific styles
        document.body.classList.add('modal-open');
        
        // For mobile devices, prevent background scroll but allow modal scroll
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            // Ensure cursor is visible on mobile (override custom cursor)
            document.body.style.cursor = 'auto';
            
            // Force enable touch scrolling on mobile with a slight delay
            setTimeout(() => {
                const modalContainer = document.querySelector('.mobile-modal-fix');
                if (modalContainer) {
                    modalContainer.style.webkitOverflowScrolling = 'touch';
                    modalContainer.style.overflowY = 'auto';
                    modalContainer.style.touchAction = 'pan-y';
                    modalContainer.style.cursor = 'auto';
                    modalContainer.style.pointerEvents = 'auto';
                    
                    // Also ensure all child elements allow touch
                    const allElements = modalContainer.querySelectorAll('*');
                    allElements.forEach(el => {
                        if (el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' && el.tagName !== 'BUTTON') {
                            el.style.pointerEvents = 'auto';
                            el.style.touchAction = 'pan-y';
                        }
                    });
                }
            }, 100);
        } else {
            document.body.style.overflow = 'hidden';
        }
        
        // Stop Lenis smooth scroll
        const lenisInstance = window.lenis;
        if (lenisInstance) {
            lenisInstance.stop();
        }

        // Handle ESC key to close modal
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        
        return () => {
            // Remove modal-open class
            document.body.classList.remove('modal-open');
            
            // Restore original styles
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.width = '';
            document.body.style.height = '';
            document.body.style.cursor = '';
            
            // Restart Lenis
            if (lenisInstance) {
                lenisInstance.start();
            }
            window.removeEventListener('keydown', handleEscape);
        };
    }, [handleClose]);

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
            
            setFiles({ ...files, [fieldName]: file });
        }
    };

    const uploadFile = async (file, fileName) => {
        if (!file) return null;
        
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${Date.now()}-${fileName}.${fileExt}`;
            
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

            // 2. Upload files
            setMessage('Uploading college ID documents...');
            const uploadedFiles = {};
            
            // Upload team college IDs (combined photo)
            if (files.college_id) {
                uploadedFiles.college_id_url = await uploadFile(files.college_id, `team-${formData.email}`);
            }

            // 3. Prepare payload
            setMessage('Saving registration...');
            const payload = {
                name: formData.name, // IGL Name
                email: formData.email, // IGL Email
                phone: formData.phone, // IGL Phone
                class: formData.class,
                college: formData.college,
                roll_no: formData.roll_no,
                event_id: eventData.id,
                ...uploadedFiles
            };

            if (isTeamEvent) {
                payload.team_name = formData.team_name;
                payload.player2_name = formData.player2_name;
                payload.player2_roll_no = formData.player2_roll_no;
                payload.player2_class = formData.player2_class; // Changed from player2_college
                payload.player3_name = formData.player3_name;
                payload.player3_roll_no = formData.player3_roll_no;
                payload.player3_class = formData.player3_class; // Changed from player3_college
                payload.player4_name = formData.player4_name;
                payload.player4_roll_no = formData.player4_roll_no;
                payload.player4_class = formData.player4_class; // Changed from player4_college
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
                name: '', email: '', phone: '', class: '', college: '', roll_no: '',
                team_name: '', player2_name: '', player2_roll_no: '', player2_class: '',
                player3_name: '', player3_roll_no: '', player3_class: '',
                player4_name: '', player4_roll_no: '', player4_class: ''
            });
            setFiles({
                college_id: null
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
            className="fixed inset-0 z-[2000] bg-black/90 backdrop-blur-md"
            onClick={handleClose}
        >
            <div 
                className="h-full overflow-y-scroll p-1 sm:p-2 md:p-4 lg:p-6 mobile-modal-fix touch-scroll"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain',
                    touchAction: 'pan-y',
                    cursor: 'auto',
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 2001
                }}
            >
                <div className="min-h-full flex items-center justify-center py-2 sm:py-4 mobile-modal-content">
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full sm:w-[95vw] md:w-[90vw] lg:w-[80vw] xl:w-[70vw] max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-lg sm:rounded-xl shadow-2xl max-h-[98vh] overflow-hidden"
                        style={{ 
                            touchAction: 'auto',
                            cursor: 'auto',
                            pointerEvents: 'auto'
                        }}
                    >
                        {/* Header - Fixed at top */}
                        <div className="flex-shrink-0 bg-[#0f0f0f] border-b border-white/10 px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 flex items-start justify-between rounded-t-xl sm:rounded-t-2xl">
                            <div className="flex-1 pr-2">
                                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-orbitron font-bold text-white leading-tight">
                                    Register for <span className="text-neon-purple">{event.title}</span>
                                </h2>
                                <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs mt-0.5">Fill in your details to secure your spot.</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="flex-shrink-0 p-1.5 sm:p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                            >
                                <X size={16} className="sm:hidden" />
                                <X size={18} className="hidden sm:block md:hidden" />
                                <X size={20} className="hidden md:block" />
                            </button>
                        </div>

                        {/* Content */}
                        <div 
                            className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6"
                            style={{ 
                                touchAction: 'pan-y',
                                cursor: 'auto',
                                pointerEvents: 'auto'
                            }}
                        >

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
                                    <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-transparent to-cyber-blue/5"></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-neon-purple/10 to-transparent rounded-full blur-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyber-blue/10 to-transparent rounded-full blur-xl"></div>
                                    
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
                                            <h4 className="text-white font-bold text-lg mb-2 font-orbitron">Join the Community</h4>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                Connect with participants and get real-time updates about {event.title}
                                            </p>
                                        </div>
                                        
                                        <a
                                            href={
                                                event.title.includes("BGMI") ? "https://chat.whatsapp.com/HDEb9ZbNrFMKNOgt5QcjHR" :
                                                event.title.includes("Free Fire") ? "https://chat.whatsapp.com/L8JRTlXSr6NIrDUMVkBuoF" :
                                                event.title.includes("Hackastra") ? "https://chat.whatsapp.com/L78pZmds525IUjG8biKNlJ" :
                                                event.title.includes("Fashion Flex") ? "https://chat.whatsapp.com/LKknLBgpyMb7JrYcYglQMU" :
                                                event.title.includes("Fun Fusion") ? "https://chat.whatsapp.com/ByCQTmxfaJnFnT3biJea1O" :
                                                event.title.includes("Tech Triathlon") ? "https://chat.whatsapp.com/IN3s8Ix8kSXBiqlr4xzZnY" :
                                                "#"
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 active:scale-95"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                            <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                                            </svg>
                                            <span className="relative z-10">Join {event.title} Group</span>
                                            <div className="relative z-10 w-2 h-2 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                                        </a>
                                        
                                        <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                            <span>Instant notifications • Event updates • Community support</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="mt-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-xs sm:text-sm font-medium"
                                >
                                    Close
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

                        <div className="space-y-1">
                            <label className="text-[9px] sm:text-[10px] md:text-xs text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                {isFreeFire ? "IGL Name" : (isTeamEvent ? "Leader Name" : "Full Name")}
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                placeholder={isFreeFire ? "Enter IGL Name" : (isTeamEvent ? "Enter Leader Name" : "Enter your full name")}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                            <div className="space-y-1">
                                <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                    {isFreeFire ? "IGL Email" : (isTeamEvent ? "Leader Email" : "Email")}
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
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="10-digit number"
                                />
                            </div>
                        </div>

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

                        {/* College ID Photo Upload */}
                        <div className="space-y-1">
                            <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                {isTeamEvent ? "Team College IDs Photo (All Members)" : "College ID Photo"}
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
                                            {isTeamEvent ? "📸 Take Photo or Upload Image (max 10MB)" : "📸 Take Photo or Upload ID (max 10MB)"}
                                        </span>
                                    )}
                                </label>
                            </div>
                            {isTeamEvent && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-2 mt-1">
                                    <p className="text-[9px] text-yellow-400 font-medium mb-1">
                                        ⚠️ IMPORTANT REQUIREMENTS:
                                    </p>
                                    <ul className="text-[8px] text-yellow-300 space-y-0.5 ml-2">
                                        <li>• All {isHackastra ? '3' : isFashionFlex ? '5' : '4'} team members' college IDs must be clearly visible in ONE photo</li>
                                        <li>• Arrange all ID cards together and take a clear photo</li>
                                        <li>• Ensure all text and photos on IDs are readable</li>
                                        <li>• Poor quality photos may lead to disqualification</li>
                                    </ul>
                                </div>
                            )}
                            {!isTeamEvent && (
                                <p className="text-[9px] text-gray-300 mt-0.5 ml-1">
                                    📸 Take a clear photo of your college ID or upload from gallery
                                </p>
                            )}
                        </div>

                        {/* Team Specific Fields */}
                        {isTeamEvent && (
                            <>
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
                                <div className="space-y-1.5 pt-1">
                                    <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-200">
                                        {isFreeFire ? "Squad Members" : "Team Members"}
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
                                            placeholder={isFreeFire ? "Player 2 Name" : "Member 2 Name"}
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
                                                placeholder="Class (e.g., SYBSCIT)"
                                            />
                                        </div>
                                    </div>

                                    {/* Member 3 */}
                                    <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                        <div className="text-[9px] text-gray-300 mb-1 font-semibold">
                                            {isHackastra ? "Member 3 (Optional)" : "Member 3"}
                                        </div>
                                        <input
                                            type="text"
                                            name="player3_name"
                                            required={!isHackastra}
                                            value={formData.player3_name}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                            placeholder={isFreeFire ? "Player 3 Name" : isHackastra ? "Member 3 Name (Optional)" : "Member 3 Name"}
                                        />
                                        <div className="grid grid-cols-2 gap-1.5">
                                            <input
                                                type="text"
                                                name="player3_roll_no"
                                                required={!isHackastra && formData.player3_name}
                                                value={formData.player3_roll_no}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                                placeholder="Roll Number"
                                            />
                                            <input
                                                type="text"
                                                name="player3_class"
                                                required={!isHackastra && formData.player3_name}
                                                value={formData.player3_class}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                                placeholder="Class (e.g., SYBSCIT)"
                                            />
                                        </div>
                                    </div>

                                    {/* Member 4 - Hidden for Hackastra */}
                                    {!isHackastra && (
                                        <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                            <div className="text-[9px] text-gray-300 mb-1 font-semibold">
                                                {isFunFusion ? "Member 4" : "Member 4"}
                                            </div>
                                            <input
                                                type="text"
                                                name="player4_name"
                                                required={isFreeFire || isBGMI || isFashionFlex || isFunFusion ? true : false}
                                                value={formData.player4_name}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                                placeholder={isFreeFire ? "Player 4 Name" : (isBGMI || isFunFusion) ? "Member 4 Name" : "Member 4 Name"}
                                            />
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <input
                                                    type="text"
                                                    name="player4_roll_no"
                                                    required={formData.player4_name && (isFreeFire || isBGMI || isFashionFlex || isFunFusion)}
                                                    value={formData.player4_roll_no}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                                    placeholder="Roll Number"
                                                />
                                                <input
                                                    type="text"
                                                    name="player4_class"
                                                    required={formData.player4_name && (isFreeFire || isBGMI || isFashionFlex || isFunFusion)}
                                                    value={formData.player4_class}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                                    placeholder="Class (e.g., SYBSCIT)"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

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
            </div>
        </motion.div>
    );
};

export default RegistrationModal;
