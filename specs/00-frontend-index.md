# 00-frontend-index.md

# Frontend Specs Index

Este índice agrupa la documentación base del frontend de PlayerTech WebApp.

La intención es definir una arquitectura modular para Angular, consistente con la estrategia de monolito modular del producto.

---

# Propósito

Establecer las reglas de estructura, dependencia y evolución del frontend antes de empezar a implementar features nuevas.

---

# Principios Rectores

* El frontend se organiza por `features`, no por pantallas sueltas.
* `core`, `shared` y `shell` son capas transversales.
* Cada feature encapsula rutas, UI local, modelos y acceso a datos.
* El template base solo se conserva mientras acelera la transición.
* La documentación arquitectónica debe guiar la implementación.

---

# Índice Maestro

## 01. Frontend Architecture

Define la arquitectura general del frontend.

Incluye:

* estilo arquitectónico;
* capas del frontend;
* boundaries entre `core`, `shared`, `shell` y `features`;
* lazy loading;
* convención modular para Angular.

---

## 02. Frontend Domains

Define los dominios funcionales del frontend.

Incluye:

* Auth;
* Academy;
* Users;
* Sports;
* Membership;
* Payments;
* alcance de cada feature;
* reglas de pertenencia funcional.

---

## 03. Frontend Routing

Define la estrategia de navegación y ruteo.

Incluye:

* rutas públicas y privadas;
* rutas del shell;
* lazy routes por feature;
* guards;
* redirects;
* wildcard routes;
* organización de archivos de rutas.

---

## 04. Frontend State and Data Access

Define cómo se consume y administra la información en el frontend.

Incluye:

* capa `data-access`;
* servicios API;
* facades;
* mappers;
* modelos;
* estado local de feature;
* manejo de errores y loading states.

---

## 05. Frontend Core, Shared and Shell

Define el contenido permitido en las capas transversales.

Incluye:

* qué va en `core`;
* qué va en `shared`;
* qué va en `shell`;
* qué está prohibido en cada capa;
* criterios de reutilización.

---

## 06. Frontend UI Conventions

Define las convenciones visuales y de experiencia de usuario.

Incluye:

* layout general;
* formularios;
* tablas;
* modales;
* empty states;
* loading states;
* errores;
* consistencia visual por feature.

---

## 07. Frontend Development Flow

Define la forma de trabajo para construir nuevas features.

Incluye:

* creación de una feature;
* creación de una pantalla;
* integración con backend;
* criterios de separación;
* flujo de revisión antes de integrar cambios.

---

## 08. Frontend Testing Strategy

Define la estrategia de pruebas del frontend.

Incluye:

* unit tests;
* component tests;
* tests de integración;
* criterios de cobertura;
* qué no hace falta testear en exceso.

---

## 09. Frontend Migration Plan

Define la ruta de transición desde el template actual hacia la estructura objetivo.

Incluye:

* limpieza progresiva de Sakai;
* orden recomendado de migración;
* qué se conserva temporalmente;
* qué se depreca;
* riesgos de mezcla entre template y producto.

---

## 10. Frontend Operational Package

Define las primeras specs operativas para arrancar SDD en dominios críticos.

Incluye:

* auth;
* players;
* payments;
* trazabilidad mínima;
* estados y reglas visibles;
* vacíos y dependencias por dominio.

Documentos:

* `domains/README.md`
* `domains/auth.md`
* `domains/players.md`
* `domains/payments.md`
* `domains/auth-flows.md`
* `domains/players-flows.md`
* `domains/payments-flows.md`
* `ui/mobile-shell-navigation.md`

---

# Orden Recomendado de Redacción

1. `01-frontend-architecture.md`
2. `02-frontend-domains.md`
3. `03-frontend-routing.md`
4. `04-frontend-state-and-data-access.md`
5. `05-frontend-core-shared-shell.md`
6. `06-frontend-ui-conventions.md`
7. `07-frontend-development-flow.md`
8. `08-frontend-testing-strategy.md`
9. `09-frontend-migration-plan.md`

---

# Regla de Uso

Si una decisión de implementación no está cubierta por estos specs, primero se documenta y luego se implementa.
