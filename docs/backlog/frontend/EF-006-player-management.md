# FE-006 Gestión de Jugadores

## Objetivo

Permitir registrar, consultar y administrar jugadores dentro de la academia.

## Problema que Resuelve

El jugador es la entidad central del sistema y necesita una experiencia de gestión completa.

## Valor de Negocio

Es el núcleo operativo de formación, competición, matrícula y pagos.

## Actores

* Tenant Owner
* Academy Admin
* Staff autorizado

## Dominios Involucrados

* Player
* Academy
* Sports
* Membership

## Historias de Usuario

* HU-001 Listar jugadores.
* HU-002 Registrar jugador.
* HU-003 Ver detalle de jugador.
* HU-004 Actualizar jugador.
* HU-005 Desactivar jugador.
* HU-006 Reactivar jugador.
* HU-007 Subir o actualizar foto de jugador.
* HU-008 Preparar vista para matrícula, equipo y acudientes.
* HU-009 Preparar importación masiva de jugadores.

## Reglas de UX Relacionadas

* Mostrar datos esenciales primero.
* Separar datos administrativos de datos deportivos.
* Mostrar estado activo/inactivo claramente.
* Dar feedback preciso en importaciones masivas.
* En encabezados de cards o listados, las acciones primarias deben usar un contenedor responsive que:
  * apile botones en mobile;
  * use ancho completo en pantallas pequeñas;
  * pase a fila con `wrap` en ancho intermedio;
  * mantenga ancho mínimo visual uniforme en desktop para evitar botones estrechos o montados.

## Estado

In Progress.

## Trazabilidad Actual

* HU-001 Listar jugadores → `In Progress (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-002 Registrar jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-form.ts`
* HU-003 Ver detalle de jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Actualizar jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Desactivar jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-006 Reactivar jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-007 Subir o actualizar foto de jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-form.ts`, `src/app/features/players/pages/player-detail.ts`
