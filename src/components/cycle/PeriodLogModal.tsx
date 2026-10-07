import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FlowIntensity, SymptomScores } from '../../types/database';
import { getTodayDateString } from '../../services/storage';
import { X, Check } from 'lucide-react';

interface PeriodLogModalProps {
  initialDate?: string;
  onClose: () => void;
}

export const PeriodLogModal: React.FC<PeriodLogModalProps> = ({
  initialDate,
  onClose
}) => {
  const { state, savePeriodDay } = useApp();
  const selectedDate = initialDate || getTodayDateString();

  const existingLog = state.periodDays[selectedDate];

  const [date, setDate] = useState(selectedDate);
  const [isPeriod, setIsPeriod] = useState(existingLog?.isPeriod ?? true);
  const [flow, setFlow] = useState<FlowIntensity>(existingLog?.flow ?? 'medium');
  const [symptoms, setSymptoms] = useState<SymptomScores>(
    existingLog?.symptoms ?? {
      cramps: 1,
      bloating: 1,
      fatigue: 1,
      headache: 1,
      acne: 1,
      moodSwings: 1,
      cravings: 1
    }
  );
  const [notes, setNotes] = useState(existingLog?.notes ?? '');

  const updateSymptom = (name: keyof SymptomScores, val: number) => {
    setSymptoms(prev => ({ ...prev, [name]: val }));
  };

  const handleSave = () => {
    savePeriodDay({
      date,
      isPeriod,
      flow: isPeriod ? flow : 'none',
      symptoms,
      notes
    });
    onClose();
  };

  const flowOptions: { id: FlowIntensity; label: string; desc: string }[] = [
    { id: 'spotting', label: 'Spotting', desc: 'Minimal' },
    { id: 'light', label: 'Light', desc: 'Mild flow' },
    { id: 'medium', label: 'Medium', desc: 'Steady' },
    { id: 'heavy', label: 'Heavy', desc: 'Frequent' }
  ];

  const symptomLabels: { key: keyof SymptomScores; label: string }[] = [
    { key: 'cramps', label: 'Cramps & Pelvic Comfort' },
    { key: 'bloating', label: 'Bloating & Digestion' },
    { key: 'fatigue', label: 'Fatigue & Energy' },
    { key: 'headache', label: 'Head Tension' },
    { key: 'acne', label: 'Skin & Blemishes' },
    { key: 'moodSwings', label: 'Emotional Sensitivity' },
    { key: 'cravings', label: 'Appetite & Cravings' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden border border-[#EFEAE6]">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#EFEAE6] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
              Cycle & Symptoms
            </h3>
            <p className="text-[11px] text-[#7A6C74]">Private personal tracking</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF6F3] text-stone-400 hover:text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-left font-sans">
          {/* Date Picker */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full bg-white border border-[#EAE3DE] rounded-xl px-3 py-1.5 text-xs text-[#2C2428] font-medium focus:outline-none focus:border-[#B5838D]"
            />
          </div>

          {/* Is Period Active Today Toggle */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#EFEAE6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#2C2428] block">
                Period Bleeding Today?
              </span>
              <span className="text-[11px] text-[#7A6C74]">
                Records flow intensity for cycle calculations
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPeriod(!isPeriod)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                isPeriod ? 'bg-[#2C2428]' : 'bg-stone-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  isPeriod ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Flow Intensity (if Period is active) */}
          {isPeriod && (
            <div>
              <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1.5">
                Flow Intensity
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {flowOptions.map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFlow(opt.id)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all ${
                      flow === opt.id
                        ? 'bg-white border-[#B5838D] text-[#2C2428] font-bold shadow-xs'
                        : 'bg-white/60 border-[#EFEAE6] text-[#7A6C74] hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xs block font-semibold">{opt.label}</span>
                    <span className="text-[9px] text-[#A69A9F] block mt-0.5">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cycle symptoms */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-2">
              Symptom Intensity (1 = None, 5 = Intense)
            </label>
            <div className="space-y-2">
              {symptomLabels.map(s => {
                const currentVal = symptoms[s.key];
                return (
                  <div
                    key={s.key}
                    className="bg-white p-3 rounded-2xl border border-[#EFEAE6] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-[#2C2428] block">
                        {s.label}
                      </span>
                      <span className="text-[10px] text-[#A69A9F]">
                        Level {currentVal} of 5
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => updateSymptom(s.key, lvl)}
                          className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                            currentVal === lvl
                              ? 'bg-[#B5838D] text-white'
                              : 'bg-[#FAF6F3] text-[#7A6C74] hover:bg-stone-200'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personal Notes */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              Private Cycle Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Comfort notes, heating pad used, sleep quality..."
              className="w-full p-3 rounded-xl border border-[#EAE3DE] bg-white text-xs text-[#2C2428] placeholder:text-[#A69A9F] focus:outline-none focus:border-[#B5838D]"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#EFEAE6] flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A6C74] hover:bg-[#FAF8F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#2C2428] hover:bg-black text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
          >
            Save Log
          </button>
        </div>
      </div>
    </div>
  );
};
