import { useState, useEffect } from 'react';
import { ProgressPhoto } from '@/types';
import { dbUtils } from '@/lib/database';
import { 
  capturePhoto, 
  createThumbnail, 
  checkCameraPermission, 
  requestCameraPermission,
  isCameraSupported 
} from '@/lib/camera';

export const useCamera = () => {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    checkSupport();
    checkPermissions();
    loadPhotos();
  }, []);

  const checkSupport = () => {
    setIsSupported(isCameraSupported());
  };

  const checkPermissions = async () => {
    if (!isCameraSupported()) {
      setHasPermission(false);
      return;
    }

    try {
      const permission = await checkCameraPermission();
      setHasPermission(permission);
    } catch (err) {
      console.error('Error checking camera permission:', err);
      setHasPermission(false);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (!isCameraSupported()) {
      setError('Camera not supported on this device');
      return false;
    }

    try {
      setLoading(true);
      const granted = await requestCameraPermission();
      setHasPermission(granted);
      setError(null);
      return granted;
    } catch (err) {
      setError('Failed to request camera permission');
      console.error('Error requesting camera permission:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      const allPhotos = await dbUtils.getAllProgressPhotos();
      setPhotos(allPhotos);
    } catch (err) {
      console.error('Error loading photos:', err);
    }
  };

  const takePhoto = async (workoutId: number): Promise<ProgressPhoto | null> => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        setError('Camera permission required');
        return null;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const photoBlob = await capturePhoto();
      const thumbnailBlob = await createThumbnail(photoBlob);

      const photoData: Omit<ProgressPhoto, 'id' | 'takenAt'> = {
        workoutId,
        photoBlob,
        thumbnailBlob
      };

      const id = await dbUtils.saveProgressPhoto(photoData);
      
      const newPhoto: ProgressPhoto = {
        id,
        workoutId,
        photoBlob,
        thumbnailBlob,
        takenAt: new Date()
      };

      setPhotos(prev => [newPhoto, ...prev]);
      return newPhoto;
    } catch (err) {
      setError('Failed to take photo');
      console.error('Error taking photo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (id: number) => {
    try {
      await dbUtils.deleteProgressPhoto(id);
      setPhotos(prev => prev.filter(photo => photo.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete photo');
      console.error('Error deleting photo:', err);
      throw err;
    }
  };

  const getPhotosByWorkout = (workoutId: number): ProgressPhoto[] => {
    return photos.filter(photo => photo.workoutId === workoutId);
  };

  const getPhotoById = (id: number): ProgressPhoto | undefined => {
    return photos.find(photo => photo.id === id);
  };

  const getLatestPhoto = (): ProgressPhoto | null => {
    if (photos.length === 0) return null;
    return photos.reduce((latest, photo) => 
      new Date(photo.takenAt) > new Date(latest.takenAt) ? photo : latest
    );
  };

  const getPhotosByDateRange = (startDate: Date, endDate: Date): ProgressPhoto[] => {
    return photos.filter(photo => {
      const photoDate = new Date(photo.takenAt);
      return photoDate >= startDate && photoDate <= endDate;
    });
  };

  const getPhotoCount = (): number => {
    return photos.length;
  };

  const getPhotosByMonth = (year: number, month: number): ProgressPhoto[] => {
    return photos.filter(photo => {
      const photoDate = new Date(photo.takenAt);
      return photoDate.getFullYear() === year && photoDate.getMonth() === month;
    });
  };

  const createPhotoURL = (photo: ProgressPhoto): string => {
    return URL.createObjectURL(photo.photoBlob);
  };

  const createThumbnailURL = (photo: ProgressPhoto): string => {
    if (photo.thumbnailBlob) {
      return URL.createObjectURL(photo.thumbnailBlob);
    }
    return URL.createObjectURL(photo.photoBlob);
  };

  const refreshPhotos = async () => {
    await loadPhotos();
  };

  const hasPhotosForWorkout = (workoutId: number): boolean => {
    return photos.some(photo => photo.workoutId === workoutId);
  };

  const getPhotoCountForWorkout = (workoutId: number): number => {
    return photos.filter(photo => photo.workoutId === workoutId).length;
  };

  const canTakePhoto = (): boolean => {
    return isSupported && (hasPermission === true || hasPermission === null);
  };

  return {
    photos,
    loading,
    error,
    hasPermission,
    isSupported,
    takePhoto,
    deletePhoto,
    getPhotosByWorkout,
    getPhotoById,
    getLatestPhoto,
    getPhotosByDateRange,
    getPhotoCount,
    getPhotosByMonth,
    createPhotoURL,
    createThumbnailURL,
    refreshPhotos,
    hasPhotosForWorkout,
    getPhotoCountForWorkout,
    canTakePhoto,
    requestPermissions,
    checkPermissions
  };
}; 