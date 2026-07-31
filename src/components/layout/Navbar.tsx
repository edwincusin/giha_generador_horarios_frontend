import React from "react";
import { BookOpen, Sliders, Calendar, FileText, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: "courses" | "config" | "results" | "detail";
  setActiveTab: (tab: "courses" | "config" | "results" | "detail") => void;
  coursesCount: number;
  hasSelectedSchedule: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  coursesCount,
  hasSelectedSchedule,
}) => {
  return (
    <header className="navbar">
      <div className="brand">
        <Sparkles className="w-6 h-6 text-indigo-400" />
        <span>Generador de Horarios </span>
      </div>

      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materias</span>
          <span className="badge badge-primary">{coursesCount}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "config" ? "active" : ""}`}
          onClick={() => setActiveTab("config")}
        >
          <Sliders className="w-4 h-4" />
          <span>Configuración</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "results" ? "active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          <Calendar className="w-4 h-4" />
          <span>Resultados</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "detail" ? "active" : ""}`}
          onClick={() => setActiveTab("detail")}
        >
          <FileText className="w-4 h-4" />
          <span>Detalle de Horario</span>
          {hasSelectedSchedule && (
            <span
              className="badge badge-success"
              style={{ fontSize: "0.65rem" }}
            >
              Seleccionado
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};
