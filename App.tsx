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
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-screen overflow-y-auto pb-64 md:pb-32">
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-sm p-4 md:p-6 flex items-center justify-between border-b border-slate-900">
          <div className="relative w-full max-w-xl">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
            <input 
              type="text" 
              placeholder="Search..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 md:py-3 pl-10 md:pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-xs md:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            />
          </div>
        </header>

        <div className="p-4 md:p-10">
          {activeTab === 'home' && (
            <section className="animate-in fade-in duration-500">
              <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-8 text-white uppercase flex items-center gap-3">
                <span className="w-1 h-6 md:h-8 bg-amber-500"></span> Hit The Jackpot
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                {SONGS.map((song) => (
                  <div 
                    key={song.id}
                    onClick={() => selectSong(song)}
                    className={`bg-slate-900/50 p-3 md:p-4 rounded-2xl cursor-pointer group transition-all border ${currentSong?.id === song.id ? 'border-amber-500 bg-amber-500/5' : 'border-transparent hover:border-slate-800'}`}
                  >
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-xl">
                      <img src={song.coverUrl} className="w-full h-full object-cover" alt={song.title} />
                    </div>
                    <h3 className="font-bold truncate text-xs md:text-sm text-white">{song.title}</h3>
                    <p className="text-slate-500 text-[10px] truncate uppercase font-bold">{song.artist}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'search' && (
             <section className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-2xl font-black mb-8 uppercase italic">Results</h2>
                <div className="grid grid-cols-2 gap-4">
                  {searchResults.map(song => (
                    <div key={song.id} onClick={() => selectSong(song)} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                      <img src={song.coverUrl} className="w-full aspect-square rounded-lg mb-2" alt="" />
                      <h3 className="font-bold text-xs truncate">{song.title}</h3>
                    </div>
                  ))}
                </div>
             </section>
          )}

          {activeTab === 'notes' && currentSong && (
            <section className="animate-in fade-in slide-in-from-right-2 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                <img src={currentSong.coverUrl} className="w-40 h-40 md:w-64 md:h-64 rounded-xl shadow-2xl" alt="" />
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-6xl font-black text-white italic uppercase leading-none">{currentSong.title}</h1>
                  <p className="text-lg md:text-2xl text-slate-400 mt-2">{currentSong.artist}</p>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-20">
                <div className="p-5 md:p-10 overflow-x-auto">
                  <pre className="font-mono text-xs md:text-lg text-slate-300 whitespace-pre leading-relaxed border-l-2 border-amber-500/20 pl-4">
                    {currentSong.notes || "No score data available."}
                  </pre>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* แถบเครื่องเล่นเพลง ขยับขึ้นมาจาก Bottom Nav เล็กน้อยเพื่อไม่ให้ทับกัน */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50">
        <Player 
          currentSong={currentSong} 
          onNext={handleNext} 
          onBack={handleBack} 
        />
      </div>
    </div>
  );
};

export default App;