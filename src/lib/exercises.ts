import { FocusArea } from '@/types';

export const exercisePool = {
  chest: [
    'Push-ups', 'Bench Press', 'Incline Press', 'Decline Press',
    'Chest Fly', 'Dips', 'Cable Crossover', 'Pec Deck',
    'Diamond Push-ups', 'Wide-Grip Push-ups', 'Chest Press Machine',
    'Incline Dumbbell Press', 'Decline Dumbbell Press', 'Pullovers'
  ],
  arms: [
    'Bicep Curls', 'Hammer Curls', 'Tricep Dips', 'Overhead Press',
    'Lateral Raises', 'Tricep Extensions', 'Preacher Curls', 'Close-Grip Push-ups',
    'Concentration Curls', 'Skull Crushers', 'Cable Curls', 'Tricep Kickbacks',
    'Reverse Curls', 'Overhead Tricep Press', 'Cable Tricep Pushdowns'
  ],
  abs: [
    'Crunches', 'Plank', 'Russian Twists', 'Leg Raises',
    'Mountain Climbers', 'Bicycle Crunches', 'Dead Bug', 'Hanging Knee Raises',
    'Side Plank', 'Reverse Crunches', 'Flutter Kicks', 'Sit-ups',
    'Hollow Body Hold', 'V-ups', 'Windshield Wipers', 'Plank Up-downs'
  ],
  legs: [
    'Squats', 'Lunges', 'Deadlifts', 'Calf Raises',
    'Wall Sits', 'Leg Press', 'Bulgarian Split Squats', 'Step-ups',
    'Goblet Squats', 'Jump Squats', 'Walking Lunges', 'Reverse Lunges',
    'Single-Leg Deadlifts', 'Sumo Squats', 'Glute Bridges', 'Hip Thrusts'
  ],
  back: [
    'Pull-ups', 'Rows', 'Lat Pulldowns', 'Reverse Fly',
    'Superman', 'Face Pulls', 'Chin-ups', 'Bent Over Rows',
    'Seated Cable Rows', 'T-Bar Rows', 'Single-Arm Rows', 'Shrugs',
    'Inverted Rows', 'Wide-Grip Pull-ups', 'Assisted Pull-ups'
  ],
  shoulders: [
    'Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Fly',
    'Upright Rows', 'Shrugs', 'Arnold Press', 'Pike Push-ups',
    'Handstand Push-ups', 'Cable Lateral Raises', 'Reverse Fly',
    'Military Press', 'Dumbbell Press', 'Face Pulls', 'Shoulder Dislocations'
  ],
  cardio: [
    'Running', 'Cycling', 'Jump Rope', 'Burpees',
    'High Knees', 'Jumping Jacks', 'Sprint Intervals', 'Stair Climbing',
    'Rowing', 'Elliptical', 'Treadmill', 'Stationary Bike',
    'Swimming', 'Boxing', 'Dancing', 'HIIT Workout'
  ],
  'full-body': [
    'Burpees', 'Thrusters', 'Clean and Press', 'Turkish Get-ups',
    'Man Makers', 'Renegade Rows', 'Bear Crawls', 'Mountain Climbers',
    'Squat to Press', 'Lunge with Twist', 'Push-up to T', 'Plank Jacks',
    'Deadlift to Press', 'Squat Jumps', 'Cross-Body Mountain Climbers'
  ]
};

export const focusAreas: FocusArea[] = [
  'chest', 'arms', 'abs', 'legs', 'back', 'shoulders', 'cardio', 'full-body'
];

export const focusAreaLabels: Record<FocusArea, string> = {
  chest: 'Chest',
  arms: 'Arms',
  abs: 'Abs',
  legs: 'Legs',
  back: 'Back',
  shoulders: 'Shoulders',
  cardio: 'Cardio',
  'full-body': 'Full Body'
};

export const focusAreaEmojis: Record<FocusArea, string> = {
  chest: '💪',
  arms: '🦾',
  abs: '🔥',
  legs: '🦵',
  back: '🔄',
  shoulders: '🏋️',
  cardio: '❤️',
  'full-body': '🏃‍♂️'
};

export const getExercisesByCategory = (category: FocusArea): string[] => {
  return exercisePool[category] || [];
};

export const getRandomExercises = (category: FocusArea, count: number = 5): string[] => {
  const exercises = getExercisesByCategory(category);
  const shuffled = [...exercises].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchExercises = (query: string): { category: FocusArea; exercise: string }[] => {
  const results: { category: FocusArea; exercise: string }[] = [];
  const lowercaseQuery = query.toLowerCase();
  
  for (const [category, exercises] of Object.entries(exercisePool)) {
    for (const exercise of exercises) {
      if (exercise.toLowerCase().includes(lowercaseQuery)) {
        results.push({ category: category as FocusArea, exercise });
      }
    }
  }
  
  return results;
};

export const getExerciseCategory = (exerciseName: string): FocusArea | null => {
  for (const [category, exercises] of Object.entries(exercisePool)) {
    if (exercises.includes(exerciseName)) {
      return category as FocusArea;
    }
  }
  return null;
}; 