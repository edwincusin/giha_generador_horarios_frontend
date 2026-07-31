import React, { useState } from 'react';
import { Course, PrerequisiteRelation } from '../../types/course';
import { X, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

interface PrerequisiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  prerequisites: PrerequisiteRelation[];
  onAddPrerequisite: (courseId: number, reqId: number) => Promise<void>;
  onDeletePrerequisite: (courseId: number, reqId: number) => Promise<void>;
}

export const PrerequisiteModal: React.FC<PrerequisiteModalProps> = ({
  isOpen,
  onClose,
  courses,
  prerequisites,
  onAddPrerequisite,
  onDeletePrerequisite,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<number>(courses[0]?.id || 0);
  const [selectedPrereqId, setSelectedPrereqId] = useState<number>(courses[1]?.id || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!selectedCourseId || !selectedPrereqId) {
      setError('Debes seleccionar ambas materias.');
      return;
    }
    if (selectedCourseId === selectedPrereqId) {
      setError('Una materia no puede ser su propio prerrequisito.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onAddPrerequisite(selectedCourseId, selectedPrereqId);
    } catch (err: any) {
      setError(err.message || 'Error al agregar prerrequisito');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cId: number, pId: number) => {
    try {
      setLoading(true);
      setError(null);
      await onDeletePrerequisite(cId, pId);
    } catch (err: any) {
      setError(err.message || 'Error al eliminar prerrequisito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            Asignación de Prerrequisitos <span className="badge badge-primary">P → Q</span>
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

        <div className="math-box" style={{ marginBottom: '1.25rem' }}>
          <strong>Lógica Proposicional:</strong> Si la materia <em>P</em> es seleccionada, entonces el estudiante debe incluir o haber aprobado la materia prerrequisito <em>Q</em>.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <label className="form-label">Materia Principal (P)</label>
            <select
              className="form-select"
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(Number(e.target.value))}
            >
              <option value={0}>-- Seleccionar --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>
              ))}
            </select>
          </div>

          <ArrowRight className="w-5 h-5 text-indigo-400" style={{ marginTop: '1.25rem' }} />

          <div>
            <label className="form-label">Exige Prerrequisito (Q)</label>
            <select
              className="form-select"
              value={selectedPrereqId}
              onChange={e => setSelectedPrereqId(Number(e.target.value))}
            >
              <option value={0}>-- Seleccionar --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleAdd}
            disabled={loading}
            style={{ marginTop: '1.25rem' }}
          >
            <Plus className="w-4 h-4" /> Asignar
          </button>
        </div>

        <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Relaciones Registradas ({prerequisites.length})</h4>

        {prerequisites.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic' }}>No existen relaciones de prerrequisito configuradas.</p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Materia Exigente (P)</th>
                  <th>Prerrequisito Requerido (Q)</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {prerequisites.map(p => {
                  const courseName = courses.find(c => c.id === p.course_id)?.name || `ID ${p.course_id}`;
                  const prereqName = courses.find(c => c.id === p.prerequisite_course_id)?.name || `ID ${p.prerequisite_course_id}`;
                  return (
                    <tr key={`${p.course_id}-${p.prerequisite_course_id}`}>
                      <td><strong>{courseName}</strong></td>
                      <td><span className="badge badge-cyan">{prereqName}</span></td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p.course_id, p.prerequisite_course_id)}
                          disabled={loading}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};
