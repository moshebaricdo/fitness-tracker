'use client';

import React, { useState, useEffect } from 'react';
import { ProgressPhoto } from '@/types';
import { useCamera } from '@/hooks/useCamera';
import { Trash2, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface PhotoGalleryProps {
  workoutId?: number;
  showWorkoutFilter?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  workoutId,
  showWorkoutFilter = false
}) => {
  const {
    photos,
    loading,
    deletePhoto,
    createPhotoURL,
    createThumbnailURL,
    getPhotosByWorkout,
    refreshPhotos
  } = useCamera();

  const [filteredPhotos, setFilteredPhotos] = useState<ProgressPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    refreshPhotos();
  }, []);

  useEffect(() => {
    if (workoutId) {
      setFilteredPhotos(getPhotosByWorkout(workoutId));
    } else {
      setFilteredPhotos(photos);
    }
  }, [photos, workoutId]);

  const handlePhotoClick = (photo: ProgressPhoto, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!selectedPhoto?.id) return;
    
    setIsDeleting(true);
    try {
      await deletePhoto(photoId);
      setSelectedPhoto(null);
      // Refresh the filtered photos after deletion
      if (workoutId) {
        setFilteredPhotos(getPhotosByWorkout(workoutId));
      } else {
        setFilteredPhotos(photos);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.length - 1;
      setCurrentIndex(newIndex);
      setSelectedPhoto(filteredPhotos[newIndex]);
    } else {
      const newIndex = currentIndex < filteredPhotos.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      setSelectedPhoto(filteredPhotos[newIndex]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigatePhoto('prev');
    if (e.key === 'ArrowRight') navigatePhoto('next');
    if (e.key === 'Escape') setSelectedPhoto(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="spinner text-primary-600" />
      </div>
    );
  }

  if (filteredPhotos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Calendar className="w-12 h-12" />
        </div>
        <p className="empty-state-text">No progress photos yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Take your first progress photo to start tracking your journey
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
            onClick={() => handlePhotoClick(photo, index)}
          >
            <img
              src={createThumbnailURL(photo)}
              alt={`Progress photo from ${format(new Date(photo.takenAt), 'MMM d, yyyy')}`}
              className="w-full h-full object-cover"
            />
            
            {/* Date overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2">
              {format(new Date(photo.takenAt), 'MMM d, yyyy')}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full flex flex-col">
            {/* Header */}
            <div className="bg-black bg-opacity-50 p-4 flex items-center justify-between">
              <div className="text-white">
                <h3 className="font-medium">
                  {format(new Date(selectedPhoto.takenAt), 'MMMM d, yyyy')}
                </h3>
                <p className="text-sm text-gray-300">
                  {format(new Date(selectedPhoto.takenAt), 'h:mm a')}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeletePhoto(selectedPhoto.id!)}
                  disabled={isDeleting}
                  className="text-white hover:text-red-400 p-2 rounded-full hover:bg-red-900 hover:bg-opacity-50 transition-colors disabled:opacity-50"
                  title="Delete photo"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-gray-900 hover:bg-opacity-50 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Photo */}
            <div className="flex-1 flex items-center justify-center relative">
              <img
                src={createPhotoURL(selectedPhoto)}
                alt={`Progress photo from ${format(new Date(selectedPhoto.takenAt), 'MMM d, yyyy')}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Navigation arrows */}
              {filteredPhotos.length > 1 && (
                <>
                  <button
                    onClick={() => navigatePhoto('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2 rounded-full hover:bg-gray-900 hover:bg-opacity-50 transition-colors"
                    title="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => navigatePhoto('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 p-2 rounded-full hover:bg-gray-900 hover:bg-opacity-50 transition-colors"
                    title="Next photo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="bg-black bg-opacity-50 p-4 text-center text-white text-sm">
              {currentIndex + 1} of {filteredPhotos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 