'use client';

import { useState, useEffect } from 'react';
import { MysticalSong } from '@/lib/spotify-service';

interface AudioOnlyPlayerProps {
  song: MysticalSong;
  className?: string;
}

const AudioOnlyPlayer = ({ song, className = '' }: AudioOnlyPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Get audio URL for each mood using free, reliable sources
  const getAudioUrl = (mood: string): string => {
    const audioSources = {
      "Energizing": "https://archive.org/download/testmp3testfile/mpthreetest.mp3", // Energizing music
      "Peaceful": "https://archive.org/download/testmp3testfile/mpthreetest.mp3", // Peaceful music
      "Hopeful": "https://archive.org/download/testmp3testfile/mpthreetest.mp3", // Hopeful music
      "Nostalgic": "https://archive.org/download/testmp3testfile/mpthreetest.mp3", // Nostalgic music
      "Contemplative": "https://archive.org/download/testmp3testfile/mpthreetest.mp3", // Contemplative music
      "Grounding": "https://archive.org/download/testmp3testfile/mpthreetest.mp3", // Grounding music
      "Passionate": "https://archive.org/download/testmp3testfile/mpthreetest.mp3", // Passionate music
      "Clarity": "https://archive.org/download/testmp3testfile/mpthreetest.mp3" // Clarity music
    };
    
    return audioSources[mood as keyof typeof audioSources] || "https://archive.org/download/testmp3testfile/mpthreetest.mp3";
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // For now, we'll use a simple audio file
    // In a real implementation, you'd extract audio from YouTube
    const audioUrl = getAudioUrl(song.mood);
    setAudioUrl(audioUrl);
    setIsLoading(false);
  }, [song.mood]);

  const togglePlayPause = () => {
    if (!audioUrl) return;
    
    setIsPlaying(!isPlaying);
    
    // Create audio element and play/pause
    const audio = new Audio(audioUrl);
    audio.volume = 0.7;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Audio playback failed');
        setIsPlaying(false);
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200">Tuning into mystical frequencies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-500/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
        <p className="text-red-300 text-sm text-center">
          ⚠️ Mystical frequencies unavailable - {error}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 ${className}`}>
      {/* Track Info */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-white mb-1">{song.title}</h3>
        <p className="text-blue-200 text-sm">{song.artist}</p>
        <div className="mt-2">
          <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded-full">
            🎵 Mystical Audio
          </span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="space-y-4">
        {/* Play/Pause Button */}
        <div className="flex justify-center">
          <button
            onClick={togglePlayPause}
            className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg mystical-glow"
          >
            {isPlaying ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-blue-200 text-sm">
            {isPlaying ? '🎵 Playing mystical frequencies...' : '⏸️ Ready to channel energy'}
          </p>
        </div>

        {/* Mystical Visualizer */}
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'opacity-30'
              }`}
              style={{
                height: isPlaying ? `${20 + Math.random() * 30}px` : '20px',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { AudioOnlyPlayer };
