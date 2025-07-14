'use client';

import React from 'react';
import { useCamera } from '@/hooks/useCamera';
import { Camera, Calendar, TrendingUp, Star } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface ProgressStatsProps {
  className?: string;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  className = ''
}) => {
  const {
    photos,
    getPhotoCount,
    getLatestPhoto,
    getPhotosByMonth
  } = useCamera();

  const totalPhotos = getPhotoCount();
  const latestPhoto = getLatestPhoto();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthPhotos = getPhotosByMonth(currentYear, currentMonth);

  // Calculate streak (consecutive days with photos)
  const calculateStreak = (): number => {
    if (photos.length === 0) return 0;
    
    const sortedPhotos = [...photos].sort((a, b) => 
      new Date(b.takenAt).getTime() - new Date(a.takenAt).getTime()
    );
    
    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    
    for (const photo of sortedPhotos) {
      const photoDate = new Date(photo.takenAt);
      photoDate.setHours(0, 0, 0, 0);
      
      const dayDiff = differenceInDays(checkDate, photoDate);
      
      if (dayDiff === 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (dayDiff === 1) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Calculate days since first photo
  const daysSinceStart = (): number => {
    if (photos.length === 0) return 0;
    
    const firstPhoto = photos.reduce((earliest, photo) => 
      new Date(photo.takenAt) < new Date(earliest.takenAt) ? photo : earliest
    );
    
    return differenceInDays(new Date(), new Date(firstPhoto.takenAt));
  };

  const journeyDays = daysSinceStart();

  const stats = [
    {
      icon: Camera,
      label: 'Total Photos',
      value: totalPhotos,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Calendar,
      label: 'This Month',
      value: thisMonthPhotos.length,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: TrendingUp,
      label: 'Current Streak',
      value: `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Star,
      label: 'Journey Days',
      value: journeyDays,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">{stat.label}</p>
                  <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest Photo Info */}
      {latestPhoto && (
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={useCamera().createThumbnailURL(latestPhoto)}
                alt="Latest progress photo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Latest Photo</p>
              <p className="font-medium text-gray-900">
                {format(new Date(latestPhoto.takenAt), 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(latestPhoto.takenAt), 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Milestones */}
      {totalPhotos > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Milestones</h3>
          <div className="space-y-2">
            {totalPhotos >= 1 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>First progress photo taken!</span>
              </div>
            )}
            {totalPhotos >= 7 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>First week of progress tracking</span>
              </div>
            )}
            {totalPhotos >= 30 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>30 photos milestone reached!</span>
              </div>
            )}
            {currentStreak >= 7 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>7-day streak achieved!</span>
              </div>
            )}
            {journeyDays >= 30 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>30 days of progress tracking</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 