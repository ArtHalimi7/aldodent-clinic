import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Users, Clock, Settings, LogOut,
    Plus, ChevronRight, ChevronLeft, CalendarOff,
    Search, Bell, X, CalendarDays, ArrowRight, Trash2, Edit2,
    CheckCircle, User as UserIcon
} from 'lucide-react';

// MOCK DATA
const DOCTORS = [
    { id: 'dr-aldo', name: 'Dr. Aldo', role: 'Kryedoktor & Kirurg', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aldo' },
    { id: 'dr-elena', name: 'Dr. Elena', role: 'Ortodonte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
];

const APPOINTMENTS = [
    { id: 1, patient: 'Arben Hoxha', service: 'Implantologji', time: '09:00 - 10:30', doctorId: 'dr-aldo', status: 'confirmed', date: '2026-02-24', notes: 'Pacienti kërkon anestezion lokal.' },
    { id: 2, patient: 'Besa Gashi', service: 'Konsultë', time: '10:30 - 11:00', doctorId: 'dr-aldo', status: 'pending', date: '2026-02-24', notes: 'Kontroll pas ndërhyrjes.' },
    { id: 3, patient: 'Driton Krasniqi', service: 'Ortodonci', time: '11:00 - 11:30', doctorId: 'dr-elena', status: 'confirmed', date: '2026-02-24', notes: '' },
    { id: 4, patient: 'Ema Kelmendi', service: 'Zirkon Kurorë', time: '13:00 - 14:30', doctorId: 'dr-aldo', status: 'confirmed', date: '2026-02-24', notes: 'Faza e dytë.' },
    { id: 5, patient: 'Ermal Meta', service: 'Zbardhim', time: '15:00 - 16:00', doctorId: 'dr-aldo', status: 'confirmed', date: '2026-02-25', notes: 'Klient i ri.' },
];

// Mock Time-Offs / "Pauzat"
const BLOCKED_TIMES = [
    { id: 'b1', type: 'Pauzë', title: 'Pauza e Drekës', time: '12:00 - 13:00', doctorId: 'dr-aldo', date: '2026-02-24' },
    { id: 'b2', type: 'Pushim', title: 'Pushim Mjekësor', time: '09:00 - 17:00', doctorId: 'dr-elena', date: '2026-02-25' },
];

export default function Admin() {
    const [selectedDoc, setSelectedDoc] = useState(DOCTORS[0].id);
    const [activeTab, setActiveTab] = useState('calendar');
    const [selectedApt, setSelectedApt] = useState(null);

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 24)); // Mock today as Feb 24, 2026
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(null); // The day the user clicked in the month view

    // Calendar Logic
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let firstDay = new Date(year, month, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;

        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blanks = Array.from({ length: startOffset }, (_, i) => i);

        const totalSlots = startOffset + daysInMonth;
        const endBlanksCount = totalSlots % 7 === 0 ? 0 : 7 - (totalSlots % 7);
        const endBlanks = Array.from({ length: endBlanksCount }, (_, i) => i);

        const currentMonthName = currentDate.toLocaleString('sq-AL', { month: 'long', year: 'numeric' });

        return { year, month, days, blanks, endBlanks, currentMonthName, startOffset };
    }, [currentDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedCalendarDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedCalendarDate(null);
    };

    const resetToToday = () => {
        setCurrentDate(new Date(2026, 1, 24));
        setSelectedCalendarDate(null);
    };

    // Calculate schedule for selected calendar date
    const selectedDateSchedule = useMemo(() => {
        if (!selectedCalendarDate) return [];

        // Format date string for comparison "YYYY-MM-DD"
        const year = selectedCalendarDate.getFullYear();
        const month = String(selectedCalendarDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedCalendarDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // Get both appointments and blocked times for selected doc on this date
        const dayApts = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === dateStr).map(a => ({ ...a, itemType: 'appointment' }));
        const dayBlocks = BLOCKED_TIMES.filter(b => b.doctorId === selectedDoc && b.date === dateStr).map(b => ({ ...b, itemType: 'blocked' }));

        // Combine and sort by start time
        return [...dayApts, ...dayBlocks].sort((a, b) => {
            const timeA = a.time.split(' - ')[0];
            const timeB = b.time.split(' - ')[0];
            return timeA.localeCompare(timeB);
        });

    }, [selectedCalendarDate, selectedDoc]);

    // Dock Items
    const DOCK_ITEMS = [
        { id: 'calendar', icon: Clock, label: 'Orari Ditor' },
        { id: 'month-calendar', icon: CalendarDays, label: 'Kalendari Mujor' },
        { id: 'patients', icon: Users, label: 'Pacientët' },
        { id: 'time-off', icon: CalendarOff, label: 'Pushimet & Pauzat' },
        { id: 'settings', icon: Settings, label: 'Setimet' },
    ];

    const currentDoctor = DOCTORS.find(d => d.id === selectedDoc);
    const doctorAppointmentsToday = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === '2026-02-24');

    return (
        <div className="min-h-screen bg-[#1e3a8a] text-white flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Helmet>
                <title>Admin Dashboard — AldoDent</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#172554]/30 rounded-full blur-[120px]" />
            </div>

            {/* ── MODERN DOCK (Bottom Centered) ── */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl p-1.5 flex flex-row gap-1 transition-all">
                {DOCK_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            if (item.id !== 'month-calendar') setSelectedCalendarDate(null);
                        }}
                        className={`relative group p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 w-11 h-11
                            ${activeTab === item.id ? 'bg-white text-[#1e3a8a] shadow-md scale-105' : 'text-white/40 hover:bg-white/10 hover:text-white'}
                        `}
                    >
                        <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-white border border-white/10 text-[#1e3a8a] text-[11px] font-medium rounded-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap shadow-xl">
                            {item.label}
                        </span>
                    </button>
                ))}
                <div className="w-[1px] h-6 bg-white/10 my-auto mx-1" />
                <button className="relative group p-2.5 rounded-xl flex items-center justify-center text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 w-11 h-11">
                    <LogOut size={18} strokeWidth={2} />
                    <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-red-500 text-white text-[11px] font-medium rounded-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap shadow-xl">
                        Dil
                    </span>
                </button>
            </nav>

            {/* ── MAIN CONTENT AREA ── */}
            <main className="flex-1 overflow-y-auto w-full h-screen relative z-10">
                <div className="p-6 md:p-10 lg:p-12 pb-32 mb-8 md:mb-0 max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-medium text-white mb-1 tracking-tight">Paneli i Administrimit</h1>
                            <p className="text-white/60 text-sm font-light">E martë, 24 Shkurt 2026</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                <input
                                    type="text"
                                    placeholder="Kërko pacient..."
                                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/30 transition-all w-64 text-white placeholder-white/30"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-[#1e3a8a]"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-1.5 pr-4 cursor-pointer hover:bg-white/10 transition-colors">
                                <img src={currentDoctor?.avatar} alt={currentDoctor?.name} width="28" height="28" className="w-7 h-7 rounded-md bg-white/10" />
                                <span className="text-sm font-medium text-white/90">{currentDoctor?.name}</span>
                            </div>
                        </div>
                    </header>

                    {/* Content based on Active Tab */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'calendar' && (
                            <Motion.div
                                key="calendar"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                {/* Doctor Selector */}
                                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                    {DOCTORS.map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedDoc(doc.id)}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all shrink-0
                                                ${selectedDoc === doc.id
                                                    ? 'bg-white border-white text-[#1e3a8a] shadow-sm'
                                                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}
                                            `}
                                        >
                                            <img src={doc.avatar} alt="" width="32" height="32" className="w-8 h-8 rounded-lg bg-black/5" />
                                            <div className="text-left leading-tight">
                                                <div className={`text-sm font-medium ${selectedDoc === doc.id ? 'text-[#1e3a8a]' : 'text-white'}`}>{doc.name}</div>
                                                <div className={`text-[11px] ${selectedDoc === doc.id ? 'text-[#1e3a8a]/60' : 'text-white/40'}`}>{doc.role}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                                    {/* Scheduler View */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                            <h2 className="text-base font-medium text-white flex items-center gap-2">
                                                <Clock className="text-teal-400" size={18} /> Orari i Ditës
                                            </h2>
                                            <div className="flex items-center gap-1.5">
                                                <button className="p-1 border border-white/5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                                                <span className="text-xs text-white/80 font-medium px-2">Sot</span>
                                                <button className="p-1 border border-white/5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronRight size={16} /></button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {doctorAppointmentsToday.length > 0 ? doctorAppointmentsToday.map((apt) => (
                                                <div
                                                    key={apt.id}
                                                    onClick={() => setSelectedApt(apt)}
                                                    className="flex items-center p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group cursor-pointer relative overflow-hidden"
                                                >
                                                    {/* Color bar indicator */}
                                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${apt.status === 'confirmed' ? 'bg-teal-400' : 'bg-amber-400'}`} />

                                                    {/* Redesigned Layout: Time Block */}
                                                    <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/10 pr-4 mr-4">
                                                        <span className="text-lg font-medium text-white">{apt.time.split(' - ')[0]}</span>
                                                        <span className="text-xs text-white/40">{apt.time.split(' - ')[1]}</span>
                                                    </div>

                                                    {/* Details Block */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h4 className="text-base font-medium text-white truncate">{apt.patient}</h4>
                                                            <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider
                                                                ${apt.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border border-teal-400/20' : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'}
                                                            `}>
                                                                {apt.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-white/60 truncate">{apt.service}</p>
                                                    </div>

                                                    {/* Arrow */}
                                                    <div className="pl-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 bg-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                                                            <ArrowRight size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="py-12 text-center text-white/40 flex flex-col items-center">
                                                    <CalendarOff size={32} className="mb-3 opacity-20" />
                                                    <p className="text-sm">Nuk ka termine për këtë doktor sot.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar Stats & Actions */}
                                    <div className="space-y-6">
                                        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                                            <h3 className="text-teal-300 text-xs font-semibold mb-1 uppercase tracking-wider">Termine të Reja</h3>
                                            <div className="text-4xl font-light mb-5 tracking-tight">12</div>
                                            <button className="w-full py-2.5 bg-white text-[#1e3a8a] border border-white/10 rounded-lg font-medium text-xs transition-colors hover:bg-teal-50 flex items-center justify-center gap-2 shadow-sm">
                                                <Plus size={16} /> Shto Termin Manual
                                            </button>
                                        </div>

                                        {/* Quick Block Time Card */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                                                <h3 className="text-sm font-medium text-white">Blloko Orarin</h3>
                                                <CalendarOff size={16} className="text-white/40" />
                                            </div>
                                            <p className="text-xs text-white/50 mb-4 leading-relaxed">Shto pushim ose pauzë për të mos lejuar rezervime.</p>
                                            <button onClick={() => setActiveTab('time-off')} className="w-full py-2 border border-white/10 text-white/80 rounded-lg font-medium text-xs hover:bg-white/10 hover:text-white transition-all">
                                                Menaxho Pauzat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        )}

                        {activeTab === 'month-calendar' && (
                            <Motion.div
                                key="month-calendar"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-6">
                                    {/* Monthly Grid */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-xl font-medium text-white capitalize">{calendarData.currentMonthName}</h2>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={prevMonth} className="p-1.5 border border-white/10 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                                                <button onClick={resetToToday} className="text-sm text-white/90 px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-medium">Sot</button>
                                                <button onClick={nextMonth} className="p-1.5 border border-white/10 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><ChevronRight size={16} /></button>
                                            </div>
                                        </div>

                                        {/* Real JavaScript Calendar Grid */}
                                        <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-xl">
                                            {['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'].map(day => (
                                                <div key={day} className="bg-[#1e3b8a]/80 py-3 text-center text-xs font-semibold text-white/60 uppercase tracking-wider">{day}</div>
                                            ))}

                                            {/* Blank slots before 1st of month */}
                                            {calendarData.blanks.map((_, i) => (
                                                <div key={`blank-${i}`} className="bg-white/[0.02] min-h-[100px] p-2" />
                                            ))}

                                            {/* Actual Days */}
                                            {calendarData.days.map(day => {
                                                const dateMatchStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                                                const dayApts = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === dateMatchStr);
                                                const dayBlocks = BLOCKED_TIMES.filter(b => b.doctorId === selectedDoc && b.date === dateMatchStr);

                                                const isToday = day === 24 && currentDate.getMonth() === 1 && currentDate.getFullYear() === 2026;

                                                // Sunday check: dayIndex starts from 0 (Monday)
                                                // offset + day - 1 = position in grid. % 7 === 6 means Sunday.
                                                const isSunday = (calendarData.startOffset + (day - 1)) % 7 === 6;

                                                const isSelected = selectedCalendarDate?.getDate() === day && selectedCalendarDate?.getMonth() === currentDate.getMonth();

                                                return (
                                                    <div
                                                        key={day}
                                                        onClick={() => {
                                                            if (!isSunday) setSelectedCalendarDate(new Date(calendarData.year, calendarData.month, day))
                                                        }}
                                                        className={`min-h-[100px] p-2 border-t border-l border-white/5 relative transition-colors
                                                            ${isSunday ? 'bg-black/10 opacity-40 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 cursor-pointer group'}
                                                            ${isSelected && !isSunday ? 'bg-white/[0.15] border-white/30 z-10' : ''}
                                                        `}
                                                    >
                                                        <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full 
                                                            ${isToday ? 'bg-teal-400 text-[#1e3a8a] shadow-lg shadow-teal-400/20' : 'text-white/80'}
                                                            ${isSelected && !isToday ? 'bg-white text-[#1e3a8a]' : ''}
                                                        `}>
                                                            {day}
                                                        </span>

                                                        <div className="mt-2 space-y-1">
                                                            {!isSunday && dayApts.length > 0 && (
                                                                <div className="w-full bg-teal-400/20 border border-teal-400/30 rounded px-1.5 py-0.5 text-[9px] text-teal-300 truncate">
                                                                    {`${dayApts.length} Termine`}
                                                                </div>
                                                            )}
                                                            {!isSunday && dayBlocks.length > 0 && (
                                                                <div className="w-full bg-red-400/20 border border-red-400/30 rounded px-1.5 py-0.5 text-[9px] text-red-300 truncate">
                                                                    {`${dayBlocks.length} Pauzë`}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                            {/* Blank slots at the end to complete the grid */}
                                            {calendarData.endBlanks.map((_, i) => (
                                                <div key={`end-blank-${i}`} className="bg-white/[0.02] min-h-[100px] p-2 border-t border-l border-white/5" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selected Day Details Section */}
                                    {selectedCalendarDate && (
                                        <Motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                                        >
                                            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                                                <CalendarDays size={20} className="text-teal-400" />
                                                <h3 className="text-lg font-medium text-white">
                                                    Agjenda: {selectedCalendarDate.toLocaleDateString('sq-AL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                </h3>
                                            </div>

                                            <div className="space-y-4">
                                                {selectedDateSchedule.length > 0 ? selectedDateSchedule.map((item, idx) => {
                                                    if (item.itemType === 'appointment') {
                                                        return (
                                                            <div
                                                                key={`${item.id}-${idx}`}
                                                                onClick={() => setSelectedApt(item)}
                                                                className="flex items-center p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group cursor-pointer relative overflow-hidden"
                                                            >
                                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'confirmed' ? 'bg-teal-400' : 'bg-amber-400'}`} />
                                                                <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/10 pr-4 mr-4">
                                                                    <span className="text-lg font-medium text-white">{item.time.split(' - ')[0]}</span>
                                                                    <span className="text-xs text-white/40">{item.time.split(' - ')[1]}</span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <h4 className="text-base font-medium text-white truncate">{item.patient}</h4>
                                                                        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider
                                                                            ${item.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border border-teal-400/20' : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'}
                                                                        `}>
                                                                            {item.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-white/60 truncate">{item.service}</p>
                                                                </div>
                                                                <div className="pl-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button className="p-2 bg-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                                                                        <ArrowRight size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    } else {
                                                        // Blocked time styling
                                                        return (
                                                            <div
                                                                key={`${item.id}-${idx}`}
                                                                className="flex items-center p-4 rounded-xl border border-white/5 bg-black/10 relative overflow-hidden opacity-80 backdrop-blur-sm"
                                                            >
                                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50" />
                                                                <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/5 pr-4 mr-4">
                                                                    <span className="text-lg font-medium text-white/70">{item.time.split(' - ')[0]}</span>
                                                                    <span className="text-xs text-white/30">{item.time.split(' - ')[1]}</span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <h4 className="text-base font-medium text-white/70 line-through decoration-white/20">{item.type}</h4>
                                                                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                                                                            E Bllokuar
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-white/40">{item.title}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                }) : (
                                                    <div className="py-8 text-center text-white/40 flex flex-col items-center border border-dashed border-white/10 rounded-xl">
                                                        <CalendarOff size={24} className="mb-2 opacity-20" />
                                                        <p className="text-sm">Nuk ka agjendë për këtë ditë.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Motion.div>
                                    )}
                                </div>
                            </Motion.div>
                        )}

                        {activeTab === 'time-off' && (
                            <Motion.div
                                key="time-off"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                <div className="max-w-[700px] mx-auto bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                                    <h2 className="text-xl font-medium text-white mb-1">Pushimet & Pauzat</h2>
                                    <p className="text-white/60 mb-8 text-sm">Zgjidhni doktorin dhe bllokoni një interval kohor.</p>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Doktori</label>
                                            <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-teal-400/50 text-white transition-all appearance-none cursor-pointer">
                                                {DOCTORS.map(d => <option key={d.id} value={d.id} className="bg-[#1e3a8a]">{d.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Data e fillimit</label>
                                                <input type="date" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-teal-400/50 text-white transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Data e përfundimit</label>
                                                <input type="date" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-teal-400/50 text-white transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Ora nga</label>
                                                <input type="time" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-teal-400/50 text-white transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Ora deri</label>
                                                <input type="time" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-teal-400/50 text-white transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert cursor-pointer" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Arsyeja (Opsionale)</label>
                                            <input type="text" placeholder="P.sh. Pauza e drekës" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/40 transition-all" />
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
                                            <button className="px-6 py-2.5 bg-white hover:bg-teal-50 text-[#1e3a8a] font-medium text-sm rounded-lg transition-colors shadow-lg shadow-black/10">
                                                Ruaj Pauzën
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        )}

                        {(activeTab === 'patients' || activeTab === 'settings') && (
                            <Motion.div
                                key="placeholder"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                                className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-white/20 rounded-2xl bg-white/[0.02]"
                            >
                                <Settings size={40} className="text-white/20 mb-4" />
                                <h3 className="text-lg font-medium text-white mb-2">Moduli në zhvillim</h3>
                                <p className="text-white/50 text-sm max-w-sm mx-auto">Ky seksion do të shtohet së shpejti kur të lidhim databazën me Supabase.</p>
                            </Motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ── BOOKING DETAILS MODAL ── */}
            <AnimatePresence>
                {selectedApt && (
                    <>
                        <Motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#0d1b2a]/60 backdrop-blur-md z-50 transition-all"
                            onClick={() => setSelectedApt(null)}
                        />
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#1e3a8a] border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            <div className="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-lg font-medium text-white">Detajet e Rezervimit</h3>
                                <button onClick={() => setSelectedApt(null)} className="text-white/60 hover:text-white transition-colors bg-white/10 p-1.5 rounded-md hover:bg-white/20">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-5 md:p-6 space-y-6">
                                {/* Header / Patient Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-300 shadow-inner">
                                        <UserIcon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-medium text-white">{selectedApt.patient}</h4>
                                        <div className="text-sm text-teal-100/70">{selectedApt.service}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-1">Koha</div>
                                        <div className="text-sm text-white font-medium flex items-center gap-1.5">
                                            <Clock size={14} className="text-teal-400" /> {selectedApt.time}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-1">Statusi</div>
                                        <div className="text-sm text-white font-medium flex items-center gap-1.5">
                                            {selectedApt.status === 'confirmed' ? (
                                                <><CheckCircle size={14} className="text-teal-400" /> Konfirmuar</>
                                            ) : (
                                                <><Clock size={14} className="text-amber-400" /> Në Pritje</>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-2">Doktori</div>
                                    <div className="flex items-center gap-3">
                                        <img src={DOCTORS.find(d => d.id === selectedApt.doctorId)?.avatar} alt="" width="24" height="24" className="w-6 h-6 rounded bg-white/10" />
                                        <span className="text-sm text-white/90 font-medium">{DOCTORS.find(d => d.id === selectedApt.doctorId)?.name}</span>
                                    </div>
                                </div>

                                {selectedApt.notes && (
                                    <div>
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-2">Shënime</div>
                                        <p className="text-sm text-white/80 bg-white/5 p-3.5 rounded-xl border border-white/10 leading-relaxed">
                                            {selectedApt.notes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
                                <button className="flex-1 py-2.5 bg-white hover:bg-teal-50 text-[#1e3a8a] text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                                    <Edit2 size={16} /> Ndrysho
                                </button>
                                <button className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2">
                                    <Trash2 size={16} /> Anulo / Fshi
                                </button>
                            </div>
                        </Motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
