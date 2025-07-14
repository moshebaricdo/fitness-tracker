'use client';

import React from 'react';
import { Exercise } from '@/types';
import { Trash2, Plus, Minus } from 'lucide-react';

interface ExerciseListProps {
  exercises: Exercise[];
  onUpdate: (id: string, updates: Partial<Exercise>) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  onUpdate,
  onRemove,
  disabled = false
}) => {
  const handleRepsChange = (id: string, reps: number) => {
    if (reps >= 1 && reps <= 999) {
      onUpdate(id, { reps });
    }
  };

  const handleSetsChange = (id: string, sets: number) => {
    if (sets >= 1 && sets <= 50) {
      onUpdate(id, { sets });
    }
  };

  const adjustReps = (id: string, currentReps: number, delta: number) => {
    const newReps = Math.max(1, Math.min(999, currentReps + delta));
    handleRepsChange(id, newReps);
  };

  const adjustSets = (id: string, currentSets: number, delta: number) => {
    const newSets = Math.max(1, Math.min(50, currentSets + delta));
    handleSetsChange(id, newSets);
  };

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="exercise-item">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{exercise.name}</h4>
              <button
                onClick={() => onRemove(exercise.id)}
                className="touch-target p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                disabled={disabled}
                aria-label="Remove exercise"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Reps */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Reps
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustReps(exercise.id, exercise.reps, -1)}
                    className="touch-target p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    disabled={disabled || exercise.reps <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => handleRepsChange(exercise.id, parseInt(e.target.value) || 1)}
                    className="input text-center w-16 py-1"
                    min="1"
                    max="999"
                    disabled={disabled}
                  />
                  <button
                    onClick={() => adjustReps(exercise.id, exercise.reps, 1)}
                    className="touch-target p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    disabled={disabled || exercise.reps >= 999}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sets */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Sets
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustSets(exercise.id, exercise.sets || 1, -1)}
                    className="touch-target p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    disabled={disabled || (exercise.sets || 1) <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={exercise.sets || 1}
                    onChange={(e) => handleSetsChange(exercise.id, parseInt(e.target.value) || 1)}
                    className="input text-center w-16 py-1"
                    min="1"
                    max="50"
                    disabled={disabled}
                  />
                  <button
                    onClick={() => adjustSets(exercise.id, exercise.sets || 1, 1)}
                    className="touch-target p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    disabled={disabled || (exercise.sets || 1) >= 50}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 