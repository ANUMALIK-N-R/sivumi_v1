import React from 'react';
import { useApp } from '../../context/AppContext';
import { MoodLevel } from '../../types/database';
import { getTodayDateString } from '../../services/storage';

interface MoodOption {
  level: MoodLevel;
  label: string;
  dotColor: string;
}

export const MoodSelector: React.FC = () => {
  const { state, logDailyMood } = useApp();
  const today = getTodayDateString();
  const currentMood = state.dailyCheckins[today]?.mood;

  const moodOptions: MoodOption[] = [
    { level: 'great', label: 'Radiant', dotColor: 'bg-[#C2828D]' },
    { level: 'good', label: 'Calm', dotColor: 'bg-[#98A89E]' },
    { level: 'okay', label: 'Gentle', dotColor: 'bg-[#CCA576]' },
    { level: 'low', label: 'Tender', dotColor: 'bg-[#9A8F98]' },
    { level: 'bad', label: 'Heavy', dotColor: 'bg-[#73636F]' }
  ];

  return (
    <div className="w-full text-left">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-semibold tracking-wider text-[#9C8F96] uppercase">
          Today&apos;s Feeling
        </span>
        <span className="text-[10px] text-[#B5838D] font-medium">
          {currentMood ? `Logged: ${currentMood}` : 'Select feeling'}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {moodOptions.map(option => {
          const isSelected = currentMood === option.level;

          return (
            <button
              key={option.level}
              type="button"
              onClick={() => logDailyMood(option.level)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-150 border focus-visible:outline-none ${
                isSelected
                  ? 'bg-white border-[#B5838D] shadow-xs'
                  : 'bg-[#FAF8F5] border-transparent hover:border-[#EFEAE6] hover:bg-white'
              }`}
              aria-label={`Feeling ${option.label}`}
            >
              <div className="mb-1.5 flex items-center justify-center w-5 h-5">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
                    option.dotColor
                  } ${isSelected ? 'scale-125 ring-2 ring-[#B5838D]/30' : 'opacity-80'}`}
                />
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight ${
                  isSelected ? 'text-[#2C2428] font-bold' : 'text-[#7A6C74]'
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
