import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const STEPS = [
    {
        id: "01",
        title: "Vizioni",
        description: "Diagnostifikim digjital i avancuar për të kuptuar strukturën tuaj unike dhe për të projektuar buzëqeshjen e përsosur.",
        color: "from-[#F5FBFB] to-[#EDF7F7]", // Very Light Teal Hint
        accent: "#009299",
        gradientStart: "rgba(0, 146, 153, 0.03)",
        gradientEnd: "rgba(0, 146, 153, 0.08)"
    },
    {
        id: "02",
        title: "Dizajni",
        description: "Arkitektura e buzëqeshjes krijohet virtualisht. Ju shihni rezultatin final para se të fillojmë punën.",
        color: "from-[#F5FBFB] to-[#E0F2F2]", // Light Teal
        accent: "#009299",
        gradientStart: "rgba(0, 146, 153, 0.05)",
        gradientEnd: "rgba(0, 146, 153, 0.12)"
    },
    {
        id: "03",
        title: "Krijimi",
        description: "Mjeshtëria artizanale takohet me saktësinë robotike për të realizuar vizionin në çdo detaj mikroskopik.",
        color: "from-[#F5FBFB] to-[#D1EBEB]", // Medium Teal
        accent: "#009299",
        gradientStart: "rgba(0, 146, 153, 0.08)",
        gradientEnd: "rgba(0, 146, 153, 0.15)"
    },
    {
        id: "04",
        title: "Kujdesi",
        description: "Një angazhim i përjetshëm për të ruajtur shkëlqimin dhe shëndetin e buzëqeshjes suaj të re.",
        color: "from-[#F5FBFB] to-[#C2E4E4]", // Richer Teal
        accent: "#009299",
        gradientStart: "rgba(0, 146, 153, 0.10)",
        gradientEnd: "rgba(0, 146, 153, 0.20)"
    }
];

const BACKGROUND_NOISE = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
    backgroundSize: '150px 150px',
};

const SignatureProcess = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="relative bg-[#F5FBFB]">
            {STEPS.map((step, index) => {
                return (
                    <Step key={index} step={step} index={index} total={STEPS.length} />
                );
            })}
        </section>
    );
};

const Step = ({ step, index, total }) => {
    return (
        <div
            className={`sticky top-0 h-screen flex items-center justify-center overflow-hidden border-t border-[#009299]/20 bg-gradient-to-b ${step.color} shadow-[0_-10px_40px_-15px_rgba(0,146,153,0.1)]`}
        >
            {/* Ambient Animated Gradient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-40 mix-blend-multiply"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, ${step.gradientStart}, transparent 70%)`
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 w-full h-full opacity-30 mix-blend-multiply"
                    style={{
                        background: `radial-gradient(circle at 100% 100%, ${step.gradientEnd}, transparent 60%)`
                    }}
                />
            </div>

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={BACKGROUND_NOISE} />

            <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Big Number with Enhanced Typography */}
                <div className="relative flex justify-center md:justify-end md:pr-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <h2
                            className="text-[25vw] md:text-[20vw] leading-none font-serif select-none text-transparent bg-clip-text bg-gradient-to-br from-[#009299]/20 to-transparent"
                            style={{ WebkitTextStroke: '1px rgba(0, 146, 153, 0.1)' }}
                        >
                            {step.id}
                        </h2>
                        {/* Decorative Circle behind number */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-[#009299]/5 -z-10"
                        />
                    </motion.div>
                </div>

                {/* Right: Content with enhanced styling */}
                <div className="flex flex-col justify-center space-y-8 relative z-20 items-center md:items-start text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                            <span
                                className="text-xs uppercase tracking-[0.4em] font-bold px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#009299]/10 shadow-sm"
                                style={{ color: step.accent }}
                            >
                                Hapi {step.id}
                            </span>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: 60 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="h-[1px] bg-[#009299]/40"
                            />
                        </div>

                        <h3 className="text-5xl md:text-7xl font-serif text-[#2D2D2D] mb-6 tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-xl md:text-2xl font-light text-[#2D2D2D]/70 leading-relaxed max-w-lg">
                            {step.description}
                        </p>

                        {/* Interactive 'Learn More' hint or decorative element */}
                        <div className="mt-8 pt-8 border-t border-[#009299]/10 w-full max-w-xs md:max-w-md opacity-60">
                            <div className="flex justify-between items-center text-xs font-medium text-[#009299] tracking-widest uppercase">
                                <span>Aldo Dent Process</span>
                                <span>{index + 1} / {total}</span>
                            </div>
                        </div>

                    </motion.div>
                </div>

            </div>
        </div>
    )
}

export default SignatureProcess;
