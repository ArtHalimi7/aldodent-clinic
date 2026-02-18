import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
    {
        id: "01",
        title: "Vizioni",
        description: "Diagnostifikim digjital i avancuar për të kuptuar strukturën tuaj unike dhe për të projektuar buzëqeshjen e përsosur.",
    },
    {
        id: "02",
        title: "Dizajni",
        description: "Arkitektura e buzëqeshjes krijohet virtualisht. Ju shihni rezultatin final para se të fillojmë punën.",
    },
    {
        id: "03",
        title: "Krijimi",
        description: "Mjeshtëria artizanale takohet me saktësinë robotike për të realizuar vizionin në çdo detaj mikroskopik.",
    },
    {
        id: "04",
        title: "Kujdesi",
        description: "Një angazhim i përjetshëm për të ruajtur shkëlqimin dhe shëndetin e buzëqeshjes suaj të re.",
    }
];

const SignatureProcess = () => {
    const containerRef = useRef(null);

    return (
        <section ref={containerRef} className="relative bg-[#009299]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {STEPS.map((step, index) => (
                <Step key={index} step={step} index={index} total={STEPS.length} />
            ))}
        </section>
    );
};

const Step = ({ step, index, total }) => {
    // Each step gets progressively darker
    const bgShades = ['bg-[#009299]', 'bg-[#008a90]', 'bg-[#007a80]', 'bg-[#006b70]'];

    return (
        <div
            className={`sticky top-0 h-screen flex items-center justify-center overflow-hidden border-t border-white/5 ${bgShades[index] || 'bg-[#009299]'}`}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-white/[0.02] rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Big Number */}
                <div className="relative flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex items-center justify-center"
                    >
                        <h2
                            className="text-[25vw] md:text-[20vw] leading-none font-light select-none text-transparent"
                            style={{ WebkitTextStroke: '1px #5eead4' }}
                        >
                            {step.id}
                        </h2>
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-white/5 -z-10"
                        />
                    </motion.div>
                </div>

                {/* Right: Content */}
                <div className="flex flex-col justify-center space-y-8 relative z-20 items-center md:items-start text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                            <span className="text-xs uppercase tracking-[0.3em] font-bold px-4 py-2 rounded-full bg-white/5 border border-white/10 text-teal-300">
                                Hapi {step.id}
                            </span>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: 60 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="h-[1px] bg-white/20"
                            />
                        </div>

                        <h3 className="text-5xl md:text-7xl font-light text-white mb-6 tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-xl md:text-2xl font-light text-white/50 leading-relaxed max-w-lg">
                            {step.description}
                        </p>

                        <div className="mt-8 pt-8 border-t border-white/10 w-full max-w-xs md:max-w-md">
                            <div className="flex justify-between items-center text-xs font-medium text-teal-300 tracking-widest uppercase">
                                <span>Aldo Dent Process</span>
                                <span className="text-teal-300">{index + 1} / {total}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default SignatureProcess;
