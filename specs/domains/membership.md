# Membership Domain Spec

## Objetivo

Definir la matrícula como la condición que habilita los demás procesos operativos del jugador.

## Alcance

Incluye:

* creación de matrícula;
* estado de matrícula;
* habilitación de procesos posteriores;
* bloqueo de acciones operativas cuando no existe matrícula activa.

## Regla de negocio principal

Un jugador puede existir sin matrícula, pero mientras no tenga matrícula activa no deben habilitarse los procesos operativos posteriores.

## Procesos posteriores afectados

* equipo;
* cargos;
* mensualidad;
* seguimiento administrativo;
* otros procesos operativos que dependan de la inscripción formal.

## Criterios de aceptación

* Dado un jugador sin matrícula activa, cuando se revisa su contexto operativo, entonces las acciones posteriores deben verse deshabilitadas o bloqueadas.
* Dado un jugador con matrícula activa, cuando se revisa su contexto operativo, entonces los procesos posteriores deben quedar disponibles según permisos.
* Dado un jugador sin matrícula activa, cuando se intenta iniciar un proceso que depende de matrícula, entonces el sistema debe mostrar una guía clara para crear la matrícula primero.
* Dado un jugador con matrícula activa, cuando se crea o consulta su información operativa, entonces la relación con los demás procesos debe estar disponible.

## Estados mínimos

* sin matrícula;
* matrícula activa;
* matrícula suspendida;
* matrícula retirada;
* procesos bloqueados;
* procesos habilitados.

## Trazabilidad inicial

* `PLY-MEM-REQ-001` matrícula como habilitador
* `PLY-MEM-REQ-002` bloqueo de procesos sin matrícula
* `PLY-MEM-REQ-003` habilitación de procesos con matrícula

## Evidencia actual

* [src/app/features/players/pages/player-detail.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-detail.ts)
* [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts)
* [docs/backlog/frontend/EF-009-membership-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-009-membership-management.md)

