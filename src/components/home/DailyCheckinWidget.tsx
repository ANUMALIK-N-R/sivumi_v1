import React from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../services/storage';
import { Moon, Droplets, Plus, Minus, Info } from 'lucide-react';

export const DailyCheckinWidget: React.FC = () => {
  const { state, saveDailyCheckin } = useApp();
  const today = getTodayDateString();
  const checkin = state.dailyCheckins[today];
  const water = checkin?.waterGlasses ?? 0;
  const sleep = checkin?.sleepHours ?? 0;
  const waterTarget = state.settings.dailyWaterTarget || 8;
  const sleepTarget = state.settings.dailySleepTarget || 8;

  const update = (updates: Record<string, number>) => {
    saveDailyCheckin({ date: today, ...updates });
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs text-left font-sans">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <h3 className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider">Daily Baseline</h3>
          <p className="text-[10px] text-[#A69A9F] mt-0.5">Actual totals recorded for today — not your targets.</p>
        </div>
        <span className="text-[9px] text-[#8C7E86] bg-[#FAF6F3] rounded-full px-2 py-1">Auto-saved</span>
      </div>

      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFEAE6] mb-3 flex gap-2 items-start">
        <Info className="w-3.5 h-3.5 text-[#B5838D] mt-0.5 shrink-0" />
        <p className="text-[10px] text-[#7A6C74] leading-relaxed">
          Water = how many glasses you actually drank today. Sleep = the total sleep from the sleep period ending today. Targets are shown only for comparison.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-1 border-b border-[#FAF6F3]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#FAF5F2] flex items-center justify-center"><Droplets className="w-3.5 h-3.5 text-[#6E6168]"/></div>
            <div>
              <span className="text-xs font-semibold text-[#2C2428] block">Water consumed today</span>
              <span className="text-[10px] text-[#A69A9F]">{water} / {waterTarget} glass target</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => update({ waterGlasses: Math.max(0, water - 1) })} className="w-7 h-7 rounded-full bg-[#FAF6F3] flex items-center justify-center"><Minus className="w-3 h-3"/></button>
            <span className="text-xs font-bold w-5 text-center">{water}</span>
            <button onClick={() => update({ waterGlasses: water + 1 })} className="w-7 h-7 rounded-full bg-[#FAF6F3] text-[#B5838D] flex items-center justify-center"><Plus className="w-3 h-3"/></button>
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#FAF5F2] flex items-center justify-center"><Moon className="w-3.5 h-3.5 text-[#6E6168]"/></div>
            <div>
              <span className="text-xs font-semibold text-[#2C2428] block">Sleep total</span>
              <span className="text-[10px] text-[#A69A9F]">{sleep ? `${sleep} h` : 'Not recorded'} / {sleepTarget} h target</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => update({ sleepHours: Math.max(0, +(sleep - 0.5).toFixed(1)) })} className="w-7 h-7 rounded-full bg-[#FAF6F3] flex items-center justify-center"><Minus className="w-3 h-3"/></button>
            <span className="text-xs font-bold w-9 text-center">{sleep ? `${sleep}h` : '—'}</span>
            <button onClick={() => update({ sleepHours: Math.min(24, +(sleep + 0.5).toFixed(1)) })} className="w-7 h-7 rounded-full bg-[#FAF6F3] text-[#B5838D] flex items-center justify-center"><Plus className="w-3 h-3"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};
