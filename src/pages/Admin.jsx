import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Users, Clock, Settings, LogOut,
    Plus, ChevronRight, ChevronLeft, CalendarOff,
    User, Search, Bell, Menu, X
} from 'lucide-react';

// MOCK DATA
const DOCTORS = [
    { id: 'dr-aldo', name: 'Dr. Aldo', role: 'Kryedoktor & Kirurg', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aldo' },
    { id: 'dr-elena', name: 'Dr. Elena', role: 'Ortodonte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
];

const APPOINTMENTS = [
    { id: 1, patient: 'Arben Hoxha', service: 'Implantologji', time: '09:00 - 10:30', doctorId: 'dr-aldo', status: 'confirmed' },
    { id: 2, patient: 'Besa Gashi', service: 'Konsultë', time: '10:30 - 11:00', doctorId: 'dr-aldo', status: 'pending' },
    { id: 3, patient: 'Driton Krasniqi', service: 'Ortodonci', time: '11:00 - 11:30', doctorId: 'dr-elena', status: 'confirmed' },
    { id: 4, patient: 'Ema Kelmendi', service: 'Zirkon Kurorë', time: '13:00 - 14:30', doctorId: 'dr-aldo', status: 'confirmed' },
];

export default function Admin() {
    const [selectedDoc, setSelectedDoc] = useState(DOCTORS[0].id);
    const [activeTab, setActiveTab] = useState('calendar');

    // Dock Items
    const DOCK_ITEMS = [
        { id: 'calendar', icon: Calendar, label: 'Kalendari' },
        { id: 'patients', icon: Users, label: 'Pacientët' },
        { id: 'time-off', icon: CalendarOff, label: 'Pushimet & Pauzat' },
        { id: 'settings', icon: Settings, label: 'Setimet' },
    ];

    const currentDoctor = DOCTORS.find(d => d.id === selectedDoc);
    const doctorAppointments = APPOINTMENTS.filter(a => a.doctorId === selectedDoc);

    return (
        <div className="min-h-screen bg-[#1e3a8a] text-white flex overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl p-1.5 flex flex-row gap-1 transition-all">
                {DOCK_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`relative group p-3 rounded-xl flex items-center justify-center transition-all duration-300 w-12 h-12
                            ${activeTab === item.id ? 'bg-white text-[#1e3a8a] shadow-lg shadow-black/20 scale-105' : 'text-white/40 hover:bg-white/10 hover:text-white'}
                        `}
                    >
                        <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        {/* Tooltip (Now above the icons) */}
                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-white text-[#1e3a8a] text-[11px] font-medium rounded-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap shadow-xl">
                            {item.label}
                        </span>
                    </button>
                ))}
                <div className="w-[1px] h-8 bg-white/10 my-auto mx-1" />
                <button className="relative group p-3 rounded-xl flex items-center justify-center text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 w-12 h-12">
                    <LogOut size={20} strokeWidth={2} />
                    <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-red-500 text-white text-[11px] font-medium rounded-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap shadow-xl">
                        Dil
                    </span>
                </button>
            </nav>

            {/* ── MAIN CONTENT AREA ── */}
            <main className="flex-1 overflow-y-auto w-full h-screen relative z-10">
                <div className="p-6 md:p-10 lg:p-12 pb-32 mb-8 md:mb-0 max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-1">Pasqyra e Ditës</h1>
                            <p className="text-white/50 text-sm font-light">E martë, 24 Shkurt 2026</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative hidden md:block">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                <input
                                    type="text"
                                    placeholder="Kërko pacient..."
                                    className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 shadow-sm transition-all w-64 text-white placeholder-white/30"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2.5 bg-white/5 border border-white/10 rounded-full text-white/60 hover:bg-white/10 hover:text-white transition-colors shadow-sm">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full border-2 border-[#1e3a8a]"></span>
                            </button>

                            {/* Profile Dropdown (Simplified) */}
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1.5 pr-4 shadow-sm cursor-pointer hover:bg-white/10 transition-colors">
                                <img src={currentDoctor?.avatar} alt={currentDoctor?.name} className="w-8 h-8 rounded-full bg-white/10" />
                                <span className="text-sm font-medium text-white/90">{currentDoctor?.name}</span>
                            </div>
                        </div>
                    </header>

                    {/* Content based on Active Tab */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'calendar' && (
                            <Motion.div
                                key="calendar"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                            >
                                {/* Doctor Selector */}
                                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                    {DOCTORS.map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedDoc(doc.id)}
                                            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all shrink-0
                                                ${selectedDoc === doc.id
                                                    ? 'bg-white border-white text-[#1e3a8a] shadow-lg shadow-black/10'
                                                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}
                                            `}
                                        >
                                            <img src={doc.avatar} alt="" className="w-10 h-10 rounded-full bg-black/5" />
                                            <div className="text-left">
                                                <div className="text-sm font-medium">{doc.name}</div>
                                                <div className={`text-xs ${selectedDoc === doc.id ? 'text-[#1e3a8a]/60' : 'text-white/40'}`}>{doc.role}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                                    {/* Scheduler View */}
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-lg font-light text-white flex items-center gap-2">
                                                <Clock className="text-teal-300" size={20} /> Orari i Sotëm
                                            </h2>
                                            <div className="flex items-center gap-2">
                                                <button className="p-1.5 border border-white/10 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronLeft size={18} /></button>
                                                <button className="p-1.5 border border-white/10 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronRight size={18} /></button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {doctorAppointments.length > 0 ? doctorAppointments.map((apt) => (
                                                <div key={apt.id} className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors group cursor-pointer relative overflow-hidden backdrop-blur-sm">
                                                    {/* Color bar indicator */}
                                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${apt.status === 'confirmed' ? 'bg-teal-400' : 'bg-amber-400'}`} />

                                                    <div className="w-24 shrink-0 text-sm font-medium text-teal-300 pt-1">
                                                        {apt.time}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-base font-medium text-white mb-0.5">{apt.patient}</h4>
                                                        <p className="text-sm text-white/50 mb-2">{apt.service}</p>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                                            ${apt.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border border-teal-400/20' : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'}
                                                        `}>
                                                            {apt.status === 'confirmed' ? 'E Konfirmuar' : 'Në Pritje'}
                                                        </span>
                                                    </div>
                                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity self-start p-2 hover:bg-white/10 rounded-lg border border-transparent shadow-sm text-white/40 hover:text-white">
                                                        <ArrowRightIcon size={18} />
                                                    </button>
                                                </div>
                                            )) : (
                                                <div className="py-12 text-center text-white/40 flex flex-col items-center">
                                                    <CalendarOff size={40} className="mb-3 opacity-20" />
                                                    <p className="font-light">Nuk ka termine për këtë doktor sot.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar Stats & Actions */}
                                    <div className="space-y-6">
                                        <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-black/10">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                                            <h3 className="text-white/60 text-sm font-medium mb-1 uppercase tracking-wider">Termine të reja</h3>
                                            <div className="text-4xl font-light mb-4">12</div>
                                            <button className="w-full py-3 bg-white text-[#1e3a8a] rounded-xl font-medium text-sm hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                                                <Plus size={18} /> Shto Termin Manual
                                            </button>
                                        </div>

                                        {/* Quick Block Time Card */}
                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm backdrop-blur-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-light text-white">Blloko Orarin</h3>
                                                <CalendarOff size={18} className="text-white/40" />
                                            </div>
                                            <p className="text-sm text-white/50 mb-5 font-light">Shto pushim ose pauzë për të mos lejuar rezervime të reja.</p>
                                            <button onClick={() => setActiveTab('time-off')} className="w-full py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-all">
                                                Menaxho Pauzat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        )}

                        {activeTab === 'time-off' && (
                            <Motion.div
                                key="time-off"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                            >
                                <div className="max-w-3xl bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-sm">
                                    <h2 className="text-2xl font-light text-white mb-2">Pushimet dhe Pauzat</h2>
                                    <p className="text-white/50 mb-8 font-light text-sm">Zgjidhni doktorin dhe bllokoni një interval kohor (pauzë dreke, pushim vjetor).</p>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2 ml-1">Doktori</label>
                                            <select className="w-full md:w-1/2 bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white transition-all appearance-none">
                                                {DOCTORS.map(d => <option key={d.id} value={d.id} className="text-[#1e3a8a]">{d.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2 ml-1">Data e fillimit</label>
                                                <input type="date" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2 ml-1">Data e përfundimit</label>
                                                <input type="date" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2 ml-1">Ora nga</label>
                                                <input type="time" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2 ml-1">Ora deri</label>
                                                <input type="time" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white transition-all [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-teal-300 mb-2 ml-1">Arsyeja (Opsionale)</label>
                                            <input type="text" placeholder="P.sh. Pauza e drekës" className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all" />
                                        </div>

                                        <div className="pt-6 border-t border-white/10 flex justify-end">
                                            <button className="px-8 py-3.5 bg-white text-[#1e3a8a] rounded-full font-medium text-sm hover:bg-teal-50 transition-all shadow-lg shadow-black/10">
                                                Blloko Orarin
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
                                className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-white/20 rounded-3xl"
                            >
                                <Settings size={48} className="text-white/20 mb-4" />
                                <h3 className="text-xl font-light text-white mb-2">Moduli në zhvillim</h3>
                                <p className="text-white/50 font-light text-sm max-w-sm mx-auto">Ky seksion do të shtohet së shpejti kur të lidhim databazën me Supabase.</p>
                            </Motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

// Arrow Icon helper
function ArrowRightIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    )
}
