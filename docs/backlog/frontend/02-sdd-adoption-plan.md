# Plan de adopción incremental SDD

Este documento convierte la auditoría de preparación en una ruta de ejecución gradual.

## Objetivo

Adoptar Spec-Driven Development sin reescribir el frontend completo ni congelar el trabajo funcional.

## Principios de ejecución

* Primero se documenta.
* Luego se caracteriza el comportamiento actual.
* Después se define el contrato compartido.
* Recién al final se reemplaza el mock por integración real.
* Nunca se toma la UI simulada como verdad absoluta del negocio.

## Fase 1 - Orden documental

Entregables:

* una spec por dominio prioritario;
* un mapa de trazabilidad mínimo;
* distinción explícita entre `mock UI`, `partial` y `confirmed`.

Resultado esperado:

* la documentación deja de ser descriptiva y empieza a ser verificable.

## Fase 2 - Caracterización

Entregables:

* pruebas de caracterización para auth;
* pruebas de caracterización para players;
* pruebas de caracterización para payments.

Resultado esperado:

* el comportamiento actual queda capturado antes de cualquier refactor.

## Fase 3 - Contrato

Entregables:

* contrato API identificable por dominio;
* alineación de modelos, enums y errores;
* definición clara de qué reglas viven en backend y cuáles son solo de presentación.

Resultado esperado:

* la UI deja de inferir reglas que deberían venir de una fuente compartida.

## Fase 4 - Trazabilidad

Entregables:

* IDs consistentes para requerimientos, UI, aceptación y prueba;
* backlinks entre spec, componente y test;
* actualización del backlog cuando cambie el alcance.

Resultado esperado:

* es posible seguir una cadena completa desde la regla hasta la evidencia.

## Artefactos de apoyo

* [Plantilla de criterios de aceptación](./04-sdd-acceptance-template.md)
* [Matriz de trazabilidad inicial](./05-sdd-traceability-matrix.md)

## Fase 5 - Integración real

Entregables:

* reemplazo progresivo de mocks;
* consumo real del backend en los flujos priorizados;
* retiro de comportamientos accidentales ya caracterizados.

Resultado esperado:

* el frontend empieza a depender de contratos reales y no solo de simulaciones locales.

## Orden recomendado de ataque

1. Auth and Access
1. Tenant Onboarding
1. Player Management
1. Membership Management
1. Payment Management

## Criterio para pasar de fase

No se avanza de fase hasta que:

* exista documentación mínima suficiente;
* el comportamiento actual esté caracterizado;
* el riesgo de romper flujos críticos sea aceptable.
