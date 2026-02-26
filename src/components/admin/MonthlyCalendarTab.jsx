import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, CalendarOff, CalendarDays, ArrowRight
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
    );
}
