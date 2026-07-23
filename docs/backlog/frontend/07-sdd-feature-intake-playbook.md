# Guía de entrada para nuevas features con SDD escalonado

Este documento define cómo organizar features nuevas que aparezcan en el camino, sin sobredimensionar la documentación ni saltar directo a implementación.

## Objetivo

Mantener el frontend ordenado mientras la especificación madura por etapas.

## Regla base

Ninguna feature nueva debería empezar como código aislado.
Primero debe nacer como contexto funcional identificado, luego como spec mínima, luego como UI, y solo después como integración.

## Secuencia escalonada

### Etapa 1 - Encaje funcional

Responder estas preguntas:

* ¿a qué dominio pertenece?;
* ¿qué problema resuelve?;
* ¿quién la usa?;
* ¿es una feature nueva o una extensión de una existente?;
* ¿depende de otro dominio para existir?

Resultado:

* se decide ubicación y ownership.

### Etapa 2 - Spec mínima

Definir solo lo esencial:

* objetivo;
* alcance;
* actores;
* flujos principales;
* estados visibles;
* vacíos conocidos;
* dependencias.

Resultado:

* la feature ya tiene una fuente de verdad documental mínima.

### Etapa 3 - Criterios de aceptación

Escribir criterios verificables para el flujo principal.

Regla:

* un criterio por comportamiento observable.

Resultado:

* la feature deja de depender de interpretaciones verbales.

### Etapa 4 - UI y rutas

Definir:

* rutas;
* páginas;
* componentes locales;
* estados vacíos, carga y error;
* navegación posterior.

Resultado:

* la feature puede implementarse sin romper límites de arquitectura.

### Etapa 5 - Integración de datos

Definir:

* servicio de `data-access`;
* modelos o DTOs adaptados;
* mapeo necesario;
* contrato API o mock temporal;
* manejo de errores.

Resultado:

* la UI consume datos de forma controlada.

### Etapa 6 - Caracterización opcional

Cuando la feature sea crítica o cambie mucho:

* capturar comportamiento actual;
* documentar decisiones implícitas;
* preparar pruebas sin forzar refactor inmediato.

Resultado:

* la feature puede evolucionar sin perder base histórica.

## Qué debe crear una feature nueva

Mínimo esperado:

* una entrada en `docs/backlog/frontend/00-frontend-backlog-index.md` si es visible para usuario;
* una spec en `specs/domains/`;
* una matriz o fila de trazabilidad inicial;
* un criterio de aceptación por flujo principal.

## Qué no debe hacer todavía

* no crear pruebas por inercia si el flujo aún no está claro;
* no inventar contratos backend;
* no mover componentes a `shared` por anticipado;
* no meter lógica de negocio en páginas solo por velocidad;
* no saltar de idea a refactor.

## Criterio para escalar una feature

La feature puede pasar a implementación más amplia cuando:

* está ubicada en el dominio correcto;
* tiene spec mínima;
* sus criterios de aceptación son observables;
* sus dependencias están claras;
* los estados críticos están definidos.

## Criterio para considerar una feature madura

Una feature está madura cuando además:

* tiene trazabilidad consistente;
* tiene contrato o fuente de verdad identificada;
* sus estados visibles no dependen de supuestos;
* su crecimiento no rompe otras features.

