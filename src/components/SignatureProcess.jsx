import React, { useRef } from 'react';
import { motion as Motion } from 'framer-motion';

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
    const [isMobile, setIsMobile] = React.useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section ref={containerRef} className="relative bg-[#1e3a8a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {STEPS.map((step, index) => (
                <Step key={index} step={step} index={index} total={STEPS.length} isMobile={isMobile} />
            ))}
        </section>
    );
};

const STEP_WAVES = [
    {
        paths: [
            "M-200 800 Q 200 600, 500 700 T 1000 600 T 1600 400",
            "M-200 850 Q 250 650, 600 750 T 1100 620 T 1700 350",
            "M-200 900 Q 300 700, 700 800 T 1200 640 T 1800 300",
            "M-200 950 Q 350 750, 800 850 T 1300 660 T 1900 250"
        ],
        lines: [500, 800, 1100]
    },
    {
        paths: [
            "M-200 700 Q 200 800, 600 650 T 1100 750 T 1600 500",
            "M-200 750 Q 250 850, 650 700 T 1150 800 T 1700 450",
            "M-200 800 Q 300 900, 700 750 T 1200 850 T 1800 400",
            "M-200 850 Q 350 950, 750 800 T 1250 900 T 1900 350"
        ],
        lines: [400, 700, 1000, 1300]
    },
    {
        paths: [
            "M-200 300 Q 300 500, 700 400 T 1200 600 T 1600 800",
            "M-200 350 Q 350 550, 750 450 T 1250 650 T 1700 850",
            "M-200 400 Q 400 600, 800 500 T 1300 700 T 1800 900",
            "M-200 450 Q 450 650, 850 550 T 1350 750 T 1900 950"
        ],
        lines: [600, 900, 1200]
    },
    {
        paths: [
            "M-200 850 Q 200 750, 500 850 T 900 750 T 1600 850",
            "M-200 900 Q 250 800, 550 900 T 950 800 T 1700 900",
            "M-200 950 Q 300 850, 600 950 T 1000 850 T 1800 950",
            "M-200 1000 Q 350 900, 650 1000 T 1050 900 T 1900 1000"
        ],
        lines: [300, 600, 900, 1200]
    }
];

const Step = ({ step, index, total, isMobile }) => {
    // Each step gets progressively darker
    const bgShades = ['bg-[#1e3a8a]', 'bg-[#172554]', 'bg-[#0f172a]', 'bg-[#020617]'];

    return (
        <div
            className={`sticky top-0 h-screen flex items-center justify-center overflow-hidden border-t border-white/5 ${bgShades[index] || 'bg-[#1e3a8a]'}`}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-white/[0.02] rounded-full blur-[100px]" />

                {/* Topographic Wave Field */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
                    <path d={STEP_WAVES[index]?.paths[0]} stroke="white" strokeWidth="0.8" />
                    <path d={STEP_WAVES[index]?.paths[1]} stroke="white" strokeWidth="0.6" />
                    <path d={STEP_WAVES[index]?.paths[2]} stroke="white" strokeWidth="0.5" />
                    <path d={STEP_WAVES[index]?.paths[3]} stroke="white" strokeWidth="0.4" />
                    {STEP_WAVES[index]?.lines.map((x, i) => (
                        <line key={i} x1={x} y1="0" x2={x + 200} y2="1200" stroke="white" strokeWidth="0.15" strokeDasharray="8 16" />
                    ))}
                </svg>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Big Number */}
                <div className="relative flex items-center justify-center">
                    <Motion.div
                        initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={isMobile ? { duration: 0 } : { duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex items-center justify-center"
                    >
                        <h2
                            className="text-[40vw] md:text-[20vw] leading-none font-light select-none text-transparent"
                            style={{ WebkitTextStroke: '1px #9dd4eb' }}
                        >
                            {step.id}
                        </h2>
                        <Motion.div
                            initial={isMobile ? { scale: 1 } : { scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={isMobile ? { duration: 0 } : { duration: 1.2, delay: 0.2, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-white/5 -z-10"
                        />
                    </Motion.div>
                </div>

                {/* Right: Content */}
                <div className="flex flex-col justify-center space-y-8 relative z-20 items-center md:items-start text-center md:text-left">
                    <Motion.div
                        initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={isMobile ? { duration: 0 } : { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                            <span className="text-xs uppercase tracking-[0.3em] font-bold px-4 py-2 rounded-full bg-white/5 border border-white/10 text-teal-300">
                                Hapi {step.id}
                            </span>
                            <Motion.div
                                initial={isMobile ? { width: 60 } : { width: 0 }}
                                whileInView={{ width: 60 }}
                                viewport={{ once: true }}
                                transition={isMobile ? { duration: 0 } : { duration: 0.8, delay: 0.4 }}
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
                    </Motion.div>
                </div>

            </div>
        </div>
    );
};

export default SignatureProcess;
