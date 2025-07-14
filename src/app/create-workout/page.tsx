'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { WorkoutForm } from '@/components/workout/WorkoutForm';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Workout } from '@/types';
import { getToday } from '@/lib/utils';

export default function CreateWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addWorkout } = useWorkouts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get date from URL params (from calendar) or default to today
  const scheduledDate = searchParams.get('date') || getToday();

  const handleSubmit = async (workoutData: Omit<Workout, 'id' | 'createdAt'>) => {
    try {
      setIsSubmitting(true);
      await addWorkout(workoutData);
      router.push('/');
    } catch (error) {
      console.error('Error creating workout:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <Layout
      title="Create Workout"
      showBackButton={true}
      onBackClick={handleCancel}
    >
      <WorkoutForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        initialData={{
          name: 'Chest', // Will be auto-updated based on focus area
          focusArea: 'chest',
          exercises: [],
          scheduledDate: scheduledDate,
          completed: false,
          isTemplate: false
        }}
      />
    </Layout>
  );
} 