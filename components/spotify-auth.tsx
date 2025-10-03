'use client';

import { useState, useEffect, useCallback } from 'react';
import { setSpotifyToken } from '@/lib/spotify-service';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'your_client_id_here';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}` : '';

export const SpotifyAuth = ({ onAuthSuccess }: { onAuthSuccess: (token: string) => void }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const exchangeCodeForToken = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      // In a real app, you'd exchange the code for a token on your backend
      // For demo purposes, we'll use a mock token
      const mockToken = 'mock_token_' + Date.now();
      localStorage.setItem('spotify_token', mockToken);
      setSpotifyToken(mockToken);
      setIsAuthenticated(true);
      onAuthSuccess(mockToken);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onAuthSuccess]);

  useEffect(() => {
    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken) {
      setSpotifyToken(storedToken);
      setIsAuthenticated(true);
      onAuthSuccess(storedToken);
    }

    // Check for authorization code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    
    if (authCode && !isAuthenticated) {
      exchangeCodeForToken(authCode);
    }
  }, [isAuthenticated, exchangeCodeForToken, onAuthSuccess]);

  const handleLogin = () => {
    const scopes = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
    
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    setIsAuthenticated(false);
    setSpotifyToken('');
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-green-300 text-sm">Connecting to Spotify...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm font-medium">Connected to Spotify</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-green-300 hover:text-white text-xs underline"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
      <div className="text-center">
        <div className="mb-3">
          <svg className="w-8 h-8 text-green-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <h3 className="text-green-300 font-semibold mb-1">Connect to Spotify</h3>
          <p className="text-green-200 text-sm mb-4">
            Get real mystical tracks from Spotify for your predictions
          </p>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Connect Spotify
        </button>
        
        <p className="text-green-200 text-xs mt-3 opacity-80">
          Demo mode: Uses mock authentication
        </p>
      </div>
    </div>
  );
};
