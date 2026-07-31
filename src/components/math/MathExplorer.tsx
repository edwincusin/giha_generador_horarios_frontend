import React, { useState } from 'react';
import { Course } from '../../types/course';
import { factorial, combinationCount, permutationCount, setUnion, setIntersection, setDifference } from '../../utils/mathEngine';
import { Binary, Layers, Calculator, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface MathExplorerProps {
  courses: Course[];
}

export const MathExplorer: React.FC<MathExplorerProps> = ({ courses }) => {
  const [activeSection, setActiveSection] = useState<'sets' | 'logic' | 'combinatorics'>('sets');

  // Interactive Combinatorics state
  const [nVal, setNVal] = useState<number>(Math.max(4, courses.length));
  const [rVal, setRVal] = useState<number>(3);

  // Interactive Logic Truth Table state
  const [pVal, setPVal] = useState<boolean>(true);
  const [qVal, setQVal] = useState<boolean>(false);

  // Set Theory calculations with real courses
  const courseNames = courses.map(c => c.name);
  const presencialSet = new Set(courses.filter(c => c.modality.toLowerCase() === 'presencial').map(c => c.name));
  const virtualSet = new Set(courses.filter(c => c.modality.toLowerCase() === 'virtual').map(c => c.name));
  const difficultSet = new Set(courses.filter(c => c.difficulty.toLowerCase() === 'alta').map(c => c.name));

  const unionPV = setUnion(presencialSet, virtualSet);
  const intersectionDV = setIntersection(difficultSet, virtualSet);
  const diffPV = setDifference(presencialSet, virtualSet);

  const cCount = combinationCount(nVal, rVal);
  const pCount = permutationCount(nVal, rVal);

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Binary className="w-6 h-6 text-indigo-400" />
          <h2 style={{ fontSize: '1.4rem' }}>Laboratorio Interactivo de Matemáticas Discretas</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Explora y visualiza cómo la Teoría de Conjuntos, el Álgebra Proposicional y la Combinatoria fundamentan el sistema de generación de horarios académicos.
        </p>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="nav-tabs" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
        <button
          className={`tab-btn ${activeSection === 'sets' ? 'active' : ''}`}
          onClick={() => setActiveSection('sets')}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>1. Teoría de Conjuntos</span>
        </button>

        <button
          className={`tab-btn ${activeSection === 'logic' ? 'active' : ''}`}
          onClick={() => setActiveSection('logic')}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>2. Álgebra Proposicional</span>
        </button>

        <button
          className={`tab-btn ${activeSection === 'combinatorics' ? 'active' : ''}`}
          onClick={() => setActiveSection('combinatorics')}
        >
          <Calculator className="w-4 h-4 text-purple-400" />
          <span>3. Combinatoria</span>
        </button>
      </div>

      {/* Section 1: Set Theory */}
      {activeSection === 'sets' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers className="w-5 h-5 text-indigo-400" />
              Conjunto Universal U y Subconjuntos
            </h3>

            <div className="math-box" style={{ marginBottom: '1rem' }}>
              <strong>Conjunto Universal U:</strong>
              <div style={{ wordBreak: 'break-word', marginTop: '0.35rem', color: '#818cf8' }}>
                U = {'{' + courseNames.join(', ') + '}'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                Cardinalidad |U| = {courseNames.length}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: '#818cf8' }}>Pertenencia (∈):</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Si $x \in U$, la materia $x$ pertenece al catálogo disponible. Para obligatorias: $x \in O \implies x \in H$.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: '#38bdf8' }}>Subconjunto (⊆):</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Un horario generado $H$ es un subconjunto válido de materias disponibles ($H \subseteq U$) con $|H| = r$.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Operaciones entre Conjuntos en Tiempo Real</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Union */}
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: '#818cf8' }}>Unión (M ∪ V): Materias Presenciales O Virtuales</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.35rem', color: '#c7d2fe' }}>
                  M ∪ V = {'{' + [...unionPV].join(', ') + '}'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Cardinalidad |M ∪ V| = {unionPV.size}
                </div>
              </div>

              {/* Intersection */}
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: '#22d3ee' }}>Intersección (D ∩ V): Materias Difíciles Y Virtuales</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.35rem', color: '#cffaff' }}>
                  D ∩ V = {'{' + ([...intersectionDV].length > 0 ? [...intersectionDV].join(', ') : '∅ (Conjunto Vacío)') + '}'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Cardinalidad |D ∩ V| = {intersectionDV.size}
                </div>
              </div>

              {/* Difference */}
              <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: '#c084fc' }}>Diferencia (P - V): Solo Presenciales (No Virtuales)</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.35rem', color: '#f3e8ff' }}>
                  P - V = {'{' + [...diffPV].join(', ') + '}'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  Cardinalidad |P - V| = {diffPV.size}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Propositional Logic */}
      {activeSection === 'logic' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Álgebra Proposicional y Reglas de Negocio
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Cada condición del sistema se formaliza como una proposición lógica cuyo valor de verdad es un booleano (verdadero o falso).
            </p>

            <div className="math-box" style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              <strong>Expresión Proposicional Principal del Sistema:</strong>
              <div style={{ marginTop: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '1.1rem' }}>
                V(Horario) = T ∧ O ∧ C ∧ M ∧ D ∧ R ∧ U
              </div>
            </div>

            {/* Interactive Truth Table Generator */}
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Simulador de Operadores Lógicos Dinámico:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="toggle-group">
                <span>Proposición P (ej: "No tiene cruces")</span>
                <button
                  type="button"
                  className={`btn btn-sm ${pVal ? 'btn-primary' : 'btn-danger'}`}
                  onClick={() => setPVal(!pVal)}
                >
                  P = {pVal ? 'V (true)' : 'F (false)'}
                </button>
              </div>

              <div className="toggle-group">
                <span>Proposición Q (ej: "Tiene obligatorias")</span>
                <button
                  type="button"
                  className={`btn btn-sm ${qVal ? 'btn-primary' : 'btn-danger'}`}
                  onClick={() => setQVal(!qVal)}
                >
                  Q = {qVal ? 'V (true)' : 'F (false)'}
                </button>
              </div>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Operador Lógico</th>
                    <th>Notación Matemática</th>
                    <th>Fórmula Evaluada</th>
                    <th>Resultado Lógico</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Conjunción (AND)</strong></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>P ∧ Q</td>
                    <td>{pVal ? 'V' : 'F'} ∧ {qVal ? 'V' : 'F'}</td>
                    <td>
                      <span className={`badge ${pVal && qVal ? 'badge-success' : 'badge-danger'}`}>
                        {pVal && qVal ? 'V (true)' : 'F (false)'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Disyunción (OR)</strong></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>P ∨ Q</td>
                    <td>{pVal ? 'V' : 'F'} ∨ {qVal ? 'V' : 'F'}</td>
                    <td>
                      <span className={`badge ${pVal || qVal ? 'badge-success' : 'badge-danger'}`}>
                        {pVal || qVal ? 'V (true)' : 'F (false)'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Negación (NOT)</strong></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>¬P</td>
                    <td>¬({pVal ? 'V' : 'F'})</td>
                    <td>
                      <span className={`badge ${!pVal ? 'badge-success' : 'badge-danger'}`}>
                        {!pVal ? 'V (true)' : 'F (false)'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Implicación (Prerrequisitos)</strong></td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>P → Q (¬P ∨ Q)</td>
                    <td>{pVal ? 'V' : 'F'} → {qVal ? 'V' : 'F'}</td>
                    <td>
                      <span className={`badge ${!pVal || qVal ? 'badge-success' : 'badge-danger'}`}>
                        {!pVal || qVal ? 'V (true)' : 'F (false)'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Combinatorics */}
      {activeSection === 'combinatorics' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator className="w-5 h-5 text-purple-400" />
              Calculadora de Combinaciones C(n,r) vs Permutaciones P(n,r)
            </h3>

            <div className="form-group">
              <label className="form-label">Total de Materias en el Conjunto Universal (n)</label>
              <input
                type="number"
                min="1"
                max="12"
                className="form-input"
                value={nVal}
                onChange={e => setNVal(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Materias a Seleccionar por Horario (r)</label>
              <input
                type="number"
                min="1"
                max={nVal}
                className="form-input"
                value={rVal}
                onChange={e => setRVal(Number(e.target.value))}
              />
            </div>

            <div className="math-box" style={{ marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Desglose Factorial:</div>
              <div style={{ marginTop: '0.35rem' }}>n! = {nVal}! = <strong>{factorial(nVal).toLocaleString()}</strong></div>
              <div>r! = {rVal}! = <strong>{factorial(rVal).toLocaleString()}</strong></div>
              <div>(n - r)! = ({nVal} - {rVal})! = <strong>{factorial(nVal - rVal).toLocaleString()}</strong></div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Comparativa del Principio de Conteo</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-card" style={{ padding: '1rem', borderColor: 'rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#c084fc' }}>Combinaciones C({nVal},{rVal})</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>EL ORDEN NO IMPORTA</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                    {cCount.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                  Se utilizan combinaciones porque {'{A, B, C}'} representa la misma carga horaria que {'{C, A, B}'}.
                </div>
              </div>

              <div className="glass-card" style={{ padding: '1rem', borderColor: 'rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#fbbf24' }}>Permutaciones P({nVal},{rVal})</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>EL ORDEN SÍ IMPORTA</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
                    {pCount.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                  Las permutaciones generarían {pCount - cCount} horarios redundantes duplicados.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
