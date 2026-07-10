# 09-frontend-migration-plan.md

# Frontend Migration Plan

Este documento define cómo migrar el frontend actual hacia la arquitectura objetivo.

El objetivo no es romper el template de golpe, sino ir sacando al producto del molde Sakai con control.

---

# Migration Goal

Transformar la base actual en una aplicación angular modular centrada en PlayerTech.

---

# Current Situation

El proyecto aún conserva una estructura heredada del template:

* `pages/`;
* `layout/`;
* demos de UI;
* pantallas de ejemplo;
* rutas mezcladas por tipo de contenido, no por dominio.

---

# Migration Principles

* Migrar por etapas.
* No mezclar la estructura vieja con la nueva sin un criterio claro.
* Priorizar el shell y el ruteo.
* Reubicar primero lo transversal.
* Luego construir features reales.

---

# Recommended Sequence

1. Definir `core`, `shared`, `shell` y `features`.
2. Identificar qué piezas del template se conservan temporalmente.
3. Mover navegación y layout al shell.
4. Vaciar `pages/` progresivamente.
5. Crear features iniciales con estructura final.
6. Eliminar pantallas demo cuando dejen de ser útiles.

---

# Temporary Retention

Algunas piezas del template pueden mantenerse mientras se migra:

* layout base;
* componentes visuales reutilizables;
* estilos comunes;
* navegación inicial.

Estas piezas deben tener fecha de salida.

---

# Decommission Targets

Deben salir progresivamente:

* páginas demo;
* ejemplos de UI no productivos;
* rutas no alineadas al negocio;
* estructuras de Sakai que ya no aporten valor.

---

# Risks to Manage

* duplicar lógica entre estructura vieja y nueva;
* dejar `pages/` como segundo sistema paralelo;
* inflar `shared`;
* convertir `shell` en un contenedor de todo;
* migrar sin dominio claro.

---

# Success Criteria

La migración se considera encaminada cuando:

* nuevas features nacen en su estructura final;
* el shell ya representa la app real;
* las rutas de negocio viven por feature;
* el template deja de dictar el crecimiento del proyecto.

