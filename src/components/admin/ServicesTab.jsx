import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Stethoscope, Plus, Pencil, Trash2, Link, Clock, Tag } from 'lucide-react';

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
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">

                {/* Services List Area */}
                <div className="space-y-4 order-2 lg:order-1">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-light tracking-tight text-white mb-1">Lista e Shërbimeve</h2>
                            <p className="text-sm font-light text-white/50">
                                Menaxhoni listën e shërbimeve dhe çmimet.
                            </p>
                        </div>
                        <span className="text-xs font-bold text-teal-300 bg-teal-400/10 px-3 py-1.5 rounded-full border border-teal-500/20 uppercase tracking-widest">
                            {rawServices.length} Total
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {rawServices.map((srv) => (
                            <div key={srv.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all group flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400/0 via-teal-400/50 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 text-teal-300 flex items-center justify-center font-bold border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                                        <Stethoscope size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => startEditing(srv)}
                                            className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-teal-300 hover:bg-teal-400/10 rounded-xl transition-all border border-transparent hover:border-teal-500/20"
                                            title="Ndrysho"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(srv.id)}
                                            className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                                            title="Fshi"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-light text-white mb-4 flex-1 tracking-wide">{srv.title}</h3>

                                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-xs font-light tracking-wide text-white/60 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                        <Clock size={14} className="text-white/40" strokeWidth={1.5} /> {srv.duration} min
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#1e3a8a] bg-teal-400 px-3 py-1.5 rounded-lg shadow-sm shadow-teal-400/20">
                                        <Tag size={14} className="text-[#1e3a8a]/70" strokeWidth={2} /> {srv.price}
                                    </div>

                                    <div className="ml-auto flex items-center gap-1.5 text-[10px] text-white/20 font-bold uppercase tracking-widest pl-2">
                                        <Link size={12} strokeWidth={2} /> {String(srv.id).slice(0, 5)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Area */}
                <div className="order-1 lg:order-2 h-fit sticky top-6 relative z-10">
                    <div className="bg-white/5 border border-white/10 shadow-sm rounded-3xl p-8 backdrop-blur-sm">
                        <div className="mb-8 pb-6 border-b border-white/10 flex items-start gap-5">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-inner
                                ${editingService ? 'bg-teal-400/10 text-teal-300 border border-teal-500/20' : 'bg-white/5 text-white/50 border border-white/10'}`}
                            >
                                {editingService ? <Pencil size={20} strokeWidth={1.5} /> : <Plus size={24} strokeWidth={1.5} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-light text-white mb-1 tracking-tight">
                                    {editingService ? 'Ndrysho Shërbimin' : 'Shto Shërbim'}
                                </h3>
                                <p className="text-xs font-light text-white/50 leading-relaxed">
                                    {editingService
                                        ? 'Përditësoni të dhënat e shërbimit ekzistues.'
                                        : 'Plotësoni formën për të shtuar.'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest">Emri i Shërbimit</label>
                                <input
                                    id="service-title-input"
                                    type="text"
                                    placeholder="p.sh. Ekstraksion i thjeshtë..."
                                    value={newService.title}
                                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                    className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all font-light text-white placeholder:text-white/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest">Kohëzgjatja</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="30"
                                            value={newService.duration}
                                            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                                            className="w-full pl-5 pr-12 py-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all font-light text-white placeholder:text-white/20"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-white/30 uppercase tracking-widest">min</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-widest">Çmimi</label>
                                    <input
                                        type="text"
                                        placeholder="€50"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-white/[0.02] border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all font-light text-white placeholder:text-white/20"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 mt-2 flex flex-col gap-3">
                                <button
                                    onClick={handleAddService}
                                    className="w-full py-4 bg-teal-400 text-[#1e3a8a] rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/20 flex justify-center items-center"
                                >
                                    {editingService ? 'Ruaj Ndryshimet' : 'Shto Shërbimin'}
                                </button>
                                {editingService && (
                                    <button
                                        onClick={cancelEditing}
                                        className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                                    >
                                        Anulo Ndryshimin
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Motion.div>
    );
}
