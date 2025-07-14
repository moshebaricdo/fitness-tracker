'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Target, Calendar, ChevronRight } from 'lucide-react';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useNutrition } from '@/hooks/useNutrition';
import { startOfWeek, endOfWeek, format } from 'date-fns';

interface WeeklyStatsCardProps {
  className?: string;
}

export const WeeklyStatsCard: React.FC<WeeklyStatsCardProps> = ({
  className = ''
}) => {
  const router = useRouter();
  const { workouts } = useWorkouts();
  const { getTodaysProteinTotal } = useNutrition();

  // Get current week (Sunday to Saturday)
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // 0 = Sunday
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

  // Calculate workouts completed this week
  const thisWeekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.scheduledDate);
    return workoutDate >= weekStart && workoutDate <= weekEnd;
  });
  
  const completedThisWeek = thisWeekWorkouts.filter(w => w.completed).length;
  const totalThisWeek = thisWeekWorkouts.length;

  // Get today's protein
  const todaysProtein = getTodaysProteinTotal();
  const proteinGoal = 150; // Default goal

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {/* Protein Intake */}
        <button
          onClick={() => router.push('/nutrition')}
          className="card p-4 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  Today's Protein
                </div>
                <div className="text-sm text-gray-600">
                  {todaysProtein}g of {proteinGoal}g goal
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {Math.round((todaysProtein / proteinGoal) * 100)}%
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
          
          {/* Mini Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((todaysProtein / proteinGoal) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        </button>

        {/* Weekly Workouts */}
        <button
          onClick={() => router.push('/calendar')}
          className="card p-4 hover:bg-gray-50 transition-colors text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  This Week's Workouts
                </div>
                <div className="text-sm text-gray-600">
                  {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {completedThisWeek}/{totalThisWeek}
                </div>
                <div className="text-xs text-gray-500">
                  completed
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
          
          {/* Mini Progress Indicator */}
          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 7 }).map((_, index) => {
              const dayWorkouts = thisWeekWorkouts.filter(w => {
                const workoutDate = new Date(w.scheduledDate);
                const dayOfWeek = workoutDate.getDay();
                return dayOfWeek === index;
              });
              
              const hasWorkout = dayWorkouts.length > 0;
              const isCompleted = dayWorkouts.some(w => w.completed);
              
              return (
                <div
                  key={index}
                  className={`w-6 h-2 rounded-full ${
                    isCompleted
                      ? 'bg-blue-500'
                      : hasWorkout
                      ? 'bg-blue-200'
                      : 'bg-gray-200'
                  }`}
                  title={format(new Date(weekStart.getTime() + index * 24 * 60 * 60 * 1000), 'EEE')}
                />
              );
            })}
          </div>
        </button>
      </div>
    </div>
  );
}; 