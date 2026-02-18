import React from "react";
import { Layout, Users, ChevronDown, Search, Bell } from "lucide-react";
import type { Team } from "../types";
import { Avatar } from "./Avatar";

interface NavbarProps {
  teams: Team[];
  selectedId?: number;
  onSelect: (t: Team) => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ teams, selectedId, onSelect, onGoHome }) => (
  <header className="bg-[#1a365d] text-white h-[64px] flex items-center justify-between px-6 shadow-md z-50 shrink-0">
    <div className="flex items-center gap-10">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
          <Layout size={20} className="text-white" />
        </div>
        <span className="font-bold text-[18px] tracking-tight">Mendunia<span className="text-blue-400">.id</span></span>
      </div>

      <nav className="hidden md:flex items-center gap-2">
        <button 
          onClick={onGoHome}
          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${!selectedId ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
        >
          Dashboard
        </button>
        
        <div className="relative group">
          <button className={`px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all ${selectedId ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}>
            <Users size={14} />
            Tim {selectedId && `(${teams.find(t => t.id === selectedId)?.name})`}
            <ChevronDown size={14} className="opacity-50" />
          </button>
          
          <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 hidden group-hover:block text-gray-800">
            {teams.map(t => (
              <button key={t.id} onClick={() => onSelect(t)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-[13px] font-medium">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>

    <div className="flex items-center gap-5">
      <div className="relative hidden sm:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input placeholder="Cari proyek..." className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-[12px] w-40 focus:w-60 outline-none transition-all" />
      </div>
      <Bell size={18} className="text-white/60 cursor-pointer hover:text-white" />
      <div className="flex items-center gap-3 border-l border-white/10 pl-5">
        <Avatar label="AM" bgColor="#10b981" />
      </div>
    </div>
  </header>
);