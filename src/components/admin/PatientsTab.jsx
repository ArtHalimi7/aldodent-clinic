import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, Calendar as CalendarIcon, FileClock, ChevronDown, Activity, Clock, Stethoscope } from 'lucide-react';

export default function PatientsTab({ uniquePatients, globalSearch, setGlobalSearch, APPOINTMENTS }) {
    const [expandedPatientId, setExpandedPatientId] = useState(null);

    const filteredPatients = uniquePatients.filter(p =>
        p.name.toLowerCase().includes((globalSearch || '').toLowerCase()) ||
        p.phone.includes(globalSearch || '')
    );

    const togglePatient = (id) => {
        if (expandedPatientId === id) setExpandedPatientId(null);
        else setExpandedPatientId(id);
    };

    return (
        <Motion.div
            key="patients"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
        >
            <div className="bg-white/5 border border-white/10 shadow-sm rounded-3xl overflow-hidden backdrop-blur-sm relative z-10">
                <div className="p-8 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-light tracking-tight text-white mb-1">Lista e Pacientëve</h2>
                        <p className="text-sm font-light text-white/50">Gjithsej {uniquePatients.length} pacientë total.</p>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} strokeWidth={1.5} />
                        <input
                            type="text"
                            placeholder="Kërko me emër ose nr..."
                            value={globalSearch}
                            onChange={(e) => setGlobalSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/10 rounded-2xl text-sm font-light focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all text-white placeholder-white/30"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                <th className="p-5 pl-8">Emri i Pacientit</th>
                                <th className="p-5">Kontakti</th>
                                <th className="p-5 text-center">Historiku</th>
                                <th className="p-5 pr-8 text-right">Vizita e Fundit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/10">
                            {filteredPatients.length > 0 ? filteredPatients.map((p, idx) => {
                                const initial = p.name ? p.name.charAt(0).toUpperCase() : '?';
                                const colorIndex = p.name ? p.name.length % 5 : 0;
                                const avatarColors = [
                                    'bg-indigo-400/10 text-indigo-300 border-indigo-400/20',
                                    'bg-teal-400/10 text-teal-300 border-teal-400/20',
                                    'bg-rose-400/10 text-rose-300 border-rose-400/20',
                                    'bg-amber-400/10 text-amber-300 border-amber-400/20',
                                    'bg-sky-400/10 text-sky-300 border-sky-400/20'
                                ];

                                const isExpanded = expandedPatientId === p.id;

                                // Get all appointments for this patient
                                const patientHistory = APPOINTMENTS?.filter(a => a.patient === p.name && (a.phone === p.phone || !a.phone || p.phone === 'N/A'))
                                    .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

                                return (
                                    <React.Fragment key={idx}>
                                        <tr
                                            onClick={() => togglePatient(p.id)}
                                            className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                                        >
                                            <td className="p-5 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 border ${avatarColors[colorIndex]}`}>
                                                        {initial}
                                                    </div>
                                                    <div className="font-light text-base text-white truncate">{p.name}</div>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3 text-sm font-light text-white/50">
                                                    <Phone size={14} className="text-white/30" />
                                                    {p.phone}
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className="inline-flex items-center gap-2 bg-white/5 text-white/60 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10 group-hover:bg-white/10 transition-colors">
                                                    <FileClock size={12} strokeWidth={1.5} /> {p.appointmentsCount} Vizita
                                                </span>
                                            </td>
                                            <td className="p-5 pr-8 text-right">
                                                <div className="flex items-center justify-end gap-4 text-sm text-white/50 font-light">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarIcon size={14} className="text-white/30" />
                                                        {new Date(p.lastVisit).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </div>
                                                    <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-teal-300' : 'text-white/30'}`} />
                                                </div>
                                            </td>
                                        </tr>
                                        {/* EXPANDABLE HISTORY ROW */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="4" className="p-0 border-0">
                                                        <Motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                            className="overflow-hidden bg-[#172554]/30"
                                                        >
                                                            <div className="p-8 border-y border-white/5 shadow-inner">
                                                                <div className="flex items-center gap-3 mb-6">
                                                                    <div className="p-2 bg-teal-400/10 rounded-lg border border-teal-500/20">
                                                                        <Activity size={18} className="text-teal-300" />
                                                                    </div>
                                                                    <h3 className="text-lg font-light text-white">Detajet e Vizitave</h3>
                                                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    {patientHistory.map((apt, aIdx) => (
                                                                        <div key={aIdx} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                                                                            <div className="flex justify-between items-start mb-4">
                                                                                <div className="flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-widest">
                                                                                    <CalendarIcon size={12} />
                                                                                    {new Date(apt.date).toLocaleDateString('sq-AL', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                                                </div>
                                                                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border
                                                                                    ${apt.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border-teal-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                                                    {apt.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                                                                </span>
                                                                            </div>

                                                                            <div className="space-y-3">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="w-8 h-8 rounded-lg bg-teal-400/5 flex items-center justify-center shrink-0">
                                                                                        <Stethoscope size={14} className="text-teal-300/70" />
                                                                                    </div>
                                                                                    <span className="text-sm text-white font-light line-clamp-2">{apt.service}</span>
                                                                                </div>

                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                                                        <Clock size={14} className="text-white/40" />
                                                                                    </div>
                                                                                    <span className="text-sm text-white/70 font-light">{apt.time}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </Motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center text-white/40">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                                <Search size={24} className="text-white/30" strokeWidth={1.5} />
                                            </div>
                                            <p className="font-light tracking-wide text-white/50">Nuk u gjet asnjë pacient.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Motion.div>
    );
}
