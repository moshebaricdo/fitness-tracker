'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { CameraCapture } from '@/components/progress/CameraCapture';
import { PhotoGallery } from '@/components/progress/PhotoGallery';
import { ProgressStats } from '@/components/progress/ProgressStats';
import { useCamera } from '@/hooks/useCamera';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Camera, Grid, BarChart3 } from 'lucide-react';

export default function ProgressPage() {
  const [showCamera, setShowCamera] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'gallery' | 'stats'>('gallery');

  const { photos, canTakePhoto, isSupported } = useCamera();
  const { workouts } = useWorkouts();

  // Get a recent workout ID for photo association
  const getRecentWorkoutId = (): number => {
    const recentWorkouts = workouts
      .filter(w => w.completed || w.scheduledDate === new Date().toISOString().split('T')[0])
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
    
    return recentWorkouts[0]?.id || 1; // Default to 1 if no workouts
  };

  const handleTakePhoto = () => {
    if (canTakePhoto()) {
      setSelectedWorkoutId(getRecentWorkoutId());
      setShowCamera(true);
    }
  };

  const handlePhotoTaken = (photoId: number) => {
    setShowCamera(false);
    setSelectedWorkoutId(null);
    // Optionally show success message or navigate somewhere
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
    setSelectedWorkoutId(null);
  };

  return (
    <Layout
      title="Progress"
      headerActions={
        isSupported && (
          <button
            onClick={handleTakePhoto}
            className="touch-target p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Take progress photo"
          >
            <Camera className="w-6 h-6" />
          </button>
        )
      }
    >
      <div className="space-y-6">
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('gallery')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeView === 'gallery' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="text-sm font-medium">Gallery</span>
          </button>
          
          <button
            onClick={() => setActiveView('stats')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
              activeView === 'stats' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Stats</span>
          </button>
        </div>

        {/* Content based on active view */}
        {activeView === 'gallery' ? (
          <div className="space-y-4">
            {/* Take Photo Button for Gallery View */}
            {isSupported && photos.length > 0 && (
              <button
                onClick={handleTakePhoto}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Take Progress Photo
              </button>
            )}

            {/* Photo Gallery */}
            <PhotoGallery />

            {/* First Photo CTA */}
            {photos.length === 0 && (
              <div className="text-center py-8">
                <div className="mb-4">
                  <Camera className="w-16 h-16 mx-auto text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Start Your Progress Journey
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  Take your first progress photo to start tracking your fitness transformation visually.
                </p>
                {isSupported ? (
                  <button
                    onClick={handleTakePhoto}
                    className="btn btn-primary flex items-center gap-2 mx-auto"
                  >
                    <Camera className="w-5 h-5" />
                    Take First Photo
                  </button>
                ) : (
                  <div className="text-sm text-gray-500">
                    Camera not supported on this device
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Take Photo Button for Stats View */}
            {isSupported && (
              <button
                onClick={handleTakePhoto}
                className="w-full btn btn-primary flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Take Progress Photo
              </button>
            )}

            {/* Progress Stats */}
            <ProgressStats />

            {/* Getting Started Message */}
            {photos.length === 0 && (
              <div className="card p-6 text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  No Progress Data Yet
                </h3>
                <p className="text-gray-600 text-sm">
                  Take your first progress photo to start seeing statistics and milestones.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Camera Capture Modal */}
        {showCamera && selectedWorkoutId && (
          <CameraCapture
            workoutId={selectedWorkoutId}
            onPhotoTaken={handlePhotoTaken}
            onCancel={handleCameraCancel}
            isOpen={showCamera}
          />
        )}
      </div>
    </Layout>
  );
} 