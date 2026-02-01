
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchMusicWithAI = async (query: string): Promise<Song[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, returning mock results.");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for music related to: "${query}". Return exactly 6 songs. Include title, artist, album, duration, genre, and a "notes" field containing basic chords or lyrics snippets.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              album: { type: Type.STRING },
              duration: { type: Type.STRING },
              genre: { type: Type.STRING },
              notes: { type: Type.STRING, description: "Chords, lyrics, or musical notes for the song" },
            },
            required: ["title", "artist", "album", "duration", "genre", "notes"],
          },
        },
      },
    });

    const jsonStr = response.text.trim();
    const songs: Partial<Song>[] = JSON.parse(jsonStr);
    
    return songs.map((s, idx) => ({
      ...s,
      id: s.id || `ai-${idx}-${Date.now()}`,
      coverUrl: `https://picsum.photos/seed/ai-${idx}-${Date.now()}/400/400`,
    })) as Song[];
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};
