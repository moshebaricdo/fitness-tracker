'use client';

import React from 'react';
import { TimeOfDay } from '@/types';
import { Target, TrendingUp, Award } from 'lucide-react';

interface ProteinSummaryProps {
  dailyTotal: number;
  dailyGoal?: number;
  proteinByTimeOfDay: Record<TimeOfDay, number>;
  weeklyAverage?: number;
}

const timeOfDayEmojis: Record<TimeOfDay, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎'
};

const timeOfDayLabels: Record<TimeOfDay, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack'
};

export const ProteinSummary: React.FC<ProteinSummaryProps> = ({
  dailyTotal,
  dailyGoal = 150, // Default goal
  proteinByTimeOfDay,
  weeklyAverage
}) => {
  const progressPercentage = Math.min((dailyTotal / dailyGoal) * 100, 100);
  const isGoalMet = dailyTotal >= dailyGoal;
  const remaining = Math.max(dailyGoal - dailyTotal, 0);

  return (
    <div className="space-y-4">
      {/* Daily Total Card */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Today's Protein</h3>
          </div>
          
          {isGoalMet && (
            <div className="flex items-center gap-1 text-green-600">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Goal Met!</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary-600">{dailyTotal}g</span>
            <span className="text-gray-600">of {dailyGoal}g</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isGoalMet ? 'bg-green-500' : 'bg-primary-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>{progressPercentage.toFixed(0)}% complete</span>
            {!isGoalMet && <span>{remaining}g remaining</span>}
          </div>
        </div>
      </div>

      {/* Breakdown by Time of Day */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Protein Breakdown</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(proteinByTimeOfDay).map(([timeOfDay, protein]) => (
            <div 
              key={timeOfDay}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{timeOfDayEmojis[timeOfDay as TimeOfDay]}</span>
                <span className="text-sm text-gray-600">{timeOfDayLabels[timeOfDay as TimeOfDay]}</span>
              </div>
              <span className="font-medium text-primary-600">{protein}g</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Average */}
      {weeklyAverage !== undefined && (
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Weekly Average</h3>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600">{weeklyAverage.toFixed(1)}g</span>
            <span className="text-gray-600">per day</span>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            {weeklyAverage > dailyGoal ? (
              <span className="text-green-600">Above your daily goal</span>
            ) : weeklyAverage === dailyGoal ? (
              <span className="text-green-600">Meeting your daily goal</span>
            ) : (
              <span className="text-amber-600">Below your daily goal</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 