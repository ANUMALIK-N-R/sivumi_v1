import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/storage';
import { Calendar, UtensilsCrossed, Activity, CheckCircle2, ChevronRight } from 'lucide-react';

export const SummaryGrid: React.FC = () => {
  const { state, setActiveTab, setIsCheckinModalOpen } = useApp();
  const today = getTodayDateString();
  const checkin = state.dailyCheckins[today];
  const meals = state.meals.filter(m => m.date === today);
  const habits = state.goals.filter(g => g.kind === 'habit' && !g.archived);
  const completedHabits = habits.filter(g =>
    state.goalLogs.some(log => log.goalId === g.id && log.date === today && log.completed)
  ).length;

  const lastStart = state.settings.lastPeriodStartDate;
  let cycleText = 'Not set';
  let cycleSub = 'Log a period to begin';
  if (lastStart) {
    const diff = Math.max(0, Math.floor((new Date(`${today}T12:00:00`).getTime() - new Date(`${lastStart}T12:00:00`).getTime()) / 86400000));
    cycleText = `Day ${diff + 1}`;
    cycleSub = `Typical ${state.settings.cycleTypicalLength} days`;
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 w-full text-left font-sans">
      <button onClick={() => setActiveTab('cycle')} className="group p-3.5 rounded-2xl bg-white border border-[#EFEAE6] active:scale-[0.98] text-left">
        <div className="flex justify-between mb-2.5"><Calendar className="w-4 h-4 text-[#B5838D]"/><ChevronRight className="w-3.5 h-3.5 text-stone-300"/></div>
        <span className="text-[10px] uppercase font-semibold text-[#8C7E86] block">Cycle</span>
        <span className="text-sm font-bold text-[#2C2428] block">{cycleText}</span>
        <span className="text-[10px] text-[#A69A9F]">{cycleSub}</span>
      </button>

      <button onClick={() => setActiveTab('journal')} className="group p-3.5 rounded-2xl bg-white border border-[#EFEAE6] active:scale-[0.98] text-left">
        <div className="flex justify-between mb-2.5"><UtensilsCrossed className="w-4 h-4 text-[#6E6168]"/><ChevronRight className="w-3.5 h-3.5 text-stone-300"/></div>
        <span className="text-[10px] uppercase font-semibold text-[#8C7E86] block">Food log</span>
        <span className="text-sm font-bold text-[#2C2428] block">{meals.length} item{meals.length === 1 ? '' : 's'}</span>
        <span className="text-[10px] text-[#A69A9F]">View in Journal</span>
      </button>

      <button onClick={() => setIsCheckinModalOpen(true)} className="group p-3.5 rounded-2xl bg-white border border-[#EFEAE6] active:scale-[0.98] text-left">
        <div className="flex justify-between mb-2.5"><Activity className="w-4 h-4 text-[#6E6168]"/><ChevronRight className="w-3.5 h-3.5 text-stone-300"/></div>
        <span className="text-[10px] uppercase font-semibold text-[#8C7E86] block">Wellbeing</span>
        <span className="text-sm font-bold text-[#2C2428] block">{checkin?.mood ? checkin.mood[0].toUpperCase() + checkin.mood.slice(1) : 'Not logged'}</span>
        <span className="text-[10px] text-[#A69A9F]">Tap to edit today</span>
      </button>

      <button onClick={() => setActiveTab('goals')} className="group p-3.5 rounded-2xl bg-white border border-[#EFEAE6] active:scale-[0.98] text-left">
        <div className="flex justify-between mb-2.5"><CheckCircle2 className="w-4 h-4 text-[#6E6168]"/><ChevronRight className="w-3.5 h-3.5 text-stone-300"/></div>
        <span className="text-[10px] uppercase font-semibold text-[#8C7E86] block">Habits</span>
        <span className="text-sm font-bold text-[#2C2428] block">{completedHabits}/{habits.length}</span>
        <span className="text-[10px] text-[#A69A9F]">Goals are tracked here too</span>
      </button>
    </div>
  );
};
