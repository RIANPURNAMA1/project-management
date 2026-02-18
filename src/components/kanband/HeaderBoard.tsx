import React from "react";
import { Plus } from "lucide-react";

interface HeaderBoardProps {
  team: {
    name: string;
    color: string;
  };
  project: {
    nama_proyek: string;
  };
  onAddListClick: () => void;
}

const HeaderBoard: React.FC<HeaderBoardProps> = ({ team, project, onAddListClick }) => {
  return (
    <div className="bg-white px-8 py-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
      <div className="flex items-center gap-4">
        {/* Logo/Icon Team */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
          style={{ backgroundColor: team.color }}
        >
          {team.name[0]}
        </div>
        
        {/* Nama Proyek */}
        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">
          {project.nama_proyek}
        </h2>
      </div>

      {/* Tombol Tambah List */}
      <button
        onClick={onAddListClick}
        className="bg-[#1a365d] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-2 hover:bg-[#254a7c] transition-all active:scale-95"
      >
        <Plus size={16} /> Tambah List
      </button>
    </div>
  );
};

export default HeaderBoard;