import React from 'react';
import { motion as Motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import MiniCalendar from './MiniCalendar';

const TIME_SLOTS_AM = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const TIME_SLOTS_PM = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

export default function TimeOffTab({
    doctors,
    pauzaForm,
    setPauzaForm,
    handleSavePauza,
}) {
    return (
        <Motion.div
            key="time-off"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
        >
            <div className="max-w-4xl mx-auto space-y-6 pb-20">
                <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-xl font-medium text-white mb-1">Pushimet & Pauzat</h2>
                            <p className="text-white/60 text-sm">Zgjidhni doktorin dhe bllokoni një interval kohor.</p>
                        </div>

                        {/* Doctor Selection (Pills) */}
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            {doctors.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => setPauzaForm({ ...pauzaForm, doctor_id: doc.id })}
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${pauzaForm.doctor_id === doc.id ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-white/40 hover:text-white'}`}
                                >
                                    {doc.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Date Picker */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-4 ml-1">1. Zgjidhni Datën</label>
                            <MiniCalendar
                                selected={pauzaForm.startDate}
                                onSelect={(d) => setPauzaForm({ ...pauzaForm, startDate: d })}
                            />
                        </div>

                        {/* Time Range Pickers */}
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-4 ml-1">2. Ora e Fillimit</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[...TIME_SLOTS_AM, ...TIME_SLOTS_PM].map(t => (
                                        <button
                                            key={`start-${t}`}
                                            onClick={() => setPauzaForm({ ...pauzaForm, startTime: t })}
                                            className={`py-2 rounded-xl text-xs font-medium transition-all
                                                    ${pauzaForm.startTime === t ? 'bg-white text-[#1e3a8a]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-4 ml-1">3. Ora e Përfundimit</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[...TIME_SLOTS_AM, ...TIME_SLOTS_PM, "17:30"].map(t => (
                                        <button
                                            key={`end-${t}`}
                                            onClick={() => setPauzaForm({ ...pauzaForm, endTime: t })}
                                            className={`py-2 rounded-xl text-xs font-medium transition-all
                                                    ${pauzaForm.endTime === t ? 'bg-white text-[#1e3a8a]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-2 ml-1">4. Arsyeja (Opsionale)</label>
                            <input
                                type="text"
                                value={pauzaForm.reason}
                                onChange={e => setPauzaForm({ ...pauzaForm, reason: e.target.value })}
                                placeholder="P.sh. Vizitë mjekësore, Pauza e drekës..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/20 transition-all"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSavePauza}
                                className="px-10 py-3.5 bg-white hover:bg-teal-50 text-[#1e3a8a] font-medium text-sm rounded-full transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                            >
                                Ruaj Pauzën <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
}
