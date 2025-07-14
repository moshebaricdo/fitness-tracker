import { useState, useEffect } from 'react';
import { Workout, WorkoutTemplate } from '@/types';
import { dbUtils, db } from '@/lib/database';
import { getToday } from '@/lib/utils';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkouts();
    loadTemplates();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const allWorkouts = await db.workouts.orderBy('scheduledDate').reverse().toArray();
      setWorkouts(allWorkouts);
      setError(null);
    } catch (err) {
      setError('Failed to load workouts');
      console.error('Error loading workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const workoutTemplates = await dbUtils.getWorkoutTemplates();
      setTemplates(workoutTemplates);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'createdAt'>) => {
    try {
      const id = await dbUtils.createWorkout(workout);
      await loadWorkouts();
      return id;
    } catch (err) {
      setError('Failed to create workout');
      console.error('Error adding workout:', err);
      throw err;
    }
  };

  const updateWorkout = async (id: number, updates: Partial<Workout>) => {
    try {
      await dbUtils.updateWorkout(id, updates);
      await loadWorkouts();
      setError(null);
    } catch (err) {
      setError('Failed to update workout');
      console.error('Error updating workout:', err);
      throw err;
    }
  };

  const deleteWorkout = async (id: number) => {
    try {
      await dbUtils.deleteWorkout(id);
      await loadWorkouts();
      setError(null);
    } catch (err) {
      setError('Failed to delete workout');
      console.error('Error deleting workout:', err);
      throw err;
    }
  };

  const completeWorkout = async (id: number) => {
    try {
      await dbUtils.updateWorkout(id, {
        completed: true,
        completedDate: new Date().toISOString()
      });
      await loadWorkouts();
      setError(null);
    } catch (err) {
      setError('Failed to complete workout');
      console.error('Error completing workout:', err);
      throw err;
    }
  };

  const uncompleteWorkout = async (id: number) => {
    try {
      await dbUtils.updateWorkout(id, {
        completed: false,
        completedDate: undefined
      });
      await loadWorkouts();
      setError(null);
    } catch (err) {
      setError('Failed to uncomplete workout');
      console.error('Error uncompleting workout:', err);
      throw err;
    }
  };

  const saveAsTemplate = async (workout: Workout) => {
    try {
      const templateId = await dbUtils.saveWorkoutAsTemplate(workout);
      await loadTemplates();
      return templateId;
    } catch (err) {
      setError('Failed to save template');
      console.error('Error saving template:', err);
      throw err;
    }
  };

  const createFromTemplate = async (template: WorkoutTemplate, scheduledDate: string) => {
    try {
      const workout: Omit<Workout, 'id' | 'createdAt'> = {
        name: template.name,
        focusArea: template.focusArea,
        exercises: template.exercises,
        scheduledDate,
        completed: false,
        isTemplate: false
      };
      
      const id = await dbUtils.createWorkout(workout);
      await loadWorkouts();
      return id;
    } catch (err) {
      setError('Failed to create workout from template');
      console.error('Error creating from template:', err);
      throw err;
    }
  };

  const duplicateWorkout = async (workout: Workout, scheduledDate: string) => {
    try {
      const newWorkout: Omit<Workout, 'id' | 'createdAt'> = {
        name: workout.name,
        focusArea: workout.focusArea,
        exercises: workout.exercises.map(exercise => ({
          ...exercise,
          completed: false
        })),
        scheduledDate,
        completed: false,
        isTemplate: false
      };
      
      const id = await dbUtils.createWorkout(newWorkout);
      await loadWorkouts();
      return id;
    } catch (err) {
      setError('Failed to duplicate workout');
      console.error('Error duplicating workout:', err);
      throw err;
    }
  };

  const getTodaysWorkouts = () => {
    const today = getToday();
    return workouts.filter(w => w.scheduledDate === today);
  };

  const getCompletedWorkouts = () => {
    return workouts.filter(w => w.completed);
  };

  const getUncompletedWorkouts = () => {
    return workouts.filter(w => !w.completed);
  };

  const getWorkoutById = (id: number) => {
    return workouts.find(w => w.id === id);
  };

  const refreshWorkouts = async () => {
    await loadWorkouts();
  };

  const refreshTemplates = async () => {
    await loadTemplates();
  };

  return {
    workouts,
    templates,
    loading,
    error,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    completeWorkout,
    uncompleteWorkout,
    saveAsTemplate,
    createFromTemplate,
    duplicateWorkout,
    getTodaysWorkouts,
    getCompletedWorkouts,
    getUncompletedWorkouts,
    getWorkoutById,
    refreshWorkouts,
    refreshTemplates
  };
}; 