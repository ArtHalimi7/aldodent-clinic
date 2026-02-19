import React, { useRef, useState, useEffect } from 'react';
import { motion as Motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { mdiTooth } from '@mdi/js';



const SERVICES = [
    {
        title: "Implantologji",
        subtitle: "Digitale",
        image: "https://images.unsplash.com/photo-1629909613638-0e4a1fad8f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkZW50YWwlMjBjbGluaWMlMjBpbnRlcmlvciUyMG1pbmltYWxpc3QlMjBsdXh1cnklMjB3aGl0ZSUyMG1lZGljYWwlMjBhcmNoaXRlY3R1cmUlMjBzbWlsZSUyMGFlc3RoZXRpY3xlbnwxfHx8fDE3NzExNjYyNDV8MA&ixlib=rb-4.1.0&q=80&w=800",
        description: "Saktësi absolute përmes planifikimit 3D dhe teknologjisë robotike.",
        id: "01"
    },
    {
        title: "Estetikë",
        subtitle: "Dentare",
        image: "https://images.unsplash.com/photo-1660300110666-9ff243d1328a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBzbWlsZSUyMGNsb3NldXAlMjBsdXh1cnklMjB3aGl0ZSUyMG1pbmltYWxpc20lMjB0b290aCUyMGRlbnRpc3R8ZW58MXx8fHwxNzcxMTY2MjQ1fDA&ixlib=rb-4.1.0&q=80&w=800",
        description: "Faseta porcelani të punuara me dorë për një buzëqeshje natyrale dhe rrezatuese.",
        id: "02"
    },
    {
        title: "Ortodonci",
        subtitle: "Invi-Art",
        image: "https://images.unsplash.com/photo-1648775507324-b48dd3791fa5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkZW50YWwlMjBjbGluaWMlMjBjbGluaWMlMjBtYXJibGUlMjBtaW5pbWFsaXN0JTIwaGlnaCUyMGVuZCUyMGludGVyaW9yfGVufDF8fHx8MTc3MTE2NjI0NXww&ixlib=rb-4.1.0&q=80&w=800",
        description: "Rregullimi i dhëmbëve me aparate të padukshme, pa kompromentuar stilin tuaj të jetës.",
        id: "03"
    }
];

export const HorizontalParallax = () => {
    const targetRef = useRef(null);
    const scrollRef = useRef(null);
    const [scrollRange, setScrollRange] = useState(0);

    useEffect(() => {
        let timeoutId;
        const updateScrollRange = () => {
            if (scrollRef.current) {
                setScrollRange(scrollRef.current.scrollWidth - window.innerWidth);
            }
        };

        const debouncedUpdate = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateScrollRange, 100);
        };

        updateScrollRange();
        window.addEventListener('resize', debouncedUpdate);
        return () => {
            window.removeEventListener('resize', debouncedUpdate);
            clearTimeout(timeoutId);
        };
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Horizontal scroll calculation
    const x = useTransform(scrollYProgress, [0, 0.85, 1], ["0px", `-${scrollRange}px`, `-${scrollRange}px`]);
    const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Dynamic Clip Path Calculation for Continuous Color Change
    const borderPoint = useTransform(scrollYProgress, [0, 0.85, 1], [scrollRange, 0, 0]);
    const smoothBorderPoint = useSpring(borderPoint, { stiffness: 100, damping: 30, restDelta: 0.001 });
    const clipPath = useMotionTemplate`inset(0 0 0 ${smoothBorderPoint}px)`;
    // Using mdiTooth for a single-line contour path
    const toothIcon = mdiTooth;

    return (
        <section ref={targetRef} className="relative md:h-[400vh] bg-[#F5FBFB]">
            {/* MOBILE LAYOUT (Static Vertical Cards) */}
            <div className="md:hidden py-20 px-6 space-y-24">
                <div className="flex items-center gap-4 mb-12">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#2596be]">Ekspertiza Jonë</span>
                    <div className="h-[1px] w-12 bg-[#2596be]" />
                </div>

                {SERVICES.map((service, index) => (
                    <div key={index} className="flex flex-col gap-6">
                        <div className="relative aspect-[4/5] w-full overflow-hidden">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-4xl font-serif text-[#2D2D2D] mb-3">
                                {service.title} <span className="italic text-[#2596be] block">{service.subtitle}</span>
                            </h3>
                            <p className="text-lg font-light text-[#2D2D2D]/70 leading-relaxed">
                                {service.description}
                            </p>
                            <div className="absolute -top-16 right-0 text-8xl font-serif text-[#2596be]/5 select-none -z-10">
                                {service.id}
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-12 text-center border-t border-[#2596be]/10">
                    <h2 className="text-5xl leading-tight font-serif mb-8 text-[#2D2D2D]">
                        Perfeksioni <br /> <span className="italic text-[#2596be]">është Standard.</span>
                    </h2>
                    <button className="px-8 py-4 border border-[#2596be]/20 rounded-full hover:bg-[#2596be] hover:text-white transition-all duration-300 uppercase tracking-widest text-xs font-bold text-[#2596be]">
                        Shih të gjitha shërbimet
                    </button>
                </div>
            </div>

            {/* DESKTOP LAYOUT (Horizontal Parallax) */}
            <div className="hidden md:flex sticky top-0 h-screen flex-col justify-center overflow-hidden">

                {/* Section Header */}
                <div className="absolute top-12 left-6 md:left-12 z-20">
                    <Motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4"
                    >
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#2596be]">Ekspertiza Jonë</span>
                        <div className="h-[1px] w-12 bg-[#2596be]" />
                    </Motion.div>
                </div>

                <Motion.div
                    ref={scrollRef}
                    style={{ x: smoothX, willChange: "transform" }}
                    className="flex items-center pl-[10vw]"
                >
                    {SERVICES.map((service, index) => (
                        <div
                            key={index}
                            className="group relative h-[70vh] w-[85vw] md:w-[60vw] lg:w-[45vw] flex-shrink-0 mr-[10vw] flex flex-col justify-end pb-12"
                        >
                            {/* Number Background */}
                            <div className="absolute -top-20 -left-10 text-[15vw] font-serif leading-none text-[#2596be] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] select-none z-0 mix-blend-multiply opacity-10">
                                {service.id}
                            </div>

                            {/* Image Container with Parallax Internal */}
                            <div className="relative h-[80%] w-full overflow-hidden z-10">
                                <Motion.div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${service.image})`,
                                        scale: 1.2
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                            </div>

                            {/* Content */}
                            <div className="relative z-20 mt-8 pl-4 border-l-2 border-[#2596be]/20 group-hover:border-[#2596be] transition-colors duration-500">
                                <h3 className="text-4xl md:text-6xl font-serif text-[#2D2D2D] mb-4">
                                    {service.title} <span className="italic text-[#2596be]">{service.subtitle}</span>
                                </h3>
                                <p className="text-lg font-light text-[#2D2D2D]/70 max-w-sm">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Final Statement */}
                    <div className="flex-shrink-0 w-[100vw] h-screen flex items-center justify-center bg-[#2596be] text-white ml-[-10vw]">
                        <div className="text-center px-6">
                            <h2 className="text-[10vw] leading-[0.9] font-serif mb-8">
                                Perfeksioni <br /> <span className="italic text-teal-300">është Standard.</span>
                            </h2>
                            <button className="px-12 py-4 border border-white/20 rounded-full hover:bg-white hover:text-[#2596be] transition-all duration-500 uppercase tracking-widest text-sm font-bold">
                                Shih të gjitha shërbimet
                            </button>
                        </div>
                    </div>

                </Motion.div>

                {/* Tooth Drawing Scroll Animation - Dark Layer (Base) */}
                <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none z-30">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                        <path
                            d={toothIcon}
                            className="stroke-[#2596be]/20"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Motion.path
                            d={toothIcon}
                            className="stroke-[#2596be] fill-[#2596be]"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ pathLength: scrollYProgress, fillOpacity: scrollYProgress }}
                        />
                    </svg>
                </div>

                {/* Tooth Drawing Scroll Animation - White Layer (Clipped Overlay) */}
                <Motion.div
                    className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none z-40"
                    style={{ clipPath }}
                >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                        <path
                            d={toothIcon}
                            className="stroke-white/20"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Motion.path
                            d={toothIcon}
                            className="stroke-white fill-white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ pathLength: scrollYProgress, fillOpacity: scrollYProgress }}
                        />
                    </svg>
                </Motion.div>
            </div>
        </section >
    );
};

export default HorizontalParallax;