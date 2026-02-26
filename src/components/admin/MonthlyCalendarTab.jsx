import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, CalendarOff, CalendarDays, ArrowRight, User
} from 'lucide-react';

export default function MonthlyCalendarTab({
    calendarData,
    selectedDoc,
    prevMonth,
    nextMonth,
    resetToToday,
    APPOINTMENTS,
    BLOCKED_TIMES,
    selectedCalendarDate,
    setSelectedCalendarDate,
    selectedDateSchedule,
    setSelectedApt,
    currentDate,
    formatAlbanianDate,
}) {
    return (
        <Motion.div
            key="month-calendar"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
        >
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 max-w-7xl mx-auto">
                {/* Left Side - Monthly Grid */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shrink-0 flex flex-col h-fit backdrop-blur-sm relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-light tracking-tight text-white capitalize leading-none mb-2">{calendarData.currentMonthName}</h2>
                            <p className="text-sm font-light text-white/50">Përzgjidhni një datë për të parë agjendën ditore.</p>
                        </div>
                        <div className="flex justify-between items-center w-full sm:w-auto gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
                            <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"><ChevronLeft size={16} /></button>
                            <button onClick={resetToToday} className="px-5 h-9 text-xs font-bold text-[#1e3a8a] bg-teal-400 rounded-lg hover:bg-teal-300 transition-colors uppercase tracking-widest shadow-lg shadow-teal-400/20">Sot</button>
                            <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"><ChevronRight size={16} /></button>
                        </div>
                    </div>

                    {/* Adjusted Grid */}
                    <div className="max-w-xl lg:max-w-2xl w-full mx-auto relative z-10">
                        <div className="grid grid-cols-7 gap-y-4 sm:gap-y-6 gap-x-1 sm:gap-x-2">
                            {['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'].map(day => (
                                <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-white/40 uppercase tracking-widest pb-3 border-b-2 border-white/5">{day}</div>
                            ))}

                            {/* Blank slots before 1st of month */}
                            {calendarData.blanks.map((_, i) => (
                                <div key={`blank-${i}`} className="aspect-square flex justify-center items-center opacity-0" />
                            ))}

                            {/* Actual Days */}
                            {calendarData.days.map(day => {
                                const dateMatchStr = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayApts = APPOINTMENTS.filter(a => a.doctorId === selectedDoc && a.date === dateMatchStr);
                                const dayBlocks = BLOCKED_TIMES.filter(b => b.doctorId === selectedDoc && b.date === dateMatchStr);

                                const realToday = new Date();
                                const isToday = day === realToday.getDate() && currentDate.getMonth() === realToday.getMonth() && currentDate.getFullYear() === realToday.getFullYear();
                                const isSunday = (calendarData.startOffset + (day - 1)) % 7 === 6;
                                const isSelected = selectedCalendarDate?.getDate() === day && selectedCalendarDate?.getMonth() === currentDate.getMonth();

                                const hasEvents = dayApts.length > 0 || dayBlocks.length > 0;

                                return (
                                    <button
                                        key={day}
                                        onClick={() => {
                                            setSelectedCalendarDate(new Date(calendarData.year, calendarData.month, day))
                                        }}
                                        className={`aspect-square w-full rounded-2xl sm:rounded-3xl flex flex-col justify-center items-center relative transition-all group border-2
                                                ${isSelected
                                                ? 'border-teal-400/50 bg-teal-400/20 text-teal-300 shadow-lg shadow-teal-400/10 scale-105 z-10'
                                                : 'border-transparent text-white hover:border-white/20 hover:bg-white/5'}
                                                ${isToday && !isSelected ? 'text-teal-300 bg-white/5 border-white/10' : ''}
                                                ${isSunday && !isSelected && !isToday ? 'opacity-50' : ''}
                                            `}
                                    >
                                        <span className={`text-sm sm:text-base z-10 ${isSelected ? 'font-bold' : isToday ? 'font-bold' : 'font-light'}`}>
                                            {day}
                                        </span>

                                        {/* Status Indicators */}
                                        {hasEvents && (
                                            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                                                {dayApts.length > 0 && <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${isSelected ? 'bg-teal-300' : 'bg-teal-400/50'}`} />}
                                                {dayBlocks.length > 0 && <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${isSelected ? 'bg-rose-400' : 'bg-rose-500/50'}`} />}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}

                            {/* Blank slots at the end */}
                            {calendarData.endBlanks.map((_, i) => (
                                <div key={`end-blank-${i}`} className="aspect-square flex justify-center items-center opacity-0" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Selected Day Details */}
                <div className="flex flex-col h-full lg:sticky lg:top-6 relative z-10">
                    {selectedCalendarDate ? (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 flex-1 flex flex-col backdrop-blur-sm">
                            <div className="flex flex-col gap-1 pb-6 mb-6 border-b border-white/10">
                                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-widest bg-teal-400/10 border border-teal-500/20 px-3 py-1.5 rounded-lg w-fit mb-3">
                                    Agjenda Ditore
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white leading-tight">
                                    {formatAlbanianDate(selectedCalendarDate)}
                                </h3>
                                <div className="text-xs font-light text-white/50 mt-2 flex flex-wrap items-center gap-3 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" /> {selectedDateSchedule.filter(s => s.itemType === 'appointment').length} Termine
                                    <span className="text-white/20">|</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" /> {selectedDateSchedule.filter(s => s.itemType === 'block').length} Pauza
                                </div>
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2 max-h-[500px] xl:max-h-[600px]">
                                {selectedDateSchedule.length > 0 ? selectedDateSchedule.map((item, idx) => {
                                    if (item.itemType === 'appointment') {
                                        return (
                                            <div
                                                key={`${item.id}-${idx}`}
                                                onClick={() => setSelectedApt(item)}
                                                className="flex flex-col p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all group cursor-pointer relative mb-3"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/50 flex items-center justify-center font-bold relative shrink-0 group-hover:text-teal-300 transition-colors">
                                                            <User size={18} strokeWidth={1.5} />
                                                            <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#1e3a8a] 
                                                                ${item.status === 'confirmed' ? 'bg-teal-400' : 'bg-rose-400'}`} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm sm:text-base font-light text-white leading-none">{item.patient}</h4>
                                                            <span className={`text-[9px] uppercase tracking-widest font-bold mt-1.5 block
                                                                ${item.status === 'confirmed' ? 'text-teal-300' : 'text-rose-300'}`}>
                                                                {item.status === 'confirmed' ? 'Konfirmuar' : 'Në Pritje'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] sm:text-xs font-light text-white bg-white/5 px-2.5 py-1 rounded-xl border border-white/10 block">
                                                            {item.time?.split(' - ')[0] || item.time}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 overflow-hidden">
                                                    <p className="text-[10px] font-medium text-teal-300 bg-teal-400/10 border border-teal-500/20 px-2.5 py-1 rounded-lg truncate uppercase tracking-widest">
                                                        {item.service}
                                                    </p>
                                                    <button className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0">
                                                        <ArrowRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        // Block / Pauza
                                        return (
                                            <div
                                                key={`${item.id}-${idx}`}
                                                className="flex flex-col p-4 rounded-2xl border border-white/5 bg-black/20 opacity-80 mb-3"
                                            >
                                                <div className="flex items-start justify-between mb-2 gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/30 flex items-center justify-center shrink-0">
                                                            <CalendarOff size={14} strokeWidth={1.5} />
                                                        </div>
                                                        <h4 className="text-[10px] sm:text-xs font-light text-white/50 leading-tight uppercase tracking-widest">{item.type}</h4>
                                                    </div>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 bg-white/5 px-2 py-1 rounded-lg border border-white/10 shrink-0">
                                                        {item.time}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-light text-white/30 pl-10 leading-relaxed">
                                                    {item.title}
                                                </p>
                                            </div>
                                        );
                                    }
                                }) : (
                                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                                            <CalendarOff size={24} className="text-white/30" strokeWidth={1.5} />
                                        </div>
                                        <h4 className="text-lg font-light tracking-tight text-white mb-2">Dita është e lirë</h4>
                                        <p className="text-sm font-light text-white/40 max-w-[200px] leading-relaxed">
                                            Nuk ka asnjë takim ose bllokim të planifikuar për këtë datë.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[400px] backdrop-blur-sm">
                            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 shadow-inner flex items-center justify-center mb-8">
                                <CalendarDays size={32} className="text-white/20" strokeWidth={1} />
                            </div>
                            <h3 className="text-2xl font-light tracking-tight text-white mb-4">Asnjë datë e zgjedhur</h3>
                            <p className="text-sm font-light text-white/40 max-w-sm leading-relaxed">
                                Zgjidhni një datë nga kalendari në të majtë për të parë detajet dhe terminet e planifikuara për atë ditë.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Motion.div>
    );
}
