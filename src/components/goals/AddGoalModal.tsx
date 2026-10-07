import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GoalCategory, GoalKind } from '../../types/database';
import { X } from 'lucide-react';

interface AddGoalModalProps { onClose: () => void; }

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ onClose }) => {
  const { addGoal } = useApp();
  const [kind, setKind] = useState<GoalKind>('habit');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('health');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [targetCount, setTargetCount] = useState(1);
  const [targetUnit, setTargetUnit] = useState('times');

  const categories: { id: GoalCategory; label: string }[] = [
    { id: 'health', label: 'Health' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'food', label: 'Food' },
    { id: 'movement', label: 'Movement' },
    { id: 'study', label: 'Study' },
    { id: 'personal', label: 'Personal' },
    { id: 'emotional', label: 'Wellbeing' }
  ];

  const save = () => {
    if (!title.trim()) return;
    addGoal({
      title: title.trim(),
      kind,
      category,
      frequency,
      targetCount: Math.max(1, Number(targetCount) || 1),
      targetUnit: targetUnit.trim() || 'times',
      iconName: 'Check'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto border border-[#EFEAE6] shadow-xl">
        <div className="sticky top-0 bg-white px-5 py-3.5 border-b border-[#EFEAE6] flex justify-between items-center">
          <div><h3 className="text-xs font-bold uppercase tracking-wider">Add habit or goal</h3><p className="text-[10px] text-[#A69A9F]">Habits repeat; goals accumulate progress.</p></div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#FAF6F3] flex items-center justify-center"><X className="w-4 h-4"/></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(['habit','goal'] as GoalKind[]).map(v => <button key={v} onClick={() => setKind(v)} className={`py-2 rounded-xl border text-xs font-semibold ${kind === v ? 'bg-[#2C2428] text-white border-[#2C2428]' : 'bg-white border-[#EAE3DE]'}`}>{v === 'habit' ? 'Habit' : 'Goal'}</button>)}
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-[#8C7E86]">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder={kind === 'habit' ? 'e.g. Stretch for 10 minutes' : 'e.g. Read 200 pages'} className="w-full mt-1 px-3 py-2 rounded-xl border border-[#EAE3DE] bg-white text-xs focus:outline-none focus:border-[#B5838D]"/>
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-[#8C7E86]">Category</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {categories.map(c => <button key={c.id} onClick={() => setCategory(c.id)} className={`px-2.5 py-1 rounded-lg text-[10px] border ${category === c.id ? 'bg-[#B5838D] text-white border-[#B5838D]' : 'bg-white border-[#EAE3DE]'}`}>{c.label}</button>)}
            </div>
          </div>

          {kind === 'habit' && (
            <div>
              <label className="text-[10px] uppercase font-semibold text-[#8C7E86]">Repeat</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {(['daily','weekly'] as const).map(v => <button key={v} onClick={() => setFrequency(v)} className={`py-1.5 rounded-xl text-xs border ${frequency === v ? 'bg-white border-[#B5838D] font-bold' : 'bg-white border-[#EAE3DE]'}`}>{v}</button>)}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] uppercase font-semibold text-[#8C7E86]">Target</label><input type="number" min="1" value={targetCount} onChange={e => setTargetCount(Number(e.target.value) || 1)} className="w-full mt-1 px-3 py-2 rounded-xl border border-[#EAE3DE] bg-white text-xs"/></div>
            <div><label className="text-[10px] uppercase font-semibold text-[#8C7E86]">Unit</label><input value={targetUnit} onChange={e => setTargetUnit(e.target.value)} placeholder="times, mins, pages" className="w-full mt-1 px-3 py-2 rounded-xl border border-[#EAE3DE] bg-white text-xs"/></div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-[#EFEAE6] flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-xs text-[#7A6C74]">Cancel</button>
          <button onClick={save} disabled={!title.trim()} className="px-5 py-2 rounded-xl bg-[#2C2428] text-white text-xs font-semibold disabled:opacity-40">Save</button>
        </div>
      </div>
    </div>
  );
};
