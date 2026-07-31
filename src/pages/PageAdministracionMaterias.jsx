import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/apiconfig";
import CardMaterias from "../components/ListarCardsMaterias";

// Una sola constante, un solo criterio: SIEMPRE incluye "/api" y NUNCA barra al final
const API_URL = `${API_BASE_URL}/api`;

export default function CoursesAdminPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const data=await res.json()
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
                    <p className="page-subtitle">
                        {courses.length} materia{courses.length !== 1 ? "s" : ""} registrada{courses.length !== 1 ? "s" : ""}
                    </p>
                </header>

                {error && <div className="alert-error">{error}</div>}

                <section className="panel">
                    <div className="panel-body">
                        <h2 className="panel-title">Materias disponibles</h2>
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