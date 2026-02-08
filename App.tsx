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
      
      {/* แก้ไข flex-1 และเพิ่ม h-full เพื่อให้ scroll ได้ปกติทั้งคอมและมือถือ */}
      <main className="flex-1 h-full overflow-y-auto pb-40 md:pb-32">
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
          
          {/* ส่วน User Profile แสดงเฉพาะจอใหญ่เพื่อลดความแออัดในมือถือ */}
          <div className="hidden sm:flex items-center gap-4 ml-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-amber-500 tracking-tighter">VIP LISTENER</span>
              <span className="text-xs font-medium text-slate-400">Alex Chen</span>
            </div>
            <img src="https://picsum.photos/seed/user/32/32" className="w-8 h-8 rounded-full border border-amber-500/50" alt="user" />
          </div>
        </header>

        <div className="p-4 md:p-10 space-y-8 md:space-y-12">
          
          {/* --- หน้าแรก (Home) --- */}
          {activeTab === 'home' && (
            <>
              {searchHistory.length > 0 && (
                <section className="animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <i className="fas fa-history text-amber-500"></i> Recently Searched
                    </h2>
                    <button onClick={() => setSearchHistory([])} className="text-[10px] text-amber-500 hover:underline font-bold uppercase">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setSearchQuery(item.query); handleSearch(item.query); }}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 px-3 py-1 rounded-lg text-xs transition-all group"
                      >
                        <span className="text-slate-400 group-hover:text-amber-500">{item.query}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-6 text-white uppercase flex items-center gap-3">
                  <span className="w-1 h-6 md:h-8 bg-amber-500"></span> Hit The Jackpot
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                  {SONGS.map((song) => (
                    <div 
                      key={song.id}
                      onClick={() => selectSong(song)}
                      className={`bg-slate-900/50 p-3 md:p-4 rounded-2xl cursor-pointer group transition-all border ${currentSong?.id === song.id ? 'border-amber-500 bg-amber-500/5' : 'border-transparent hover:border-slate-800'}`}
                    >
                      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl shadow-lg">
                        <img src={song.coverUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={song.title} />
                      </div>
                      <h3 className="font-bold truncate text-xs md:text-sm text-white">{song.title}</h3>
                      <p className="text-slate-500 text-[10px] truncate uppercase tracking-widest font-bold">{song.artist}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* --- หน้าค้นหา (Search) --- */}
          {activeTab === 'search' && (
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-8 uppercase">
                {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
              </h2>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                  {searchResults.map((song) => (
                    <div 
                      key={song.id}
                      onClick={() => selectSong(song)}
                      className={`bg-slate-900/50 p-3 md:p-4 rounded-2xl cursor-pointer group transition-all border ${currentSong?.id === song.id ? 'border-amber-500' : 'border-transparent hover:border-slate-800'}`}
                    >
                      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl">
                        <img src={song.coverUrl} className="w-full h-full object-cover" alt={song.title} />
                      </div>
                      <div className="text-[9px] text-amber-500 font-bold uppercase mb-1 tracking-widest">{song.genre}</div>
                      <h3 className="font-bold truncate text-xs">{song.title}</h3>
                      <p className="text-slate-500 text-[10px] truncate">{song.artist}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                  <p className="text-slate-500 text-sm italic">No tracks found in the lobby.</p>
                </div>
              )}
            </section>
          )}

          {/* --- หน้าเนื้อเพลง (Song Notes) --- */}
          {activeTab === 'notes' && currentSong && (
            <section className="animate-in fade-in slide-in-from-right-2 duration-300 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start mb-8 md:mb-12">
                <img src={currentSong.coverUrl} className="w-48 h-48 md:w-64 md:h-64 rounded-2xl shadow-2xl border-2 border-amber-500/20" alt={currentSong.title} />
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-[9px] font-black mb-3 uppercase tracking-widest">
                    {currentSong.genre}
                  </div>
                  <h1 className="text-3xl md:text-6xl font-black mb-1 tracking-tighter italic uppercase text-white leading-none">{currentSong.title}</h1>
                  <p className="text-lg md:text-2xl text-slate-400 mb-6 font-medium">{currentSong.artist}</p>
                  <button onClick={() => setActiveTab('home')} className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 px-6 py-2 md:px-8 md:py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-slate-800">
                    <i className="fas fa-arrow-left mr-2"></i> Back
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mb-20">
                <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 flex items-center gap-2">
                  <i className="fas fa-file-lines text-amber-500 text-xs"></i>
                  <h2 className="font-black uppercase tracking-widest text-[9px] text-slate-300">Score & Lyrics</h2>
                </div>
                <div className="p-5 md:p-10 overflow-x-auto">
                  <pre className="font-mono text-sm md:text-lg text-slate-300 whitespace-pre leading-relaxed border-l-2 border-amber-500/20 pl-4 md:pl-6">
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