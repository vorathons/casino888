import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';

interface PlayerProps {
  currentSong: Song | null;
  onNext?: () => void;
  onBack?: () => void;
}

const Player: React.FC<PlayerProps> = ({ currentSong, onNext, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // เมื่อเปลี่ยนเพลง ให้โหลดไฟล์ใหม่และตั้งค่าเริ่มต้น
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      
      // ถ้าอยากให้เปลี่ยนเพลงแล้วเล่นทันที (Autoplay) ให้เปิด 2 บรรทัดนี้ครับ:
      // audioRef.current.play().catch(e => console.log("Autoplay blocked"));
      // setIsPlaying(true);
    }
  }, [currentSong?.audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!currentSong) return null;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-amber-500/30 p-4 z-50">
      
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={onNext} // เล่นเพลงถัดไปอัตโนมัติเมื่อเพลงจบ
      />

      <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-6">
        {/* Info */}
        <div className="flex items-center gap-4 w-1/4">
          <img src={currentSong.coverUrl} className="w-14 h-14 rounded shadow-2xl border border-white/10" alt="cover" />
          <div className="truncate text-white">
            <h4 className="text-sm font-bold truncate">{currentSong.title}</h4>
            <p className="text-amber-500 text-[10px] uppercase font-black tracking-widest">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-3 max-w-md">
          <div className="flex items-center gap-8">
            {/* ปุ่มย้อนกลับ */}
            <button 
              onClick={onBack}
              className="text-slate-400 hover:text-amber-500 transition-all active:scale-90"
            >
              <i className="fas fa-backward text-xl"></i>
            </button>

            {/* ปุ่ม Play/Pause */}
            <button 
              onClick={togglePlay}
              className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 shadow-lg shadow-amber-500/20 transition-all"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-black text-xl`}></i>
            </button>

            {/* ปุ่มถัดไป */}
            <button 
              onClick={onNext}
              className="text-slate-400 hover:text-amber-500 transition-all active:scale-90"
            >
              <i className="fas fa-forward text-xl"></i>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] text-gray-500 font-mono w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 bg-white/10 h-1 rounded-full relative overflow-hidden group cursor-pointer">
              <div 
                className="bg-amber-500 h-full absolute left-0 top-0 transition-all duration-100" 
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
              {/* ตัวข้ามเวลา (Seek) */}
              <input 
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(e) => {
                  const time = parseFloat(e.target.value);
                  setCurrentTime(time);
                  if (audioRef.current) audioRef.current.currentTime = time;
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[11px] text-gray-500 font-mono w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="w-1/4 flex justify-end items-center gap-3">
          <i className="fas fa-volume-up text-slate-500 text-xs"></i>
          <input 
            type="range" min={0} max={1} step="0.01" 
            value={volume}
            onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setVolume(vol);
                if (audioRef.current) audioRef.current.volume = vol;
            }}
            className="w-20 accent-amber-500 h-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;