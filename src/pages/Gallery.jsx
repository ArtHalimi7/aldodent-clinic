import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ───────────────────────── DATA ───────────────────────── */

const CATEGORIES = ["Të gjitha", "Cosmetic", "Surgery", "Aesthetics", "Orthodontics", "Digital", "Kids"];

const PROJECTS = [
    {
        title: "Veneers Porcelain",
        category: "Cosmetic",
        src: "https://www.shiningsmiles.com/wp-content/uploads/2025/05/chatgpt-image-may-30-2025-02_43_53-pm-1024x675.png",
        description: "Transformimi i plotë i buzëqeshjes me fasetat më të holla të porcelanit në treg."
    },
    {
        title: "Full Rehabilitation",
        category: "Surgery",
        src: "https://www.smilecraftdentalimplantcentre.com/wp-content/uploads/2022/02/fmc-dental-clinic-background-1.png",
        description: "Rindërtimi total i funksionit dhe estetikës përmes implantologjisë së avancuar."
    },
    {
        title: "Whitening Pro",
        category: "Aesthetics",
        src: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=2670&auto=format&fit=crop",
        description: "Zbardhje profesionale me laser për një buzëqeshje rrezatuese brenda 45 minutave."
    },
    {
        title: "Invisible Ortho",
        category: "Orthodontics",
        src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2574&auto=format&fit=crop",
        description: "Drejtimi i dhëmbëve me aligner transparentë, krejtësisht të padukshëm."
    },
    {
        title: "Dental Implants",
        category: "Surgery",
        src: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=2670&auto=format&fit=crop",
        description: "Zëvendësimi i dhëmbëve të munguar me materiale biokompatibile të teknologjisë fundit."
    },
    {
        title: "Smile Design",
        category: "Digital",
        src: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=2670&auto=format&fit=crop",
        description: "Planifikimi digjital i buzëqeshjes suaj të ardhshme para se të fillojmë punën."
    },
    {
        title: "Pediatric Care",
        category: "Kids",
        src: "https://www.safarismilesok.com/wp-content/uploads/2024/07/Untitled-design-3.jpg",
        description: "Kujdes i butë dhe miqësor për buzëqeshjet e vogla, duke krijuar zakone të shëndetshme."
    },
];

const STATS = [
    { number: "100%", label: "Kënaqësi e Garantuar" },
    { number: "5,000+", label: "Buzëqeshje të Krijuara" },
    { number: "15+", label: "Vite Eksperiencë" },
];

/* ───────────────────── MAIN COMPONENT ─────────────────── */

export default function Gallery() {
    const [activeFilter, setActiveFilter] = useState("Të gjitha");

    const filtered = activeFilter === "Të gjitha"
        ? PROJECTS
        : PROJECTS.filter(p => p.category === activeFilter);

    return (
        <div className="min-h-screen bg-[#1e3a8a] text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Helmet>
                <title>Galeria — AldoDent | Punimet Tona Dentare</title>
                <meta name="description" content="Shikoni galerin e punimeve tona dentare: faseta, implante, zbardhje, ortodonci dhe më shumë. Rezultate reale nga pacientët tanë." />
                <link rel="canonical" href="https://aldodent.netlify.app/gallery" />
            </Helmet>

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#172554]/30 rounded-full blur-[120px]" />

                {/* Flowing Wave System */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 1200" preserveAspectRatio="xMidYMid slice" fill="none">
                    {/* Cascading S-curves */}
                    <path d="M-50 200 C 200 100, 400 300, 600 200 S 1000 100, 1500 200" stroke="white" strokeWidth="0.8" />
                    <path d="M-50 260 C 200 160, 400 360, 600 260 S 1000 160, 1500 260" stroke="white" strokeWidth="0.5" />
                    <path d="M-50 310 C 200 210, 400 410, 600 310 S 1000 210, 1500 310" stroke="white" strokeWidth="0.3" />
                    <path d="M-50 700 C 300 600, 500 800, 700 700 S 1100 600, 1500 700" stroke="white" strokeWidth="0.7" />
                    <path d="M-50 760 C 300 660, 500 860, 700 760 S 1100 660, 1500 760" stroke="white" strokeWidth="0.4" />
                    {/* Fine dot grid — gallery mood */}
                    {[200, 400, 600, 800, 1000, 1200].map(x =>
                        [100, 300, 500, 700, 900, 1100].map(y => (
                            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill="white" opacity="0.3" />
                        ))
                    )}
                </svg>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-20">

                {/* Page Title */}
                <div className="mb-14">
                    <Motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-teal-300 font-bold tracking-[0.2em] uppercase text-xs mb-3 block"
                    >
                        Portfolio
                    </Motion.span>
                    <Motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-light tracking-tight mb-4"
                    >
                        Kryeveprat Dentare
                    </Motion.h1>
                    <Motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl text-lg font-light"
                    >
                        Një koleksion i transformimeve që ripërcaktojnë standardet e estetikës dhe funksionit.
                    </Motion.p>
                </div>

                {/* Filter Tabs */}
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 mb-10"
                >
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                                ${activeFilter === cat
                                    ? 'bg-white text-[#1e3a8a]'
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </Motion.div>

                {/* Gallery Grid */}
                <Motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((project, i) => (
                            <Motion.div
                                key={project.title}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 aspect-[4/3] cursor-pointer"
                            >
                                <img
                                    src={project.src}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-1.5 block">{project.category}</span>
                                        <h3 className="text-xl font-medium text-white mb-1.5">{project.title}</h3>
                                        <p className="text-sm text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-2">{project.description}</p>
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </AnimatePresence>
                </Motion.div>

                {/* Stats */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 mb-20"
                >
                    {STATS.map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                            <span className="text-4xl md:text-5xl font-light text-white block mb-2">{stat.number}</span>
                            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </Motion.div>

                {/* CTA */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12"
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-light mb-2">Filloni transformimin tuaj</h2>
                        <p className="text-white/50 font-light">Konsulta e parë është falas. Rezervoni online tani.</p>
                    </div>
                    <Link to="/booking">
                        <button className="bg-white text-[#1e3a8a] px-10 py-4 rounded-full font-medium flex items-center gap-3 hover:bg-teal-50 transition-all shadow-lg shadow-black/10 shrink-0">
                            Rezervo Termin
                            <ArrowRight size={18} />
                        </button>
                    </Link>
                </Motion.div>
            </div>
        </div>
    );
}
