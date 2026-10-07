import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PeriodLogModal } from './PeriodLogModal';
import { getTodayDateString } from '../../services/storage';
import { Calendar, ChevronLeft, ChevronRight, Droplet, History, Plus } from 'lucide-react';

export const CycleView: React.FC = () => {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [showLog, setShowLog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const today = getTodayDateString();

  const periodDates = useMemo(() => Object.values(state.periodDays)
    .filter(p => p.isPeriod && p.flow !== 'none')
    .map(p => p.date)
    .sort(), [state.periodDays]);

  const lastStart = state.settings.lastPeriodStartDate || periodDates[periodDates.length - 1] || '';
  const typicalCycleLength = state.settings.cycleTypicalLength || 28;

  let cycleDay: number | null = null;
  let nextIn: number | null = null;
  if (lastStart) {
    const diff = Math.max(0, Math.floor((new Date(`${today}T12:00:00`).getTime() - new Date(`${lastStart}T12:00:00`).getTime()) / 86400000));
    cycleDay = diff + 1;
    nextIn = Math.max(0, typicalCycleLength - diff);
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString(undefined, { month: 'long', year: 'numeric' });
  const selectedLog = state.periodDays[selectedDate];

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 text-left font-sans">
      <div className="rounded-2xl bg-white border border-[#EFEAE6] p-4">
        <span className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider">Cycle rhythm</span>
        {cycleDay ? (
          <><h2 className="text-xl font-bold mt-0.5">Day {cycleDay}</h2><p className="text-xs text-[#7A6C74]">Estimated next period in ~{nextIn} days based on your {typicalCycleLength}-day setting.</p></>
        ) : (
          <><h2 className="text-xl font-bold mt-0.5">No cycle start yet</h2><p className="text-xs text-[#7A6C74]">Log the first day of a period to start cycle-day estimates.</p></>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button onClick={() => { setSelectedDate(today); setShowLog(true); }} className="py-2 rounded-xl bg-[#2C2428] text-white text-xs font-semibold flex items-center justify-center gap-1"><Droplet className="w-3.5 h-3.5"/>Period</button>
        <button onClick={() => setShowLog(true)} className="py-2 rounded-xl bg-white border border-[#EFEAE6] text-xs font-semibold flex items-center justify-center gap-1"><Plus className="w-3.5 h-3.5"/>Symptoms</button>
        <button onClick={() => setShowHistory(true)} className="py-2 rounded-xl bg-white border border-[#EFEAE6] text-xs font-semibold flex items-center justify-center gap-1"><History className="w-3.5 h-3.5"/>History</button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#B5838D]"/><span className="text-xs font-bold">{monthName}</span></div>
          <div className="flex gap-1"><button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="w-7 h-7 rounded-full bg-[#FAF6F3] flex items-center justify-center"><ChevronLeft className="w-3.5 h-3.5"/></button><button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="w-7 h-7 rounded-full bg-[#FAF6F3] flex items-center justify-center"><ChevronRight className="w-3.5 h-3.5"/></button></div>
        </div>
        <div className="grid grid-cols-7 text-center mb-1">{['S','M','T','W','T','F','S'].map((d,i)=><span key={i} className="text-[10px] text-[#A69A9F]">{d}</span>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({length:firstDay}).map((_,i)=><div key={`e-${i}`} className="h-8"/>)}
          {Array.from({length:daysInMonth}).map((_,i)=>{
            const day=i+1;
            const date=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
            const p=state.periodDays[date];
            const selected=date===selectedDate;
            const isPeriod=Boolean(p?.isPeriod && p.flow!=='none');
            return <button key={date} onClick={()=>setSelectedDate(date)} className={`h-8 rounded-xl text-xs relative ${selected?'ring-1 ring-[#B5838D]':''} ${isPeriod?'bg-[#F7EDF0] text-[#8E5D68] font-bold':'hover:bg-[#FAF8F5]'}`}>{day}{isPeriod&&<span className="absolute w-1 h-1 rounded-full bg-[#B5838D] bottom-1 left-1/2 -translate-x-1/2"/>}</button>;
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6]">
        <div className="flex justify-between items-center"><h3 className="text-xs font-bold">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</h3><button onClick={()=>setShowLog(true)} className="text-[11px] font-semibold text-[#B5838D]">{selectedLog?'Edit':'+ Log'}</button></div>
        {selectedLog ? <div className="mt-2 text-xs text-[#7A6C74]"><div>Flow: <span className="font-semibold capitalize">{selectedLog.flow}</span></div>{selectedLog.notes&&<p className="mt-1">{selectedLog.notes}</p>}</div> : <p className="text-xs text-[#A69A9F] mt-2">No cycle entry for this date.</p>}
      </div>

      {showLog && <PeriodLogModal initialDate={selectedDate} onClose={()=>setShowLog(false)}/>} 
      {showHistory && <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"><div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl p-4 max-h-[80vh] flex flex-col"><div className="flex justify-between mb-3"><h3 className="text-xs font-bold">Cycle history</h3><button onClick={()=>setShowHistory(false)} className="text-xs text-[#B5838D] font-semibold">Done</button></div><div className="overflow-y-auto space-y-2">{periodDates.length===0?<p className="text-xs text-[#A69A9F]">No cycle history yet.</p>:Object.values(state.periodDays).sort((a,b)=>b.date.localeCompare(a.date)).map(p=><div key={p.id} className="p-3 bg-white rounded-xl border border-[#EFEAE6]"><div className="flex justify-between"><span className="text-xs font-bold">{p.date}</span><span className="text-[10px] capitalize text-[#B5838D]">{p.flow}</span></div>{p.notes&&<p className="text-[10px] text-[#7A6C74] mt-1">{p.notes}</p>}</div>)}</div></div></div>}
    </div>
  );
};
