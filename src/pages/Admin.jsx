import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import {
    Calendar, Users, Clock, Settings, LogOut,
    Plus, ChevronRight, ChevronLeft, CalendarOff,
    Search, Bell, CalendarDays, X, Stethoscope
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';

// Admin Sub-Components
import DailyScheduleTab from '../components/admin/DailyScheduleTab';
import MonthlyCalendarTab from '../components/admin/MonthlyCalendarTab';
import PatientsTab from '../components/admin/PatientsTab';
import TimeOffTab from '../components/admin/TimeOffTab';
import ServicesTab from '../components/admin/ServicesTab';
import SettingsTab from '../components/admin/SettingsTab';
import AppointmentDetailsModal from '../components/admin/AppointmentDetailsModal';
import ManualBookingModal from '../components/admin/ManualBookingModal';
import PauseSuccessModal from '../components/admin/PauseSuccessModal';

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
                fetch(`${API_URL}/api/appointments`),
                fetch(`${API_URL}/api/blocked-times`),
                fetch(`${API_URL}/api/services`),
                fetch(`${API_URL}/api/doctors`)
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
        startDate: null,
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
            const res = await fetch(`${API_URL}/api/appointments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_name: `${bookingData.firstName} ${bookingData.lastName}`,
                    patient_phone: bookingData.phone,
                    patient_email: bookingData.email,
                    service: rawServices.find(s => s.slug === bookingData.service || s.id === bookingData.service)?.title || bookingData.service,
                    date: bookingData.date ? `${bookingData.date.getFullYear()} - ${String(bookingData.date.getMonth() + 1).padStart(2, '0')
                        }-${String(bookingData.date.getDate()).padStart(2, '0')} ` : '',
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
    const [editingService, setEditingService] = useState(null);

    const handleAddService = async () => {
        if (!newService.title || !newService.duration || !newService.price) return alert("Plotësoni të gjitha fushat!");
        try {
            if (editingService) {
                const res = await fetch(`${API_URL}/api/services/${editingService}`, {
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
                const res = await fetch(`${API_URL}/api/services`, {
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
    };

    const cancelEditing = () => {
        setEditingService(null);
        setNewService({ title: '', duration: '', price: '' });
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm("Jeni të sigurt?")) return;
        try {
            await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) { console.error(err); }
    };

    const handleSavePauza = async () => {
        if (!pauzaForm.startDate || !pauzaForm.startTime || !pauzaForm.endTime) {
            return alert("Plotësoni datën dhe orë!");
        }

        if (pauzaForm.startTime >= pauzaForm.endTime) {
            return alert("Ora e përfundimit duhet të jetë pas orës së fillimit!");
        }

        try {
            const d = pauzaForm.startDate;
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const timeStr = `${pauzaForm.startTime} - ${pauzaForm.endTime}`;
            const res = await fetch(`${API_URL}/api/blocked-times`, {
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
            await fetch(`${API_URL}/api/appointments/${id}`, { method: 'DELETE' });
            setSelectedApt(null);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
            await fetch(`${API_URL}/api/appointments/${id}`, {
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
    const [currentDate, setCurrentDate] = useState(todayInit);
    const [selectedDailyDate, setSelectedDailyDate] = useState(todayInit);
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

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

        const year = selectedCalendarDate.getFullYear();
        const month = String(selectedCalendarDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedCalendarDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const dayApts = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === dateStr).map(a => ({ ...a, itemType: 'appointment' }));
        const dayBlocks = BLOCKED_TIMES.filter(b => b.doctorId === selectedDoc && b.date === dateStr).map(b => ({ ...b, itemType: 'blocked' }));

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
                            <DailyScheduleTab
                                doctors={doctors}
                                selectedDoc={selectedDoc}
                                setSelectedDoc={setSelectedDoc}
                                selectedDailyDate={selectedDailyDate}
                                setSelectedDailyDate={setSelectedDailyDate}
                                selectedDailySchedule={selectedDailySchedule}
                                APPOINTMENTS={APPOINTMENTS}
                                setSelectedApt={setSelectedApt}
                                setShowBookingModal={setShowBookingModal}
                                setActiveTab={setActiveTab}
                            />
                        )}

                        {activeTab === 'month-calendar' && (
                            <MonthlyCalendarTab
                                calendarData={calendarData}
                                selectedDoc={selectedDoc}
                                prevMonth={prevMonth}
                                nextMonth={nextMonth}
                                resetToToday={resetToToday}
                                APPOINTMENTS={APPOINTMENTS}
                                BLOCKED_TIMES={BLOCKED_TIMES}
                                selectedCalendarDate={selectedCalendarDate}
                                setSelectedCalendarDate={setSelectedCalendarDate}
                                selectedDateSchedule={selectedDateSchedule}
                                setSelectedApt={setSelectedApt}
                                currentDate={currentDate}
                                formatAlbanianDate={formatAlbanianDate}
                            />
                        )}

                        {activeTab === 'patients' && (
                            <PatientsTab uniquePatients={uniquePatients} />
                        )}

                        {activeTab === 'time-off' && (
                            <TimeOffTab
                                doctors={doctors}
                                pauzaForm={pauzaForm}
                                setPauzaForm={setPauzaForm}
                                handleSavePauza={handleSavePauza}
                            />
                        )}

                        {activeTab === 'services' && (
                            <ServicesTab
                                rawServices={rawServices}
                                newService={newService}
                                setNewService={setNewService}
                                editingService={editingService}
                                handleAddService={handleAddService}
                                startEditing={startEditing}
                                cancelEditing={cancelEditing}
                                handleDeleteService={handleDeleteService}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsTab
                                notificationsEnabled={notificationsEnabled}
                                setNotificationsEnabled={setNotificationsEnabled}
                                currentDoctor={currentDoctor}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ── MODALS ── */}
            <AppointmentDetailsModal
                selectedApt={selectedApt}
                setSelectedApt={setSelectedApt}
                doctors={doctors}
                handleToggleStatus={handleToggleStatus}
                handleDeleteApt={handleDeleteApt}
            />

            <ManualBookingModal
                showBookingModal={showBookingModal}
                setShowBookingModal={setShowBookingModal}
                bookingStep={bookingStep}
                setBookingStep={setBookingStep}
                bookingData={bookingData}
                setBookingData={setBookingData}
                doctors={doctors}
                rawServices={rawServices}
                rawAppointments={rawAppointments}
                rawBlockedTimes={rawBlockedTimes}
                handleManualBooking={handleManualBooking}
                getDurationSlots={getDurationSlots}
            />

            <PauseSuccessModal
                showPauseSuccess={showPauseSuccess}
                setShowPauseSuccess={setShowPauseSuccess}
            />
        </div>
    );
}
