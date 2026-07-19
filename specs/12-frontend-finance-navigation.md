# 12-frontend-finance-navigation.md

# Finance Navigation Standard

Este documento define cómo debe exponerse el contexto financiero en la navegación principal del frontend.

La intención es separar la operación de academia de la configuración y consulta financiera sin duplicar pantallas innecesariamente.

---

# Objetivo

Agrupar en un mismo contexto visible todo lo relacionado con facturación, cobros y pagos.

---

# Regla Principal

La navegación financiera debe vivir bajo un grupo propio llamado `Finanzas`.

No debe mezclarse como tab operativo dentro de `Academia` cuando la intención funcional sea financiera.

---

# Menú Recomendado

## Finanzas

* `Información fiscal`
* `Conceptos de cobro`
* `Cargos y deuda`
* `Pagos`

---

# Encaje por Dominio

## Academia

Debe conservar:

* información general;
* escudo;
* sedes;
* categorías;
* equipos;
* staff.

## Finance

Debe concentrar:

* datos fiscales;
* configuración de cobro;
* estados de deuda;
* historial de pagos.

---

# UX Guidelines

* El usuario debe entender rápido si está en operación o en finanzas.
* Cada submenú debe mostrar un icono claro y consistente.
* La información fiscal no debe ocultarse dentro de un tab largo de academia.
* Si una pantalla ya existe y aún se reutiliza temporalmente, puede apuntarse desde el menú financiero con un acceso directo.

---

# Transition Rule

Durante la migración, la pantalla de academia puede seguir albergando la implementación actual de información fiscal.

Pero la navegación visible al usuario debe priorizar el grupo `Finanzas`.

---

# Non Goals

No define:

* reglas contables;
* cálculos financieros;
* diseño detallado de cada pantalla financiera;
* integración completa de nuevos servicios.
