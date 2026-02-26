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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-[#1e3a8a] border border-white/10 rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent pointer-events-none" />
                        <div className="absolute top-0 right-0 p-4 lg:p-6 z-20">
                            <button onClick={() => { setShowBookingModal(false); setBookingStep(0); }} className="p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-2xl transition-all bg-white/5 backdrop-blur-md border border-white/10">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Sidebar Info */}
                        <div className="bg-white/5 border-b lg:border-b-0 lg:border-r border-white/10 p-8 lg:p-10 flex flex-col lg:w-80 shrink-0 relative z-10 backdrop-blur-sm">
                            <div className="mb-10 lg:mb-14">
                                <div className="flex items-center gap-3 text-teal-300 mb-3 bg-teal-400/10 w-fit px-3 py-1.5 rounded-lg border border-teal-500/20">
                                    <Shield size={16} strokeWidth={2} />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Rezervim Manual</span>
                                </div>
                                <h2 className="text-3xl font-light tracking-tight text-white leading-tight">Shto<br />Terminin</h2>
                            </div>

                            <div className="space-y-8 flex-1">
                                {/* STEPS INDICATOR */}
                                <div className="space-y-6">
                                    {["Zgjidh Shërbimin", "Data dhe Ora", "Të Dhënat e Pacientit"].map((label, idx) => (
                                        <div key={idx} className="flex items-center gap-5 group">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all shadow-sm
                                                    ${bookingStep > idx ? 'bg-teal-400 text-[#1e3a8a] shadow-teal-400/20'
                                                    : bookingStep === idx ? 'bg-white/10 border border-teal-400/50 text-teal-300'
                                                        : 'bg-white/5 border border-white/10 text-white/30'}`}>
                                                {bookingStep > idx ? <Check size={18} strokeWidth={2} /> : idx + 1}
                                            </div>
                                            <span className={`text-sm font-light tracking-wide transition-colors ${bookingStep >= idx ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 mt-10 border-t border-white/10 hidden lg:block">
                                <p className="text-xs text-white/40 font-light leading-relaxed">
                                    Duke shtuar këtë termin, ju bllokoni automatikisht hapësirën kohore në agjendën e doktorit përkatës.
                                </p>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 md:p-8 lg:p-12 flex-1 min-h-[400px] lg:min-h-[500px] flex flex-col relative z-10 w-full overflow-hidden">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: SERVICE */}
                                {bookingStep === 0 && (
                                    <Motion.div key="b0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full overflow-hidden">
                                        <h3 className="text-2xl font-light tracking-tight text-white mb-6 shrink-0">Cilin shërbim dëshironi?</h3>
                                        <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-3 custom-scrollbar pb-6 flex-1 min-h-0">
                                            {rawServices.map(srv => (
                                                <button
                                                    key={srv.id}
                                                    onClick={() => { setBookingData({ ...bookingData, service: srv.slug }); setBookingStep(1); }}
                                                    className={`w-full text-left p-6 rounded-3xl border transition-all flex items-center justify-between group
                                                            ${bookingData.service === srv.slug
                                                            ? 'bg-teal-400/10 border-teal-400/50 shadow-sm shadow-teal-400/10'
                                                            : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
                                                >
                                                    <div>
                                                        <h4 className={`font-light text-lg mb-2 tracking-wide ${bookingData.service === srv.slug ? 'text-teal-300' : 'text-white'}`}>{srv.title}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs font-light text-white/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 tracking-widest">{srv.duration} min</span>
                                                            <span className="text-xs font-bold text-[#1e3a8a] bg-teal-400 px-3 py-1.5 rounded-lg tracking-widest shadow-sm">{srv.price}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${bookingData.service === srv.slug ? 'bg-teal-400 text-[#1e3a8a] shadow-lg shadow-teal-400/20' : 'bg-white/5 text-white/30 group-hover:bg-teal-400/10 group-hover:text-teal-300 border border-white/10'}`}>
                                                        {bookingData.service === srv.slug ? <Check size={18} strokeWidth={2} /> : <ChevronRight size={18} />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </Motion.div>
                                )}

                                {/* STEP 2: DATE & TIME */}
                                {bookingStep === 1 && (
                                    <Motion.div key="b1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full overflow-hidden">
                                        <h3 className="text-2xl font-light tracking-tight text-white mb-6 shrink-0">Zgjidhni orarin</h3>

                                        <div className="flex gap-4 mb-6 overflow-x-auto pb-4 custom-scrollbar shrink-0">
                                            {doctors.map(doc => (
                                                <button
                                                    key={doc.id}
                                                    onClick={() => setBookingData({ ...bookingData, doctorId: doc.id, time: '' })}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all min-w-[220px] shrink-0
                                                            ${bookingData.doctorId === doc.id
                                                            ? 'bg-teal-400/10 border-teal-400/50 shadow-sm'
                                                            : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
                                                >
                                                    <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-full bg-[#1e3a8a] border border-white/10 shadow-sm" />
                                                    <div className="text-left">
                                                        <div className={`font-light tracking-wide text-base mb-0.5 ${bookingData.doctorId === doc.id ? 'text-teal-300' : 'text-white'}`}>{doc.name}</div>
                                                        <div className="text-xs font-light tracking-widest uppercase text-white/50">{doc.role}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
                                            <div className="bg-white/5 border border-white/10 shadow-sm rounded-3xl p-6 backdrop-blur-sm h-fit">
                                                <MiniCalendar selected={bookingData.date} onSelect={(d) => setBookingData({ ...bookingData, date: d, time: '' })} theme="dark" />
                                            </div>
                                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-inner flex flex-col h-[320px] xl:h-auto">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6 pb-4 border-b border-white/10 text-center">Orari i Lirë</h4>
                                                <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-1">
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
                                                                className={`py-3 rounded-xl text-sm font-bold transition-all shadow-sm tracking-widest
                                                                        ${isOccupied
                                                                        ? 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed line-through opacity-50 shadow-none'
                                                                        : bookingData.time === t
                                                                            ? 'bg-teal-400 text-[#1e3a8a] border-transparent shadow-lg shadow-teal-400/20 scale-105 z-10'
                                                                            : 'bg-white/5 border border-white/10 text-white/70 hover:border-white/30 hover:text-white hover:bg-white/10'}`}
                                                            >
                                                                {t}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10 shrink-0">
                                            <button onClick={() => setBookingStep(0)} className="px-6 py-3 text-white/60 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm">
                                                Kthehu Mbrapa
                                            </button>
                                            <button
                                                disabled={!bookingData.date || !bookingData.time}
                                                onClick={() => setBookingStep(2)}
                                                className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-3
                                                        ${(!bookingData.date || !bookingData.time)
                                                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                                                        : 'bg-teal-400 text-[#1e3a8a] hover:bg-teal-300 shadow-teal-400/20'}`}
                                            >
                                                Vazhdo <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </Motion.div>
                                )}

                                {/* STEP 3: DETAILS */}
                                {bookingStep === 2 && (
                                    <Motion.div key="b2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full overflow-hidden">
                                        <h3 className="text-2xl font-light tracking-tight text-white mb-6 shrink-0">Të dhënat finale</h3>

                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6 flex flex-wrap gap-x-8 gap-y-4 shadow-inner shrink-0">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Shërbimi</span>
                                                <span className="text-sm font-light tracking-wide text-white">{rawServices.find(s => s.slug === bookingData.service)?.title}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Ora dhe Data</span>
                                                <span className="text-sm font-bold text-[#1e3a8a] bg-teal-400 px-3 py-1 rounded-lg mr-2 inline-block shadow-sm">{bookingData.time}</span>
                                                <span className="text-sm font-light tracking-wide text-white">{bookingData.date?.toLocaleDateString('sq-AL', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 pr-3 min-h-0 overflow-y-auto custom-scrollbar pt-2">
                                            <div>
                                                <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest">Emri <span className="text-rose-400">*</span></label>
                                                <input type="text" placeholder="p.sh. Agron" value={bookingData.firstName} onChange={e => setBookingData({ ...bookingData, firstName: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all font-light placeholder:text-white/20" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest">Mbiemri <span className="text-rose-400">*</span></label>
                                                <input type="text" placeholder="p.sh. Kelmendi" value={bookingData.lastName} onChange={e => setBookingData({ ...bookingData, lastName: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all font-light placeholder:text-white/20" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest">Numri i Telefonit <span className="text-rose-400">*</span></label>
                                                <input type="tel" placeholder="069 123 4567" value={bookingData.phone} onChange={e => setBookingData({ ...bookingData, phone: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all font-light placeholder:text-white/20" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest flex justify-between">Shënime Ekstra <span className="text-white/30 font-light text-xs">(Opsionale)</span></label>
                                                <textarea rows={3} placeholder="Vendosni ndonjë detaj që duhet ta dijë doktori..." value={bookingData.notes} onChange={e => setBookingData({ ...bookingData, notes: e.target.value })} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all resize-none font-light placeholder:text-white/20" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10 shrink-0">
                                            <button onClick={() => setBookingStep(1)} className="px-6 py-3 text-white/60 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm">
                                                Kthehu Mbrapa
                                            </button>
                                            <button
                                                disabled={!bookingData.firstName || !bookingData.lastName || !bookingData.phone}
                                                onClick={handleManualBooking}
                                                className={`px-8 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-3
                                                        ${(!bookingData.firstName || !bookingData.lastName || !bookingData.phone)
                                                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                                                        : 'bg-teal-400 text-[#1e3a8a] hover:bg-teal-300 shadow-teal-400/20'}`}
                                            >
                                                <Check size={18} /> Konfirmo Rezervimin
                                            </button>
                                        </div>
                                    </Motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
