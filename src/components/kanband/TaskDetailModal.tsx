import React, { useState } from "react";
import { X, MoreHorizontal, Save, Calendar, AlignLeft, MessageSquare, UserCheck, Send } from "lucide-react";

interface TaskDetailModalProps {
  isOpen: boolean;
  selectedTask: any;
  onClose: () => void;
  onSave: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  selectedTask,
  onClose,
  onSave,
}) => {
  const [comment, setComment] = useState("");

  if (!isOpen || !selectedTask) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-[#1c1c1e] text-slate-300 rounded-md w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl border border-white/5 transition-all">
        
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-1 h-8 rounded-full ${selectedTask.prioritas === "DARURAT" ? "bg-red-500" : "bg-blue-500"}`} />
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{selectedTask.judul_tugas}</h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Task Details</span>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/5 p-2 rounded-md text-slate-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* KOLOM KIRI: Editor & Komentar */}
          <div className="lg:col-span-3 space-y-8">
            {/* Section Deskripsi */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <AlignLeft size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Description</h3>
              </div>
              <div className="bg-[#252527] rounded-md border border-white/5 p-6 min-h-[300px] shadow-inner prose prose-invert max-w-none prose-sm">
                <div id="editorjs-container" className="editor-js-override" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={onSave} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2">
                  <Save size={14} /> Simpan Deskripsi
                </button>
              </div>
            </section>

            {/* Section Komentar */}
            <section className="pt-6 border-t border-white/5">
              <div className="flex items-center gap-2 mb-6 text-slate-400">
                <MessageSquare size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Komentar</h3>
              </div>

              {/* List Komentar (DUMMY) */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center text-xs font-bold text-white shrink-0">RP</div>
                  <div className="bg-[#252527] p-3 rounded-md border border-white/5 flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-white">Rian Purnama</span>
                      <span className="text-[10px] text-slate-500">2 jam yang lalu</span>
                    </div>
                    <p className="text-sm text-slate-400">Tolong cek bagian tabel harganya ya, sepertinya ada yang salah input.</p>
                  </div>
                </div>
              </div>

              {/* Input Komentar */}
              <div className="flex gap-3 bg-[#252527] p-3 rounded-md border border-white/5">
                <input 
                  type="text"
                  placeholder="Tulis komentar..."
                  className="bg-transparent border-none outline-none flex-1 text-sm text-white"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="text-blue-500 hover:text-blue-400 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </section>
          </div>

          {/* KOLOM KANAN: Sidebar Info & Reviewer */}
          <div className="space-y-6">
            <section>
              <h4 className="text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest">Metadata</h4>
              <div className="space-y-2">
                <div className="bg-[#252527] p-3 rounded-md border border-white/5">
                  <p className="text-[10px] text-slate-500 mb-1 uppercase font-bold text-slate-500">Tenggat Waktu</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Calendar size={14} className="text-blue-400" /> {selectedTask.tgl_selesai}
                  </div>
                </div>
              </div>
            </section>

            {/* Section Reviewer */}
            <section className="pt-4">
              <h4 className="text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2">
                <UserCheck size={14} /> Reviewer
              </h4>
              <div className="bg-[#252527] p-3 rounded-md border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">AD</div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">Admin Project</p>
                    <p className="text-[10px] text-green-500 font-medium">Sudah Direview</p>
                  </div>
                </div>
                <button className="w-full mt-3 py-2 border border-white/10 hover:bg-white/5 rounded-md text-[10px] font-bold uppercase transition-all">
                  Minta Review
                </button>
              </div>
            </section>

            <section className="pt-6 border-t border-white/5">
              <h4 className="text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest">Aksi Cepat</h4>
              <div className="grid grid-cols-1 gap-2">
                 <button className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-all flex items-center gap-2">
                  <X size={14} /> Hapus Tugas
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;