import { dbUtils } from './database';
import { Workout, Exercise, FocusArea } from '@/types';
import { generateId } from './utils';

const focusAreas: FocusArea[] = ['chest', 'arms', 'abs', 'legs', 'back', 'shoulders', 'cardio', 'full-body'];

const exercisesByFocusArea: Record<FocusArea, string[]> = {
  chest: ['Push-ups', 'Bench Press', 'Incline Press', 'Chest Fly', 'Dips'],
  arms: ['Bicep Curls', 'Hammer Curls', 'Tricep Dips', 'Overhead Press', 'Lateral Raises'],
  abs: ['Crunches', 'Plank', 'Russian Twists', 'Leg Raises', 'Mountain Climbers'],
  legs: ['Squats', 'Lunges', 'Deadlifts', 'Calf Raises', 'Wall Sits'],
  back: ['Pull-ups', 'Rows', 'Lat Pulldowns', 'Reverse Fly', 'Superman'],
  shoulders: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Fly', 'Upright Rows'],
  cardio: ['Jumping Jacks', 'Burpees', 'High Knees', 'Jump Rope', 'Sprint Intervals'],
  'full-body': ['Burpees', 'Mountain Climbers', 'Jumping Jacks', 'Squat to Press', 'Turkish Get-ups']
};

const createExercises = (focusArea: FocusArea, count: number = 4): Exercise[] => {
  const availableExercises = exercisesByFocusArea[focusArea];
  const selectedExercises = availableExercises.slice(0, count);
  
  return selectedExercises.map(name => ({
    id: generateId(),
    name,
    reps: focusArea === 'cardio' ? Math.floor(Math.random() * 20) + 30 : Math.floor(Math.random() * 8) + 8,
    sets: focusArea === 'cardio' ? 1 : Math.floor(Math.random() * 2) + 3,
    category: focusArea,
    completed: true
  }));
};

const getDateNDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const getDateNDaysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const getWorkoutName = (focusArea: FocusArea): string => {
  const names: Record<FocusArea, string> = {
    chest: 'Chest',
    arms: 'Arms',
    abs: 'Abs',
    legs: 'Legs',
    back: 'Back',
    shoulders: 'Shoulders',
    cardio: 'Cardio',
    'full-body': 'Full Body'
  };
  return names[focusArea];
};

export const seedWorkouts = async (): Promise<void> => {
  console.log('🌱 Seeding workout data...');

  const workouts: Omit<Workout, 'id' | 'createdAt'>[] = [
    // Completed workouts (recent to older)
    {
      name: getWorkoutName('chest'),
      focusArea: 'chest',
      exercises: createExercises('chest', 5),
      scheduledDate: getDateNDaysAgo(1), // Yesterday
      completed: true,
      completedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('legs'),
      focusArea: 'legs',
      exercises: createExercises('legs', 4),
      scheduledDate: getDateNDaysAgo(3), // 3 days ago
      completed: true,
      completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('back'),
      focusArea: 'back',
      exercises: createExercises('back', 5),
      scheduledDate: getDateNDaysAgo(5), // 5 days ago
      completed: true,
      completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('arms'),
      focusArea: 'arms',
      exercises: createExercises('arms', 6),
      scheduledDate: getDateNDaysAgo(7), // 1 week ago
      completed: true,
      completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('abs'),
      focusArea: 'abs',
      exercises: createExercises('abs', 4),
      scheduledDate: getDateNDaysAgo(9), // 9 days ago
      completed: true,
      completedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('shoulders'),
      focusArea: 'shoulders',
      exercises: createExercises('shoulders', 5),
      scheduledDate: getDateNDaysAgo(11), // 11 days ago
      completed: true,
      completedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('cardio'),
      focusArea: 'cardio',
      exercises: createExercises('cardio', 5),
      scheduledDate: getDateNDaysAgo(13), // 13 days ago
      completed: true,
      completedDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('full-body'),
      focusArea: 'full-body',
      exercises: createExercises('full-body', 6),
      scheduledDate: getDateNDaysAgo(15), // 15 days ago
      completed: true,
      completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('chest'),
      focusArea: 'chest',
      exercises: createExercises('chest', 4),
      scheduledDate: getDateNDaysAgo(18), // 18 days ago
      completed: true,
      completedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },
    {
      name: getWorkoutName('legs'),
      focusArea: 'legs',
      exercises: createExercises('legs', 5),
      scheduledDate: getDateNDaysAgo(20), // 20 days ago
      completed: true,
      completedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      isTemplate: false
    },

    // Today's workout (scheduled)
    {
      name: getWorkoutName('arms'),
      focusArea: 'arms',
      exercises: createExercises('arms').map(ex => ({ ...ex, completed: false })),
      scheduledDate: new Date().toISOString().split('T')[0], // Today
      completed: false,
      isTemplate: false
    },

    // Future workouts
    {
      name: getWorkoutName('abs'),
      focusArea: 'abs',
      exercises: createExercises('abs').map(ex => ({ ...ex, completed: false })),
      scheduledDate: getDateNDaysFromNow(2), // 2 days from now
      completed: false,
      isTemplate: false
    },
    {
      name: getWorkoutName('shoulders'),
      focusArea: 'shoulders',
      exercises: createExercises('shoulders', 5).map(ex => ({ ...ex, completed: false })),
      scheduledDate: getDateNDaysFromNow(4), // 4 days from now
      completed: false,
      isTemplate: false
    },
    {
      name: getWorkoutName('back'),
      focusArea: 'back',
      exercises: createExercises('back', 4).map(ex => ({ ...ex, completed: false })),
      scheduledDate: getDateNDaysFromNow(6), // 6 days from now
      completed: false,
      isTemplate: false
    },
    {
      name: getWorkoutName('cardio'),
      focusArea: 'cardio',
      exercises: createExercises('cardio', 4).map(ex => ({ ...ex, completed: false })),
      scheduledDate: getDateNDaysFromNow(8), // 8 days from now
      completed: false,
      isTemplate: false
    }
  ];

  try {
    // Clear existing workouts first (optional)
    console.log('🧹 Clearing existing workouts...');
    // await dbUtils.clearAllData(); // Uncomment if you want to clear all data

    // Add each workout
    for (const workout of workouts) {
      await dbUtils.createWorkout(workout);
    }

    console.log(`✅ Successfully seeded ${workouts.length} workouts!`);
    console.log('📊 Workout distribution:');
    console.log(`   - Completed: ${workouts.filter(w => w.completed).length}`);
    console.log(`   - Scheduled: ${workouts.filter(w => !w.completed).length}`);
    console.log(`   - Today: ${workouts.filter(w => w.scheduledDate === new Date().toISOString().split('T')[0]).length}`);
    
  } catch (error) {
    console.error('❌ Error seeding workouts:', error);
    throw error;
  }
};

export const clearAllWorkouts = async (): Promise<void> => {
  console.log('🧹 Clearing all workout data...');
  try {
    await dbUtils.clearAllData();
    console.log('✅ All workout data cleared!');
  } catch (error) {
    console.error('❌ Error clearing workouts:', error);
    throw error;
  }
}; 