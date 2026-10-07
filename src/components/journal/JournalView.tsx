import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { addDaysToDateString, DAILY_LOG_RETENTION_DAYS, getTodayDateString, isWithinLastDays } from '../../services/storage';
import { CheckinModal } from '../home/CheckinModal';
import { AddMealModal } from '../food/AddMealModal';
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, Droplets, Moon, Activity, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

const moodLabel: Record<string, string> = { great: 'Radiant', good: 'Calm', okay: 'Gentle', low: 'Tender', bad: 'Heavy' };

export const JournalView: React.FC = () => {
  const { state, deleteMeal } = useApp();
  const today = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showMeal, setShowMeal] = useState(false);

  const checkin = state.dailyCheckins[selectedDate];
  const meals = useMemo(() => state.meals.filter(m => m.date === selectedDate), [state.meals, selectedDate]);
  const logs = state.goalLogs.filter(l => l.date === selectedDate);
  const canGoOlder = isWithinLastDays(addDaysToDateString(selectedDate, -1), DAILY_LOG_RETENTION_DAYS);
  const canGoNewer = selectedDate < today;

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 text-left font-sans">
      <div className="bg-white rounded-2xl p-3 border border-[#EFEAE6] flex items-center justify-between">
        <button disabled={!canGoOlder} onClick={() => canGoOlder && setSelectedDate(addDaysToDateString(selectedDate, -1))} className="w-8 h-8 rounded-full bg-[#FAF6F3] disabled:opacity-30 flex items-center justify-center"><ChevronLeft className="w-4 h-4"/></button>
        <div className="text-center">
          <h2 className="text-sm font-bold text-[#2C2428]">{selectedDate === today ? 'Today' : new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h2>
          <p className="text-[10px] text-[#A69A9F]">Daily wellbeing + food are kept for {DAILY_LOG_RETENTION_DAYS} days</p>
        </div>
        <button disabled={!canGoNewer} onClick={() => canGoNewer && setSelectedDate(addDaysToDateString(selectedDate, 1))} className="w-8 h-8 rounded-full bg-[#FAF6F3] disabled:opacity-30 flex items-center justify-center"><ChevronRight className="w-4 h-4"/></button>
      </div>

      <section className="bg-white rounded-2xl p-4 border border-[#EFEAE6]">
        <div className="flex items-center justify-between mb-3">
          <div><h3 className="text-xs font-bold">Feeling & baseline</h3><p className="text-[10px] text-[#A69A9F]">What you actually logged for this date</p></div>
          <button onClick={() => setShowCheckin(true)} className="text-[11px] font-semibold text-[#B5838D] flex items-center gap-1"><Pencil className="w-3 h-3"/>Edit</button>
        </div>

        {!checkin ? (
          <p className="text-xs text-[#A69A9F] py-2">No wellbeing entry for this day.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Feeling" value={checkin.mood ? moodLabel[checkin.mood] : 'Not recorded'} />
            <Stat label="Energy / Stress" value={`${checkin.energy ?? '—'} / ${checkin.stress ?? '—'}`} icon={Activity} />
            <Stat label="Water actual" value={checkin.waterGlasses == null ? 'Not recorded' : `${checkin.waterGlasses} glasses`} icon={Droplets} sub={`Target ${state.settings.dailyWaterTarget} glasses`} />
            <Stat label="Sleep actual" value={checkin.sleepHours == null ? 'Not recorded' : `${checkin.sleepHours} h`} icon={Moon} sub={`Target ${state.settings.dailySleepTarget} h`} />
            {checkin.reflectionNotes && <div className="col-span-2 p-2.5 rounded-xl bg-[#FAF8F5] text-xs text-[#6E6168]">{checkin.reflectionNotes}</div>}
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl p-4 border border-[#EFEAE6]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2"><UtensilsCrossed className="w-4 h-4 text-[#B5838D]"/><div><h3 className="text-xs font-bold">Food log</h3><p className="text-[10px] text-[#A69A9F]">{meals.length} item{meals.length === 1 ? '' : 's'} on this day</p></div></div>
          <button onClick={() => setShowMeal(true)} className="text-[11px] font-semibold text-[#B5838D] flex items-center gap-1"><Plus className="w-3 h-3"/>Add</button>
        </div>
        {meals.length === 0 ? <p className="text-xs text-[#A69A9F]">No food recorded.</p> : (
          <div className="space-y-2">
            {meals.map(meal => (
              <div key={meal.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DE] flex justify-between gap-2">
                <div><span className="text-[9px] uppercase text-[#8C7E86] font-semibold">{meal.mealType}</span><h4 className="text-xs font-bold">{meal.name}</h4>{meal.description && <p className="text-[10px] text-[#7A6C74] mt-0.5">{meal.description}</p>}</div>
                <button onClick={() => deleteMeal(meal.id)} className="text-stone-300 hover:text-rose-500"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl p-4 border border-[#EFEAE6]">
        <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-[#B5838D]"/><h3 className="text-xs font-bold">Habits & goals recorded</h3></div>
        {logs.length === 0 ? <p className="text-xs text-[#A69A9F]">No habit/goal activity logged for this date.</p> : (
          <div className="space-y-1.5">
            {logs.map(log => {
              const item = state.goals.find(g => g.id === log.goalId);
              if (!item) return null;
              return <div key={log.id} className="flex justify-between p-2 rounded-lg bg-[#FAF8F5] text-xs"><span>{item.title}</span><span className="font-semibold">{log.progressValue ?? 0} {item.targetUnit || ''}{log.completed ? ' ✓' : ''}</span></div>;
            })}
          </div>
        )}
      </section>

      {showCheckin && <CheckinModal date={selectedDate} onClose={() => setShowCheckin(false)} />}
      {showMeal && <AddMealModal defaultDate={selectedDate} onClose={() => setShowMeal(false)} />}
    </div>
  );
};

const Stat = ({ label, value, sub, icon: Icon }: any) => (
  <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DE]">
    <div className="flex items-center gap-1 mb-0.5">{Icon && <Icon className="w-3 h-3 text-[#B5838D]"/>}<span className="text-[9px] uppercase font-semibold text-[#8C7E86]">{label}</span></div>
    <div className="text-xs font-bold text-[#2C2428]">{value}</div>
    {sub && <div className="text-[9px] text-[#A69A9F]">{sub}</div>}
  </div>
);
