import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
    Clock, Plus, ChevronRight, ChevronLeft, CalendarOff, ArrowRight
} from 'lucide-react';

export default function DailyScheduleTab({
    doctors,
    selectedDoc,
    setSelectedDoc,
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
            {/* Doctor Selector */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {doctors.map(doc => (
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
                            <button onClick={() => setSelectedDailyDate(new Date(selectedDailyDate.getFullYear(), selectedDailyDate.getMonth(), selectedDailyDate.getDate() - 1))} className="p-1 border border-white/5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                            <span className="text-xs text-white/80 font-medium px-2">
                                {(selectedDailyDate.getDate() === new Date().getDate() && selectedDailyDate.getMonth() === new Date().getMonth() && selectedDailyDate.getFullYear() === new Date().getFullYear())
                                    ? 'Sot'
                                    : selectedDailyDate.toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' })}
                            </span>
                            <button onClick={() => setSelectedDailyDate(new Date(selectedDailyDate.getFullYear(), selectedDailyDate.getMonth(), selectedDailyDate.getDate() + 1))} className="p-1 border border-white/5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {selectedDailySchedule.length > 0 ? selectedDailySchedule.map((item, idx) => {
                            if (item.itemType === 'appointment') {
                                return (
                                    <div
                                        key={`${item.id}-${idx}`}
                                        onClick={() => setSelectedApt(item)}
                                        className="flex items-center p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'confirmed' ? 'bg-teal-400' : 'bg-amber-400'}`} />
                                        <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/10 pr-4 mr-4">
                                            <span className="text-lg font-medium text-white">{item.time?.split(' - ')[0] || item.time}</span>
                                            <span className="text-xs text-white/40">{item.time?.split(' - ')[1] || ''}</span>
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
                                return (
                                    <div
                                        key={`${item.id}-${idx}`}
                                        className="flex items-center p-4 rounded-xl border border-white/5 bg-black/10 relative overflow-hidden opacity-80 backdrop-blur-sm"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50" />
                                        <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/5 pr-4 mr-4">
                                            <span className="text-lg font-medium text-white/70">{item.time?.split(' - ')[0] || item.time}</span>
                                            <span className="text-xs text-white/30">{item.time?.split(' - ')[1] || ''}</span>
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
                            <div className="py-12 text-center text-white/40 flex flex-col items-center border border-dashed border-white/10 rounded-xl">
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
                        <div className="text-4xl font-light mb-5 tracking-tight">{APPOINTMENTS.length}</div>
                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="w-full py-2.5 bg-white text-[#1e3a8a] border border-white/10 rounded-lg font-medium text-xs transition-colors hover:bg-teal-50 flex items-center justify-center gap-2 shadow-sm"
                        >
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
    );
}
