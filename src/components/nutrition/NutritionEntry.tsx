'use client';

import React, { useState } from 'react';
import { NutritionEntry as NutritionEntryType, TimeOfDay } from '@/types';
import { Edit2, Trash2, Copy } from 'lucide-react';
import { NutritionForm } from './NutritionForm';

interface NutritionEntryProps {
  entry: NutritionEntryType;
  onUpdate: (id: number, updates: Partial<NutritionEntryType>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onDuplicate: (entry: NutritionEntryType) => Promise<void>;
}

const timeOfDayEmojis: Record<TimeOfDay, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎'
};

const timeOfDayLabels: Record<TimeOfDay, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack'
};

export const NutritionEntry: React.FC<NutritionEntryProps> = ({
  entry,
  onUpdate,
  onDelete,
  onDuplicate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleUpdate = async (updates: Omit<NutritionEntryType, 'id' | 'createdAt'>) => {
    if (!entry.id) return;
    await onUpdate(entry.id, updates);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!entry.id) return;
    setIsDeleting(true);
    try {
      await onDelete(entry.id);
    } catch (error) {
      console.error('Error deleting entry:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      await onDuplicate(entry);
    } catch (error) {
      console.error('Error duplicating entry:', error);
    } finally {
      setIsDuplicating(false);
    }
  };

  if (isEditing) {
    return (
      <div className="card p-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Edit Entry</h3>
        <NutritionForm
          entry={entry}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="card p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{timeOfDayEmojis[entry.timeOfDay]}</span>
            <span className="text-sm text-gray-500">{timeOfDayLabels[entry.timeOfDay]}</span>
          </div>
          
          <h3 className="font-medium text-gray-900 mb-1">{entry.foodName}</h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="font-medium text-primary-600">
              {entry.proteinEstimate}g protein
            </span>
            <span>
              {new Date(entry.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-4">
          <button
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="touch-target p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Duplicate entry"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            className="touch-target p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit entry"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="touch-target p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}; 