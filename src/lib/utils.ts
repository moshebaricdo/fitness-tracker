import { format, startOfWeek, endOfWeek, addDays, subDays, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { TimeOfDay } from '@/types';

export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

export const formatDateForDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
};

export const formatTimeForDisplay = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const getTomorrow = (): string => {
  return formatDate(addDays(new Date(), 1));
};

export const getYesterday = (): string => {
  return formatDate(subDays(new Date(), 1));
};

export const getWeekRange = (date: Date = new Date()): { start: string; end: string } => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  
  return {
    start: formatDate(start),
    end: formatDate(end)
  };
};

export const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  let current = start;
  while (current <= end) {
    dates.push(formatDate(current));
    current = addDays(current, 1);
  }
  
  return dates;
};

export const getTimeOfDayLabel = (timeOfDay: TimeOfDay): string => {
  const labels: Record<TimeOfDay, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack'
  };
  
  return labels[timeOfDay];
};

export const getTimeOfDayEmoji = (timeOfDay: TimeOfDay): string => {
  const emojis: Record<TimeOfDay, string> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  };
  
  return emojis[timeOfDay];
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return singular;
  return plural || singular + 's';
};

export const calculateStreak = (dates: string[]): number => {
  if (dates.length === 0) return 0;
  
  const sortedDates = dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = getToday();
  
  // If the most recent date is not today or yesterday, streak is 0
  if (sortedDates[0] !== today && sortedDates[0] !== getYesterday()) {
    return 0;
  }
  
  let streak = 0;
  let expectedDate = today;
  
  for (const date of sortedDates) {
    if (date === expectedDate) {
      streak++;
      expectedDate = formatDate(subDays(parseISO(expectedDate), 1));
    } else {
      break;
    }
  }
  
  return streak;
};

export const getStreakEmoji = (streak: number): string => {
  if (streak === 0) return '😴';
  if (streak < 3) return '🔥';
  if (streak < 7) return '🚀';
  if (streak < 14) return '⭐';
  if (streak < 30) return '💪';
  return '🏆';
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const getProgressPercentage = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidDate = (date: string): boolean => {
  const parsedDate = parseISO(date);
  return !isNaN(parsedDate.getTime());
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}; 