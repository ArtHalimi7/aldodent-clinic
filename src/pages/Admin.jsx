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
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Helmet>
                <title>Admin Dashboard — AldoDent</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* ── MODERN DOCK (Desktop Side / Mobile Bottom) ── */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 md:top-1/2 md:-translate-y-1/2 md:bottom-auto z-50 bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl md:rounded-3xl p-2 flex md:flex-col gap-2 transition-all">
                {DOCK_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`relative group p-3.5 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300
                            ${activeTab === item.id ? 'bg-[#1e3a8a] text-white shadow-md shadow-[#1e3a8a]/20 scale-105' : 'text-slate-400 hover:bg-slate-100/80 hover:text-slate-600'}
                        `}
                    >
                        <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        {/* Tooltip */}
                        <span className="absolute left-full md:left-auto md:right-full ml-4 md:ml-0 md:mr-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 -translate-x-2 md:translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap hidden md:block">
                            {item.label}
                        </span>
                    </button>
                ))}
                <div className="w-[1px] md:w-8 h-8 md:h-[1px] bg-slate-200 my-1 md:mx-auto" />
                <button className="relative group p-3.5 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300">
                    <LogOut size={22} strokeWidth={2} />
                </button>
            </nav>

            {/* ── MAIN CONTENT AREA ── */}
            <main className="flex-1 ml-0 md:ml-28 p-6 md:p-10 lg:p-12 overflow-y-auto pb-32 md:pb-12 w-full h-screen">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1e3a8a] mb-1">Pasqyra e Ditës</h1>
                        <p className="text-slate-500 text-sm font-medium">E martë, 24 Shkurt 2026</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Kërko pacient..."
                                className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] shadow-sm transition-all w-64"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        {/* Profile Dropdown (Simplified) */}
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full p-1.5 pr-4 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                            <img src={currentDoctor?.avatar} alt={currentDoctor?.name} className="w-8 h-8 rounded-full bg-slate-100" />
                            <span className="text-sm font-medium text-slate-700">{currentDoctor?.name}</span>
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
                                                ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-md shadow-[#1e3a8a]/10'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
                                        `}
                                    >
                                        <img src={doc.avatar} alt="" className="w-10 h-10 rounded-full bg-white/20" />
                                        <div className="text-left">
                                            <div className="text-sm font-medium">{doc.name}</div>
                                            <div className={`text-xs ${selectedDoc === doc.id ? 'text-white/70' : 'text-slate-400'}`}>{doc.role}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                                {/* Scheduler View */}
                                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-lg font-medium text-slate-800 flex items-center gap-2">
                                            <Clock className="text-[#1e3a8a]" size={20} /> Orari i Sotëm
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"><ChevronLeft size={18} /></button>
                                            <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500"><ChevronRight size={18} /></button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {doctorAppointments.length > 0 ? doctorAppointments.map((apt) => (
                                            <div key={apt.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer relative overflow-hidden">
                                                {/* Color bar indicator */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${apt.status === 'confirmed' ? 'bg-teal-400' : 'bg-amber-400'}`} />

                                                <div className="w-24 shrink-0 text-sm font-semibold text-[#1e3a8a] pt-1">
                                                    {apt.time}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-base font-medium text-slate-800 mb-0.5">{apt.patient}</h4>
                                                    <p className="text-sm text-slate-500 mb-2">{apt.service}</p>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                                        ${apt.status === 'confirmed' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'}
                                                    `}>
                                                        {apt.status === 'confirmed' ? 'E Konfirmuar' : 'Në Pritje'}
                                                    </span>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 transition-opacity self-start p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-sm text-slate-400 hover:text-[#1e3a8a]">
                                                    <ArrowRightIcon size={18} />
                                                </button>
                                            </div>
                                        )) : (
                                            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
                                                <CalendarOff size={40} className="mb-3 opacity-20" />
                                                <p>Nuk ka termine për këtë doktor sot.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sidebar Stats & Actions */}
                                <div className="space-y-6">
                                    <div className="bg-[#1e3a8a] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-[#1e3a8a]/20">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                                        <h3 className="text-white/70 text-sm font-medium mb-1">Termine të reja</h3>
                                        <div className="text-4xl font-light mb-4">12</div>
                                        <button className="w-full py-3 bg-white text-[#1e3a8a] rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                            <Plus size={18} /> Shto Termin Manual
                                        </button>
                                    </div>

                                    {/* Quick Block Time Card */}
                                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium text-slate-800">Blloko Orarin</h3>
                                            <CalendarOff size={18} className="text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-500 mb-5">Shto pushim ose pauzë për të mos lejuar rezervime të reja.</p>
                                        <button onClick={() => setActiveTab('time-off')} className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
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
                            <div className="max-w-3xl bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                <h2 className="text-2xl font-medium text-slate-800 mb-2">Pushimet dhe Pauzat</h2>
                                <p className="text-slate-500 mb-8">Zgjidhni doktorin dhe bllokoni një interval kohor (pauzë dreke, pushim vjetor).</p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Doktori</label>
                                        <select className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]">
                                            {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Data e fillimit</label>
                                            <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Data e përfundimit</label>
                                            <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Ora nga</label>
                                            <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Ora deri</label>
                                            <input type="time" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Arsyeja (Opsionale)</label>
                                        <input type="text" placeholder="P.sh. Pauza e drekës" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a]" />
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                                        <button className="px-6 py-3 bg-[#1e3a8a] text-white rounded-xl font-medium text-sm hover:bg-blue-900 transition-colors shadow-lg shadow-[#1e3a8a]/10">
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
                            className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-slate-200 rounded-3xl"
                        >
                            <Settings size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-xl font-medium text-slate-700 mb-2">Moduli në zhvillim</h3>
                            <p className="text-slate-500">Ky seksion do të shtohet së shpejti kur të lidhim databazën.</p>
                        </Motion.div>
                    )}
                </AnimatePresence>

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
