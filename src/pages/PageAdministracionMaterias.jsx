import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/apiconfig";
import CardMaterias from "../components/ListarCardsMaterias";


// Una sola constante, un solo criterio: SIEMPRE incluye "/api" y NUNCA barra al final
const API_URL = `${API_BASE_URL}/api`;

export default function CoursesAdminPage() {
    const emptyForm = {
        name: "",
        day: "",
        start_time: "",
        end_time: "",
        modality: "",
        difficulty: "",
        credits: 0,
    };

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState(emptyForm);

    // Actualiza cualquier campo del formulario según el input que cambió
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "credits" ? Number(value) : value,
        }));
    };

    // PARA CREAR NUEVO REGISTRO DE MATERIA
    const handleSubmit = async (e) => {
        e.preventDefault(); // evita que el navegador recargue la página

        try {
            const res = await fetch(`${API_URL}/courses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }

            setForm(emptyForm); // limpia el formulario
            loadCourses();      // recarga la lista para ver la nueva materia

        } catch (err) {
            setError(err.message);
        }
    };


    //CARGA TODOS LAS MATERIAS 
    const loadCourses = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/courses`);
            if (!res.ok) throw new Error("Error al cargar materias");
            const data = await res.json();
            setCourses(data);
        } catch (err) {
            setError("No se pudieron cargar las materias. Verifica que el backend esté corriendo.");
        } finally {
            setLoading(false);
        }
    };

    // EJECUTA AL RENDERIZAR PANTALLA CARGANDO LOS CURSOS
    useEffect(() => {
        loadCourses();
    }, []);

    //ELIMINA UNA MATERIA
    const handleDelete = async (id) => {
        const confirmDelete = confirm("¿Eliminar esta materia? Esta acción no se puede deshacer.");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${API_URL}/courses/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message);
            }

            // Opción 1: recargar todo desde el backend
            loadCourses();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page">
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">Administración de materias</h1>

                </header>

                {error && <div className="alert-error">{error}</div>}


                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Registrar nueva materia</h2>

                        <form onSubmit={handleSubmit} className="form-grid">
                            <label className="field span-2">
                                <span className="field-label">Nombre</span>
                                <input
                                    className="input"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej. Programación"
                                />
                            </label>

                            <label className="field">
                                <span className="field-label">Día</span>
                                <select className="select" name="day" value={form.day} onChange={handleChange} required> 
                                    <option value="" disabled>Seleccione un día</option>
                                    <option value="Lunes">Lunes</option>
                                    <option value="Martes">Martes</option>
                                    <option value="Miércoles">Miércoles</option>
                                    <option value="Jueves">Jueves</option>
                                    <option value="Viernes">Viernes</option>
                                    <option value="Sábado">Sábado</option>
                                </select>
                            </label>

                            <label className="field">
                                <span className="field-label">Créditos</span>
                                <input
                                    className="input"
                                    type="number"
                                    name="credits"
                                    min={1}
                                    max={10}
                                    value={form.credits}
                                    onChange={handleChange}
                                />
                            </label>

                            <label className="field">
                                <span className="field-label">Hora inicio</span>
                                <input
                                    className="input"
                                    type="time"
                                    name="start_time"
                                    value={form.start_time}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="field">
                                <span className="field-label">Hora fin</span>
                                <input
                                    className="input"
                                    type="time"
                                    name="end_time"
                                    value={form.end_time}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="field">
                                <span className="field-label">Modalidad</span>
                                <select className="select" name="modality" value={form.modality} onChange={handleChange} required>
                                    <option value="" disabled>Seleccione modalidad</option>
                                    <option value="Presencial">Presencial</option>
                                    <option value="Virtual">Virtual</option>
                                </select>
                            </label>

                            <label className="field">
                                <span className="field-label">Dificultad</span>
                                <select className="select" name="difficulty" value={form.difficulty} onChange={handleChange} required>
                                    <option value="" disabled>Seleccione dificultad</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Media">Media</option>
                                    <option value="Baja">Baja</option>
                                </select>
                            </label>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Registrar materia
                                </button>
                            </div>
                        </form>
                    </div>
                </section>



                {/* //SECCIONS LISTADO DE MATERIAS  */}
                <section className="panel">
                    <div className="panel-body">

                        <h2 className="panel-title">Materias disponibles</h2>
                        <p className="page-subtitle">
                            {courses.length} materia{courses.length !== 1 ? "s" : ""} registrada{courses.length !== 1 ? "s" : ""}
                        </p>
                        {loading ? (
                            <p className="empty-state">Cargando...</p>
                        ) : courses.length === 0 ? (
                            <p className="empty-state">Aún no hay materias registradas.</p>
                        ) : (
                            <div className="course-grid">
                                {courses.map((course) => (
                                    <CardMaterias
                                        key={course.id}
                                        course={course}
                                        //onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}