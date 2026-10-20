# EmpleoRapido - Frontend

Interfaz web de **EmpleoRapido**, un marketplace que conecta personas que
necesitan reparaciones del hogar con trabajadores de oficio. Construida con
**React 19**, **Vite** y **Tailwind CSS**.

## Requisitos

- Node.js 20 o superior
- npm (incluido con Node)
- El [backend de EmpleoRapido](../empleo-rapido-backend) corriendo (por defecto
  en `http://localhost:3000`)

## Stack

- **React 19** + **TypeScript**
- **Vite 8** (con React Compiler)
- **Tailwind CSS 4**
- **TanStack Query** para datos del servidor
- **Zustand** para estado de sesion
- **React Router 7**
- **Radix UI** para componentes accesibles
- **Axios** como cliente HTTP
- **oxlint** para lint

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el ejemplo (opcional en desarrollo):

```bash
cp .env.example .env
```

| Variable | Descripcion | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base del backend | `/api` |

- En **desarrollo** se usa `/api` y el proxy de Vite redirige a
  `http://localhost:3000` (ver `vite.config.ts`), por lo que no necesitas
  configurar nada mas.
- En **produccion** apunta al backend desplegado, por ejemplo:
  `VITE_API_URL=https://api.empleorapido.com/api`.

### 3. Levantar el servidor de desarrollo

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Scripts disponibles

| Script | Descripcion |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Type-check y build de produccion a `dist/` |
| `npm run preview` | Sirve localmente el build de produccion |
| `npm run lint` | Lint con oxlint |

## Funcionalidades por rol

La app tiene dos roles: **trabajador** (`WORKER`) y **dueno de casa**
(`HOMEOWNER`). La ruta inicial (`/`) redirige segun el rol.

### Publico

- **Inicio de sesion** (`/login`) y **registro** (`/register`).
- **Trabajos** (`/jobs`): listado con filtros por ciudad, categoria y busqueda;
  orden por cercania o recientes.
- **Detalle del trabajo** (`/jobs/:id`) con fotos, presupuesto (con moneda) y
  contacto por WhatsApp cuando corresponde.
- **Perfil publico del trabajador** (`/workers/:id`).

### Trabajador

- **Mis postulaciones** (`/applications`): paginadas y filtrables por estado
  (Todas/Pendiente/Aceptada/Rechazada/Retirada) y busqueda por titulo, con el
  flujo visual de cada postulacion.
- **Mi CV** (`/profile`): titulo profesional, bio, especialidades, habilidades,
  experiencia, tarifa por hora con **moneda**, disponibilidad y reputacion.

### Dueno de casa

- **Mis publicaciones** (`/my-jobs`): listado de sus trabajos con filtros.
- **Publicar trabajo** (`/my-jobs/new`) y **editar** (`/my-jobs/:id/edit`):
  categoria, presupuesto con **moneda**, ubicacion por geolocalizacion
  (autocompleta la ciudad) y hasta 3 fotos.
- Gestion de **postulantes**: ver, aceptar o rechazar.

### Comun

- **Ajustes** (`/settings`): avatar, nombre, apellido, WhatsApp, ciudad
  (solo lectura, derivada de la ubicacion) y verificacion de identidad.
- Requisitos de **verificacion de identidad (KYC)** para publicar trabajos y
  para postularse.

## Estructura del proyecto

```
src/
  api/         Cliente HTTP y funciones por recurso
  components/  Componentes reutilizables (UI, layout, jobs, applications, ...)
  hooks/       Hooks de React Query y utilidades
  lib/         Utilidades (api, validacion, formato, geocoding, query-keys)
  pages/       Paginas por area (auth, jobs, worker, owner, settings, ...)
  store/       Estado global (Zustand)
  types/       Tipos e interfaces (incluye tipos de la API)
  assets/      Recursos estaticos
```

## Autenticacion

- La sesion (access + refresh token) se guarda en el store de Zustand.
- Un interceptor de Axios adjunta el `Authorization: Bearer <accessToken>`.
- Ante un `401`, se renueva la sesion automaticamente con `/auth/refresh`
  (rotacion de token) y se reintenta la peticion.

## Notas

- El proxy de Vite redirige `/api` y `/uploads` al backend en desarrollo.
- Las imagenes subidas se resuelven contra el origen del backend
  (`resolveMediaUrl`).
- La ciudad del perfil y de las publicaciones se autocompleta por
  geolocalizacion (reverse geocoding con OpenStreetMap).
