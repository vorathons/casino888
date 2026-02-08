import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import { Song, SearchHistoryItem } from './types';
import { FEATURED_SONGS as SONGS } from './constants'; 

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentSong, setCurrentSong] = useState<Song | null>(SONGS[0]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('casino888_history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error("History parse failed");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('casino888_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleNext = () => {
    const songsList = activeTab === 'search' ? searchResults : SONGS;
    if (songsList.length === 0) return;
    const currentIndex = songsList.findIndex(s => s.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % songsList.length;
    setCurrentSong(songsList[nextIndex]);
  };

  const handleBack = () => {
    const songsList = activeTab === 'search' ? searchResults : SONGS;
    if (songsList.length === 0) return;
    const currentIndex = songsList.findIndex(s => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + songsList.length) % songsList.length;
    setCurrentSong(songsList[prevIndex]);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setActiveTab('search');
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      return [{ query, timestamp: Date.now() }, ...filtered].slice(0, 10);
    });
    const filteredSongs = SONGS.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase()) || 
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setTimeout(() => {
      setSearchResults(filteredSongs);
      setIsSearching(false);
    }, 400);
  };

  const removeFromHistory = (idx: number) => {
    setSearchHistory(prev => prev.filter((_, i) => i !== idx));
  };

  const selectSong = (song: Song) => {
    setCurrentSong(song);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 pb-32 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-sm p-6 flex items-center justify-between border-b border-slate-900">
          <div className="relative w-full max-w-xl">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input 
              type="text" 
              placeholder="Search in your library..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            />
          </div>
          
          <div className="hidden md:flex items-center gap-4 ml-4">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-amber-500">VIP LISTENER</span>
              <span className="text-sm font-medium text-slate-400">Alex Chen</span>
            </div>
            <img src="https://picsum.photos/seed/user/32/32" className="w-10 h-10 rounded-full border-2 border-amber-500/50" alt="user" />
          </div>
        </header>

        <div className="p-6 md:p-10 space-y-12">
          {activeTab === 'home' && (
            <section>
              <h2 className="text-3xl font-black italic tracking-tighter mb-8 text-white uppercase flex items-center gap-3">
                <span className="w-1 h-8 bg-amber-500"></span> Hit The Jackpot
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {SONGS.map((song) => (
                  <div 
                    key={song.id}
                    onClick={() => selectSong(song)}
                    className={`bg-slate-900/50 p-4 rounded-2xl cursor-pointer group transition-all border ${currentSong?.id === song.id ? 'border-amber-500 bg-amber-500/5' : 'border-transparent hover:border-slate-800'}`}
                  >
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl shadow-lg">
                      <img src={song.coverUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={song.title} />
                    </div>
                    <h3 className="font-bold truncate text-sm text-white">{song.title}</h3>
                    <p className="text-slate-500 text-xs truncate uppercase tracking-widest font-bold">{song.artist}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'search' && (
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-3xl font-black italic tracking-tighter mb-8 uppercase">Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {searchResults.map((song) => (
                  <div key={song.id} onClick={() => selectSong(song)} className="bg-slate-900/50 p-4 rounded-2xl cursor-pointer border border-transparent hover:border-slate-800">
                    <img src={song.coverUrl} className="w-full aspect-square rounded-xl mb-4" alt="" />
                    <h3 className="font-bold truncate text-sm">{song.title}</h3>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'notes' && currentSong && (
            <section className="animate-in fade-in slide-in-from-right-2 duration-300 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
                <img src={currentSong.coverUrl} className="w-64 h-64 rounded-2xl shadow-2xl border-4 border-amber-500/20" alt="" />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-6xl font-black mb-2 tracking-tighter italic uppercase text-white">{currentSong.title}</h1>
                  <p className="text-2xl text-slate-400 mb-6 font-medium">{currentSong.artist}</p>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-10 overflow-x-auto">
                  <pre className="font-mono text-xl text-slate-300 whitespace-pre leading-relaxed border-l-2 border-amber-500/20 pl-6">
                    {currentSong.notes || "No score data available."}
                  </pre>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <Player 
        currentSong={currentSong} 
        onNext={handleNext} 
        onBack={handleBack} 
      />
    </div>
  );
};

export default App;