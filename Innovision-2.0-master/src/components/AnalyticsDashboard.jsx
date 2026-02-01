import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    TimeScale,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { 
    TrendingUp, 
    TrendingDown,
    Minus,
    Users, 
    CheckCircle, 
    Clock, 
    CreditCard, 
    AlertTriangle,
    Calendar,
    Target,
    Activity,
    BarChart3,
    PieChart,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    RotateCcw
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    TimeScale,
    Filler
);

const AnalyticsDashboard = ({ onClose }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        dateRange: 'all',
        event: 'all',
        registrationType: 'all',
        paymentStatus: 'all',
        verificationStatus: 'all'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [insights, setInsights] = useState([]);

    // Fetch data from Supabase
    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    // Recalculate insights when data or filters change
    useEffect(() => {
        if (data.length > 0) {
            generateInsights();
        }
    }, [data, filters]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            // Use the same query logic as AdminPanel to ensure consistency
            let query = supabase
                .from('registrations')
                .select(`
                    *,
                    events (
                        event_name,
                        team_size,
                        prize
                    )
                `)
                .order('created_at', { ascending: false });

            // Apply the same default filtering as AdminPanel (exclude rejected in normal view)
            // This ensures data consistency between admin panel and analytics
            query = query.neq('verification_status', 'rejected');

            const { data: registrations, error } = await query;

            if (error) throw error;
            setData(registrations || []);
        } catch (err) {
            console.error('Analytics data fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter data based on current filters
    const getFilteredData = () => {
        let filtered = [...data];

        // Date range filter
        if (filters.dateRange !== 'all') {
            const now = new Date();
            let startDate;
            
            switch (filters.dateRange) {
                case '24h':
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = null;
            }
            
            if (startDate) {
                filtered = filtered.filter(item => new Date(item.created_at) >= startDate);
            }
        }

        // Event filter
        if (filters.event !== 'all') {
            filtered = filtered.filter(item => item.events?.event_name === filters.event);
        }

        // Registration type filter
        if (filters.registrationType !== 'all') {
            const isTeamEvent = (eventName) => {
                return eventName?.includes("BGMI") || 
                       eventName?.includes("Free Fire") || 
                       eventName?.includes("Hackastra") ||
                       eventName?.includes("Fashion Flex");
            };

            if (filters.registrationType === 'team') {
                filtered = filtered.filter(item => isTeamEvent(item.events?.event_name));
            } else if (filters.registrationType === 'individual') {
                filtered = filtered.filter(item => !isTeamEvent(item.events?.event_name));
            }
        }

        // Payment status filter
        if (filters.paymentStatus !== 'all') {
            if (filters.paymentStatus === 'non-paid') {
                filtered = filtered.filter(item => !item.payment_required);
            } else {
                filtered = filtered.filter(item => item.payment_status === filters.paymentStatus);
            }
        }

        // Verification status filter
        if (filters.verificationStatus !== 'all') {
            filtered = filtered.filter(item => 
                (item.verification_status || 'pending') === filters.verificationStatus
            );
        }

        return filtered;
    };

    // Calculate KPIs with trend indicators
    const calculateKPIs = () => {
        const filtered = getFilteredData();
        
        const totalRegistrations = filtered.length;
        const totalParticipants = filtered.reduce((sum, reg) => {
            const eventName = reg.events?.event_name || '';
            if (eventName.includes("BGMI") || eventName.includes("Free Fire")) return sum + 4;
            if (eventName.includes("Hackastra")) return sum + (reg.player3_name ? 3 : 2);
            if (eventName.includes("Fashion Flex")) return sum + 2;
            return sum + 1; // Individual events
        }, 0);
        
        const verifiedRegistrations = filtered.filter(r => r.verification_status === 'verified').length;
        const pendingVerification = filtered.filter(r => 
            !r.verification_status || r.verification_status === 'pending'
        ).length;
        const paymentPending = filtered.filter(r => 
            r.payment_required && r.payment_status === 'pending'
        ).length;
        
        const idUploaded = filtered.filter(r => {
            const hasIndividualId = r.college_id_url;
            const hasTeamIds = r.player1_college_id_url || r.player2_college_id_url || 
                             r.player3_college_id_url || r.player4_college_id_url;
            return hasIndividualId || hasTeamIds;
        }).length;
        
        const idUploadRate = totalRegistrations > 0 ? (idUploaded / totalRegistrations * 100) : 0;

        // Calculate 24h trends
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const recent24h = filtered.filter(r => new Date(r.created_at) >= last24h);
        const previous24h = filtered.filter(r => {
            const regDate = new Date(r.created_at);
            return regDate >= new Date(last24h.getTime() - 24 * 60 * 60 * 1000) && regDate < last24h;
        });

        const getTrend = (current, previous) => {
            if (previous === 0) return current > 0 ? 'up' : 'neutral';
            const change = ((current - previous) / previous) * 100;
            if (change > 5) return 'up';
            if (change < -5) return 'down';
            return 'neutral';
        };

        return {
            totalRegistrations: {
                value: totalRegistrations,
                trend: getTrend(recent24h.length, previous24h.length),
                change: recent24h.length - previous24h.length,
                tooltip: "Total valid registrations (excluding rejected)"
            },
            totalParticipants: {
                value: totalParticipants,
                trend: 'neutral', // Calculated from registrations
                change: 0,
                tooltip: "Sum of all individual participants across team and solo events"
            },
            verifiedRegistrations: {
                value: verifiedRegistrations,
                trend: getTrend(
                    recent24h.filter(r => r.verification_status === 'verified').length,
                    previous24h.filter(r => r.verification_status === 'verified').length
                ),
                change: recent24h.filter(r => r.verification_status === 'verified').length - 
                        previous24h.filter(r => r.verification_status === 'verified').length,
                tooltip: "Registrations approved by admin review"
            },
            pendingVerification: {
                value: pendingVerification,
                trend: getTrend(
                    recent24h.filter(r => !r.verification_status || r.verification_status === 'pending').length,
                    previous24h.filter(r => !r.verification_status || r.verification_status === 'pending').length
                ),
                change: recent24h.filter(r => !r.verification_status || r.verification_status === 'pending').length - 
                        previous24h.filter(r => !r.verification_status || r.verification_status === 'pending').length,
                tooltip: "Registrations awaiting admin approval - requires immediate attention"
            },
            paymentPending: {
                value: paymentPending,
                trend: getTrend(
                    recent24h.filter(r => r.payment_required && r.payment_status === 'pending').length,
                    previous24h.filter(r => r.payment_required && r.payment_status === 'pending').length
                ),
                change: recent24h.filter(r => r.payment_required && r.payment_status === 'pending').length - 
                        previous24h.filter(r => r.payment_required && r.payment_status === 'pending').length,
                tooltip: "Paid events with unverified payment screenshots"
            },
            idUploadRate: {
                value: Math.round(idUploadRate),
                trend: 'neutral', // Rate metric
                change: 0,
                tooltip: "Percentage of registrations with college ID photos uploaded"
            }
        };
    };

    // Generate professional actionable insights with severity levels
    const generateInsights = () => {
        const filtered = getFilteredData();
        const newInsights = [];

        // CRITICAL INSIGHTS (🔴)
        
        // Payment delays - Critical business impact
        const paymentPending = filtered.filter(r => 
            r.payment_required && r.payment_status === 'pending'
        );
        
        const oldPayments = paymentPending.filter(r => {
            const regTime = new Date(r.created_at);
            const hoursSince = (new Date() - regTime) / (1000 * 60 * 60);
            return hoursSince > 48;
        });

        if (oldPayments.length > 0) {
            newInsights.push({
                severity: 'critical',
                title: 'Payment Verification Backlog',
                fact: `${oldPayments.length} payments pending >48 hours`,
                impact: 'Revenue at risk, student frustration increasing',
                action: 'Review payment screenshots immediately',
                priority: 1
            });
        }

        // Verification bottleneck - Critical operational issue
        const pendingVerification = filtered.filter(r => 
            !r.verification_status || r.verification_status === 'pending'
        ).length;
        
        if (pendingVerification > filtered.length * 0.4) {
            newInsights.push({
                severity: 'critical',
                title: 'Verification Bottleneck Detected',
                fact: `${pendingVerification} registrations (${Math.round(pendingVerification/filtered.length*100)}%) awaiting approval`,
                impact: 'Registration process stalled, student experience degraded',
                action: 'Allocate additional admin resources for verification',
                priority: 2
            });
        }

        // WARNING INSIGHTS (🟡)

        // Low participation events
        const eventStats = {};
        filtered.forEach(reg => {
            const eventName = reg.events?.event_name;
            if (eventName) {
                eventStats[eventName] = (eventStats[eventName] || 0) + 1;
            }
        });

        const lowPerformingEvents = Object.entries(eventStats).filter(([event, count]) => count < 10);
        if (lowPerformingEvents.length > 0) {
            const eventList = lowPerformingEvents.map(([event, count]) => `${event} (${count})`).join(', ');
            newInsights.push({
                severity: 'warning',
                title: 'Underperforming Events Identified',
                fact: `${lowPerformingEvents.length} events with <10 registrations: ${eventList}`,
                impact: 'Event viability at risk, resource allocation inefficient',
                action: 'Launch targeted promotion campaigns or consider event consolidation',
                priority: 3
            });
        }

        // ID upload compliance
        const idUploaded = filtered.filter(r => {
            const hasIndividualId = r.college_id_url;
            const hasTeamIds = r.player1_college_id_url || r.player2_college_id_url || 
                             r.player3_college_id_url || r.player4_college_id_url;
            return hasIndividualId || hasTeamIds;
        }).length;
        
        const idUploadRate = filtered.length > 0 ? (idUploaded / filtered.length * 100) : 0;
        
        if (idUploadRate < 80) {
            newInsights.push({
                severity: 'warning',
                title: 'ID Upload Compliance Below Target',
                fact: `${Math.round(idUploadRate)}% ID upload rate (${filtered.length - idUploaded} missing)`,
                impact: 'Verification delays, potential event day issues',
                action: 'Send reminder notifications to incomplete registrations',
                priority: 4
            });
        }

        // INFORMATIONAL INSIGHTS (🔵)

        // Time pattern insights with actionable recommendations
        const hourCounts = {};
        filtered.forEach(reg => {
            const hour = new Date(reg.created_at).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const peakHour = Object.entries(hourCounts).reduce((max, [hour, count]) => 
            count > (hourCounts[max] || 0) ? hour : max, '0'
        );

        // Format peak hour for display
        const formatPeakHour = (hour) => {
            const h = parseInt(hour);
            if (h === 0) return '12:00 AM - 1:00 AM';
            if (h === 12) return '12:00 PM - 1:00 PM';
            if (h < 12) return `${h}:00 AM - ${h + 1}:00 AM`;
            return `${h - 12}:00 PM - ${h - 11}:00 PM`;
        };

        if (hourCounts[peakHour] > filtered.length * 0.15) {
            newInsights.push({
                severity: 'info',
                title: 'Peak Registration Window Identified',
                fact: `${hourCounts[peakHour]} registrations (${Math.round(hourCounts[peakHour]/filtered.length*100)}%) during ${formatPeakHour(peakHour)}`,
                impact: 'Optimal timing for promotions and support availability',
                action: 'Schedule social media posts and admin availability during peak hours',
                priority: 5
            });
        }

        // Sort insights by priority and return
        const sortedInsights = newInsights.sort((a, b) => a.priority - b.priority);
        
        // If no critical issues, add a positive insight
        if (sortedInsights.filter(i => i.severity === 'critical').length === 0) {
            sortedInsights.unshift({
                severity: 'info',
                title: 'System Operating Normally',
                fact: 'No critical issues detected in current data segment',
                impact: 'Registration process running smoothly',
                action: 'Continue monitoring key metrics',
                priority: 0
            });
        }

        setInsights(sortedInsights);
    };

    // Chart configurations with improved readability
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e5e7eb',
                    font: { size: 12 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#e5e7eb',
                borderColor: 'rgba(139, 92, 246, 0.5)',
                borderWidth: 1,
                callbacks: {
                    title: function(context) {
                        return `Time: ${context[0].label}`;
                    },
                    label: function(context) {
                        const count = context.parsed.y;
                        return `${count} registration${count !== 1 ? 's' : ''}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { 
                    color: '#9ca3af',
                    maxRotation: 45,
                    minRotation: 45,
                    font: { size: 11 }
                },
                grid: { color: 'rgba(255,255,255,0.1)' },
                title: {
                    display: true,
                    text: 'Time of Day',
                    color: '#e5e7eb',
                    font: { size: 12, weight: 'bold' }
                }
            },
            y: {
                ticks: { 
                    color: '#9ca3af',
                    stepSize: 1,
                    callback: function(value) {
                        return Number.isInteger(value) ? value : '';
                    }
                },
                grid: { color: 'rgba(255,255,255,0.1)' },
                title: {
                    display: true,
                    text: 'Number of Registrations',
                    color: '#e5e7eb',
                    font: { size: 12, weight: 'bold' }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    // Registration funnel data
    const getFunnelData = () => {
        const filtered = getFilteredData();
        const registered = filtered.length;
        const idUploaded = filtered.filter(r => 
            r.college_id_url || r.player1_college_id_url || r.player2_college_id_url || 
            r.player3_college_id_url || r.player4_college_id_url
        ).length;
        const paymentDone = filtered.filter(r => 
            !r.payment_required || r.payment_status === 'verified'
        ).length;
        const verified = filtered.filter(r => r.verification_status === 'verified').length;

        return {
            labels: ['Registered', 'ID Uploaded', 'Payment Done', 'Verified'],
            datasets: [{
                label: 'Registration Funnel',
                data: [registered, idUploaded, paymentDone, verified],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(139, 92, 246)'
                ],
                borderWidth: 2
            }]
        };
    };

    // Hourly registration data with clear AM/PM format
    const getHourlyData = () => {
        const filtered = getFilteredData();
        const hourCounts = Array(24).fill(0);
        
        filtered.forEach(reg => {
            const hour = new Date(reg.created_at).getHours();
            hourCounts[hour]++;
        });

        // Convert 24-hour format to clear 12-hour AM/PM format
        const formatHour = (hour) => {
            if (hour === 0) return '12 AM';
            if (hour === 12) return '12 PM';
            if (hour < 12) return `${hour} AM`;
            return `${hour - 12} PM`;
        };

        return {
            labels: Array.from({length: 24}, (_, i) => formatHour(i)),
            datasets: [{
                label: 'Registrations',
                data: hourCounts,
                borderColor: 'rgb(139, 92, 246)',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgb(139, 92, 246)',
                pointBorderColor: 'rgb(139, 92, 246)',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };
    };

    // Event performance data
    const getEventData = () => {
        const filtered = getFilteredData();
        const eventStats = {};
        
        filtered.forEach(reg => {
            const eventName = reg.events?.event_name;
            if (eventName) {
                eventStats[eventName] = (eventStats[eventName] || 0) + 1;
            }
        });

        const sortedEvents = Object.entries(eventStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        return {
            labels: sortedEvents.map(([name]) => name.length > 15 ? name.substring(0, 15) + '...' : name),
            datasets: [{
                label: 'Registrations',
                data: sortedEvents.map(([,count]) => count),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 2
            }]
        };
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-8">
                    <div className="animate-spin w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white text-center">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-[#0f0f0f] border border-red-500/20 rounded-2xl p-8 max-w-md">
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                    <p className="text-red-400 text-center mb-4">Failed to load analytics data</p>
                    <p className="text-gray-400 text-sm text-center mb-4">{error}</p>
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const kpis = calculateKPIs();
    const uniqueEvents = [...new Set(data.map(r => r.events?.event_name).filter(Boolean))];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen bg-[#0f0f0f] text-white">
                {/* Header */}
                <div className="sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-white/10 z-10">
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-4">
                            <BarChart3 className="w-8 h-8 text-neon-purple" />
                            <div>
                                <h1 className="text-2xl font-orbitron font-bold">Analytics Dashboard</h1>
                                <p className="text-gray-400 text-sm">Real-time event insights & performance metrics (excluding rejected registrations)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Filter size={16} />
                                Filters
                                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Filters Panel with Feedback */}
                    {showFilters && (
                        <div className="border-t border-white/10 p-6 bg-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Date Range</label>
                                    <select
                                        value={filters.dateRange}
                                        onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value}))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="24h">Last 24 Hours</option>
                                        <option value="7d">Last 7 Days</option>
                                        <option value="30d">Last 30 Days</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Event</label>
                                    <select
                                        value={filters.event}
                                        onChange={(e) => setFilters(prev => ({...prev, event: e.target.value}))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    >
                                        <option value="all">All Events</option>
                                        {uniqueEvents.map(event => (
                                            <option key={event} value={event}>{event}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Type</label>
                                    <select
                                        value={filters.registrationType}
                                        onChange={(e) => setFilters(prev => ({...prev, registrationType: e.target.value}))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="team">Team Events</option>
                                        <option value="individual">Individual Events</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Payment</label>
                                    <select
                                        value={filters.paymentStatus}
                                        onChange={(e) => setFilters(prev => ({...prev, paymentStatus: e.target.value}))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                        <option value="non-paid">Non-Paid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Verification</label>
                                    <select
                                        value={filters.verificationStatus}
                                        onChange={(e) => setFilters(prev => ({...prev, verificationStatus: e.target.value}))}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Filter Feedback */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                    Showing: {filters.dateRange === 'all' ? 'All Time' : 
                                             filters.dateRange === '24h' ? 'Last 24 Hours' :
                                             filters.dateRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'} • 
                                    {filters.event === 'all' ? 'All Events' : filters.event} • 
                                    {filters.registrationType === 'all' ? 'All Types' : 
                                     filters.registrationType === 'team' ? 'Team Events' : 'Individual Events'}
                                </div>
                                <button
                                    onClick={() => setFilters({
                                        dateRange: 'all',
                                        event: 'all',
                                        registrationType: 'all',
                                        paymentStatus: 'all',
                                        verificationStatus: 'all'
                                    })}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg text-sm transition-colors"
                                >
                                    <RotateCcw size={14} />
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 space-y-8">
                    {/* Executive Summary KPIs with Trend Indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4 group relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-blue-400" />
                                    <span className="text-blue-400 text-sm font-medium">Registrations</span>
                                </div>
                                {kpis.totalRegistrations.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                                {kpis.totalRegistrations.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                                {kpis.totalRegistrations.trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-bold text-white">{kpis.totalRegistrations.value}</div>
                                {kpis.totalRegistrations.change !== 0 && (
                                    <div className={`text-xs font-medium ${kpis.totalRegistrations.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {kpis.totalRegistrations.change > 0 ? '+' : ''}{kpis.totalRegistrations.change} (24h)
                                    </div>
                                )}
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {kpis.totalRegistrations.tooltip}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 group relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Target className="w-5 h-5 text-green-400" />
                                    <span className="text-green-400 text-sm font-medium">Participants</span>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white">{kpis.totalParticipants.value}</div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {kpis.totalParticipants.tooltip}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4 group relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-purple-400" />
                                    <span className="text-purple-400 text-sm font-medium">Verified</span>
                                </div>
                                {kpis.verifiedRegistrations.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                                {kpis.verifiedRegistrations.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
                                {kpis.verifiedRegistrations.trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-bold text-white">{kpis.verifiedRegistrations.value}</div>
                                {kpis.verifiedRegistrations.change !== 0 && (
                                    <div className={`text-xs font-medium ${kpis.verifiedRegistrations.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {kpis.verifiedRegistrations.change > 0 ? '+' : ''}{kpis.verifiedRegistrations.change} (24h)
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {kpis.verifiedRegistrations.tooltip}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-4 group relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                    <span className="text-yellow-400 text-sm font-medium">Pending</span>
                                </div>
                                {kpis.pendingVerification.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                                {kpis.pendingVerification.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
                                {kpis.pendingVerification.trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-bold text-white">{kpis.pendingVerification.value}</div>
                                {kpis.pendingVerification.change !== 0 && (
                                    <div className={`text-xs font-medium ${kpis.pendingVerification.change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {kpis.pendingVerification.change > 0 ? '+' : ''}{kpis.pendingVerification.change} (24h)
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {kpis.pendingVerification.tooltip}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-4 group relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-orange-400" />
                                    <span className="text-orange-400 text-sm font-medium">Payment Due</span>
                                </div>
                                {kpis.paymentPending.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                                {kpis.paymentPending.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
                                {kpis.paymentPending.trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
                            </div>
                            <div className="flex items-end justify-between">
                                <div className="text-2xl font-bold text-white">{kpis.paymentPending.value}</div>
                                {kpis.paymentPending.change !== 0 && (
                                    <div className={`text-xs font-medium ${kpis.paymentPending.change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {kpis.paymentPending.change > 0 ? '+' : ''}{kpis.paymentPending.change} (24h)
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {kpis.paymentPending.tooltip}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-xl p-4 group relative">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-cyan-400" />
                                    <span className="text-cyan-400 text-sm font-medium">ID Upload</span>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-white">{kpis.idUploadRate.value}%</div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {kpis.idUploadRate.tooltip}
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid with Enhanced Titles and Context */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Registration Funnel */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-orbitron font-bold mb-2 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-neon-purple" />
                                Registration Process Health
                            </h2>
                            <p className="text-gray-400 text-sm mb-4">Where are students dropping off? Identify bottlenecks in your registration flow.</p>
                            <div className="h-64">
                                <Bar data={getFunnelData()} options={chartOptions} />
                            </div>
                            <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                                <p className="text-xs text-gray-300">
                                    <span className="font-semibold text-white">How to read:</span> Each bar shows completion rates. 
                                    Large drops between steps indicate process issues requiring immediate attention.
                                </p>
                            </div>
                        </div>

                        {/* Hourly Registrations */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-orbitron font-bold mb-2 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-neon-purple" />
                                Peak Registration Hours
                            </h2>
                            <p className="text-gray-400 text-sm mb-4">When do students register most? Optimize your promotion timing and support availability.</p>
                            <div className="h-64">
                                <Line data={getHourlyData()} options={chartOptions} />
                            </div>
                            <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                                <p className="text-xs text-gray-300">
                                    <span className="font-semibold text-white">Key insight:</span> Schedule social media posts and admin support during peak hours. 
                                    Low activity periods are ideal for system maintenance.
                                </p>
                            </div>
                        </div>

                        {/* Event Performance */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 lg:col-span-2">
                            <h2 className="text-xl font-orbitron font-bold mb-2 flex items-center gap-2">
                                <PieChart className="w-5 h-5 text-neon-purple" />
                                Event Popularity Ranking
                            </h2>
                            <p className="text-gray-400 text-sm mb-4">Which events are winning? Identify star performers and underperformers for resource allocation.</p>
                            <div className="h-64">
                                <Bar data={getEventData()} options={chartOptions} />
                            </div>
                            <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                                <p className="text-xs text-gray-300">
                                    <span className="font-semibold text-white">Action guide:</span> Events with &lt;10 registrations need immediate promotion. 
                                    Top performers can accommodate more participants or serve as promotion models.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Professional Actionable Insights - BOTTOM PLACEMENT */}
                    {insights.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-orbitron font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                                Executive Decision Intelligence
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">Data-driven insights ranked by business impact. Take action on critical items first.</p>
                            <div className="space-y-4">
                                {insights.map((insight, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${
                                        insight.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                                        insight.severity === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                        'bg-blue-500/10 border-blue-500/30'
                                    }`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    insight.severity === 'critical' ? 'bg-red-500 text-white' :
                                                    insight.severity === 'warning' ? 'bg-yellow-500 text-black' :
                                                    'bg-blue-500 text-white'
                                                }`}>
                                                    {insight.severity === 'critical' ? '🔴 CRITICAL' :
                                                     insight.severity === 'warning' ? '🟡 WARNING' :
                                                     '🔵 INFO'}
                                                </div>
                                                <h3 className="font-semibold text-white">{insight.title}</h3>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className="text-gray-400 font-medium mb-1">What's Happening</div>
                                                <div className="text-gray-200">{insight.fact}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 font-medium mb-1">Business Impact</div>
                                                <div className="text-gray-200">{insight.impact}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 font-medium mb-1">Recommended Action</div>
                                                <div className={`font-medium ${
                                                    insight.severity === 'critical' ? 'text-red-300' :
                                                    insight.severity === 'warning' ? 'text-yellow-300' :
                                                    'text-blue-300'
                                                }`}>
                                                    → {insight.action}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;