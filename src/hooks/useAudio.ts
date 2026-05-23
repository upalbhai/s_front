'use client';

import { useContext } from 'react';
import { AudioContext } from '@/context/AudioContext';

export default function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
