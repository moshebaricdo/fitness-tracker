'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Workout } from '@/types';
import { CheckCircle, Play, Calendar, Dumbbell, Coffee } from 'lucide-react';

interface WorkoutPreviewCardProps {
  todaysWorkout?: Workout;
  onStartWorkout?: () => void;
}

export const WorkoutPreviewCard: React.FC<WorkoutPreviewCardProps> = ({
  todaysWorkout,
  onStartWorkout
}) => {
  const router = useRouter();

  // Rest Day State
  if (!todaysWorkout) {
    return (
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center">
          <div className="mb-4">
            <Coffee className="w-16 h-16 mx-auto text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Rest Day</h3>
          <p className="text-gray-600 mb-4">
            Take a well-deserved break and let your muscles recover.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => router.push('/create-workout')}
              className="btn-secondary text-sm"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Schedule Workout
            </button>
            <button
              onClick={() => router.push('/progress')}
              className="btn-primary text-sm"
            >
              View Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed Workout State
  if (todaysWorkout.completed) {
    return (
      <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {todaysWorkout.name}
              </h3>
              <span className="badge badge-success text-xs">Completed!</span>
            </div>
            <p className="text-gray-600 mb-3">
              Great job crushing your {todaysWorkout.focusArea} workout!
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>{todaysWorkout.exercises.length} exercises</span>
              <span>•</span>
              <span>{todaysWorkout.focusArea} focus</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/progress')}
                className="btn-primary text-sm"
              >
                Take Progress Photo
              </button>
              <button
                onClick={() => router.push('/calendar')}
                className="btn-secondary text-sm"
              >
                View Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scheduled Workout State
  return (
    <div className="card p-6 bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Dumbbell className="w-12 h-12 text-primary-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {todaysWorkout.name}
            </h3>
            <span className="badge badge-primary text-xs">Today</span>
          </div>
          <p className="text-gray-600 mb-3">
            Ready to tackle your {todaysWorkout.focusArea} workout?
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>{todaysWorkout.exercises.length} exercises</span>
            <span>•</span>
            <span>{todaysWorkout.focusArea} focus</span>
            <span>•</span>
            <span>Est. 45 min</span>
          </div>
          
          {/* Exercise Preview */}
          <div className="bg-white rounded-lg p-3 mb-4 border border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Today's Exercises:</h4>
            <div className="space-y-1">
              {todaysWorkout.exercises.slice(0, 3).map((exercise, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{exercise.name}</span>
                  <span className="text-gray-500">
                    {exercise.sets ? `${exercise.sets} sets × ` : ''}{exercise.reps} reps
                  </span>
                </div>
              ))}
              {todaysWorkout.exercises.length > 3 && (
                <div className="text-xs text-gray-500 pt-1">
                  +{todaysWorkout.exercises.length - 3} more exercises
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onStartWorkout}
              className="btn-primary flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Workout
            </button>
            <button
              onClick={() => router.push(`/workout/${todaysWorkout.id}`)}
              className="btn-secondary text-sm"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 