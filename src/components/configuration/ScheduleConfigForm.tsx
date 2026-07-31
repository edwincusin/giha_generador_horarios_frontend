import React, { useState } from 'react';
import { Course } from '../../types/course';
import { ScheduleConfiguration } from '../../types/config';
import { combinationCount, permutationCount } from '../../utils/mathEngine';
import { Sliders, CheckSquare, Zap, Calculator, ShieldAlert, Sparkles } from 'lucide-react';

interface ScheduleConfigFormProps {
  courses: Course[];
  config: ScheduleConfiguration;
  onChangeConfig: (newConfig: ScheduleConfiguration) => void;
  onGenerate: () => void;
  loading: boolean;
}

export const ScheduleConfigForm: React.FC<ScheduleConfigFormProps> = ({
  courses,
  config,
  onChangeConfig,
  onGenerate,
  loading,
}) => {
  const n = courses.length;
  const r = config.numberOfCourses;

  const totalCombinations = combinationCount(n, r);
  const totalPermutations = permutationCount(n, r);

  const isInvalidR = r > n || r <= 0;

  const handleRequiredCourseToggle = (courseName: string) => {
    const exists = config.requiredCourses.includes(courseName);
    const updated = exists
      ? config.requiredCourses.filter(c => c !== courseName)
      : [...config.requiredCourses, courseName];
    onChangeConfig({ ...config, requiredCourses: updated });
  };

  const handleCompletedCourseToggle = (courseName: string) => {
    const exists = config.completedCourses.includes(courseName);
    const updated = exists
      ? config.completedCourses.filter(c => c !== courseName)
      : [...config.completedCourses, courseName];
    onChangeConfig({ ...config, completedCourses: updated });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem' }}>
      {/* Form Area */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h2 style={{ fontSize: '1.4rem' }}>Configuración de Restricciones del Horario</h2>
        </div>

        {/* Dynamic Warning if r > n */}
        {isInvalidR && (
          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', borderColor: '#fecdd3', background: '#fff1f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#be123c', fontWeight: 600 }}>
              <ShieldAlert className="w-5 h-5" />
              <span>Proposición Falsa: Cantidad de materias no factible (r &gt; n)</span>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
              No existen suficientes materias en el conjunto universal ($|U| = {n}$) para seleccionar {r} materias. Ajusta $r \le {n}$.
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Number of courses (r) */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cantidad de Materias por Horario (r)</span>
              <span className="badge badge-primary">{r} materias</span>
            </label>
            <input
              type="number"
              min="1"
              max={Math.max(1, n)}
              className="form-input"
              value={r}
              onChange={e => onChangeConfig({ ...config, numberOfCourses: Number(e.target.value) })}
            />
          </div>

          {/* Maximum credits */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Límite Máximo de Créditos (∑)</span>
              <span className="badge badge-cyan">{config.maximumCredits} cr.</span>
            </label>
            <input
              type="number"
              min="1"
              max="30"
              className="form-input"
              value={config.maximumCredits}
              onChange={e => onChangeConfig({ ...config, maximumCredits: Number(e.target.value) })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* Maximum Difficult Courses */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Máximo de Materias Difíciles (Alta)</span>
              <span className="badge badge-danger">Máx: {config.maximumDifficultCourses}</span>
            </label>
            <input
              type="number"
              min="0"
              max="10"
              className="form-input"
              value={config.maximumDifficultCourses}
              onChange={e => onChangeConfig({ ...config, maximumDifficultCourses: Number(e.target.value) })}
            />
          </div>

          {/* Required Modality */}
          <div className="form-group">
            <label className="form-label">Modalidad Requerida (P ∨ V)</label>
            <select
              className="form-select"
              value={config.requiredModality}
              onChange={e => onChangeConfig({ ...config, requiredModality: e.target.value as any })}
            >
              <option value="Cualquiera">Cualquiera (Sin Restricción)</option>
              <option value="Presencial">Al menos una Presencial</option>
              <option value="Virtual">Al menos una Virtual</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="toggle-group">
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Evitar Cruces de Horario</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proposición ¬P (Sin solapamientos)</div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={config.avoidTimeConflicts ?? true}
                onChange={e => onChangeConfig({ ...config, avoidTimeConflicts: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="toggle-group">
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Validar Prerrequisitos</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Implicación Lógica (P → Q)</div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={config.validatePrerequisites ?? true}
                onChange={e => onChangeConfig({ ...config, validatePrerequisites: e.target.checked })}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Required Courses (Subconjunto Obligatorio O ⊆ H) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Materias Obligatorias Requeridas <span className="badge badge-primary">O ⊆ H</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {courses.map(c => {
              const selected = config.requiredCourses.includes(c.name);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleRequiredCourseToggle(c.name)}
                  className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem' }}
                >
                  <CheckSquare className={`w-3.5 h-3.5 ${selected ? 'text-white' : 'text-gray-500'}`} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Completed Courses (Materias Aprobadas Previamente) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Materias Ya Aprobadas Previamente <span className="badge badge-cyan">C</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {courses.map(c => {
              const selected = config.completedCourses.includes(c.name);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCompletedCourseToggle(c.name)}
                  className={`btn btn-sm ${selected ? 'btn-secondary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '0.8rem',
                    background: selected ? 'rgba(6, 182, 212, 0.2)' : undefined,
                    borderColor: selected ? '#06b6d4' : undefined,
                    color: selected ? '#22d3ee' : undefined
                  }}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem' }}
          onClick={onGenerate}
          disabled={loading || isInvalidR}
        >
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          <span>{loading ? 'Calculando combinaciones...' : 'Generar Horarios Válidos con Matemáticas Discretas'}</span>
        </button>
      </div>

      {/* Math Calculator Side Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Calculator className="w-5 h-5 text-purple-400" />
            <h3 style={{ fontSize: '1.1rem' }}>Cálculo Combinatorio C(n,r)</h3>
          </div>

          <div className="math-box" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Fórmula de Combinaciones</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7e22ce' }}>
              C({n}, {r}) = {n}! / ({r}! × ({n} - {r})!)
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', color: '#312e81' }}>
              {isInvalidR ? 0 : totalCombinations.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>combinaciones posibles a evaluar</div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <strong>¿Por qué Combinaciones y no Permutaciones?</strong>
            <p style={{ marginTop: '0.35rem' }}>
              En un horario académico, la selección de materias {'{A, B, C}'} es idéntica a {'{C, B, A}'}. El orden no altera la selección. Las permutaciones P({n},{r}) = {isInvalidR ? 0 : totalPermutations.toLocaleString()} generarían duplicados innecesarios.
            </p>
          </div>
        </div>

        {/* Logic Proposition Checklist */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>Regla Lógica Compuesta:</h4>
          <div className="math-box" style={{ fontSize: '0.8rem', wordBreak: 'break-word' }}>
            V = T ∧ O ∧ C ∧ M ∧ D ∧ R ∧ U
          </div>

          <ul style={{ listStyle: 'none', fontSize: '0.8rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <li><strong className="text-indigo-400">T:</strong> |H| = {r} materias.</li>
            <li><strong className="text-cyan-400">O:</strong> Contiene materias obligatorias.</li>
            <li><strong className="text-emerald-400">C:</strong> Sin cruces (¬P).</li>
            <li><strong className="text-purple-400">M:</strong> Modalidad = {config.requiredModality}.</li>
            <li><strong className="text-rose-400">D:</strong> Difíciles ≤ {config.maximumDifficultCourses}.</li>
            <li><strong className="text-amber-400">R:</strong> Créditos ≤ {config.maximumCredits}.</li>
            <li><strong className="text-blue-400">U:</strong> Cumple prerrequisitos (P → Q).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
