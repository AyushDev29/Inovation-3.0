import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Download, Search, Filter, LogOut, ChevronDown, ChevronUp, Users, FileText, Eye, X, CreditCard } from 'lucide-react';
import * as XLSX from 'xlsx';
import { cleanName, cleanEmail, cleanPhone, cleanRollNo, cleanClass, cleanCollege, cleanTeamName } from '../utils/dataCleaners';

const AdminPanel = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(null);

    // Dashboard State
    const [registrations, setRegistrations] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchError, setFetchError] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); // Add refreshing state
    
    // MULTIPLE IMAGES VIEWER STATE
    const [multipleImagesViewerOpen, setMultipleImagesViewerOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [multipleImagesLoading, setMultipleImagesLoading] = useState(false);
    
    // SINGLE IMAGE ZOOM VIEWER STATE
    const [singleImageViewerOpen, setSingleImageViewerOpen] = useState(false);
    const [currentSingleImage, setCurrentSingleImage] = useState(null);
    
    // VERIFICATION SYSTEM STATE
    const [verificationFilter, setVerificationFilter] = useState('normal'); // normal, all, verified, pending, rejected
    const [verificationUpdateLoading, setVerificationUpdateLoading] = useState(null);
    
    // PAYMENT SCREENSHOT VIEWER STATE
    const [paymentViewerOpen, setPaymentViewerOpen] = useState(false);
    const [currentPaymentUrl, setCurrentPaymentUrl] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            fetchEvents();
            fetchRegistrations();
        }
    }, [session, selectedEvent, verificationFilter]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) setAuthError(error.message);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const fetchEvents = async () => {
        const { data, error } = await supabase.from('events').select('*');
        if (!error) setEvents(data);
    };

    const fetchRegistrations = async () => {
        try {
            setRefreshing(true);
            console.log('🔄 Fetching registrations...');
            let query = supabase
                .from('registrations')
                .select(`
                    *,
                    events (
                        event_name
                    )
                `)
                .order('created_at', { ascending: false });

            if (selectedEvent !== 'all') {
                const eventId = events.find(e => e.event_name === selectedEvent)?.id;
                if (eventId) query = query.eq('event_id', eventId);
            }

            // Apply verification filter - exclude rejected users from normal view
            if (verificationFilter === 'verified') {
                query = query.eq('verification_status', 'verified');
            } else if (verificationFilter === 'pending') {
                query = query.eq('verification_status', 'pending');
            } else if (verificationFilter === 'rejected') {
                query = query.eq('verification_status', 'rejected');
            } else if (verificationFilter === 'all') {
                // Show all including rejected for admin review
                // No additional filter needed
            } else {
                // Default 'normal' behavior: exclude rejected users from normal view
                query = query.neq('verification_status', 'rejected');
            }

            const { data, error } = await query;
            if (error) {
                console.error('❌ Error fetching registrations:', error);
                setFetchError(error.message);
            } else {
                console.log('✅ Registrations fetched successfully:', data?.length || 0, 'records');
                setRegistrations(data || []);
                setFetchError(null);
            }
        } catch (error) {
            console.error('❌ Unexpected error in fetchRegistrations:', error);
            setFetchError(error.message);
        } finally {
            setRefreshing(false);
        }
    };

    // Filter by search term
    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm)
    );

    const exportToExcel = () => {
        const dataToExport = filteredRegistrations.map(reg => {
            // Check if it's a team event
            const isTeamEvent = reg.events?.event_name?.includes("BGMI") || 
                               reg.events?.event_name?.includes("Free Fire") || 
                               reg.events?.event_name?.includes("Hackastra") ||
                               reg.events?.event_name?.includes("Fashion Flex");

            // Check if it's a paid event (BGMI or Free Fire)
            const isPaidEvent = reg.events?.event_name?.includes("BGMI") || 
                               reg.events?.event_name?.includes("Free Fire");

            if (isTeamEvent) {
                const baseData = {
                    "Team Name": cleanTeamName(reg.team_name) || '-',
                    "Leader/IGL Name": cleanName(reg.name) || '-',
                    "Leader Email": cleanEmail(reg.email) || '-',
                    "Leader Phone": cleanPhone(reg.phone) || '-',
                    "Leader Class": cleanClass(reg.class) || '-',
                    "Leader College": cleanCollege(reg.college) || '-',
                    "Leader Roll No": cleanRollNo(reg.roll_no) || '-',
                    "Team College IDs": reg.college_id_url ? 'Photo Uploaded' : 'Not Uploaded',
                    "Verification Status": reg.verification_status === 'verified' ? 'Verified' :
                                          reg.verification_status === 'rejected' ? 'Rejected' : 'Pending',
                    "Verified At": reg.verified_at ? new Date(reg.verified_at).toLocaleString() : '-',
                    "Verified By": reg.verified_by || '-',
                    "Rejection Reason": reg.rejection_reason || '-',
                    "Member 2 Name": cleanName(reg.player2_name) || '-',
                    "Member 2 Roll No": cleanRollNo(reg.player2_roll_no) || '-',
                    "Member 2 Class": cleanClass(reg.player2_class) || '-',
                    "Member 3 Name": cleanName(reg.player3_name) || '-',
                    "Member 3 Roll No": cleanRollNo(reg.player3_roll_no) || '-',
                    "Member 3 Class": cleanClass(reg.player3_class) || '-',
                    "Member 4 Name": cleanName(reg.player4_name) || '-',
                    "Member 4 Roll No": cleanRollNo(reg.player4_roll_no) || '-',
                    "Member 4 Class": cleanClass(reg.player4_class) || '-',
                    "Event": reg.events?.event_name || '-',
                    "Registration Date": reg.created_at ? new Date(reg.created_at).toLocaleString() : '-'
                };

                // Add payment information for paid events
                if (isPaidEvent) {
                    baseData["Payment Required"] = reg.payment_required ? 'Yes' : 'No';
                    baseData["Entry Fee"] = reg.payment_amount ? `₹${reg.payment_amount}` : '-';
                    baseData["Payment Status"] = reg.payment_status || 'Not Required';
                    baseData["Transaction ID"] = reg.payment_transaction_id || '-';
                    baseData["Payment Screenshot"] = reg.payment_screenshot_url ? 'Uploaded' : 'Not Uploaded';
                }

                return baseData;
            }

            const baseData = {
                "Name": cleanName(reg.name) || '-',
                "Email": cleanEmail(reg.email) || '-',
                "Phone": cleanPhone(reg.phone) || '-',
                "Class": cleanClass(reg.class) || '-',
                "College": cleanCollege(reg.college) || '-',
                "Roll No": cleanRollNo(reg.roll_no) || '-',
                "College ID": reg.college_id_url ? 'Photo Uploaded' : 'Not Uploaded',
                "Verification Status": reg.verification_status === 'verified' ? 'Verified' :
                                      reg.verification_status === 'rejected' ? 'Rejected' : 'Pending',
                "Verified At": reg.verified_at ? new Date(reg.verified_at).toLocaleString() : '-',
                "Verified By": reg.verified_by || '-',
                "Rejection Reason": reg.rejection_reason || '-',
                "Event": reg.events?.event_name || '-',
                "Registration Date": reg.created_at ? new Date(reg.created_at).toLocaleString() : '-'
            };

            // Add payment information for paid events (shouldn't happen for individual events, but just in case)
            if (isPaidEvent) {
                baseData["Payment Required"] = reg.payment_required ? 'Yes' : 'No';
                baseData["Entry Fee"] = reg.payment_amount ? `₹${reg.payment_amount}` : '-';
                baseData["Payment Status"] = reg.payment_status || 'Not Required';
                baseData["Transaction ID"] = reg.payment_transaction_id || '-';
                baseData["Payment Screenshot"] = reg.payment_screenshot_url ? 'Uploaded' : 'Not Uploaded';
            }

            return baseData;
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registrations");
        const fileName = selectedEvent !== 'all' ? `${selectedEvent}_Registrations.xlsx` : 'All_Registrations.xlsx';
        XLSX.writeFile(wb, fileName);
    };

    const viewImage = async (filePath, memberName) => {
        if (!filePath) {
            alert('No college ID photo uploaded for this member');
            return;
        }

        setImageLoading(true);
        try {
            // Generate signed URL for private file access
            const { data, error } = await supabase.storage
                .from('college-ids')
                .createSignedUrl(filePath, 3600); // 1 hour expiry

            if (error) {
                console.error('Error generating signed URL:', error);
                alert('Error accessing college ID photo');
                return;
            }

            setCurrentImageUrl(data.signedUrl);
            setImageViewerOpen(true);
        } catch (error) {
            console.error('Error viewing college ID photo:', error);
            alert('Error viewing college ID photo');
        } finally {
            setImageLoading(false);
        }
    };

    const closeImageViewer = () => {
        setImageViewerOpen(false);
        setCurrentImageUrl(null);
    };

    // MULTIPLE IMAGES VIEWER FUNCTIONS
    const viewMultipleImages = async (registration, teamName) => {
        const imagePaths = [
            { path: registration.player1_college_id_url, name: registration.name || 'Team Leader' },
            { path: registration.player2_college_id_url, name: registration.player2_name || 'Member 2' },
            { path: registration.player3_college_id_url, name: registration.player3_name || 'Member 3' },
            { path: registration.player4_college_id_url, name: registration.player4_name || 'Member 4' }
        ].filter(img => img.path); // Only include images that exist

        if (imagePaths.length === 0) {
            alert('No college ID photos uploaded for this team');
            return;
        }

        setMultipleImagesLoading(true);
        try {
            const imagePromises = imagePaths.map(async (img) => {
                const { data, error } = await supabase.storage
                    .from('college-ids')
                    .createSignedUrl(img.path, 3600); // 1 hour expiry

                if (error) {
                    console.error('Error generating signed URL for', img.name, ':', error);
                    return null;
                }

                return {
                    url: data.signedUrl,
                    name: img.name,
                    path: img.path
                };
            });

            const resolvedImages = await Promise.all(imagePromises);
            const validImages = resolvedImages.filter(img => img !== null);

            if (validImages.length === 0) {
                alert('Error accessing college ID photos');
                return;
            }

            setCurrentImages(validImages);
            setMultipleImagesViewerOpen(true);
        } catch (error) {
            console.error('Error viewing multiple college ID photos:', error);
            alert('Error viewing college ID photos');
        } finally {
            setMultipleImagesLoading(false);
        }
    };

    const closeMultipleImagesViewer = () => {
        setMultipleImagesViewerOpen(false);
        setCurrentImages([]);
    };

    // SINGLE IMAGE ZOOM VIEWER FUNCTIONS
    const viewSingleImage = (imageUrl, imageName) => {
        setCurrentSingleImage({ url: imageUrl, name: imageName });
        setSingleImageViewerOpen(true);
    };

    const closeSingleImageViewer = () => {
        setSingleImageViewerOpen(false);
        setCurrentSingleImage(null);
    };

    // PAYMENT SCREENSHOT FUNCTIONS
    const viewPaymentScreenshot = async (screenshotPath, teamName) => {
        if (!screenshotPath) {
            alert('No payment screenshot uploaded');
            return;
        }

        setPaymentLoading(true);
        try {
            // Generate signed URL for private payment screenshot
            const { data, error } = await supabase.storage
                .from('payment-screenshots')
                .createSignedUrl(screenshotPath, 3600); // 1 hour expiry

            if (error) {
                console.error('Error generating payment screenshot URL:', error);
                alert('Error accessing payment screenshot');
                return;
            }

            setCurrentPaymentUrl(data.signedUrl);
            setPaymentViewerOpen(true);
        } catch (error) {
            console.error('Error viewing payment screenshot:', error);
            alert('Error viewing payment screenshot');
        } finally {
            setPaymentLoading(false);
        }
    };

    const closePaymentViewer = () => {
        setPaymentViewerOpen(false);
        setCurrentPaymentUrl(null);
    };

    // VERIFICATION STATUS UPDATE FUNCTION - USING DATABASE FUNCTION
    const updateVerificationStatus = async (registrationId, newStatus, rejectionReason = null) => {
        setVerificationUpdateLoading(registrationId);
        try {
            console.log('🔄 Updating verification status using database function');
            console.log('Registration ID:', registrationId);
            console.log('New Status:', newStatus);
            console.log('Rejection Reason:', rejectionReason);
            
            // Use the database function for reliable updates
            const { data, error } = await supabase.rpc('update_verification_status', {
                reg_id: registrationId,
                new_status: newStatus,
                admin_email: session?.user?.email || 'admin',
                reason: rejectionReason
            });

            if (error) {
                console.error('❌ Database function error:', error);
                alert(`Update failed: ${error.message}`);
                return;
            }

            console.log('✅ Database function result:', data);

            // Check if the function reported success
            if (!data.success) {
                console.error('❌ Function reported failure:', data.error);
                alert(`Update failed: ${data.error}`);
                return;
            }

            // Verify the update worked
            console.log('🔍 Verification successful:', data.verification_status);

            // Force refresh the registration list
            console.log('🔄 Refreshing registration list...');
            await fetchRegistrations();
            
            alert(`✅ SUCCESS: Verification status updated to ${newStatus.toUpperCase()}`);

        } catch (error) {
            console.error('❌ Verification update error:', error);
            alert(`CRITICAL ERROR: ${error.message}`);
        } finally {
            setVerificationUpdateLoading(null);
        }
    };

    // PAYMENT STATUS UPDATE - NUCLEAR OPTION (BYPASS ALL ISSUES)
    const updatePaymentStatus = async (registrationId, newStatus) => {
        setStatusUpdateLoading(registrationId);
        try {
            console.log('🔄 NUCLEAR OPTION: Direct database update');
            console.log('Registration ID:', registrationId);
            console.log('New Status:', newStatus);
            
            // STEP 1: Use raw SQL to bypass any Supabase client issues
            const { data: rawUpdate, error: rawError } = await supabase.rpc('update_payment_status_raw', {
                reg_id: registrationId,
                new_status: newStatus
            });

            if (rawError) {
                console.error('❌ Raw update failed, trying direct approach:', rawError);
                
                // STEP 2: Fallback to direct update with explicit transaction
                const { data: directUpdate, error: directError } = await supabase
                    .from('registrations')
                    .update({ 
                        payment_status: newStatus
                    })
                    .eq('id', registrationId)
                    .select('id, name, payment_status');

                if (directError) {
                    console.error('❌ Direct update failed:', directError);
                    alert(`Update failed: ${directError.message}`);
                    return;
                }

                console.log('✅ Direct update result:', directUpdate);
            } else {
                console.log('✅ Raw update successful:', rawUpdate);
            }

            // STEP 3: Immediate verification with fresh connection
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            
            const { data: verifyData, error: verifyError } = await supabase
                .from('registrations')
                .select('id, name, payment_status, payment_required')
                .eq('id', registrationId)
                .single();

            if (verifyError) {
                console.error('❌ Verification failed:', verifyError);
                alert('Could not verify update');
                return;
            }

            console.log('🔍 Verification result:', verifyData);

            if (verifyData.payment_status !== newStatus) {
                console.error('❌ STATUS STILL WRONG!');
                console.error('Expected:', newStatus);
                console.error('Got:', verifyData.payment_status);
                
                // STEP 4: Try one more time with different approach
                console.log('🔄 Trying alternative update method...');
                
                const { error: altError } = await supabase
                    .from('registrations')
                    .upsert({ 
                        id: registrationId,
                        payment_status: newStatus
                    }, { 
                        onConflict: 'id',
                        ignoreDuplicates: false 
                    });

                if (altError) {
                    console.error('❌ Alternative update failed:', altError);
                    alert(`CRITICAL: Status update completely failed. Database issue detected.`);
                    return;
                }

                // Final verification
                const { data: finalCheck } = await supabase
                    .from('registrations')
                    .select('payment_status')
                    .eq('id', registrationId)
                    .single();

                if (finalCheck?.payment_status !== newStatus) {
                    alert(`CRITICAL DATABASE ISSUE: Status keeps reverting. Expected: ${newStatus}, Got: ${finalCheck?.payment_status}`);
                    return;
                }
            }

            // STEP 5: Force complete refresh
            console.log('🔄 Force refreshing admin panel...');
            setRegistrations([]);
            await new Promise(resolve => setTimeout(resolve, 500));
            await fetchRegistrations();
            
            alert(`✅ SUCCESS: Payment status updated to ${newStatus.toUpperCase()}`);

        } catch (error) {
            console.error('❌ NUCLEAR OPTION FAILED:', error);
            alert(`CRITICAL ERROR: ${error.message}`);
        } finally {
            setStatusUpdateLoading(null);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">Loading...</div>;

    if (!session) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h1 className="text-3xl font-orbitron font-bold text-white mb-6 text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {authError && <div className="text-red-400 text-sm text-center">{authError}</div>}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-purple focus:outline-none"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-neon-purple/80 hover:bg-neon-purple text-white font-bold rounded-lg transition-colors"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-orbitron font-bold">Registration Dashboard</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                console.log('🔄 Manual refresh triggered');
                                fetchRegistrations();
                            }}
                            disabled={refreshing}
                            className="flex items-center px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {refreshing ? (
                                <div className="animate-spin w-4 h-4 mr-2 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                            ) : (
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            )}
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                        >
                            <LogOut size={16} className="mr-2" /> Logout
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="relative">
                            <label className="block text-sm text-gray-400 mb-2">Search Students</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Name, Email, Phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-neon-purple focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Filter by Event</label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <select
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-neon-purple focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="all">All Events</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.event_name}>{event.event_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Verification Status</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <select
                                    value={verificationFilter}
                                    onChange={(e) => setVerificationFilter(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-neon-purple focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="normal">Normal View (Exclude Rejected)</option>
                                    <option value="all">All Registrations</option>
                                    <option value="verified">✓ Verified Only</option>
                                    <option value="pending">⏳ Pending Only</option>
                                    <option value="rejected">✗ Rejected Only</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={exportToExcel}
                                className="w-full md:w-auto flex items-center justify-center px-6 py-2.5 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                            >
                                <Download size={18} className="mr-2" /> Download Excel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 rounded-xl p-6">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Registrations</h3>
                        <p className="text-3xl font-bold text-white">{filteredRegistrations.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10 rounded-xl p-6">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">✓ Verified</h3>
                        <p className="text-3xl font-bold text-white">
                            {filteredRegistrations.filter(reg => reg.verification_status === 'verified').length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/10 rounded-xl p-6">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">⏳ Pending Verification</h3>
                        <p className="text-3xl font-bold text-white">
                            {filteredRegistrations.filter(reg => reg.verification_status === 'pending' || !reg.verification_status).length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-white/10 rounded-xl p-6">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">✗ Rejected</h3>
                        <p className="text-3xl font-bold text-white">
                            {filteredRegistrations.filter(reg => reg.verification_status === 'rejected').length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 rounded-xl p-6">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Payment Pending</h3>
                        <p className="text-3xl font-bold text-white">
                            {filteredRegistrations.filter(reg => reg.payment_required && reg.payment_status === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-xl p-6">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">ID Photos Uploaded</h3>
                        <p className="text-3xl font-bold text-white">
                            {filteredRegistrations.filter(reg => reg.college_id_url).length}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Contact</th>
                                    <th className="px-6 py-4 font-medium">Academic Info</th>
                                    <th className="px-6 py-4 font-medium">Event</th>
                                    <th className="px-6 py-4 font-medium">Verification</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 text-sm">
                                {filteredRegistrations.length > 0 ? (
                                    filteredRegistrations.map((reg) => {
                                        const isTeamEvent = reg.events?.event_name?.includes("BGMI") || 
                                                           reg.events?.event_name?.includes("Free Fire") || 
                                                           reg.events?.event_name?.includes("Hackastra") ||
                                                           reg.events?.event_name?.includes("Fashion Flex");
                                        const isExpanded = expandedRow === reg.id;
                                        
                                        return (
                                            <React.Fragment key={reg.id}>
                                                <tr className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-white">{reg.name}</div>
                                                        {isTeamEvent && <div className="text-xs text-gray-500 mt-1">Leader/IGL</div>}
                                                        {!isTeamEvent && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className={`text-xs ${reg.college_id_url ? 'text-green-400' : 'text-red-400'}`}>
                                                                    ID: {reg.college_id_url ? '✓' : '✗'}
                                                                </div>
                                                                {reg.college_id_url && (
                                                                    <button
                                                                        onClick={() => viewImage(reg.college_id_url, reg.name)}
                                                                        disabled={imageLoading}
                                                                        className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-colors disabled:opacity-50"
                                                                    >
                                                                        <Eye size={10} />
                                                                        View
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                        {isTeamEvent && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className={`text-xs ${
                                                                    reg.player1_college_id_url || reg.player2_college_id_url || 
                                                                    reg.player3_college_id_url || reg.player4_college_id_url || 
                                                                    reg.college_id_url ? 'text-green-400' : 'text-red-400'
                                                                }`}>
                                                                    Team IDs: {
                                                                        reg.player1_college_id_url || reg.player2_college_id_url || 
                                                                        reg.player3_college_id_url || reg.player4_college_id_url || 
                                                                        reg.college_id_url ? '✓' : '✗'
                                                                    }
                                                                </div>
                                                                {(reg.player1_college_id_url || reg.player2_college_id_url || 
                                                                  reg.player3_college_id_url || reg.player4_college_id_url || 
                                                                  reg.college_id_url) && (
                                                                    <button
                                                                        onClick={() => {
                                                                            // Check if we have individual photos or fallback to old system
                                                                            if (reg.player1_college_id_url || reg.player2_college_id_url || 
                                                                                reg.player3_college_id_url || reg.player4_college_id_url) {
                                                                                viewMultipleImages(reg, `${reg.team_name} Team`);
                                                                            } else {
                                                                                viewImage(reg.college_id_url, `${reg.team_name} Team`);
                                                                            }
                                                                        }}
                                                                        disabled={multipleImagesLoading || imageLoading}
                                                                        className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-colors disabled:opacity-50"
                                                                    >
                                                                        <Eye size={10} />
                                                                        View All
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white">{reg.email}</div>
                                                        <div className="text-gray-500 text-xs mt-1">{reg.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {isTeamEvent ? (
                                                            <div className="text-white">
                                                                <span className="text-neon-purple text-xs uppercase tracking-wider">Team:</span> {reg.team_name}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="text-white">{reg.class}</div>
                                                                <div className="text-gray-500 text-xs mt-1">{reg.college}</div>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-block px-2 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-semibold">
                                                            {reg.events?.event_name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                reg.verification_status === 'verified' ? 'bg-green-500/20 text-green-400' :
                                                                reg.verification_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-yellow-500/20 text-yellow-400'
                                                            }`}>
                                                                {reg.verification_status === 'verified' ? '✓ Verified' :
                                                                 reg.verification_status === 'rejected' ? '✗ Rejected' :
                                                                 '⏳ Pending'}
                                                            </div>
                                                            
                                                            {/* Show rejection reason if rejected */}
                                                            {reg.verification_status === 'rejected' && reg.rejection_reason && (
                                                                <div className="text-xs text-red-300 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 mt-1">
                                                                    <span className="font-medium">Reason:</span> {reg.rejection_reason}
                                                                </div>
                                                            )}
                                                            
                                                            {/* Show verification details for verified/rejected */}
                                                            {(reg.verification_status === 'verified' || reg.verification_status === 'rejected') && (
                                                                <div className="text-xs text-gray-400 mt-1">
                                                                    {reg.verified_at && (
                                                                        <div>On: {new Date(reg.verified_at).toLocaleDateString()}</div>
                                                                    )}
                                                                    {reg.verified_by && (
                                                                        <div>By: {reg.verified_by}</div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            
                                                            {/* Verification Buttons for Pending Status */}
                                                            {reg.verification_status === 'pending' || !reg.verification_status ? (
                                                                <div className="flex gap-1 mt-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            if (verificationUpdateLoading === reg.id) return;
                                                                            console.log('Verify button clicked for registration:', reg.id, 'Name:', reg.name);
                                                                            updateVerificationStatus(reg.id, 'verified');
                                                                        }}
                                                                        disabled={verificationUpdateLoading === reg.id}
                                                                        className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-colors disabled:opacity-50"
                                                                        title="Verify Registration"
                                                                    >
                                                                        {verificationUpdateLoading === reg.id ? '...' : '✓'}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            if (verificationUpdateLoading === reg.id) return;
                                                                            const reason = prompt('Rejection reason (optional):');
                                                                            console.log('Reject button clicked for registration:', reg.id, 'Name:', reg.name);
                                                                            updateVerificationStatus(reg.id, 'rejected', reason);
                                                                        }}
                                                                        disabled={verificationUpdateLoading === reg.id}
                                                                        className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors disabled:opacity-50"
                                                                        title="Reject Registration"
                                                                    >
                                                                        {verificationUpdateLoading === reg.id ? '...' : '✗'}
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                /* Reset Button for Verified/Rejected */
                                                                <button
                                                                    onClick={() => {
                                                                        if (verificationUpdateLoading === reg.id) return;
                                                                        if (confirm(`Reset verification status to pending for ${reg.name}?`)) {
                                                                            updateVerificationStatus(reg.id, 'pending');
                                                                        }
                                                                    }}
                                                                    disabled={verificationUpdateLoading === reg.id}
                                                                    className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-xs transition-colors disabled:opacity-50 mt-1"
                                                                    title="Reset to Pending"
                                                                >
                                                                    {verificationUpdateLoading === reg.id ? 'Updating...' : 'Reset'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-400">
                                                        {new Date(reg.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {isTeamEvent && (
                                                            <button
                                                                onClick={() => setExpandedRow(isExpanded ? null : reg.id)}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors text-xs font-medium"
                                                            >
                                                                <Users size={14} />
                                                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                                Team
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                                {isTeamEvent && isExpanded && (
                                                    <tr className="bg-white/5">
                                                        <td colSpan="7" className="px-6 py-4">
                                                            <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <h4 className="text-white font-semibold flex items-center gap-2">
                                                                        <Users size={16} className="text-cyan-400" />
                                                                        Team Members
                                                                    </h4>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`text-sm ${
                                                                            reg.player1_college_id_url || reg.player2_college_id_url || 
                                                                            reg.player3_college_id_url || reg.player4_college_id_url || 
                                                                            reg.college_id_url ? 'text-green-400' : 'text-red-400'
                                                                        }`}>
                                                                            Team College IDs: {
                                                                                reg.player1_college_id_url || reg.player2_college_id_url || 
                                                                                reg.player3_college_id_url || reg.player4_college_id_url || 
                                                                                reg.college_id_url ? '✓ Uploaded' : '✗ Not Uploaded'
                                                                            }
                                                                        </div>
                                                                        {(reg.player1_college_id_url || reg.player2_college_id_url || 
                                                                          reg.player3_college_id_url || reg.player4_college_id_url || 
                                                                          reg.college_id_url) && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    // Check if we have individual photos or fallback to old system
                                                                                    if (reg.player1_college_id_url || reg.player2_college_id_url || 
                                                                                        reg.player3_college_id_url || reg.player4_college_id_url) {
                                                                                        viewMultipleImages(reg, `${reg.team_name} Team`);
                                                                                    } else {
                                                                                        viewImage(reg.college_id_url, `${reg.team_name} Team`);
                                                                                    }
                                                                                }}
                                                                                disabled={multipleImagesLoading || imageLoading}
                                                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm transition-colors disabled:opacity-50"
                                                                            >
                                                                                <Eye size={14} />
                                                                                View All IDs
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    {/* PAYMENT INFORMATION - ENHANCED RESPONSIVE UI */}
                                                                    {reg.payment_required && (
                                                                        <div className="mt-3 pt-3 border-t border-white/10">
                                                                            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-3 sm:p-4">
                                                                                <div className="flex items-center justify-between mb-3">
                                                                                    <h4 className="text-sm sm:text-base font-semibold text-yellow-400 flex items-center gap-2">
                                                                                        <CreditCard size={16} />
                                                                                        Payment Details
                                                                                    </h4>
                                                                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                                        reg.payment_status === 'verified' ? 'bg-green-500/20 text-green-400' :
                                                                                        reg.payment_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                                        reg.payment_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                                                        'bg-gray-500/20 text-gray-400'
                                                                                    }`}>
                                                                                        {reg.payment_status === 'verified' ? '✓ Verified' :
                                                                                         reg.payment_status === 'pending' ? '⏳ Pending' :
                                                                                         reg.payment_status === 'rejected' ? '✗ Rejected' :
                                                                                         reg.payment_status || 'Unknown'}
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                {/* Payment Info Grid - Responsive */}
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                                                                                    <div className="bg-black/20 rounded-lg p-2">
                                                                                        <div className="text-xs text-gray-400">Entry Fee</div>
                                                                                        <div className="text-sm font-semibold text-yellow-400">
                                                                                            ₹{reg.payment_amount}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className="bg-black/20 rounded-lg p-2">
                                                                                        <div className="text-xs text-gray-400">Transaction ID</div>
                                                                                        <div className="text-sm font-mono text-cyan-400 truncate">
                                                                                            {reg.payment_transaction_id || 'N/A'}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className="bg-black/20 rounded-lg p-2">
                                                                                        <div className="text-xs text-gray-400">Payment Screenshot</div>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <div className={`text-sm ${reg.payment_screenshot_url ? 'text-green-400' : 'text-red-400'}`}>
                                                                                                {reg.payment_screenshot_url ? '✓ Uploaded' : '✗ Missing'}
                                                                                            </div>
                                                                                            {reg.payment_screenshot_url && (
                                                                                                <button
                                                                                                    onClick={() => viewPaymentScreenshot(reg.payment_screenshot_url, reg.team_name)}
                                                                                                    disabled={paymentLoading}
                                                                                                    className="px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-xs transition-colors disabled:opacity-50"
                                                                                                >
                                                                                                    View
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className="bg-black/20 rounded-lg p-2">
                                                                                        <div className="text-xs text-gray-400">Status</div>
                                                                                        <div className={`text-sm font-medium ${
                                                                                            reg.payment_status === 'verified' ? 'text-green-400' :
                                                                                            reg.payment_status === 'pending' ? 'text-yellow-400' :
                                                                                            reg.payment_status === 'rejected' ? 'text-red-400' :
                                                                                            'text-gray-400'
                                                                                        }`}>
                                                                                            {reg.payment_status === 'verified' ? 'Verified' :
                                                                                             reg.payment_status === 'pending' ? 'Pending' :
                                                                                             reg.payment_status === 'rejected' ? 'Rejected' :
                                                                                             reg.payment_status || 'Unknown'}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Action Buttons - Responsive */}
                                                                                {reg.payment_status === 'pending' && (
                                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-3 border-t border-white/10">
                                                                                        <span className="text-sm text-gray-400 mb-2 sm:mb-0">Update Status:</span>
                                                                                        
                                                                                        {/* DEBUG INFO */}
                                                                                        <div className="text-xs text-gray-500 mb-2 font-mono bg-gray-800 p-2 rounded">
                                                                                            <div>ID: {reg.id}</div>
                                                                                            <div>Status: {reg.payment_status}</div>
                                                                                            <div>Required: {reg.payment_required ? 'Yes' : 'No'}</div>
                                                                                            <div>Amount: ₹{reg.payment_amount || 'N/A'}</div>
                                                                                        </div>
                                                                                        
                                                                                        <div className="flex gap-2 w-full sm:w-auto">
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    if (statusUpdateLoading === reg.id) return; // Prevent double-click
                                                                                                    console.log('Verify button clicked for registration:', reg.id, 'Name:', reg.name);
                                                                                                    updatePaymentStatus(reg.id, 'verified');
                                                                                                }}
                                                                                                disabled={statusUpdateLoading === reg.id}
                                                                                                className="flex-1 sm:flex-none px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                                                            >
                                                                                                {statusUpdateLoading === reg.id ? (
                                                                                                    <>
                                                                                                        <div className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
                                                                                                        Verifying...
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <>✓ Verify Payment</>
                                                                                                )}
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    if (statusUpdateLoading === reg.id) return; // Prevent double-click
                                                                                                    console.log('Reject button clicked for registration:', reg.id, 'Name:', reg.name);
                                                                                                    updatePaymentStatus(reg.id, 'rejected');
                                                                                                }}
                                                                                                disabled={statusUpdateLoading === reg.id}
                                                                                                className="flex-1 sm:flex-none px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                                                            >
                                                                                                {statusUpdateLoading === reg.id ? (
                                                                                                    <>
                                                                                                        <div className="animate-spin w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full"></div>
                                                                                                        Rejecting...
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <>✗ Reject Payment</>
                                                                                                )}
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}

                                                                                {/* Final Status Display */}
                                                                                {reg.payment_status !== 'pending' && (
                                                                                    <div className="pt-3 border-t border-white/10">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                                                                                                reg.payment_status === 'verified' ? 'bg-green-500/20 text-green-400' :
                                                                                                reg.payment_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                                                                'bg-gray-500/20 text-gray-400'
                                                                                            }`}>
                                                                                                {reg.payment_status === 'verified' ? '✓ Payment Verified - Registration Complete' :
                                                                                                 reg.payment_status === 'rejected' ? '✗ Payment Rejected - Registration Invalid' :
                                                                                                 `Status: ${reg.payment_status}`}
                                                                                            </div>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    if (statusUpdateLoading === reg.id) return;
                                                                                                    if (confirm(`Reset payment status to pending for ${reg.name}?`)) {
                                                                                                        updatePaymentStatus(reg.id, 'pending');
                                                                                                    }
                                                                                                }}
                                                                                                disabled={statusUpdateLoading === reg.id}
                                                                                                className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                            >
                                                                                                {statusUpdateLoading === reg.id ? 'Updating...' : 'Reset to Pending'}
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="bg-white/5 rounded-lg p-3">
                                                                        <div className="text-xs text-gray-500 mb-1">Leader / IGL</div>
                                                                        <div className="text-white font-medium">{reg.name}</div>
                                                                        <div className="text-gray-400 text-sm mt-1">{reg.email}</div>
                                                                        <div className="text-gray-400 text-sm">{reg.phone}</div>
                                                                        <div className="text-gray-400 text-sm">Roll: {reg.roll_no || 'N/A'}</div>
                                                                    </div>
                                                                    {reg.player2_name && (
                                                                        <div className="bg-white/5 rounded-lg p-3">
                                                                            <div className="text-xs text-gray-500 mb-1">Member 2</div>
                                                                            <div className="text-white font-medium">{reg.player2_name}</div>
                                                                            <div className="text-gray-400 text-sm">Roll: {reg.player2_roll_no || 'N/A'}</div>
                                                                            <div className="text-gray-400 text-sm">Class: {reg.player2_class || 'N/A'}</div>
                                                                        </div>
                                                                    )}
                                                                    {reg.player3_name && (
                                                                        <div className="bg-white/5 rounded-lg p-3">
                                                                            <div className="text-xs text-gray-500 mb-1">Member 3</div>
                                                                            <div className="text-white font-medium">{reg.player3_name}</div>
                                                                            <div className="text-gray-400 text-sm">Roll: {reg.player3_roll_no || 'N/A'}</div>
                                                                            <div className="text-gray-400 text-sm">Class: {reg.player3_class || 'N/A'}</div>
                                                                        </div>
                                                                    )}
                                                                    {reg.player4_name && (
                                                                        <div className="bg-white/5 rounded-lg p-3">
                                                                            <div className="text-xs text-gray-500 mb-1">Member 4</div>
                                                                            <div className="text-white font-medium">{reg.player4_name}</div>
                                                                            <div className="text-gray-400 text-sm">Roll: {reg.player4_roll_no || 'N/A'}</div>
                                                                            <div className="text-gray-400 text-sm">Class: {reg.player4_class || 'N/A'}</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="mt-3 pt-3 border-t border-white/10">
                                                                    <div className="text-xs text-gray-500">Team College (All Members)</div>
                                                                    <div className="text-white text-sm mt-1">{reg.college}</div>
                                                                    <div className="text-xs text-gray-400 mt-1">Leader Class: {reg.class}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* College ID Image Viewer Modal */}
            {imageViewerOpen && currentImageUrl && (
                <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <FileText size={20} />
                                <span className="font-medium">College ID Photo</span>
                            </div>
                            <button
                                onClick={closeImageViewer}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="pt-16 h-full flex items-center justify-center bg-gray-100">
                            <img
                                src={currentImageUrl}
                                alt="College ID"
                                className="max-w-full max-h-full object-contain"
                                style={{ maxHeight: 'calc(90vh - 4rem)' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Multiple College ID Images Viewer Modal */}
            {multipleImagesViewerOpen && currentImages.length > 0 && (
                <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-lg overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <FileText size={20} />
                                <span className="font-medium">Team College ID Photos ({currentImages.length})</span>
                            </div>
                            <button
                                onClick={closeMultipleImagesViewer}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="pt-16 h-full bg-gray-100 overflow-auto">
                            <div className={`p-4 grid gap-4 ${
                                currentImages.length === 1 ? 'grid-cols-1' :
                                currentImages.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
                                currentImages.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                                'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'
                            }`}>
                                {currentImages.map((image, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="bg-gray-800 text-white p-3 text-center font-medium">
                                            {image.name}
                                        </div>
                                        <div className="p-3">
                                            <div className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={image.url}
                                                    alt={`${image.name} College ID`}
                                                    className="w-full cursor-pointer hover:scale-105 transition-transform duration-200"
                                                    style={{ 
                                                        height: '200px',
                                                        objectFit: 'contain',
                                                        backgroundColor: '#f9fafb'
                                                    }}
                                                    onClick={() => {
                                                        // Open single image viewer instead of new tab
                                                        viewSingleImage(image.url, image.name);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 text-center text-gray-600 text-sm">
                                <p>💡 Click any image to view full size • Right-click to save image</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Single Image Zoom Viewer Modal */}
            {singleImageViewerOpen && currentSingleImage && (
                <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full h-full max-w-5xl max-h-[95vh] bg-white rounded-lg overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <FileText size={20} />
                                <span className="font-medium">{currentSingleImage.name} - College ID</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(currentSingleImage.url, '_blank')}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                                >
                                    Open Full Size
                                </button>
                                <button
                                    onClick={closeSingleImageViewer}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="pt-16 h-full bg-gray-100 flex items-center justify-center p-4">
                            <div className="w-full h-full flex items-center justify-center">
                                <img
                                    src={currentSingleImage.url}
                                    alt={`${currentSingleImage.name} College ID`}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                    style={{ 
                                        maxHeight: 'calc(95vh - 6rem)',
                                        backgroundColor: 'white',
                                        padding: '1rem'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading overlay for multiple images operations */}
            {multipleImagesLoading && (
                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-white text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-3"></div>
                        <p>Loading Team College ID Photos...</p>
                    </div>
                </div>
            )}

            {/* Loading overlay for image operations */}
            {imageLoading && (
                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-white text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-3"></div>
                        <p>Loading College ID Photo...</p>
                    </div>
                </div>
            )}
            {/* Payment Screenshot Viewer Modal */}
            {paymentViewerOpen && currentPaymentUrl && (
                <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <CreditCard size={20} />
                                <span className="font-medium">Payment Screenshot</span>
                            </div>
                            <button
                                onClick={closePaymentViewer}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="pt-16 h-full flex items-center justify-center">
                            <img
                                src={currentPaymentUrl}
                                alt="Payment Screenshot"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Loading overlay for payment operations */}
            {paymentLoading && (
                <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white/10 border border-white/20 rounded-lg p-6 text-white text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-3"></div>
                        <p>Loading Payment Screenshot...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
