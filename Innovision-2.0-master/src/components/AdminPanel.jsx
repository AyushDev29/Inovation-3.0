import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Download, Search, Filter, LogOut } from 'lucide-react';
import * as XLSX from 'xlsx';

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
    }, [session, selectedEvent]);

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

        const { data, error } = await query;
        if (error) setFetchError(error.message);
        else setRegistrations(data);
    };

    // Filter by search term
    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm)
    );

    const exportToExcel = () => {
        const dataToExport = filteredRegistrations.map(reg => {
            const isTeamEvent = reg.events?.event_name?.includes("Free Fire") || reg.events?.event_name?.includes("Hackathon");

            if (isTeamEvent) {
                return {
                    "Team Name": reg.team_name || '-',
                    "Email": reg.email,
                    "Phone": reg.phone,
                    "Class": reg.class || '-',
                    "College": reg.college || '-',
                    "Leader / IGL": reg.name,
                    "Member 2": reg.player2_name || '-',
                    "Member 3": reg.player3_name || '-',
                    "Member 4": reg.player4_name || '-',
                    "Event": reg.events?.event_name,
                    "Registration Date": new Date(reg.created_at).toLocaleString()
                };
            }

            return {
                "Name": reg.name,
                "Email": reg.email,
                "Phone": reg.phone,
                "Class": reg.class || '-',
                "College": reg.college || '-',
                "Event": reg.events?.event_name,
                "Registration Date": new Date(reg.created_at).toLocaleString()
            };
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registrations");
        const fileName = selectedEvent !== 'all' ? `${selectedEvent}_Registrations.xlsx` : 'All_Registrations.xlsx';
        XLSX.writeFile(wb, fileName);
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
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                    >
                        <LogOut size={16} className="mr-2" /> Logout
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 rounded-xl p-6">
                        <h3 className="text-gray-400 text-sm font-medium mb-1">Total Registrations</h3>
                        <p className="text-3xl font-bold text-white">{filteredRegistrations.length}</p>
                    </div>
                    {/* Add more stats if needed */}
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
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 text-sm">
                                {filteredRegistrations.length > 0 ? (
                                    filteredRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white">{reg.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white">{reg.email}</div>
                                                <div className="text-gray-500 text-xs mt-1">{reg.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {reg.events?.event_name?.includes("Free Fire") || reg.events?.event_name?.includes("Hackathon") ? (
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
                                            <td className="px-6 py-4 text-gray-400">
                                                {new Date(reg.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
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
            </div>
        </div>
    );
};

export default AdminPanel;
