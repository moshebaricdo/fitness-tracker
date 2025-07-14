'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { NutritionForm } from '@/components/nutrition/NutritionForm';
import { NutritionEntry } from '@/components/nutrition/NutritionEntry';
import { ProteinSummary } from '@/components/nutrition/ProteinSummary';
import { QuickAddForm } from '@/components/nutrition/QuickAddForm';
import { useNutrition } from '@/hooks/useNutrition';
import { NutritionEntry as NutritionEntryType, TimeOfDay } from '@/types';
import { Plus, List, Zap } from 'lucide-react';

export default function NutritionPage() {
  const {
    todaysEntries,
    loading,
    error,
    addNutritionEntry,
    updateNutritionEntry,
    deleteNutritionEntry,
    duplicateEntry,
    getTodaysProteinTotal,
    getProteinByTimeOfDay,
    getWeeklyProteinAverage,
    quickAddProtein,
    loadThisWeeksEntries
  } = useNutrition();

  const [showForm, setShowForm] = useState(false);
  const [activeView, setActiveView] = useState<'quick' | 'detailed' | 'entries'>('quick');
  const [weeklyAverage, setWeeklyAverage] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Load weekly data for average calculation
    const loadWeeklyData = async () => {
      try {
        await loadThisWeeksEntries();
        const avg = getWeeklyProteinAverage();
        setWeeklyAverage(avg);
      } catch (error) {
        console.error('Error loading weekly data:', error);
      }
    };
    
    loadWeeklyData();
  }, []);

  const handleAddEntry = async (entry: Omit<NutritionEntryType, 'id' | 'createdAt'>) => {
    await addNutritionEntry(entry);
    setShowForm(false);
  };

  const handleUpdateEntry = async (id: number, updates: Partial<NutritionEntryType>) => {
    await updateNutritionEntry(id, updates);
  };

  const handleDeleteEntry = async (id: number) => {
    await deleteNutritionEntry(id);
  };

  const handleDuplicateEntry = async (entry: NutritionEntryType) => {
    await duplicateEntry(entry);
  };

  const handleQuickAdd = async (foodName: string, protein: number, timeOfDay: TimeOfDay) => {
    await quickAddProtein(foodName, protein, timeOfDay);
  };

  const dailyTotal = getTodaysProteinTotal();
  const proteinByTimeOfDay = {
    breakfast: getProteinByTimeOfDay('breakfast'),
    lunch: getProteinByTimeOfDay('lunch'),
    dinner: getProteinByTimeOfDay('dinner'),
    snack: getProteinByTimeOfDay('snack')
  };

  if (loading) {
    return (
      <Layout title="Nutrition">
        <div className="flex items-center justify-center h-64">
          <div className="spinner-lg text-primary-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Nutrition"
      headerActions={
        <button
          onClick={() => setShowForm(true)}
          className="touch-target p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="Add nutrition entry"
        >
          <Plus className="w-6 h-6" />
        </button>
      }
    >
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Protein Summary */}
        <ProteinSummary
          dailyTotal={dailyTotal}
          dailyGoal={150}
          proteinByTimeOfDay={proteinByTimeOfDay}
          weeklyAverage={weeklyAverage}
        />

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('quick')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeView === 'quick' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Quick Add</span>
          </button>
          
          <button
            onClick={() => setActiveView('detailed')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeView === 'detailed' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Detailed</span>
          </button>
          
          <button
            onClick={() => setActiveView('entries')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeView === 'entries' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">Entries ({todaysEntries.length})</span>
          </button>
        </div>

        {/* Content based on active view */}
        {activeView === 'quick' && (
          <QuickAddForm onQuickAdd={handleQuickAdd} />
        )}

        {activeView === 'detailed' && (
          <div className="card p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Add Detailed Entry</h3>
            <NutritionForm
              onSubmit={handleAddEntry}
              onCancel={() => setActiveView('quick')}
            />
          </div>
        )}

        {activeView === 'entries' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Today's Entries</h3>
            
            {todaysEntries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <List className="w-12 h-12" />
                </div>
                <p className="empty-state-text">No entries yet today</p>
                <p className="text-sm text-gray-500 mt-2">
                  Use Quick Add or Detailed form to track your nutrition
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysEntries
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((entry) => (
                    <NutritionEntry
                      key={entry.id}
                      entry={entry}
                      onUpdate={handleUpdateEntry}
                      onDelete={handleDeleteEntry}
                      onDuplicate={handleDuplicateEntry}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Modal for detailed form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Nutrition Entry</h3>
              <NutritionForm
                onSubmit={handleAddEntry}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 