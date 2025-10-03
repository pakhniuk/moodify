'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
}

export const useAudio = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio();
    audioRef.current = audio;

    const handleLoadStart = () => {
      setAudioState(prev => ({ ...prev, isLoading: true, error: null }));
    };

    const handleLoadedMetadata = () => {
      setAudioState(prev => ({ 
        ...prev, 
        duration: audio.duration,
        isLoading: false 
      }));
    };

    const handleTimeUpdate = () => {
      setAudioState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    };

    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    };

    const handleEnded = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    };

    const handleError = () => {
      setAudioState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load audio',
        isPlaying: false 
      }));
    };

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Set audio properties
    audio.src = audioUrl;
    audio.volume = audioState.volume;
    audio.preload = 'metadata';

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, audioState.volume]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        setAudioState(prev => ({ ...prev, error: 'Playback failed' }));
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlayPause = () => {
    if (audioState.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setAudioState(prev => ({ ...prev, volume }));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    ...audioState,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    formatTime,
  };
};
