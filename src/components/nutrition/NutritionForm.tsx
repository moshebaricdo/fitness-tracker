'use client';

import React, { useState } from 'react';
import { NutritionEntry, TimeOfDay } from '@/types';
import { Plus, X } from 'lucide-react';

interface NutritionFormProps {
  entry?: NutritionEntry;
  onSubmit: (entry: Omit<NutritionEntry, 'id' | 'createdAt'>) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const timeOfDayOptions: { value: TimeOfDay; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

export const NutritionForm: React.FC<NutritionFormProps> = ({
  entry,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [foodName, setFoodName] = useState(entry?.foodName || '');
  const [proteinEstimate, setProteinEstimate] = useState(entry?.proteinEstimate?.toString() || '');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(entry?.timeOfDay || 'breakfast');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName.trim() || !proteinEstimate) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        date: entry?.date || new Date().toISOString().split('T')[0],
        foodName: foodName.trim(),
        proteinEstimate: parseInt(proteinEstimate),
        timeOfDay
      });
      
      // Reset form if not editing
      if (!isEditing) {
        setFoodName('');
        setProteinEstimate('');
        setTimeOfDay('breakfast');
      }
    } catch (error) {
      console.error('Error submitting nutrition entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
          Food Item
        </label>
        <input
          type="text"
          id="foodName"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="input-field"
          placeholder="e.g., Grilled chicken breast"
          required
        />
      </div>

      <div>
        <label htmlFor="proteinEstimate" className="block text-sm font-medium text-gray-700 mb-1">
          Protein (grams)
        </label>
        <input
          type="number"
          id="proteinEstimate"
          value={proteinEstimate}
          onChange={(e) => setProteinEstimate(e.target.value)}
          className="input-field"
          placeholder="25"
          min="0"
          max="200"
          required
        />
      </div>

      <div>
        <label htmlFor="timeOfDay" className="block text-sm font-medium text-gray-700 mb-1">
          Time of Day
        </label>
        <select
          id="timeOfDay"
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
          className="input-field"
          required
        >
          {timeOfDayOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !foodName.trim() || !proteinEstimate}
          className="btn btn-primary flex items-center gap-2 flex-1"
        >
          <Plus className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : (isEditing ? 'Update Entry' : 'Add Entry')}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary px-4"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}; 