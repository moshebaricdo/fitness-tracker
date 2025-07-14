import Dexie, { Table } from 'dexie';
import { Workout, NutritionEntry, ProgressPhoto, WorkoutTemplate } from '@/types';

export class FitnessDatabase extends Dexie {
  workouts!: Table<Workout>;
  nutritionEntries!: Table<NutritionEntry>;
  progressPhotos!: Table<ProgressPhoto>;
  workoutTemplates!: Table<WorkoutTemplate>;

  constructor() {
    super('FitnessApp');
    (this as any).version(1).stores({
      workouts: '++id, scheduledDate, completed, focusArea, createdAt, isTemplate',
      nutritionEntries: '++id, date, timeOfDay, createdAt',
      progressPhotos: '++id, workoutId, takenAt',
      workoutTemplates: '++id, name, focusArea, createdAt'
    });
  }
}

export const db = new FitnessDatabase();

// Database utility functions
export const dbUtils = {
  // Workout operations
  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt'>): Promise<number> {
    return await db.workouts.add({
      ...workout,
      createdAt: new Date()
    });
  },

  async updateWorkout(id: number, updates: Partial<Workout>): Promise<void> {
    await db.workouts.update(id, updates);
  },

  async deleteWorkout(id: number): Promise<void> {
    await db.workouts.delete(id);
    // Also delete associated progress photos
    const photos = await db.progressPhotos.where('workoutId').equals(id).toArray();
    await db.progressPhotos.where('workoutId').equals(id).delete();
  },

  async getWorkoutsByDate(date: string): Promise<Workout[]> {
    return await db.workouts.where('scheduledDate').equals(date).toArray();
  },

  async getTodaysWorkouts(): Promise<Workout[]> {
    const today = new Date().toISOString().split('T')[0];
    return await this.getWorkoutsByDate(today);
  },

  async getCompletedWorkouts(): Promise<Workout[]> {
    return await db.workouts.where('completed').equals(true).toArray();
  },

  async getWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    return await db.workoutTemplates.orderBy('createdAt').reverse().toArray();
  },

  async saveWorkoutAsTemplate(workout: Workout): Promise<number> {
    const template: Omit<WorkoutTemplate, 'id' | 'createdAt'> = {
      name: workout.name,
      focusArea: workout.focusArea,
      exercises: workout.exercises
    };
    return await db.workoutTemplates.add({
      ...template,
      createdAt: new Date()
    });
  },

  // Nutrition operations
  async createNutritionEntry(entry: Omit<NutritionEntry, 'id' | 'createdAt'>): Promise<number> {
    return await db.nutritionEntries.add({
      ...entry,
      createdAt: new Date()
    });
  },

  async updateNutritionEntry(id: number, updates: Partial<NutritionEntry>): Promise<void> {
    await db.nutritionEntries.update(id, updates);
  },

  async deleteNutritionEntry(id: number): Promise<void> {
    await db.nutritionEntries.delete(id);
  },

  async getNutritionEntriesByDate(date: string): Promise<NutritionEntry[]> {
    return await db.nutritionEntries.where('date').equals(date).toArray();
  },

  async getTodaysNutritionEntries(): Promise<NutritionEntry[]> {
    const today = new Date().toISOString().split('T')[0];
    return await this.getNutritionEntriesByDate(today);
  },

  async getNutritionEntriesForWeek(startDate: string, endDate: string): Promise<NutritionEntry[]> {
    return await db.nutritionEntries
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  },

  // Progress photo operations
  async saveProgressPhoto(photo: Omit<ProgressPhoto, 'id' | 'takenAt'>): Promise<number> {
    return await db.progressPhotos.add({
      ...photo,
      takenAt: new Date()
    });
  },

  async getProgressPhotosByWorkout(workoutId: number): Promise<ProgressPhoto[]> {
    return await db.progressPhotos.where('workoutId').equals(workoutId).toArray();
  },

  async getAllProgressPhotos(): Promise<ProgressPhoto[]> {
    return await db.progressPhotos.orderBy('takenAt').reverse().toArray();
  },

  async deleteProgressPhoto(id: number): Promise<void> {
    await db.progressPhotos.delete(id);
  },

  // Statistics operations
  async getWorkoutStats(): Promise<{
    totalWorkouts: number;
    completedWorkouts: number;
    completionRate: number;
    currentStreak: number;
    longestStreak: number;
  }> {
    const allWorkouts = await db.workouts.toArray();
    const completedWorkouts = allWorkouts.filter((w: Workout) => w.completed);
    const totalWorkouts = allWorkouts.length;
    
    const completionRate = totalWorkouts > 0 ? (completedWorkouts.length / totalWorkouts) * 100 : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedWorkouts = allWorkouts
      .filter((w: Workout) => w.completed)
      .sort((a: Workout, b: Workout) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
    
    for (let i = 0; i < sortedWorkouts.length; i++) {
      const workout = sortedWorkouts[i];
      const workoutDate = new Date(workout.scheduledDate);
      
      if (i === 0) {
        currentStreak = 1;
        tempStreak = 1;
      } else {
        const previousDate = new Date(sortedWorkouts[i - 1].scheduledDate);
        const daysDiff = Math.floor((previousDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          currentStreak++;
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (i === 0) currentStreak = 1;
          else currentStreak = 0;
        }
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return {
      totalWorkouts,
      completedWorkouts: completedWorkouts.length,
      completionRate,
      currentStreak,
      longestStreak
    };
  },

  async getDailyProteinTotal(date: string): Promise<number> {
    const entries = await this.getNutritionEntriesByDate(date);
    return entries.reduce((total, entry) => total + entry.proteinEstimate, 0);
  },

  // Data management
  async clearAllData(): Promise<void> {
    await db.workouts.clear();
    await db.nutritionEntries.clear();
    await db.progressPhotos.clear();
    await db.workoutTemplates.clear();
  },

  async exportData(): Promise<string> {
    const workouts = await db.workouts.toArray();
    const nutritionEntries = await db.nutritionEntries.toArray();
    const workoutTemplates = await db.workoutTemplates.toArray();
    
    // Note: Progress photos are not included in export due to size constraints
    const data = {
      workouts,
      nutritionEntries,
      workoutTemplates,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }
}; 