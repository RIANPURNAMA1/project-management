import React from "react";
import { X } from "lucide-react";

interface AddListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newListName: string;
  setNewListName: (value: string) => void;
}

const AddListModal: React.FC<AddListModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newListName,
  setNewListName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
      <div className="bg-white rounded-md w-full max-w-sm shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">Tambah List</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            autoFocus
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-[#1a365d] transition-all font-bold text-sm text-slate-800"
            placeholder="Nama list baru (contoh: Testing)..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#1a365d] text-white rounded-md font-bold shadow-lg hover:bg-[#254a7c] transition-all active:scale-95"
          >
            Buat List Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListModal;