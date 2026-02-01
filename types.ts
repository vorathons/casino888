
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
  genre: string;
  audioUrl: string; // Direct link to the audio file
  notes?: string; // Musical notes, chords, or lyrics
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}
