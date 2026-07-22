# 07-frontend-development-flow.md

# Frontend Development Flow

Este documento define cómo se trabaja una feature o pantalla nueva en el frontend.

El objetivo es tener una forma de trabajo repetible y predecible.

---

# Working Principle

Primero se define la ubicación correcta de la funcionalidad.

Después se implementa.

No al revés.

---

# Standard Flow

1. Identificar el dominio funcional.
2. Confirmar si la funcionalidad pertenece a una feature existente o nueva.
3. Definir rutas, modelos y acceso a datos.
4. Definir el lugar de UI dentro de la feature.
5. Integrar con backend o mocks.
6. Validar consistencia con `core`, `shared` y `shell`.
7. Revisar antes de expandir la feature.

---

# Creating a New Feature

Antes de crear archivos, definir:

* nombre de la feature;
* responsabilidad de negocio;
* rutas principales;
* modelos necesarios;
* servicios o facades requeridos;
* elementos reutilizables que sí o no van a `shared`.

---

# Creating a New Screen

Una pantalla nueva debe responder a:

* ¿qué feature la contiene?;
* ¿qué acción del usuario resuelve?;
* ¿qué datos consume?;
* ¿qué estado muestra?;
* ¿qué navegación produce?

---

# Backend Integration

La integración debe pasar por `data-access`.

Reglas:

* no consumir HTTP desde el componente;
* no exponer DTOs del backend sin adaptación si el caso lo requiere;
* no mezclar mapeo con template;
* validar el contrato antes de construir la UI alrededor de él.

## Simple Cache Rule

Si una pantalla consulta la misma API varias veces por navegación interna, primero evaluar un cache simple con `signals` antes de considerar NgRx.

Regla mínima:

* la primera entrada carga la API;
* las siguientes entradas reutilizan la respuesta en memoria;
* una mutación invalida o refresca ese cache;
* la implementación debe seguir siendo fácil de leer y de mantener.

---

# Change Discipline

Cada cambio debe preguntarse:

* ¿esto es global, compartido o de feature?;
* ¿esto rompe límites entre contextos?;
* ¿esto merece ir a `shared`?;
* ¿esto pertenece al shell?;
* ¿esto crea dependencia innecesaria?

---

# Review Criteria

Antes de considerar una feature lista, verificar:

* rutas correctas;
* estructura consistente;
* separación UI/datos;
* ausencia de dependencia lateral innecesaria;
* naming claro;
* experiencia usable en estados vacíos, carga y error.

---

# SDD Staged Flow

Cuando una feature nueva aparezca, el orden recomendado no es "documentar todo y luego construir todo". El orden es incremental.

## Stage 1

Encaje funcional y ownership.

## Stage 2

Spec mínima del dominio.

## Stage 3

Criterios de aceptación por flujo principal.

## Stage 4

Rutas, páginas y estados visibles.

## Stage 5

Integración de datos por `data-access`.

## Stage 6

Caracterización si el dominio es crítico o cambiante.

## Rule of Thumb

Si la feature todavía no tiene ownership y flujos claros, no debe saltar a implementación amplia.
Si ya tiene eso, se puede avanzar sin frenar el proyecto.

# Non Goals

No se formaliza todavía:

* pipeline complejo de CI para frontend;
* reglas de release por feature;
* feature flags avanzadas;
* branching model especial.
