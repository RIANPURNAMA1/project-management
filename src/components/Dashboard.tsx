import React, { useState } from "react";
import { Plus, Users, ChevronDown, X, MessageSquare, Send, Bell } from "lucide-react";
import type { Team } from "../types";
import { Avatar } from "./Avatar";

interface DashboardProps {
  teams: Team[];
  onSelect: (t: Team) => void;
  onAdd: (t: Omit<Team, 'id'>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ teams, onSelect, onAdd }) => {
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", desc: "", color: "#1a365d" });
  const [chatInput, setChatInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onAdd({ 
      name: formData.name, 
      description: formData.desc || "Tidak ada deskripsi.", 
      color: formData.color 
    });
    setModal(false);
    setFormData({ name: "", desc: "", color: "#1a365d" });
  };

  const colors = ["#1a365d", "#1e40af", "#059669", "#d97706", "#7c3aed", "#db2777"];

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* KOLOM KIRI: DISKUSI GLOBAL ANGGOTA (SIDEBAR) */}
      <div className="w-full lg:w-80 xl:w-96 bg-white flex flex-col border-r border-slate-200 shadow-sm z-20">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1a365d] text-white rounded-md shadow-md">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="font-black text-slate-800 tracking-tight text-sm">Diskusi Global</h2>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 12 Online
              </p>
            </div>
          </div>
          <Bell size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Chat dari orang lain */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-md bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">AN</div>
            <div className="space-y-1 max-w-[85%]">
              <span className="text-[10px] font-bold text-slate-500 ml-1">Andini Nada</span>
              <div className="bg-slate-100 p-3 rounded-md rounded-tl-none">
                <p className="text-xs text-slate-700 leading-relaxed">
                  Jangan lupa kirim laporan mingguan ya tim! 🚀
                </p>
              </div>
            </div>
          </div>

          {/* Chat dari kita (Dummy) */}
          <div className="flex gap-3 flex-row-reverse text-right">
            <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">ME</div>
            <div className="space-y-1 max-w-[85%]">
              <span className="text-[10px] font-bold text-slate-500 mr-1">Saya</span>
              <div className="bg-blue-600 p-3 rounded-md rounded-tr-none">
                <p className="text-xs text-white leading-relaxed text-left">
                  Siap, sedang saya susun di board proyek.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="relative group">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-blue-400 focus:bg-white transition-all text-xs"
            />
            <button className="absolute right-2 top-1.5 p-2 text-[#1a365d] hover:scale-110 transition-transform">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* KOLOM KANAN: MAIN CONTENT (GRID TIM) */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Tim</h1>
              <p className="text-slate-500 mt-1 text-sm">Kelola kolaborasi antar departemen dengan efisien.</p>
            </div>
            <button 
              onClick={() => setModal(true)} 
              className="bg-[#1a365d] hover:bg-[#254a7c] text-white px-5 py-2.5 rounded-md font-bold text-[13px] flex items-center gap-2 shadow-lg shadow-blue-900/10 transition-all active:scale-95"
            >
              <Plus size={18} /> Tambah Tim
            </button>
          </div>

          {/* Grid Tim */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map((t) => (
              <div 
                key={t.id} 
                onClick={() => onSelect(t)} 
                className="bg-white p-6 rounded-md shadow-sm border border-slate-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div 
                    className="w-12 h-12 rounded-md flex items-center justify-center text-white shadow-inner" 
                    style={{ backgroundColor: t.color }}
                  >
                    <Users size={24} />
                  </div>
                  <div className="flex -space-x-2">
                    <Avatar label="AD" bgColor="#10b981" size="w-7 h-7" />
                    <Avatar label="JD" bgColor="#3b82f6" size="w-7 h-7" />
                    <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400">+5</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-[#1a365d] transition-colors">{t.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">{t.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-[10px] font-black text-[#1a365d] uppercase tracking-widest">Open Board</span>
                  <ChevronDown size={14} className="-rotate-90 text-slate-300 group-hover:text-[#1a365d] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-md p-8 w-full max-w-md shadow-2xl relative border border-white/10">
            <button onClick={() => setModal(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
            <h2 className="text-xl font-black text-slate-800 mb-1">Buat Tim Baru</h2>
            <p className="text-xs text-slate-400 mb-6">Kelompokkan pekerjaan berdasarkan departemen.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Nama Tim" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none text-sm focus:border-blue-400" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <textarea placeholder="Deskripsi tim..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none h-24 text-sm resize-none focus:border-blue-400" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} />
              <div className="flex gap-2">
                {colors.map(c => (
                  <button key={c} type="button" onClick={() => setFormData({...formData, color: c})} className={`w-7 h-7 rounded-md border-2 ${formData.color === c ? 'border-slate-400 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                ))}
              </div>
              <button type="submit" className="w-full py-3 bg-[#1a365d] text-white rounded-md font-bold text-sm mt-4 hover:bg-[#254a7c] transition-all shadow-lg shadow-blue-900/20">Simpan Tim</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};