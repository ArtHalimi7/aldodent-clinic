import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, ChevronDown } from 'lucide-react';

/* ───────────────────────── DATA ───────────────────────── */

/* ───────────────────────── DATA ───────────────────────── */

const DOCTORS = [
    { id: 'dr-aldo', name: 'Dr. Aldo', role: 'Kryedoktor & Kirurg', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aldo' },
    { id: 'dr-elena', name: 'Dr. Elena', role: 'Ortodonte', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
];

const STEP_LABELS = ["Shërbimi", "Data & Ora", "Të Dhënat", "Konfirmimi"];

/* ───────────────────── HELPER: Calendar ───────────────── */

function MiniCalendar({ selected, onSelect }) {
    const today = new Date();
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [viewYear, setViewYear] = useState(today.getFullYear());

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const monthNames = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
    const dayNames = ["Di", "Hë", "Ma", "Më", "En", "Pr", "Sh"];

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
        else setViewMonth(viewMonth - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
        else setViewMonth(viewMonth + 1);
    };

    const isDisabled = (day) => {
        const d = new Date(viewYear, viewMonth, day);
        const now = new Date(); now.setHours(0, 0, 0, 0);
        return d < now || d.getDay() === 0; // no past dates, no Sundays
    };

    const isSelected = (day) => {
        if (!selected) return false;
        return selected.getDate() === day && selected.getMonth() === viewMonth && selected.getFullYear() === viewYear;
    };

    const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <span className="font-medium text-lg">{monthNames[viewMonth]} {viewYear}</span>
                <button onClick={nextMonth} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(d => <div key={d} className="text-center text-xs text-white/40 font-medium py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {blanks.map((_, i) => <div key={`b${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                    <button
                        key={day}
                        disabled={isDisabled(day)}
                        onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
                        className={`aspect-square rounded-full text-sm font-medium flex items-center justify-center transition-all
                            ${isDisabled(day) ? 'text-white/15 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'}
                            ${isSelected(day) ? 'bg-white text-[#1e3a8a] hover:bg-white' : ''}
                        `}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
}

/* ───────────────────── MAIN COMPONENT ─────────────────── */

export default function Booking() {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        service: null,
        doctorId: DOCTORS[0].id,
        date: null,
        time: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        notes: ''
    });

    const getDurationSlots = (timeStr, serviceTitle) => {
        let slotsNum = 1;
        if (serviceTitle.includes("30–60") || serviceTitle.includes("30-60")) slotsNum = 2;
        else if (serviceTitle.includes("45–90") || serviceTitle.includes("60–90") || serviceTitle.includes("60-90")) slotsNum = 3;
        else if (serviceTitle.includes("2 seanca")) slotsNum = 2;
        else if (serviceTitle.includes("60 min") || serviceTitle.includes("60")) slotsNum = 2;

        const [h, m] = timeStr.split(':').map(Number);
        let currentTotalMinutes = h * 60 + m;

        const occupied = [];
        for (let i = 0; i < slotsNum; i++) {
            let hr = Math.floor(currentTotalMinutes / 60);
            let min = currentTotalMinutes % 60;
            occupied.push(`${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
            currentTotalMinutes += 30;
        }
        return occupied;
    };

    // Fetch and store booked slots to prevent double booking
    const [bookedSlots, setBookedSlots] = useState([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const [aptRes, blockRes] = await Promise.all([
                    fetch('http://localhost:5000/api/appointments'),
                    fetch('http://localhost:5000/api/blocked-times')
                ]);
                let slots = [];
                if (aptRes.ok) {
                    const apts = await aptRes.json();
                    apts.forEach(a => {
                        const dateStr = String(a.date).split('T')[0];
                        const docId = a.doctor_id || 'dr-aldo';
                        const occupiedTimes = getDurationSlots(a.time, a.service);
                        occupiedTimes.forEach(t => {
                            slots.push(`${dateStr}_${docId}_${t}`);
                        });
                    });
                }
                if (blockRes.ok) {
                    const blocks = await blockRes.json();
                    blocks.forEach(b => {
                        const dateStr = String(b.date).split('T')[0];
                        const docId = b.doctor_id || 'dr-aldo';

                        const timeParts = b.time.split(' - ');
                        if (timeParts.length === 2) {
                            let curr = timeParts[0].trim();
                            const end = timeParts[1].trim();
                            while (curr < end) {
                                slots.push(`${dateStr}_${docId}_${curr}`);
                                let [h, m] = curr.split(':').map(Number);
                                let mins = h * 60 + m + 30;
                                let hr = Math.floor(mins / 60);
                                let min = mins % 60;
                                curr = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                            }
                        } else {
                            slots.push(`${dateStr}_${docId}_${b.time.split(' - ')[0].trim()}`);
                        }
                    });
                }
                setBookedSlots(slots);
            } catch (err) {
                console.error("Failed to fetch schedule", err);
            }
        };

        const fetchServices = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/services');
                if (res.ok) setServices(await res.json());
            } catch (err) { console.error("Failed to fetch services", err); }
        };

        fetchSchedule();
        fetchServices();
    }, []);

    // Automatic scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 3)); };
    const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };
    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_name: `${formData.firstName} ${formData.lastName}`,
                    patient_phone: formData.phone,
                    patient_email: formData.email,
                    service: services.find(s => s.id === formData.service || s.slug === formData.service)?.title || formData.service,
                    date: formData.date ? `${formData.date.getFullYear()}-${String(formData.date.getMonth() + 1).padStart(2, '0')}-${String(formData.date.getDate()).padStart(2, '0')}` : '',
                    time: formData.time,
                    doctor_id: formData.doctorId,
                    notes: formData.notes
                })
            });
            if (res.ok) {
                setDirection(1);
                setStep(4);
            } else {
                alert("Pati një gabim gjatë rezervimit. Ju lutem provoni përsëri.");
            }
        } catch (error) {
            console.error(error);
            alert("Sistemi nuk u lidh me serverin.");
        }
    };

    const canProceed = () => {
        if (step === 0) return !!formData.service;
        if (step === 1) {
            if (!formData.date || !formData.time || !formData.doctorId) return false;

            const dateStr = `${formData.date.getFullYear()}-${String(formData.date.getMonth() + 1).padStart(2, '0')}-${String(formData.date.getDate()).padStart(2, '0')}`;

            const isBooked = (() => {
                const selectedSrv = services.find(s => s.slug === formData.service || s.id === formData.service);
                const neededSlots = getDurationSlots(formData.time, selectedSrv?.title || '').length;
                let [h, m] = formData.time.split(':').map(Number);
                let currentTotalMinutes = h * 60 + m;
                for (let i = 0; i < neededSlots; i++) {
                    let hr = Math.floor(currentTotalMinutes / 60);
                    let min = currentTotalMinutes % 60;
                    let checkTime = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                    if (bookedSlots.includes(`${dateStr}_${formData.doctorId}_${checkTime}`)) return true;
                    if (currentTotalMinutes >= 17 * 60 + 30) return true; // Past closing time
                    currentTotalMinutes += 30;
                }
                return false;
            })();

            const now = new Date();
            const isToday = formData.date.toDateString() === now.toDateString();
            const isPast = isToday && parseInt(formData.time.replace(':', '')) <= (now.getHours() * 100 + now.getMinutes());

            return !isBooked && !isPast;
        }
        if (step === 2) {
            const isNameValid = formData.firstName.trim().length >= 2 && formData.lastName.trim().length >= 2;
            const isPhoneValid = /^\+?[\d\s-]{8,}$/.test(formData.phone.trim());
            const isEmailValid = !formData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
            return isNameValid && isPhoneValid && isEmailValid;
        }
        return true;
    };

    const selectedService = services.find(s => s.slug === formData.service || s.id === formData.service);

    const formatDate = (d) => {
        if (!d) return '';
        const days = ["E Dielë", "E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë"];
        const months = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
        return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const TIME_SLOTS_AM = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
    const TIME_SLOTS_PM = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

    const slideVariants = {
        enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir < 0 ? 60 : -60, opacity: 0 })
    };

    /* ───── SUCCESS SCREEN ───── */
    if (step === 4) {
        return (
            <div className="min-h-screen bg-[#1e3a8a] text-white flex items-center justify-center px-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                <Motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="text-center max-w-md">
                    <Motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-10 text-[#1e3a8a] shadow-xl shadow-black/10"
                    >
                        <Check size={56} strokeWidth={2.5} />
                    </Motion.div>
                    <h1 className="text-4xl md:text-5xl font-light mb-4">Termini u Konfirmua!</h1>
                    <p className="text-white/70 text-lg font-light mb-3">
                        Faleminderit <span className="text-white font-medium">{formData.firstName}</span>. Kërkesa juaj u regjistrua me sukses.
                    </p>
                    <div className="bg-white/10 rounded-2xl p-6 text-left text-sm space-y-2 mt-8 border border-white/10">
                        <div className="flex justify-between"><span className="text-white/50">Shërbimi</span><span className="font-medium">{selectedService?.title}</span></div>
                        <div className="flex justify-between"><span className="text-white/50">Data</span><span className="font-medium">{formatDate(formData.date)}</span></div>
                        <div className="flex justify-between"><span className="text-white/50">Ora</span><span className="font-medium">{formData.time}</span></div>
                        <div className="flex justify-between"><span className="text-white/50">Telefoni</span><span className="font-medium">{formData.phone}</span></div>
                    </div>
                    <p className="text-white/50 text-sm mt-6">Do t'ju kontaktojmë në numrin tuaj për konfirmim përfundimtar.</p>
                    <button
                        onClick={() => { setStep(0); setFormData({ service: null, date: null, time: '', firstName: '', lastName: '', phone: '', email: '', notes: '' }); }}
                        className="mt-8 text-white font-medium underline underline-offset-4 hover:text-teal-200 transition-colors"
                    >
                        Rezervo një termin tjetër
                    </button>
                </Motion.div>
            </div>
        );
    }

    /* ───── MAIN LAYOUT ───── */
    return (
        <div className="min-h-screen bg-[#1e3a8a] text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Helmet>
                <title>Rezervo Termin — AldoDent | Klinikë Dentare Premium</title>
                <meta name="description" content="Rezervoni terminin tuaj online në AldoDent. Zgjidhni shërbimin, datën dhe orën që ju përshtaten më së miri." />
                <link rel="canonical" href="https://aldodent.netlify.app/booking" />
            </Helmet>

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#172554]/30 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-20">

                {/* Page Title */}
                <div className="mb-12">
                    <Motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-teal-300 font-bold tracking-[0.2em] uppercase text-xs mb-3 block"
                    >
                        Rezervo Online
                    </Motion.span>
                    <Motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-light tracking-tight"
                    >
                        Cakto Terminin Tuaj
                    </Motion.h1>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-0 mb-14">
                    {STEP_LABELS.map((label, i) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 shrink-0
                                    ${i < step ? 'bg-white text-[#1e3a8a]' : i === step ? 'bg-white text-[#1e3a8a] ring-4 ring-white/20' : 'bg-white/10 text-white/40'}
                                `}>
                                    {i < step ? <Check size={16} strokeWidth={3} /> : i + 1}
                                </div>
                                <span className={`text-sm font-medium hidden md:block transition-colors ${i <= step ? 'text-white' : 'text-white/30'}`}>{label}</span>
                            </div>
                            {i < STEP_LABELS.length - 1 && (
                                <div className={`flex-1 h-[1px] mx-4 transition-colors duration-300 ${i < step ? 'bg-white/50' : 'bg-white/10'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait" custom={direction}>

                    {/* ── STEP 1: SERVICE ── */}
                    {step === 0 && (
                        <Motion.div key="s0" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                            <h2 className="text-2xl font-light mb-2">Zgjidhni shërbimin</h2>
                            <p className="text-white/50 mb-8 text-sm">Klikoni mbi shërbimin që dëshironi të rezervoni.</p>

                            <div className="space-y-2">
                                {services.map((srv) => (
                                    <button
                                        key={srv.id}
                                        onClick={() => setFormData({ ...formData, service: srv.slug })}
                                        className={`w-full text-left px-6 py-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group
                                            ${formData.service === srv.slug
                                                ? 'bg-white text-[#1e3a8a] border-white'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                                            }`}
                                    >
                                        <div>
                                            <h3 className="text-lg font-medium">{srv.title}</h3>
                                            <span className={`text-sm ${formData.service === srv.slug ? 'text-[#1e3a8a]/70' : 'text-white/40'}`}>
                                                {srv.duration}
                                            </span>
                                        </div>
                                        <span className={`text-sm font-medium ${formData.service === srv.slug ? 'text-[#1e3a8a]' : 'text-white/60'}`}>
                                            {srv.price}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </Motion.div>
                    )}

                    {/* ── STEP 2: DATE & TIME ── */}
                    {step === 1 && (
                        <Motion.div key="s1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                            <h2 className="text-2xl font-light mb-2">Zgjidhni doktorin, datën dhe orën</h2>
                            <p className="text-white/50 mb-8 text-sm">Zgjidhni me kë dëshironi të bëni vizitën.</p>

                            {/* DOCTOR SELECTOR */}
                            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                                {DOCTORS.map(doc => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setFormData({ ...formData, doctorId: doc.id, time: '' })}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-w-[200px]
                                            ${formData.doctorId === doc.id ? 'bg-white/10 border-teal-400/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full bg-black/20" />
                                        <div className="text-left">
                                            <div className="font-medium text-sm text-white">{doc.name}</div>
                                            <div className="text-xs text-white/50">{doc.role}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Calendar */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <MiniCalendar
                                        selected={formData.date}
                                        onSelect={(d) => setFormData({ ...formData, date: d, time: '' })}
                                    />
                                </div>

                                {/* Time Slots */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    {(() => {
                                        const dateStr = formData.date ? `${formData.date.getFullYear()}-${String(formData.date.getMonth() + 1).padStart(2, '0')}-${String(formData.date.getDate()).padStart(2, '0')}` : '';
                                        const now = new Date();
                                        const isToday = formData.date && formData.date.toDateString() === now.toDateString();

                                        const checkSlotAvailability = (t) => {
                                            if (!formData.date) return false;
                                            const selectedSrv = services.find(s => s.slug === formData.service || s.id === formData.service);
                                            const neededSlots = getDurationSlots(t, selectedSrv?.title || '').length;

                                            let [h, m] = t.split(':').map(Number);
                                            let currentTotalMinutes = h * 60 + m;

                                            for (let i = 0; i < neededSlots; i++) {
                                                let hr = Math.floor(currentTotalMinutes / 60);
                                                let min = currentTotalMinutes % 60;
                                                let checkTime = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

                                                if (bookedSlots.includes(`${dateStr}_${formData.doctorId}_${checkTime}`)) {
                                                    return true; // Overlaps with existing booking
                                                }
                                                if (currentTotalMinutes >= 17 * 60 + 30) {
                                                    return true; // Exceeds closing time
                                                }
                                                currentTotalMinutes += 30;
                                            }
                                            return false;
                                        };

                                        return (
                                            <>
                                                <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-4">Paradite</p>
                                                <div className="grid grid-cols-3 gap-2 mb-6">
                                                    {TIME_SLOTS_AM.map(t => {
                                                        const isSlotBooked = checkSlotAvailability(t);
                                                        const isPast = isToday && parseInt(t.replace(':', '')) <= (now.getHours() * 100 + now.getMinutes());
                                                        const isDisabled = isSlotBooked || isPast;

                                                        return (
                                                            <button
                                                                key={t}
                                                                disabled={isDisabled}
                                                                onClick={() => setFormData({ ...formData, time: t })}
                                                                className={`py-2.5 rounded-xl text-sm font-medium transition-all
                                                                    ${formData.time === t ? 'bg-white text-[#1e3a8a]' : 'bg-white/5 text-white/70 hover:bg-white/10'}
                                                                    ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-white/5 line-through decoration-white/20' : ''}`}
                                                            >
                                                                {t}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-4">Pasdite</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {TIME_SLOTS_PM.map(t => {
                                                        const isSlotBooked = checkSlotAvailability(t);
                                                        const isPast = isToday && parseInt(t.replace(':', '')) <= (now.getHours() * 100 + now.getMinutes());
                                                        const isDisabled = isSlotBooked || isPast;

                                                        return (
                                                            <button
                                                                key={t}
                                                                disabled={isDisabled}
                                                                onClick={() => setFormData({ ...formData, time: t })}
                                                                className={`py-2.5 rounded-xl text-sm font-medium transition-all
                                                                    ${formData.time === t ? 'bg-white text-[#1e3a8a]' : 'bg-white/5 text-white/70 hover:bg-white/10'}
                                                                    ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-white/5 line-through decoration-white/20' : ''}`}
                                                            >
                                                                {t}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {formData.date && (
                                <Motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/60 text-sm mt-6">
                                    Keni zgjedhur: <span className="text-white font-medium">{formatDate(formData.date)}</span>
                                    {formData.time && <> në orën <span className="text-white font-medium">{formData.time}</span></>}
                                </Motion.p>
                            )}
                        </Motion.div>
                    )}

                    {/* ── STEP 3: DETAILS ── */}
                    {step === 2 && (
                        <Motion.div key="s2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                            <h2 className="text-2xl font-light mb-2">Plotësoni të dhënat tuaja</h2>
                            <p className="text-white/50 mb-8 text-sm">Fushat me * janë të detyrueshme.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 max-w-3xl">
                                {/* First Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Emri *</label>
                                    <input
                                        type="text"
                                        placeholder="Emri juaj"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all"
                                    />
                                </div>

                                {/* Last Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Mbiemri *</label>
                                    <input
                                        type="text"
                                        placeholder="Mbiemri juaj"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Telefoni *</label>
                                    <input
                                        type="tel"
                                        placeholder="+383 44 ..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Email (opsionale)</label>
                                    <input
                                        type="email"
                                        placeholder="email@shembull.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all"
                                    />
                                </div>

                                {/* Notes */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-teal-300 ml-1">Shënime (opsionale)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="A keni ndonjë shqetësim apo kërkesë specifike?"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3.5 outline-none focus:border-white/40 focus:bg-white/10 text-white placeholder-white/25 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </Motion.div>
                    )}

                    {/* ── STEP 4: REVIEW ── */}
                    {step === 3 && (
                        <Motion.div key="s3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                            <h2 className="text-2xl font-light mb-2">Rishikoni dhe konfirmoni</h2>
                            <p className="text-white/50 mb-8 text-sm">Sigurohuni që të dhënat janë të sakta para konfirmimit.</p>

                            <div className="max-w-2xl space-y-4">
                                {/* Summary Card */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-white/50 text-sm">Shërbimi</span>
                                        <span className="font-medium">{selectedService?.title}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-white/50 text-sm">Data</span>
                                        <span className="font-medium">{formatDate(formData.date)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-white/50 text-sm">Ora</span>
                                        <span className="font-medium">{formData.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-white/50 text-sm">Kohëzgjatja</span>
                                        <span className="font-medium">{selectedService?.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/50 text-sm">Çmimi</span>
                                        <span className="font-medium text-teal-300">{selectedService?.price}</span>
                                    </div>
                                </div>

                                {/* Personal Info Card */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-white/50 text-sm">Emri i plotë</span>
                                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <span className="text-white/50 text-sm">Telefoni</span>
                                        <span className="font-medium">{formData.phone}</span>
                                    </div>
                                    {formData.email && (
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <span className="text-white/50 text-sm">Email</span>
                                            <span className="font-medium">{formData.email}</span>
                                        </div>
                                    )}
                                    {formData.notes && (
                                        <div>
                                            <span className="text-white/50 text-sm block mb-2">Shënime</span>
                                            <p className="text-sm text-white/80">{formData.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Motion.div>
                    )}

                </AnimatePresence>

                {/* ── BOTTOM NAVIGATION ── */}
                <div className="flex items-center justify-between mt-14 pt-8 border-t border-white/10 max-w-3xl">
                    {step > 0 ? (
                        <button onClick={goBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium">
                            <ChevronLeft size={18} />
                            Prapa
                        </button>
                    ) : <div />}

                    <button
                        onClick={step === 3 ? handleSubmit : goNext}
                        disabled={!canProceed()}
                        className="bg-white text-[#1e3a8a] px-10 py-3.5 rounded-full font-medium flex items-center gap-2 hover:bg-teal-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-black/10 text-sm"
                    >
                        {step === 3 ? "Konfirmo Terminin" : "Vazhdo"}
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
