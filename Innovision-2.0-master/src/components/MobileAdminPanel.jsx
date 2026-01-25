import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
    Download, Search, Filter, LogOut, ChevronDown, ChevronUp, 
    Users, FileText, Eye, X, CreditCard, Menu, Grid, List,
    Smartphone, Monitor, RotateCcw, Settings
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { cleanName, cleanEmail, cleanPhone, cleanRollNo, cleanClass, cleanCollege, cleanTeamName } from '../utils/dataCleaners';

const MobileAdminPanel = () => {
    // All existing state from AdminPanel
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchError, setFetchError] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
    // Mobile-specific state
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLandscape, setIsLandscape] = useState(false);
    const [compactMode, setCompactMode] = useState(false);
    
    // Verification and payment state
    const [verificationFilter, setVerificationFilter] = useState('normal');
    const [verificationUpdateLoading, setVerificationUpdateLoading] = useState(null);
    const [paymentViewerOpen, setPaymentViewerOpen] = useState(false);
    const [currentPaymentUrl, setCurrentPaymentUrl] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);

    // Detect orientation changes
    useEffect(() => {
        const handleOrientationChange = () => {
            setIsLandscape(window.innerHeight < window.innerWidth);
        };
        
        handleOrientationChange();
        window.addEventListener('resize', handleOrientationChange);
        window.addEventListener('orientationchange', handleOrientationChange);
        
        return () => {
            window.removeEventListener('resize', handleOrientationChange);
            window.removeEventListener('orientationchange', handleOrientationChange);
        };
    }, []);

    // Auto-enable compact mode on mobile landscape
    useEffect(() => {
        if (window.innerWidth <= 768 && isLandscape) {
            setCompactMode(true);
            setViewMode('table');
        }
    }, [isLandscape]);

    // All existing functions from AdminPanel would be copied here
    // For brevity, I'll include key ones and indicate where others go

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Login function
    const handleLogin = async (e) => {
        e.preventDefault();
        setAuthError(null);
        
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
            if (error) throw error;
        } catch (error) {
            setAuthError(error.message);
        }
    };

    // Logout function
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    // Fetch functions (same as original)
    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_name');
            
            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchRegistrations = async () => {
        setRefreshing(true);
        try {
            let query = supabase
                .from('registrations')
                .select(`
                    *,
                    events (
                        id,
                        event_name,
                        entry_fee
                    )
                `)
                .order('created_at', { ascending: false });

            if (selectedEvent !== 'all') {
                const eventId = events.find(e => e.event_name === selectedEvent)?.id;
                if (eventId) query = query.eq('event_id', eventId);
            }

            if (verificationFilter === 'verified') {
                query = query.eq('verification_status', 'verified');
            } else if (verificationFilter === 'pending') {
                query = query.eq('verification_status', 'pending');
            } else if (verificationFilter === 'rejected') {
                query = query.eq('verification_status', 'rejected');
            } else if (verificationFilter === 'normal') {
                query = query.neq('verification_status', 'rejected');
            }

            const { data, error } = await query;
            if (error) {
                setFetchError(error.message);
            } else {
                setRegistrations(data || []);
                setFetchError(null);
            }
        } catch (error) {
            setFetchError(error.message);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchEvents();
            fetchRegistrations();
        }
    }, [session, selectedEvent, verificationFilter]);

    // Verification function
    const updateVerificationStatus = async (registrationId, newStatus, rejectionReason = null) => {
        setVerificationUpdateLoading(registrationId);
        
        try {
            const updateData = {
                verification_status: newStatus,
                verified_at: new Date().toISOString(),
                verified_by: session.user.email
            };
            
            if (newStatus === 'rejected' && rejectionReason) {
                updateData.rejection_reason = rejectionReason;
            }
            
            const { error } = await supabase
                .from('registrations')
                .update(updateData)
                .eq('id', registrationId);
                
            if (error) throw error;
            
            // Refresh data
            fetchRegistrations();
        } catch (error) {
            console.error('Error updating verification status:', error);
            alert('Failed to update verification status');
        } finally {
            setVerificationUpdateLoading(null);
        }
    };

    // Image viewing functions
    const viewImage = async (imageUrl, title) => {
        setImageLoading(true);
        try {
            const { data } = await supabase.storage
                .from('college-ids')
                .createSignedUrl(imageUrl, 3600);
            
            if (data?.signedUrl) {
                setCurrentImageUrl(data.signedUrl);
                setImageViewerOpen(true);
            }
        } catch (error) {
            console.error('Error loading image:', error);
        } finally {
            setImageLoading(false);
        }
    };

    const closeImageViewer = () => {
        setImageViewerOpen(false);
        setCurrentImageUrl(null);
    };

    const viewPaymentScreenshot = async (imageUrl, title) => {
        setPaymentLoading(true);
        try {
            const { data } = await supabase.storage
                .from('payment-screenshots')
                .createSignedUrl(imageUrl, 3600);
            
            if (data?.signedUrl) {
                setCurrentPaymentUrl(data.signedUrl);
                setPaymentViewerOpen(true);
            }
        } catch (error) {
            console.error('Error loading payment screenshot:', error);
        } finally {
            setPaymentLoading(false);
        }
    };

    const closePaymentViewer = () => {
        setPaymentViewerOpen(false);
        setCurrentPaymentUrl(null);
    };

    // Filter registrations
    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm)
    );

    // Export function
    const exportToExcel = () => {
        const dataToExport = filteredRegistrations.map(reg => {
            const isTeamEvent = reg.events?.event_name?.includes("BGMI") || 
                               reg.events?.event_name?.includes("Free Fire") || 
                               reg.events?.event_name?.includes("Fashion Flex") || 
                               reg.events?.event_name?.includes("Hackastra");

            const baseData = {
                'Name': cleanName(reg.name),
                'Email': cleanEmail(reg.email),
                'Phone': cleanPhone(reg.phone),
                'Class': cleanClass(reg.class),
                'College': cleanCollege(reg.college),
                'Roll No': cleanRollNo(reg.roll_no),
                'Event': reg.events?.event_name || 'Unknown',
                'Registration Date': new Date(reg.created_at).toLocaleDateString(),
                'Verification Status': reg.verification_status || 'pending'
            };

            if (isTeamEvent) {
                return {
                    ...baseData,
                    'Team Name': cleanTeamName(reg.team_name),
                    'Member 2 Name': cleanName(reg.player2_name),
                    'Member 2 Roll': cleanRollNo(reg.player2_roll_no),
                    'Member 2 Class': cleanClass(reg.player2_class),
                    'Member 3 Name': cleanName(reg.player3_name),
                    'Member 3 Roll': cleanRollNo(reg.player3_roll_no),
                    'Member 3 Class': cleanClass(reg.player3_class),
                    'Member 4 Name': cleanName(reg.player4_name),
                    'Member 4 Roll': cleanRollNo(reg.player4_roll_no),
                    'Member 4 Class': cleanClass(reg.player4_class)
                };
            }

            return baseData;
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
        XLSX.writeFile(wb, `registrations_${selectedEvent}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sm:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Panel</h1>
                            <p className="text-gray-400">Secure access required</p>
                        </div>
                        
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            
                            {authError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {authError}
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Mobile Header */}
            <div className="lg:hidden bg-black/40 backdrop-blur-lg border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* View Mode Toggle */}
                        <button
                            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
                            title={`Switch to ${viewMode === 'cards' ? 'table' : 'card'} view`}
                        >
                            {viewMode === 'cards' ? <List size={18} /> : <Grid size={18} />}
                        </button>
                        
                        {/* Compact Mode Toggle */}
                        <button
                            onClick={() => setCompactMode(!compactMode)}
                            className={`p-2 rounded-lg transition-colors ${
                                compactMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                            title="Toggle compact mode"
                        >
                            <Settings size={18} />
                        </button>
                        
                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="p-2 bg-red-500/20 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="space-y-4">
                            {/* Search */}
                            <div>
                                <label className="block text-xs text-gray-400 mb-2">Search Registrations</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Name, email, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Event Filter */}
                            <div>
                                <label className="block text-xs text-gray-400 mb-2">Filter by Event</label>
                                <select
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                >
                                    <option value="all">All Events</option>
                                    {events.map(event => (
                                        <option key={event.id} value={event.event_name}>
                                            {event.event_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Verification Filter */}
                            <div>
                                <label className="block text-xs text-gray-400 mb-2">Verification Status</label>
                                <select
                                    value={verificationFilter}
                                    onChange={(e) => setVerificationFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                >
                                    <option value="normal">Normal View</option>
                                    <option value="all">All (Including Rejected)</option>
                                    <option value="verified">Verified Only</option>
                                    <option value="pending">Pending Only</option>
                                    <option value="rejected">Rejected Only</option>
                                </select>
                            </div>
                            
                            {/* Export Button */}
                            <button
                                onClick={exportToExcel}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Download size={16} />
                                Export Excel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block bg-black/40 backdrop-blur-lg border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Search className="text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search registrations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 w-64"
                            />
                        </div>
                        
                        <select
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        >
                            <option value="all">All Events</option>
                            {events.map(event => (
                                <option key={event.id} value={event.event_name}>
                                    {event.event_name}
                                </option>
                            ))}
                        </select>
                        
                        <select
                            value={verificationFilter}
                            onChange={(e) => setVerificationFilter(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                        >
                            <option value="normal">Normal View</option>
                            <option value="all">All (Including Rejected)</option>
                            <option value="verified">Verified Only</option>
                            <option value="pending">Pending Only</option>
                            <option value="rejected">Rejected Only</option>
                        </select>
                        
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors font-medium"
                        >
                            <Download size={18} />
                            Export
                        </button>
                        
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="p-4 lg:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white">{filteredRegistrations.length}</div>
                        <div className="text-sm text-gray-400">Total Registrations</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-400">
                            {filteredRegistrations.filter(r => r.verification_status === 'verified').length}
                        </div>
                        <div className="text-sm text-gray-400">Verified</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400">
                            {filteredRegistrations.filter(r => r.verification_status === 'pending' || !r.verification_status).length}
                        </div>
                        <div className="text-sm text-gray-400">Pending</div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold text-cyan-400">{events.length}</div>
                        <div className="text-sm text-gray-400">Events</div>
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === 'cards' && window.innerWidth <= 1024 ? (
                    // Mobile Card View
                    <div className="space-y-4">
                        {filteredRegistrations.length > 0 ? (
                            filteredRegistrations.map((reg) => (
                                <MobileRegistrationCard 
                                    key={reg.id} 
                                    registration={reg} 
                                    compactMode={compactMode}
                                    onExpand={() => setExpandedRow(expandedRow === reg.id ? null : reg.id)}
                                    isExpanded={expandedRow === reg.id}
                                    updateVerificationStatus={updateVerificationStatus}
                                    verificationUpdateLoading={verificationUpdateLoading}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-lg mb-2">No registrations found</div>
                                <div className="text-gray-500 text-sm">Try adjusting your filters</div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Table View (Desktop and Mobile Landscape)
                    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Event
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {filteredRegistrations.length > 0 ? (
                                        filteredRegistrations.map((reg) => (
                                            <TableRow 
                                                key={reg.id} 
                                                registration={reg} 
                                                compactMode={compactMode}
                                                updateVerificationStatus={updateVerificationStatus}
                                                verificationUpdateLoading={verificationUpdateLoading}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                No registrations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Mobile Registration Card Component
const MobileRegistrationCard = ({ registration, compactMode, onExpand, isExpanded, updateVerificationStatus, verificationUpdateLoading }) => {
    const isTeamEvent = registration.events?.event_name?.includes("BGMI") || 
                       registration.events?.event_name?.includes("Free Fire") || 
                       registration.events?.event_name?.includes("Fashion Flex") || 
                       registration.events?.event_name?.includes("Hackastra");

    return (
        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{registration.name}</h3>
                        <p className="text-gray-400 text-sm">{registration.email}</p>
                        <p className="text-gray-400 text-sm">{registration.phone}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
                            {registration.events?.event_name}
                        </span>
                        
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            registration.verification_status === 'verified' ? 'bg-green-500/20 text-green-400' :
                            registration.verification_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                        }`}>
                            {registration.verification_status === 'verified' ? '✓ Verified' :
                             registration.verification_status === 'rejected' ? '✗ Rejected' :
                             '⏳ Pending'}
                        </div>
                    </div>
                </div>
                
                {!compactMode && (
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                            <span className="text-gray-400">College:</span>
                            <div className="text-white">{registration.college}</div>
                        </div>
                        <div>
                            <span className="text-gray-400">Class:</span>
                            <div className="text-white">{registration.class}</div>
                        </div>
                        <div>
                            <span className="text-gray-400">Roll No:</span>
                            <div className="text-white">{registration.roll_no}</div>
                        </div>
                        <div>
                            <span className="text-gray-400">Date:</span>
                            <div className="text-white">{new Date(registration.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {/* Verification Buttons */}
                        {registration.verification_status === 'pending' || !registration.verification_status ? (
                            <>
                                <button 
                                    onClick={() => updateVerificationStatus(registration.id, 'verified')}
                                    disabled={verificationUpdateLoading === registration.id}
                                    className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors disabled:opacity-50"
                                >
                                    {verificationUpdateLoading === registration.id ? '...' : '✓ Verify'}
                                </button>
                                <button 
                                    onClick={() => {
                                        const reason = prompt('Rejection reason (optional):');
                                        updateVerificationStatus(registration.id, 'rejected', reason);
                                    }}
                                    disabled={verificationUpdateLoading === registration.id}
                                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors disabled:opacity-50"
                                >
                                    {verificationUpdateLoading === registration.id ? '...' : '✗ Reject'}
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => {
                                    if (confirm(`Reset verification status to pending for ${registration.name}?`)) {
                                        updateVerificationStatus(registration.id, 'pending');
                                    }
                                }}
                                disabled={verificationUpdateLoading === registration.id}
                                className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm transition-colors disabled:opacity-50"
                            >
                                {verificationUpdateLoading === registration.id ? 'Updating...' : 'Reset'}
                            </button>
                        )}
                    </div>
                    
                    {isTeamEvent && (
                        <button
                            onClick={onExpand}
                            className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm transition-colors"
                        >
                            <Users size={14} />
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            Team
                        </button>
                    )}
                </div>
                
                {/* Expanded Team Details */}
                {isTeamEvent && isExpanded && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                            <Users size={16} className="text-cyan-400" />
                            Team: {registration.team_name}
                        </h4>
                        
                        <div className="space-y-3">
                            <div className="bg-white/5 rounded-lg p-3">
                                <div className="text-xs text-gray-400 mb-1">Leader/IGL</div>
                                <div className="text-white font-medium">{registration.name}</div>
                                <div className="text-gray-400 text-sm">Roll: {registration.roll_no}</div>
                            </div>
                            
                            {registration.player2_name && (
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 mb-1">Member 2</div>
                                    <div className="text-white font-medium">{registration.player2_name}</div>
                                    <div className="text-gray-400 text-sm">Roll: {registration.player2_roll_no}</div>
                                </div>
                            )}
                            
                            {registration.player3_name && (
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 mb-1">Member 3</div>
                                    <div className="text-white font-medium">{registration.player3_name}</div>
                                    <div className="text-gray-400 text-sm">Roll: {registration.player3_roll_no}</div>
                                </div>
                            )}
                            
                            {registration.player4_name && (
                                <div className="bg-white/5 rounded-lg p-3">
                                    <div className="text-xs text-gray-400 mb-1">Member 4</div>
                                    <div className="text-white font-medium">{registration.player4_name}</div>
                                    <div className="text-gray-400 text-sm">Roll: {registration.player4_roll_no}</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Table Row Component
const TableRow = ({ registration, compactMode, updateVerificationStatus, verificationUpdateLoading }) => {
    return (
        <tr className="hover:bg-white/5 transition-colors">
            <td className="px-4 py-3">
                <div className="text-white font-medium">{registration.name}</div>
                {!compactMode && (
                    <div className="text-gray-400 text-sm">{registration.team_name}</div>
                )}
            </td>
            <td className="px-4 py-3">
                <div className="text-gray-300 text-sm">{registration.email}</div>
                <div className="text-gray-400 text-sm">{registration.phone}</div>
            </td>
            <td className="px-4 py-3">
                <span className="inline-block px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
                    {registration.events?.event_name}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    registration.verification_status === 'verified' ? 'bg-green-500/20 text-green-400' :
                    registration.verification_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                }`}>
                    {registration.verification_status === 'verified' ? '✓ Verified' :
                     registration.verification_status === 'rejected' ? '✗ Rejected' :
                     '⏳ Pending'}
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex gap-1">
                    {registration.verification_status === 'pending' || !registration.verification_status ? (
                        <>
                            <button 
                                onClick={() => updateVerificationStatus(registration.id, 'verified')}
                                disabled={verificationUpdateLoading === registration.id}
                                className="p-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-colors disabled:opacity-50"
                                title="Verify Registration"
                            >
                                {verificationUpdateLoading === registration.id ? '...' : '✓'}
                            </button>
                            <button 
                                onClick={() => {
                                    const reason = prompt('Rejection reason (optional):');
                                    updateVerificationStatus(registration.id, 'rejected', reason);
                                }}
                                disabled={verificationUpdateLoading === registration.id}
                                className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition-colors disabled:opacity-50"
                                title="Reject Registration"
                            >
                                {verificationUpdateLoading === registration.id ? '...' : '✗'}
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => {
                                if (confirm(`Reset verification status to pending for ${registration.name}?`)) {
                                    updateVerificationStatus(registration.id, 'pending');
                                }
                            }}
                            disabled={verificationUpdateLoading === registration.id}
                            className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded text-xs transition-colors disabled:opacity-50"
                            title="Reset to Pending"
                        >
                            {verificationUpdateLoading === registration.id ? 'Updating...' : 'Reset'}
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default MobileAdminPanel;

// Add these modals before the final closing div and export
// Image Viewer Modal - add this inside the main return statement before the final closing div

// Payment Screenshot Viewer Modal - add this inside the main return statement before the final closing div