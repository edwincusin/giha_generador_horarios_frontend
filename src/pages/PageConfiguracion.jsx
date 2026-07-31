// src/pages/PageConfiguracion.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiconfig";
import { showToast } from "../utils/toats";
import Toast from "../components/Toast";

const API_URL = `${API_BASE_URL}/api`;

export default function ConfigurationPage() {
    const navigate = useNavigate();

    const [toast, setToast] = useState({ message: "", type: "success" });
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        numberOfCourses: 3,
        maximumCredits: 12,
        maximumDifficultCourses: 2,
        requiredModality: "Cualquiera",
        avoidTimeConflicts: true,
        validatePrerequisites: true,
    });

    // Nombres de materias obligatorias (el backend las compara por nombre)
    const [requiredCourseNames, setRequiredCourseNames] = useState([]);
    // Ids de materias ya aprobadas (el backend las compara por id)
    const [completedCourseIds, setCompletedCourseIds] = useState([]);

    // Carga la lista de materias disponibles para armar los checklists
    useEffect(() => {
        const loadCourses = async () => {
            setLoadingCourses(true);
            try {
                const res = await fetch(`${API_URL}/courses`);
                if (!res.ok) throw new Error("Error al cargar materias");
                const data = await res.json();
                setCourses(data);
            } catch (err) {
                showToast(setToast, err.message, "error");
            } finally {
                setLoadingCourses(false);
            }
        };
        loadCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : Number(value) || value,
        }));
    };

    // Marca/desmarca una materia como obligatoria (guarda su NOMBRE)
    const toggleRequiredCourse = (name) => {
        setRequiredCourseNames((prev) =>
            prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };

    // Marca/desmarca una materia como ya aprobada (guarda su ID)
    const toggleCompletedCourse = (id) => {
        setCompletedCourseIds((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            numberOfCourses: form.numberOfCourses,
            requiredCourses: requiredCourseNames,
            maximumCredits: form.maximumCredits,
            maximumDifficultCourses: form.maximumDifficultCourses,
            requiredModality: form.requiredModality,
            avoidTimeConflicts: form.avoidTimeConflicts,
            validatePrerequisites: form.validatePrerequisites,
            completedCourses: completedCourseIds,
        };

        try {
            const res = await fetch(`${API_URL}/schedules/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.mensaje || data.error || "Error al generar horarios");
            }

            // Navega a Resultados, pasando la respuesta completa + la configuración usada
            navigate("/resultados", { state: { result: data, configuration: payload } });
        } catch (err) {
            showToast(setToast, err.message, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page">
            <div className="container">
                <header className="page-header">
                    <span className="eyebrow">Paso 3</span>
                    <h1 className="page-title">Configuración del horario</h1>
                    <p className="page-subtitle">
                        Define las reglas que deben cumplir los horarios generados.
                    </p>
                </header>

                <section className="panel">
                    <div className="panel-body">
                        <form onSubmit={handleSubmit} className="form-grid">

                            <label className="field">
                                <span className="field-label">Cantidad de materias</span>
                                <input
                                    className="input"
                                    type="number"
                                    name="numberOfCourses"
                                    min={1}
                                    value={form.numberOfCourses}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="field">
                                <span className="field-label">Créditos máximos</span>
                                <input
                                    className="input"
                                    type="number"
                                    name="maximumCredits"
                                    min={1}
                                    value={form.maximumCredits}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="field">
                                <span className="field-label">Máximo materias difíciles</span>
                                <input
                                    className="input"
                                    type="number"
                                    name="maximumDifficultCourses"
                                    min={0}
                                    value={form.maximumDifficultCourses}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="field">
                                <span className="field-label">Modalidad requerida</span>
                                <select
                                    className="select"
                                    name="requiredModality"
                                    value={form.requiredModality}
                                    onChange={handleChange}
                                >
                                    <option value="Cualquiera">Cualquiera</option>
                                    <option value="Presencial">Presencial</option>
                                    <option value="Virtual">Virtual</option>
                                </select>
                            </label>

                            <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
                                <input
                                    type="checkbox"
                                    name="avoidTimeConflicts"
                                    checked={form.avoidTimeConflicts}
                                    onChange={handleChange}
                                />
                                <span className="field-label">Evitar cruces de horario</span>
                            </label>

                            <label className="field" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
                                <input
                                    type="checkbox"
                                    name="validatePrerequisites"
                                    checked={form.validatePrerequisites}
                                    onChange={handleChange}
                                />
                                <span className="field-label">Validar prerrequisitos</span>
                            </label>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? "Generando..." : "Generar horarios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Materias obligatorias</h2>
                        <p className="panel-hint">Selecciona las materias que deben estar sí o sí en el horario.</p>

                        {loadingCourses ? (
                            <p className="empty-state">Cargando materias...</p>
                        ) : (
                            <div className="course-grid">
                                {courses.map((course) => (
                                    <label key={course.id} className="prereq-item" style={{ cursor: "pointer" }}>
                                        <span>
                                            <strong>{course.name}</strong> — {course.day}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={requiredCourseNames.includes(course.name)}
                                            onChange={() => toggleRequiredCourse(course.name)}
                                        />
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Materias ya aprobadas</h2>
                        <p className="panel-hint">Selecciona las materias que el estudiante ya cursó (para validar prerrequisitos).</p>

                        {loadingCourses ? (
                            <p className="empty-state">Cargando materias...</p>
                        ) : (
                            <div className="course-grid">
                                {courses.map((course) => (
                                    <label key={course.id} className="prereq-item" style={{ cursor: "pointer" }}>
                                        <span>
                                            <strong>{course.name}</strong> — {course.day}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={completedCourseIds.includes(course.id)}
                                            onChange={() => toggleCompletedCourse(course.id)}
                                        />
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Toast message={toast.message} type={toast.type} />
        </div>
    );
}