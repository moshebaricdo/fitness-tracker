'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, AlertCircle } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';

interface CameraCaptureProps {
  workoutId: number;
  onPhotoTaken: (photoId: number) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  workoutId,
  onPhotoTaken,
  onCancel,
  isOpen
}) => {
  const {
    loading,
    error,
    hasPermission,
    isSupported,
    takePhoto,
    requestPermissions,
    canTakePhoto
  } = useCamera();

  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && canTakePhoto()) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen, hasPermission]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Error starting camera:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakePhoto = async () => {
    if (!canTakePhoto()) return;
    
    setIsCapturing(true);
    try {
      const photo = await takePhoto(workoutId);
      if (photo && photo.id) {
        onPhotoTaken(photo.id);
        stopCamera();
      }
    } catch (err) {
      console.error('Error taking photo:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermissions();
    if (granted) {
      startCamera();
    }
  };

  if (!isOpen) return null;

  if (!isSupported) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold">Camera Not Supported</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Your device doesn't support camera functionality.
          </p>
          <button
            onClick={onCancel}
            className="w-full btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
          <div className="flex items-center gap-3 mb-4">
            <Camera className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold">Camera Permission</h3>
          </div>
          <p className="text-gray-600 mb-4">
            We need camera permission to take progress photos.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleRequestPermission}
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading ? 'Requesting...' : 'Allow Camera'}
            </button>
            <button
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg overflow-hidden max-w-md w-full mx-4">
        {/* Header */}
        <div className="bg-gray-900 p-4 flex items-center justify-between">
          <h3 className="text-white font-medium">Take Progress Photo</h3>
          <button
            onClick={onCancel}
            className="text-white hover:text-gray-300 p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Camera Preview */}
        <div className="relative bg-black" style={{ aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
          
          {/* Overlay grid for composition */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 p-6 flex items-center justify-center">
          <button
            onClick={handleTakePhoto}
            disabled={isCapturing || !stream}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isCapturing ? (
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-8 h-8 text-gray-900" />
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 text-red-100 p-3 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}; 