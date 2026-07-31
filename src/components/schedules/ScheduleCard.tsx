import React from 'react';
import { GeneratedScheduleItem } from '../../types/schedule';
import { Course } from '../../types/course';
import { CheckCircle2, XCircle, Clock, BookOpen, Eye } from 'lucide-react';
import { formatTimeDisplay } from '../../utils/mathEngine';

interface ScheduleCardProps {
  schedule: GeneratedScheduleItem;
  index: number;
  allCoursesList: Course[];
  onSelectSchedule: (schedule: GeneratedScheduleItem) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  index,
  allCoursesList,
  onSelectSchedule,
}) => {
  // Resolve full course objects if available, or map by name
  const resolvedCourses: Course[] = schedule.courseObjects || schedule.courses.map(item => {
    if (typeof item === 'object') return item as Course;
    const found = allCoursesList.find(c => c.name === item);
    return found || {
      id: 0,
      name: item as string,
      day: 'N/A',
      start_time: '00:00',
      end_time: '00:00',
      modality: 'N/A',
      difficulty: 'Media',
      credits: 0,
    };
  });

  return (
    <div className={`glass-card glass-card-interactive`} style={{
      padding: '1.25rem',
      borderColor: schedule.valid ? '#a7f3d0' : '#fecdd3',
      background: schedule.valid ? '#ffffff' : '#fff8f8'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {schedule.valid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400" />
          )}
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem' }}>
            Horario #{index + 1}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span className="badge badge-primary">{schedule.totalCredits} Créditos</span>
          <span className={`badge ${schedule.valid ? 'badge-success' : 'badge-danger'}`}>
            {schedule.valid ? 'VÁLIDO (V = true)' : 'DESCARTADO'}
          </span>
        </div>
      </div>

      {/* Course Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {resolvedCourses.map((c, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0.75rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <strong>{c.name}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>{c.day}</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                <Clock className="w-3 h-3 inline mr-1" />
                {formatTimeDisplay(c.start_time)}-{formatTimeDisplay(c.end_time)}
              </span>
              <span className={`badge ${c.modality.toLowerCase() === 'presencial' ? 'badge-primary' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                {c.modality}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Discard Reasons if invalid */}
      {!schedule.valid && schedule.reasons && schedule.reasons.length > 0 && (
        <div style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          marginBottom: '1rem'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#be123c', marginBottom: '0.35rem' }}>
            Razones de Descarte (Proposiciones Falsas):
          </div>
          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#9f1239' }}>
            {schedule.reasons.map((r, ri) => (
              <li key={ri}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Button */}
      <button
        className="btn btn-secondary btn-sm"
        style={{ width: '100%' }}
        onClick={() => onSelectSchedule(schedule)}
      >
        <Eye className="w-4 h-4 text-indigo-400" /> Ver Parrilla Semanal & Evaluación Lógica
      </button>
    </div>
  );
};
