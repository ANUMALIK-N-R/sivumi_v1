import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Check, ShieldCheck } from 'lucide-react';

interface OnboardingFlowProps { onComplete: () => void; }

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { state, updateUser, updateSettings } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(state.user.name || '');
  const [nickname, setNickname] = useState(state.user.nickname || '');
  const [lastPeriodStart, setLastPeriodStart] = useState(state.settings.lastPeriodStartDate || '');
  const [cycleLength, setCycleLength] = useState(state.settings.cycleTypicalLength || 28);
  const [periodLength, setPeriodLength] = useState(state.settings.periodTypicalLength || 5);
  const [waterTarget, setWaterTarget] = useState(state.settings.dailyWaterTarget || 8);
  const [sleepTarget, setSleepTarget] = useState(state.settings.dailySleepTarget || 8);
  const [appLock, setAppLock] = useState(false);
  const [pin, setPin] = useState('');

  const finish = () => {
    updateUser({ name: name.trim(), nickname: nickname.trim() });
    updateSettings({
      hasCompletedOnboarding: true,
      lastPeriodStartDate: lastPeriodStart,
      cycleTypicalLength: Math.max(21, cycleLength || 28),
      periodTypicalLength: Math.max(1, periodLength || 5),
      dailyWaterTarget: Math.max(1, waterTarget || 8),
      dailySleepTarget: Math.max(1, sleepTarget || 8),
      appLockEnabled: appLock,
      pinCode: appLock ? pin : ''
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-5 py-6 flex flex-col max-w-md mx-auto">
      <div className="flex gap-1 mb-5">{[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-[#B5838D]' : 'bg-[#EAE3DE]'}`}/>)}</div>

      {step === 1 && <Screen title="Welcome to Sivumi" subtitle="A private local journal for daily wellbeing, food, cycle tracking, habits, and goals.">
        <div className="bg-white p-4 rounded-2xl border border-[#EFEAE6] space-y-3">
          <Field label="Name (optional)" value={name} onChange={setName}/>
          <Field label="Nickname (optional)" value={nickname} onChange={setNickname}/>
        </div>
        <Next onClick={() => setStep(2)}/>
      </Screen>}

      {step === 2 && <Screen title="Cycle setup" subtitle="You can leave the last-period date blank and start logging later.">
        <div className="bg-white p-4 rounded-2xl border border-[#EFEAE6] space-y-3">
          <div><label className="label">Last period start</label><input type="date" value={lastPeriodStart} onChange={e => setLastPeriodStart(e.target.value)} className="input"/></div>
          <div className="grid grid-cols-2 gap-2"><NumberField label="Typical cycle" value={cycleLength} setValue={setCycleLength} suffix="days"/><NumberField label="Typical period" value={periodLength} setValue={setPeriodLength} suffix="days"/></div>
        </div>
        <Next onClick={() => setStep(3)}/>
      </Screen>}

      {step === 3 && <Screen title="Daily targets" subtitle="These are goals for comparison. Your Daily Baseline stores the actual amount you record.">
        <div className="bg-white p-4 rounded-2xl border border-[#EFEAE6] grid grid-cols-2 gap-3">
          <NumberField label="Water" value={waterTarget} setValue={setWaterTarget} suffix="glasses/day"/>
          <NumberField label="Sleep" value={sleepTarget} setValue={setSleepTarget} suffix="hours/night" step="0.5"/>
        </div>
        <Next onClick={() => setStep(4)}/>
      </Screen>}

      {step === 4 && <Screen title="Privacy" subtitle="Daily wellbeing and food logs stay local and are automatically kept for 30 days.">
        <div className="bg-white p-4 rounded-2xl border border-[#EFEAE6] space-y-3">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#B5838D]"/><p className="text-xs text-[#6E6168]">No account is required. No chat is enabled in this version.</p></div>
          <button onClick={() => setAppLock(!appLock)} className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5]"><span className="text-xs font-semibold">Enable PIN lock</span><span className={`w-5 h-5 rounded-md border flex items-center justify-center ${appLock ? 'bg-[#B5838D] text-white border-[#B5838D]' : 'border-[#D8CFCA]'}`}>{appLock && <Check className="w-3.5 h-3.5"/>}</span></button>
          {appLock && <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,''))} placeholder="Choose a 4-digit PIN" className="input"/>}
        </div>
        <button onClick={finish} disabled={appLock && pin.length !== 4} className="w-full py-3 rounded-xl bg-[#2C2428] text-white text-xs font-semibold disabled:opacity-40">Start using Sivumi</button>
      </Screen>}
    </div>
  );
};

const Screen = ({title,subtitle,children}:{title:string,subtitle:string,children:React.ReactNode}) => <div className="my-auto space-y-4"><div><h2 className="text-xl font-bold text-[#2C2428]">{title}</h2><p className="text-xs text-[#7A6C74] mt-1">{subtitle}</p></div>{children}</div>;
const Next = ({onClick}:{onClick:()=>void}) => <button onClick={onClick} className="w-full py-3 rounded-xl bg-[#2C2428] text-white text-xs font-semibold flex items-center justify-center gap-1"><span>Continue</span><ChevronRight className="w-4 h-4"/></button>;
const Field = ({label,value,onChange}:{label:string,value:string,onChange:(v:string)=>void}) => <div><label className="label">{label}</label><input value={value} onChange={e => onChange(e.target.value)} className="input"/></div>;
const NumberField = ({label,value,setValue,suffix,step='1'}:{label:string,value:number,setValue:(v:number)=>void,suffix:string,step?:string}) => <div><label className="label">{label}</label><input type="number" min="1" step={step} value={value} onChange={e => setValue(Number(e.target.value))} className="input"/><span className="text-[9px] text-[#A69A9F]">{suffix}</span></div>;
