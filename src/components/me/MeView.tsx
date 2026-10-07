import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DAILY_LOG_RETENTION_DAYS } from '../../services/storage';
import { Download, Upload, AlertTriangle, Lock, Target, Database } from 'lucide-react';

export const MeView: React.FC = () => {
  const { state, updateUser, updateSettings, exportData, importData, resetWellnessData, resetAllData } = useApp();
  const [name, setName] = useState(state.user.name || '');
  const [nickname, setNickname] = useState(state.user.nickname || '');
  const [waterTarget, setWaterTarget] = useState(state.settings.dailyWaterTarget || 8);
  const [sleepTarget, setSleepTarget] = useState(state.settings.dailySleepTarget || 8);
  const [appLock, setAppLock] = useState(state.settings.appLockEnabled);
  const [pin, setPin] = useState(state.settings.pinCode || '');
  const [confirm, setConfirm] = useState<'wellness'|'all'|null>(null);
  const [toast, setToast] = useState('');

  const save = () => {
    updateUser({ name: name.trim(), nickname: nickname.trim() });
    updateSettings({
      dailyWaterTarget: Math.max(1, Number(waterTarget) || 8),
      dailySleepTarget: Math.max(1, Number(sleepTarget) || 8),
      appLockEnabled: appLock,
      pinCode: appLock ? pin : ''
    });
    setToast('Saved');
    setTimeout(() => setToast(''), 1500);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setToast(importData(text) ? 'Backup imported' : 'Could not import this file');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 text-left font-sans">
      {toast && <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#2C2428] text-white text-xs px-4 py-2 rounded-full shadow-lg">{toast}</div>}

      <section className="bg-white rounded-2xl p-4 border border-[#EFEAE6] space-y-3">
        <div><h2 className="text-sm font-bold">Profile</h2><p className="text-[10px] text-[#A69A9F]">Only stored on this device.</p></div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Name" value={name} onChange={setName}/>
          <Field label="Nickname" value={nickname} onChange={setNickname}/>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 border border-[#EFEAE6] space-y-3">
        <div className="flex gap-2 items-center"><Target className="w-4 h-4 text-[#B5838D]"/><div><h3 className="text-xs font-bold">Daily targets</h3><p className="text-[10px] text-[#A69A9F]">Targets are separate from what you actually record.</p></div></div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Water target" suffix="glasses/day" value={waterTarget} setValue={setWaterTarget} step="1" />
          <NumberField label="Sleep target" suffix="hours/night" value={sleepTarget} setValue={setSleepTarget} step="0.5" />
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 border border-[#EFEAE6] space-y-2">
        <div className="flex gap-2 items-center"><Database className="w-4 h-4 text-[#B5838D]"/><h3 className="text-xs font-bold">Data retention</h3></div>
        <p className="text-[11px] text-[#7A6C74] leading-relaxed">
          Daily wellbeing and food records are automatically kept for the latest {DAILY_LOG_RETENTION_DAYS} days. Cycle history, habits, goals, and goal progress stay until you delete or reset them.
        </p>
      </section>

      <section className="bg-white rounded-2xl p-4 border border-[#EFEAE6] space-y-3">
        <div className="flex gap-2 items-center"><Lock className="w-4 h-4 text-[#B5838D]"/><h3 className="text-xs font-bold">Privacy & lock</h3></div>
        <div className="flex items-center justify-between">
          <div><span className="text-xs font-semibold block">PIN lock</span><span className="text-[10px] text-[#A69A9F]">Optional local protection</span></div>
          <button onClick={() => setAppLock(!appLock)} className={`w-11 h-6 rounded-full p-0.5 ${appLock ? 'bg-[#2C2428]' : 'bg-stone-200'}`}><div className={`w-5 h-5 rounded-full bg-white transition-transform ${appLock ? 'translate-x-5' : ''}`}/></button>
        </div>
        {appLock && <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,''))} placeholder="4-digit PIN" className="w-32 px-3 py-2 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs"/>}
      </section>

      <button onClick={save} className="w-full py-2.5 rounded-xl bg-[#2C2428] text-white text-xs font-semibold">Save settings</button>

      <section className="bg-white rounded-2xl p-4 border border-[#EFEAE6] space-y-3">
        <h3 className="text-xs font-bold">Backup & reset</h3>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={exportData} className="py-2 rounded-xl bg-[#FAF6F3] border border-[#EAE3DE] text-xs flex items-center justify-center gap-1"><Download className="w-3.5 h-3.5"/>Export JSON</button>
          <label className="py-2 rounded-xl bg-[#FAF6F3] border border-[#EAE3DE] text-xs flex items-center justify-center gap-1 cursor-pointer"><Upload className="w-3.5 h-3.5"/>Import JSON<input type="file" accept=".json" onChange={handleImport} className="hidden"/></label>
        </div>

        {confirm ? (
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <div className="flex gap-1.5 items-center text-xs font-semibold text-rose-800"><AlertTriangle className="w-4 h-4"/>Are you sure?</div>
            <div className="flex justify-end gap-2 mt-2"><button onClick={() => setConfirm(null)} className="px-3 py-1 text-xs">Cancel</button><button onClick={() => { confirm === 'wellness' ? resetWellnessData() : resetAllData(); setConfirm(null); }} className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs">Confirm</button></div>
          </div>
        ) : (
          <div className="space-y-1 text-[11px]"><button onClick={() => setConfirm('wellness')} className="block text-[#8C7E86]">Clear health logs</button><button onClick={() => setConfirm('all')} className="block text-rose-500">Factory reset all local data</button></div>
        )}
      </section>
    </div>
  );
};

const Field = ({label,value,onChange}:{label:string,value:string,onChange:(v:string)=>void}) => <div><label className="text-[10px] uppercase font-semibold text-[#8C7E86]">{label}</label><input value={value} onChange={e => onChange(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs"/></div>;
const NumberField = ({label,suffix,value,setValue,step}:{label:string,suffix:string,value:number,setValue:(v:number)=>void,step:string}) => <div><label className="text-[10px] uppercase font-semibold text-[#8C7E86]">{label}</label><input type="number" min="1" step={step} value={value} onChange={e => setValue(Number(e.target.value))} className="w-full mt-1 px-3 py-2 rounded-xl border border-[#EAE3DE] bg-[#FAF8F5] text-xs"/><span className="text-[9px] text-[#A69A9F]">{suffix}</span></div>;
