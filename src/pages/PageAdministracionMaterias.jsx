import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/apiconfig";
import CardMaterias from "../components/ListarCardsMaterias";
import { showToast } from "../utils/toats";
import Toast from "../components/Toast";


// Una sola constante, un solo criterio: SIEMPRE incluye "/api" y NUNCA barra al final
const API_URL = `${API_BASE_URL}/api`;

export default function CoursesAdminPage() {
    const [toast, setToast] = useState({
        message: "",
        type: "success"
    });

    const emptyForm = {
        name: "",
        day: "",
        start_time: "",
        end_time: "",
        modality: "",
        difficulty: "",
        credits: 0,
    };

    //para cuando vayamos a modificar
    const [editingId, setEditingId] = useState(null);

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedPrerequisiteId, setSelectedPrerequisiteId] = useState("");
    const [prerequisites, setPrerequisites] = useState([]);

    // PARA MODIFICAR UNA MATERIA
    const handleEdit = (course) => {
        setForm({
            name: course.name,
            day: course.day,
            start_time: course.start_time.slice(11, 16),
            end_time: course.end_time.slice(11, 16),
            modality: course.modality,
            difficulty: course.difficulty,
            credits: course.credits,
        });
        setEditingId(course.id);
    };


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

        //Modifica handleSubmit para que sirva tanto para crear como editar
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${API_URL}/courses/${editingId}` : `${API_URL}/courses`;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message);
            }

            editingId ? showToast(setToast, "Materia MODIFICADA correctamente", "success") : showToast(setToast, "Materia registrada correctamente", "success");

            setForm(emptyForm); // limpia el formulario
            setEditingId(null);
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
            showToast(setToast, "Materia eliminada con exito", "success");
            // Opción 1: recargar todo desde el backend
            loadCourses();
        } catch (err) {
            setError(err.message);
            showToast(setToast, err.message, "error");
        }
    };

    //PRERREQUISITOS 
    //Función para cargar los prerrequisitos de la materia seleccionada
    const loadPrerequisites = async (courseId) => {
        if (!courseId) {
            setPrerequisites([]);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/prerequisites/${courseId}`);
            if (res.status === 404) {
                setPrerequisites([]);
                return;
            }
            if (!res.ok) throw new Error("Error al cargar prerrequisitos");
            const data = await res.json();
            setPrerequisites(data);
        } catch (err) {
            setError(err.message);
        }
    };
    //Efecto: cada vez que cambia la materia seleccionada, recarga sus prerrequisitos
    useEffect(() => {
        loadPrerequisites(selectedCourseId);
        setSelectedPrerequisiteId(""); // limpia la selección anterior
    }, [selectedCourseId]);

    //Función para asignar un nuevo prerrequisito
    const handleAddPrerequisite = async () => {
        if (!selectedCourseId || !selectedPrerequisiteId) {
            showToast(setToast, "Selecciona ambas materias", "error");
            return;
        }

        if (selectedCourseId === selectedPrerequisiteId) {
            showToast(setToast, "Una materia no puede ser prerrequisito de sí misma", "error");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/prerequisites`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    course_id: Number(selectedCourseId),
                    prerequisite_course_id: Number(selectedPrerequisiteId),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al asignar prerrequisito");
            }

            showToast(setToast, "Prerrequisito asignado correctamente", "success");
            setSelectedPrerequisiteId("");
            loadPrerequisites(selectedCourseId);
        } catch (err) {
            showToast(setToast, err.message, "error");
        }
    };

    //Función para eliminar un prerrequisito
    const handleDeletePrerequisite = async (prerequisiteCourseId) => {
        const confirmDelete = confirm("¿Quitar este prerrequisito?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `${API_URL}/prerequisites/${selectedCourseId}/${prerequisiteCourseId}`,
                { method: "DELETE" }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Error al eliminar prerrequisito");
            }

            showToast(setToast, "Prerrequisito eliminado", "success");
            loadPrerequisites(selectedCourseId);
        } catch (err) {
            showToast(setToast, err.message, "error");
        }
    };


    return (
        <div className="page">
            <div className="container">
                <header className="page-header">
                    <h1 className="page-title">Administración de materias</h1>

                </header>

                {error && <div className="alert-error">{error}</div>}

                {/* //SECCIONS REGISTRO DE MATERIAS  =======================================================================================*/}

                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">{editingId ? `Editar materia ID: ${editingId}` : "Registrar nueva materia"}</h2>

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
                                    {editingId ? "Guardar cambios" : "Registrar materia"}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => {
                                        setForm(emptyForm); // limpia el formulario
                                        setEditingId(null);
                                    }} className="btn btn-secondary">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </section>

                
                


                {/* SECCIÓN: ASIGNAR PRERREQUISITOS ====================================================================================*/}
                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Asignar prerrequisitos</h2>

                        <div className="form-grid">
                            <label className="field">
                                <span className="field-label">Materia</span>
                                <select
                                    className="select"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecciona una materia</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.name} ({course.day})
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="field">
                                <span className="field-label">Prerrequisito</span>
                                <select
                                    className="select"
                                    value={selectedPrerequisiteId}
                                    onChange={(e) => setSelectedPrerequisiteId(e.target.value)}
                                    disabled={!selectedCourseId}
                                    required
                                >
                                    <option value="" disabled>Selecciona el prerrequisito</option>
                                    {courses
                                        .filter((course) => String(course.id) !== String(selectedCourseId))
                                        .map((course) => (
                                            <option key={course.id} value={course.id}>
                                                {course.name} ({course.day})
                                            </option>
                                        ))}
                                </select>
                            </label>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddPrerequisite}
                                    disabled={!selectedCourseId || !selectedPrerequisiteId}
                                >
                                    Asignar prerrequisito
                                </button>
                            </div>
                        </div>

                        {selectedCourseId && (
                            <div style={{ marginTop: "1.5rem" }}>
                                <h3 className="panel-subtitle">Prerrequisitos actuales</h3>
                                {prerequisites.length === 0 ? (
                                    <p className="empty-state">Esta materia no tiene prerrequisitos.</p>
                                ) : (
                                    <ul className="prerequisite-list">
                                        {prerequisites.map((p) => {
                                            const prereqCourse = courses.find(
                                                (c) => c.id === p.prerequisite_course_id
                                            );
                                            return (
                                                <li key={p.prerequisite_course_id} className="prerequisite-item">
                                                    <span>{prereqCourse ? prereqCourse.name : `ID ${p.prerequisite_course_id}`}</span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleDeletePrerequisite(p.prerequisite_course_id)}
                                                    >
                                                        Quitar
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </section>



                {/* //SECCIONS LISTADO DE MATERIAS  =======================================================================================*/}
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
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>


            </div>

            <Toast
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
}