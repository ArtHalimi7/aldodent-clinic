import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import {
    Calendar as CalendarIcon, Users, Clock, LogOut,
    Plus, Search, Bell, CalendarDays, Stethoscope, Menu,
    LayoutDashboard, UserCircle, ChevronDown, ChevronRight, ChevronLeft, Coffee
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Admin Sub-Components
import OverviewTab from '../components/admin/OverviewTab';
import DailyScheduleTab from '../components/admin/DailyScheduleTab';
import MonthlyCalendarTab from '../components/admin/MonthlyCalendarTab';
import PatientsTab from '../components/admin/PatientsTab';
import TimeOffTab from '../components/admin/TimeOffTab';
import ServicesTab from '../components/admin/ServicesTab';
import AppointmentDetailsModal from '../components/admin/AppointmentDetailsModal';
import ManualBookingModal from '../components/admin/ManualBookingModal';
import PauseSuccessModal from '../components/admin/PauseSuccessModal';

import logoUrl from '../assets/img/logowhite.png';

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
    const { token, user, logout } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [activeTab, setActiveTab] = useState('overview'); // Default to overview
    const [selectedApt, setSelectedApt] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [globalSearch, setGlobalSearch] = useState('');

    // BACKEND STATE
    const [rawAppointments, setRawAppointments] = useState([]);
    const [rawBlockedTimes, setRawBlockedTimes] = useState([]);
    const [rawServices, setRawServices] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            const [aptRes, blockRes, servRes, docRes] = await Promise.all([
                fetch(`${API_URL}/api/appointments`, { headers: { 'Authorization': `Bearer ${token}` } }),
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
        if (rawAppointments.length === 0) return;

        if (prevAptCountRef.current === -1) {
            localStorage.setItem('aldodent_last_apt_count', rawAppointments.length);
            prevAptCountRef.current = rawAppointments.length;
            return;
        }

        if (rawAppointments.length > prevAptCountRef.current) {
            const newCount = rawAppointments.length - prevAptCountRef.current;
            setUnreadCount(prev => prev + newCount);

            const newAppointments = rawAppointments.slice(-newCount);
            setRecentNotifications(prev => {
                const updated = [...newAppointments.reverse(), ...prev].slice(0, 10);
                localStorage.setItem('aldodent_recent_notifs', JSON.stringify(updated));
                return updated;
            });

            setShowNotifications(true);

            if (notificationsEnabled) {
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
                    audio.volume = 0.4;
                    audio.play().catch(e => console.log('Audio disabled by browser', e));
                } catch { }
            }

            localStorage.setItem('aldodent_last_apt_count', rawAppointments.length);
            prevAptCountRef.current = rawAppointments.length;
        } else if (rawAppointments.length < prevAptCountRef.current) {
            localStorage.setItem('aldodent_last_apt_count', rawAppointments.length);
            prevAptCountRef.current = rawAppointments.length;
        }
    }, [rawAppointments, notificationsEnabled]);

    const APPOINTMENTS = useMemo(() => {
        return rawAppointments.map(a => {
            const dateStr = typeof a.date === 'string' && a.date.includes('T') ? a.date.split('T')[0] : a.date;
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
            const dateStr = typeof b.date === 'string' && b.date.includes('T') ? b.date.split('T')[0] : b.date;
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
    const [pauzaForm, setPauzaForm] = useState({ doctor_id: doctors[0]?.id || '', startDate: null, startTime: '', endTime: '', reason: '' });

    // MANUAL BOOKING STATE
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingStep, setBookingStep] = useState(0);
    const [bookingData, setBookingData] = useState({ service: null, doctorId: doctors[0]?.id || '', date: null, time: '', firstName: '', lastName: '', phone: '', email: '', notes: '' });

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
                    date: bookingData.date ? `${bookingData.date.getFullYear()}-${String(bookingData.date.getMonth() + 1).padStart(2, '0')}-${String(bookingData.date.getDate()).padStart(2, '0')}` : '',
                    time: bookingData.time,
                    doctor_id: bookingData.doctorId,
                    notes: bookingData.notes
                })
            });
            if (res.ok) {
                setShowBookingModal(false);
                setBookingStep(0);
                setBookingData({ service: null, doctorId: doctors[0]?.id || '', date: null, time: '', firstName: '', lastName: '', phone: '', email: '', notes: '' });
                fetchData();
            } else {
                alert("Gabim gjatë rezervimit.");
            }
        } catch (error) { console.error(error); }
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
        try { await fetch(`${API_URL}/api/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); fetchData(); } catch (err) { console.error(err); }
    };

    const handleSavePauza = async () => {
        if (!pauzaForm.startDate || !pauzaForm.startTime || !pauzaForm.endTime) return alert("Plotësoni datën dhe orë!");
        if (pauzaForm.startTime >= pauzaForm.endTime) return alert("Ora e përfundimit duhet të jetë pas orës së fillimit!");
        try {
            const d = pauzaForm.startDate;
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const timeStr = `${pauzaForm.startTime} - ${pauzaForm.endTime}`;
            const res = await fetch(`${API_URL}/api/blocked-times`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
        } catch (error) { console.error(error); }
    };

    // APPOINTMENT MODAL ACTIONS
    const handleDeleteApt = async (id) => {
        if (!window.confirm("Jeni të sigurt?")) return;
        try { await fetch(`${API_URL}/api/appointments/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); setSelectedApt(null); fetchData(); } catch (err) { console.error(err); }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed';
            await fetch(`${API_URL}/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            setSelectedApt(prev => prev ? { ...prev, status: newStatus } : null);
            fetchData();
        } catch (err) { console.error(err); }
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

    const prevMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); setSelectedCalendarDate(null); };
    const nextMonth = () => { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); setSelectedCalendarDate(null); };
    const resetToToday = () => { setCurrentDate(new Date()); setSelectedCalendarDate(null); };

    const selectedDateSchedule = useMemo(() => {
        if (!selectedCalendarDate) return [];
        const year = selectedCalendarDate.getFullYear();
        const month = String(selectedCalendarDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedCalendarDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        const dayApts = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === dateStr).map(a => ({ ...a, itemType: 'appointment' }));
        const dayBlocks = BLOCKED_TIMES.filter(b => b.doctorId === selectedDoc && b.date === dateStr).map(b => ({ ...b, itemType: 'blocked' }));
        return [...dayApts, ...dayBlocks].sort((a, b) => a.time.split(' - ')[0].localeCompare(b.time.split(' - ')[0]));
    }, [selectedCalendarDate, selectedDoc, APPOINTMENTS, BLOCKED_TIMES]);

    // Unique Patients Logic
    const uniquePatients = useMemo(() => {
        const patientsMap = new Map();
        APPOINTMENTS.forEach(apt => {
            const key = `${apt.patient}-${apt.phone}`;
            if (!patientsMap.has(key)) {
                patientsMap.set(key, { id: key, name: apt.patient, phone: apt.phone || 'N/A', appointmentsCount: 1, lastVisit: apt.date });
            } else {
                const existing = patientsMap.get(key);
                existing.appointmentsCount += 1;
                if (apt.date > existing.lastVisit) existing.lastVisit = apt.date;
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
        return [...dayApts, ...dayBlocks].sort((a, b) => a.time.split(' - ')[0].localeCompare(b.time.split(' - ')[0]));
    }, [selectedDailyDateStr, selectedDoc, APPOINTMENTS, BLOCKED_TIMES]);

    // (Removed unused currentDoctor)

    // SIDEBAR ITEMS
    const SIDEBAR_ITEMS = [
        { id: 'overview', icon: LayoutDashboard, label: 'Pasqyra' },
        { id: 'calendar', icon: Clock, label: 'Orari Ditor' },
        { id: 'month-calendar', icon: CalendarDays, label: 'Kalendari' },
        { id: 'patients', icon: Users, label: 'Pacientët' },
        { id: 'services', icon: Stethoscope, label: 'Shërbimet' },
        { id: 'time-off', icon: Coffee, label: 'Pauzat' },
    ];

    return (
        <div className="min-h-screen bg-[#1e3a8a] text-white flex overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Helmet>
                <title>Admin Dashboard — AldoDent</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Background Glows (Same as Services.jsx) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#172554]/30 rounded-full blur-[120px]" />
                {/* Structured Mesh & Flow */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1440 1200" preserveAspectRatio="xMidYMid slice" fill="none">
                    <path d="M0 250 Q 360 200, 720 250 T 1440 230" stroke="white" strokeWidth="0.7" />
                    <path d="M0 650 Q 400 600, 800 650 T 1440 630" stroke="white" strokeWidth="0.6" />
                    <line x1="360" y1="0" x2="360" y2="1200" stroke="white" strokeWidth="0.15" strokeDasharray="6 12" />
                    <line x1="1080" y1="0" x2="1080" y2="1200" stroke="white" strokeWidth="0.15" strokeDasharray="6 12" />
                </svg>
            </div>

            {/* ── LEFT SIDEBAR (Modern SaaS Dark) ── */}
            <aside className={`fixed top-0 left-0 h-full bg-[#1e3a8a]/80 backdrop-blur-xl border-r border-white/10 z-40 transition-all duration-300 ease-in-out hidden md:flex flex-col pt-6 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="px-6 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img
                            src={logoUrl}
                            alt="AldoDent Logo"
                            className={`h-9 w-auto object-contain transition-all duration-300 ${!sidebarOpen && 'object-left'}`}
                            style={!sidebarOpen ? { width: '28px', objectPosition: '0% 50%' } : {}}
                        />
                        {sidebarOpen && <span className="font-light text-2xl text-white tracking-tight whitespace-nowrap">AldoDent</span>}
                    </div>
                </div>

                <div className="px-4 mb-8">
                    <button
                        onClick={() => setShowBookingModal(true)}
                        className={`w-full bg-teal-400 hover:bg-teal-300 text-[#1e3a8a] rounded-2xl py-3.5 flex items-center justify-center font-semibold text-sm transition-all shadow-lg shadow-teal-400/20 ${!sidebarOpen ? 'px-0' : 'px-4 gap-2'}`}
                    >
                        <Plus size={18} /> {sidebarOpen && <span className="uppercase tracking-widest font-bold text-xs">Shto Termin</span>}
                    </button>
                </div>

                <nav className="flex-1 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                    {SIDEBAR_ITEMS.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); if (item.id !== 'month-calendar') setSelectedCalendarDate(null); }}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all
                                        ${isActive
                                        ? 'bg-white/10 text-teal-300 border border-white/5 font-medium shadow-inner'
                                        : 'text-white/50 hover:bg-white/[0.05] hover:text-white font-light border border-transparent'}
                                    `}
                                title={!sidebarOpen ? item.label : ''}
                            >
                                <item.icon size={20} className={isActive ? 'text-teal-300' : 'text-white/40'} strokeWidth={isActive ? 2 : 1.5} />
                                {sidebarOpen && <span className="text-sm whitespace-nowrap tracking-wide">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 mt-auto">
                    <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 font-light transition-all group">
                        <LogOut size={20} className="text-rose-400/50 group-hover:text-rose-400 transition-colors" strokeWidth={1.5} />
                        {sidebarOpen && <span className="text-sm whitespace-nowrap tracking-wide">Dil nga Sistemi</span>}
                    </button>
                </div>
            </aside>

            {/* ── MAIN CONTENT AREA ── */}
            <main className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 relative z-10 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} pb-24 md:pb-0`}>

                {/* Topbar Header */}
                <header className="h-20 bg-transparent border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-30 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        {/* Desktop Menu Toggle */}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                            <Menu size={20} strokeWidth={1.5} />
                        </button>

                        {/* Desktop Breadcrumbs */}
                        <div className="hidden md:flex items-center text-sm font-light text-white/40 tracking-wide uppercase">
                            Menaxhimi <ChevronRight size={14} className="mx-3 text-white/20" />
                            <span className="text-teal-300">{SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}</span>
                        </div>

                        {/* Mobile Logo */}
                        <div className="flex md:hidden items-center gap-3">
                            <img src={logoUrl} alt="AldoDent Logo" className="h-8 w-auto object-contain" />
                            <span className="font-light text-xl text-white tracking-tight">AldoDent</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                        {/* Global Search */}
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                            <input
                                type="text"
                                placeholder="Kërko pacient..."
                                value={globalSearch}
                                onChange={(e) => {
                                    setGlobalSearch(e.target.value);
                                    if (e.target.value.trim() !== '' && activeTab !== 'patients') {
                                        setActiveTab('patients');
                                    }
                                }}
                                className="pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all w-64 text-white placeholder-white/30 font-light"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }}
                                className="relative p-2.5 border border-white/10 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors bg-white/5 shadow-inner"
                            >
                                <Bell size={18} strokeWidth={1.5} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4.5 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-sm border-2 border-[#1e3a8a]">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <Motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="fixed left-4 right-4 top-24 md:absolute md:left-auto md:right-0 md:top-full md:mt-4 md:w-80 md:max-w-none bg-[#1e3a8a]/95 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden origin-top md:origin-top-right"
                                    >
                                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                            <h3 className="text-sm font-light text-white tracking-wider">Njoftimet</h3>
                                            {recentNotifications.length > 0 && (
                                                <button onClick={() => { setRecentNotifications([]); localStorage.removeItem('aldodent_recent_notifs'); }} className="text-[10px] text-white/40 hover:text-teal-300 uppercase tracking-widest font-medium transition-colors">Pastro</button>
                                            )}
                                        </div>
                                        <div className="max-h-[60vh] md:max-h-80 overflow-y-auto custom-scrollbar">
                                            {recentNotifications.length === 0 ? (
                                                <div className="p-10 flex flex-col items-center justify-center text-center">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                                                        <Bell size={24} />
                                                    </div>
                                                    <div className="text-white/40 text-sm font-light">Nuk keni asnjë njoftim të ri.</div>
                                                </div>
                                            ) : (
                                                recentNotifications.map((notif, idx) => (
                                                    <div key={idx} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-300 shrink-0">
                                                            <Bell size={16} strokeWidth={1.5} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white mb-1">Rezervim i ri</div>
                                                            <div className="text-xs text-white/50 mb-2 font-light"><span className="text-teal-300 font-medium">{notif.patient_name}</span> rezervoi <span className="text-white/80">{notif.service}</span></div>
                                                            <div className="text-[10px] text-white/30 flex items-center gap-3 font-medium uppercase tracking-wider">
                                                                <span className="flex items-center gap-1.5"><Clock size={10} /> {notif.time}</span>
                                                                <span className="flex items-center gap-1.5"><CalendarDays size={10} /> {new Date(notif.date).toLocaleDateString()}</span>
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

                        <div className="w-[1px] h-6 bg-white/10 mx-1 md:mx-2" />

                        {/* Profile Dropdown */}
                        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0">
                            {(() => {
                                const loggedInDoctor = doctors.find(d =>
                                    d.name.toLowerCase() === (user?.name || '').toLowerCase() ||
                                    d.name.toLowerCase().includes((user?.name || '').toLowerCase())
                                );

                                if (loggedInDoctor) {
                                    return (
                                        <>
                                            <div className="text-right hidden sm:block">
                                                <div className="text-sm font-medium text-white leading-tight group-hover:text-teal-300 transition-colors uppercase tracking-wider">
                                                    Dr. {(loggedInDoctor.name || user?.name || '').replace(/^Dr\.\s*/i, '')}
                                                </div>
                                                <div className="text-xs text-white/40 font-light mt-1 tracking-wide">
                                                    {loggedInDoctor.role || 'Kryedoktor & Kirurg'}
                                                </div>
                                            </div>
                                            {loggedInDoctor.avatar ? (
                                                <img src={loggedInDoctor.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-teal-300 transition-colors" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:border-teal-300 group-hover:text-teal-300 transition-colors">
                                                    <UserCircle size={22} strokeWidth={1.5} />
                                                </div>
                                            )}
                                        </>
                                    );
                                }

                                // Non-doctor fallback
                                return (
                                    <>
                                        <div className="text-right hidden sm:block">
                                            <div className="text-sm font-medium text-white leading-tight group-hover:text-teal-300 transition-colors uppercase tracking-wider">
                                                ADMIN
                                            </div>
                                            <div className="text-xs text-white/40 font-light mt-1 tracking-wide uppercase">
                                                {user?.name || 'Administrator'}
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:border-teal-300 group-hover:text-teal-300 transition-colors">
                                            <UserCircle size={22} strokeWidth={1.5} />
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </header>

                {/* Tab Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">
                    <div className="max-w-7xl mx-auto">

                        {/* Doctor Selector Header (if applicable for tab) */}
                        {['calendar', 'month-calendar'].includes(activeTab) && (
                            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-full p-2 flex items-center gap-2 mb-8 w-fit shadow-inner">
                                {doctors.map(doc => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setSelectedDoc(doc.id)}
                                        className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all text-sm font-medium
                                            ${selectedDoc === doc.id
                                                ? 'bg-teal-400/20 text-teal-300 border border-teal-400/30'
                                                : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'}`}
                                    >
                                        <img src={doc.avatar} alt="" className="w-6 h-6 rounded-full border border-white/20" />
                                        <span className="font-light tracking-wide">{doc.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <OverviewTab
                                    APPOINTMENTS={APPOINTMENTS}
                                    rawServices={rawServices}
                                    doctors={doctors}
                                    formatAlbanianDate={formatAlbanianDate}
                                />
                            )}

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
                                <PatientsTab
                                    uniquePatients={uniquePatients}
                                    globalSearch={globalSearch}
                                    setGlobalSearch={setGlobalSearch}
                                    APPOINTMENTS={APPOINTMENTS}
                                />
                            )}

                            {activeTab === 'time-off' && (
                                <TimeOffTab
                                    doctors={doctors}
                                    pauzaForm={pauzaForm}
                                    setPauzaForm={setPauzaForm}
                                    handleSavePauza={handleSavePauza}
                                    setActiveTab={setActiveTab}
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
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── MOBILE BOTTOM DOCK (Hidden on Desktop) ── */}
                <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-[#1e3a8a]/90 backdrop-blur-2xl border border-white/20 rounded-3xl z-40 shadow-2xl shadow-black/50 p-2 flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {SIDEBAR_ITEMS.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); if (item.id !== 'month-calendar') setSelectedCalendarDate(null); }}
                                className={`flex-shrink-0 flex flex-col items-center justify-center p-2 rounded-2xl w-[4.5rem] h-[4.5rem] transition-all
                                    ${isActive
                                        ? 'bg-white/10 text-teal-300 border border-white/5 shadow-inner'
                                        : 'text-white/50 hover:bg-white/[0.05] hover:text-white border border-transparent'}
                                `}
                            >
                                <item.icon size={22} className={isActive ? 'text-teal-300' : 'text-white/40'} strokeWidth={isActive ? 2 : 1.5} />
                                <span className={`text-[9px] mt-1.5 font-medium tracking-wide ${isActive ? 'text-teal-300' : 'text-white/50'}`}>{item.label}</span>
                            </button>
                        );
                    })}
                    <div className="w-[1px] h-10 bg-white/10 mx-1 shrink-0" />
                    <button
                        onClick={() => setShowBookingModal(true)}
                        className="flex-shrink-0 flex flex-col items-center justify-center bg-teal-400 hover:bg-teal-300 text-[#1e3a8a] rounded-2xl w-[4.5rem] h-[4.5rem] shadow-lg shadow-teal-400/20 transition-all"
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                </nav>
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
