
// Recibe una materia y las acciones (editar/eliminar) por props,
// usando destructuring directo en los parámetros
function CourseCard({ course, onEdit, onDelete }) {
    // También puedes destructurar el objeto "course" aquí adentro
    // para no repetir "course." en cada línea
    const { id, name, day, start_time, end_time, modality, difficulty, credits } = course;

    const difficultyClass = difficulty === "Alta" ? "badge-alta" : difficulty === "Media" ? "badge-media" : "badge-baja";

    const modalityClass = modality === "Virtual" ? "badge-virtual" : "badge-presencial";

    return (
        <article className="course-card">
            <header className="course-card-header">
                <h4 className="course-card-title">{name}</h4>
                <span className="course-card-id">#{id}</span>
            </header>

            <div className="course-card-meta">
                <span className="cell-mono">{day}</span>
                <span className="cell-mono">
                    {start_time.slice(11, 16)}–{end_time.slice(11, 16)}
                </span>
            </div>

            <div className="course-card-badges">
                <span className={`badge ${modalityClass}`}>{modality}</span>
                <span className={`badge ${difficultyClass}`}>{difficulty}</span>
                <span className="badge">{credits} CREDITOS</span>
            </div>

            <div className="course-card-actions">
                <button className="link-action link-edit" onClick={() => onEdit(course)}>
                    Editar
                </button>
                <button className="link-action link-delete" onClick={() => onDelete(id)}>
                    Eliminar
                </button>
            </div>
        </article>
    );
}

export default CourseCard;