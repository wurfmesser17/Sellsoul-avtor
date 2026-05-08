import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCalendar, saveCalendar } from '../../lib/firestoreService';
import { UserCalendar, CalendarDay } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  TrendingUp, 
  CheckSquare,
  Settings,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';

const DAY_AMOUNTS = [[700, 400, 600, 700, 600], [600, 500, 800, 300, 800], [400, 800, 700, 600, 500], [800, 600, 800, 400, 400], [400, 600, 700, 600, 700], [600, 400, 400, 800, 800], [600, 800, 700, 600, 300], [700, 800, 500, 400, 600], [600, 800, 400, 500, 700], [800, 700, 800, 400, 300], [600, 700, 600, 500, 600], [500, 500, 600, 600, 800], [300, 800, 600, 800, 500], [700, 800, 500, 500, 500], [500, 700, 400, 800, 600], [800, 500, 800, 400, 500], [800, 400, 800, 600, 400], [800, 300, 500, 800, 600], [500, 700, 700, 400, 700], [600, 400, 800, 400, 800]];

function buildDefaultDay(index: number, familiars: { name: string; number: string }[]): CalendarDay {
  const amounts = DAY_AMOUNTS[index] || Array(5).fill(600);
  return {
    index,
    familiars: Array.from({ length: 3 }, (_, i) => ({
      name: familiars[i]?.name || `Знакомый ${i + 1}`,
      number: familiars[i]?.number || '',
      amount: amounts[i],
      checked: false,
      type: 'familiar'
    })),
    strangers: Array.from({ length: 2 }, (_, i) => ({
      name: `Незнакомый ${i + 1}`,
      number: '',
      amount: amounts[3 + i],
      checked: false,
      type: 'stranger'
    }))
  };
}

export function Calendar() {
  const { user } = useAuth();
  const [calendar, setCalendar] = useState<UserCalendar | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isEditingFamiliars, setIsEditingFamiliars] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getCalendar(user.uid)
        .then(data => {
          if (data) {
            setCalendar(data);
          } else {
            const initialFamiliars = [{ name: "", number: "" }, { name: "", number: "" }, { name: "", number: "" }];
            const initialCalendar: UserCalendar = {
              userId: user.uid,
              familiars: initialFamiliars,
              days: Array.from({ length: 20 }, (_, i) => buildDefaultDay(i, initialFamiliars)),
              startDate: new Date().toISOString()
            };
            setCalendar(initialCalendar);
            saveCalendar(user.uid, initialCalendar);
          }
        })
        .catch(err => {
          console.error("Calendar load error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  if (loading || !calendar) return <div className="p-10 text-center font-mono opacity-20 uppercase tracking-widest animate-pulse">Syncing...</div>;

  const totalReceived = calendar.days.reduce((sum, day) => sum + [...day.familiars, ...day.strangers].filter(p => p.checked).reduce((s, p) => s + p.amount, 0), 0);
  const completedDaysCount = calendar.days.filter(day => [...day.familiars, ...day.strangers].every(p => p.checked)).length;
  const progress = (completedDaysCount / 20) * 100;
  
  const handleToggle = (dayIndex: number, personType: 'familiar' | 'stranger', personIndex: number) => {
    const newCalendar = JSON.parse(JSON.stringify(calendar));
    const person = personType === 'familiar' ? newCalendar.days[dayIndex].familiars[personIndex] : newCalendar.days[dayIndex].strangers[personIndex];
    person.checked = !person.checked;
    setCalendar(newCalendar);
    saveCalendar(calendar.userId, newCalendar);
  };

  const isDayLocked = (idx: number) => {
    if (idx === 0) return false;
    const prev = calendar.days[idx-1];
    return ![...prev.familiars, ...prev.strangers].some(p => p.checked);
  };

  const filteredDays = calendar.days.slice((currentWeek - 1) * 7, currentWeek * 7);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tighter uppercase">КАЛЕНДАРЬ ПЛАТЕЖЕЙ</h2>
        <p className="text-xs text-brand-muted font-mono uppercase tracking-widest">20-дневный план активации Kaspi магазина</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Прогресс', val: `${progress.toFixed(0)}%`, icon: TrendingUp },
          { label: 'Дней выполнено', val: `${completedDaysCount}/20`, icon: CalendarIcon },
          { label: 'Всего принято', val: `${totalReceived.toLocaleString()} ₸`, icon: CheckSquare }
        ].map((s, i) => (
          <div key={i} className="bg-zinc-50 border border-brand-line rounded-2xl p-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2">
              <s.icon size={12} /> {s.label}
            </div>
            <div className="text-3xl font-black">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-brand-line pb-4">
        {[1, 2, 3].map(w => (
          <button key={w} onClick={() => setCurrentWeek(w)} className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all", currentWeek === w ? "bg-brand-ink text-zinc-50" : "hover:bg-zinc-100")}>Неделя {w}</button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setIsEditingFamiliars(!isEditingFamiliars)} className="text-[10px] font-bold uppercase tracking-widest text-brand-muted flex items-center gap-2 hover:text-brand-ink"><Settings size={14} /> Настройка знакомых</button>
      </div>

      {isEditingFamiliars && (
        <div className="bg-zinc-50 rounded-2xl border border-brand-line p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest">Знакомые для оплат</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calendar.familiars.map((f, i) => (
              <div key={i} className="space-y-2">
                <input value={f.name} onChange={(e) => {
                  const newCal = JSON.parse(JSON.stringify(calendar));
                  newCal.familiars[i].name = e.target.value;
                  newCal.days.forEach((day: any) => day.familiars[i].name = e.target.value);
                  setCalendar(newCal);
                }} placeholder="Имя" className="w-full bg-white border border-brand-line rounded-lg px-3 py-2 text-xs" />
                <input value={f.number} onChange={(e) => {
                  const newCal = JSON.parse(JSON.stringify(calendar));
                  newCal.familiars[i].number = e.target.value;
                  newCal.days.forEach((day: any) => day.familiars[i].number = e.target.value);
                  setCalendar(newCal);
                }} placeholder="Номер" className="w-full bg-white border border-brand-line rounded-lg px-3 py-2 text-xs" />
              </div>
            ))}
          </div>
          <button onClick={() => { saveCalendar(calendar.userId, calendar); setIsEditingFamiliars(false); }} className="w-full bg-brand-ink text-zinc-50 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest">Сохранить</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDays.map((day) => {
          const locked = isDayLocked(day.index);
          const complete = [...day.familiars, ...day.strangers].every(p => p.checked);
          return (
            <div key={day.index} className={cn("rounded-2xl border p-5 transition-all", locked ? "opacity-30 grayscale pointer-events-none" : complete ? "bg-emerald-50/20 border-emerald-100" : "bg-white border-brand-line")}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-brand-ink text-white flex items-center justify-center font-bold text-sm">{day.index + 1}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest">День {day.index + 1}</div>
                </div>
                {locked && <Lock size={14} />}
              </div>
              <div className="space-y-1.5">
                {[...day.familiars, ...day.strangers].map((p, pIdx) => (
                  <button key={pIdx} onClick={() => handleToggle(day.index, p.type, p.type === 'familiar' ? pIdx : pIdx - 3)} className={cn("w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-left", p.checked ? "bg-emerald-500 border-emerald-500 text-white" : "bg-zinc-50 border-transparent hover:border-brand-line")}>
                    <div className="flex items-center gap-3">
                      <div className={cn("h-5 w-5 rounded flex items-center justify-center", p.checked ? "bg-white/20" : "bg-white border border-brand-line")}>{p.checked && "✓"}</div>
                      <div>
                        <div className="text-[10px] font-bold uppercase leading-tight line-clamp-1">{p.name || '...'}</div>
                        <div className="text-[8px] opacity-60 font-mono italic">{p.type === 'familiar' ? 'Знакомый' : 'Незнакомый'}</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono font-bold">{p.amount} ₸</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
