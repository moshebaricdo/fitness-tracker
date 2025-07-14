'use client';

import React from 'react';
import { Workout } from '@/types';
import { focusAreaEmojis } from '@/lib/exercises';
import { Plus } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  isSameDay 
} from 'date-fns';

interface CalendarViewProps {
  currentDate: Date;
  workoutsByDate: Record<string, Workout[]>;
  selectedDate: string | null;
  onDateClick: (date: string) => void;
  onAddWorkout: (date: string) => void;
  onWorkoutClick: (workoutId: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  workoutsByDate,
  selectedDate,
  onDateClick,
  onAddWorkout,
  onWorkoutClick
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start on Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDateKey = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const getDayWorkouts = (date: Date): Workout[] => {
    const dateKey = formatDateKey(date);
    return workoutsByDate[dateKey] || [];
  };

  const handleDateClick = (date: Date) => {
    const dateKey = formatDateKey(date);
    onDateClick(dateKey);
  };

  const handleAddWorkoutClick = (e: React.MouseEvent, date: Date) => {
    e.stopPropagation();
    const dateKey = formatDateKey(date);
    onAddWorkout(dateKey);
  };

  const handleWorkoutClick = (e: React.MouseEvent, workoutId: number) => {
    e.stopPropagation();
    onWorkoutClick(workoutId);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const dateKey = formatDateKey(date);
          const dayWorkouts = getDayWorkouts(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isDayToday = isToday(date);
          const isSelected = selectedDate === dateKey;
          const hasWorkouts = dayWorkouts.length > 0;

          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`
                relative p-2 min-h-[80px] border-r border-b border-gray-100 cursor-pointer
                hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? 'text-gray-400 bg-gray-25' : ''}
                ${isDayToday ? 'bg-primary-50' : ''}
                ${isSelected ? 'bg-primary-100 ring-2 ring-primary-500' : ''}
              `}
            >
              {/* Date Number */}
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  text-sm font-medium
                  ${isDayToday ? 'text-primary-700' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                `}>
                  {format(date, 'd')}
                </span>
                
                {/* Add Workout Button */}
                {isCurrentMonth && (
                  <button
                    onClick={(e) => handleAddWorkoutClick(e, date)}
                    className={`
                      p-1 rounded-full transition-colors opacity-0 hover:opacity-100
                      ${hasWorkouts ? 'opacity-100' : 'group-hover:opacity-100'}
                      hover:bg-primary-100 text-primary-600
                    `}
                    title="Add workout"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Workouts */}
              {hasWorkouts && (
                <div className="space-y-1">
                  {dayWorkouts.slice(0, 3).map((workout) => (
                    <div
                      key={workout.id}
                      onClick={(e) => handleWorkoutClick(e, workout.id!)}
                      className={`
                        text-xs px-1 py-0.5 rounded text-white cursor-pointer
                        hover:opacity-80 transition-opacity truncate
                        ${workout.completed 
                          ? 'bg-success-500' 
                          : 'bg-primary-500'
                        }
                      `}
                      title={`${workout.name} (${workout.exercises.length} exercises)`}
                    >
                      <span className="mr-1">
                        {focusAreaEmojis[workout.focusArea]}
                      </span>
                      {workout.name}
                    </div>
                  ))}
                  
                  {/* Show "+" indicator if more than 3 workouts */}
                  {dayWorkouts.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayWorkouts.length - 3} more
                    </div>
                  )}
                </div>
              )}
              
              {/* Today Indicator */}
              {isDayToday && (
                <div className="absolute top-1 left-1 w-2 h-2 bg-primary-600 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 