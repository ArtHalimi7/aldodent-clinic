import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export default function PauseSuccessModal({ showPauseSuccess, setShowPauseSuccess }) {
    return (
        <AnimatePresence>
            {showPauseSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0f172a]/80 backdrop-blur-md">
                    <Motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#1e3a8a] border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-blue-500" />

                        <Motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#1e3a8a] shadow-xl"
                        >
                            <Check size={40} strokeWidth={3} />
                        </Motion.div>

                        <h3 className="text-2xl font-light text-white mb-2">Pauza u Ruajt!</h3>
                        <p className="text-white/60 text-sm mb-8">
                            Interval i zgjedhur është bllokuar me sukses në agjendë.
                        </p>

                        <button
                            onClick={() => setShowPauseSuccess(false)}
                            className="w-full py-3.5 bg-white text-[#1e3a8a] font-semibold rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
                        >
                            Kuptova
                        </button>
                    </Motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
