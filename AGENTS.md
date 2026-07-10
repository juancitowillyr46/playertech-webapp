# AGENTS.md

Este archivo define la forma de trabajo del frontend `playertech-webapp`.

## Objetivo

Construir un frontend Angular modular, mantenible y alineado con la arquitectura funcional de PlayerTech.

## Principios

* La aplicación se organiza por `features`, no por pantallas sueltas.
* `core`, `shared` y `shell` son capas transversales.
* Cada feature debe encapsular rutas, UI local, modelos y acceso a datos.
* No se debe seguir creciendo sobre la estructura del template Sakai por costumbre.
* La documentación arquitectónica debe anteceder a cambios estructurales importantes.

## Convención de trabajo

* Primero se analiza la estructura actual.
* Luego se define el objetivo arquitectónico.
* Después se documenta el cambio o la regla.
* Recién al final se implementa.

## Capas del frontend

### `core`

Servicios singleton, autenticación, guards, interceptors, tokens, configuración global y utilidades de aplicación.

### `shared`

Componentes, pipes, directivas, helpers y tipos reutilizables entre features.

### `shell`

Layout principal, navegación, topbar, sidebar, footer y estructura visual de la app.

### `features`

Módulos funcionales del negocio como `auth`, `academy`, `users`, `sports`, `membership` y `payments`.

## Regla de ubicación

Si algo responde a una pregunta de negocio o pertenece a una pantalla concreta, debe vivir dentro de su feature.

Si algo es global, reusable o transversal, debe vivir en `core`, `shared` o `shell` según corresponda.

## Regla de diseño

La app debe mantenerse como un monolito modular frontend:

* una sola aplicación desplegable;
* límites claros entre contextos;
* dependencia mínima entre features;
* lazy loading por dominio.

