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
    <>
      {/* --- Desktop Sidebar (โชว์เฉพาะจอใหญ่) --- */}
      <aside className="w-64 bg-slate-950 flex-col hidden md:flex h-screen border-r border-slate-900 sticky top-0">
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
      </aside>

      {/* --- Mobile Bottom Nav (แถบเมนูด้านล่างสุด) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-900 px-2 py-2 flex justify-around items-center z-[60] h-16">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${
              activeTab === item.id ? 'text-amber-500' : 'text-slate-500'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;