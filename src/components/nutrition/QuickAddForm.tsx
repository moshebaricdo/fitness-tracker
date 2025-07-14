'use client';

import React, { useState } from 'react';
import { TimeOfDay } from '@/types';
import { Plus, Zap } from 'lucide-react';

interface QuickAddFormProps {
  onQuickAdd: (foodName: string, protein: number, timeOfDay: TimeOfDay) => Promise<void>;
  currentTimeOfDay?: TimeOfDay;
}

interface QuickAddPreset {
  name: string;
  protein: number;
  emoji: string;
}

const quickAddPresets: QuickAddPreset[] = [
  { name: 'Protein Shake', protein: 25, emoji: '🥤' },
  { name: 'Chicken Breast', protein: 35, emoji: '🐔' },
  { name: 'Greek Yogurt', protein: 20, emoji: '🥛' },
  { name: 'Eggs (2)', protein: 12, emoji: '🥚' },
  { name: 'Tuna Can', protein: 30, emoji: '🐟' },
  { name: 'Protein Bar', protein: 15, emoji: '🍫' },
];

const getCurrentTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 19) return 'dinner';
  return 'snack';
};

export const QuickAddForm: React.FC<QuickAddFormProps> = ({
  onQuickAdd,
  currentTimeOfDay
}) => {
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<TimeOfDay>(
    currentTimeOfDay || getCurrentTimeOfDay()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customFood, setCustomFood] = useState('');
  const [customProtein, setCustomProtein] = useState('');

  const handleQuickAdd = async (preset: QuickAddPreset) => {
    setIsLoading(true);
    try {
      await onQuickAdd(preset.name, preset.protein, selectedTimeOfDay);
    } catch (error) {
      console.error('Error adding quick entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFood.trim() || !customProtein) return;

    setIsLoading(true);
    try {
      await onQuickAdd(customFood.trim(), parseInt(customProtein), selectedTimeOfDay);
      setCustomFood('');
      setCustomProtein('');
      setShowCustomForm(false);
    } catch (error) {
      console.error('Error adding custom entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-gray-900">Quick Add</h3>
        </div>
        
        <select
          value={selectedTimeOfDay}
          onChange={(e) => setSelectedTimeOfDay(e.target.value as TimeOfDay)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      {!showCustomForm ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {quickAddPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleQuickAdd(preset)}
                disabled={isLoading}
                className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left disabled:opacity-50"
              >
                <span className="text-lg">{preset.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {preset.name}
                  </div>
                  <div className="text-xs text-primary-600">
                    {preset.protein}g protein
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCustomForm(true)}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Food
          </button>
        </div>
      ) : (
        <form onSubmit={handleCustomAdd} className="space-y-3">
          <div>
            <input
              type="text"
              value={customFood}
              onChange={(e) => setCustomFood(e.target.value)}
              placeholder="Food name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <input
              type="number"
              value={customProtein}
              onChange={(e) => setCustomProtein(e.target.value)}
              placeholder="Protein (g)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min="0"
              max="200"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading || !customFood.trim() || !customProtein}
              className="flex-1 btn btn-primary"
            >
              {isLoading ? 'Adding...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => setShowCustomForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 