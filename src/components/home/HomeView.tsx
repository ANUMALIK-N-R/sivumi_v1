import React from 'react';
import { useApp } from '../../context/AppContext';
import { MoodSelector } from './MoodSelector';
import { SummaryGrid } from './SummaryGrid';
import { DailyCheckinWidget } from './DailyCheckinWidget';
import { InsightsView } from '../insights/InsightsView';

export const HomeView: React.FC = () => {
  const { state } = useApp();
  const nickname = state.user.nickname || state.user.name || 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="pb-28 max-w-md mx-auto px-4 pt-3 space-y-4 font-sans text-left">
      <div className="pt-1">
        <span className="text-[10px] font-semibold tracking-wider text-[#9C8F96] uppercase block">{greeting}</span>
        <h1 className="text-xl font-bold text-[#2C2428] tracking-tight mt-0.5">{nickname}</h1>
        <p className="text-[11px] text-[#7A6C74] mt-0.5">Your private daily health journal.</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[#EFEAE6] shadow-xs">
        <MoodSelector />
        <p className="text-[10px] text-[#A69A9F] mt-2">
          Your selection is saved in Journal → Today and kept with daily wellbeing history for 30 days.
        </p>
      </div>

      <SummaryGrid />
      <DailyCheckinWidget />

      <div className="pt-1">
        <InsightsView />
      </div>
    </div>
  );
};
