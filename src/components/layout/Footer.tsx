import React from 'react';
import { Sigma, Code, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      marginTop: '4rem',
      padding: '2rem 1.5rem',
      borderTop: '1px solid var(--border-color)',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.85rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Sigma className="w-4 h-4 text-indigo-400" /> Teoría de Conjuntos & Lógica
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Code className="w-4 h-4 text-cyan-400" /> React + Express API
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Database className="w-4 h-4 text-emerald-400" /> PostgreSQL / Prisma
        </span>
      </div>
      <p>© {new Date().getFullYear()} Generador Inteligente de Horarios Académicos. Proyecto de Matemáticas Discretas.</p>
    </footer>
  );
};
