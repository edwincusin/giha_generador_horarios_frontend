import React from 'react';
import { GeneratedScheduleItem } from '../../types/schedule';
import { Course } from '../../types/course';
import { ScheduleConfiguration } from '../../types/config';
import { TimetableGrid } from './TimetableGrid';
import { evaluateScheduleDetailed, formatTimeDisplay } from '../../utils/mathEngine';
import { CheckCircle2, XCircle, Clock, BookOpen, AlertTriangle, ArrowLeft } from 'lucide-react';

interface ScheduleDetailViewProps {
  schedule: GeneratedScheduleItem | null;
  allCourses: Course[];
  config: ScheduleConfiguration;
  onBackToResults: () => void;
}

export const ScheduleDetailView: React.FC<ScheduleDetailViewProps> = ({
  schedule,
  allCourses,
  config,
  onBackToResults,
}) => {
  if (!schedule) {
    return (
      <div className="glass-card animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <BookOpen className="w-12 h-12 text-indigo-400" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>Ningún Horario Seleccionado</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Por favor, ve a la Pantalla 3 (Resultados) y selecciona un horario para examinar su detalle completo.
        </p>
        <button className="btn btn-primary" onClick={onBackToResults}>
          <ArrowLeft className="w-4 h-4" /> Volver a Resultados
        </button>
      </div>
    );
  }

  // Resolve course objects
  const resolvedCourses: Course[] = schedule.courseObjects || schedule.courses.map(item => {
    if (typeof item === 'object') return item as Course;
    return (
      allCourses.find(c => c.name === item) || {
        id: 0,
        name: item as string,
        day: 'Lunes',
        start_time: '08:00',
        end_time: '10:00',
        modality: 'Presencial',
        difficulty: 'Media',
        credits: 0,
      }
    );
  });

  const evaluation = evaluateScheduleDetailed(resolvedCourses, config);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={onBackToResults}>
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <h2 style={{ fontSize: '1.4rem' }}>Pantalla 4: Detalle de Horario</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className={`badge ${schedule.valid ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            {schedule.valid ? <CheckCircle2 className="w-4 h-4 inline mr-1" /> : <XCircle className="w-4 h-4 inline mr-1" />}
            Estado: {schedule.valid ? 'VÁLIDO' : 'DESCARTADO'}
          </span>
        </div>
      </div>

      {/* Main Grid Detail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left Column: Weekly Timetable Grid */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Parrilla Horaria Semanal</h3>
          <TimetableGrid courses={resolvedCourses} />
        </div>

        {/* Right Column: PDF Step 37 Required Fields Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card Summary */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Resumen del Horario
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>● Estado:</strong>{' '}
                <span className={`badge ${schedule.valid ? 'badge-success' : 'badge-danger'}`}>
                  {schedule.valid ? 'Válido' : 'Descartado'}
                </span>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)' }}>● Total Créditos:</strong>{' '}
                <span className="badge badge-primary">{schedule.totalCredits} Créditos</span>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)' }}>● Modalidades Presentes:</strong>{' '}
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.2rem' }}>
                  {Array.from(new Set(resolvedCourses.map(c => c.modality))).map(m => (
                    <span key={m} className={`badge ${m.toLowerCase() === 'presencial' ? 'badge-primary' : 'badge-cyan'}`}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--text-muted)' }}>● Nivel de Dificultad:</strong>{' '}
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.2rem' }}>
                  {Array.from(new Set(resolvedCourses.map(c => c.difficulty))).map(d => (
                    <span key={d} className={`badge ${d.toLowerCase() === 'alta' ? 'badge-danger' : 'badge-amber'}`}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Discard Reasons if Invalid */}
          {!schedule.valid && (
            <div className="glass-card" style={{ padding: '1.25rem', borderColor: 'rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.1)' }}>
              <h4 style={{ color: '#fb7185', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                ● Razones de Descarte
              </h4>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#fca5a5', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {(schedule.reasons && schedule.reasons.length > 0 ? schedule.reasons : evaluation.reasons).map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Selected Courses Table (● Materias seleccionadas, Días, Horas, Modalidad, Créditos, Dificultad) */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>● Detalle de Materias Seleccionadas en el Horario</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Materia Seleccionada</th>
                <th>Día</th>
                <th>Horas (Inicio - Fin)</th>
                <th>Modalidad</th>
                <th>Créditos</th>
                <th>Dificultad</th>
              </tr>
            </thead>
            <tbody>
              {resolvedCourses.map((c, idx) => (
                <tr key={idx}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.day}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    <Clock className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
                    {formatTimeDisplay(c.start_time)} - {formatTimeDisplay(c.end_time)}
                  </td>
                  <td>
                    <span className={`badge ${c.modality.toLowerCase() === 'presencial' ? 'badge-primary' : 'badge-cyan'}`}>
                      {c.modality}
                    </span>
                  </td>
                  <td><strong>{c.credits} cr.</strong></td>
                  <td>
                    <span className={`badge ${
                      c.difficulty.toLowerCase() === 'alta'
                        ? 'badge-danger'
                        : c.difficulty.toLowerCase() === 'media'
                        ? 'badge-amber'
                        : 'badge-success'
                    }`}>
                      {c.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
