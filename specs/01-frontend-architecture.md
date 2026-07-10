# 01-frontend-architecture.md

# Frontend Architecture

Este documento define la arquitectura base del frontend de PlayerTech WebApp.

El objetivo es construir una aplicación Angular modular, mantenible y alineada con la evolución del producto.

---

# Architectural Goal

El frontend debe funcionar como un monolito modular.

Esto significa:

* una sola aplicación desplegable;
* módulos funcionales bien delimitados;
* dependencia mínima entre features;
* estructura pensada para crecer sin reescrituras costosas.

---

# Architectural Principles

* La aplicación se organiza por contexto funcional.
* `features` es la unidad principal de crecimiento.
* `core`, `shared` y `shell` son capas transversales.
* La navegación debe apoyarse en lazy loading.
* La UI debe permanecer separada del acceso a datos.
* La complejidad del template base no debe dictar la estructura final del producto.

---

# Layer Model

## Core

Contiene capacidades globales de la aplicación.

Incluye:

* autenticación;
* guards;
* interceptors;
* configuración global;
* servicios singleton;
* tokens de inyección;
* utilidades de alcance global.

## Shared

Contiene elementos reutilizables entre features.

Incluye:

* componentes presentacionales;
* directivas;
* pipes;
* helpers puros;
* tipos reutilizables;
* utilidades de formato.

## Shell

Contiene la estructura visual principal de la aplicación.

Incluye:

* layout;
* sidebar;
* topbar;
* footer;
* navegación principal;
* contenedores visuales persistentes.

## Features

Contienen los contextos funcionales del negocio.

Cada feature debe encapsular:

* rutas propias;
* páginas;
* componentes locales;
* modelos;
* acceso a datos;
* lógica de coordinación de la feature.

---

# Recommended Root Structure

```text
src/app/
├── core/
├── shared/
├── shell/
├── features/
└── app.routes.ts
```

---

# Feature Structure

Cada feature debe seguir una estructura consistente.

```text
features/feature-name/
├── pages/
├── components/
├── data-access/
├── models/
└── feature-name.routes.ts
```

## Pages

Contienen vistas enrutadas.

## Components

Contienen piezas UI locales de la feature.

## Data Access

Contiene servicios de consumo de datos, facades, mappers y modelos de transporte.

## Models

Contiene contratos y tipos propios de la feature.

---

# Modular Boundaries

* Una feature no debe depender directamente de la estructura privada de otra feature.
* La comunicación entre features debe pasar por contratos explícitos, servicios compartidos o navegación.
* `shared` no debe contener lógica de negocio.
* `core` no debe contener UI de negocio.
* `shell` no debe contener lógica de dominio.

---

# Lazy Loading Rule

Toda feature que represente un contexto funcional debe cargarse de forma diferida cuando sea posible.

Esto ayuda a:

* reducir el bundle inicial;
* desacoplar features;
* hacer más clara la navegación;
* facilitar el crecimiento del frontend.

---

# State Ownership

El estado debe vivir donde tiene sentido.

Reglas:

* estado global de sesión en `core`;
* estado visual persistente en `shell`;
* estado de negocio localizado en la feature;
* estado compartido solo si realmente lo consumen múltiples features;
* evitar estados globales por conveniencia.

---

# UI and Data Separation

La UI no debe hablar directamente con el backend.

Reglas:

* los componentes consumen facades o servicios de la feature;
* `data-access` concentra llamadas HTTP y transformaciones;
* la presentación no debe contener mapeos complejos;
* las reglas de consumo de datos deben vivir cerca de la feature.

---

# Scalability Strategy

La arquitectura debe permitir incorporar nuevas features sin romper las existentes.

El diseño debe soportar:

* nuevos dominios funcionales;
* nuevas pantallas dentro de una feature;
* cambios de API sin contaminar la UI;
* crecimiento del shell sin convertirlo en un monolito visual caótico.

---

# Non Goals

No se busca en esta fase:

* microfrontends;
* múltiples aplicaciones Angular;
* un estado global complejo desde el inicio;
* sobre-ingeniería en la capa shared;
* replicar literalmente la arquitectura del backend.

