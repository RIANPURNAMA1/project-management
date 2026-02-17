import { useState } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  type DropResult 
} from '@hello-pangea/dnd';
import { 
  Layout, 
  UserPlus, 
  Filter, 
  Settings, 
  MoreHorizontal, 
  Plus, 
  Clock, 
  X 
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- Types & Interfaces ---
interface Task {
  id: string; // Harus string untuk dnd
  judul_tugas: string;
  prioritas: 'DARURAT' | 'NORMAL';
  tgl_selesai_tugas?: string;
}

interface ProjectList {
  id: string; // Harus string untuk dnd
  nama_list: string;
  tasks: Task[];
}

interface Project {
  id: number;
  nama_proyek: string;
  lists: ProjectList[];
}

function App() {
  // --- States ---
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  
  const [project, setProject] = useState<Project>({
    id: 1,
    nama_proyek: "Task Management Mendunia.id",
    lists: [
      {
        id: "list-101",
        nama_list: "To Do",
        tasks: [
          { id: "task-1", judul_tugas: "Setup Vite Project", prioritas: "NORMAL", tgl_selesai_tugas: "2026-02-20" },
          { id: "task-2", judul_tugas: "Fixing Auth Bug", prioritas: "DARURAT" }
        ]
      },
      {
        id: "list-102",
        nama_list: "In Progress",
        tasks: []
      }
    ]
  });

  // --- Handlers ---
  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    const newList: ProjectList = {
      id: `list-${Date.now()}`,
      nama_list: newListTitle,
      tasks: []
    };

    setProject({ ...project, lists: [...project.lists, newList] });
    setNewListTitle('');
    setIsAddingList(false);

    Swal.fire({
      icon: 'success',
      title: 'Daftar ditambahkan',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceListIndex = project.lists.findIndex(l => l.id === source.droppableId);
    const destListIndex = project.lists.findIndex(l => l.id === destination.droppableId);

    const newLists = [...project.lists];
    
    // Ambil task yang sedang digeser
    const sourceTasks = [...newLists[sourceListIndex].tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceListIndex === destListIndex) {
      // Geser di dalam list yang sama
      sourceTasks.splice(destination.index, 0, movedTask);
      newLists[sourceListIndex].tasks = sourceTasks;
    } else {
      // Pindah ke list yang berbeda
      const destTasks = [...newLists[destListIndex].tasks];
      destTasks.splice(destination.index, 0, movedTask);
      newLists[sourceListIndex].tasks = sourceTasks;
      newLists[destListIndex].tasks = destTasks;
    }

    setProject({ ...project, lists: newLists });
  };

  return (
    <div className="h-screen flex flex-col bg-[#003e62] font-sans overflow-hidden text-slate-800">
      
      {/* Header */}
      <header className="px-6 py-3 bg-black/20 backdrop-blur-md flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-white/20 pr-6">
            <Layout className="w-5 h-5 text-white" />
            <h1 className="text-lg font-bold text-white tracking-tight">{project.nama_proyek}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((u) => (
                <div key={u} className="w-8 h-8 rounded-full border-2 border-[#003e62] bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                  U{u}
                </div>
              ))}
            </div>
            <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1">
              <UserPlus className="w-3 h-3" /> Undang
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white">
          <button className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded text-xs font-semibold hover:bg-white/30 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <div className="h-6 w-[1px] bg-white/20"></div>
          <Settings className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" />
        </div>
      </header>

      {/* Board Area */}
      <DragDropContext onDragEnd={onDragEnd}>
        <main className="flex-1 overflow-x-auto p-4 custom-scrollbar">
          <div className="flex items-start gap-3 h-full inline-flex min-w-full">
            
            {project.lists.map((list) => (
              <div key={list.id} className="w-[272px] shrink-0 flex flex-col bg-[#f1f2f4] rounded-xl shadow-md max-h-full overflow-hidden">
                <div className="p-3 pb-2 flex items-center justify-between">
                  <h3 className="px-2 font-bold text-slate-700 text-[13px] tracking-wide">{list.nama_list}</h3>
                  <button className="hover:bg-slate-200 p-1 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={list.id}>
                  {(provided) => (
                    <div 
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[10px] custom-scrollbar"
                    >
                      {list.tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-3 rounded-lg shadow-sm border-b-2 border-slate-300 hover:bg-slate-50 transition-all group ${
                                snapshot.isDragging ? 'rotate-3 scale-105 shadow-2xl' : ''
                              }`}
                            >
                              <div className="flex flex-wrap gap-1 mb-2">
                                <span className={`h-2 w-10 rounded-full ${task.prioritas === 'DARURAT' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                              </div>
                              <h4 className="text-[14px] text-slate-800 leading-snug mb-2 font-medium">{task.judul_tugas}</h4>
                              
                              <div className="flex items-center justify-between mt-3 text-slate-400">
                                <div className="flex items-center gap-2">
                                  {task.tgl_selesai_tugas && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                      <Clock className="w-3 h-3" />
                                      {task.tgl_selesai_tugas}
                                    </div>
                                  )}
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold group-hover:bg-[#0067a3] group-hover:text-white transition-colors">
                                  JD
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <div className="p-2">
                  <button className="w-full flex items-center gap-2 px-2 py-2 text-slate-600 hover:bg-slate-300/50 hover:text-slate-800 rounded-lg transition-all text-[13px] font-semibold">
                    <Plus className="w-4 h-4" /> Tambah kartu
                  </button>
                </div>
              </div>
            ))}

            {/* Form List Baru */}
            <div className="w-[272px] shrink-0">
              {!isAddingList ? (
                <button 
                  onClick={() => setIsAddingList(true)}
                  className="w-full flex items-center gap-2 px-3 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white font-bold text-sm transition-all text-left"
                >
                  <Plus className="w-5 h-5" /> Tambah daftar lain
                </button>
              ) : (
                <form onSubmit={handleAddList} className="bg-[#f1f2f4] rounded-xl p-2 shadow-lg animate-in fade-in zoom-in duration-200">
                  <input 
                    autoFocus
                    type="text" 
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    placeholder="Masukkan judul daftar..." 
                    className="w-full px-3 py-2 text-sm rounded-md border-2 border-[#0067a3] focus:outline-none mb-2 shadow-inner"
                  />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="bg-[#0067a3] text-white px-4 py-1.5 rounded font-bold text-xs hover:bg-blue-700 transition-colors">
                      Simpan
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsAddingList(false)}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </main>
      </DragDropContext>
    </div>
  );
}

export default App;