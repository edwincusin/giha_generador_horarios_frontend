import { useState } from "react";
import { NavLink } from "react-router-dom";

// Guardamos los links en un arreglo aparte, en vez de escribirlos
// uno por uno en el JSX. Así, si agregas una pantalla nueva,
// solo agregas una línea aquí, no repites código.
const NAV_LINKS = [
    { to: "/materias", label: "Adm Materias" },
    { to: "/configuracion", label: "Configuración" },
    { to: "/resultados", label: "Resultados" },
    { to: "/detalle-horario", label: "Detalle horario" },
];

export default function Sidebar() {
    // Este estado controla si el sidebar está abierto o cerrado
    // en pantallas pequeñas (celular). En pantallas grandes no se usa
    // (el CSS lo fuerza a estar siempre visible con @media).
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Botón "hamburguesa" — SOLO se ve en pantallas pequeñas (lo controla el CSS) */}
            <button
                className="sidebar-toggle"
                aria-label="Abrir menú"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span />
                <span />
                <span />
            </button>

            {/* Fondo oscuro semitransparente que aparece detrás del sidebar
                cuando está abierto en móvil. Si lo tocas, se cierra el menú. */}
            {isOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* El sidebar en sí. Le agregamos la clase "is-open" solo
                cuando isOpen es true — el CSS usa esa clase para moverlo
                a la vista en móvil (ver más abajo). */}
            <aside className={`sidebar ${isOpen ? "is-open" : ""}`}>

                {/* Marca / logo, arriba del todo */}
                <NavLink
                    to="/"
                    className="sidebar-brand"
                    onClick={() => setIsOpen(false)}
                >
                    <span className="sidebar-mark" aria-hidden="true">{"{ }"}</span>
                    <span className="sidebar-brand-text">
                        <strong>GIHA</strong>
                        <small>Generador Inteligente de Horarios</small>
                    </span>
                </NavLink>

                {/* Los links de navegación */}
                <nav className="sidebar-links">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            // NavLink nos da "isActive" automáticamente:
                            // true si la URL actual coincide con "to".
                            // Así resaltamos en qué pantalla está el usuario.
                            className={({ isActive }) =>
                                `sidebar-link${isActive ? " sidebar-link--active" : ""}`
                            }
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}