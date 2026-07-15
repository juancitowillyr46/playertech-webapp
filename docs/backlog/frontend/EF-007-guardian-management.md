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
* HU-012 Incluir identificación y parentesco en formularios de acudiente. `Done (Mock UI)`
* HU-013 Mostrar identificación y parentesco en listados y detalle de acudiente. `Done (Mock UI)`
* HU-014 Mostrar identificación y parentesco en la relación jugador-acudiente. `Done (Mock UI)`

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
* No asumir que el acudiente siempre tiene correo o teléfono.
* Mantener `Acudiente` como entidad separada del jugador, aunque se relacione con él.
* Usar `relationship` como el origen funcional del campo visible `Parentesco`.
* Los datos de identificación del acudiente deben poder apoyar el flujo financiero sin volver técnico el formulario.

## Estado

Done (Mock UI).

## Trazabilidad Actual

* HU-001 Listar acudientes asociados a un jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-002 Asociar acudiente existente a jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-003 Crear acudiente y asociarlo a jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Cambiar acudiente principal → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Eliminar asociación jugador-acudiente → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-006 Preparar módulo independiente de acudientes → `Done` → `src/app/features/guardians/guardians.routes.ts`, `src/app/layout/component/app.menu.ts`, `src/app.routes.ts`
* HU-007 Listar acudientes como entidad independiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardians-list.ts`
* HU-008 Ver detalle de acudiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-detail.ts`
* HU-009 Crear acudiente desde módulo independiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`
* HU-010 Editar acudiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`
* HU-011 Asociar jugador existente a acudiente desde su detalle → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-detail.ts`
* HU-012 Incluir identificación y parentesco en formularios de acudiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`, `src/app/features/players/pages/player-detail.ts`
* HU-013 Mostrar identificación y parentesco en listados y detalle de acudiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardians-list.ts`, `src/app/features/guardians/pages/guardian-detail.ts`
* HU-014 Mostrar identificación y parentesco en la relación jugador-acudiente → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`

## Detalle de HU-012

### HU-012 Incluir identificación y parentesco en formularios de acudiente

Como usuario administrativo, quiero registrar los datos completos del acudiente en un solo formulario, para contar con información útil de contacto, identificación y relación familiar.

#### Criterios de aceptación

* El formulario de creación y edición de acudiente debe incluir:
  * nombre
  * apellido
  * teléfono
  * correo
  * tipo de documento
  * número de documento
  * dirección
  * parentesco
* El frontend debe respetar el contrato:
  * `firstName`
  * `lastName`
  * `phone`
  * `email`
  * `documentType`
  * `documentNumber`
  * `address`
  * `relationship`
* `phone` y `email` pueden manejarse como opcionales si la UX lo requiere.
* `relationship` debe mostrarse al usuario como `Parentesco`.
* La UI debe contemplar valores legibles como:
  * Padre
  * Madre
  * Abuelo(a)
  * Tutor
  * Hermano(a)
  * Otro

#### Reglas de UX

* El formulario debe seguir la misma densidad visual del resto de entidades maestras.
* Los campos de identificación deben sentirse útiles, no burocráticos.
* El parentesco debe ser fácil de leer y seleccionar.

## Detalle de HU-013

### HU-013 Mostrar identificación y parentesco en listados y detalle de acudiente

Como usuario administrativo, quiero ver los datos de identificación y parentesco del acudiente en sus vistas de consulta, para reconocer rápidamente quién es y cómo se relaciona con el jugador.

#### Criterios de aceptación

* El listado general de acudientes debe incorporar los nuevos campos donde sea útil:
  * como columna directa
  * o como detalle secundario dentro de la fila
* El detalle del acudiente debe mostrar:
  * tipo de documento
  * número de documento
  * dirección
  * parentesco
* La vista no debe depender de que haya correo o teléfono configurado.
* La implementación puede operar con mocks mientras no exista integración real.

#### Reglas de UX

* No saturar la tabla con demasiadas columnas si puede resolverse mejor con detalle secundario.
* Priorizar legibilidad sobre densidad excesiva.

## Detalle de HU-014

### HU-014 Mostrar identificación y parentesco en la relación jugador-acudiente

Como usuario administrativo, quiero ver el parentesco y los datos relevantes del acudiente dentro del detalle del jugador, para entender claramente quién es el responsable principal o de apoyo.

#### Criterios de aceptación

* La sección de acudientes dentro del jugador debe mostrar `Parentesco`.
* Debe mantenerse visible el indicador de acudiente principal.
* La UI debe poder mostrar datos complementarios de contacto o identificación cuando aporten contexto.
* La relación jugador-acudiente debe seguir tratándose como entidad separada del jugador.

#### Reglas de UX

* El usuario debe distinguir rápidamente:
  * quién es el acudiente principal
  * cuál es el parentesco
  * cuál es el contacto de apoyo
* No duplicar formularios innecesarios entre módulo de jugador y módulo independiente de acudientes.
