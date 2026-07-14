# EF-009 Gestión de Matrículas

## Objetivo

Permitir crear y administrar la matrícula de un jugador dentro de la academia.

## Problema que Resuelve

La permanencia administrativa del jugador necesita seguimiento visible y ordenado.

## Valor de Negocio

Soporta el control de vigencia, historial y estado administrativo.

## Actores

* Tenant Owner
* Academy Admin
* Staff autorizado

## Dominios Involucrados

* Membership
* Player
* Academy

## Historias de Usuario

* HU-001 Crear matrícula desde el detalle del jugador.
* HU-002 Generar y mostrar cargos iniciales al activar la matrícula.
* HU-003 Ver matrícula activa del jugador.
* HU-004 Ver historial de matrículas.
* HU-005 Suspender matrícula.
* HU-006 Retirar matrícula.
* HU-007 Ver saldo administrativo y cargos pendientes del jugador.

## Reglas de UX Relacionadas

* Mostrar matrícula activa como entidad principal.
* Agrupar historial y estado actual.
* Dar claridad sobre suspendida, retirada y vigente.
* Mantener el flujo dentro del contexto del jugador antes de abrir un módulo financiero más amplio.
* Separar visualmente la gestión de matrícula de la consulta de cargos.

## Estado

Draft.

## Trazabilidad Actual

* HU-001 Crear matrícula desde el detalle del jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-002 Generar y mostrar cargos iniciales → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-003 Ver matrícula activa del jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Ver historial de matrículas → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Suspender matrícula → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-006 Retirar matrícula → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-007 Ver saldo administrativo y cargos pendientes → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
