'use client';

import { useAudio } from '@/lib/use-audio';
import { useState } from 'react';
import { MysticalSong } from '@/lib/spotify-service';

interface AudioPlayerProps {
  song: MysticalSong;
  className?: string;
}

const EnhancedAudioPlayer = ({ song, className = '' }: AudioPlayerProps) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    error,
    togglePlayPause,
    seek,
    setVolume,
    formatTime,
  } = useAudio(song.audioUrl);

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  if (error) {
    return (
      <div className={`bg-red-500/20 border border-red-500/30 rounded-xl p-4 ${className}`}>
        <p className="text-red-300 text-sm text-center">
          ⚠️ Audio unavailable - {error}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 ${className}`}>
      {/* Track Info */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{song.title}</h3>
        <p className="text-blue-200 text-sm">{song.artist}</p>
        <div className="mt-2">
          <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded-full">
            ✨ Mystical Track
          </span>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="space-y-4">
        {/* Play/Pause Button */}
        <div className="flex justify-center">
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg mystical-glow"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-blue-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative">
            <div className="w-full h-2 bg-purple-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="text-blue-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {volume === 0 ? (
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              ) : volume < 0.5 ? (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              ) : (
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              )}
            </svg>
          </button>
          
          {showVolumeSlider && (
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-20 h-1 bg-purple-900/30 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${volume * 100}%, #1E1B4B ${volume * 100}%, #1E1B4B 100%)`
                }}
              />
              <span className="text-xs text-blue-300 w-8">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export { EnhancedAudioPlayer };
