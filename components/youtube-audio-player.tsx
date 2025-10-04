'use client';

import { useState, useEffect } from 'react';
import { MysticalSong } from '@/lib/spotify-service';
import { getRandomSongFromMood } from '@/lib/mystical-playlists';

interface YouTubeAudioPlayerProps {
  song: MysticalSong;
  className?: string;
}

const YouTubeAudioPlayer = ({ song, className = '' }: YouTubeAudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<{title: string, artist: string, videoId: string} | null>(null);

  // Get random song from mystical playlist based on mood
  const getRandomTrack = (mood: string) => {
    return getRandomSongFromMood(mood);
  };

  // Extract audio URL from YouTube video ID
  const extractAudioUrl = async (videoId: string): Promise<string | null> => {
    try {
      // Using a YouTube audio extraction service
      // Note: This is a simplified approach - in production you'd use a proper API
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
      
      // For demo purposes, we'll use a direct audio stream URL
      // In a real implementation, you'd parse the YouTube page for audio URLs
      return `https://www.youtube.com/watch?v=${videoId}&audio_only=1`;
    } catch (error) {
      console.error('Error extracting audio:', error);
      return null;
    }
  };

  useEffect(() => {
    const setupAudio = async () => {
      setIsLoading(true);
      setError(null);
      
      // Get random track from mystical playlist
      const track = getRandomTrack(song.mood);
      setCurrentTrack(track);
      setVideoId(track.videoId);
      
      setIsLoading(false);
    };

    setupAudio();
  }, [song.mood]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-200">Extracting mystical frequencies from YouTube...</p>
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
        <h3 className="text-lg font-semibold text-white mb-1">{currentTrack?.title || song.title}</h3>
        <p className="text-blue-200 text-sm">{currentTrack?.artist || song.artist}</p>
        <div className="mt-2">
          <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded-full">
            🎵 YouTube Audio
          </span>
        </div>
      </div>

      {/* Hidden YouTube Player for Audio Only */}
      {videoId && (
        <div className="hidden">
          <iframe
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&controls=0&rel=0&modestbranding=1&enablejsapi=1&loop=1&playlist=${videoId}`}
            title="Hidden YouTube Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

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
            {isPlaying ? '🎵 Playing YouTube audio...' : '⏸️ Ready to channel energy'}
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

export { YouTubeAudioPlayer };
