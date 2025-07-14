export interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets?: number;
  category: string;
  completed?: boolean;
}

export interface Workout {
  id?: number;
  name: string;
  focusArea: FocusArea;
  exercises: Exercise[];
  scheduledDate: string;
  completedDate?: string;
  completed: boolean;
  progressPhotoId?: string;
  isTemplate: boolean;
  createdAt: Date;
}

export interface NutritionEntry {
  id?: number;
  date: string;
  foodName: string;
  proteinEstimate: number;
  timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  createdAt: Date;
}

export interface ProgressPhoto {
  id?: number;
  workoutId: number;
  photoBlob: Blob;
  thumbnailBlob?: Blob;
  takenAt: Date;
}

export interface WorkoutTemplate {
  id?: number;
  name: string;
  focusArea: FocusArea;
  exercises: Exercise[];
  createdAt: Date;
}

export type TimeOfDay = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FocusArea = 'chest' | 'arms' | 'abs' | 'legs' | 'back' | 'shoulders' | 'cardio' | 'full-body';

export interface ExerciseCategory {
  name: string;
  exercises: string[];
}

export interface WorkoutStats {
  totalWorkouts: number;
  completedWorkouts: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
}

export interface NutritionStats {
  dailyProtein: number;
  weeklyAverage: number;
  entriesThisWeek: number;
} 