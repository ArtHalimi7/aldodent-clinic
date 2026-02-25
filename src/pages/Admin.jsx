import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Users, Clock, Settings, LogOut,
    Plus, ChevronRight, ChevronLeft, CalendarOff,
    Search, Bell, X, CalendarDays, ArrowRight, Trash2, Edit2,
    CheckCircle, User as UserIcon, Shield, Moon, Smartphone, Mail, Lock,
    Check, ChevronDown, Stethoscope, Activity
} from 'lucide-react';

const TIME_SLOTS_AM = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const TIME_SLOTS_PM = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

const ALBANIAN_MONTHS = ["Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor", "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"];
const ALBANIAN_DAYS = ["E Diel", "E Hënë", "E Martë", "E Mërkurë", "E Enjte", "E Premte", "E Shtunë"];

const formatAlbanianDate = (date) => {
    if (!date) return "";
    const dayName = ALBANIAN_DAYS[date.getDay()];
    const day = date.getDate();
    const monthName = ALBANIAN_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName}, ${day} ${monthName} ${year}`;
};

const getDurationSlots = (time, serviceTitle) => {
    let slots = 1;
    const title = serviceTitle.toLowerCase();
    if (title.includes('implantologji') || title.includes('endodonci')) slots = 3;
    else if (title.includes('kirurgji') || title.includes('parodontologji')) slots = 2;
    else if (title.includes('estetikë')) slots = 2;

    const occupied = [];
    let [h, m] = time.split(':').map(Number);
    let currentTotalMinutes = h * 60 + m;

    for (let i = 0; i < slots; i++) {
        let hr = Math.floor(currentTotalMinutes / 60);
        let min = currentTotalMinutes % 60;
        occupied.push(`${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
        currentTotalMinutes += 30;
    }
    return occupied;
};

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
                    <ChevronRight size={18} />
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

// MOCK DATA
// DOCTORS moved to server side

export default function Admin() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [activeTab, setActiveTab] = useState('calendar');
    const [selectedApt, setSelectedApt] = useState(null);

    // BACKEND STATE
    const [rawAppointments, setRawAppointments] = useState([]);
    const [rawBlockedTimes, setRawBlockedTimes] = useState([]);
    const [rawServices, setRawServices] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const [aptRes, blockRes, servRes, docRes] = await Promise.all([
                fetch('http://localhost:5000/api/appointments'),
                fetch('http://localhost:5000/api/blocked-times'),
                fetch('http://localhost:5000/api/services'),
                fetch('http://localhost:5000/api/doctors')
            ]);
            if (aptRes.ok) setRawAppointments(await aptRes.json());
            if (blockRes.ok) setRawBlockedTimes(await blockRes.json());
            if (servRes.ok) setRawServices(await servRes.json());
            if (docRes.ok) {
                const docs = await docRes.json();
                setDoctors(docs);
                if (!selectedDoc && docs.length > 0) setSelectedDoc(docs[0].id);
            }
        } catch (error) {
            console.error("Backend jo i disponueshëm", error);
        }
    }, [selectedDoc]);

    useEffect(() => {
        const initLoad = async () => {
            await fetchData();
        };
        initLoad();

        // Set an interval to poll the database every 10 seconds for new bookings
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const prevAptCountRef = useRef(parseInt(localStorage.getItem('aldodent_last_apt_count') || '-1', 10));
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentNotifications, setRecentNotifications] = useState(() => {
        const saved = localStorage.getItem('aldodent_recent_notifs');
        return saved ? JSON.parse(saved) : [];
    });
    const [showNotifications, setShowNotifications] = useState(false);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    useEffect(() => {
        if (rawAppointments.length === 0) return; // skip initial empty state

        // On very first load of the dashboard ever, just sync without alerting
        if (prevAptCountRef.current === -1) {
            localStorage.setItem('aldodent_last_apt_count', rawAppointments.length);
            prevAptCountRef.current = rawAppointments.length;
            return;
        }

        if (rawAppointments.length > prevAptCountRef.current) {
            const newCount = rawAppointments.length - prevAptCountRef.current;
            setUnreadCount(prev => prev + newCount);

            // Add the newest appointments to recent notifications
            const newAppointments = rawAppointments.slice(-newCount);
            setRecentNotifications(prev => {
                const updated = [...newAppointments.reverse(), ...prev].slice(0, 10);
                localStorage.setItem('aldodent_recent_notifs', JSON.stringify(updated));
                return updated;
            }); // Keep last 10

            // Auto open the dropdown when a new booking arrives
            setShowNotifications(true);

            // Try to play notification sound if enabled
            if (notificationsEnabled) {
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
                    audio.volume = 0.4; // Softer, less loud
                    audio.play().catch(e => console.log('Audio disabled by browser', e));
                } catch {
                    /* ignore error if audio fails */
                }
            }

            localStorage.setItem('aldodent_last_apt_count', rawAppointments.length);
            prevAptCountRef.current = rawAppointments.length;
        } else if (rawAppointments.length < prevAptCountRef.current) {
            // Count went down because an appointment was deleted
            localStorage.setItem('aldodent_last_apt_count', rawAppointments.length);
            prevAptCountRef.current = rawAppointments.length;
        }
    }, [rawAppointments, notificationsEnabled]);

    // Normalize DB data to match the UI component structures
    const APPOINTMENTS = useMemo(() => {
        return rawAppointments.map(a => {
            const d = new Date(a.date);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return {
                id: a.id,
                patient: a.patient_name,
                service: a.service,
                time: a.time,
                doctorId: a.doctor_id,
                status: a.status,
                date: dateStr,
                notes: a.notes,
                phone: a.patient_phone
            };
        });
    }, [rawAppointments]);

    const BLOCKED_TIMES = useMemo(() => {
        return rawBlockedTimes.map(b => {
            const d = new Date(b.date);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return {
                id: b.id,
                type: b.type,
                title: b.title,
                time: b.time,
                doctorId: b.doctor_id,
                date: dateStr
            };
        });
    }, [rawBlockedTimes]);


    // PAUZA FORM STATE
    const [showPauseSuccess, setShowPauseSuccess] = useState(false);
    const [pauzaForm, setPauzaForm] = useState({
        doctor_id: doctors[0]?.id || '',
        startDate: null, // Change to Date object for MiniCalendar
        startTime: '',
        endTime: '',
        reason: ''
    });

    // MANUAL BOOKING STATE
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingStep, setBookingStep] = useState(0);
    const [bookingData, setBookingData] = useState({
        service: null,
        doctorId: doctors[0]?.id || '',
        date: null,
        time: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        notes: ''
    });

    const handleManualBooking = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_name: `${bookingData.firstName} ${bookingData.lastName}`,
                    patient_phone: bookingData.phone,
                    patient_email: bookingData.email,
                    service: rawServices.find(s => s.slug === bookingData.service || s.id === bookingData.service)?.title || bookingData.service,
                    date: bookingData.date ? `${bookingData.date.getFullYear()}-${String(bookingData.date.getMonth() + 1).padStart(2, '0')}-${String(bookingData.date.getDate()).padStart(2, '0')}` : '',
                    time: bookingData.time,
                    doctor_id: bookingData.doctorId,
                    notes: bookingData.notes
                })
            });
            if (res.ok) {
                setShowBookingModal(false);
                setBookingStep(0);
                setBookingData({
                    service: null, doctorId: doctors[0]?.id || '', date: null, time: '',
                    firstName: '', lastName: '', phone: '', email: '', notes: ''
                });
                fetchData();
            } else {
                alert("Gabim gjatë rezervimit.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // SERVICES FORM STATE
    const [newService, setNewService] = useState({ title: '', duration: '', price: '' });
    const [editingService, setEditingService] = useState(null); // ID of the service being edited

    const handleAddService = async () => {
        if (!newService.title || !newService.duration || !newService.price) return alert("Plotësoni të gjitha fushat!");
        try {
            if (editingService) {
                // UPDATE
                const res = await fetch(`http://localhost:5000/api/services/${editingService}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newService)
                });
                if (res.ok) {
                    setEditingService(null);
                    setNewService({ title: '', duration: '', price: '' });
                    fetchData();
                }
            } else {
                // CREATE
                const res = await fetch('http://localhost:5000/api/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newService)
                });
                if (res.ok) {
                    setNewService({ title: '', duration: '', price: '' });
                    fetchData();
                }
            }
        } catch (err) { console.error(err); }
    };

    const startEditing = (service) => {
        setEditingService(service.id);
        setNewService({ title: service.title, duration: service.duration, price: service.price });
        // Scroll to form or just let user see it
    };

    const cancelEditing = () => {
        setEditingService(null);
        setNewService({ title: '', duration: '', price: '' });
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm("Jeni të sigurt?")) return;
        try {
            await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleSavePauza = async () => {
        if (!pauzaForm.startDate || !pauzaForm.startTime || !pauzaForm.endTime) {
            return alert("Plotësoni datën dhe orë!");
        }

        // Validation: Start time must be before end time
        if (pauzaForm.startTime >= pauzaForm.endTime) {
            return alert("Ora e përfundimit duhet të jetë pas orës së fillimit!");
        }

        try {
            const d = pauzaForm.startDate;
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const timeStr = `${pauzaForm.startTime} - ${pauzaForm.endTime}`;
            const res = await fetch('http://localhost:5000/api/blocked-times', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctor_id: pauzaForm.doctor_id,
                    date: dateStr,
                    time: timeStr,
                    type: 'Pauzë',
                    title: pauzaForm.reason || 'Pauzë e caktuar'
                })
            });
            if (res.ok) {
                setShowPauseSuccess(true);
                fetchData();
                setPauzaForm({ doctor_id: doctors[0]?.id || '', startDate: null, startTime: '', endTime: '', reason: '' });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // APPOINTMENT MODAL ACTIONS
    const handleDeleteApt = async (id) => {
        if (!window.confirm("Jeni të sigurt që doni ta fshini këtë termin?")) return;
        try {
            await fetch(`http://localhost:5000/api/appointments/${id}`, { method: 'DELETE' });
            setSelectedApt(null);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
            await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            setSelectedApt(prev => prev ? { ...prev, status: newStatus } : null);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };


    // Calendar State
    const todayInit = new Date();
    const [currentDate, setCurrentDate] = useState(todayInit); // Month view state
    const [selectedDailyDate, setSelectedDailyDate] = useState(todayInit); // Daily scheduler state
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(null); // The day the user clicked in the month view

    // Calendar Logic
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let firstDay = new Date(year, month, 1).getDay();
        const startOffset = firstDay === 0 ? 6 : firstDay - 1;

        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blanks = Array.from({ length: startOffset }, (_, i) => i);

        const totalSlots = startOffset + daysInMonth;
        const endBlanksCount = totalSlots % 7 === 0 ? 0 : 7 - (totalSlots % 7);
        const endBlanks = Array.from({ length: endBlanksCount }, (_, i) => i);

        const currentMonthName = `${ALBANIAN_MONTHS[month]} ${year}`;

        return { year, month, days, blanks, endBlanks, currentMonthName, startOffset };
    }, [currentDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedCalendarDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedCalendarDate(null);
    };

    const resetToToday = () => {
        setCurrentDate(new Date());
        setSelectedCalendarDate(null);
    };

    // Calculate schedule for selected calendar date
    const selectedDateSchedule = useMemo(() => {
        if (!selectedCalendarDate) return [];

        // Format date string for comparison "YYYY-MM-DD"
        const year = selectedCalendarDate.getFullYear();
        const month = String(selectedCalendarDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedCalendarDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // Get both appointments and blocked times for selected doc on this date
        const dayApts = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === dateStr).map(a => ({ ...a, itemType: 'appointment' }));
        const dayBlocks = BLOCKED_TIMES.filter(b => b.doctorId === selectedDoc && b.date === dateStr).map(b => ({ ...b, itemType: 'blocked' }));

        // Combine and sort by start time
        return [...dayApts, ...dayBlocks].sort((a, b) => {
            const timeA = a.time.split(' - ')[0];
            const timeB = b.time.split(' - ')[0];
            return timeA.localeCompare(timeB);
        });

    }, [selectedCalendarDate, selectedDoc, APPOINTMENTS, BLOCKED_TIMES]);

    // Dock Items
    const DOCK_ITEMS = [
        { id: 'calendar', icon: Clock, label: 'Orari Ditor' },
        { id: 'month-calendar', icon: CalendarDays, label: 'Kalendari Mujor' },
        { id: 'patients', icon: Users, label: 'Pacientët' },
        { id: 'time-off', icon: CalendarOff, label: 'Pushimet & Pauzat' },
        { id: 'services', icon: Stethoscope, label: 'Shërbimet' },
        { id: 'settings', icon: Settings, label: 'Setimet' },
    ];

    const currentDoctor = doctors.find(d => d.id === selectedDoc);

    // Unique Patients Logic
    const uniquePatients = useMemo(() => {
        const patientsMap = new Map();
        APPOINTMENTS.forEach(apt => {
            const key = `${apt.patient}-${apt.phone}`;
            if (!patientsMap.has(key)) {
                patientsMap.set(key, {
                    id: key,
                    name: apt.patient,
                    phone: apt.phone || 'N/A',
                    appointmentsCount: 1,
                    lastVisit: apt.date
                });
            } else {
                const existing = patientsMap.get(key);
                existing.appointmentsCount += 1;
                if (apt.date > existing.lastVisit) {
                    existing.lastVisit = apt.date;
                }
            }
        });
        return Array.from(patientsMap.values()).sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));
    }, [APPOINTMENTS]);

    // Settings State (moved up)

    // Daily Scheduler Logic
    const selectedDailyDateStr = useMemo(() => {
        const year = selectedDailyDate.getFullYear();
        const month = String(selectedDailyDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDailyDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [selectedDailyDate]);

    const selectedDailySchedule = useMemo(() => {
        const dayApts = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === selectedDailyDateStr).map(a => ({ ...a, itemType: 'appointment' }));
        const dayBlocks = BLOCKED_TIMES.filter(b => b.doctorId === selectedDoc && b.date === selectedDailyDateStr).map(b => ({ ...b, itemType: 'blocked' }));
        return [...dayApts, ...dayBlocks].sort((a, b) => {
            const timeA = a.time.split(' - ')[0];
            const timeB = b.time.split(' - ')[0];
            return timeA.localeCompare(timeB);
        });
    }, [selectedDailyDateStr, selectedDoc, APPOINTMENTS, BLOCKED_TIMES]);

    return (
        <div className="min-h-screen bg-[#1e3a8a] text-white flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Helmet>
                <title>Admin Dashboard — AldoDent</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#172554]/30 rounded-full blur-[120px]" />
            </div>

            {/* ── MODERN DOCK (Bottom Centered) ── */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl p-1.5 flex flex-row gap-1 transition-all">
                {DOCK_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            if (item.id !== 'month-calendar') setSelectedCalendarDate(null);
                        }}
                        className={`relative group p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 w-11 h-11
                            ${activeTab === item.id ? 'bg-white text-[#1e3a8a] shadow-md scale-105' : 'text-white/40 hover:bg-white/10 hover:text-white'}
                        `}
                    >
                        <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                        <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-white border border-white/10 text-[#1e3a8a] text-[11px] font-medium rounded-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap shadow-xl">
                            {item.label}
                        </span>
                    </button>
                ))}
                <div className="w-[1px] h-6 bg-white/10 my-auto mx-1" />
                <button className="relative group p-2.5 rounded-xl flex items-center justify-center text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 w-11 h-11">
                    <LogOut size={18} strokeWidth={2} />
                    <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-red-500 text-white text-[11px] font-medium rounded-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all whitespace-nowrap shadow-xl">
                        Dil
                    </span>
                </button>
            </nav>

            {/* ── MAIN CONTENT AREA ── */}
            <main className="flex-1 overflow-y-auto w-full h-screen relative z-10">
                <div className="p-6 md:p-10 lg:p-12 pb-32 mb-8 md:mb-0 max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-medium text-white mb-1 tracking-tight">Paneli i Administrimit</h1>
                            <p className="text-white/60 text-sm font-light capitalize">{formatAlbanianDate(new Date())}</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#1e3a8a] rounded-xl hover:bg-teal-50 transition-all shadow-lg font-semibold text-sm"
                            >
                                <Plus size={18} /> Shto Rezervim
                            </button>

                            <div className="flex items-center gap-4">
                                {/* Search */}
                                <div className="relative hidden md:block">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Kërko pacient..."
                                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/30 transition-all w-64 text-white placeholder-white/30"
                                    />
                                </div>

                                {/* Notifications */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowNotifications(!showNotifications);
                                            setUnreadCount(0);
                                        }}
                                        className={`relative p-2 border rounded-lg transition-colors
                                            ${showNotifications ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        <Bell size={18} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg border-2 border-[#1e3a8a]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notifications Dropdown */}
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <Motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-80 bg-[#1e3a8a] border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            >
                                                <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                                                    <h3 className="text-sm font-medium text-white">Njoftimet</h3>
                                                    {recentNotifications.length > 0 && (
                                                        <button onClick={() => {
                                                            setRecentNotifications([]);
                                                            localStorage.removeItem('aldodent_recent_notifs');
                                                        }} className="text-[10px] text-white/50 hover:text-white uppercase tracking-wider font-semibold">Pastro Të Gjitha</button>
                                                    )}
                                                </div>
                                                <div className="max-h-80 overflow-y-auto">
                                                    {recentNotifications.length === 0 ? (
                                                        <div className="p-6 text-center text-white/40 text-sm">Nuk ka njoftime të reja.</div>
                                                    ) : (
                                                        recentNotifications.map((notif, idx) => (
                                                            <div key={idx} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-teal-400/10 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                                                                    <Bell size={14} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-white mb-0.5">Rezervim i ri!</div>
                                                                    <div className="text-xs text-white/70 mb-1"><span className="text-teal-300">{notif.patient_name}</span> rezervoi <span className="text-white/90">{notif.service}</span></div>
                                                                    <div className="text-[10px] text-white/40 flex items-center gap-2">
                                                                        <span className="flex items-center gap-1"><Clock size={10} /> {notif.time}</span>
                                                                        <span>•</span>
                                                                        <span className="flex items-center gap-1"><CalendarDays size={10} /> {new Date(notif.date).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </Motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Profile Dropdown */}
                                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-1.5 pr-4 cursor-pointer hover:bg-white/10 transition-colors">
                                    <img src={currentDoctor?.avatar} alt={currentDoctor?.name} width="28" height="28" className="w-7 h-7 rounded-md bg-white/10" />
                                    <span className="text-sm font-medium text-white/90">{currentDoctor?.name}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content based on Active Tab */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'calendar' && (
                            <Motion.div
                                key="calendar"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                {/* Doctor Selector */}
                                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                    {doctors.map(doc => (
                                        <button
                                            key={doc.id}
                                            onClick={() => setSelectedDoc(doc.id)}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all shrink-0
                                                ${selectedDoc === doc.id
                                                    ? 'bg-white border-white text-[#1e3a8a] shadow-sm'
                                                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}
                                            `}
                                        >
                                            <img src={doc.avatar} alt="" width="32" height="32" className="w-8 h-8 rounded-lg bg-black/5" />
                                            <div className="text-left leading-tight">
                                                <div className={`text-sm font-medium ${selectedDoc === doc.id ? 'text-[#1e3a8a]' : 'text-white'}`}>{doc.name}</div>
                                                <div className={`text-[11px] ${selectedDoc === doc.id ? 'text-[#1e3a8a]/60' : 'text-white/40'}`}>{doc.role}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                                    {/* Scheduler View */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                            <h2 className="text-base font-medium text-white flex items-center gap-2">
                                                <Clock className="text-teal-400" size={18} /> Orari i Ditës
                                            </h2>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => setSelectedDailyDate(new Date(selectedDailyDate.getFullYear(), selectedDailyDate.getMonth(), selectedDailyDate.getDate() - 1))} className="p-1 border border-white/5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                                                <span className="text-xs text-white/80 font-medium px-2">
                                                    {(selectedDailyDate.getDate() === new Date().getDate() && selectedDailyDate.getMonth() === new Date().getMonth() && selectedDailyDate.getFullYear() === new Date().getFullYear())
                                                        ? 'Sot'
                                                        : selectedDailyDate.toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <button onClick={() => setSelectedDailyDate(new Date(selectedDailyDate.getFullYear(), selectedDailyDate.getMonth(), selectedDailyDate.getDate() + 1))} className="p-1 border border-white/5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ChevronRight size={16} /></button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {selectedDailySchedule.length > 0 ? selectedDailySchedule.map((item, idx) => {
                                                if (item.itemType === 'appointment') {
                                                    return (
                                                        <div
                                                            key={`${item.id}-${idx}`}
                                                            onClick={() => setSelectedApt(item)}
                                                            className="flex items-center p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group cursor-pointer relative overflow-hidden"
                                                        >
                                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'confirmed' ? 'bg-teal-400' : 'bg-amber-400'}`} />
                                                            <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/10 pr-4 mr-4">
                                                                <span className="text-lg font-medium text-white">{item.time?.split(' - ')[0] || item.time}</span>
                                                                <span className="text-xs text-white/40">{item.time?.split(' - ')[1] || ''}</span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <h4 className="text-base font-medium text-white truncate">{item.patient}</h4>
                                                                    <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider
                                                                        ${item.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border border-teal-400/20' : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'}
                                                                    `}>
                                                                        {item.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-white/60 truncate">{item.service}</p>
                                                            </div>
                                                            <div className="pl-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button className="p-2 bg-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                                                                    <ArrowRight size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div
                                                            key={`${item.id}-${idx}`}
                                                            className="flex items-center p-4 rounded-xl border border-white/5 bg-black/10 relative overflow-hidden opacity-80 backdrop-blur-sm"
                                                        >
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50" />
                                                            <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/5 pr-4 mr-4">
                                                                <span className="text-lg font-medium text-white/70">{item.time?.split(' - ')[0] || item.time}</span>
                                                                <span className="text-xs text-white/30">{item.time?.split(' - ')[1] || ''}</span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <h4 className="text-base font-medium text-white/70 line-through decoration-white/20">{item.type}</h4>
                                                                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                                                                        E Bllokuar
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-white/40">{item.title}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            }) : (
                                                <div className="py-12 text-center text-white/40 flex flex-col items-center border border-dashed border-white/10 rounded-xl">
                                                    <CalendarOff size={32} className="mb-3 opacity-20" />
                                                    <p className="text-sm">Nuk ka termine për këtë doktor sot.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar Stats & Actions */}
                                    <div className="space-y-6">
                                        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                                            <h3 className="text-teal-300 text-xs font-semibold mb-1 uppercase tracking-wider">Termine të Reja</h3>
                                            <div className="text-4xl font-light mb-5 tracking-tight">{APPOINTMENTS.length}</div>
                                            <button
                                                onClick={() => setShowBookingModal(true)}
                                                className="w-full py-2.5 bg-white text-[#1e3a8a] border border-white/10 rounded-lg font-medium text-xs transition-colors hover:bg-teal-50 flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <Plus size={16} /> Shto Termin Manual
                                            </button>
                                        </div>

                                        {/* Quick Block Time Card */}
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                                                <h3 className="text-sm font-medium text-white">Blloko Orarin</h3>
                                                <CalendarOff size={16} className="text-white/40" />
                                            </div>
                                            <p className="text-xs text-white/50 mb-4 leading-relaxed">Shto pushim ose pauzë për të mos lejuar rezervime.</p>
                                            <button onClick={() => setActiveTab('time-off')} className="w-full py-2 border border-white/10 text-white/80 rounded-lg font-medium text-xs hover:bg-white/10 hover:text-white transition-all">
                                                Menaxho Pauzat
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        )}

                        {activeTab === 'month-calendar' && (
                            <Motion.div
                                key="month-calendar"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-6">
                                    {/* Monthly Grid */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-medium text-white capitalize">{calendarData.currentMonthName}</h2>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={prevMonth} className="p-1.5 border border-white/10 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                                                <button onClick={resetToToday} className="text-sm text-white/90 px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors font-medium">Sot</button>
                                                <button onClick={nextMonth} className="p-1.5 border border-white/10 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><ChevronRight size={16} /></button>
                                            </div>
                                        </div>

                                        {/* Real JavaScript Calendar Grid */}
                                        <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 overflow-hidden rounded-xl">
                                            {['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'].map(day => (
                                                <div key={day} className="bg-[#1e3b8a]/80 py-2.5 text-center text-xs font-semibold text-white/60 uppercase tracking-wider">{day}</div>
                                            ))}

                                            {/* Blank slots before 1st of month */}
                                            {calendarData.blanks.map((_, i) => (
                                                <div key={`blank-${i}`} className="bg-white/[0.01] aspect-square border-t border-l border-white/5" />
                                            ))}

                                            {/* Actual Days */}
                                            {calendarData.days.map(day => {
                                                const dateMatchStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                                                const dayApts = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === dateMatchStr);
                                                const dayBlocks = BLOCKED_TIMES.filter(b => b.doctorId === selectedDoc && b.date === dateMatchStr);

                                                const realToday = new Date();
                                                const isToday = day === realToday.getDate() && currentDate.getMonth() === realToday.getMonth() && currentDate.getFullYear() === realToday.getFullYear();

                                                // Sunday check: dayIndex starts from 0 (Monday)
                                                // offset + day - 1 = position in grid. % 7 === 6 means Sunday.
                                                const isSunday = (calendarData.startOffset + (day - 1)) % 7 === 6;

                                                const isSelected = selectedCalendarDate?.getDate() === day && selectedCalendarDate?.getMonth() === currentDate.getMonth();

                                                return (
                                                    <div
                                                        key={day}
                                                        onClick={() => {
                                                            if (!isSunday) setSelectedCalendarDate(new Date(calendarData.year, calendarData.month, day))
                                                        }}
                                                        className={`aspect-square p-1 border-t border-l border-white/5 relative transition-all duration-300
                                                            ${isSunday ? 'bg-black/10 opacity-30 cursor-not-allowed' : 'bg-white/[0.02] hover:bg-white/[0.08] cursor-pointer group'}
                                                            ${isSelected && !isSunday ? 'bg-white/[0.12] z-10' : ''}
                                                        `}
                                                    >
                                                        <div className="h-full flex flex-col items-center justify-center gap-2">
                                                            <span className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                                                                ${isToday ? 'bg-teal-400 text-[#1e3a8a] shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'text-white/80'}
                                                                ${isSelected && !isToday ? 'bg-white text-[#1e3a8a]' : ''}
                                                                ${!isSunday && !isToday && !isSelected ? 'group-hover:bg-white/10 group-hover:text-white' : ''}
                                                            `}>
                                                                {day}
                                                            </span>

                                                            <div className="flex gap-1 justify-center items-center h-1.5">
                                                                {!isSunday && dayApts.length > 0 && (
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                                                                )}
                                                                {!isSunday && dayBlocks.length > 0 && (
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}

                                            {/* Blank slots at the end to complete the grid */}
                                            {calendarData.endBlanks.map((_, i) => (
                                                <div key={`end-blank-${i}`} className="bg-white/[0.01] aspect-square border-t border-l border-white/5" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selected Day Details Section */}
                                    {selectedCalendarDate && (
                                        <Motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md"
                                        >
                                            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                                                <CalendarDays size={20} className="text-teal-400" />
                                                <h3 className="text-lg font-medium text-white">
                                                    Agjenda: {formatAlbanianDate(selectedCalendarDate)}
                                                </h3>
                                            </div>

                                            <div className="space-y-4">
                                                {selectedDateSchedule.length > 0 ? selectedDateSchedule.map((item, idx) => {
                                                    if (item.itemType === 'appointment') {
                                                        return (
                                                            <div
                                                                key={`${item.id}-${idx}`}
                                                                onClick={() => setSelectedApt(item)}
                                                                className="flex items-center p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors group cursor-pointer relative overflow-hidden"
                                                            >
                                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'confirmed' ? 'bg-teal-400' : 'bg-amber-400'}`} />
                                                                <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/10 pr-4 mr-4">
                                                                    <span className="text-lg font-medium text-white">{item.time?.split(' - ')[0] || item.time}</span>
                                                                    <span className="text-xs text-white/40">{item.time?.split(' - ')[1] || ''}</span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <h4 className="text-base font-medium text-white truncate">{item.patient}</h4>
                                                                        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider
                                                                            ${item.status === 'confirmed' ? 'bg-teal-400/10 text-teal-300 border border-teal-400/20' : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'}
                                                                        `}>
                                                                            {item.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-white/60 truncate">{item.service}</p>
                                                                </div>
                                                                <div className="pl-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button className="p-2 bg-white/10 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                                                                        <ArrowRight size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    } else {
                                                        // Blocked time styling
                                                        return (
                                                            <div
                                                                key={`${item.id}-${idx}`}
                                                                className="flex items-center p-4 rounded-xl border border-white/5 bg-black/10 relative overflow-hidden opacity-80 backdrop-blur-sm"
                                                            >
                                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50" />
                                                                <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-white/5 pr-4 mr-4">
                                                                    <span className="text-lg font-medium text-white/70">{item.time?.split(' - ')[0] || item.time}</span>
                                                                    <span className="text-xs text-white/30">{item.time?.split(' - ')[1] || ''}</span>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <h4 className="text-base font-medium text-white/70 line-through decoration-white/20">{item.type}</h4>
                                                                        <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                                                                            E Bllokuar
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-white/40">{item.title}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                }) : (
                                                    <div className="py-8 text-center text-white/40 flex flex-col items-center border border-dashed border-white/10 rounded-xl">
                                                        <CalendarOff size={24} className="mb-2 opacity-20" />
                                                        <p className="text-sm">Nuk ka agjendë për këtë ditë.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Motion.div>
                                    )}
                                </div>
                            </Motion.div>
                        )}

                        {activeTab === 'time-off' && (
                            <Motion.div
                                key="time-off"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                <div className="max-w-4xl mx-auto space-y-6 pb-20">
                                    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-sm">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                            <div>
                                                <h2 className="text-xl font-medium text-white mb-1">Pushimet & Pauzat</h2>
                                                <p className="text-white/60 text-sm">Zgjidhni doktorin dhe bllokoni një interval kohor.</p>
                                            </div>

                                            {/* Doctor Selection (Pills) */}
                                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                                {doctors.map(doc => (
                                                    <button
                                                        key={doc.id}
                                                        onClick={() => setPauzaForm({ ...pauzaForm, doctor_id: doc.id })}
                                                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${pauzaForm.doctor_id === doc.id ? 'bg-white text-[#1e3a8a] shadow-sm' : 'text-white/40 hover:text-white'}`}
                                                    >
                                                        {doc.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Date Picker */}
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-4 ml-1">1. Zgjidhni Datën</label>
                                                <MiniCalendar
                                                    selected={pauzaForm.startDate}
                                                    onSelect={(d) => setPauzaForm({ ...pauzaForm, startDate: d })}
                                                />
                                            </div>

                                            {/* Time Range Pickers */}
                                            <div className="space-y-6">
                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-4 ml-1">2. Ora e Fillimit</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[...TIME_SLOTS_AM, ...TIME_SLOTS_PM].map(t => (
                                                            <button
                                                                key={`start-${t}`}
                                                                onClick={() => setPauzaForm({ ...pauzaForm, startTime: t })}
                                                                className={`py-2 rounded-xl text-xs font-medium transition-all
                                                                    ${pauzaForm.startTime === t ? 'bg-white text-[#1e3a8a]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-4 ml-1">3. Ora e Përfundimit</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[...TIME_SLOTS_AM, ...TIME_SLOTS_PM, "17:30"].map(t => (
                                                            <button
                                                                key={`end-${t}`}
                                                                onClick={() => setPauzaForm({ ...pauzaForm, endTime: t })}
                                                                className={`py-2 rounded-xl text-xs font-medium transition-all
                                                                    ${pauzaForm.endTime === t ? 'bg-white text-[#1e3a8a]' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-2 ml-1">4. Arsyeja (Opsionale)</label>
                                                <input
                                                    type="text"
                                                    value={pauzaForm.reason}
                                                    onChange={e => setPauzaForm({ ...pauzaForm, reason: e.target.value })}
                                                    placeholder="P.sh. Vizitë mjekësore, Pauza e drekës..."
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/20 transition-all"
                                                />
                                            </div>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleSavePauza}
                                                    className="px-10 py-3.5 bg-white hover:bg-teal-50 text-[#1e3a8a] font-medium text-sm rounded-full transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                                                >
                                                    Ruaj Pauzën <ArrowRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        )}

                        {activeTab === 'patients' && (
                            <Motion.div
                                key="patients"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                        <div>
                                            <h2 className="text-xl font-medium text-white flex items-center gap-2">
                                                <Users className="text-teal-400" size={20} /> Lista e Pacientëve
                                            </h2>
                                            <p className="text-white/50 text-sm mt-1">Totali: {uniquePatients.length} pacientë unikë.</p>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                                                    <th className="pb-3 px-4 font-semibold">Emri Pacientit</th>
                                                    <th className="pb-3 px-4 font-semibold">Telefoni</th>
                                                    <th className="pb-3 px-4 font-semibold">Vizita e Fundit</th>
                                                    <th className="pb-3 px-4 font-semibold text-center">Numri i Termineve</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {uniquePatients.length > 0 ? uniquePatients.map((patient, idx) => (
                                                    <tr key={idx} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors group">
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-300">
                                                                    <UserIcon size={14} />
                                                                </div>
                                                                <span className="font-medium text-white/90">{patient.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm text-white/70">{patient.phone}</td>
                                                        <td className="py-4 px-4 text-sm text-white/70">{new Date(patient.lastVisit).toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-medium text-white shadow-inner">
                                                                {patient.appointmentsCount}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="4" className="py-12 text-center text-white/40">
                                                            <Users size={32} className="mx-auto mb-3 opacity-20" />
                                                            <p className="text-sm">Nuk u gjet asnjë pacient.</p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </Motion.div>
                        )}

                        {activeTab === 'services' && (
                            <Motion.div
                                key="services"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 max-w-6xl mx-auto">
                                    {/* Services List */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                        <h2 className="text-xl font-medium text-white flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                                            <Stethoscope className="text-teal-400" size={20} /> Shërbimet e Klinikës
                                        </h2>

                                        <div className="space-y-3">
                                            {rawServices.map(service => (
                                                <div key={service.id} className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-white">{service.title}</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] text-white/40 flex items-center gap-1"><Clock size={10} /> {service.duration}</span>
                                                            <span className="text-[10px] text-white/40">•</span>
                                                            <span className="text-[10px] text-teal-300 font-medium">{service.price}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button
                                                            onClick={() => startEditing(service)}
                                                            className="p-2 text-white/20 hover:text-teal-400 hover:bg-teal-400/10 rounded-lg transition-all"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteService(service.id)}
                                                            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {rawServices.length === 0 && (
                                                <div className="py-12 text-center text-white/20">Nuk ka shërbime të regjistruara.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add New Service Form */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md h-fit sticky top-6">
                                        <h3 className="text-lg font-medium text-white mb-6">
                                            {editingService ? 'Përditëso Shërbimin' : 'Shto Shërbim të Ri'}
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Emri i Shërbimit</label>
                                                <input
                                                    type="text"
                                                    value={newService.title}
                                                    onChange={e => setNewService({ ...newService, title: e.target.value })}
                                                    placeholder="P.sh. Pastrim Dhëmbësh"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/20 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Kohëzgjatja</label>
                                                <input
                                                    type="text"
                                                    value={newService.duration}
                                                    onChange={e => setNewService({ ...newService, duration: e.target.value })}
                                                    placeholder="P.sh. 30 - 45 min"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/20 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Çmimi</label>
                                                <input
                                                    type="text"
                                                    value={newService.price}
                                                    onChange={e => setNewService({ ...newService, price: e.target.value })}
                                                    placeholder="P.sh. Nga €40 ose Sipas rastit"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400/50 text-white placeholder-white/20 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <button
                                                    onClick={handleAddService}
                                                    className="w-full py-3.5 bg-white text-[#1e3a8a] font-semibold rounded-xl hover:bg-teal-50 transition-all shadow-lg mt-2 flex items-center justify-center gap-2"
                                                >
                                                    {editingService ? <Check size={18} /> : <Plus size={18} />}
                                                    {editingService ? 'Ruaj Ndryshimet' : 'Shto Shërbimin'}
                                                </button>
                                                {editingService && (
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="w-full py-2.5 bg-white/5 text-white/60 text-sm font-medium rounded-xl hover:bg-white/10 transition-all"
                                                    >
                                                        Anulo
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <Motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                                    <div className="space-y-6">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                            <h2 className="text-xl font-medium text-white flex items-center gap-2 mb-6">
                                                <Settings className="text-teal-400" size={20} /> Setimet Kryesore
                                            </h2>

                                            <div className="space-y-4">
                                                {/* Notification Settings */}
                                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-teal-400/10 text-teal-300 rounded-lg">
                                                            <Bell size={18} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-white">Njoftimet Zanor</h4>
                                                            <p className="text-[11px] text-white/40">Dëgjo zilën kur vjen një rezervim i ri</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                                        className={`w-11 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-teal-400' : 'bg-white/20'}`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${notificationsEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white/10 text-white/70 rounded-lg">
                                                            <Moon size={18} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium text-white">Modaliteti i Errët</h4>
                                                            <p className="text-[11px] text-white/40">Pamja e sistemit e detyruar në ngjyrë të errët</p>
                                                        </div>
                                                    </div>
                                                    <button className="w-11 h-6 rounded-full relative bg-teal-400 transition-colors cursor-not-allowed">
                                                        <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 left-[22px] shadow-sm" />
                                                    </button>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                                            <h2 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                                                <Shield className="text-white/60" size={18} /> Siguria dhe Fjalëkalimi
                                            </h2>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Fjalëkalimi Aktual</label>
                                                    <input type="password" placeholder="••••••••" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-teal-400/50 text-white transition-all" />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-teal-300 mb-1.5 ml-1">Fjalëkalimi i Ri</label>
                                                    <input type="password" placeholder="Krijo fjalëkalim të ri" className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm outline-none focus:border-teal-400/50 text-white transition-all" />
                                                </div>
                                                <button className="px-5 py-2 mt-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors border border-white/10">
                                                    Ndrysho Fjalëkalimin
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md text-center">
                                            <div className="w-16 h-16 rounded-full bg-white/10 mx-auto mb-4 border-2 border-white/20 flex items-center justify-center p-1">
                                                <img src={currentDoctor?.avatar} alt={currentDoctor?.name} className="w-full h-full rounded-full bg-black/20" />
                                            </div>
                                            <h3 className="text-white font-medium mb-1">{currentDoctor?.name}</h3>
                                            <p className="text-teal-300 text-xs uppercase tracking-wider font-semibold mb-4">{currentDoctor?.role}</p>

                                            <div className="flex justify-center gap-2">
                                                <button className="p-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                                                    <Mail size={16} />
                                                </button>
                                                <button className="p-2 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                                                    <Smartphone size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ── BOOKING DETAILS MODAL ── */}
            <AnimatePresence>
                {selectedApt && (
                    <>
                        <Motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#0d1b2a]/60 backdrop-blur-md z-50 transition-all"
                            onClick={() => setSelectedApt(null)}
                        />
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#1e3a8a] border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            <div className="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-lg font-medium text-white">Detajet e Rezervimit</h3>
                                <button onClick={() => setSelectedApt(null)} className="text-white/60 hover:text-white transition-colors bg-white/10 p-1.5 rounded-md hover:bg-white/20">
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-5 md:p-6 space-y-6">
                                {/* Header / Patient Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-300 shadow-inner">
                                        <UserIcon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-medium text-white">{selectedApt.patient}</h4>
                                        <div className="text-sm text-teal-100/70">{selectedApt.service}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-1">Koha</div>
                                        <div className="text-sm text-white font-medium flex items-center gap-1.5">
                                            <Clock size={14} className="text-teal-400" /> {selectedApt.time}
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-1">Statusi</div>
                                        <div className="text-sm text-white font-medium flex items-center gap-1.5">
                                            {selectedApt.status === 'confirmed' ? (
                                                <><CheckCircle size={14} className="text-teal-400" /> Konfirmuar</>
                                            ) : (
                                                <><Clock size={14} className="text-amber-400" /> Në Pritje</>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-2">Doktori</div>
                                    <div className="flex items-center gap-3">
                                        <img src={doctors.find(d => d.id === selectedApt.doctorId)?.avatar} alt="" width="24" height="24" className="w-6 h-6 rounded bg-white/10" />
                                        <span className="text-sm text-white/90 font-medium">{doctors.find(d => d.id === selectedApt.doctorId)?.name}</span>
                                    </div>
                                </div>

                                {selectedApt.phone && (
                                    <div>
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-2">Telefoni</div>
                                        <div className="text-sm text-white/90 font-medium">{selectedApt.phone}</div>
                                    </div>
                                )}

                                {selectedApt.notes && (
                                    <div>
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-white/50 mb-2">Shënime</div>
                                        <p className="text-sm text-white/80 bg-white/5 p-3.5 rounded-xl border border-white/10 leading-relaxed">
                                            {selectedApt.notes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
                                <button
                                    onClick={() => handleToggleStatus(selectedApt.id, selectedApt.status)}
                                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm
                                        ${selectedApt.status === 'confirmed'
                                            ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20 hover:bg-amber-400/20'
                                            : 'bg-teal-400/10 text-teal-300 border border-teal-400/20 hover:bg-teal-400/20'}
                                    `}
                                >
                                    <Edit2 size={16} /> {selectedApt.status === 'confirmed' ? 'Bëje në Pritje' : 'Konfirmo'}
                                </button>
                                <button
                                    onClick={() => handleDeleteApt(selectedApt.id)}
                                    className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> Anulo / Fshi
                                </button>
                            </div>
                        </Motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MANUAL BOOKING MODAL */}
            <AnimatePresence>
                {showBookingModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-[#00122e]/90 backdrop-blur-xl overflow-y-auto">
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/5 border border-white/10 rounded-3xl w-full max-w-4xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 z-10">
                                <button onClick={() => { setShowBookingModal(false); setBookingStep(0); }} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-[600px]">
                                {/* Sidebar Info */}
                                <div className="bg-white/[0.03] border-r border-white/5 p-8 flex flex-col">
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 text-teal-400 mb-2">
                                            <Shield size={16} />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Rezervim Manual</span>
                                        </div>
                                        <h2 className="text-2xl font-medium text-white">Shto Terminin</h2>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        {/* STEPS INDICATOR */}
                                        <div className="space-y-4">
                                            {["Shërbimi", "Data & Ora", "Të Dhënat"].map((label, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                                        ${bookingStep > idx ? 'bg-teal-400 text-[#00122e]' : bookingStep === idx ? 'bg-white text-[#00122e]' : 'bg-white/5 text-white/20'}`}>
                                                        {bookingStep > idx ? <Check size={14} /> : idx + 1}
                                                    </div>
                                                    <span className={`text-sm font-medium ${bookingStep >= idx ? 'text-white' : 'text-white/20'}`}>{label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                        <p className="text-[10px] text-white/30 leading-relaxed italic">Duke shtuar këtë termin, ju bllokoni automatikisht hapësirën kohore në agjendë.</p>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="p-8 md:p-12">
                                    <AnimatePresence mode="wait">
                                        {/* STEP 1: SERVICE */}
                                        {bookingStep === 0 && (
                                            <Motion.div key="b0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                                <h3 className="text-xl font-medium text-white mb-6">Zgjidhni shërbimin</h3>
                                                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {rawServices.map(srv => (
                                                        <button
                                                            key={srv.id}
                                                            onClick={() => { setBookingData({ ...bookingData, service: srv.slug }); setBookingStep(1); }}
                                                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group
                                                                ${bookingData.service === srv.slug ? 'bg-white text-[#1e3a8a] border-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'}`}
                                                        >
                                                            <div>
                                                                <h4 className="font-medium text-sm">{srv.title}</h4>
                                                                <span className="text-[10px] opacity-60 italic">{srv.duration}</span>
                                                            </div>
                                                            <Plus size={16} className={bookingData.service === srv.slug ? 'hidden' : 'opacity-0 group-hover:opacity-100 transition-opacity'} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </Motion.div>
                                        )}

                                        {/* STEP 2: DATE & TIME */}
                                        {bookingStep === 1 && (
                                            <Motion.div key="b1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                                <div className="flex gap-4 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                                                    {doctors.map(doc => (
                                                        <button
                                                            key={doc.id}
                                                            onClick={() => setBookingData({ ...bookingData, doctorId: doc.id, time: '' })}
                                                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-w-[200px]
                                                                ${bookingData.doctorId === doc.id ? 'bg-white/10 border-teal-400/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                                        >
                                                            <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full bg-black/20" />
                                                            <div className="text-left">
                                                                <div className="font-medium text-xs text-white">{doc.name}</div>
                                                                <div className="text-[10px] text-white/50">{doc.role}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                                        <MiniCalendar selected={bookingData.date} onSelect={(d) => setBookingData({ ...bookingData, date: d, time: '' })} />
                                                    </div>
                                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                                        <h4 className="text-xs font-bold uppercase tracking-widest text-teal-300 mb-4 ml-1">Orari i Lirë</h4>
                                                        <div className="grid grid-cols-3 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                                            {[...TIME_SLOTS_AM, ...TIME_SLOTS_PM].map(t => {
                                                                const dateStr = bookingData.date ? `${bookingData.date.getFullYear()}-${String(bookingData.date.getMonth() + 1).padStart(2, '0')}-${String(bookingData.date.getDate()).padStart(2, '0')}` : '';
                                                                const selectedSrv = rawServices.find(s => s.slug === bookingData.service);
                                                                const neededSlots = getDurationSlots(t, selectedSrv?.title || '').length;
                                                                let isOccupied = false;
                                                                let [h, m] = t.split(':').map(Number);
                                                                let currentMins = h * 60 + m;

                                                                for (let i = 0; i < neededSlots; i++) {
                                                                    let hr = Math.floor(currentMins / 60);
                                                                    let min = currentMins % 60;
                                                                    let checkT = `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                                                                    if (rawAppointments.some(a => String(a.date).split('T')[0] === dateStr && a.doctor_id === bookingData.doctorId && a.time === checkT)) isOccupied = true;
                                                                    if (rawBlockedTimes.some(b => String(b.date).split('T')[0] === dateStr && (b.doctor_id === bookingData.doctorId || !b.doctor_id) && b.time.includes(checkT))) isOccupied = true;
                                                                    currentMins += 30;
                                                                }

                                                                return (
                                                                    <button
                                                                        key={t}
                                                                        disabled={isOccupied || !bookingData.date}
                                                                        onClick={() => setBookingData({ ...bookingData, time: t })}
                                                                        className={`py-2 rounded-lg text-xs font-medium transition-all
                                                                            ${isOccupied ? 'bg-white/5 text-white/10 cursor-not-allowed line-through' :
                                                                                bookingData.time === t ? 'bg-white text-[#1e3a8a] shadow-lg scale-105' : 'bg-white/5 text-white/60 hover:bg-white/20'}`}
                                                                    >
                                                                        {t}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center pt-4">
                                                    <button onClick={() => setBookingStep(0)} className="text-white/40 hover:text-white flex items-center gap-2 text-sm transition-colors">
                                                        <ChevronLeft size={16} /> Mbrapa
                                                    </button>
                                                    <button
                                                        disabled={!bookingData.date || !bookingData.time}
                                                        onClick={() => setBookingStep(2)}
                                                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all
                                                            ${(!bookingData.date || !bookingData.time) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white text-[#1e3a8a] hover:bg-teal-50 shadow-lg'}`}
                                                    >
                                                        Vazhdo
                                                    </button>
                                                </div>
                                            </Motion.div>
                                        )}

                                        {/* STEP 3: DETAILS */}
                                        {bookingStep === 2 && (
                                            <Motion.div key="b2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                                <h3 className="text-xl font-medium text-white mb-6">Të dhënat e pacientit</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-teal-300 ml-1">Emri *</label>
                                                        <input type="text" value={bookingData.firstName} onChange={e => setBookingData({ ...bookingData, firstName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-400/50 outline-none transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-teal-300 ml-1">Mbiemri *</label>
                                                        <input type="text" value={bookingData.lastName} onChange={e => setBookingData({ ...bookingData, lastName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-400/50 outline-none transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5 col-span-2">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-teal-300 ml-1">Telefoni *</label>
                                                        <input type="tel" value={bookingData.phone} onChange={e => setBookingData({ ...bookingData, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-400/50 outline-none transition-all" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-teal-300 ml-1">Shënime (Opsionale)</label>
                                                    <textarea rows={3} value={bookingData.notes} onChange={e => setBookingData({ ...bookingData, notes: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-teal-400/50 outline-none transition-all resize-none" />
                                                </div>
                                                <div className="flex justify-between items-center pt-4">
                                                    <button onClick={() => setBookingStep(1)} className="text-white/40 hover:text-white flex items-center gap-2 text-sm transition-colors">
                                                        <ChevronLeft size={16} /> Mbrapa
                                                    </button>
                                                    <button
                                                        disabled={!bookingData.firstName || !bookingData.lastName || !bookingData.phone}
                                                        onClick={handleManualBooking}
                                                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all
                                                            ${(!bookingData.firstName || !bookingData.lastName || !bookingData.phone) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-teal-400 text-[#00122e] hover:bg-teal-300 shadow-lg'}`}
                                                    >
                                                        Konfirmo Rezervimin
                                                    </button>
                                                </div>
                                            </Motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PAUSE SUCCESS MODAL */}
            <AnimatePresence>
                {showPauseSuccess && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0f172a]/80 backdrop-blur-md">
                        <Motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e3a8a] border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-blue-500" />

                            <Motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#1e3a8a] shadow-xl"
                            >
                                <Check size={40} strokeWidth={3} />
                            </Motion.div>

                            <h3 className="text-2xl font-light text-white mb-2">Pauza u Ruajt!</h3>
                            <p className="text-white/60 text-sm mb-8">
                                Interval i zgjedhur është bllokuar me sukses në agjendë.
                            </p>

                            <button
                                onClick={() => setShowPauseSuccess(false)}
                                className="w-full py-3.5 bg-white text-[#1e3a8a] font-semibold rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
                            >
                                Kuptova
                            </button>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
