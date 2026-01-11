"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserProfile, ResumeWork } from '@/types';
import EditorLayout from '@/components/features/editor/EditorLayout';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [work, setWork] = useState<ResumeWork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('resumaster_profile');
    const savedWorks = localStorage.getItem('resumaster_works');

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    if (savedWorks) {
      const works: ResumeWork[] = JSON.parse(savedWorks);
      const foundWork = works.find(w => w.id === id);
      if (foundWork) {
        setWork(foundWork);
      } else {
        // Handle not found
        router.push('/dashboard');
      }
    } else {
        router.push('/dashboard');
    }
    setLoading(false);
  }, [id, router]);

  const handleUpdateWork = (updatedWork: ResumeWork) => {
    setWork(updatedWork);
    const savedWorks = localStorage.getItem('resumaster_works');
    if (savedWorks) {
      const works: ResumeWork[] = JSON.parse(savedWorks);
      const updatedWorks = works.map(w => w.id === updatedWork.id ? updatedWork : w);
      localStorage.setItem('resumaster_works', JSON.stringify(updatedWorks));
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('resumaster_profile', JSON.stringify(updatedProfile));
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!work || !userProfile) return null;

  return (
    <EditorLayout 
      workId={id as string}
      initialWork={work}
      initialProfile={userProfile}
      onUpdateWork={handleUpdateWork}
      onUpdateProfile={handleUpdateProfile}
      onBack={() => router.push('/dashboard')}
    />
  );
}
