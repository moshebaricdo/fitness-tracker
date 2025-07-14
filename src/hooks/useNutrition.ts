import { useState, useEffect } from 'react';
import { NutritionEntry, TimeOfDay } from '@/types';
import { dbUtils } from '@/lib/database';
import { getToday, getWeekRange } from '@/lib/utils';

export const useNutrition = () => {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [todaysEntries, setTodaysEntries] = useState<NutritionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodaysEntries();
  }, []);

  const loadTodaysEntries = async () => {
    try {
      setLoading(true);
      const today = getToday();
      const todayEntries = await dbUtils.getNutritionEntriesByDate(today);
      setTodaysEntries(todayEntries);
      setError(null);
    } catch (err) {
      setError('Failed to load nutrition entries');
      console.error('Error loading nutrition entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEntriesForDateRange = async (startDate: string, endDate: string) => {
    try {
      const rangeEntries = await dbUtils.getNutritionEntriesForWeek(startDate, endDate);
      setEntries(rangeEntries);
    } catch (err) {
      console.error('Error loading nutrition entries for range:', err);
    }
  };

  const loadThisWeeksEntries = async () => {
    const { start, end } = getWeekRange();
    await loadEntriesForDateRange(start, end);
  };

  const addNutritionEntry = async (entry: Omit<NutritionEntry, 'id' | 'createdAt'>) => {
    try {
      const id = await dbUtils.createNutritionEntry(entry);
      await loadTodaysEntries();
      return id;
    } catch (err) {
      setError('Failed to add nutrition entry');
      console.error('Error adding nutrition entry:', err);
      throw err;
    }
  };

  const updateNutritionEntry = async (id: number, updates: Partial<NutritionEntry>) => {
    try {
      await dbUtils.updateNutritionEntry(id, updates);
      await loadTodaysEntries();
      setError(null);
    } catch (err) {
      setError('Failed to update nutrition entry');
      console.error('Error updating nutrition entry:', err);
      throw err;
    }
  };

  const deleteNutritionEntry = async (id: number) => {
    try {
      await dbUtils.deleteNutritionEntry(id);
      await loadTodaysEntries();
      setError(null);
    } catch (err) {
      setError('Failed to delete nutrition entry');
      console.error('Error deleting nutrition entry:', err);
      throw err;
    }
  };

  const getTodaysProteinTotal = (): number => {
    return todaysEntries.reduce((total, entry) => total + entry.proteinEstimate, 0);
  };

  const getEntriesByTimeOfDay = (timeOfDay: TimeOfDay): NutritionEntry[] => {
    return todaysEntries.filter(entry => entry.timeOfDay === timeOfDay);
  };

  const getProteinByTimeOfDay = (timeOfDay: TimeOfDay): number => {
    return getEntriesByTimeOfDay(timeOfDay).reduce((total, entry) => total + entry.proteinEstimate, 0);
  };

  const getWeeklyProteinAverage = (): number => {
    if (entries.length === 0) return 0;
    
    const dailyTotals = new Map<string, number>();
    
    entries.forEach(entry => {
      const current = dailyTotals.get(entry.date) || 0;
      dailyTotals.set(entry.date, current + entry.proteinEstimate);
    });
    
    const totals = Array.from(dailyTotals.values());
    return totals.reduce((sum, total) => sum + total, 0) / totals.length;
  };

  const getProteinGoalProgress = (dailyGoal: number): number => {
    const todaysTotal = getTodaysProteinTotal();
    return Math.min((todaysTotal / dailyGoal) * 100, 100);
  };

  const hasEntriesForTimeOfDay = (timeOfDay: TimeOfDay): boolean => {
    return getEntriesByTimeOfDay(timeOfDay).length > 0;
  };

  const getLatestEntry = (): NutritionEntry | null => {
    if (todaysEntries.length === 0) return null;
    return todaysEntries.reduce((latest, entry) => 
      new Date(entry.createdAt) > new Date(latest.createdAt) ? entry : latest
    );
  };

  const getEntryById = (id: number): NutritionEntry | undefined => {
    return todaysEntries.find(entry => entry.id === id);
  };

  const refreshEntries = async () => {
    await loadTodaysEntries();
  };

  const quickAddProtein = async (foodName: string, proteinAmount: number, timeOfDay: TimeOfDay) => {
    const entry: Omit<NutritionEntry, 'id' | 'createdAt'> = {
      date: getToday(),
      foodName,
      proteinEstimate: proteinAmount,
      timeOfDay
    };
    
    return await addNutritionEntry(entry);
  };

  const duplicateEntry = async (entry: NutritionEntry, targetDate?: string) => {
    const newEntry: Omit<NutritionEntry, 'id' | 'createdAt'> = {
      date: targetDate || getToday(),
      foodName: entry.foodName,
      proteinEstimate: entry.proteinEstimate,
      timeOfDay: entry.timeOfDay
    };
    
    return await addNutritionEntry(newEntry);
  };

  const getEntriesByDate = async (date: string): Promise<NutritionEntry[]> => {
    try {
      return await dbUtils.getNutritionEntriesByDate(date);
    } catch (err) {
      console.error('Error loading entries for date:', err);
      return [];
    }
  };

  const getProteinTotalForDate = async (date: string): Promise<number> => {
    try {
      return await dbUtils.getDailyProteinTotal(date);
    } catch (err) {
      console.error('Error calculating protein total for date:', err);
      return 0;
    }
  };

  return {
    entries,
    todaysEntries,
    loading,
    error,
    addNutritionEntry,
    updateNutritionEntry,
    deleteNutritionEntry,
    getTodaysProteinTotal,
    getEntriesByTimeOfDay,
    getProteinByTimeOfDay,
    getWeeklyProteinAverage,
    getProteinGoalProgress,
    hasEntriesForTimeOfDay,
    getLatestEntry,
    getEntryById,
    refreshEntries,
    quickAddProtein,
    duplicateEntry,
    loadThisWeeksEntries,
    getEntriesByDate,
    getProteinTotalForDate
  };
}; 