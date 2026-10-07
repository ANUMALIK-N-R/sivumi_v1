import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/storage';
import { MoodLevel } from '../../types/database';
import { X, Moon, Zap, Shield, Droplets, Footprints } from 'lucide-react';

interface CheckinModalProps {
  onClose: () => void;
  date?: string;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({ onClose, date = getTodayDateString() }) => {
  const { state, saveDailyCheckin } = useApp();
  const existing = state.dailyCheckins[date];

  const [mood, setMood] = useState<MoodLevel | undefined>(existing?.mood);
  const [energy, setEnergy] = useState<number | undefined>(existing?.energy);
  const [stress, setStress] = useState<number | undefined>(existing?.stress);
  const [sleepHours, setSleepHours] = useState<string>(existing?.sleepHours?.toString() ?? '');
  const [waterGlasses, setWaterGlasses] = useState<string>(existing?.waterGlasses?.toString() ?? '');
  const [movementMinutes, setMovementMinutes] = useState<string>(existing?.movementMinutes?.toString() ?? '');
  const [reflectionNotes, setReflectionNotes] = useState(existing?.reflectionNotes || '');

  const moodButtons: { id: MoodLevel; label: string }[] = [
    { id: 'great', label: 'Radiant' },
    { id: 'good', label: 'Calm' },
    { id: 'okay', label: 'Gentle' },
    { id: 'low', label: 'Tender' },
    { id: 'bad', label: 'Heavy' }
  ];

  const handleSave = () => {
    saveDailyCheckin({
      date,
      mood,
      energy,
      stress,
      sleepHours: sleepHours === '' ? undefined : Math.max(0, Number(sleepHours)),
      waterGlasses: waterGlasses === '' ? undefined : Math.max(0, Number(waterGlasses)),
      movementMinutes: movementMinutes === '' ? undefined : Math.max(0, Number(movementMinutes)),
      reflectionNotes: reflectionNotes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden border border-[#EFEAE6]">
        <div className="px-5 py-3.5 bg-white border-b border-[#EFEAE6] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">Daily Wellbeing</h3>
            <p className="text-[11px] text-[#7A6C74]">{new Date(`${date}T12:00:00`).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#FAF6F3] flex items-center justify-center"><X className="w-4 h-4"/></button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-left">
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1.5">Feeling</label>
            <div className="grid grid-cols-5 gap-1.5">
              {moodButtons.map(m => (
                <button key={m.id} onClick={() => setMood(m.id)} className={`py-2 rounded-xl text-[11px] border ${mood === m.id ? 'bg-white border-[#B5838D] font-bold' : 'bg-white/60 border-[#EFEAE6] text-[#7A6C74]'}`}>{m.label}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-[#EFEAE6]">
            <Scale label="Energy" icon={Zap} value={energy} onChange={setEnergy} activeClass="bg-[#2C2428]" />
            <Scale label="Stress" icon={Shield} value={stress} onChange={setStress} activeClass="bg-[#B5838D]" />
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-[#EFEAE6]">
            <NumberField icon={Moon} label="Actual sleep" suffix="hours" value={sleepHours} setValue={setSleepHours} step="0.5" />
            <NumberField icon={Droplets} label="Water total" suffix="glasses" value={waterGlasses} setValue={setWaterGlasses} step="1" />
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAE6]">
            <NumberField icon={Footprints} label="Movement" suffix="minutes" value={movementMinutes} setValue={setMovementMinutes} step="5" />
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">Notes</label>
            <textarea rows={3} value={reflectionNotes} onChange={e => setReflectionNotes(e.target.value)} placeholder="Anything you want to remember about this day" className="w-full p-3 rounded-xl border border-[#EAE3DE] bg-white text-xs focus:outline-none focus:border-[#B5838D]" />
          </div>
        </div>

        <div className="p-4 bg-white border-t border-[#EFEAE6] flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-[#7A6C74]">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-[#2C2428] text-white text-xs font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
};

const Scale = ({ label, icon: Icon, value, onChange, activeClass }: any) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1.5"><Icon className="w-3 h-3 text-[#B5838D]"/><span className="text-xs font-bold">{label}</span></div>
    <div className="flex gap-1">
      {[1,2,3,4,5].map(v => <button key={v} onClick={() => onChange(v)} className={`flex-1 py-1 rounded-lg text-xs font-semibold ${value === v ? `${activeClass} text-white` : 'bg-[#FAF6F3] text-[#7A6C74]'}`}>{v}</button>)}
    </div>
  </div>
);

const NumberField = ({ icon: Icon, label, suffix, value, setValue, step }: any) => (
  <div>
    <div className="flex items-center gap-1.5 mb-1"><Icon className="w-3 h-3 text-[#6E6168]"/><span className="text-xs font-bold">{label}</span></div>
    <input type="number" min="0" step={step} value={value} onChange={e => setValue(e.target.value)} placeholder="Not recorded" className="w-full px-3 py-1.5 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs focus:outline-none" />
    <span className="text-[9px] text-[#A69A9F]">{suffix}</span>
  </div>
);
