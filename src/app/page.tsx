'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { WorkoutPreviewCard } from '@/components/home/WorkoutPreviewCard';
import { WeeklyStatsCard } from '@/components/home/WeeklyStatsCard';
import { Plus, Calendar, ChevronRight } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { formatDateForDisplay, getToday } from '@/lib/utils';
import { addDays } from 'date-fns';

export default function HomePage() {
  const router = useRouter();
  const { workouts, loading: workoutsLoading, getTodaysWorkouts } = useWorkouts();
  
  const todaysWorkouts = getTodaysWorkouts();
  const todaysWorkout = todaysWorkouts[0]; // Get the first (and likely only) workout for today
  
  // Get upcoming workouts (next 7 days excluding today)
  const today = getToday();
  const nextWeek = addDays(new Date(), 7);
  const upcomingWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.scheduledDate);
    const todayDate = new Date(today);
    return workoutDate > todayDate && workoutDate <= nextWeek;
  }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const handleAddWorkout = () => {
    router.push('/create-workout');
  };

  const handleStartWorkout = () => {
    if (todaysWorkout?.id) {
      // TODO: Navigate to workout execution page when implemented
      console.log('Starting workout:', todaysWorkout.id);
      // For now, just log or show a message
    }
  };

  if (workoutsLoading) {
    return (
      <Layout title="Today">
        <div className="flex items-center justify-center h-64">
          <div className="spinner-lg text-primary-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Today"
      headerActions={
        <button
          onClick={handleAddWorkout}
          className="touch-target p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Add workout"
        >
          <Plus className="w-6 h-6" />
        </button>
      }
    >
      <div className="space-y-6">
        {/* Date Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {formatDateForDisplay(getToday())}
          </h2>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Today's Workout Preview */}
        <WorkoutPreviewCard 
          todaysWorkout={todaysWorkout}
          onStartWorkout={handleStartWorkout}
        />

        {/* Weekly Stats */}
        <WeeklyStatsCard />

        {/* Upcoming Workouts - Simplified */}
        {upcomingWorkouts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Coming Up</h3>
              <button
                onClick={() => router.push('/calendar')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {upcomingWorkouts.slice(0, 3).map((workout) => (
                <div
                  key={workout.id}
                  className="card p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/workout/${workout.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {workout.name}
                        </h4>
                        <span className="badge badge-gray text-xs">
                          {workout.focusArea}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {workout.exercises.length} exercises
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateForDisplay(workout.scheduledDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions - Only show if no upcoming workouts */}
        {upcomingWorkouts.length === 0 && !todaysWorkout && (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Create your first workout or browse your calendar to plan ahead.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleAddWorkout}
                className="btn btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Workout
              </button>
              <button
                onClick={() => router.push('/calendar')}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Calendar
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 