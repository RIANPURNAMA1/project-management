export interface Task {
  id: string;
  judul_tugas: string;
  prioritas: "NORMAL" | "DARURAT"; // <-- Perhatikan kata di sini
  tgl_selesai?: string;
  deskripsi: string;
}

export interface List {
  id: string;
  nama_list: string;
  tasks: Task[];
}

export interface Team {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface Project {
  nama_proyek: string;
  lists: List[];
}