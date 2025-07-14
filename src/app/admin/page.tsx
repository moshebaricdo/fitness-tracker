'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { seedWorkouts, clearAllWorkouts } from '@/lib/seedData';
import { Trash2, Sparkles, AlertTriangle } from 'lucide-react';

export default function AdminPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const handleSeedWorkouts = async () => {
    setIsSeeding(true);
    setMessage('');
    
    try {
      await seedWorkouts();
      setMessage('✅ Successfully seeded 15 workouts! Refresh the app to see the data.');
      setMessageType('success');
    } catch (error) {
      console.error('Error seeding workouts:', error);
      setMessage('❌ Error seeding workouts. Check console for details.');
      setMessageType('error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearWorkouts = async () => {
    if (!confirm('Are you sure you want to clear ALL workout data? This cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    setMessage('');
    
    try {
      await clearAllWorkouts();
      setMessage('✅ All workout data cleared! Refresh the app to see the changes.');
      setMessageType('success');
    } catch (error) {
      console.error('Error clearing workouts:', error);
      setMessage('❌ Error clearing workouts. Check console for details.');
      setMessageType('error');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Layout title="Admin" showBackButton={true} onBackClick={() => window.history.back()}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Database Administration
          </h2>
          <p className="text-gray-600">
            Tools for managing test data and seeding the database
          </p>
        </div>

        {/* Seed Workouts */}
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seed Test Workouts
              </h3>
              <p className="text-gray-600 mb-4">
                Add 15 sample workouts to test different states:
              </p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>• 10 completed workouts (spread over past 20 days)</li>
                <li>• 1 scheduled workout for today</li>
                <li>• 4 future scheduled workouts</li>
                <li>• Mix of all focus areas with realistic exercises</li>
              </ul>
              <button
                onClick={handleSeedWorkouts}
                disabled={isSeeding}
                className="btn btn-primary flex items-center gap-2"
              >
                {isSeeding ? (
                  <>
                    <div className="spinner" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Seed Workouts
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Clear All Data */}
        <div className="card p-6 border-red-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Clear All Data
              </h3>
              <p className="text-gray-600 mb-4">
                Permanently delete all workouts, nutrition entries, and progress photos.
              </p>
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg mb-4">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">
                  This action cannot be undone!
                </span>
              </div>
              <button
                onClick={handleClearWorkouts}
                disabled={isClearing}
                className="btn btn-danger flex items-center gap-2"
              >
                {isClearing ? (
                  <>
                    <div className="spinner" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`card p-4 ${
            messageType === 'success' ? 'bg-green-50 border-green-200' :
            messageType === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm ${
              messageType === 'success' ? 'text-green-800' :
              messageType === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="card p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            What to Test After Seeding
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong>Home Page:</strong> Should show today's Arms workout with "Start Workout" button
            </div>
            <div>
              <strong>Calendar:</strong> Should show workouts distributed across dates with completed (green) and scheduled (blue) indicators
            </div>
            <div>
              <strong>Workout Details:</strong> Click on any workout to see the full detail page with appropriate actions
            </div>
            <div>
              <strong>Weekly Stats:</strong> Should show completion ratios and workout counts
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 