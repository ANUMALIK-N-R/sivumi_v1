import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, isWithinLastDays } from '../../services/storage';
import { AddGoalModal } from './AddGoalModal';
import { Plus, Check, Trash2, Minus } from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { state, toggleGoalCompletion, setGoalProgress, deleteGoal } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const today = getTodayDateString();

  const habits = state.goals.filter(g => g.kind === 'habit' && !g.archived);
  const goals = state.goals.filter(g => g.kind === 'goal' && !g.archived);

  const recentHabitLogs = useMemo(() => state.goalLogs.filter(l => isWithinLastDays(l.date, 30)), [state.goalLogs]);

  const todayProgress = (id: string) => state.goalLogs.find(l => l.goalId === id && l.date === today)?.progressValue || 0;
  const cumulative = (id: string) => state.goalLogs.filter(l => l.goalId === id).reduce((s, l) => s + (l.progressValue || 0), 0);

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 text-left font-sans">
      <div className="rounded-2xl bg-white border border-[#EFEAE6] p-4">
        <span className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider">Tracking</span>
        <h2 className="text-xl font-bold text-[#2C2428] mt-0.5">Habits & Goals</h2>
        <p className="text-[11px] text-[#7A6C74] mt-1">Habits are tracked by day. Goals accumulate progress until you reach the target.</p>
      </div>

      <button onClick={() => setShowAddModal(true)} className="w-full py-2.5 rounded-xl bg-[#2C2428] text-white text-xs font-semibold flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5"/>Add habit or goal</button>

      <section className="space-y-2">
        <div className="flex justify-between items-end"><div><h3 className="text-xs font-bold">Habits</h3><p className="text-[10px] text-[#A69A9F]">Today + completion count over the last 30 days</p></div><span className="text-[10px] text-[#8C7E86]">{habits.length}</span></div>
        {habits.length === 0 ? <Empty text="No habits yet."/> : habits.map(h => {
          const current = todayProgress(h.id);
          const completed = current >= h.targetCount;
          const thirtyDayCount = recentHabitLogs.filter(l => l.goalId === h.id && l.completed).length;
          return (
            <div key={h.id} className="p-3 rounded-2xl bg-white border border-[#EFEAE6] flex items-center gap-3">
              <button onClick={() => toggleGoalCompletion(h.id, today)} className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${completed ? 'bg-[#B5838D] text-white' : 'bg-[#FAF6F3] border border-[#EAE3DE]'}`}><Check className={`w-4 h-4 ${completed ? '' : 'opacity-0'}`}/></button>
              <div className="flex-1 min-w-0"><h4 className="text-xs font-semibold truncate">{h.title}</h4><p className="text-[10px] text-[#A69A9F]">Today {current}/{h.targetCount} {h.targetUnit || ''} · {thirtyDayCount} completed days / 30</p></div>
              <div className="flex items-center gap-1"><button onClick={() => setGoalProgress(h.id, Math.max(0, current - 1), today)} className="w-6 h-6 rounded-full bg-[#FAF6F3] flex items-center justify-center"><Minus className="w-3 h-3"/></button><button onClick={() => setGoalProgress(h.id, current + 1, today)} className="w-6 h-6 rounded-full bg-[#FAF6F3] flex items-center justify-center text-[#B5838D]"><Plus className="w-3 h-3"/></button><button onClick={() => deleteGoal(h.id)} className="p-1 text-stone-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5"/></button></div>
            </div>
          );
        })}
      </section>

      <section className="space-y-2">
        <div><h3 className="text-xs font-bold">Goals</h3><p className="text-[10px] text-[#A69A9F]">Cumulative progress is kept until you delete or reset the goal.</p></div>
        {goals.length === 0 ? <Empty text="No goals yet."/> : goals.map(g => {
          const total = cumulative(g.id);
          const todayValue = todayProgress(g.id);
          const pct = Math.min(100, Math.round((total / g.targetCount) * 100));
          return (
            <div key={g.id} className="p-3 rounded-2xl bg-white border border-[#EFEAE6]">
              <div className="flex items-start justify-between gap-2"><div className="flex-1"><h4 className="text-xs font-semibold">{g.title}</h4><p className="text-[10px] text-[#A69A9F]">{total}/{g.targetCount} {g.targetUnit || ''} · {pct}%</p></div><button onClick={() => deleteGoal(g.id)} className="p-1 text-stone-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5"/></button></div>
              <div className="h-1.5 bg-[#FAF5F2] rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#B5838D]" style={{width:`${pct}%`}}/></div>
              <div className="flex items-center justify-between mt-2"><span className="text-[10px] text-[#A69A9F]">Today: {todayValue} {g.targetUnit || ''}</span><div className="flex gap-1"><button onClick={() => setGoalProgress(g.id, Math.max(0, todayValue - 1), today)} className="w-7 h-7 rounded-full bg-[#FAF6F3] flex items-center justify-center"><Minus className="w-3 h-3"/></button><button onClick={() => setGoalProgress(g.id, todayValue + 1, today)} className="w-7 h-7 rounded-full bg-[#FAF6F3] text-[#B5838D] flex items-center justify-center"><Plus className="w-3 h-3"/></button></div></div>
            </div>
          );
        })}
      </section>

      {showAddModal && <AddGoalModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

const Empty = ({text}:{text:string}) => <div className="p-5 text-center bg-white rounded-2xl border border-[#EFEAE6] text-xs text-[#A69A9F]">{text}</div>;
