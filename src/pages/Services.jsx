import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ───────────────────────── DATA ───────────────────────── */

const CATEGORIES = [
    {
        id: 'kirurgji',
        title: "Kirurgji",
        services: [
            { name: "Ekstraksione", duration: "30–60 min", price: "Nga €30", desc: "Heqje e dhëmbëve problematik ose dhëmbëve të mençurisë me teknika minimalisht invazive." },
            { name: "Kirurgji Orale", duration: "60–90 min", price: "Sipas rastit", desc: "Ndërhyrje kirurgjikale të avancuara për raste komplekse të kavitetit oral." },
            { name: "Sinus Lift", duration: "90 min", price: "Sipas rastit", desc: "Ngritja e sinusit maksilar për mundësimin e vendosjes së implanteve dentare." },
        ]
    },
    {
        id: 'implantologji',
        title: "Implantologji",
        services: [
            { name: "Konsultë për Implant", duration: "45 min", price: "Falas", desc: "Vlerësim me CBCT dhe plan trajtimi 3D për implante dentare." },
            { name: "Implant Dentar", duration: "60–90 min", price: "Nga €500", desc: "Zëvendësim i dhëmbëve me implante titanium biokompatibile Zvicerane." },
            { name: "All-on-4 / All-on-6", duration: "2–3 orë", price: "Sipas rastit", desc: "Zgjidhje e plotë protetike mbi 4 ose 6 implante për nofullën e plotë." },
        ]
    },
    {
        id: 'estetike',
        title: "Estetikë: Kurora Zirkoni – Kurora Emax",
        services: [
            { name: "Kurora Zirkoni", duration: "2 seanca", price: "Nga €200/copë", desc: "Kurora me rezistencë të lartë dhe estetikë natyrale, ideale për dhëmbët e pasmë." },
            { name: "Kurora E-max", duration: "2 seanca", price: "Nga €250/copë", desc: "Kurora porcelani me transparencë superiore, perfekte për dhëmbët e përparmë." },
            { name: "Faseta Qeramike", duration: "2 seanca", price: "Nga €200/copë", desc: "Fasetat më të holla në treg, për një buzëqeshje perfekte hollywoodiane." },
            { name: "Digital Smile Design", duration: "45 min", price: "Falas", desc: "Planifikimi digjital i buzëqeshjes suaj të ardhshme para fillimit të trajtimit." },
        ]
    },
    {
        id: 'parodontologji',
        title: "Parodontologji",
        services: [
            { name: "Pastrim Profesional", duration: "45 min", price: "€30", desc: "Heqja e gurit dentar dhe lustrim profesional i dhëmbëve." },
            { name: "Trajtim Parodontal", duration: "45–60 min", price: "Nga €50", desc: "Trajtim i thellë i mishrave të dhëmbëve dhe pastrimi nën-gingival." },
            { name: "Kirurgji Parodontale", duration: "60–90 min", price: "Sipas rastit", desc: "Ndërhyrje kirurgjikale për rastet e avancuara të sëmundjeve parodontale." },
        ]
    },
    {
        id: 'ortodonci',
        title: "Ortodonci",
        services: [
            { name: "Konsultë Ortodoncie", duration: "30 min", price: "Falas", desc: "Vlerësim i okluzionit dhe planifikimi i drejtimit të dhëmbëve." },
            { name: "Aparate Fikse", duration: "12–24 muaj", price: "Nga €800", desc: "Aparate metalike ose qeramike për drejtim preciz të dhëmbëve." },
            { name: "Invisalign / Aligners", duration: "6–18 muaj", price: "Nga €1200", desc: "Aligners transparentë, krejtësisht të padukshëm dhe komfortabël." },
        ]
    },
    {
        id: 'endodonci',
        title: "Endodonci",
        services: [
            { name: "Trajtim i Kanalit", duration: "60–90 min", price: "Nga €80", desc: "Trajtim endodontik me teknika moderne pa dhimbje." },
            { name: "Ritrajtim Endodontik", duration: "90 min", price: "Nga €120", desc: "Ritrajtimi i dhëmbëve me trajtime të mëparshme të pasuksesshme." },
            { name: "Apikoektomi", duration: "60 min", price: "Nga €100", desc: "Heqje kirurgjikale e majës së rrënjës së dhëmbit të infektuar." },
        ]
    },
    {
        id: 'mbushje',
        title: "Mbushje Estetike",
        services: [
            { name: "Mbushje Kompozite", duration: "30 min", price: "Nga €40", desc: "Restaurime me materiale kompozite që përputhen me ngjyrën natyrale të dhëmbit." },
            { name: "Inlay / Onlay", duration: "2 seanca", price: "Nga €150", desc: "Restaurime indirekte qeramike për kariese të mëdha me precizion të lartë." },
            { name: "Bonding Dentar", duration: "45 min", price: "Nga €60", desc: "Riparimi i dhëmbëve të thyer ose me hapësira me rrëshirë kompozite." },
        ]
    }
];

/* ───────────── EXPANDABLE CATEGORY COMPONENT ─────────── */

function ServiceCategory({ category, isOpen, onToggle }) {
    const totalServices = category.services.length;

    return (
        <div className="border-b border-white/10 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-6 px-6 text-left group transition-colors hover:bg-white/[0.02]"
            >
                <div className="flex items-center gap-6">
                    <h3 className="text-xl md:text-2xl font-light text-white group-hover:text-teal-300 transition-colors">{category.title}</h3>
                    <span className="text-xs text-white/30 font-medium">{totalServices} shërbime</span>
                </div>
                <ChevronDown size={20} className={`text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal-300' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <Motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 space-y-2 px-6">
                            {category.services.map((srv, i) => (
                                <div
                                    key={i}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.08] transition-colors group"
                                >
                                    <div className="flex-1">
                                        <h4 className="text-lg font-medium text-white mb-1">{srv.name}</h4>
                                        <p className="text-sm text-white/40 leading-relaxed">{srv.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                        <span className="text-xs text-white/30 font-medium">{srv.duration}</span>
                                        <span className="text-sm font-medium text-teal-300 min-w-[80px] text-right">{srv.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ───────────────────── MAIN COMPONENT ─────────────────── */

export default function Services() {
    const [openCategory, setOpenCategory] = useState('kirurgji');

    const handleToggle = (id) => {
        setOpenCategory(openCategory === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[#2596be] text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Helmet>
                <title>Shërbimet — AldoDent | Shërbime Dentare Premium</title>
                <meta name="description" content="Kirurgji, implantologji, estetikë dentare, parodontologji, ortodonci, endodonci dhe mbushje estetike. Shërbime dentare premium në AldoDent Prishtinë." />
                <link rel="canonical" href="https://aldodent.netlify.app/services" />
            </Helmet>

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#196384]/30 rounded-full blur-[120px]" />

                {/* Structured Mesh & Flow */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 1440 1200" preserveAspectRatio="xMidYMid slice" fill="none">
                    {/* Horizontal flow bands */}
                    <path d="M0 250 Q 360 200, 720 250 T 1440 230" stroke="white" strokeWidth="0.7" />
                    <path d="M0 280 Q 360 240, 720 280 T 1440 265" stroke="white" strokeWidth="0.4" />
                    <path d="M0 650 Q 400 600, 800 650 T 1440 630" stroke="white" strokeWidth="0.6" />
                    <path d="M0 680 Q 400 640, 800 680 T 1440 665" stroke="white" strokeWidth="0.35" />
                    {/* Vertical rhythm guides */}
                    <line x1="360" y1="0" x2="360" y2="1200" stroke="white" strokeWidth="0.15" strokeDasharray="6 12" />
                    <line x1="720" y1="0" x2="720" y2="1200" stroke="white" strokeWidth="0.15" strokeDasharray="6 12" />
                    <line x1="1080" y1="0" x2="1080" y2="1200" stroke="white" strokeWidth="0.15" strokeDasharray="6 12" />
                    {/* Anchor circles at intersections */}
                    <circle cx="360" cy="250" r="4" stroke="white" strokeWidth="0.5" />
                    <circle cx="720" cy="250" r="4" stroke="white" strokeWidth="0.5" />
                    <circle cx="720" cy="650" r="4" stroke="white" strokeWidth="0.5" />
                    <circle cx="1080" cy="650" r="4" stroke="white" strokeWidth="0.5" />
                    {/* Large decorative arc */}
                    <path d="M1200 0 A 300 300 0 0 1 1440 300" stroke="white" strokeWidth="0.3" />
                    <path d="M1250 0 A 250 250 0 0 1 1440 250" stroke="white" strokeWidth="0.2" />
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
                        Ekspertiza Jonë
                    </Motion.span>
                    <Motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-light tracking-tight mb-4"
                    >
                        Shërbimet Tona
                    </Motion.h1>
                    <Motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl text-lg font-light"
                    >
                        Ne kombinojmë teknologjinë më të fundit me pasionin për detajet për të ofruar trajtime që tejkalojnë pritshmëritë tuaja.
                    </Motion.p>
                </div>

                {/* Service Categories */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/[0.08] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm"
                >
                    {CATEGORIES.map((cat) => (
                        <ServiceCategory
                            key={cat.id}
                            category={cat}
                            isOpen={openCategory === cat.id}
                            onToggle={() => handleToggle(cat.id)}
                        />
                    ))}
                </Motion.div>

                {/* Process Section */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-20"
                >
                    <span className="text-teal-300 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Si Funksionon</span>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Procesi ynë i thjeshtë</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { step: "01", title: "Konsulta", text: "Vlerësim i detajuar i gjendjes suaj orale dhe diskutim i nevojave." },
                            { step: "02", title: "Planifikimi", text: "Hartimi i planit të personalizuar me alternativa dhe kostot." },
                            { step: "03", title: "Trajtimi", text: "Realizimi i procedurave me teknologji të fundit dhe komfort." },
                            { step: "04", title: "Mirëmbajtja", text: "Kontrolle periodike për të garantuar rezultate afatgjata." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-colors">
                                <span className="text-3xl font-light text-white/15 block mb-4">{item.step}</span>
                                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-white/40 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </Motion.div>

                {/* CTA */}
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12"
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-light mb-2">Gati për një buzëqeshje të re?</h2>
                        <p className="text-white/50 font-light">Konsulta e parë është falas. Rezervoni online tani.</p>
                    </div>
                    <Link to="/booking">
                        <button className="bg-white text-[#2596be] px-10 py-4 rounded-full font-medium flex items-center gap-3 hover:bg-teal-50 transition-all shadow-lg shadow-black/10 shrink-0">
                            Rezervo Termin
                            <ArrowRight size={18} />
                        </button>
                    </Link>
                </Motion.div>
            </div>
        </div>
    );
}
