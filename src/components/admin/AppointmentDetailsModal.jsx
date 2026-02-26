import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    X, Clock, CalendarDays, Phone, Mail, Stethoscope, AlertTriangle, User
} from 'lucide-react';

export default function AppointmentDetailsModal({
    selectedApt,
    setSelectedApt,
    doctors,
    handleToggleStatus,
    handleDeleteApt
}) {
    if (!selectedApt) return null;

    const docName = doctors.find(d => d.id === selectedApt.doctorId)?.name || 'Doktor i Panjohur';

    return (
        <AnimatePresence>
            <Motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 ModalOverlay"
                onClick={(e) => {
                    if (e.target.classList.contains('ModalOverlay')) setSelectedApt(null);
                }}
            >
                <Motion.div
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-[#1e3a8a] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent pointer-events-none" />
                    {/* Header */}
                    <div className="flex justify-between items-start p-6 border-b border-white/10 bg-white/5 relative z-10">
                        <div>
                            <h3 className="text-xl font-light tracking-tight text-white mb-1">Detajet e Rezervimit</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-white/40 font-bold uppercase tracking-widest">#{String(selectedApt.id).slice(0, 8).toUpperCase()}</span>
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest
                                        ${selectedApt.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border border-teal-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}
                                    `}>
                                    {selectedApt.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedApt(null)}
                            className="p-2.5 bg-white/5 border border-white/10 text-white/40 hover:text-white rounded-xl hover:bg-white/10 transition-all shadow-sm"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 relative z-10">
                        {/* Patient info card */}
                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <div className="w-12 h-12 bg-teal-400/10 text-teal-300 rounded-xl flex items-center justify-center font-bold text-lg shadow-inner border border-teal-500/20 shrink-0">
                                {selectedApt.patient.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-base font-light tracking-wide text-white">{selectedApt.patient}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    {selectedApt.phone && (
                                        <a href={`tel:${selectedApt.phone}`} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-teal-300 hover:underline font-light transition-colors">
                                            <Phone size={12} /> {selectedApt.phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-5 rounded-2xl border border-white/5">
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><CalendarDays size={12} className="text-teal-300/70" /> Data</span>
                                <p className="text-xs font-light text-white">{new Date(selectedApt.date + 'T00:00:00').toLocaleDateString('sq-AL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} className="text-teal-300/70" /> Ora</span>
                                <p className="text-xs font-bold text-teal-300 bg-teal-400/10 px-2.5 py-1 rounded-lg inline-block border border-teal-500/20">{selectedApt.time}</p>
                            </div>
                            <div className="space-y-1.5 col-span-2 pt-3 border-t border-white/5">
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><Stethoscope size={12} className="text-teal-300/70" /> Shërbimi</span>
                                <p className="text-xs font-light text-white bg-white/5 px-3 py-2 rounded-xl border border-white/10 inline-block tracking-wide">{selectedApt.service}</p>
                            </div>
                            <div className="space-y-1.5 col-span-2 pt-3 border-t border-white/5">
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5"><User size={12} className="text-teal-300/70" /> Doktori</span>
                                <div className="flex items-center gap-2 mt-1 bg-white/5 p-2 rounded-xl border border-white/10 w-fit">
                                    <div className="w-6 h-6 rounded-full bg-slate-700 border border-white/20 overflow-hidden flex items-center justify-center text-[10px] font-bold text-white/50">D</div>
                                    <p className="text-xs font-light text-white">{docName}</p>
                                </div>
                            </div>
                        </div>

                        {selectedApt.notes && (
                            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-amber-400 uppercase tracking-widest mb-2">
                                    <AlertTriangle size={12} /> Shënime / Probleme
                                </span>
                                <p className="text-xs text-amber-100/80 font-light leading-relaxed tracking-wide italic">"{selectedApt.notes}"</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between bg-white/5 gap-3 relative z-10 w-full">
                        <button
                            onClick={() => handleDeleteApt(selectedApt.id)}
                            className="w-full sm:w-auto px-5 py-3 border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-center"
                        >
                            Fshi Rezervimin
                        </button>

                        <div className="flex w-full sm:w-auto gap-2.5">
                            <button
                                onClick={() => setSelectedApt(null)}
                                className="flex-1 sm:flex-none px-6 py-3 border border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all text-center"
                            >
                                Mbyll
                            </button>
                            <button
                                onClick={() => handleToggleStatus(selectedApt.id, selectedApt.status)}
                                className={`flex-1 sm:flex-none px-6 py-3 font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-lg transition-all text-center
                                        ${selectedApt.status === 'confirmed'
                                        ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
                                        : 'bg-teal-400 border border-transparent text-[#1e3a8a] hover:bg-teal-300 shadow-teal-400/20'
                                    }`}
                            >
                                {selectedApt.status === 'confirmed' ? 'Kalo në Pritje' : 'Konfirmo Tani'}
                            </button>
                        </div>
                    </div>
                </Motion.div>
            </Motion.div>
        </AnimatePresence>
    );
}
