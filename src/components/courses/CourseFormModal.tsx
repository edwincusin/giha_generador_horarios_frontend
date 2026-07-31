import React, { useState, useEffect } from 'react';
import { Course, CourseFormData } from '../../types/course';
import { X, Plus, Save } from 'lucide-react';
import { formatTimeDisplay } from '../../utils/mathEngine';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CourseFormData, courseId?: number) => Promise<void>;
  courseToEdit?: Course | null;
}

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courseToEdit,
}) => {
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    day: 'Lunes',
    start_time: '08:00',
    end_time: '10:00',
    modality: 'Presencial',
    difficulty: 'Media',
    credits: 3,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        name: courseToEdit.name,
        day: courseToEdit.day,
        start_time: formatTimeDisplay(courseToEdit.start_time),
        end_time: formatTimeDisplay(courseToEdit.end_time),
        modality: courseToEdit.modality,
        difficulty: courseToEdit.difficulty,
        credits: courseToEdit.credits,
      });
    } else {
      setFormData({
        name: '',
        day: 'Lunes',
        start_time: '08:00',
        end_time: '10:00',
        modality: 'Presencial',
        difficulty: 'Media',
        credits: 3,
      });
    }
    setError(null);
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre de la materia es obligatorio.');
      return;
    }
    if (formData.start_time >= formData.end_time) {
      setError('La hora de inicio debe ser menor que la hora de finalización.');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await onSave(formData, courseToEdit?.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la materia');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>
            {courseToEdit ? 'Editar Materia' : 'Registrar Nueva Materia'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', marginBottom: '1rem', padding: '0.65rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre de la Materia</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Programación I, Base de Datos..."
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Día de Impartición</label>
              <select
                className="form-select"
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value })}
              >
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Créditos</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-input"
                value={formData.credits}
                onChange={e => setFormData({ ...formData, credits: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Hora Inicio (HH:mm)</label>
              <input
                type="time"
                className="form-input"
                value={formData.start_time}
                onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hora Fin (HH:mm)</label>
              <input
                type="time"
                className="form-input"
                value={formData.end_time}
                onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Modalidad</label>
              <select
                className="form-select"
                value={formData.modality}
                onChange={e => setFormData({ ...formData, modality: e.target.value })}
              >
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nivel de Dificultad</label>
              <select
                className="form-select"
                value={formData.difficulty}
                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {courseToEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{submitting ? 'Guardando...' : courseToEdit ? 'Actualizar' : 'Crear Materia'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
