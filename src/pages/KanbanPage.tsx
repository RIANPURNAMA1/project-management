import React, { useState, useEffect, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Plus, MoreHorizontal, Calendar, X, Save, Trash2 } from "lucide-react";
import type { Team, Project, Task } from "../types";

// 1. Import Editor.js core dan Full Tools
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import CodeTool from "@editorjs/code";
import ImageTool from "@editorjs/image";
// @ts-ignore
import LinkTool from "@editorjs/link";
// @ts-ignore
import Embed from "@editorjs/embed";
// @ts-ignore
import Marker from "@editorjs/marker";
// @ts-ignore
import InlineCode from "@editorjs/inline-code";
// @ts-ignore
import EditorJsTable from "@editorjs/table";
import HeaderBoard from "../components/kanband/HeaderBoard";
import KanbanBoard from "../components/kanband/KanbanBoard";
import TaskDetailModal from "../components/kanband/TaskDetailModal";
import AddListModal from "../components/kanband/AddListModal";


export const KanbanPage: React.FC<{ team: Team }> = ({ team }) => {
  // --- STATE UTAMA ---
  const [project, setProject] = useState<Project>({
    nama_proyek: `${team.name} Sprint Board`,
    lists: [
      {
        id: "l1",
        nama_list: "To Do",
        tasks: [
          {
            id: "t1",
            judul_tugas: "Update UI Navbar",
            prioritas: "NORMAL",
            tgl_selesai: "18 Feb",
            deskripsi: "", // Akan berisi string JSON dari Editor.js
          },
        ],
      },
      { id: "l2", nama_list: "In Progress", tasks: [] },
      { id: "l3", nama_list: "Done", tasks: [] },
    ],
  });

  // --- UI STATE ---
  const [addingToCard, setAddingToCard] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"NORMAL" | "DARURAT">(
    "NORMAL",
  );
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const editorInstance = useRef<EditorJS | null>(null);

  const initEditor = (initialData: string) => {
    // 1. Bersihkan instance lama untuk mencegah duplikasi editor di dalam DOM
    if (editorInstance.current) {
      if (typeof editorInstance.current.destroy === "function") {
        editorInstance.current.destroy();
      }
      editorInstance.current = null;
    }

    // 2. Parse data awal dari database (JSON string -> Object)
    let parsedData = { blocks: [] };
    try {
      if (initialData && initialData.trim() !== "") {
        parsedData = JSON.parse(initialData);
      }
    } catch (e) {
      console.error("Gagal parse data Editor.js:", e);
    }

    // 3. Inisialisasi EditorJS
    const editor = new EditorJS({
      holder: "editorjs-container", // ID elemen di HTML
      data: parsedData,
      placeholder:
        'Ketik "/" untuk memilih fitur (Gambar, Tabel, Kode, dll)...',
      autofocus: true,

      tools: {
        // --- BLOCK TOOLS ---
        header: {
          class: Header as any,
          inlineToolbar: ["link"],
          config: {
            placeholder: "Masukkan judul...",
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },

        list: {
          class: List,
          inlineToolbar: true,
          config: { defaultStyle: "unordered" },
        },

        table: {
          class: EditorJsTable as any,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3,
          },
        },

        code: {
          class: CodeTool,
          config: { placeholder: "Paste atau tulis kode program di sini..." },
        },

        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "http://localhost:8000/api/uploadFile", // Endpoint Laravel Upload
              byUrl: "http://localhost:8000/api/fetchUrl", // Endpoint Laravel Fetch URL
            },
            additionalRequestHeaders: {
              Accept: "application/json",
              // Jika pakai Bearer Token, tambahkan di sini:
              // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          },
        },

        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "http://localhost:8000/api/fetchUrl", // Backend Laravel Scraper
          },
        },

        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              vimeo: true,
              instagram: true,
              twitter: true,
              facebook: true,
            },
          },
        },

        // --- INLINE TOOLS (Muncul saat teks diblok) ---
        marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },

        inlineCode: {
          class: InlineCode,
          shortcut: "CMD+SHIFT+C",
        },
      },

      // Callback saat ada perubahan (Opsional, jika ingin auto-save)
      onChange: async () => {
        // console.log('Ada perubahan konten...');
      },
    });

    editorInstance.current = editor;
  };
  // Trigger init saat modal dibuka
  useEffect(() => {
    if (isTaskModalOpen && selectedTask) {
      // Timeout kecil untuk memastikan elemen DOM 'editorjs-container' sudah render
      const timer = setTimeout(() => {
        initEditor(selectedTask.deskripsi || "");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTaskModalOpen, selectedTask?.id]);

  const handleSaveDescription = async () => {
    if (!editorInstance.current || !selectedTask) return;

    try {
      const outputData = await editorInstance.current.save();
      const jsonString = JSON.stringify(outputData);

      // Update state project secara lokal
      const updatedLists = project.lists.map((list) => ({
        ...list,
        tasks: list.tasks.map((t) =>
          t.id === selectedTask.id ? { ...t, deskripsi: jsonString } : t,
        ),
      }));

      setProject({ ...project, lists: updatedLists });
      alert("Deskripsi berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan deskripsi:", error);
    }
  };

  // --- KANBAN HANDLERS ---
  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const newList = {
      id: `l-${Date.now()}`,
      nama_list: newListName,
      tasks: [],
    };
    setProject({ ...project, lists: [...project.lists, newList] });
    setNewListName("");
    setIsListModalOpen(false);
  };

  const handleQuickAddCard = (listId: string) => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `t-${Date.now()}`,
      judul_tugas: newTaskTitle,
      prioritas: newPriority,
      tgl_selesai: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }),
      deskripsi: "",
    };
    const newLists = project.lists.map((list) => {
      if (list.id === listId)
        return { ...list, tasks: [...list.tasks, newTask] };
      return list;
    });
    setProject({ ...project, lists: newLists });
    setNewTaskTitle("");
    setNewPriority("NORMAL");
    setAddingToCard(null);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    const newLists = [...project.lists];
    const sourceList = newLists.find((l) => l.id === source.droppableId);
    const destList = newLists.find((l) => l.id === destination.droppableId);
    if (sourceList && destList) {
      const [movedTask] = sourceList.tasks.splice(source.index, 1);
      destList.tasks.splice(destination.index, 0, movedTask);
      setProject({ ...project, lists: newLists });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f1f5f9] overflow-hidden font-sans">
      {/* HEADER BOARD */}
      <HeaderBoard
        team={team}
        project={project}
        onAddListClick={() => setIsListModalOpen(true)}
      />

      {/* AREA KANBAN */}
      {/* AREA KANBAN YANG SUDAH DIPISAH */}
      <KanbanBoard
        project={project}
        team={team}
        onDragEnd={onDragEnd}
        handleOpenTask={handleOpenTask}
        addingToCard={addingToCard}
        setAddingToCard={setAddingToCard}
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newPriority={newPriority}
        setNewPriority={setNewPriority}
        handleQuickAddCard={handleQuickAddCard}
      />

      {/* MODAL DETAIL TUGAS (EDITOR.JS INTEGRATED) */}
      {/* Ganti blok modal lama dengan ini */}
      <TaskDetailModal
        isOpen={isTaskModalOpen}
        selectedTask={selectedTask}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveDescription} // Fungsi simpan yang sudah kamu buat
      />

      {/* MODAL TAMBAH LIST */}
      {/* Gunakan Komponen Modal di sini */}
      <AddListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSubmit={handleAddList}
        newListName={newListName}
        setNewListName={setNewListName}
      />

      {/* CSS Override untuk Editor.js agar terlihat bagus di dark mode */}
      <style>{`
        .ce-block__content, .ce-toolbar__content { max-width: 100% !important; }
        .ce-toolbar__plus, .ce-toolbar__settings-btn { color: #9ca3af !important; background-color: #374151 !important; }
        .ce-popover { background: #1f2937 !important; border: 1px solid #374151 !important; }
        .ce-popover__item-label { color: #e5e7eb !important; }
        .ce-popover__item:hover { background: #374151 !important; }
        .cdx-block { color: #e5e7eb !important; }
        .ce-header { color: white !important; }
        .ce-paragraph[data-placeholder]:empty::before { color: #6b7280 !important; }
      `}</style>
    </div>
  );
};
