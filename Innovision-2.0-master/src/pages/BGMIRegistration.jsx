import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle, Upload, X, CreditCard, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { cleanRegistrationData, getPlaceholderExamples } from '../utils/dataCleaners';
import MultiplePhotoUpload from '../components/MultiplePhotoUpload';

const BGMIRegistration = () => {
    const navigate = useNavigate();
    const event = {
        id: 1,
        title: "BGMI Esports Tournament",
        teamSize: "4 Members",
        prize: "₹6,000",
        entryFee: 100 // BGMI entry fee
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
        player2_class: '', // Changed from player2_college to player2_class
        player3_name: '',
        player3_roll_no: '',
        player3_class: '', // Changed from player3_college to player3_class
        player4_name: '',
        player4_roll_no: '',
        player4_class: '' // Changed from player4_college to player4_class
    });
    const [files, setFiles] = useState({
        collegeIdPhotos: [] // Changed to array for multiple photos
    });
    
    // PAYMENT STATE (NEW - SAFE ADDITION)
    const [paymentStep, setPaymentStep] = useState(false); // false = form, true = payment
    const [paymentData, setPaymentData] = useState({
        screenshot: null,
        transactionId: ''
    });
    const [paymentErrors, setPaymentErrors] = useState({});
    
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

    const handlePhotosChange = (photos) => {
        setFiles(prev => ({
            ...prev,
            collegeIdPhotos: photos
        }));
    };

    const uploadMultipleFiles = async (files, prefix = 'college-id') => {
        try {
            const uploadPromises = files.map(async (file, index) => {
                const fileExt = file.name.split('.').pop();
                const filePath = `${prefix}-${Date.now()}-${index}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                
                const { data, error } = await supabase.storage
                    .from('college-ids')
                    .upload(filePath, file);
                
                if (error) throw error;
                return data.path;
            });
            
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Multiple file upload error:', error);
            throw new Error(`Failed to upload photos: ${error.message}`);
        }
    };

    // PAYMENT FUNCTIONS (NEW - SAFE ADDITION)
    const handlePaymentScreenshot = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Clear previous errors
            setPaymentErrors(prev => ({
                ...prev,
                screenshot: null
            }));
            
            // Validate file type (images only)
            if (!file.type.startsWith('image/')) {
                setPaymentErrors(prev => ({
                    ...prev,
                    screenshot: 'Please upload only image files (JPG, PNG, JPEG)'
                }));
                return;
            }
            
            // Validate specific image types
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type.toLowerCase())) {
                setPaymentErrors(prev => ({
                    ...prev,
                    screenshot: 'Please upload only JPG, JPEG, or PNG images'
                }));
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setPaymentErrors(prev => ({
                    ...prev,
                    screenshot: 'File size must be less than 5MB'
                }));
                return;
            }
            
            // Validate minimum file size (prevent empty files)
            if (file.size < 1024) { // 1KB minimum
                setPaymentErrors(prev => ({
                    ...prev,
                    screenshot: 'File appears to be corrupted or too small'
                }));
                return;
            }
            
            // Additional validation for mobile devices
            if (file.name.length > 100) {
                setPaymentErrors(prev => ({
                    ...prev,
                    screenshot: 'File name is too long. Please rename the file.'
                }));
                return;
            }
            
            setPaymentData(prev => ({
                ...prev,
                screenshot: file
            }));
            
            console.log('Payment screenshot selected:', {
                name: file.name,
                size: file.size,
                type: file.type
            });
        }
    };

    const handleTransactionIdChange = (e) => {
        const value = e.target.value.trim();
        setPaymentData(prev => ({
            ...prev,
            transactionId: value
        }));
        
        // Validate transaction ID
        if (value.length < 6) {
            setPaymentErrors(prev => ({
                ...prev,
                transactionId: 'Transaction ID must be at least 6 characters'
            }));
        } else {
            setPaymentErrors(prev => ({
                ...prev,
                transactionId: null
            }));
        }
    };

    const uploadPaymentScreenshot = async (file) => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `bgmi/${Date.now()}-${formData.email.replace('@', '-')}.${fileExt}`;
            
            console.log('🔄 Uploading payment screenshot:', {
                fileName,
                fileSize: file.size,
                fileType: file.type,
                environment: window.location.hostname
            });
            
            // Check if we're authenticated
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            console.log('🔐 Auth status:', user ? 'Authenticated' : 'Anonymous');
            
            const { data, error } = await supabase.storage
                .from('payment-screenshots')
                .upload(fileName, file);
            
            if (error) {
                console.error('❌ Payment screenshot upload error:', {
                    error,
                    code: error.code,
                    message: error.message,
                    details: error.details
                });
                throw error;
            }
            
            console.log('✅ Payment screenshot uploaded successfully:', data.path);
            return data.path;
        } catch (error) {
            console.error('💥 Payment screenshot upload failed:', error);
            
            // Provide more specific error messages
            if (error.message?.includes('not authenticated')) {
                throw new Error('Authentication required. Please refresh the page and try again.');
            } else if (error.message?.includes('bucket')) {
                throw new Error('Storage service unavailable. Please try again in a moment.');
            } else if (error.message?.includes('policy')) {
                throw new Error('Upload permission denied. Please contact support.');
            } else {
                throw new Error(`Upload failed: ${error.message || 'Unknown error'}. Please try again.`);
            }
        }
    };

    const validatePaymentData = () => {
        const errors = {};
        
        if (!paymentData.screenshot) {
            errors.screenshot = 'Payment screenshot is required';
        }
        
        if (!paymentData.transactionId || paymentData.transactionId.length < 6) {
            errors.transactionId = 'Valid transaction ID is required (min 6 characters)';
        }
        
        setPaymentErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const proceedToPayment = (e) => {
        e.preventDefault();
        
        // Validate form data first
        const requiredFields = ['name', 'email', 'phone', 'class', 'college', 'roll_no', 'team_name', 
                               'player2_name', 'player2_roll_no', 'player2_class',
                               'player3_name', 'player3_roll_no', 'player3_class',
                               'player4_name', 'player4_roll_no', 'player4_class'];
        
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            setStatus('error');
            setMessage('Please fill all required fields before proceeding to payment');
            return;
        }
        
        if (files.collegeIdPhotos.length !== 4) {
            setStatus('error');
            setMessage('Please upload all 4 team member college ID photos before proceeding to payment');
            return;
        }
        
        // Switch to payment step
        setPaymentStep(true);
        setStatus(null);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate payment data first (BGMI requires payment)
        if (!validatePaymentData()) {
            return;
        }
        
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
            
            // Upload college ID documents (multiple photos)
            if (files.collegeIdPhotos.length > 0) {
                try {
                    setMessage('Uploading college ID photos...');
                    const uploadedPaths = await uploadMultipleFiles(files.collegeIdPhotos, 'team-college-id');
                    
                    // Store individual photo URLs
                    uploadedFiles.player1_college_id_url = uploadedPaths[0] || null;
                    uploadedFiles.player2_college_id_url = uploadedPaths[1] || null;
                    uploadedFiles.player3_college_id_url = uploadedPaths[2] || null;
                    uploadedFiles.player4_college_id_url = uploadedPaths[3] || null;
                } catch (uploadError) {
                    console.warn('File upload failed, continuing without files:', uploadError);
                }
            }

            // Upload payment screenshot (NEW - SAFE ADDITION)
            let paymentScreenshotUrl = null;
            if (paymentData.screenshot) {
                try {
                    setMessage('Uploading payment screenshot...');
                    paymentScreenshotUrl = await uploadPaymentScreenshot(paymentData.screenshot);
                } catch (uploadError) {
                    throw new Error('Failed to upload payment screenshot. Please try again.');
                }
            }

            setMessage('Saving registration...');
            
            // Clean all form data before saving
            const cleanedFormData = cleanRegistrationData(formData);
            const cleanedPaymentData = {
                ...paymentData,
                transactionId: paymentData.transactionId ? paymentData.transactionId.trim().toUpperCase().replace(/\s+/g, '') : ''
            };
            
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
                player3_name: cleanedFormData.player3_name,
                player3_roll_no: cleanedFormData.player3_roll_no,
                player3_class: cleanedFormData.player3_class,
                player4_name: cleanedFormData.player4_name,
                player4_roll_no: cleanedFormData.player4_roll_no,
                player4_class: cleanedFormData.player4_class,
                // Individual college ID photos (with fallback for compatibility)
                player1_college_id_url: uploadedFiles.player1_college_id_url || null,
                player2_college_id_url: uploadedFiles.player2_college_id_url || null,
                player3_college_id_url: uploadedFiles.player3_college_id_url || null,
                player4_college_id_url: uploadedFiles.player4_college_id_url || null,
                // Fallback to old system if new columns don't exist
                college_id_url: uploadedFiles.player1_college_id_url || null,
                // PAYMENT FIELDS (NEW - SAFE ADDITION)
                payment_required: true,
                payment_amount: event.entryFee,
                payment_screenshot_url: paymentScreenshotUrl,
                payment_transaction_id: cleanedPaymentData.transactionId,
                payment_status: 'pending'
            };

            console.log('💾 Saving registration with payload:', {
                ...payload,
                payment_screenshot_url: paymentScreenshotUrl ? 'uploaded' : 'missing',
                payment_transaction_id: paymentData.transactionId ? 'provided' : 'missing'
            });

            const { error: insertError } = await supabase
                .from('registrations')
                .insert([payload]);

            if (insertError) {
                console.error('❌ Database insert error:', insertError);
                
                if (insertError.code === '23505') {
                    throw new Error("You/Team have already registered for this event with this email.");
                } else if (insertError.code === '42703') {
                    throw new Error("Database configuration error. Please contact support - missing payment fields.");
                } else if (insertError.message?.includes('payment_status')) {
                    throw new Error("Invalid payment status. Please try again.");
                } else {
                    throw new Error(`Registration failed: ${insertError.message}. Please contact support.`);
                }
            }

            setStatus('success');
            setMessage('Registration successful! Your payment is under verification. You will be notified once approved.');
            
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
                            {event.teamSize} • ₹7,000
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
                                        <h4 className="text-white font-bold text-lg mb-2 font-orbitron">Join the Squad</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            Connect with your BGMI teammates and get real-time updates about the tournament
                                        </p>
                                    </div>
                                    
                                    <a
                                        href="https://chat.whatsapp.com/HDEb9ZbNrFMKNOgt5QcjHR"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 active:scale-95"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                                        <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                                        </svg>
                                        <span className="relative z-10">Join BGMI Squad</span>
                                        <div className="relative z-10 w-2 h-2 bg-white/60 rounded-full group-hover:bg-white transition-colors"></div>
                                    </a>
                                    
                                    <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                        <span>Instant notifications • Team coordination • Updates</span>
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

                            {/* IGL Name */}
                            <div className="space-y-1">
                                <label className="text-[9px] sm:text-[10px] md:text-xs text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                    IGL Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                    placeholder="Enter IGL Name"
                                />
                            </div>

                            {/* Email & Phone */}
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                                <div className="space-y-1">
                                    <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                        IGL Email
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
                                        IGL Phone
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

                            {/* Multiple College ID Photos Upload */}
                            <MultiplePhotoUpload
                                maxPhotos={4}
                                onPhotosChange={handlePhotosChange}
                                memberNames={[
                                    formData.name || 'Team Leader',
                                    formData.player2_name || 'Member 2',
                                    formData.player3_name || 'Member 3',
                                    formData.player4_name || 'Member 4'
                                ]}
                                label="Team College ID Photos (4 Required)"
                                required={true}
                            />

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

                            {/* Squad Members */}
                            <div className="space-y-1.5 pt-1">
                                <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-200">
                                    Squad Members
                                </span>
                                
                                {/* Member 2 */}
                                <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                    <div className="text-[9px] text-gray-300 mb-1 font-semibold">Player 2</div>
                                    <input
                                        type="text"
                                        name="player2_name"
                                        required
                                        value={formData.player2_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                        placeholder="Player 2 Name"
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

                                {/* Member 3 */}
                                <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                    <div className="text-[9px] text-gray-300 mb-1 font-semibold">Player 3</div>
                                    <input
                                        type="text"
                                        name="player3_name"
                                        required
                                        value={formData.player3_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                        placeholder="Player 3 Name"
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
                                            name="player3_class"
                                            required
                                            value={formData.player3_class}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600"
                                            placeholder="Class (e.g., SYBSCIT, TYBCA)"
                                        />
                                    </div>
                                </div>

                                {/* Member 4 */}
                                <div className="bg-white/5 rounded-md p-2 border border-white/10">
                                    <div className="text-[9px] text-gray-300 mb-1 font-semibold">Player 4</div>
                                    <input
                                        type="text"
                                        name="player4_name"
                                        required
                                        value={formData.player4_name}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[11px] sm:text-xs text-white focus:border-neon-purple focus:outline-none focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 mb-1"
                                        placeholder="Player 4 Name"
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
                                            name="player4_class"
                                            required
                                            value={formData.player4_class}
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

                            {/* PAYMENT SECTION (NEW - ONLY FOR BGMI) */}
                            {!paymentStep ? (
                                /* STEP 1: PROCEED TO PAYMENT BUTTON */
                                <button
                                    type="button"
                                    onClick={proceedToPayment}
                                    disabled={loading}
                                    className="w-full mt-2 sm:mt-3 py-2 sm:py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold font-orbitron tracking-wider rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-[11px] sm:text-xs md:text-sm"
                                >
                                    <CreditCard size={16} className="inline mr-2" />
                                    PROCEED TO PAYMENT (₹{event.entryFee})
                                </button>
                            ) : (
                                /* STEP 2: PAYMENT SECTION */
                                <div className="space-y-3 sm:space-y-4">
                                    {/* Payment Header - Enhanced */}
                                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                                    <CreditCard size={20} className="text-yellow-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg sm:text-xl font-bold text-white">Payment Required</h3>
                                                    <p className="text-sm text-gray-300">Complete payment to confirm registration</p>
                                                </div>
                                            </div>
                                            <div className="bg-yellow-500/20 px-4 py-2 rounded-lg">
                                                <div className="text-xs text-yellow-300 uppercase tracking-wider">Entry Fee</div>
                                                <div className="text-2xl font-bold text-yellow-400">₹{event.entryFee}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Scanner - Enhanced */}
                                    <div className="bg-white/5 rounded-xl p-4 sm:p-6 border border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                                <QrCode size={20} className="text-cyan-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-base sm:text-lg font-semibold text-white">Scan & Pay</h4>
                                                <p className="text-sm text-gray-400">Use any UPI app to make payment</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                                                <img 
                                                    src="/scanners/bgmi-scanner.jpeg" 
                                                    alt="BGMI Payment QR Code"
                                                    className="w-40 h-40 sm:w-48 sm:h-48 object-contain"
                                                    onError={(e) => {
                                                        console.error('BGMI QR image failed to load:', e.target.src);
                                                        // Try alternative path first
                                                        if (e.target.src.includes('/scanners/')) {
                                                            e.target.src = './scanners/bgmi-scanner.jpeg';
                                                        } else {
                                                            // Fallback to placeholder
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJHTUkgUVIgQ29kZTwvdGV4dD48L3N2Zz4=';
                                                        }
                                                    }}
                                                    onLoad={() => console.log('BGMI QR image loaded successfully')}
                                                />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm sm:text-base text-gray-300 mb-2">
                                                    Scan this QR code with any UPI app
                                                </p>
                                                <div className="bg-yellow-500/20 px-3 py-1 rounded-full inline-block">
                                                    <span className="text-yellow-400 font-semibold">Pay exactly ₹{event.entryFee}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Screenshot Upload */}
                                    <div className="space-y-1">
                                        <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                            Payment Screenshot *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png"
                                                onChange={handlePaymentScreenshot}
                                                className="hidden"
                                                id="payment_screenshot"
                                                required
                                            />
                                            <label
                                                htmlFor="payment_screenshot"
                                                className={`w-full bg-black/40 border ${paymentErrors.screenshot ? 'border-red-500' : 'border-white/10'} rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs text-white hover:border-yellow-500 transition-all cursor-pointer flex items-center gap-1.5`}
                                            >
                                                <Upload size={14} />
                                                {paymentData.screenshot ? (
                                                    <span className="text-green-400 truncate">{paymentData.screenshot.name}</span>
                                                ) : (
                                                    <span className="text-gray-400 text-[10px] sm:text-[11px]">
                                                        📸 Upload Payment Screenshot (Camera/Gallery)
                                                    </span>
                                                )}
                                            </label>
                                        </div>
                                        {paymentErrors.screenshot && (
                                            <p className="text-red-400 text-[9px] sm:text-[10px] ml-1">{paymentErrors.screenshot}</p>
                                        )}
                                        <p className="text-[8px] sm:text-[9px] text-gray-400 ml-1">
                                            💡 Tip: Take a clear screenshot of your payment confirmation from your UPI app
                                        </p>
                                    </div>

                                    {/* Transaction ID */}
                                    <div className="space-y-1">
                                        <label className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-300 uppercase tracking-wider ml-1 font-medium">
                                            Transaction ID *
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentData.transactionId}
                                            onChange={handleTransactionIdChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-md px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs md:text-sm text-white focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all placeholder-gray-600"
                                            placeholder={getPlaceholderExamples.transactionId}
                                            required
                                        />
                                        {paymentErrors.transactionId && (
                                            <p className="text-red-400 text-[9px] sm:text-[10px] ml-1">{paymentErrors.transactionId}</p>
                                        )}
                                    </div>

                                    {/* Back to Form Button */}
                                    <button
                                        type="button"
                                        onClick={() => setPaymentStep(false)}
                                        className="w-full mt-2 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-[11px] sm:text-xs"
                                    >
                                        ← Back to Form
                                    </button>

                                    {/* Final Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading || !paymentData.screenshot || !paymentData.transactionId || paymentErrors.screenshot || paymentErrors.transactionId}
                                        className="w-full mt-2 sm:mt-3 py-2 sm:py-2.5 bg-gradient-to-r from-neon-purple to-cyber-blue text-white font-bold font-orbitron tracking-wider rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-[11px] sm:text-xs md:text-sm"
                                    >
                                        {loading ? 'REGISTERING...' : 'CONFIRM REGISTRATION'}
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default BGMIRegistration;