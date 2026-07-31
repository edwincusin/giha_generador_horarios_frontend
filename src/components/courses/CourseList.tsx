import React, { useState } from 'react';
import { Course, PrerequisiteRelation, CourseFormData } from '../../types/course';
import { Plus, Edit3, Trash2, ShieldCheck, Database, Search, Layers, Clock, Zap } from 'lucide-react';
import { formatTimeDisplay } from '../../utils/mathEngine';
import { CourseFormModal } from './CourseFormModal';
import { PrerequisiteModal } from './PrerequisiteModal';

interface CourseListProps {
  courses: Course[];
  prerequisites: PrerequisiteRelation[];
  onSaveCourse: (data: CourseFormData, id?: number) => Promise<void>;
  onDeleteCourse: (id: number) => Promise<void>;
  onAddPrerequisite: (courseId: number, reqId: number) => Promise<void>;
  onDeletePrerequisite: (courseId: number, reqId: number) => Promise<void>;
  onSeedData: () => Promise<void>;
  loading: boolean;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  prerequisites,
  onSaveCourse,
  onDeleteCourse,
  onAddPrerequisite,
  onDeletePrerequisite,
  onSeedData,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isPrereqModalOpen, setIsPrereqModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.modality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Discrete Math Set properties
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const difficultCoursesCount = courses.filter(c => c.difficulty.toLowerCase() === 'alta').length;
  const virtualCoursesCount = courses.filter(c => c.modality.toLowerCase() === 'virtual').length;
  const presencialCoursesCount = courses.filter(c => c.modality.toLowerCase() === 'presencial').length;

  const handleOpenAdd = () => {
    setCourseToEdit(null);
    setIsCourseModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setCourseToEdit(course);
    setIsCourseModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      {/* Universal Set Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 style={{ fontSize: '1.4rem' }}>Conjunto Universal de Materias <span className="badge badge-primary">U</span></h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Todas las ofertas registradas forman el conjunto universal U = {'{' + courses.map(c => c.name).join(', ') + '}'}. Cardinalidad |U| = {courses.length}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {courses.length === 0 && (
            <button className="btn btn-secondary" onClick={onSeedData} disabled={loading}>
              <Zap className="w-4 h-4 text-amber-400" /> Cargar Materias Ejemplo
            </button>
          )}

          <button className="btn btn-secondary" onClick={() => setIsPrereqModalOpen(true)}>
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Prerrequisitos ({prerequisites.length})
          </button>

          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4" /> Agregar Materia
          </button>
        </div>
      </div>

      {/* Discrete Math Quick Statistics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cardinalidad Total |U|</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4338ca' }}>{courses.length} materias</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Suma Total de Créditos ∑</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>{totalCredits} cr.</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Conjunto Modalidad (M ∪ V)</div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', fontWeight: 600 }}>
            <span className="badge badge-primary">{presencialCoursesCount} Presenciales</span>{' '}
            <span className="badge badge-cyan">{virtualCoursesCount} Virtuales</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Materias Difíciles D</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#be123c' }}>{difficultCoursesCount} de Alta Dificultad</div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <Search className="w-4 h-4" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
          placeholder="Buscar materias por nombre, día o modalidad..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table of Universal Set */}
      {courses.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Database className="w-12 h-12 text-indigo-400" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>El Conjunto Universal está Vacío (U = ∅)</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No hay materias registradas en la base de datos.</p>
          <button className="btn btn-primary" onClick={onSeedData} disabled={loading}>
            <Zap className="w-4 h-4" /> Cargar Datos de Prueba de Ejemplo
          </button>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de la Materia</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Modalidad</th>
                <th>Dificultad</th>
                <th>Créditos</th>
                <th>Prerrequisitos Exigidos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map(course => {
                const reqs = prerequisites.filter(p => p.course_id === course.id);
                return (
                  <tr key={course.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>#{course.id}</td>
                    <td><strong style={{ fontSize: '0.95rem' }}>{course.name}</strong></td>
                    <td>{course.day}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      <Clock className="w-3.5 h-3.5 inline mr-1 text-indigo-400" />
                      {formatTimeDisplay(course.start_time)} - {formatTimeDisplay(course.end_time)}
                    </td>
                    <td>
                      <span className={`badge ${course.modality.toLowerCase() === 'presencial' ? 'badge-primary' : 'badge-cyan'}`}>
                        {course.modality}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        course.difficulty.toLowerCase() === 'alta'
                          ? 'badge-danger'
                          : course.difficulty.toLowerCase() === 'media'
                          ? 'badge-amber'
                          : 'badge-success'
                      }`}>
                        {course.difficulty}
                      </span>
                    </td>
                    <td><strong>{course.credits} cr.</strong></td>
                    <td>
                      {reqs.length === 0 ? (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Ninguno</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {reqs.map(r => {
                            const reqCourse = courses.find(c => c.id === r.prerequisite_course_id);
                            return (
                              <span key={r.prerequisite_course_id} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                                P → {reqCourse?.name || `ID ${r.prerequisite_course_id}`}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(course)}>
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => onDeleteCourse(course.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CourseFormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onSave={onSaveCourse}
        courseToEdit={courseToEdit}
      />

      <PrerequisiteModal
        isOpen={isPrereqModalOpen}
        onClose={() => setIsPrereqModalOpen(false)}
        courses={courses}
        prerequisites={prerequisites}
        onAddPrerequisite={onAddPrerequisite}
        onDeletePrerequisite={onDeletePrerequisite}
      />
    </div>
  );
};
