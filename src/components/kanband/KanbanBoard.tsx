import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Calendar, MoreHorizontal, Plus, X } from "lucide-react";
import KanbanList from "./KanbanList";

interface KanbanBoardProps {
  project: any;
  team: any;
  onDragEnd: (result: any) => void;
  handleOpenTask: (task: any) => void;
  addingToCard: string | null;
  setAddingToCard: (id: string | null) => void;
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  newPriority: string;
 setNewPriority: (priority: "NORMAL" | "DARURAT") => void;
  
  handleQuickAddCard: (listId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = (props) => {
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-5 items-start h-full pb-4">
          {props.project.lists.map((list: any) => (
            <KanbanList 
              key={list.id} 
              list={list} 
              {...props} 
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;