import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, ArrowUpRight } from 'lucide-react';
import logoWhite from '../assets/img/logowhite.png';

const FOOTER_LINKS = [
    {
        title: "Navigimi",
        links: [
            { name: "Shërbimet", to: "/services" },
            { name: "Galeria", to: "/gallery" },
            { name: "Rreth Nesh", to: "/about" },
            { name: "Rezervo", to: "/booking" },
            { name: "Kontakti", to: "/contact" },
        ]
    },
    {
        title: "Shërbime",
        links: [
            { name: "Kirurgji", to: "/services" },
            { name: "Implantologji", to: "/services" },
            { name: "Estetikë", to: "/services" },
            { name: "Parodontologji", to: "/services" },
            { name: "Ortodonci", to: "/services" },
            { name: "Endodonci", to: "/services" },
            { name: "Mbushje Estetike", to: "/services" },
        ]
    }
];

const SOCIALS = [
    { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    { icon: <Facebook size={18} />, href: "#", label: "Facebook" },
];

const Footer = () => {
    return (
        <footer className="bg-[#172554] text-white relative overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-[-30%] left-[-10%] w-[50vw] h-[50vw] bg-[#1e3a8a]/10 rounded-full blur-[120px]" />

                {/* Horizon Waves */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMid slice" fill="none">
                    {/* Bottom horizon lines */}
                    <path d="M0 350 Q 360 300, 720 340 T 1440 320" stroke="white" strokeWidth="0.7" />
                    <path d="M0 380 Q 360 340, 720 370 T 1440 355" stroke="white" strokeWidth="0.45" />
                    <path d="M0 410 Q 360 380, 720 400 T 1440 390" stroke="white" strokeWidth="0.25" />
                    {/* Top-right ring cluster */}
                    <circle cx="1250" cy="80" r="50" stroke="white" strokeWidth="0.35" />
                    <circle cx="1250" cy="80" r="80" stroke="white" strokeWidth="0.2" />
                    {/* Subtle guide line */}
                    <line x1="0" y1="150" x2="1440" y2="150" stroke="white" strokeWidth="0.1" strokeDasharray="6 14" />
                </svg>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-8">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12 md:gap-8 pb-16 border-b border-white/10 text-center md:text-left">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start flex-1">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <img src={logoWhite} alt="Aldo Dent Logo" className="h-10 md:h-12 w-auto object-contain drop-shadow-md" />
                            <span className="text-xl md:text-2xl font-bold text-white drop-shadow-md">Aldo Dent</span>
                        </Link>
                        <p className="text-white/40 font-light leading-relaxed max-w-xs mb-8 text-sm">
                            Klinika dentare ku arti takohet me shkencën. Buzëqeshja juaj, misioni ynë.
                        </p>
                        <div className="space-y-3 w-full flex flex-col items-center md:items-start">
                            <a href="tel:+38344231769" className="flex items-center justify-center md:justify-start gap-3 w-full text-white/60 hover:text-white transition-colors text-sm">
                                <Phone size={15} />
                                044 231 769
                            </a>
                            <a href="mailto:dentaltourism.aldo@gmail.com" className="flex items-center justify-center md:justify-start gap-3 w-full text-white/60 hover:text-white transition-colors text-sm">
                                <Mail size={15} />
                                dentaltourism.aldo@gmail.com
                            </a>
                            <span className="flex items-center justify-center md:justify-start gap-3 w-full text-white/60 text-sm">
                                <MapPin size={15} />
                                Gjilan, Kosovë
                            </span>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {FOOTER_LINKS.map((col, i) => (
                        <div key={i} className="flex flex-col items-center md:items-start">
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300 mb-6">{col.title}</h4>
                            <ul className="space-y-3 flex flex-col items-center md:items-start">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <Link
                                            to={link.to}
                                            className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1 group"
                                        >
                                            {link.name}
                                            <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-teal-300" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 pt-8 text-center md:text-left">
                    <div className="flex flex-col gap-2 items-center md:items-start text-white/30 text-xs">
                        <span>© {new Date().getFullYear()} Aldo Dent. Të gjitha të drejtat e rezervuara.</span>
                        <span className="flex items-center opacity-80">
                            Mundësuar nga
                            <a
                                href="https://arthalimi.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1.5 font-bold text-[#ffffff] text-[15px] sm:text-sm hover:text-white transition-colors"
                            >
                                Art Halimi
                            </a>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {SOCIALS.map((s, i) => (
                            <a
                                key={i}
                                href={s.href}
                                aria-label={s.label}
                                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
