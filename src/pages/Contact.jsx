import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, Check } from 'lucide-react';

/* ───────────────────────── DATA ───────────────────────── */

const CONTACT_INFO = [
    { icon: <Phone size={20} />, label: "Telefoni", value: "+383 44 123 456", href: "tel:+38344123456" },
    { icon: <Mail size={20} />, label: "Email", value: "info@aldodent.com", href: "mailto:info@aldodent.com" },
    { icon: <MapPin size={20} />, label: "Adresa", value: "Prishtinë, Kosovë", href: null },
];

const HOURS = [
    { day: "E Hënë – E Premte", time: "09:00 – 18:00" },
    { day: "E Shtunë", time: "09:00 – 14:00" },
    { day: "E Dielë", time: "Mbyllur" },
];

/* ───────────────────── MAIN COMPONENT ─────────────────── */

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#2596be] text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#196384]/30 rounded-full blur-[120px]" />

                {/* Connection Network */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
                    {/* Organic flow curves */}
                    <path d="M0 200 C 200 150, 400 250, 600 180 S 1000 250, 1440 200" stroke="white" strokeWidth="0.7" />
                    <path d="M0 240 C 200 200, 400 290, 600 220 S 1000 290, 1440 245" stroke="white" strokeWidth="0.4" />
                    <path d="M0 600 C 300 550, 600 650, 900 580 S 1200 650, 1440 600" stroke="white" strokeWidth="0.6" />
                    <path d="M0 640 C 300 600, 600 690, 900 620 S 1200 690, 1440 645" stroke="white" strokeWidth="0.35" />
                    {/* Network nodes */}
                    <circle cx="300" cy="200" r="3" fill="white" opacity="0.5" />
                    <circle cx="600" cy="180" r="3" fill="white" opacity="0.5" />
                    <circle cx="1000" cy="220" r="3" fill="white" opacity="0.5" />
                    <circle cx="450" cy="600" r="3" fill="white" opacity="0.5" />
                    <circle cx="900" cy="580" r="3" fill="white" opacity="0.5" />
                    {/* Connecting threads between nodes */}
                    <line x1="300" y1="200" x2="600" y2="180" stroke="white" strokeWidth="0.2" strokeDasharray="4 8" />
                    <line x1="600" y1="180" x2="1000" y2="220" stroke="white" strokeWidth="0.2" strokeDasharray="4 8" />
                    <line x1="450" y1="600" x2="900" y2="580" stroke="white" strokeWidth="0.2" strokeDasharray="4 8" />
                    {/* Corner arc accent */}
                    <path d="M0 0 A 200 200 0 0 1 200 0" stroke="white" strokeWidth="0.3" />
                    <path d="M0 0 A 300 300 0 0 1 300 0" stroke="white" strokeWidth="0.2" />
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
                        Na Kontaktoni
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-light tracking-tight mb-4"
                    >
                        Jemi Këtu për Ju
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl text-lg font-light"
                    >
                        Keni pyetje ose dëshironi të mësoni më shumë për shërbimet tona? Na kontaktoni dhe do t'ju përgjigjemi sa më shpejt.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10"
                    >
                        {isSubmitted ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 text-[#2596be]"
                                >
                                    <Check size={40} />
                                </motion.div>
                                <h3 className="text-2xl font-light mb-3">Mesazhi u dërgua!</h3>
                                <p className="text-white/50 mb-8 max-w-sm">Faleminderit {formData.name}. Do t'ju kontaktojmë së shpejti.</p>
                                <button
                                    onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                                    className="text-white font-medium underline underline-offset-4 hover:text-teal-200 transition-colors text-sm"
                                >
                                    Dërgo mesazh tjetër
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Emri *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Emri juaj"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="email@shembull.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Telefoni</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+383 44 ..."
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Subjekti</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Si mund t'ju ndihmojmë?"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Mesazhi *</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        placeholder="Shkruani mesazhin tuaj këtu..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-white text-[#2596be] px-8 py-3.5 rounded-full font-medium flex items-center gap-2 hover:bg-teal-50 transition-all shadow-lg shadow-black/10"
                                >
                                    Dërgo Mesazhin
                                    <Send size={16} />
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Sidebar Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4"
                    >
                        {/* Contact Details */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5">
                            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 block">Informacioni</span>
                            {CONTACT_INFO.map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-teal-300 shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <span className="text-xs text-white/30 block">{item.label}</span>
                                        {item.href ? (
                                            <a href={item.href} className="text-white font-medium hover:text-teal-300 transition-colors">{item.value}</a>
                                        ) : (
                                            <span className="text-white font-medium">{item.value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Working Hours */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <Clock size={16} className="text-teal-300" />
                                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">Orari i Punës</span>
                            </div>
                            <div className="space-y-3">
                                {HOURS.map((h, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className="text-sm text-white/60">{h.day}</span>
                                        <span className={`text-sm font-medium ${h.time === 'Mbyllur' ? 'text-white/30' : 'text-white'}`}>{h.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden aspect-[4/3]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.5!2d21.1655!3d42.6629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM5JzQ2LjQiTiAyMcKwMDknNTUuOCJF!5e0!3m2!1sen!2s!4v1"
                                className="w-full h-full border-0 grayscale opacity-60 hover:opacity-80 hover:grayscale-0 transition-all duration-500"
                                loading="lazy"
                                title="Lokacioni"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
