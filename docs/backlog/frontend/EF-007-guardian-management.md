# FE-007 Gestión de Acudientes

## Objetivo

Permitir registrar acudientes y administrar su relación con los jugadores.

## Problema que Resuelve

La operación administrativa necesita responsables claros para contacto y autorizaciones.

## Valor de Negocio

Soporta el vínculo legal y operativo entre familia y jugador.

## Actores

* Tenant Owner
* Academy Admin
* Staff autorizado

## Dominios Involucrados

* Guardian
* Player

## Historias de Usuario

* HU-001 Listar acudientes asociados a un jugador.
* HU-002 Asociar acudiente existente a jugador.
* HU-003 Crear acudiente y asociarlo a jugador.
* HU-004 Cambiar acudiente principal.
* HU-005 Eliminar asociación jugador-acudiente.
* HU-006 Preparar módulo independiente de acudientes.
* HU-007 Listar acudientes como entidad independiente.
* HU-008 Ver detalle de acudiente.
* HU-009 Crear acudiente desde módulo independiente.
* HU-010 Editar acudiente.
* HU-011 Asociar jugador existente a acudiente desde su detalle.

## Reglas de UX Relacionadas

* Identificar claramente el acudiente principal.
* Mostrar múltiples relaciones sin confusión.
* Confirmar cambios de principal.
* En bloques de acciones superiores, evitar grillas fijas para CTAs largos.
* Las acciones como `Asociar acudiente` y `Nuevo acudiente` deben:
  * apilarse en mobile;
  * usar ancho completo en resoluciones reducidas;
  * pasar a fila flexible con `wrap` cuando el espacio horizontal sea intermedio;
  * conservar un ancho mínimo uniforme en desktop.

## Estado

In Progress.

## Trazabilidad Actual

* HU-001 Listar acudientes asociados a un jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-002 Asociar acudiente existente a jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-003 Crear acudiente y asociarlo a jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Cambiar acudiente principal → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Eliminar asociación jugador-acudiente → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-006 Preparar módulo independiente de acudientes → `Done` → `src/app/features/guardians/guardians.routes.ts`, `src/app/layout/component/app.menu.ts`, `src/app.routes.ts`
* HU-007 Listar acudientes como entidad independiente → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardians-list.ts`
* HU-008 Ver detalle de acudiente → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardian-detail.ts`
* HU-009 Crear acudiente desde módulo independiente → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`
* HU-010 Editar acudiente → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`
* HU-011 Asociar jugador existente a acudiente desde su detalle → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardian-detail.ts`
