import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CourseList } from './components/courses/CourseList';
import { ScheduleConfigForm } from './components/configuration/ScheduleConfigForm';
import { ScheduleResults } from './components/schedules/ScheduleResults';
import { ScheduleDetailView } from './components/schedules/ScheduleDetailView';

import { Course, CourseFormData, PrerequisiteRelation } from './types/course';
import { ScheduleConfiguration } from './types/config';
import { ScheduleGenerationResponse, GeneratedScheduleItem } from './types/schedule';

import {
  getCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  getPrerequisitesApi,
  createPrerequisiteApi,
  deletePrerequisiteApi,
  generateSchedulesApi,
} from './services/api';

import { generateLocalSchedules } from './utils/mathEngine';
import { SAMPLE_COURSES } from './utils/seedData';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'config' | 'results' | 'detail'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [prerequisites, setPrerequisites] = useState<PrerequisiteRelation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Selected schedule for Pantalla 4: Detalle de horario
  const [selectedSchedule, setSelectedSchedule] = useState<GeneratedScheduleItem | null>(null);

  // Initial Schedule Configuration
  const [config, setConfig] = useState<ScheduleConfiguration>({
    numberOfCourses: 3,
    maximumCredits: 12,
    maximumDifficultCourses: 2,
    requiredModality: 'Cualquiera',
    avoidTimeConflicts: true,
    validatePrerequisites: true,
    requiredCourses: [],
    completedCourses: [],
  });

  // Results State
  const [results, setResults] = useState<ScheduleGenerationResponse | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load Courses and Prerequisites
  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedCourses, fetchedPrereqs] = await Promise.all([
        getCoursesApi(),
        getPrerequisitesApi(),
      ]);
      setCourses(fetchedCourses);
      setPrerequisites(fetchedPrereqs);
      setBackendOnline(true);
    } catch (err: any) {
      console.warn('Backend API offline or error, running with local mode:', err.message);
      setBackendOnline(false);
      // If local state empty, default to sample data
      if (courses.length === 0) {
        const localCourses: Course[] = SAMPLE_COURSES.map((c, index) => ({
          ...c,
          id: index + 1,
        }));
        setCourses(localCourses);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save/Create Course
  const handleSaveCourse = async (data: CourseFormData, id?: number) => {
    try {
      setLoading(true);
      if (id) {
        if (backendOnline) await updateCourseApi(id, data);
        setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
        showToast('Materia actualizada con éxito.');
      } else {
        if (backendOnline) await createCourseApi(data);
        const newCourse: Course = {
          ...data,
          id: courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1,
        };
        setCourses(prev => [...prev, newCourse]);
        showToast('Materia creada con éxito.');
      }
      if (backendOnline) await loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al guardar la materia.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: number) => {
    try {
      setLoading(true);
      if (backendOnline) await deleteCourseApi(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      setPrerequisites(prev => prev.filter(p => p.course_id !== id && p.prerequisite_course_id !== id));
      showToast('Materia eliminada con éxito.');
    } catch (err: any) {
      showToast(err.message || 'No se pudo eliminar la materia.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add Prerequisite
  const handleAddPrerequisite = async (courseId: number, reqId: number) => {
    try {
      if (backendOnline) await createPrerequisiteApi(courseId, reqId);
      setPrerequisites(prev => [...prev, { course_id: courseId, prerequisite_course_id: reqId }]);
      showToast('Prerrequisito asignado correctamente.');
    } catch (err: any) {
      showToast(err.message || 'Error al agregar prerrequisito.', 'error');
    }
  };

  // Delete Prerequisite
  const handleDeletePrerequisite = async (courseId: number, reqId: number) => {
    try {
      if (backendOnline) await deletePrerequisiteApi(courseId, reqId);
      setPrerequisites(prev => prev.filter(p => !(p.course_id === courseId && p.prerequisite_course_id === reqId)));
      showToast('Prerrequisito eliminado.');
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar prerrequisito.', 'error');
    }
  };

  // Seed Data Button Handler
  const handleSeedData = async () => {
    try {
      setLoading(true);
      for (const courseData of SAMPLE_COURSES) {
        if (backendOnline) {
          try {
            await createCourseApi(courseData);
          } catch {
            // Ignore if already exists
          }
        }
      }
      showToast('Materias de prueba cargadas con éxito.');
      await loadData();
    } catch {
      showToast('Cargadas materias de ejemplo localmente.');
      const localCourses: Course[] = SAMPLE_COURSES.map((c, idx) => ({ ...c, id: idx + 1 }));
      setCourses(localCourses);
    } finally {
      setLoading(false);
    }
  };

  // Generate Schedules Handler
  const handleGenerateSchedules = async () => {
    try {
      setLoading(true);
      let response: ScheduleGenerationResponse;

      if (backendOnline) {
        try {
          response = await generateSchedulesApi(config);
        } catch (apiErr: any) {
          console.warn('API Error, using fallback local generator:', apiErr.message);
          response = generateLocalSchedules(courses, config, prerequisites);
        }
      } else {
        response = generateLocalSchedules(courses, config, prerequisites);
      }

      setResults(response);
      if (response.schedules && response.schedules.length > 0) {
        setSelectedSchedule(response.schedules[0]);
      }
      setActiveTab('results');

      if (response.validSchedules > 0) {
        showToast(`¡Éxito! Se encontraron ${response.validSchedules} horarios válidos.`);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        showToast('Generación completada: 0 horarios válidos (Revisa las razones de descarte).', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error al generar horarios.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Select a schedule and navigate to Pantalla 4: Detalle de Horario
  const handleSelectScheduleForDetail = (schedule: GeneratedScheduleItem) => {
    setSelectedSchedule(schedule);
    setActiveTab('detail');
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        coursesCount={courses.length}
        hasSelectedSchedule={!!selectedSchedule}
      />

      {/* Backend Connection Indicator Toast */}
      {!backendOnline && (
        <div className="glass-card" style={{ padding: '0.65rem 1rem', marginBottom: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24' }}>
            <AlertCircle className="w-4 h-4" />
            <span>Modo Local / Servidor Backend no detectado en http://localhost:3000. Los cálculos de Matemáticas Discretas se ejecutan localmente en el cliente.</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
            <RefreshCw className="w-3.5 h-3.5" /> Reintentar Backend
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`badge ${toast.type === 'success' ? 'badge-success' : 'badge-danger'} animate-fade-in`}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
            padding: '0.85rem 1.25rem',
            fontSize: '0.9rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Screen Views (Exactly 4 Screens as specified in PDF) */}
      <main>
        {activeTab === 'courses' && (
          <CourseList
            courses={courses}
            prerequisites={prerequisites}
            onSaveCourse={handleSaveCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddPrerequisite={handleAddPrerequisite}
            onDeletePrerequisite={handleDeletePrerequisite}
            onSeedData={handleSeedData}
            loading={loading}
          />
        )}

        {activeTab === 'config' && (
          <ScheduleConfigForm
            courses={courses}
            config={config}
            onChangeConfig={setConfig}
            onGenerate={handleGenerateSchedules}
            loading={loading}
          />
        )}

        {activeTab === 'results' && (
          <ScheduleResults
            results={results}
            allCourses={courses}
            onSelectScheduleForDetail={handleSelectScheduleForDetail}
            onGoToConfig={() => setActiveTab('config')}
          />
        )}

        {activeTab === 'detail' && (
          <ScheduleDetailView
            schedule={selectedSchedule}
            allCourses={courses}
            config={config}
            onBackToResults={() => setActiveTab('results')}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};
