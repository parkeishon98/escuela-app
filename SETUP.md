# EduConnect — Guía de Configuración con Supabase

## Archivos del proyecto

| Archivo | Descripción |
|---|---|
| `index.html` | PWA para padres de familia |
| `teacher-panel.html` | Panel de administración para maestros |
| `supabase_schema.sql` | Script SQL para crear la base de datos |
| `manifest.json` | Configuración PWA |
| `sw.js` | Service Worker (modo offline) |

---

## Paso 1 — Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta gratis
2. Clic en **"New Project"**
3. Dale un nombre (ej: `educonnect`) y elige una contraseña segura
4. Espera ~2 minutos a que se cree el proyecto

---

## Paso 2 — Ejecutar el esquema SQL

1. En tu proyecto Supabase, ve a **SQL Editor** (ícono de base de datos en la barra lateral)
2. Clic en **"New query"**
3. Copia y pega todo el contenido de `supabase_schema.sql`
4. Clic en **"Run"** (o Ctrl+Enter)
5. Debes ver: *"Success. No rows returned"*

Esto creará las tablas: `teachers`, `subjects`, `students`, `enrollments`, `grades`, `attendance`, `announcements`

---

## Paso 3 — Obtener las credenciales

1. En Supabase ve a **Settings → API**
2. Copia estos dos valores:
   - **Project URL** → ej: `https://abcdefgh.supabase.co`
   - **anon / public key** → empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Paso 4 — Configurar los archivos HTML

En **AMBOS** archivos (`index.html` y `teacher-panel.html`), busca estas dos líneas y reemplaza los valores:

```javascript
const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';  // ← tu Project URL
const SUPABASE_KEY = 'TU_ANON_PUBLIC_KEY';                // ← tu anon key
```

---

## Paso 5 — Desplegar (opciones)

### Opción A — Netlify (recomendado, gratis)
1. Ve a [netlify.com](https://netlify.com) y crea cuenta
2. Arrastra la carpeta del proyecto al área de "Deploy"
3. ¡Listo! Obtendrás una URL como `https://tu-app.netlify.app`

### Opción B — GitHub Pages
1. Sube los archivos a un repositorio público de GitHub
2. Ve a Settings → Pages → Source: main branch
3. URL: `https://usuario.github.io/repo`

### Opción C — Servidor propio
Sube los 5 archivos a cualquier servidor web (Apache, Nginx, cPanel)

> ⚠️ Para que la PWA funcione correctamente (instalable + offline), **debe servirse bajo HTTPS**. Netlify y GitHub Pages lo incluyen gratis.

---

## Flujo de uso

### El maestro:
1. Abre `teacher-panel.html`
2. Crea su cuenta (email + contraseña)
3. Crea sus materias (nombre, grado, grupo, icono, color)
4. Agrega alumnos a cada materia con su **matrícula**
5. Registra asistencias diarias (Presente/Falta/Justificada/Retardo)
6. Carga calificaciones por tipo de evaluación
7. Publica anuncios (globales o por materia)

### El padre:
1. Abre `index.html` (la PWA)
2. Crea su cuenta
3. Vincula a su hijo ingresando la **matrícula** (la misma que registró el maestro)
4. Ve materias, calificaciones, asistencias y anuncios en tiempo real
5. Si tiene varios hijos, puede cambiar entre ellos desde la barra superior

---

## Notas de seguridad

El esquema SQL actual usa políticas de **lectura y escritura abiertas** para simplificar el setup. Para producción real se recomienda:

1. Activar **Supabase Auth** para maestros y usar `auth.uid()` en las políticas RLS
2. Crear una tabla `parents` ligada a `auth.users` para padres
3. Restringir escritura solo a maestros autenticados
4. Limitar lectura de padres solo a los alumnos vinculados a su cuenta

---

## Estructura de la base de datos

```
teachers (maestros)
    └── subjects (materias por maestro)
            └── enrollments (alumnos inscritos por materia)
                    └── grades (calificaciones por inscripción)
            └── attendance (asistencia: alumno + materia + fecha)
            └── announcements (anuncios por materia o globales)
students (alumnos, identificados por matrícula)
```
