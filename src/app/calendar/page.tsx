'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { CalendarView } from '@/components/calendar/CalendarView';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Workout } from '@/types';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

export default function CalendarPage() {
  const router = useRouter();
  const { workouts, loading } = useWorkouts();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthName = format(currentDate, 'MMMM yyyy');

  // Get workouts for the current month
  const monthWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.scheduledDate);
    return workoutDate >= monthStart && workoutDate <= monthEnd;
  });

  // Group workouts by date
  const workoutsByDate = monthWorkouts.reduce((acc, workout) => {
    const date = workout.scheduledDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {} as Record<string, Workout[]>);

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(selectedDate === date ? null : date);
  };

  const handleAddWorkout = (date?: string) => {
    const targetDate = date || format(new Date(), 'yyyy-MM-dd');
    router.push(`/create-workout?date=${targetDate}`);
  };

  const handleWorkoutClick = (workoutId: number) => {
    router.push(`/workout/${workoutId}`);
  };

  if (loading) {
    return (
      <Layout title="Calendar & History">
        <div className="flex items-center justify-center h-64">
          <div className="spinner-lg text-primary-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Calendar & History"
      headerActions={
        <button
          onClick={() => handleAddWorkout()}
          className="touch-target p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Add workout"
        >
          <Plus className="w-6 h-6" />
        </button>
      }
    >
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="touch-target p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthName}
          </h2>
          
          <button
            onClick={handleNextMonth}
            className="touch-target p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Calendar Grid */}
        <CalendarView
          currentDate={currentDate}
          workoutsByDate={workoutsByDate}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          onAddWorkout={handleAddWorkout}
          onWorkoutClick={handleWorkoutClick}
        />

        {/* Selected Date Details */}
        {selectedDate && workoutsByDate[selectedDate] && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Workouts for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </h3>
            
            {workoutsByDate[selectedDate].map((workout) => (
              <div
                key={workout.id}
                onClick={() => handleWorkoutClick(workout.id!)}
                className={`card card-padding card-hover cursor-pointer ${
                  workout.completed ? 'bg-success-50 border-success-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {workout.name}
                      </h4>
                      <span className="focus-area-badge badge-primary">
                        {workout.focusArea}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {workout.exercises.length} exercises
                    </p>
                  </div>
                  
                  {workout.completed && (
                    <span className="badge badge-success">Completed</span>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={() => handleAddWorkout(selectedDate)}
              className="btn btn-outline btn-primary w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Workout
            </button>
          </div>
        )}

        {/* Month Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card card-padding text-center">
            <div className="text-2xl font-bold text-gray-900">
              {monthWorkouts.length}
            </div>
            <div className="text-sm text-gray-600">Total Workouts</div>
          </div>
          
          <div className="card card-padding text-center">
            <div className="text-2xl font-bold text-gray-900">
              {monthWorkouts.filter(w => w.completed).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 