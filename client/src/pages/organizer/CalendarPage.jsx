import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import axiosClient from '../../api/axiosClient';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const typeColors = {
  event: 'bg-violet-500/20 text-violet-300 border-violet-500/20',
  deadline: 'bg-red-500/20 text-red-300 border-red-500/20',
  expiry: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
  sales: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
};

export default function CalendarPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axiosClient.get('/api/events')
      .then(({ data }) => {
        const raw = data?.data ?? data;
        const list = raw?.events ?? (Array.isArray(raw) ? raw : []);
        const mapped = list.map((e) => {
          const d = new Date(e.startDate);
          return {
            date: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear(),
            title: e.title,
            type: e.status === 'published' ? 'event' : e.status === 'draft' ? 'expiry' : 'event',
            color: 'violet',
          };
        });
        setEvents(mapped);
      })
      .catch(() => setEvents([]));
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const dates = useMemo(() => {
    const d = [];
    for (let i = 0; i < firstDay; i++) d.push(null);
    for (let i = 1; i <= daysInMonth; i++) d.push(i);
    return d;
  }, [firstDay, daysInMonth]);

  const today = now.getDate();
  const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const dayEvents = (day) => events.filter((e) => e.date === day && e.month === month && e.year === year);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Calendar</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage your event schedule and deadlines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div variants={item} className="lg:col-span-2 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prev} className="p-2 rounded-xl hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-200 transition-all">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-white">{monthNames[month]} {year}</h2>
            <button onClick={next} className="p-2 rounded-xl hover:bg-white/[0.04] text-zinc-500 hover:text-zinc-200 transition-all">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-xs text-zinc-500 font-medium py-2">{d}</div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 gap-1">
            {dates.map((date, i) => {
              const events = date ? dayEvents(date) : [];
              const isToday = date === today && isCurrentMonth;
              const isSelected = date === selected;
              return (
                <button
                  key={i}
                  disabled={!date}
                  onClick={() => setSelected(date)}
                  className={`relative min-h-[80px] p-1.5 rounded-xl text-sm transition-all ${
                    !date ? 'invisible' :
                    isSelected ? 'bg-violet-500/15 border border-violet-500/30' :
                    isToday ? 'bg-violet-500/10 border border-violet-500/20' :
                    'hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-violet-300' : 'text-zinc-300'}`}>{date}</span>
                  <div className="mt-1 space-y-0.5">
                    {events.slice(0, 2).map((e, ei) => (
                      <div key={ei} className={`px-1 py-0.5 rounded text-[8px] truncate ${typeColors[e.type] || 'bg-white/5 text-zinc-400'}`}>
                        {e.title.slice(0, 12)}...
                      </div>
                    ))}
                    {events.length > 2 && <p className="text-[8px] text-zinc-500 px-1">+{events.length - 2} more</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Side Panel */}
        <motion.div variants={item} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white mb-4">
            {selected ? `${monthNames[month]} ${selected}, ${year}` : 'Upcoming'}
          </h3>
          <div className="space-y-3">
            {(selected ? dayEvents(selected) : events.filter((e) => e.month === month && e.year === year)).length === 0 && (
              <p className="text-zinc-500 text-xs text-center py-8">
                <CalendarDaysIcon className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                No events on this day
              </p>
            )}
            {(selected ? dayEvents(selected) : events.filter((e) => e.month === month && e.year === year)).map((e) => (
              <div key={e.title} className={`rounded-xl border p-3 ${typeColors[e.type] || 'bg-white/[0.03] border-white/[0.06]'}`}>
                <p className="text-xs font-medium">{e.title}</p>
                <p className="text-[10px] opacity-60 mt-0.5 capitalize">{e.type.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
