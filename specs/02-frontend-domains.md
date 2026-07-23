# 02-frontend-domains.md

# Frontend Domains

Este documento define los contextos funcionales del frontend de PlayerTech WebApp.

Los dominios se organizan para reflejar la forma en que el negocio y los usuarios interactúan con la aplicación.

---

# Domain Model

El frontend debe representar los mismos contextos funcionales que el producto.

Los dominios iniciales son:

* Auth
* Academy
* Finance
* Venues
* Users
* Sports
* Membership
* Payments

---

# Auth

## Scope

Maneja el acceso a la aplicación y la sesión del usuario.

## Includes

* login;
* logout;
* recuperación de sesión;
* control de acceso por rol;
* redirección según contexto.

## Excludes

* lógica administrativa de usuarios;
* pantallas de negocio.

---

# Academy

## Scope

Representa la gestión de la academia y su configuración operativa.

## Includes

* datos de la academia;
* sedes;
* categorías;
* configuración institucional;
* contexto tenant cuando aplique en UI.

## Excludes

* gestión de pagos;
* gestión competitiva;
* autenticación.

---

# Venues

## Scope

Administra las sedes de la academia dentro del contexto tenant actual.

## Includes

* listado de sedes;
* creación y edición;
* detalle de sede;
* activación e inactivación;
* paginación y feedback de carga.

## Excludes

* gestión competitiva;
* pagos;
* autenticación de sesión.

---

# Finance

## Scope

Agrupa la configuración y consulta financiera de la academia.

## Includes

* información fiscal;
* conceptos de cobro;
* cargos y deudas;
* pagos;
* navegación financiera visible en UI.

## Excludes

* gestión operativa de la academia;
* autenticación;
* gestión competitiva.

---

# Users

## Scope

Gestiona personas y cuentas operativas dentro de la plataforma.

## Includes

* usuarios de sistema;
* perfiles operativos;
* roles visibles en UI;
* relaciones con la academia si la app las expone.

## Excludes

* auth de sesión;
* flujos de matrícula;
* pagos.

---

# Sports

## Scope

Agrupa la gestión deportiva y competitiva.

## Includes

* jugadores;
* equipos;
* asignaciones;
* vistas relacionadas con organización deportiva.

## Excludes

* autenticación;
* procesos financieros;
* configuración global.

---

# Membership

## Scope

Agrupa la permanencia administrativa del jugador en la academia.

## Includes

* matrículas;
* estado administrativo;
* relaciones operativas asociadas a permanencia;
* vistas de seguimiento del estudiante/jugador dentro de la academia.

## Excludes

* lógica competitiva;
* autenticación;
* tesorería.

---

# Payments

## Scope

Agrupa la información financiera y de cobros.

## Includes

* pagos;
* conceptos de pago;
* evidencias;
* estados financieros visibles en UI.

## Excludes

* matrícula como concepto principal;
* configuración de sesión;
* organización de equipos.

---

# Domain Ownership

Cada feature es dueña de su contexto funcional.

Reglas:

* la feature define sus pantallas;
* la feature define sus modelos;
* la feature define su acceso a datos;
* la feature no debe duplicar reglas de otra feature;
* si una funcionalidad cruza dominios, debe definirse qué contexto es dueño.

---

# Cross-Domain Rules

* Auth gobierna el acceso, no el negocio.
* Academy define contexto y configuración, no pagos.
* Sports define participación deportiva, no permanencia administrativa.
* Membership define permanencia, no competición.
* Payments define cobros, no identidad.

---

# Expansion Path

Dominios futuros posibles:

* Coaches;
* Attendance;
* Tournaments;
* Notifications;
* Analytics;
* Billing;
* Parent Portal.

Estos dominios no deben contaminar la estructura inicial del frontend.
