'use client';

import React, { useState, useEffect } from 'react';
import { FocusArea } from '@/types';
import { 
  exercisePool, 
  focusAreas, 
  focusAreaLabels, 
  focusAreaEmojis,
  searchExercises 
} from '@/lib/exercises';
import { X, Search, Filter } from 'lucide-react';

interface ExerciseSelectorProps {
  focusArea: FocusArea;
  onSelect: (exerciseName: string) => void;
  onClose: () => void;
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  focusArea,
  onSelect,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FocusArea>(focusArea);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<string[]>([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchResults = searchExercises(searchQuery);
      setFilteredExercises(searchResults.map(result => result.exercise));
    } else {
      setFilteredExercises(exercisePool[selectedCategory] || []);
    }
  }, [searchQuery, selectedCategory]);

  const handleExerciseSelect = (exerciseName: string) => {
    onSelect(exerciseName);
  };

  const handleCategoryChange = (category: FocusArea) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when changing category
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Select Exercise
          </h2>
          <button
            onClick={onClose}
            className="touch-target p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {!searchQuery && (
          <div className="p-4 border-b">
            <div className="flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <button
                  key={area}
                  onClick={() => handleCategoryChange(area)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === area
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {focusAreaEmojis[area]} {focusAreaLabels[area]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto">
          {filteredExercises.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? 'No exercises found' : 'No exercises in this category'}
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise}
                  onClick={() => handleExerciseSelect(exercise)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="font-medium text-gray-900">{exercise}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} available
          </div>
        </div>
      </div>
    </div>
  );
}; 