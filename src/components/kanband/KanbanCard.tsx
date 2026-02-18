import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar } from "lucide-react";

const KanbanCard = ({ task, index, team, onClick }: any) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(p, s) => (
        <div
          ref={p.innerRef}
          {...p.draggableProps}
          {...p.dragHandleProps}
          onClick={onClick}
          className={`bg-white p-3 rounded-lg border border-slate-200 mb-3 shadow-sm transition-all cursor-pointer ${s.isDragging ? "rotate-2 shadow-xl ring-2 ring-blue-400" : "hover:border-blue-400 hover:shadow-md"}`}
        >
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded mb-2 inline-block ${task.prioritas === "DARURAT" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
            {task.prioritas}
          </span>
          <p className="text-sm font-semibold text-slate-800 mb-3 leading-snug">{task.judul_tugas}</p>
          <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-slate-400">
            <div className="flex items-center gap-1 text-[10px] font-bold">
              <Calendar size={12} /> {task.tgl_selesai}
            </div>
            <div className="w-5 h-5 rounded-full bg-slate-100 text-[8px] flex items-center justify-center font-bold text-slate-500 border border-slate-200 uppercase">
              {team.name[0]}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;