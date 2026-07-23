# Plan de caracterización inicial

Este plan define qué comportamientos deberían capturarse primero como evidencia automatizada o semiautomatizada.

## Objetivo

Evitar que los dominios críticos cambien sin una base de comportamiento conocida.

## Prioridad 1 - Auth

### Caracterizar

* validación de login;
* redirección por autenticación;
* bloqueo de rutas privadas;
* recuperación de contraseña;
* estado de perfil autenticado.

### Señal de éxito

* el comportamiento actual queda descrito en pruebas o checks repetibles.

## Prioridad 2 - Players

### Caracterizar

* listado;
* creación;
* edición;
* activación y desactivación;
* relaciones con acudientes;
* asignaciones deportivas;
* creación de matrícula y cargos iniciales.

### Señal de éxito

* los flujos críticos del jugador no cambian sin dejar rastro.

## Prioridad 3 - Payments

### Caracterizar

* catálogo de conceptos;
* deuda y filtros;
* historial de pagos;
* registro y anulación de pago;
* comprobantes y soportes;
* recaudo rápido.

### Señal de éxito

* la lógica financiera visible deja de depender solo de mocks no descritos.

## Orden de ejecución sugerido

1. login y logout
1. bloqueo de rutas privadas
1. crear y editar jugador
1. matrícula y cargos iniciales
1. conceptos de cobro
1. deuda y pagos

## Resultado esperado

* cada cambio futuro puede compararse con una línea base;
* la UI deja de ser una sola fuente de interpretación;
* el backlog puede moverse sin perder la evidencia previa.

