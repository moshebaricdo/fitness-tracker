'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { Plus, Calendar, Dumbbell, Target, ChevronRight } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useNutrition } from '@/hooks/useNutrition';
import { formatDateForDisplay, getToday } from '@/lib/utils';
import { addDays } from 'date-fns';

export default function HomePage() {
  const router = useRouter();
  const { workouts, loading: workoutsLoading, getTodaysWorkouts, refreshWorkouts } = useWorkouts();
  const { getTodaysProteinTotal, todaysEntries } = useNutrition();
  
  const todaysWorkouts = getTodaysWorkouts();
  const completedWorkouts = todaysWorkouts.filter(w => w.completed);
  
  // Get upcoming workouts (next 7 days including today)
  const today = getToday();
  const nextWeek = addDays(new Date(), 7);
  const upcomingWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.scheduledDate);
    const todayDate = new Date(today);
    return workoutDate >= todayDate && workoutDate <= nextWeek;
  }).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  
  const proteinTotal = getTodaysProteinTotal();
  const proteinGoal = 120; // Default protein goal

  const handleAddWorkout = () => {
    router.push('/create-workout');
  };

  const handleAddNutrition = () => {
    // Will navigate to nutrition entry page
    console.log('Navigate to add nutrition');
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card card-padding text-center">
            <div className="flex items-center justify-center mb-2">
              <Dumbbell className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {completedWorkouts.length}/{todaysWorkouts.length}
            </div>
            <div className="text-sm text-gray-600">Today's Workouts</div>
          </div>
          
          <div className="card card-padding text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-8 h-8 text-success-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {proteinTotal}g
            </div>
            <div className="text-sm text-gray-600">Protein</div>
          </div>
        </div>

        {/* Upcoming Workouts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Workouts</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddWorkout}
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Workout
              </button>
              <button
                onClick={() => router.push('/calendar')}
                className="btn btn-secondary btn-sm"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Calendar
              </button>
            </div>
          </div>
          
          {upcomingWorkouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Calendar className="w-16 h-16" />
              </div>
              <p className="empty-state-text">
                No workouts scheduled for the next 7 days
              </p>
              <button
                onClick={handleAddWorkout}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workout
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingWorkouts.slice(0, 5).map((workout) => {
                const isToday = workout.scheduledDate === today;
                return (
                  <div
                    key={workout.id}
                    className={`card card-padding card-hover ${
                      workout.completed ? 'bg-success-50 border-success-200' : ''
                    } ${isToday ? 'border-primary-300 bg-primary-25' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {workout.name}
                          </h4>
                          <span className="focus-area-badge badge-primary">
                            {workout.focusArea}
                          </span>
                          {isToday && (
                            <span className="badge badge-warning text-xs">Today</span>
                          )}
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
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {workout.completed ? (
                          <span className="badge badge-success">Completed</span>
                        ) : isToday ? (
                          <button className="btn btn-primary btn-sm">
                            Start
                          </button>
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {upcomingWorkouts.length > 5 && (
                <button
                  onClick={() => router.push('/calendar')}
                  className="w-full text-center py-3 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View all {upcomingWorkouts.length} upcoming workouts →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Nutrition Summary */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Nutrition</h3>
            <button
              onClick={handleAddNutrition}
              className="btn btn-secondary btn-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Food
            </button>
          </div>
          
          <div className="card card-padding">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Protein Goal</span>
                <span className="text-sm font-medium text-gray-900">
                  {proteinTotal}g / {proteinGoal}g
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min((proteinTotal / proteinGoal) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {todaysEntries.length} {todaysEntries.length === 1 ? 'entry' : 'entries'} today
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 