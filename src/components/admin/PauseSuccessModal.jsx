import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export default function PauseSuccessModal({ showPauseSuccess, setShowPauseSuccess }) {
    return (
        <AnimatePresence>
            {showPauseSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a192f]/80 backdrop-blur-md ModalOverlay"
                    onClick={(e) => {
                        if (e.target.classList.contains('ModalOverlay')) setShowPauseSuccess(false);
                    }}
                >
                    <Motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        className="bg-[#1e3a8a] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                    >
                        {/* Decorative glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-transparent pointer-events-none" />
                        <div className="absolute top-0 left-0 right-0 h-1 bg-teal-400/30" />

                        <Motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            className="w-16 h-16 bg-teal-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-300 ring-1 ring-teal-500/20 shadow-inner relative z-10"
                        >
                            <Check size={32} strokeWidth={2} />
                        </Motion.div>

                        <h3 className="text-2xl font-light tracking-tight text-white mb-3 relative z-10">Pauza u Ruajt!</h3>
                        <p className="text-white/50 text-sm mb-8 font-light leading-relaxed tracking-wide relative z-10">
                            Intervali i zgjedhur është bllokuar me sukses në agjendën e doktorit.
                        </p>

                        <button
                            onClick={() => setShowPauseSuccess(false)}
                            className="w-full py-3.5 bg-teal-400 text-[#1e3a8a] font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/20 relative z-10"
                        >
                            Kthehu në Kalendar
                        </button>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
