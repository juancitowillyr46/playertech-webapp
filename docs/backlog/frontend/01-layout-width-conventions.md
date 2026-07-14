# Layout Width Conventions

Esta convención define cómo se controla el ancho útil del contenido en PlayerTech WebApp.

## Objetivo

Evitar decisiones visuales aisladas por pantalla y mantener un criterio consistente entre formularios, vistas mixtas y tablas operativas.

## Regla UX

El ancho del contenido debe responder al tipo de tarea principal:

* `content-width-compact`: formularios de edición y lectura con foco, normalmente de 1 o 2 columnas.
* `content-width-comfortable`: formularios más densos, asistentes y vistas mixtas.
* `content-width-full`: tablas, listados y paneles con varias columnas visibles.

## Criterio de uso

### `content-width-compact`

Usar cuando el usuario necesita concentrarse en completar o revisar información.

Ejemplos:

* perfil del usuario;
* información principal de academia;
* formularios de detalle con estructura de 1 o 2 columnas.

### `content-width-comfortable`

Usar cuando la pantalla mezcla pasos, bloques o formularios más amplios, pero todavía no necesita aprovechar todo el ancho disponible.

Ejemplos:

* wizard de alta de academia;
* formularios extensos de creación guiada.

### `content-width-full`

Usar cuando el contenido principal es tabular o necesita aire horizontal para no comprimir columnas.

Ejemplos:

* staff;
* cualquier listado con 5 o más columnas visibles.

## Regla técnica

La selección del ancho debe ser declarativa desde la vista. No se debe calcular leyendo el DOM ni contando columnas dinámicamente.

## Estado actual

Aplicado en:

* `src/app/features/account/pages/profile.ts` → `content-width-compact`
* `src/app/features/tenants/pages/tenant-wizard.ts` → `content-width-comfortable`
* `src/app/features/academy/pages/academy-profile.ts`
  * `Información` → `content-width-compact`
  * `Sedes`, `Categorías`, `Equipos` → `content-width-compact`
  * `Staff` → `content-width-full`
