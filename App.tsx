import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import { Song, SearchHistoryItem } from './types';
import { FEATURED_SONGS as SONGS } from './constants'; // เราใช้ชื่อ SONGS แทนในไฟล์นี้
import { searchMusicWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  // แก้ไข: เปลี่ยนจาก FEATURED_SONGS เป็น SONGS
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

  // --- ฟังก์ชันสำหรับเปลี่ยนเพลง ---
  const handleNext = () => {
    // แก้ไข: เปลี่ยนจาก FEATURED_SONGS เป็น SONGS
    const songsList = activeTab === 'search' ? searchResults : SONGS;
    const currentIndex = songsList.findIndex(s => s.id === currentSong?.id);
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % songsList.length;
      setCurrentSong(songsList[nextIndex]);
    }
  };

  const handleBack = () => {
    // แก้ไข: เปลี่ยนจาก FEATURED_SONGS เป็น SONGS
    const songsList = activeTab === 'search' ? searchResults : SONGS;
    const currentIndex = songsList.findIndex(s => s.id === currentSong?.id);
    if (currentIndex !== -1) {
      const prevIndex = (currentIndex - 1 + songsList.length) % songsList.length;
      setCurrentSong(songsList[prevIndex]);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setActiveTab('search');
    
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      return [{ query, timestamp: Date.now() }, ...filtered].slice(0, 10);
    });

    const results = await searchMusicWithAI(query);
    // แก้ไข: เปลี่ยนจาก FEATURED_SONGS เป็น SONGS
    setSearchResults(results.length > 0 ? results : SONGS);
    setIsSearching(false);
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
              placeholder="Search Casino 888 Tracks..."
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
          
          {searchHistory.length > 0 && activeTab === 'home' && (
            <section className="animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <i className="fas fa-history text-amber-500"></i> Recently Played
                </h2>
                <button onClick={() => setSearchHistory([])} className="text-xs text-amber-500 hover:underline">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setSearchQuery(item.query); handleSearch(item.query); }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/30 px-3 py-1.5 rounded-lg text-sm transition-all group"
                  >
                    <span className="text-slate-300 group-hover:text-amber-500">{item.query}</span>
                    <i className="fas fa-times text-[10px] text-slate-600 hover:text-red-400" onClick={(e) => { e.stopPropagation(); removeFromHistory(idx); }}></i>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'home' && (
            <section>
              <h2 className="text-3xl font-black italic tracking-tighter mb-8 text-white uppercase flex items-center gap-3">
                <span className="w-1 h-8 bg-amber-500"></span> Hit The Jackpot
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {/* แก้ไข: เปลี่ยนจาก FEATURED_SONGS เป็น SONGS */}
                {SONGS.map((song) => (
                  <div 
                    key={song.id}
                    onClick={() => selectSong(song)}
                    className={`bg-slate-900/50 p-4 rounded-2xl cursor-pointer group transition-all border ${currentSong?.id === song.id ? 'border-amber-500 bg-amber-500/5' : 'border-transparent hover:border-slate-800'}`}
                  >
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl shadow-lg">
                      <img src={song.coverUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={song.title} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <i className={`fas ${currentSong?.id === song.id ? 'fa-volume-up' : 'fa-play'} text-lg`}></i>
                        </div>
                      </div>
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
              <h2 className="text-3xl font-black italic tracking-tighter mb-8 uppercase">
                {isSearching ? 'Spinning...' : `Results for "${searchQuery}"`}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {searchResults.map((song) => (
                  <div 
                    key={song.id}
                    onClick={() => selectSong(song)}
                    className={`bg-slate-900/50 p-4 rounded-2xl cursor-pointer group transition-all border ${currentSong?.id === song.id ? 'border-amber-500' : 'border-transparent hover:border-slate-800'}`}
                  >
                    <div className="relative mb-4 aspect-square overflow-hidden rounded-xl">
                      <img src={song.coverUrl} className="w-full h-full object-cover" alt={song.title} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <i className="fas fa-play text-white text-xl"></i>
                      </div>
                    </div>
                    <div className="text-[10px] text-amber-500 font-bold uppercase mb-1 tracking-widest">{song.genre}</div>
                    <h3 className="font-bold truncate">{song.title}</h3>
                    <p className="text-slate-500 text-sm truncate">{song.artist}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'notes' && currentSong && (
            <section className="animate-in fade-in slide-in-from-right-2 duration-300 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
                <div className="relative group">
                   <img src={currentSong.coverUrl} className="w-64 h-64 rounded-2xl shadow-2xl border-4 border-amber-500/20" alt={currentSong.title} />
                   <div className="absolute -top-3 -right-3 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black shadow-lg">888</div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-4 py-1 bg-amber-500/20 text-amber-500 rounded-full text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
                    {currentSong.genre}
                  </div>
                  <h1 className="text-6xl font-black mb-2 tracking-tighter italic uppercase text-white">{currentSong.title}</h1>
                  <p className="text-2xl text-slate-400 mb-6 font-medium">{currentSong.artist}</p>
                  
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="bg-slate-900 hover:bg-amber-500 hover:text-slate-950 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border border-slate-800"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Return to lobby
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-slate-800/50 px-8 py-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <i className="fas fa-file-lines text-amber-500"></i>
                    <h2 className="font-black uppercase tracking-widest text-[10px]">Score & Performance Data</h2>
                  </div>
                </div>
                <div className="p-10">
                  <pre className="font-mono text-xl text-slate-300 whitespace-pre-wrap leading-relaxed border-l-2 border-amber-500/20 pl-6">
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