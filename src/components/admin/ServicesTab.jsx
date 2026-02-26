import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Clock, Plus, Trash2, Edit2, Check, Stethoscope } from 'lucide-react';

export default function ServicesTab({
    rawServices,
    newService,
    setNewService,
    editingService,
    handleAddService,
    startEditing,
    cancelEditing,
    handleDeleteService,
}) {
    return (
        <Motion.div
            key="services"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 max-w-6xl mx-auto">
                {/* Services List */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                    <h2 className="text-xl font-medium text-white flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                        <Stethoscope className="text-teal-400" size={20} /> Shërbimet e Klinikës
                    </h2>

                    <div className="space-y-3">
                        {rawServices.map(service => (
                            <div key={service.id} className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                                <div>
                                    <h4 className="text-sm font-medium text-white">{service.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] text-white/40 flex items-center gap-1"><Clock size={10} /> {service.duration}</span>
                                        <span className="text-[10px] text-white/40">•</span>
                                        <span className="text-[10px] text-teal-300 font-medium">{service.price}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => startEditing(service)}
                                        className="p-2 text-white/20 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
                                        className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {rawServices.length === 0 && (
                            <div className="py-12 text-center text-white/20">Nuk ka shërbime të regjistruara.</div>
                        )}
                    </div>
                </div>

                {/* Add New Service Form */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md h-fit sticky top-6">
                    <h3 className="text-lg font-medium text-white mb-6">
                        {editingService ? 'Përditëso Shërbimin' : 'Shto Shërbim të Ri'}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Emri i Shërbimit</label>
                            <input
                                type="text"
                                value={newService.title}
                                onChange={e => setNewService({ ...newService, title: e.target.value })}
                                placeholder="P.sh. Pastrim Dhëmbësh"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Kohëzgjatja</label>
                            <input
                                type="text"
                                value={newService.duration}
                                onChange={e => setNewService({ ...newService, duration: e.target.value })}
                                placeholder="P.sh. 30 - 45 min"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/20 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Çmimi</label>
                            <input
                                type="text"
                                value={newService.price}
                                onChange={e => setNewService({ ...newService, price: e.target.value })}
                                placeholder="P.sh. Nga €40 ose Sipas rastit"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/20 transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={handleAddService}
                                className="w-full py-3.5 bg-white text-[#1e3a8a] font-semibold rounded-xl hover:bg-teal-50 transition-all shadow-lg mt-2 flex items-center justify-center gap-2"
                            >
                                {editingService ? <Check size={18} /> : <Plus size={18} />}
                                {editingService ? 'Ruaj Ndryshimet' : 'Shto Shërbimin'}
                            </button>
                            {editingService && (
                                <button
                                    onClick={cancelEditing}
                                    className="w-full py-2.5 bg-white/5 text-white/60 text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Anulo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
}
