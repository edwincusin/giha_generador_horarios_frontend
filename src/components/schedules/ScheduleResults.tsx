import React, { useState } from 'react';
import { ScheduleGenerationResponse, GeneratedScheduleItem } from '../../types/schedule';
import { Course } from '../../types/course';
import { ScheduleCard } from './ScheduleCard';
import { CheckCircle2, XCircle, Calculator, Layers, Sparkles, AlertTriangle, ListFilter } from 'lucide-react';

interface ScheduleResultsProps {
  results: ScheduleGenerationResponse | null;
  allCourses: Course[];
  onSelectScheduleForDetail: (schedule: GeneratedScheduleItem) => void;
  onGoToConfig: () => void;
}

export const ScheduleResults: React.FC<ScheduleResultsProps> = ({
  results,
  allCourses,
  onSelectScheduleForDetail,
  onGoToConfig,
}) => {
  const [filter, setFilter] = useState<'valid' | 'discarded' | 'all'>('valid');

  if (!results) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <Calculator className="w-12 h-12 text-indigo-400" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>Pantalla 3: Resultados</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Configura las restricciones deseadas y haz clic en "Generar Horarios" para calcular los resultados.
        </p>
        <button className="btn btn-primary" onClick={onGoToConfig}>
          <Sparkles className="w-4 h-4" /> Ir a la Configuración
        </button>
      </div>
    );
  }

  const validCount = results.validSchedules;
  const discardedCount = results.discardedSchedules;

  // Filter schedules
  const displayedSchedules = results.schedules.filter(s => {
    if (filter === 'valid') return s.valid;
    if (filter === 'discarded') return !s.valid;
    return true;
  });

  return (
    <div className="animate-fade-in">
      {/* Pantalla 3: Header Banner & Exact 5 PDF Metrics Display */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Pantalla 3: Resultados</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Resumen global de combinaciones generadas y clasificación de horarios académicos.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onGoToConfig}>
            Ajustar Configuración
          </button>
        </div>

        {/* The 5 Exact Required Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers className="w-4 h-4 text-indigo-600" /> Materias disponibles:
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4338ca', marginTop: '0.25rem' }}>
              {results.totalCourses}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Materias por horario:</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', marginTop: '0.25rem' }}>
              {results.selectedAmount}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calculator className="w-4 h-4 text-purple-600" /> Combinaciones posibles:
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7e22ce', marginTop: '0.25rem' }}>
              {results.totalCombinations}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1rem', borderColor: '#a7f3d0', background: '#ecfdf5' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Horarios válidos:
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', marginTop: '0.25rem' }}>
              {validCount}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1rem', borderColor: '#fecdd3', background: '#fff1f2' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <XCircle className="w-4 h-4 text-rose-600" /> Horarios descartados:
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#be123c', marginTop: '0.25rem' }}>
              {discardedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="nav-tabs">
          <button
            className={`tab-btn ${filter === 'valid' ? 'active' : ''}`}
            onClick={() => setFilter('valid')}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Horarios Válidos ({validCount})</span>
          </button>

          <button
            className={`tab-btn ${filter === 'discarded' ? 'active' : ''}`}
            onClick={() => setFilter('discarded')}
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Descartados ({discardedCount})</span>
          </button>

          <button
            className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <ListFilter className="w-4 h-4" />
            <span>Todos ({results.schedules.length})</span>
          </button>
        </div>
      </div>

      {/* Schedules List Grid */}
      {displayedSchedules.length === 0 ? (
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <AlertTriangle className="w-10 h-10 text-amber-400" style={{ margin: '0 auto 0.75rem' }} />
          <h3>No hay horarios para mostrar en esta categoría</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Prueba cambiando el filtro o ajustando las restricciones de configuración.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {displayedSchedules.map((schedule, idx) => (
            <ScheduleCard
              key={idx}
              schedule={schedule}
              index={idx}
              allCoursesList={allCourses}
              onSelectSchedule={onSelectScheduleForDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
};
