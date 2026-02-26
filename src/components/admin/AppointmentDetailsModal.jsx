import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    X, Clock, CalendarDays, Edit2, Trash2,
    CheckCircle, User as UserIcon
} from 'lucide-react';

export default function AppointmentDetailsModal({
    selectedApt,
    setSelectedApt,
    doctors,
    handleToggleStatus,
    handleDeleteApt,
}) {
    return (
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
                                    <img src={doctors.find(d => d.id === selectedApt.doctorId)?.avatar} alt="" width="24" height="24" className="w-6 h-6 rounded bg-white/10" />
                                    <span className="text-sm text-white/90 font-medium">{doctors.find(d => d.id === selectedApt.doctorId)?.name}</span>
                                </div>
                            </div>

                            {selectedApt.phone && (
                                <div>
                                    <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-2">Telefoni</div>
                                    <div className="text-sm text-white/90 font-medium">{selectedApt.phone}</div>
                                </div>
                            )}

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
                            <button
                                onClick={() => handleToggleStatus(selectedApt.id, selectedApt.status)}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm
                                        ${selectedApt.status === 'confirmed'
                                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20 hover:bg-amber-400/20'
                                        : 'bg-teal-400/10 text-teal-300 border border-teal-400/20 hover:bg-teal-400/20'}
                                    `}
                            >
                                <Edit2 size={16} /> {selectedApt.status === 'confirmed' ? 'Bëje në Pritje' : 'Konfirmo'}
                            </button>
                            <button
                                onClick={() => handleDeleteApt(selectedApt.id)}
                                className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Anulo / Fshi
                            </button>
                        </div>
                    </Motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
