# 05-frontend-core-shared-shell.md

# Core, Shared and Shell

Este documento define qué pertenece a las capas transversales del frontend.

El objetivo es evitar que estas carpetas se conviertan en cajones de sastre.

---

# Core

## Purpose

Contiene capacidades globales y singleton de la aplicación.

## Allowed Contents

* servicios de sesión;
* autenticación;
* guards;
* interceptors;
* configuración global;
* tokens de inyección;
* adaptadores globales;
* utilidades de nivel aplicación.

## Forbidden Contents

* componentes de negocio;
* páginas de feature;
* modelos específicos de dominio;
* lógica visual local.

---

# Shared

## Purpose

Contiene piezas reutilizables y puras.

## Allowed Contents

* componentes presentacionales;
* pipes;
* directivas;
* helpers;
* formatos;
* tipos genéricos;
* constantes reutilizables.

## Forbidden Contents

* lógica de negocio acoplada a una feature;
* llamadas directas al backend;
* estado complejo de dominio;
* dependencias hacia una feature concreta.

---

# Shell

## Purpose

Contiene la estructura visual persistente de la app.

## Allowed Contents

* layout;
* navigation;
* sidebar;
* topbar;
* footer;
* configuradores visuales;
* wrappers de página;
* elementos persistentes de navegación.

## Forbidden Contents

* reglas de negocio;
* flujo de dominio;
* acceso a datos de negocio;
* pantallas internas de features.

---

# Dependency Rules

* `core` puede ser consumido por toda la aplicación.
* `shared` puede ser consumido por features y shell.
* `shell` puede consumir `core` y `shared`.
* `shared` no debe depender de `features`.
* una feature no debe depender de la implementación privada de otra feature.

---

# Reuse Criteria

Una pieza debe ir a `shared` solo si:

* se usa en más de una feature;
* es visualmente genérica;
* no arrastra lógica de negocio específica;
* su reutilización mejora claridad, no solo ahorro de tiempo.

---

# Shell vs Feature

La regla práctica es:

* si persiste en toda la app, probablemente es `shell`;
* si existe por un contexto funcional, probablemente es `feature`;
* si sirve para varias features sin regla de negocio, probablemente es `shared`.

---

# Non Goals

No se pretende:

* crear una biblioteca interna prematura;
* meter utilidades sin criterio;
* concentrar toda la UI común en un solo lugar;
* inflar `shared` hasta volverlo incoherente.

