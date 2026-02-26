import React, { useState, useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import {
    TrendingUp, Users, CalendarCheck, CreditCard,
    ArrowUpRight, ArrowDownRight, Clock, Stethoscope, ArrowRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

import logoUrl from '../../assets/img/logowhite.png';

// Enhanced custom tooltip for charts (Glassmorphic)
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#172554]/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
                <p className="font-light text-white mb-2 tracking-wide">{label}</p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} className="text-sm font-medium" style={{ color: entry.color }}>
                        {entry.name}: {entry.name === 'Të Ardhura (€)' || entry.name === 'Vlera (€)' ? `€${entry.value}` : entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function OverviewTab({
    APPOINTMENTS,
    rawServices
}) {
    // 1. Calculate Financials
    const financials = useMemo(() => {
        let totalPaid = 0;
        let totalPending = 0;
        let todayApts = 0;

        const todayStr = new Date().toISOString().split('T')[0];

        APPOINTMENTS.forEach(apt => {
            if (apt.date === todayStr) todayApts++;

            // Find price from service
            let price = 0;
            const serviceObj = rawServices.find(s => s.title === apt.service);
            if (serviceObj) {
                // Try to extract number from string like "€40" or "Nga €50"
                const match = serviceObj.price.match(/\d+/);
                if (match) price = parseInt(match[0], 10);
            }

            if (apt.status === 'confirmed') totalPaid += price;
            else totalPending += price;
        });

        return { totalPaid, totalPending, todayApts };
    }, [APPOINTMENTS, rawServices]);

    const [chartFilter, setChartFilter] = useState('week'); // 'week', 'month', 'year', 'all'

    // 2. Prepare Chart Data (Dynamic based on filter)
    const chartData = useMemo(() => {
        const data = [];
        const today = new Date();

        if (chartFilter === 'week') {
            // Get Monday of the current week
            const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday
            const dist = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // distance to Monday
            const monday = new Date(today);
            monday.setDate(today.getDate() - dist);

            // Iterate 6 days (Monday to Saturday)
            for (let i = 0; i < 6; i++) {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);

                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                const displayDate = d.toLocaleDateString('sq-AL', { weekday: 'short' });

                const dayApts = APPOINTMENTS.filter(a => a.date === dateStr);
                let dayRev = 0;
                dayApts.forEach(apt => {
                    if (apt.status === 'confirmed') {
                        const srv = rawServices.find(s => s.title === apt.service);
                        if (srv) {
                            const m = srv.price.match(/\d+/);
                            if (m) dayRev += parseInt(m[0], 10);
                        }
                    }
                });
                data.push({ name: displayDate, 'Termine': dayApts.length, 'Të Ardhura (€)': dayRev });
            }
        }
        else if (chartFilter === 'month') {
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                // Only show labels every 5 days to avoid crowding
                const displayDate = (i % 5 === 0 || i === 0) ? d.toLocaleDateString('sq-AL', { month: 'short', day: 'numeric' }) : '';

                const dayApts = APPOINTMENTS.filter(a => a.date === dateStr);
                let dayRev = 0;
                dayApts.forEach(apt => {
                    if (apt.status === 'confirmed') {
                        const srv = rawServices.find(s => s.title === apt.service);
                        if (srv) {
                            const m = srv.price.match(/\d+/);
                            if (m) dayRev += parseInt(m[0], 10);
                        }
                    }
                });
                data.push({ name: displayDate, 'Termine': dayApts.length, 'Të Ardhura (€)': dayRev });
            }
        }
        else if (chartFilter === 'year') {
            const months = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gsh', 'Sht', 'Tet', 'Nën', 'Dhj'];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthStr = String(d.getMonth() + 1).padStart(2, '0');
                const yearStr = d.getFullYear();
                const prefix = `${yearStr}-${monthStr}`;

                const monthApts = APPOINTMENTS.filter(a => a.date.startsWith(prefix));
                let monthRev = 0;
                monthApts.forEach(apt => {
                    if (apt.status === 'confirmed') {
                        const srv = rawServices.find(s => s.title === apt.service);
                        if (srv) {
                            const m = srv.price.match(/\d+/);
                            if (m) monthRev += parseInt(m[0], 10);
                        }
                    }
                });
                data.push({ name: `${months[d.getMonth()]} ${yearStr.toString().substring(2)}`, 'Termine': monthApts.length, 'Të Ardhura (€)': monthRev });
            }
        }
        else if (chartFilter === 'all') {
            if (APPOINTMENTS.length === 0) return [];

            // Find earliest year
            let earliestYear = today.getFullYear();
            APPOINTMENTS.forEach(a => {
                const y = parseInt(a.date.split('-')[0], 10);
                if (y < earliestYear) earliestYear = y;
            });

            for (let y = earliestYear; y <= today.getFullYear(); y++) {
                const yearApts = APPOINTMENTS.filter(a => a.date.startsWith(y.toString()));
                let yearRev = 0;
                yearApts.forEach(apt => {
                    if (apt.status === 'confirmed') {
                        const srv = rawServices.find(s => s.title === apt.service);
                        if (srv) {
                            const m = srv.price.match(/\d+/);
                            if (m) yearRev += parseInt(m[0], 10);
                        }
                    }
                });
                data.push({ name: y.toString(), 'Termine': yearApts.length, 'Të Ardhura (€)': yearRev });
            }
        }

        return data;
    }, [APPOINTMENTS, rawServices, chartFilter]);

    // 3. Service Popularity Data (for Pie Chart)
    const serviceData = useMemo(() => {
        const counts = {};
        APPOINTMENTS.forEach(apt => {
            counts[apt.service] = (counts[apt.service] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5
    }, [APPOINTMENTS]);

    // Sophisticated monochromatic / subtle teal palette
    const COLORS = ['#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e'];

    // 4. Recent Appointments Today
    const todayAppointments = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return APPOINTMENTS
            .filter(a => a.date === todayStr)
            .sort((a, b) => a.time.localeCompare(b.time))
            .slice(0, 4);
    }, [APPOINTMENTS]);

    return (
        <Motion.div
            key="overview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 pb-8 bg-[#1e3a8a] text-white p-6 md:p-8 rounded-[2rem] relative overflow-hidden shadow-2xl"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            {/* Background Glows for Depth */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-teal-400/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-[#172554]/40 rounded-full blur-[100px] pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 mb-8 flex items-center justify-between">
                <div>
                    <span className="text-teal-300 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-2 block">
                        Performanca e Klinikës
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">
                        Pasqyra e Përgjithshme
                    </h2>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Live Sync</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-teal-300">
                            <TrendingUp size={24} strokeWidth={1.5} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-[#1e3a8a] bg-teal-300 px-2 py-1 rounded-full shadow-lg shadow-teal-300/20">
                            <ArrowUpRight size={14} strokeWidth={2.5} /> +12%
                        </span>
                    </div>
                    <p className="text-white/50 text-sm font-light uppercase tracking-wider mb-2">Të Ardhura</p>
                    <h3 className="text-3xl font-light text-white tracking-tight">€{financials.totalPaid.toLocaleString()}</h3>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-white/40 group-hover:text-white/60 transition-colors">
                            <CreditCard size={24} strokeWidth={1.5} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-white bg-white/10 px-2 py-1 rounded-full">
                            Pezull
                        </span>
                    </div>
                    <p className="text-white/50 text-sm font-light uppercase tracking-wider mb-2">Pagesa të papaguara</p>
                    <h3 className="text-3xl font-light text-white tracking-tight">€{financials.totalPending.toLocaleString()}</h3>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-teal-300">
                            <CalendarCheck size={24} strokeWidth={1.5} />
                        </div>
                    </div>
                    <p className="text-white/50 text-sm font-light uppercase tracking-wider mb-2">Termine Sot</p>
                    <h3 className="text-3xl font-light text-white tracking-tight">{financials.todayApts}</h3>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300 group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-white/40 group-hover:text-white/60 transition-colors">
                            <Users size={24} strokeWidth={1.5} />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-300 bg-teal-400/10 px-2 py-1 rounded-full border border-teal-500/20">
                            <ArrowUpRight size={12} strokeWidth={2} /> +4
                        </span>
                    </div>
                    <p className="text-white/50 text-sm font-light uppercase tracking-wider mb-2">Pacientë Total</p>
                    <h3 className="text-3xl font-light text-white tracking-tight">
                        {new Set(APPOINTMENTS.map(a => a.patient)).size}
                    </h3>
                </Motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
                {/* Main Chart */}
                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm lg:col-span-2"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h3 className="text-xl md:text-2xl font-light text-white mb-2">
                                {chartFilter === 'week' && 'Aktiviteti Javor'}
                                {chartFilter === 'month' && 'Aktiviteti Mujor'}
                                {chartFilter === 'year' && 'Aktiviteti Vjetor'}
                                {chartFilter === 'all' && 'Aktiviteti Total'}
                            </h3>
                            <p className="text-white/40 text-sm font-light">Të dhënat financiare dhe numri i termineve</p>
                        </div>

                        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
                            {[
                                { id: 'week', label: 'Java' },
                                { id: 'month', label: 'Muaji' },
                                { id: 'year', label: 'Viti' },
                                { id: 'all', label: 'Të Gjitha' },
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setChartFilter(filter.id)}
                                    className={`px-4 py-2 rounded-lg text-xs tracking-wider transition-colors ${chartFilter === filter.id
                                        ? 'bg-teal-400 text-[#1e3a8a] font-bold shadow-md shadow-teal-400/20'
                                        : 'text-white/50 hover:text-white hover:bg-white/10 font-light'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5eead4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#5eead4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
                                    dy={15}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)', fontWeight: 300 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="Të Ardhura (€)"
                                    stroke="#5eead4"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="Termine"
                                    stroke="#ffffff"
                                    strokeWidth={2}
                                    fill="none"
                                    strokeDasharray="4 4"
                                    strokeOpacity={0.5}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Motion.div>

                {/* Donut Chart (Services) */}
                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm"
                >
                    <h3 className="text-xl md:text-2xl font-light text-white mb-2">Shërbimet</h3>
                    <p className="text-white/40 text-sm font-light mb-8">Ndarja e popullaritetit</p>

                    <div className="h-56 w-full flex items-center justify-center relative mb-6">
                        {serviceData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={serviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="rgba(30,58,138,0.5)" // Dark blue stroke to blend with bg
                                        strokeWidth={4}
                                    >
                                        {serviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-white/30 font-light text-sm">S'ka të dhëna të mjaftueshme</div>
                        )}
                        {/* Center Icon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-14 h-14 rounded-full bg-[#1e3a8a] border border-white/10 flex items-center justify-center shadow-inner">
                                <Stethoscope size={20} className="text-teal-300" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {serviceData.map((entry, index) => (
                            <div key={index} className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-white/70 font-light text-sm truncate max-w-[150px] group-hover:text-white transition-colors">{entry.name}</span>
                                </div>
                                <span className="font-light text-white">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </Motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 relative z-10">
                {/* Upcoming Today */}
                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl md:text-2xl font-light text-white">Sot</h3>
                        <button className="text-xs text-teal-300 uppercase tracking-widest font-medium hover:text-white transition-colors">
                            Shiko Të Gjitha
                        </button>
                    </div>

                    <div className="space-y-3">
                        {todayAppointments.length > 0 ? todayAppointments.map((apt, idx) => (
                            <Motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + (idx * 0.1) }}
                                className="flex items-center gap-5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all group cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-full border border-teal-500/30 flex flex-col items-center justify-center shrink-0 group-hover:border-teal-400 transition-colors">
                                    <span className="text-sm font-light text-teal-300">{apt.time.split(' - ')[0]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-light text-lg text-white truncate mb-1">{apt.patient}</h4>
                                    <p className="text-xs text-white/40 uppercase tracking-wider truncate">{apt.service}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] uppercase font-medium tracking-widest border
                                        ${apt.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border-teal-500/20' : 'bg-white/5 text-white/50 border-white/10'}
                                    `}>
                                        {apt.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                    </span>
                                </div>
                            </Motion.div>
                        )) : (
                            <div className="py-12 text-center text-white/30 flex flex-col items-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                                <Clock size={32} className="mb-4 opacity-40" strokeWidth={1} />
                                <p className="font-light text-sm">Nuk ka termine për sot.</p>
                            </div>
                        )}
                    </div>
                </Motion.div>

                {/* Quick Actions / Helpers */}
                <Motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm flex flex-col items-center justify-center text-center"
                >
                    <div className="mb-8 relative">
                        <div className="w-48 h-auto flex items-center justify-center mb-6 mx-auto">
                            <img src={logoUrl} alt="AldoDent" className="w-full object-contain opacity-90" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-light text-white mb-2">Paneli i Menaxhimit</h2>
                    <p className="text-white/40 font-light text-sm max-w-[250px] mx-auto mb-10 leading-relaxed">
                        Qasje e shpejtë në funksionet kryesore të sistemit me anë të menysë anësore.
                    </p>

                    <div className="flex gap-4 w-full">
                        <button className="flex-1 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 text-white rounded-2xl py-4 transition-all flex flex-col items-center justify-center gap-2 group">
                            <Users size={20} strokeWidth={1.5} className="text-teal-300 group-hover:scale-110 transition-transform" />
                            <span className="text-xs uppercase tracking-widest font-medium">Pacientë</span>
                        </button>
                        <button className="flex-1 bg-teal-400 text-[#1e3a8a] hover:bg-teal-300 rounded-2xl py-4 font-medium transition-all shadow-lg shadow-teal-400/20 flex flex-col items-center justify-center gap-2 group">
                            <ArrowRight size={20} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                            <span className="text-xs uppercase tracking-widest font-bold">Vazhdo</span>
                        </button>
                    </div>
                </Motion.div>
            </div>
        </Motion.div>
    );
}
