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
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section ref={containerRef} className="relative bg-[#2596be]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {STEPS.map((step, index) => (
                <Step key={index} step={step} index={index} total={STEPS.length} isMobile={isMobile} />
            ))}
        </section>
    );
};

const Step = ({ step, index, total, isMobile }) => {
    // Each step gets progressively darker
    const bgShades = ['bg-[#2596be]', 'bg-[#208bb3]', 'bg-[#1b7da0]', 'bg-[#166f8f]'];

    return (
        <div
            className={`sticky top-0 h-screen flex items-center justify-center overflow-hidden border-t border-white/5 ${bgShades[index] || 'bg-[#2596be]'}`}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-white/[0.02] rounded-full blur-[100px]" />

                {/* Radial Precision Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
                    {/* Concentric rings — center of gravity */}
                    <circle cx="720" cy="450" r="150" stroke="white" strokeWidth="0.4" />
                    <circle cx="720" cy="450" r="220" stroke="white" strokeWidth="0.3" />
                    <circle cx="720" cy="450" r="300" stroke="white" strokeWidth="0.2" />
                    <circle cx="720" cy="450" r="400" stroke="white" strokeWidth="0.15" strokeDasharray="8 12" />
                    {/* Guide curves sweeping across */}
                    <path d="M0 350 Q 360 250, 720 350 T 1440 300" stroke="white" strokeWidth="0.6" />
                    <path d="M0 550 Q 360 650, 720 550 T 1440 600" stroke="white" strokeWidth="0.6" />
                    {/* Cross-hair markers */}
                    <line x1="720" y1="300" x2="720" y2="600" stroke="white" strokeWidth="0.15" strokeDasharray="4 8" />
                    <line x1="570" y1="450" x2="870" y2="450" stroke="white" strokeWidth="0.15" strokeDasharray="4 8" />
                </svg>
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left: Big Number */}
                <div className="relative flex items-center justify-center">
                    <Motion.div
                        initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        whileInView={isMobile ? undefined : { opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex items-center justify-center"
                    >
                        <h2
                            className="text-[25vw] md:text-[20vw] leading-none font-light select-none text-transparent"
                            style={{ WebkitTextStroke: '1px #9dd4eb' }}
                        >
                            {step.id}
                        </h2>
                        <Motion.div
                            initial={isMobile ? { scale: 1 } : { scale: 0 }}
                            whileInView={isMobile ? undefined : { scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-white/5 -z-10"
                        />
                    </Motion.div>
                </div>

                {/* Right: Content */}
                <div className="flex flex-col justify-center space-y-8 relative z-20 items-center md:items-start text-center md:text-left">
                    <Motion.div
                        initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        whileInView={isMobile ? undefined : { opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                            <span className="text-xs uppercase tracking-[0.3em] font-bold px-4 py-2 rounded-full bg-white/5 border border-white/10 text-teal-300">
                                Hapi {step.id}
                            </span>
                            <Motion.div
                                initial={isMobile ? { width: 60 } : { width: 0 }}
                                whileInView={isMobile ? undefined : { width: 60 }}
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
                    </Motion.div>
                </div>

            </div>
        </div>
    );
};

export default SignatureProcess;
