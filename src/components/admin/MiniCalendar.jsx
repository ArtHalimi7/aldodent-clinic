import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MiniCalendar({ selected, onSelect }) {
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
