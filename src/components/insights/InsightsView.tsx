import React from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Droplets, Activity, Calendar } from 'lucide-react';

const moodScore: Record<string, number> = { bad: 1, low: 2, okay: 3, good: 4, great: 5 };

const correlation = (pairs: Array<[number, number]>): number | null => {
  if (pairs.length < 5) return null;
  const xs = pairs.map(p => p[0]);
  const ys = pairs.map(p => p[1]);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0;
  let dx = 0;
  let dy = 0;
  pairs.forEach(([x, y]) => {
    num += (x - mx) * (y - my);
    dx += (x - mx) ** 2;
    dy += (y - my) ** 2;
  });
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
};

const describe = (r: number | null, positiveLabel: string, negativeLabel: string) => {
  if (r === null) return 'Not enough varied data yet. Log at least 5 days to calculate this pattern.';
  if (r >= 0.35) return positiveLabel;
  if (r <= -0.35) return negativeLabel;
  return 'No clear relationship is visible in your current logs yet.';
};

export const InsightsView: React.FC = () => {
  const { state } = useApp();
  const checkins = Object.values(state.dailyCheckins).sort((a, b) => a.date.localeCompare(b.date));

  const sleepEnergy = checkins
    .filter(c => typeof c.sleepHours === 'number' && c.sleepHours > 0 && typeof c.energy === 'number')
    .map(c => [c.sleepHours as number, c.energy as number] as [number, number]);

  const waterEnergy = checkins
    .filter(c => typeof c.waterGlasses === 'number' && typeof c.energy === 'number')
    .map(c => [c.waterGlasses as number, c.energy as number] as [number, number]);

  const movementMood = checkins
    .filter(c => typeof c.movementMinutes === 'number' && c.mood)
    .map(c => [c.movementMinutes as number, moodScore[c.mood as string]] as [number, number]);

  const sleepR = correlation(sleepEnergy);
  const waterR = correlation(waterEnergy);
  const movementR = correlation(movementMood);

  const periodDays = Object.values(state.periodDays).filter(p => p.isPeriod && p.flow !== 'none');
  const avgCramps = periodDays.length
    ? periodDays.reduce((sum, p) => sum + (p.symptoms?.cramps || 0), 0) / periodDays.length
    : null;

  const cards = [
    {
      icon: Moon,
      title: 'Sleep & energy',
      text: describe(
        sleepR,
        `Across ${sleepEnergy.length} logged days, more sleep tends to align with higher energy.`,
        `Across ${sleepEnergy.length} logged days, more sleep has not aligned with higher energy so far.`
      )
    },
    {
      icon: Droplets,
      title: 'Water & energy',
      text: describe(
        waterR,
        `Across ${waterEnergy.length} logged days, higher water intake tends to align with higher energy.`,
        `Across ${waterEnergy.length} logged days, higher water intake has not aligned with higher energy so far.`
      )
    },
    {
      icon: Activity,
      title: 'Movement & mood',
      text: describe(
        movementR,
        `Across ${movementMood.length} logged days, more movement tends to align with a higher mood rating.`,
        `Across ${movementMood.length} logged days, more movement has not aligned with a higher mood rating so far.`
      )
    },
    {
      icon: Calendar,
      title: 'Cycle symptoms',
      text: avgCramps === null
        ? 'No period symptom pattern yet. Log period days and symptoms to build this summary.'
        : `You have ${periodDays.length} logged period day${periodDays.length === 1 ? '' : 's'}; average cramps are ${avgCramps.toFixed(1)}/5.`
    }
  ];

  return (
    <div className="space-y-3 text-left font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider">Observed Patterns</h3>
        <span className="text-[10px] text-[#A69A9F]">Calculated from your logs</span>
      </div>

      {cards.map(({ icon: Icon, title, text }) => (
        <div key={title} className="p-3.5 rounded-2xl bg-white border border-[#EFEAE6] shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md bg-[#FAF5F2] flex items-center justify-center"><Icon className="w-3 h-3 text-[#B5838D]"/></div>
            <h4 className="text-xs font-bold text-[#2C2428]">{title}</h4>
          </div>
          <p className="text-xs text-[#7A6C74] leading-relaxed">{text}</p>
        </div>
      ))}

      <div className="p-2.5 bg-white/60 rounded-xl text-[10px] text-[#A69A9F] text-center border border-[#EFEAE6]">
        Patterns are descriptive correlations only; they are not diagnosis or proof of cause.
      </div>
    </div>
  );
};
