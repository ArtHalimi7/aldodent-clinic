import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ───────────────────────── DATA ───────────────────────── */

const TEAM = [
    {
        name: "Dr. Arben Gashi",
        role: "Kirurg Oral",
        img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2670&auto=format&fit=crop",
        bio: "Specialist i kirurgjisë maksilofaciale me mbi 15 vite përvojë në implantologji.",
        specialties: ["Implantologji", "Kirurgji Maksilofaciale", "Bone Grafting"]
    },
    {
        name: "As. Vlora Berisha",
        role: "Higjeniste",
        img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2574&auto=format&fit=crop",
        bio: "Eksperte në parandalimin dhe mirëmbajtjen e shëndetit oral me kujdes maksimal.",
        specialties: ["Pastrim Profesional", "Parandalim", "Edukim Oral"]
    },
];

const VALUES = [
    { title: "Precizitet", text: "Çdo ndërhyrje bëhet me mikroskop dhe teknologji laserike për rezultate të sakta deri në mikron." },
    { title: "Estetikë", text: "Ne nuk krijojmë vetëm dhëmbë; ne dizajnojmë buzëqeshje që harmonizohen me anatominë tuaj faciale." },
    { title: "Eksperiencë", text: "Nga aroma e qetë tek muzika e përzgjedhur, çdo vizitë është një seancë relaksimi për ju." },
    { title: "Teknologji", text: "Përdorim paisje të gjeneratës së fundit, duke përfshirë CBCT, skanerë intraoral dhe laserë." },
];

const STATS = [
    { number: "15+", label: "Vite Eksperiencë" },
    { number: "5,000+", label: "Pacientë të Kënaqur" },
    { number: "100%", label: "Kënaqësi e Garantuar" },
    { number: "10+", label: "Specialistë" },
];

/* ───────────────────── MAIN COMPONENT ─────────────────── */

export default function About() {
    const [expandedMember, setExpandedMember] = useState(null);

    return (
        <div className="min-h-screen bg-[#2596be] text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#196384]/30 rounded-full blur-[120px]" />

                {/* Contour Map Overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 1200" preserveAspectRatio="xMidYMid slice" fill="none">
                    {/* Sweeping contour lines */}
                    <path d="M0 300 Q 360 200, 720 280 T 1440 220" stroke="white" strokeWidth="0.8" />
                    <path d="M0 340 Q 360 250, 720 320 T 1440 270" stroke="white" strokeWidth="0.6" />
                    <path d="M0 380 Q 360 300, 720 360 T 1440 320" stroke="white" strokeWidth="0.4" />
                    <path d="M0 700 Q 400 580, 800 680 T 1440 600" stroke="white" strokeWidth="0.7" />
                    <path d="M0 740 Q 400 630, 800 720 T 1440 650" stroke="white" strokeWidth="0.5" />
                    <path d="M0 780 Q 400 680, 800 760 T 1440 700" stroke="white" strokeWidth="0.3" />
                    {/* Concentric elevation rings — top right */}
                    <circle cx="1200" cy="150" r="60" stroke="white" strokeWidth="0.5" />
                    <circle cx="1200" cy="150" r="100" stroke="white" strokeWidth="0.35" />
                    <circle cx="1200" cy="150" r="140" stroke="white" strokeWidth="0.2" />
                    {/* Small detail cluster — bottom left */}
                    <circle cx="200" cy="1000" r="40" stroke="white" strokeWidth="0.4" />
                    <circle cx="200" cy="1000" r="70" stroke="white" strokeWidth="0.25" />
                </svg>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-20">

                {/* Page Title */}
                <div className="mb-14">
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-teal-300 font-bold tracking-[0.2em] uppercase text-xs mb-3 block"
                    >
                        Rreth Nesh
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-light tracking-tight mb-4"
                    >
                        Trashëgimia e Përsosmërisë
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl text-lg font-light"
                    >
                        Një hapësirë ku arti dhe shkenca takohen për të kuruar jo vetëm buzëqeshje, por edhe besim. Mirësevini në standardin e ri të stomatologjisë.
                    </motion.p>
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
                >
                    {STATS.map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                            <span className="text-3xl md:text-4xl font-light text-white block mb-1">{stat.number}</span>
                            <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Philosophy */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <span className="text-teal-300 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Filozofia Jonë</span>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Ne besojmë se çdo buzëqeshje tregon një histori unike.</h2>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 mt-8">
                        <p className="text-white/60 text-lg font-light leading-relaxed mb-6">
                            Që nga momenti kur hyni në klinikën tonë, ju do të ndjeni ndryshimin. Ne kemi zëvendësuar frikën me rehati, dhe procedurat klinike me përvoja estetike. Pasioni ynë për detajet na bën udhëheqës në fushën e stomatologjisë moderne.
                        </p>
                        <p className="text-white/60 text-lg font-light leading-relaxed">
                            Përkushtimi ynë ndaj ekselencës fillon me dëgjimin e nevojave tuaja dhe përfundon me një buzëqeshje që rrezaton vetëbesim. Përdorim teknologjitë më të fundit për të garantuar trajtime pa dhimbje dhe rezultate të qëndrueshme.
                        </p>
                    </div>
                </motion.div>

                {/* Values */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <span className="text-teal-300 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Vlerat Tona</span>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Çfarë na dallon</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {VALUES.map((val, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-colors">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl font-light text-white/15 shrink-0">0{i + 1}</span>
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-2">{val.title}</h3>
                                        <p className="text-sm text-white/40 leading-relaxed">{val.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Team */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <span className="text-teal-300 font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Ekipi</span>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-10">Talenti që bën diferencën</h2>

                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                        {TEAM.map((member, i) => (
                            <div key={i} className="border-b border-white/10 last:border-b-0">
                                <button
                                    onClick={() => setExpandedMember(expandedMember === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left group hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="flex items-center gap-5">
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                                        />
                                        <div>
                                            <h3 className="text-xl font-medium text-white group-hover:text-teal-300 transition-colors">{member.name}</h3>
                                            <span className="text-sm text-white/40">{member.role}</span>
                                        </div>
                                    </div>
                                    <ChevronDown size={20} className={`text-white/40 transition-transform duration-300 ${expandedMember === i ? 'rotate-180 text-teal-300' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {expandedMember === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                                                <img
                                                    src={member.img}
                                                    alt={member.name}
                                                    className="w-full aspect-[3/4] object-cover rounded-2xl hidden md:block"
                                                />
                                                <div>
                                                    <p className="text-white/60 leading-relaxed mb-6">{member.bio}</p>
                                                    <div>
                                                        <span className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-3 block">Specializimet</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {member.specialties.map((s, j) => (
                                                                <span key={j} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-white/60">{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12"
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-light mb-2">Dëshironi të na vizitoni?</h2>
                        <p className="text-white/50 font-light">Rezervoni konsultën tuaj falas sot.</p>
                    </div>
                    <Link to="/booking">
                        <button className="bg-white text-[#2596be] px-10 py-4 rounded-full font-medium flex items-center gap-3 hover:bg-teal-50 transition-all shadow-lg shadow-black/10 shrink-0">
                            Rezervo Termin
                            <ArrowRight size={18} />
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
