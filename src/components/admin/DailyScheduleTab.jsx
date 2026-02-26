import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
    Clock, Plus, ChevronRight, ChevronLeft, CalendarOff, ArrowRight
} from 'lucide-react';

export default function DailyScheduleTab({
    selectedDailyDate,
    setSelectedDailyDate,
    selectedDailySchedule,
    APPOINTMENTS,
    setSelectedApt,
    setShowBookingModal,
    setActiveTab,
}) {
    return (
        <Motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                {/* Scheduler View */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm relative z-10">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                        <h2 className="text-xl font-light text-white flex items-center gap-2 tracking-tight">
                            <Clock className="text-teal-300" size={20} strokeWidth={1.5} /> Orari i Ditës
                        </h2>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedDailyDate(new Date(selectedDailyDate.getFullYear(), selectedDailyDate.getMonth(), selectedDailyDate.getDate() - 1))} className="p-2 border border-white/10 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                            <span className="text-sm text-white/80 font-medium px-4 tracking-wider uppercase">
                                {(selectedDailyDate.getDate() === new Date().getDate() && selectedDailyDate.getMonth() === new Date().getMonth() && selectedDailyDate.getFullYear() === new Date().getFullYear())
                                    ? 'Sot'
                                    : selectedDailyDate.toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' })}
                            </span>
                            <button onClick={() => setSelectedDailyDate(new Date(selectedDailyDate.getFullYear(), selectedDailyDate.getMonth(), selectedDailyDate.getDate() + 1))} className="p-2 border border-white/10 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {selectedDailySchedule.length > 0 ? selectedDailySchedule.map((item, idx) => {
                            if (item.itemType === 'appointment') {
                                return (
                                    <div
                                        key={`${item.id}-${idx}`}
                                        onClick={() => setSelectedApt(item)}
                                        className="flex items-center p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/10 transition-all group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'confirmed' ? 'bg-teal-400' : 'bg-rose-400'}`} />
                                        <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/10 pr-4 mr-4">
                                            <span className="text-lg font-light text-white">{item.time?.split(' - ')[0] || item.time}</span>
                                            <span className="text-[10px] uppercase tracking-wider font-medium text-white/40">{item.time?.split(' - ')[1] || ''}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-light text-white truncate">{item.patient}</h4>
                                                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border
                                                        ${item.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border-teal-500/20' : 'bg-rose-400/10 text-rose-300 border-rose-500/20'}
                                                    `}>
                                                    {item.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                                </span>
                                            </div>
                                            <p className="text-sm font-light text-white/50 truncate uppercase tracking-wide">{item.service}</p>
                                        </div>
                                        <div className="pl-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                            <button className="p-2.5 bg-teal-400/10 rounded-xl text-teal-300 hover:bg-teal-400/20 transition-colors border border-teal-500/20">
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={`${item.id}-${idx}`}
                                        className="flex items-center p-4 rounded-2xl border border-white/5 bg-black/20 relative overflow-hidden"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
                                        <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/10 pr-4 mr-4 opacity-50">
                                            <span className="text-lg font-light text-white/50">{item.time?.split(' - ')[0] || item.time}</span>
                                            <span className="text-[10px] uppercase font-medium text-white/30">{item.time?.split(' - ')[1] || ''}</span>
                                        </div>
                                        <div className="flex-1 min-w-0 opacity-60">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-light text-white/70 line-through decoration-white/40">{item.type}</h4>
                                                <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/50 border border-white/5">
                                                    E Bllokuar
                                                </span>
                                            </div>
                                            <p className="text-sm font-light text-white/40 uppercase tracking-widest">{item.title}</p>
                                        </div>
                                    </div>
                                );
                            }
                        }) : (
                            <div className="py-20 text-center text-white/30 flex flex-col items-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                                <CalendarOff size={40} className="mb-4 opacity-40" strokeWidth={1} />
                                <p className="text-sm font-light tracking-wide">Nuk ka termine për këtë doktor sot.</p>
                                <button onClick={() => setShowBookingModal(true)} className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-widest transition-colors">Shto termin tani</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Stats & Actions */}
                <div className="space-y-6 relative z-10">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm overflow-hidden relative group">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl group-hover:bg-teal-400/20 transition-colors pointer-events-none" />
                        <h3 className="text-teal-300 text-[10px] font-bold mb-2 uppercase tracking-widest relative z-10">Termine Për Sot</h3>
                        <div className="text-6xl font-light text-white mb-8 tracking-tight relative z-10">
                            {APPOINTMENTS.filter(a => a.date === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`).length}
                        </div>
                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="w-full py-4 bg-teal-400 text-[#1e3a8a] rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-teal-300 flex items-center justify-center gap-2 shadow-lg shadow-teal-400/20 relative z-10"
                        >
                            <Plus size={18} strokeWidth={2.5} /> Shto Manual
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                            <h3 className="text-lg font-light text-white tracking-tight">Menaxhimi</h3>
                            <div className="p-2 bg-white/5 text-white/50 rounded-xl border border-white/10">
                                <CalendarOff size={18} strokeWidth={1.5} />
                            </div>
                        </div>
                        <p className="text-xs font-light text-white/50 mb-6 leading-relaxed tracking-wide">
                            Blloko fasha orare për të mos lejuar rezervime të reja.
                        </p>
                        <button
                            onClick={() => setActiveTab('time-off')}
                            className="w-full py-3 bg-white/[0.05] border border-white/10 text-white rounded-2xl font-medium uppercase tracking-widest text-xs hover:bg-white/[0.1] hover:border-white/20 transition-all"
                        >
                            Menaxho Pauzat
                        </button>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
}
