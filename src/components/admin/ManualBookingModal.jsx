import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ChevronRight, ChevronLeft, Shield, Check } from 'lucide-react';
import MiniCalendar from './MiniCalendar';

const TIME_SLOTS_AM = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const TIME_SLOTS_PM = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

export default function ManualBookingModal({
    showBookingModal,
    setShowBookingModal,
    bookingStep,
    setBookingStep,
    bookingData,
    setBookingData,
    doctors,
    rawServices,
    rawAppointments,
    rawBlockedTimes,
    handleManualBooking,
    getDurationSlots,
}) {
    return (
        <AnimatePresence>
            {showBookingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-[#00122e]/90 backdrop-blur-xl overflow-y-auto">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 z-10">
                            <button onClick={() => { setShowBookingModal(false); setBookingStep(0); }} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-[600px]">
                            {/* Sidebar Info */}
                            <div className="bg-white/[0.03] border-r border-white/5 p-8 flex flex-col">
                                <div className="mb-10">
                                    <div className="flex items-center gap-2 text-teal-400 mb-2">
                                        <Shield size={16} />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">Rezervim Manual</span>
                                    </div>
                                    <h2 className="text-2xl font-medium text-white">Shto Terminin</h2>
                                </div>

                                <div className="space-y-6 flex-1">
                                    {/* STEPS INDICATOR */}
                                    <div className="space-y-4">
                                        {["Shërbimi", "Data & Ora", "Të Dhënat"].map((label, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                                        ${bookingStep > idx ? 'bg-teal-400 text-[#00122e]' : bookingStep === idx ? 'bg-white text-[#00122e]' : 'bg-white/5 text-white/20'}`}>
                                                    {bookingStep > idx ? <Check size={14} /> : idx + 1}
                                                </div>
                                                <span className={`text-sm font-medium ${bookingStep >= idx ? 'text-white' : 'text-white/20'}`}>{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <p className="text-[10px] text-white/30 leading-relaxed italic">Duke shtuar këtë termin, ju bllokoni automatikisht hapësirën kohore në agjendë.</p>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-8 md:p-12">
                                <AnimatePresence mode="wait">
                                    {/* STEP 1: SERVICE */}
                                    {bookingStep === 0 && (
                                        <Motion.div key="b0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <h3 className="text-xl font-medium text-white mb-6">Zgjidhni shërbimin</h3>
                                            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {rawServices.map(srv => (
                                                    <button
                                                        key={srv.id}
                                                        onClick={() => { setBookingData({ ...bookingData, service: srv.slug }); setBookingStep(1); }}
                                                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group
                                                                ${bookingData.service === srv.slug ? 'bg-white text-[#1e3a8a] border-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                                                    >
                                                        <div>
                                                            <h4 className="font-medium text-sm">{srv.title}</h4>
                                                            <span className="text-[10px] opacity-60 italic">{srv.duration}</span>
                                                        </div>
                                                        <Plus size={16} className={bookingData.service === srv.slug ? 'hidden' : 'opacity-0 group-hover:opacity-100 transition-opacity'} />
                                                    </button>
                                                ))}
                                            </div>
                                        </Motion.div>
                                    )}

                                    {/* STEP 2: DATE & TIME */}
                                    {bookingStep === 1 && (
                                        <Motion.div key="b1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <div className="flex gap-4 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                                                {doctors.map(doc => (
                                                    <button
                                                        key={doc.id}
                                                        onClick={() => setBookingData({ ...bookingData, doctorId: doc.id, time: '' })}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-w-[200px]
                                                                ${bookingData.doctorId === doc.id ? 'bg-white/10 border-teal-400/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                                    >
                                                        <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full bg-black/20" />
                                                        <div className="text-left">
                                                            <div className="font-medium text-xs text-white">{doc.name}</div>
                                                            <div className="text-[10px] text-white/50">{doc.role}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                                    <MiniCalendar selected={bookingData.date} onSelect={(d) => setBookingData({ ...bookingData, date: d, time: '' })} />
                                                </div>
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-teal-300 mb-4 ml-1">Orari i Lirë</h4>
                                                    <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {[...TIME_SLOTS_AM, ...TIME_SLOTS_PM].map(t => {
                                                            const dateStr = bookingData.date ? `${bookingData.date.getFullYear()}-${String(bookingData.date.getMonth() + 1).padStart(2, '0')}-${String(bookingData.date.getDate()).padStart(2, '0')}` : '';
                                                            const selectedSrv = rawServices.find(s => s.slug === bookingData.service);
                                                            const neededSlots = getDurationSlots(t, selectedSrv?.title || '').length;
                                                            let isOccupied = false;
                                                            let [h, m] = t.split(':').map(Number);
                                                            let currentMins = h * 60 + m;

                                                            for (let i = 0; i < neededSlots; i++) {
                                                                let hr = Math.floor(currentMins / 60);
                                                                let min = currentMins % 60;
                                                                let checkT = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                                                                if (rawAppointments.some(a => String(a.date).split('T')[0] === dateStr && a.doctor_id === bookingData.doctorId && a.time === checkT)) isOccupied = true;
                                                                if (rawBlockedTimes.some(b => String(b.date).split('T')[0] === dateStr && (b.doctor_id === bookingData.doctorId || !b.doctor_id) && b.time.includes(checkT))) isOccupied = true;
                                                                currentMins += 30;
                                                            }

                                                            return (
                                                                <button
                                                                    key={t}
                                                                    disabled={isOccupied || !bookingData.date}
                                                                    onClick={() => setBookingData({ ...bookingData, time: t })}
                                                                    className={`py-2 rounded-lg text-xs font-medium transition-all
                                                                            ${isOccupied ? 'bg-white/5 text-white/10 cursor-not-allowed line-through' :
                                                                            bookingData.time === t ? 'bg-white text-[#1e3a8a] shadow-lg scale-105' : 'bg-white/5 text-white/60 hover:bg-white/20'}`}
                                                                >
                                                                    {t}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-4">
                                                <button onClick={() => setBookingStep(0)} className="text-white/40 hover:text-white flex items-center gap-2 text-sm transition-colors">
                                                    <ChevronLeft size={16} /> Mbrapa
                                                </button>
                                                <button
                                                    disabled={!bookingData.date || !bookingData.time}
                                                    onClick={() => setBookingStep(2)}
                                                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all
                                                            ${(!bookingData.date || !bookingData.time) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white text-[#1e3a8a] hover:bg-teal-50 shadow-lg'}`}
                                                >
                                                    Vazhdo
                                                </button>
                                            </div>
                                        </Motion.div>
                                    )}

                                    {/* STEP 3: DETAILS */}
                                    {bookingStep === 2 && (
                                        <Motion.div key="b2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <h3 className="text-xl font-medium text-white mb-6">Të dhënat e pacientit</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-teal-300 ml-1">Emri *</label>
                                                    <input type="text" value={bookingData.firstName} onChange={e => setBookingData({ ...bookingData, firstName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-400/50 outline-none transition-all" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-teal-300 ml-1">Mbiemri *</label>
                                                    <input type="text" value={bookingData.lastName} onChange={e => setBookingData({ ...bookingData, lastName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-400/50 outline-none transition-all" />
                                                </div>
                                                <div className="space-y-1.5 col-span-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-teal-300 ml-1">Telefoni *</label>
                                                    <input type="tel" value={bookingData.phone} onChange={e => setBookingData({ ...bookingData, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-400/50 outline-none transition-all" />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-teal-300 ml-1">Shënime (Opsionale)</label>
                                                <textarea rows={3} value={bookingData.notes} onChange={e => setBookingData({ ...bookingData, notes: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-400/50 outline-none transition-all resize-none" />
                                            </div>
                                            <div className="flex justify-between items-center pt-4">
                                                <button onClick={() => setBookingStep(1)} className="text-white/40 hover:text-white flex items-center gap-2 text-sm transition-colors">
                                                    <ChevronLeft size={16} /> Mbrapa
                                                </button>
                                                <button
                                                    disabled={!bookingData.firstName || !bookingData.lastName || !bookingData.phone}
                                                    onClick={handleManualBooking}
                                                    className={`px-8 py-3 rounded-xl font-bold text-sm transition-all
                                                            ${(!bookingData.firstName || !bookingData.lastName || !bookingData.phone) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-teal-400 text-[#00122e] hover:bg-teal-300 shadow-lg'}`}
                                                >
                                                    Konfirmo Rezervimin
                                                </button>
                                            </div>
                                        </Motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
