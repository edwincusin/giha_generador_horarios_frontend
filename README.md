# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# GIHA - Generador Inteligente de Horarios Académicos (Frontend)

## Descripción

GIHA es una aplicación web desarrollada en React que permite administrar materias universitarias, configurar restricciones académicas y generar horarios válidos automáticamente mediante reglas lógicas y validaciones de prerrequisitos.

La aplicación consume una API REST encargada de procesar las combinaciones de materias y determinar cuáles cumplen las condiciones establecidas por el estudiante.

---

## Características

### Gestión de Materias

* Registro de nuevas materias.
* Edición de materias existentes.
* Eliminación de materias.
* Visualización de materias registradas.
* Gestión de prerrequisitos.
* Validaciones de formularios.
* Notificaciones visuales mediante Toast.

### Configuración de Horarios

* Selección del número de materias.
* Definición de créditos máximos.
* Configuración de cantidad máxima de materias difíciles.
* Selección de modalidad requerida.
* Validación de cruces de horario.
* Validación de prerrequisitos.
* Selección de materias obligatorias.
* Registro de materias aprobadas.

### Resultados

* Visualización de horarios generados.
* Estadísticas de combinaciones.
* Identificación de horarios válidos.
* Identificación de horarios descartados.
* Explicación de reglas lógicas aplicadas.
* Detalle completo de cada materia incluida en el horario.

---

## Tecnologías Utilizadas

### Frontend

* React 19
* React Router DOM 7
* Vite 8
* JavaScript ES6+
* CSS3

### Librerías

* Lucide React
* React Icons

### Comunicación

* Fetch API
* REST API

---

## Estructura del Proyecto

```text
src/
│
├── assets/
│   ├── hero.png
│
├── components/
│   ├── ListarCardsMaterias.jsx
│   ├── ListarPrerrequisitos.jsx
│   ├── SideBar.jsx
│   └── Toast.jsx
│
├── config/
│   └── apiconfig.js
│
├── pages/
│   ├── PageAdministracionMaterias.jsx
│   ├── PageConfiguracion.jsx
│   └── PageResultados.jsx
│
├── utils/
│   └── toats.js
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## Instalación

### Clonar repositorio

```bash
git clone <url-del-repositorio>
```

### Ingresar al proyecto

```bash
cd giha_generador_horarios_frontend
```

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

### Generar versión de producción

```bash
npm run build
```

### Vista previa de producción

```bash
npm run preview
```

---

## Configuración de API

Archivo:

```javascript
src/config/apiconfig.js
```

Ejemplo:

```javascript
export const API_BASE_URL = "http://localhost:3000";
```

---

## Flujo de Uso

1. Registrar materias.
2. Configurar prerrequisitos.
3. Seleccionar restricciones académicas.
4. Generar horarios.
5. Revisar resultados.
6. Analizar horarios válidos y descartados.

---

## Arquitectura

La aplicación sigue una arquitectura basada en componentes:

* Components → Componentes reutilizables.
* Pages → Pantallas principales.
* Config → Configuración global.
* Utils → Funciones auxiliares.
* Router → Navegación entre módulos.

---

## Funcionalidades Académicas

El sistema evalúa:

* Cantidad de materias.
* Créditos máximos permitidos.
* Modalidad requerida.
* Cruces de horario.
* Materias difíciles.
* Materias obligatorias.
* Prerrequisitos.
* Materias previamente aprobadas.

---

## Autor

**Edwin Cusin (CSN)**


---

## Licencia

Proyecto desarrollado con fines académicos y educativos.
