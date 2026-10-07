import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MealType } from '../../types/database';
import { getTodayDateString } from '../../services/storage';
import { X } from 'lucide-react';

interface AddMealModalProps {
  onClose: () => void;
  defaultMealType?: MealType;
  defaultDate?: string;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({
  onClose,
  defaultMealType = 'breakfast',
  defaultDate = getTodayDateString()
}) => {
  const { addMeal } = useApp();
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Protein']);
  const [hungerBefore, setHungerBefore] = useState<number>(3);
  const [fullnessAfter, setFullnessAfter] = useState<number>(3);
  const [date, setDate] = useState(defaultDate);

  const availableTags = [
    'Protein',
    'Vegetables',
    'Healthy Fats',
    'Whole Grains',
    'Fruit',
    'Balanced',
    'Comfort Warmth',
    'Sweet Treat'
  ];

  const mealTypes: { id: MealType; label: string }[] = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'snack', label: 'Snack' },
    { id: 'dinner', label: 'Dinner' }
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    addMeal({
      date,
      mealType,
      name: name.trim(),
      description: description.trim() || undefined,
      tags: selectedTags,
      hungerBefore,
      fullnessAfter,
      cravingSatisfied: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden border border-[#EFEAE6]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-white border-b border-[#EFEAE6] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xs font-bold text-[#2C2428] uppercase tracking-wider">
              Log Nourishment
            </h3>
            <p className="text-[11px] text-[#7A6C74]">Mindful and non-judgmental</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#FAF6F3] text-stone-400 hover:text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-left font-sans">
          {/* Meal Type Tabs */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1.5">
              Meal Time
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-[#FAF6F3] p-1 rounded-xl border border-[#EAE3DE]">
              {mealTypes.map(mt => (
                <button
                  key={mt.id}
                  type="button"
                  onClick={() => setMealType(mt.id)}
                  className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                    mealType === mt.id
                      ? 'bg-white text-[#2C2428] font-bold shadow-xs'
                      : 'text-[#7A6C74] hover:text-[#2C2428]'
                  }`}
                >
                  {mt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Name Input */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              What did you have?
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Scrambled eggs with spinach & sourdough"
              className="w-full bg-white border border-[#EAE3DE] rounded-xl px-3 py-2 text-xs text-[#2C2428] focus:outline-none focus:border-[#B5838D]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1">
              Notes or feeling (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Felt warm, satisfied, good energy afterward..."
              className="w-full bg-white border border-[#EAE3DE] rounded-xl p-3 text-xs text-[#2C2428] placeholder:text-[#A69A9F] focus:outline-none focus:border-[#B5838D]"
            />
          </div>

          {/* Nutrition Tags */}
          <div>
            <label className="text-[10px] font-semibold text-[#8C7E86] uppercase tracking-wider block mb-1.5">
              Nourishment Elements
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#2C2428] text-white border-[#2C2428]'
                        : 'bg-white text-[#7A6C74] border-[#EAE3DE] hover:border-stone-400'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hunger & Fullness */}
          <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-[#EFEAE6]">
            <div>
              <span className="text-xs font-bold text-[#2C2428] block mb-1">Hunger before</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setHungerBefore(v)}
                    className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                      hungerBefore === v
                        ? 'bg-[#2C2428] text-white'
                        : 'bg-[#FAF6F3] text-[#7A6C74]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#2C2428] block mb-1">Fullness after</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setFullnessAfter(v)}
                    className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                      fullnessAfter === v
                        ? 'bg-[#B5838D] text-white'
                        : 'bg-[#FAF6F3] text-[#7A6C74]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
            disabled={!name.trim()}
            className="px-5 py-2 rounded-xl bg-[#2C2428] hover:bg-black text-white text-xs font-semibold shadow-xs active:scale-95 transition-all disabled:opacity-40"
          >
            Save Meal
          </button>
        </div>
      </div>
    </div>
  );
};
