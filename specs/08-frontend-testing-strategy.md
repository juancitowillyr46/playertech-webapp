# 08-frontend-testing-strategy.md

# Frontend Testing Strategy

Este documento define la estrategia de pruebas del frontend.

El objetivo es asegurar comportamiento útil sin caer en sobrecosto innecesario.

---

# Testing Principles

* probar lo que aporta confianza real;
* favorecer pruebas cercanas al comportamiento del usuario;
* evitar duplicar cobertura sin valor;
* mantener pruebas legibles y estables.

---

# Unit Tests

Se enfocan en:

* helpers;
* mappers;
* lógica de facades;
* validaciones puras;
* funciones de transformación;
* servicios con lógica no trivial.

---

# Component Tests

Se enfocan en:

* rendering básico;
* interacción;
* estados de UI;
* emisión de eventos;
* comportamiento de formularios;
* respuestas ante carga y error.

---

# Integration Tests

Se enfocan en:

* interacción entre facade y componentes;
* integración de rutas;
* flujo de feature;
* consumo de un contrato de datos real o simulado de forma consistente.

---

# What to Prioritize

Primero debe estar cubierto:

* auth;
* navegación protegida;
* carga de datos principal;
* formularios críticos;
* errores de uso frecuentes.

---

# What Not to Overtest

No conviene sobredimensionar pruebas para:

* markup trivial;
* estilos visuales sin comportamiento;
* wrappers sin lógica;
* componentes puramente decorativos.

---

# Test Ownership

* `core` debe probar autenticación, guards e interceptors cuando sea relevante.
* `shared` debe probar utilidades reutilizables.
* `features` deben probar flujos críticos y coordinación local.

---

# Non Goals

No se define todavía:

* e2e obligatorio para toda pantalla;
* snapshots como estrategia principal;
* una infraestructura de testing más compleja de la necesaria;
* cobertura como métrica aislada de calidad.

