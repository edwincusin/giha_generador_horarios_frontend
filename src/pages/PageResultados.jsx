import { useLocation, useNavigate } from "react-router-dom";

// Traduce cada campo de configuración a su letra lógica y su descripción,
// para armar la ecuación P ∧ Q ∧ R ∧ ... dinámicamente (Paso 18)
const RULE_DEFINITIONS = [
    { letter: "T", label: "Tiene la cantidad correcta de materias" },
    { letter: "O", label: "Incluye las materias obligatorias" },
    { letter: "C", label: "No tiene cruces de horario" },
    { letter: "M", label: "Cumple la modalidad requerida" },
    { letter: "D", label: "Cumple el máximo de materias difíciles" },
    { letter: "R", label: "No supera el máximo de créditos" },
    { letter: "P", label: "Cumple los prerrequisitos" },
];

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const result = location.state?.result;
    const configuration = location.state?.configuration;

    // Si alguien llega a /resultados sin haber generado nada antes
    // (ej: recargó la página), no hay "state" — lo manejamos con cuidado.
    if (!result) {
        return (
            <div className="page">
                <div className="container">
                    <header className="page-header">
                        <h1 className="page-title">Resultados</h1>
                    </header>
                    <p className="empty-state">
                        Todavía no has generado ningún horario.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate("/configuracion")}>
                        Ir a configuración
                    </button>
                </div>
            </div>
        );
    }

    const {
        totalCourses,
        selectedAmount,
        totalCombinations,
        validSchedules,
        discardedSchedules,
        schedules,
    } = result;

    const validList = schedules.filter((s) => s.valid);
    const discardedList = schedules.filter((s) => !s.valid);

    // Arma dinámicamente la ecuación lógica según lo que el usuario activó
    const activeRules = RULE_DEFINITIONS.filter((rule) => {
        if (rule.letter === "M" && configuration?.requiredModality === "Cualquiera") return false;
        if (rule.letter === "C" && !configuration?.avoidTimeConflicts) return false;
        if (rule.letter === "P" && !configuration?.validatePrerequisites) return false;
        if (rule.letter === "O" && (configuration?.requiredCourses?.length ?? 0) === 0) return false;
        return true;
    });

    return (
        <div className="page">
            <div className="container">
                <header className="page-header">
                    <span className="eyebrow">Paso 4</span>
                    <h1 className="page-title">Resultados</h1>
                    <p className="page-subtitle">
                        Horarios generados a partir de las materias y reglas configuradas.
                    </p>
                </header>

                {/* ========================================== */}
                {/* PASO 18: mostrar los conceptos matemáticos  */}
                {/* ========================================== */}
                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Cálculo combinatorio</h2>
                        <p className="panel-hint">
                            Combinatoria: cuántos grupos distintos de materias son posibles, sin importar el orden.
                        </p>

                        <div className="course-grid">
                            <div className="prereq-item">
                                <span>Materias disponibles</span>
                                <strong className="cell-mono">{totalCourses}</strong>
                            </div>
                            <div className="prereq-item">
                                <span>Materias por horario</span>
                                <strong className="cell-mono">{selectedAmount}</strong>
                            </div>
                            <div className="prereq-item">
                                <span>Combinaciones posibles</span>
                                <strong className="cell-mono">
                                    C({totalCourses},{selectedAmount}) = {totalCombinations}
                                </strong>
                            </div>
                            <div className="prereq-item">
                                <span>Horarios válidos</span>
                                <strong className="cell-mono badge-baja">{validSchedules}</strong>
                            </div>
                            <div className="prereq-item">
                                <span>Horarios descartados</span>
                                <strong className="cell-mono" style={{ color: "var(--danger)" }}>
                                    {discardedSchedules}
                                </strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Regla lógica aplicada</h2>
                        <p className="panel-hint">
                            Álgebra proposicional: un horario solo es válido cuando TODAS las condiciones son verdaderas (conjunción AND).
                        </p>

                        <div style={{ marginBottom: "16px" }}>
                            {activeRules.map((rule, index) => (
                                <span key={rule.letter} className="cell-mono">
                                    {rule.label}
                                    {index < activeRules.length - 1 && (
                                        <strong style={{ color: "var(--accent)", margin: "0 8px" }}>AND</strong>
                                    )}
                                </span>
                            ))}
                        </div>

                        <div className="prereq-item">
                            <span>Equivalencia matemática</span>
                            <strong className="cell-mono" style={{ fontSize: "16px" }}>
                                {activeRules.map((r) => r.letter).join(" ∧ ")}
                            </strong>
                        </div>

                        {(configuration?.requiredCourses?.length ?? 0) > 0 && (
                            <div className="prereq-item" style={{ marginTop: "8px" }}>
                                <span>Materias obligatorias (subconjunto)</span>
                                <strong className="cell-mono">
                                    {"{"}
                                    {configuration.requiredCourses.join(", ")}
                                    {"}"} ⊆ H
                                </strong>
                            </div>
                        )}
                    </div>
                </section>

                {/* ========================================== */}
                {/* HORARIOS VÁLIDOS */}
                {/* ========================================== */}
                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Horarios válidos ({validList.length})</h2>

                        {validList.length === 0 ? (
                            <p className="empty-state">Ningún horario cumplió todas las condiciones.</p>
                        ) : (
                            <div className="course-grid">
                                {validList.map((schedule, index) => (
                                    <div key={index} className="course-card">
                                        <div className="course-card-header">
                                            <h3 className="course-card-title">Horario #{index + 1}</h3>
                                            <span className="course-card-id">VÁLIDO</span>
                                        </div>
                                        <div className="course-card-meta">
                                            <span className="cell-mono">{schedule.totalCredits} créditos</span>
                                        </div>
                                        <ul className="prereq-list">
                                            {schedule.courses.map((name) => (
                                                <li key={name} className="prereq-item">
                                                    <span>{name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ========================================== */}
                {/* HORARIOS DESCARTADOS */}
                {/* ========================================== */}
                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Horarios descartados ({discardedList.length})</h2>

                        {discardedList.length === 0 ? (
                            <p className="empty-state">Ningún horario fue descartado.</p>
                        ) : (
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Materias</th>
                                            <th>Créditos</th>
                                            <th>Razones de descarte</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {discardedList.map((schedule, index) => (
                                            <tr key={index}>
                                                <td className="cell-strong">{schedule.courses.join(", ")}</td>
                                                <td className="cell-mono">{schedule.totalCredits}</td>
                                                <td style={{ color: "var(--danger)" }}>
                                                    {schedule.reasons.join(" · ")}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>

                <button className="btn btn-secondary" onClick={() => navigate("/configuracion")}>
                    Generar otro horario
                </button>
            </div>
        </div>
    );
}