'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { useWorkouts } from '@/hooks/useWorkouts';
import { useCamera } from '@/hooks/useCamera';
import { CameraCapture } from '@/components/progress/CameraCapture';
import { Workout } from '@/types';
import { 
  CheckCircle, 
  Edit, 
  Trash2, 
  Play, 
  Copy, 
  Calendar, 
  Target, 
  Dumbbell,
  Clock,
  MoreHorizontal,
  Camera
} from 'lucide-react';
import { focusAreaEmojis, focusAreaLabels } from '@/lib/exercises';
import { format } from 'date-fns';

export default function WorkoutDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = parseInt(params.id as string);
  
  const { 
    workouts, 
    loading, 
    completeWorkout, 
    uncompleteWorkout, 
    deleteWorkout, 
    duplicateWorkout,
    getWorkoutById 
  } = useWorkouts();
  
  const { photos, getPhotosByWorkout, createThumbnailURL, canTakePhoto, isSupported, hasPermission } = useCamera();
  
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (!loading && workouts.length > 0) {
      const foundWorkout = getWorkoutById(workoutId);
      setWorkout(foundWorkout || null);
    }
  }, [workoutId, workouts, loading]);

  const workoutPhotos = workout?.id ? getPhotosByWorkout(workout.id) : [];

  const handleMarkComplete = async () => {
    if (!workout?.id) return;
    
    setIsUpdating(true);
    try {
      await completeWorkout(workout.id);
      // Show camera immediately if supported, otherwise navigate to progress page
      if (isSupported && canTakePhoto()) {
        setShowCamera(true);
      } else {
        router.push('/progress');
      }
    } catch (error) {
      console.error('Error completing workout:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkIncomplete = async () => {
    if (!workout?.id) return;
    
    setIsUpdating(true);
    try {
      await uncompleteWorkout(workout.id);
    } catch (error) {
      console.error('Error marking workout incomplete:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    if (!workout?.id) return;
    router.push(`/edit-workout/${workout.id}`);
  };

  const handleDelete = async () => {
    if (!workout?.id) return;
    
    setIsUpdating(true);
    try {
      await deleteWorkout(workout.id);
      router.push('/');
    } catch (error) {
      console.error('Error deleting workout:', error);
    } finally {
      setIsUpdating(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDuplicate = async () => {
    if (!workout) return;
    
    setIsUpdating(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await duplicateWorkout(workout, today);
      router.push('/');
    } catch (error) {
      console.error('Error duplicating workout:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleScheduleAgain = () => {
    router.push('/calendar');
  };

  const handleStartWorkout = () => {
    // TODO: Navigate to workout execution page when implemented
    console.log('Starting workout:', workout?.id);
  };

  const handleTakePhoto = () => {
    if (canTakePhoto()) {
      setShowCamera(true);
    }
  };

  const handlePhotoTaken = (photoId: number) => {
    setShowCamera(false);
    // Photo will automatically appear in the workoutPhotos due to the useCamera hook
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
  };

  if (loading) {
    return (
      <Layout title="Workout">
        <div className="flex items-center justify-center h-64">
          <div className="spinner-lg text-primary-600" />
        </div>
      </Layout>
    );
  }

  if (!workout) {
    return (
      <Layout title="Workout Not Found">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Workout Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The workout you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            Back to Home
          </button>
        </div>
      </Layout>
    );
  }

  const isCompleted = workout.completed;
  const isScheduledToday = workout.scheduledDate === new Date().toISOString().split('T')[0];

  return (
    <Layout
      title={workout.name}
      showBackButton={true}
      onBackClick={() => router.push('/')}
      headerActions={
        <div className="relative">
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="touch-target p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="More actions"
          >
            <MoreHorizontal className="w-6 h-6" />
          </button>
          
          {showActionsMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <button
                  onClick={() => {
                    handleEdit();
                    setShowActionsMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Workout
                </button>
                
                {isCompleted && (
                  <button
                    onClick={() => {
                      handleDuplicate();
                      setShowActionsMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowActionsMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Workout Header */}
        <div className={`card p-6 ${
          isCompleted 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
            : 'bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200'
        }`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {isCompleted ? (
                <CheckCircle className="w-12 h-12 text-green-500" />
              ) : (
                <Dumbbell className="w-12 h-12 text-primary-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {focusAreaEmojis[workout.focusArea]} {workout.name}
                </h1>
                {isCompleted && (
                  <span className="badge badge-success">Completed</span>
                )}
                {isScheduledToday && !isCompleted && (
                  <span className="badge badge-primary">Today</span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{focusAreaLabels[workout.focusArea]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="w-4 h-4" />
                  <span>{workout.exercises.length} exercises</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(workout.scheduledDate), 'MMM d, yyyy')}
                  </span>
                </div>
                {isCompleted && workout.completedDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      Completed {format(new Date(workout.completedDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Photos (if completed) */}
        {isCompleted && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Progress Photos
              </h3>
              {isSupported && (
                <button
                  onClick={handleTakePhoto}
                  className="btn btn-primary btn-sm flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </button>
              )}
            </div>
            
            {workoutPhotos.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {workoutPhotos.slice(0, 2).map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={createThumbnailURL(photo)}
                        alt={`Progress photo from ${format(new Date(photo.takenAt), 'MMM d')}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {workoutPhotos.length > 2 && (
                  <button
                    onClick={() => router.push('/progress')}
                    className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View all {workoutPhotos.length} photos
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 mb-4">No progress photos yet</p>
                {isSupported && (
                  <button
                    onClick={handleTakePhoto}
                    className="btn btn-primary flex items-center gap-2 mx-auto"
                  >
                    <Camera className="w-4 h-4" />
                    Take First Photo
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Exercises List */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Exercises
          </h3>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  exercise.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {exercise.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps
                    </p>
                  </div>
                </div>
                {exercise.completed && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isCompleted ? (
            // Active workout actions
            <div className="space-y-3">
              <button
                onClick={handleMarkComplete}
                disabled={isUpdating}
                className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <div className="spinner" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Mark Complete
                  </>
                )}
              </button>
              
              {isScheduledToday && (
                <button
                  onClick={handleStartWorkout}
                  className="w-full btn btn-secondary btn-lg flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Workout
                </button>
              )}
            </div>
          ) : (
            // Completed workout actions
            <div className="grid grid-cols-1 gap-3">
              {isSupported ? (
                <button
                  onClick={handleTakePhoto}
                  className="btn btn-primary btn-lg flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Take Progress Photo
                </button>
              ) : (
                <button
                  onClick={() => router.push('/progress')}
                  className="btn btn-primary btn-lg flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  View Progress Photos
                </button>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDuplicate}
                  disabled={isUpdating}
                  className="btn btn-secondary flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                
                <button
                  onClick={handleScheduleAgain}
                  className="btn btn-secondary flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Again
                </button>
              </div>
              
              <button
                onClick={handleMarkIncomplete}
                disabled={isUpdating}
                className="btn btn-outline text-sm"
              >
                Mark as Incomplete
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Workout
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this workout? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className="flex-1 btn btn-danger"
                >
                  {isUpdating ? <div className="spinner" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Capture Modal */}
        {showCamera && workout?.id && (
          <CameraCapture
            workoutId={workout.id}
            onPhotoTaken={handlePhotoTaken}
            onCancel={handleCameraCancel}
            isOpen={showCamera}
          />
        )}
      </div>
    </Layout>
  );
} 