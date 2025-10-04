'use client';

import SpotifyWebApi from 'spotify-web-api-js';

// Initialize Spotify API
const spotifyApi = new SpotifyWebApi();

// Mystical song search terms for different moods
const mysticalSearchTerms = {
  "Energizing": ["uplifting electronic", "energetic ambient", "cosmic dance", "spiritual awakening"],
  "Peaceful": ["ambient meditation", "peaceful nature sounds", "calm instrumental", "zen music"],
  "Hopeful": ["inspirational acoustic", "uplifting folk", "positive vibes", "hopeful melodies"],
  "Nostalgic": ["nostalgic indie", "dreamy pop", "melancholic ambient", "retro synth"],
  "Contemplative": ["deep ambient", "contemplative classical", "meditation music", "thoughtful instrumental"],
  "Grounding": ["nature sounds", "earth music", "grounding ambient", "forest meditation"],
  "Passionate": ["emotional electronic", "passionate instrumental", "dramatic ambient", "intense music"],
  "Clarity": ["clear acoustic", "minimalist ambient", "crystal clear music", "pure instrumental"]
};

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; width?: number; height?: number }>;
  };
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  popularity: number;
}

export interface MysticalSong {
  title: string;
  artist: string;
  mood: string;
  color: string;
  duration: string;
  spotifyTrack: SpotifyTrack | null;
  audioUrl: string;
}

// Set access token (you'll need to get this from Spotify)
export const setSpotifyToken = (token: string) => {
  spotifyApi.setAccessToken(token);
};

// Search for mystical songs based on mood
export const searchMysticalSong = async (mood: string): Promise<MysticalSong | null> => {
  try {
    const searchTerms = mysticalSearchTerms[mood as keyof typeof mysticalSearchTerms];
    if (!searchTerms) return null;

    // Try different search terms until we find a good result
    for (const term of searchTerms) {
      const response = await spotifyApi.searchTracks(term, { limit: 20 });
      
      if (response.tracks && response.tracks.items.length > 0) {
        // Filter for tracks with preview URLs and good popularity
        const availableTracks = response.tracks.items.filter(track => 
          track.preview_url && 
          track.popularity > 20 &&
          track.duration_ms > 30000 // At least 30 seconds
        );

        if (availableTracks.length > 0) {
          // Pick a random track from available ones
          const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
          
          return {
            title: randomTrack.name,
            artist: randomTrack.artists[0].name,
            mood: mood,
            color: getMoodColor(mood),
            duration: formatDuration(randomTrack.duration_ms),
            spotifyTrack: randomTrack as SpotifyTrack,
            audioUrl: randomTrack.preview_url || ""
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
};

// Get mood-specific color
const getMoodColor = (mood: string): string => {
  const colorMap: { [key: string]: string } = {
    "Energizing": "from-purple-500 to-blue-500",
    "Peaceful": "from-blue-500 to-indigo-600",
    "Hopeful": "from-yellow-400 to-orange-500",
    "Nostalgic": "from-purple-600 to-pink-500",
    "Contemplative": "from-blue-600 to-teal-500",
    "Grounding": "from-green-500 to-emerald-600",
    "Passionate": "from-red-500 to-yellow-500",
    "Clarity": "from-cyan-400 to-blue-500"
  };
  return colorMap[mood] || "from-purple-500 to-blue-500";
};

// Format duration from milliseconds
const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Get a random mystical song
export const getRandomMysticalSong = async (): Promise<MysticalSong | null> => {
  const moods = Object.keys(mysticalSearchTerms);
  const randomMood = moods[Math.floor(Math.random() * moods.length)];
  return await searchMysticalSong(randomMood);
};

// Fallback songs if Spotify is not available
export const getFallbackSong = (): MysticalSong => {
  const fallbackSongs = [
    { title: "Cosmic Awakening", artist: "Ethereal Beings", mood: "Energizing" },
    { title: "Moonlight Serenade", artist: "Night Spirits", mood: "Peaceful" },
    { title: "Golden Hour Dreams", artist: "Sunset Souls", mood: "Hopeful" },
    { title: "Stardust Memories", artist: "Celestial Choir", mood: "Nostalgic" },
    { title: "Ocean Depths", artist: "Deep Currents", mood: "Contemplative" },
    { title: "Forest Whispers", artist: "Nature's Voice", mood: "Grounding" },
    { title: "Fire Dance", artist: "Flame Keepers", mood: "Passionate" },
    { title: "Crystal Clear", artist: "Healing Hearts", mood: "Clarity" }
  ];

  const randomSong = fallbackSongs[Math.floor(Math.random() * fallbackSongs.length)];
  
  return {
    title: randomSong.title,
    artist: randomSong.artist,
    mood: randomSong.mood,
    color: getMoodColor(randomSong.mood),
    duration: "3:45",
    spotifyTrack: null,
    audioUrl: "" // YouTube will handle audio
  };
};
