import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Users, User as UserIcon } from 'lucide-react';

export default function PatientsTab({ uniquePatients }) {
    return (
        <Motion.div
            key="patients"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
        >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                    <div>
                        <h2 className="text-xl font-medium text-white flex items-center gap-2">
                            <Users className="text-teal-400" size={20} /> Lista e Pacientëve
                        </h2>
                        <p className="text-white/50 text-sm mt-1">Totali: {uniquePatients.length} pacientë unikë.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                                <th className="pb-3 px-4 font-semibold">Emri Pacientit</th>
                                <th className="pb-3 px-4 font-semibold">Telefoni</th>
                                <th className="pb-3 px-4 font-semibold">Vizita e Fundit</th>
                                <th className="pb-3 px-4 font-semibold text-center">Numri i Termineve</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uniquePatients.length > 0 ? uniquePatients.map((patient, idx) => (
                                <tr key={idx} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-300">
                                                <UserIcon size={14} />
                                            </div>
                                            <span className="font-medium text-white/90">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-white/70">{patient.phone}</td>
                                    <td className="py-4 px-4 text-sm text-white/70">{new Date(patient.lastVisit).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                    <td className="py-4 px-4 text-center">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-medium text-white shadow-inner">
                                            {patient.appointmentsCount}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-white/40">
                                        <Users size={32} className="mx-auto mb-3 opacity-20" />
                                        <p className="text-sm">Nuk u gjet asnjë pacient.</p>
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
