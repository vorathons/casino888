import React from 'react';
import { Logo } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', icon: 'fa-house', label: 'Home' },
    { id: 'search', icon: 'fa-magnifying-glass', label: 'Search' },
    { id: 'notes', icon: 'fa-file-lines', label: 'Song Notes' },
  ];

  return (
    // ลบคำว่า hidden ออกเพื่อให้ Sidebar แสดงผลตลอดเวลาเหมือนใน iPad
    <aside className="w-64 bg-slate-950 flex flex-col h-screen border-r border-slate-900 sticky top-0">
      <div className="p-8">
        <Logo />
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="font-bold uppercase tracking-tight text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 text-slate-600 text-[10px] text-center border-t border-slate-900 font-bold tracking-widest uppercase">
        &copy; 2024 CASINO 888
      </div>
    </aside>
  );
};

export default Sidebar;