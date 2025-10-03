'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { EnhancedAudioPlayer } from '@/components/enhanced-audio-player';
import { SpotifyAuth } from '@/components/spotify-auth';
import { getRandomMysticalSong, getFallbackSong, MysticalSong } from '@/lib/spotify-service';

const mysticalMessages = [
  "The universe has chosen your soundtrack for today...",
  "Your soul's frequency resonates with this melody...",
  "The cosmic playlist reveals your path...",
  "Music flows through the mystical realm to guide you...",
  "The stars align to bring you this song...",
  "Your energy signature matches this vibration...",
  "The ancient melodies speak to your spirit...",
  "The cosmic DJ has selected your anthem...",
];

export default function SoulPlaylist() {
  const [currentSong, setCurrentSong] = useState<MysticalSong | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [isLoadingSong, setIsLoadingSong] = useState(false);

  const revealSong = async () => {
    setIsRevealing(true);
    setShowAnimation(true);
    setIsLoadingSong(true);
    
    // Random mystical message
    const randomMessage = mysticalMessages[Math.floor(Math.random() * mysticalMessages.length)];
    setMessage(randomMessage);
    
    // Delay the song reveal for dramatic effect
    setTimeout(async () => {
      try {
        let song: MysticalSong | null = null;
        
        if (isSpotifyConnected) {
          // Try to get a real Spotify track
          song = await getRandomMysticalSong();
        }
        
        // Fallback to demo song if Spotify fails or not connected
        if (!song) {
          song = getFallbackSong();
        }
        
        setCurrentSong(song);
      } catch (error) {
        console.error('Error getting song:', error);
        setCurrentSong(getFallbackSong());
      } finally {
        setIsRevealing(false);
        setIsLoadingSong(false);
      }
    }, 2000);
  };

  const resetPrediction = () => {
    setCurrentSong(null);
    setMessage('');
    setShowAnimation(false);
  };

  const handleSpotifyAuth = (token: string) => {
    setIsSpotifyConnected(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <Image
              src="/soul-playlist-icon.svg"
              alt="Soul Playlist Icon"
              width={80}
              height={80}
              className="mx-auto"
            />
            {showAnimation && (
              <div className="absolute inset-0 animate-ping">
                <div className="w-full h-full rounded-full bg-yellow-400 opacity-20"></div>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mb-2">
            Soul Playlist
          </h1>
          <p className="text-blue-200 text-lg">
            Mystical Music Predictions
          </p>
        </div>

        {/* Spotify Auth */}
        <div className="mb-6">
          <SpotifyAuth onAuthSuccess={handleSpotifyAuth} />
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-purple-800/30 to-blue-800/30 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 shadow-2xl">
          {!currentSong ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-500 opacity-20 animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isLoadingSong ? (
                      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="w-8 h-8 border-2 border-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Ready for Your Prediction?
                </h2>
                <p className="text-blue-200 mb-6">
                  {isSpotifyConnected 
                    ? "Let Spotify's mystical forces choose your day's soundtrack"
                    : "Let the mystical forces choose your day's soundtrack"
                  }
                </p>
              </div>
              
              <button
                onClick={revealSong}
                disabled={isRevealing}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isRevealing ? (isLoadingSong ? 'Searching Spotify...' : 'Channeling Energy...') : 'Reveal My Song'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              {/* Mystical Message */}
              <div className="mb-6">
                <p className="text-yellow-300 italic text-lg mb-4">
                  &quot;{message}&quot;
                </p>
              </div>

              {/* Song Display */}
              <div className={`bg-gradient-to-r ${currentSong.color} rounded-xl p-6 mb-6 transform transition-all duration-500`}>
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{currentSong.title}</h3>
                  <p className="text-lg opacity-90 mb-3">{currentSong.artist}</p>
                  <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                    <span className="text-sm font-medium">Mood: {currentSong.mood}</span>
                  </div>
                  <div className="text-sm opacity-80">
                    Duration: {currentSong.duration}
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="mb-6">
                <EnhancedAudioPlayer song={currentSong} />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={resetPrediction}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Seek Another Prediction
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-300 text-sm">
          <p>✨ Let music guide your soul ✨</p>
        </div>
      </div>
    </div>
  );
}
