import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, X } from "lucide-react";
import KanbanCard from "./KanbanCard";


const KanbanList = ({ list, team, handleOpenTask, addingToCard, setAddingToCard, newTaskTitle, setNewTaskTitle, newPriority, setNewPriority, handleQuickAddCard }: any) => {
  return (
    <div className="w-72 shrink-0 flex flex-col bg-[#ebedf0] rounded-xl max-h-full border border-slate-200/50 shadow-sm">
      {/* Header List */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 text-sm">{list.nama_list}</span>
          <span className="bg-slate-300 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-black">
            {list.tasks.length}
          </span>
        </div>
        <MoreHorizontal size={16} className="text-slate-400 cursor-pointer" />
      </div>

      {/* Area Droppable */}
      <Droppable droppableId={list.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`px-3 py-1 overflow-y-auto min-h-[50px] transition-colors ${snapshot.isDraggingOver ? "bg-slate-200/60" : ""}`}
          >
            {list.tasks.map((task: any, index: number) => (
              <KanbanCard 
                key={task.id} 
                task={task} 
                index={index} 
                team={team} 
                onClick={() => handleOpenTask(task)} 
              />
            ))}
            {provided.placeholder}

            {/* Form Input Cepat */}
            {addingToCard === list.id && (
              <div className="bg-white p-3 rounded-lg border-2 border-[#1a365d]/30 mb-3 shadow-md">
                <textarea
                  autoFocus
                  placeholder="Judul kartu..."
                  className="w-full text-sm font-semibold text-slate-800 outline-none resize-none mb-2"
                  rows={2}
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <div className="flex items-center gap-2 mt-1 border-t border-slate-100 pt-2">
                  <button
                    onClick={() => setNewPriority("NORMAL")}
                    className={`text-[10px] font-bold px-2 py-1 rounded ${newPriority === "NORMAL" ? "bg-blue-100 text-blue-600 ring-1 ring-blue-400" : "bg-slate-100 text-slate-400"}`}
                  >NORMAL</button>
                  <button
                    onClick={() => setNewPriority("DARURAT")}
                    className={`text-[10px] font-bold px-2 py-1 rounded ${newPriority === "DARURAT" ? "bg-red-100 text-red-600 ring-1 ring-red-400" : "bg-slate-100 text-slate-400"}`}
                  >URGENT 🔥</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Footer List (Tambah Tombol) */}
      <div className="p-2">
        {addingToCard === list.id ? (
          <div className="flex items-center gap-2 px-1 pb-1">
            <button onClick={() => handleQuickAddCard(list.id)} className="bg-[#1a365d] text-white px-3 py-1.5 rounded-md text-[12px] font-bold">Simpan</button>
            <button onClick={() => { setAddingToCard(null); setNewTaskTitle(""); }} className="p-1.5 text-slate-400 hover:text-red-500">
              <X size={18} />
            </button>
          </div>
        ) : (
          <button onClick={() => setAddingToCard(list.id)} className="w-full flex items-center gap-2 p-2 text-slate-500 hover:bg-slate-300/50 rounded-lg text-sm font-semibold transition-all">
            <Plus size={16} /> Tambah kartu
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanList;