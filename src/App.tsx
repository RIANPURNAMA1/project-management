import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import type { Team } from "./types";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { KanbanPage } from "./pages/KanbanPage";


// Komponen Wrapper untuk Kanban agar bisa mengambil ID dari URL
const KanbanWrapper: React.FC<{ teams: Team[] }> = ({ teams }) => {
  const { teamId } = useParams();
  const team = teams.find((t) => t.id === Number(teamId));

  if (!team) return <Navigate replace to="/" />; // Jika ID tidak ditemukan, balik ke home

  return <KanbanPage team={team} />;
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: "Developer", description: "Fokus pada pengembangan aplikasi.", color: "#1e40af" },
    { id: 2, name: "Marketing", description: "Strategi konten media sosial.", color: "#059669" },
  ]);

  // Fungsi navigasi
  const handleSelectTeam = (team: Team | null) => {
    if (team) {
      navigate(`/team/${team.id}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white font-sans overflow-hidden">
      {/* Navbar sekarang menggunakan navigasi route */}
      <Navbar 
        teams={teams} 
        onSelect={handleSelectTeam} 
        onGoHome={() => navigate("/")} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          {/* Halaman Dashboard */}
          <Route 
            path="/" 
            element={
              <Dashboard 
                teams={teams} 
                onSelect={handleSelectTeam} 
                onAdd={(t) => setTeams([...teams, { ...t, id: Date.now() }])} 
              />
            } 
          />

          {/* Halaman Kanban Berdasarkan ID Tim */}
          <Route 
            path="/team/:teamId" 
            element={<KanbanWrapper teams={teams} />} 
          />

          {/* Fallback jika route tidak dikenal */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

// App harus dibungkus oleh Router
const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;