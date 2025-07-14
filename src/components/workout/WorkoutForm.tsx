'use client';

import React, { useState, useEffect } from 'react';
import { Workout, Exercise, FocusArea } from '@/types';
import { focusAreas, focusAreaLabels, focusAreaEmojis } from '@/lib/exercises';
import { ExerciseSelector } from './ExerciseSelector';
import { ExerciseList } from './ExerciseList';
import { Plus, Calendar, Target } from 'lucide-react';
import { generateId } from '@/lib/utils';

interface WorkoutFormProps {
  onSubmit: (workout: Omit<Workout, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData: Omit<Workout, 'id' | 'createdAt'>;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
  initialData
}) => {
  const [name, setName] = useState(initialData.name);
  const [focusArea, setFocusArea] = useState<FocusArea>(initialData.focusArea);
  const [exercises, setExercises] = useState<Exercise[]>(initialData.exercises);
  const [scheduledDate, setScheduledDate] = useState(initialData.scheduledDate);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [isTemplate, setIsTemplate] = useState(initialData.isTemplate);

  // Auto-generate name based on focus area
  useEffect(() => {
    const areaLabel = focusAreaLabels[focusArea];
    setName(areaLabel);
  }, [focusArea]);

  const handleAddExercise = (exerciseName: string) => {
    const newExercise: Exercise = {
      id: generateId(),
      name: exerciseName,
      reps: 10,
      sets: 3,
      category: focusArea,
      completed: false
    };
    setExercises([...exercises, newExercise]);
    setShowExerciseSelector(false);
  };

  const handleUpdateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(exercises.map(exercise => 
      exercise.id === id ? { ...exercise, ...updates } : exercise
    ));
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    onSubmit({
      name: name,
      focusArea,
      exercises,
      scheduledDate,
      completed: false,
      isTemplate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Workout Preview */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-primary-900">
          {focusAreaEmojis[focusArea]} {name} Workout
        </h3>
        <p className="text-sm text-primary-700 mt-1">
          Scheduled for {new Date(scheduledDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Focus Area */}
      <div>
        <label htmlFor="focusArea" className="block text-sm font-medium text-gray-700 mb-2">
          Focus Area
        </label>
        <select
          id="focusArea"
          value={focusArea}
          onChange={(e) => {
            const selectedArea = e.target.value as FocusArea;
            setFocusArea(selectedArea);
          }}
          className="input"
          disabled={isSubmitting}
        >
          {focusAreas.map((area) => (
            <option key={area} value={area}>
              {focusAreaEmojis[area]} {focusAreaLabels[area]}
            </option>
          ))}
        </select>
      </div>

      {/* Scheduled Date */}
      <div>
        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          Scheduled Date
        </label>
        <input
          type="date"
          id="scheduledDate"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="input"
          disabled={isSubmitting}
        />
      </div>

      {/* Save as Template */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isTemplate"
          checked={isTemplate}
          onChange={(e) => setIsTemplate(e.target.checked)}
          className="mr-2"
          disabled={isSubmitting}
        />
        <label htmlFor="isTemplate" className="text-sm text-gray-700">
          Save as template for future use
        </label>
      </div>

      {/* Exercises Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            <Target className="w-5 h-5 inline mr-2" />
            Exercises ({exercises.length})
          </h3>
          <button
            type="button"
            onClick={() => setShowExerciseSelector(true)}
            className="btn btn-primary btn-sm"
            disabled={isSubmitting}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Exercise
          </button>
        </div>

        {exercises.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">
              No exercises added yet. Click "Add Exercise" to get started.
            </p>
          </div>
        ) : (
          <ExerciseList
            exercises={exercises}
            onUpdate={handleUpdateExercise}
            onRemove={handleRemoveExercise}
            disabled={isSubmitting}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner mr-2" />
              Creating...
            </>
          ) : (
            'Create Workout'
          )}
        </button>
      </div>

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <ExerciseSelector
          focusArea={focusArea}
          onSelect={handleAddExercise}
          onClose={() => setShowExerciseSelector(false)}
        />
      )}
    </form>
  );
}; 