'use client';

import { useState, useEffect } from 'react';
import { MysticalSong } from '@/lib/spotify-service';

interface YouTubePlayerProps {
  song: MysticalSong;
  className?: string;
}

const YouTubePlayer = ({ song, className = '' }: YouTubePlayerProps) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reliable YouTube music videos that are always available
  const getVideoId = (mood: string): string => {
    const reliableVideos = {
      "Energizing": "5qap5aO4i9A", // Lofi hip hop radio - beats to relax/study to
      "Peaceful": "DWcJFNfaw9c", // Peaceful Piano Music 24/7
      "Hopeful": "7maJOI3QMu0", // Inspirational Music
      "Nostalgic": "5yx6BWlEVcY", // Nostalgic Music
      "Contemplative": "u8nQa1I_8Fs", // Deep Meditation Music
      "Grounding": "1ZYbU82GVz4", // Nature Sounds
      "Passionate": "rUxyKA_-grg", // Emotional Music
      "Clarity": "jfKfPfyJRdk" // Crystal Clear Music
    };
    
    return reliableVideos[mood as keyof typeof reliableVideos] || "5qap5aO4i9A";
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // Get video ID immediately
    const videoId = getVideoId(song.mood);
    setVideoId(videoId);
    setIsLoading(false);
  }, [song.mood]);

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

  if (error || !videoId) {
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
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">{song.title}</h3>
        <p className="text-blue-200 text-sm">{song.artist}</p>
        <div className="mt-2">
          <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded-full">
            🎵 YouTube Music
          </span>
        </div>
      </div>

      {/* YouTube Player */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&modestbranding=1&enablejsapi=1`}
          title={`${song.title} - ${song.artist}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* YouTube Link */}
      <div className="pt-4 border-t border-purple-500/20 mt-4">
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span>Open in YouTube</span>
        </a>
      </div>
    </div>
  );
};

export { YouTubePlayer };