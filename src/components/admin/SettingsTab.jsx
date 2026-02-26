import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Settings, Bell, Moon, Shield, Mail, Smartphone } from 'lucide-react';

export default function SettingsTab({
    notificationsEnabled,
    setNotificationsEnabled,
    currentDoctor,
}) {
    return (
        <Motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-xl font-medium text-white flex items-center gap-2 mb-6">
                            <Settings className="text-teal-400" size={20} /> Setimet Kryesore
                        </h2>

                        <div className="space-y-4">
                            {/* Notification Settings */}
                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-400/10 text-teal-300 rounded-lg">
                                        <Bell size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-white">Njoftimet Zanor</h4>
                                        <p className="text-[11px] text-white/40">Dëgjo zilën kur vjen një rezervim i ri</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                    className={`w-11 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-teal-400' : 'bg-white/20'}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${notificationsEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 text-white/70 rounded-lg">
                                        <Moon size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-white">Modaliteti i Errët</h4>
                                        <p className="text-[11px] text-white/40">Pamja e sistemit e detyruar në ngjyrë të errët</p>
                                    </div>
                                </div>
                                <button className="w-11 h-6 rounded-full relative bg-teal-400 transition-colors cursor-not-allowed">
                                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-[22px] shadow-sm" />
                                </button>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                            <Shield className="text-white/60" size={18} /> Siguria dhe Fjalëkalimi
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Fjalëkalimi Aktual</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-teal-400/50 text-white transition-all" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Fjalëkalimi i Ri</label>
                                <input type="password" placeholder="Krijo fjalëkalim të ri" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-teal-400/50 text-white transition-all" />
                            </div>
                            <button className="px-5 py-2 mt-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors border border-white/10">
                                Ndrysho Fjalëkalimin
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md text-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 mx-auto mb-4 border-2 border-white/20 flex items-center justify-center p-1">
                            <img src={currentDoctor?.avatar} alt={currentDoctor?.name} className="w-full h-full rounded-full bg-black/20" />
                        </div>
                        <h3 className="text-white font-medium mb-1">{currentDoctor?.name}</h3>
                        <p className="text-teal-300 text-xs uppercase tracking-wider font-semibold mb-4">{currentDoctor?.role}</p>

                        <div className="flex justify-center gap-2">
                            <button className="p-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                                <Mail size={16} />
                            </button>
                            <button className="p-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                                <Smartphone size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
}
