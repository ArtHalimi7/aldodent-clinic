import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Clock, CalendarOff, AlertTriangle } from 'lucide-react';
import MiniCalendar from './MiniCalendar';

export default function TimeOffTab({
    doctors,
    pauzaForm,
    setPauzaForm,
    handleSavePauza,
    setActiveTab,
}) {
    // Generate times for dropdown
    const timeOptions = [];
    for (let h = 8; h <= 20; h++) {
        ['00', '30'].forEach(m => {
            timeOptions.push(`${String(h).padStart(2, '0')}:${m}`);
        });
    }

    return (
        <Motion.div
            key="time-off"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
        >
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-sm backdrop-blur-sm relative z-10">
                    <div className="flex items-start gap-5">
                        <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 shrink-0">
                            <CalendarOff size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-light tracking-tight text-white mb-2">Pushime & Pauza</h2>
                            <p className="text-sm font-light text-white/50 leading-relaxed max-w-2xl">
                                Blloko një periudhë kohore në kalendar ku doktori nuk do të jetë i disponueshëm për termine.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 relative z-10">
                    <div className="bg-white/5 border border-white/10 shadow-sm rounded-3xl p-8 backdrop-blur-sm">
                        <div className="space-y-8">

                            {/* Doctor Selection */}
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-3 uppercase tracking-widest">Doktori</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {doctors.map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => setPauzaForm({ ...pauzaForm, doctor_id: doc.id })}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-sm font-light tracking-wide
                                                ${pauzaForm.doctor_id === doc.id
                                                    ? 'border-teal-400/50 bg-teal-400/10 text-white shadow-sm shadow-teal-400/10'
                                                    : 'border-white/10 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <img src={doc.avatar} alt="" className="w-10 h-10 rounded-xl shadow-sm border border-white/10" />
                                            {doc.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Time From */}
                                <div>
                                    <label className="block text-xs font-bold text-white/50 mb-3 uppercase tracking-widest">Nga (Ora)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} strokeWidth={1.5} />
                                        <select
                                            value={pauzaForm.startTime}
                                            onChange={(e) => setPauzaForm({ ...pauzaForm, startTime: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 appearance-none text-white font-light transition-all"
                                        >
                                            <option value="" className="bg-[#1e3a8a] text-white/50">Zgjidh Orën</option>
                                            {timeOptions.map(t => <option key={`start-${t}`} value={t} className="bg-[#1e3a8a]">{t}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Time To */}
                                <div>
                                    <label className="block text-xs font-bold text-white/50 mb-3 uppercase tracking-widest">Deri (Ora)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} strokeWidth={1.5} />
                                        <select
                                            value={pauzaForm.endTime}
                                            onChange={(e) => setPauzaForm({ ...pauzaForm, endTime: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 appearance-none text-white font-light transition-all"
                                        >
                                            <option value="" className="bg-[#1e3a8a] text-white/50">Zgjidh Orën</option>
                                            {timeOptions.map(t => <option key={`end-${t}`} value={t} className="bg-[#1e3a8a]">{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-3 uppercase tracking-widest flex justify-between">
                                    Arsyeja / Përshkrimi
                                    <span className="text-white/30 font-light">(Opsionale)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="p.sh. Pushim Dreke, Konferencë..."
                                    value={pauzaForm.reason}
                                    onChange={(e) => setPauzaForm({ ...pauzaForm, reason: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 text-white font-light placeholder:text-white/20 transition-all"
                                />
                            </div>

                            {/* Alert Context */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-4 items-start">
                                <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} strokeWidth={1.5} />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-300 mb-1 uppercase tracking-widest">Kujdes</h4>
                                    <p className="text-xs text-amber-100/70 leading-relaxed font-light">
                                        Terminet ekzistuese në këtë fashë orare nuk do të fshihen automatikisht. Duhet t'i anuloni manualisht para se të vendosni pauzën.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 mt-2 flex items-center justify-end gap-4 border-t border-white/10">
                                <button
                                    onClick={() => setActiveTab('calendar')}
                                    className="px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                >
                                    Anulo
                                </button>
                                <button
                                    onClick={handleSavePauza}
                                    className="px-8 py-3.5 bg-teal-400 border border-transparent shadow-lg shadow-teal-400/20 text-[#1e3a8a] rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-teal-300 transition-all"
                                >
                                    Blloko Orarin
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Date Picker */}
                    <div className="bg-white/5 border border-white/10 shadow-sm rounded-3xl p-8 h-fit backdrop-blur-sm">
                        <div className="mb-6 pb-6 border-b border-white/10">
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Data e Pauzës</label>
                            <p className="text-sm text-white/40 font-light leading-relaxed">Zgjidhni datën kur dëshironi të bllokoni orarin.</p>
                        </div>
                        <MiniCalendar
                            selected={pauzaForm.startDate}
                            onSelect={(date) => setPauzaForm({ ...pauzaForm, startDate: date })}
                            theme="dark"
                        />
                    </div>

                </div>
            </div>
        </Motion.div>
    );
}
