# Players Flow Spec

## Propósito

Convertir la gestión de jugadores en flujos concretos con criterios verificables.

## Flujos cubiertos

* List players
* Create player
* View player detail
* Update player
* Toggle player status
* Manage guardians
* Manage team assignments
* Create membership

## List players

### Pantalla

* [src/app/features/players/pages/players-list.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\players-list.ts)

### Criterios de aceptación

* Dado un usuario autorizado, cuando abre el listado, entonces puede ver jugadores con estado y acciones principales.
* Dado un listado vacío, cuando no existen jugadores, entonces la pantalla debe mostrar estado vacío y no parecer rota.
* Dado un jugador inactivo, cuando se muestra en listado, entonces su estado debe ser visible sin ambigüedad.

## Create player

### Pantalla

* [src/app/features/players/pages/player-form.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-form.ts)

### Criterios de aceptación

* Dado un usuario autorizado, cuando abre el formulario, entonces ve campos esenciales para registrar un jugador.
* Dado un formulario incompleto, cuando intenta guardar, entonces el sistema bloquea el envío y muestra errores.
* Dado un formulario válido, cuando guarda, entonces el jugador se crea y queda disponible en el listado.

## View and update detail

### Pantalla

* [src/app/features/players/pages/player-detail.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-detail.ts)

### Criterios de aceptación

* Dado un usuario autorizado, cuando abre el detalle, entonces ve datos esenciales del jugador antes que elementos secundarios.
* Dado un usuario autorizado, cuando edita datos del jugador, entonces el cambio debe ser visible en la misma vista después de guardar.

## Toggle player status

### Criterios de aceptación

* Dado un jugador activo, cuando se desactiva, entonces su estado cambia a inactivo.
* Dado un jugador inactivo, cuando se reactiva, entonces su estado cambia a activo.

## Manage guardians

### Criterios de aceptación

* Dado un jugador con acudientes, cuando se muestran relaciones, entonces el acudiente principal debe verse claramente.
* Dado un acudiente principal, cuando se intenta eliminar su relación, entonces la acción debe bloquearse o advertirse.
* Dado un jugador sin acudientes, cuando se abre el detalle, entonces la interfaz debe permitir iniciar la asociación.

## Manage team assignments

### Criterios de aceptación

* Dado un jugador con equipos activos, cuando se muestran asignaciones, entonces la principal debe distinguirse visualmente.
* Dado un equipo ya asignado activamente, cuando se intenta duplicar, entonces el sistema debe bloquear la operación.
* Dado un equipo principal finalizado, cuando ya no existe reemplazo activo, entonces el sistema debe impedir la acción o pedir confirmación explícita.

## Create membership

### Criterios de aceptación

* Dado un jugador sin matrícula activa, cuando se crea matrícula, entonces se genera matrícula activa.
* Dado un jugador con matrícula activa, cuando se intenta crear otra, entonces la operación debe ser rechazada o no duplicarse.
* Dado que se crea la matrícula, entonces deben generarse cargos iniciales visibles en el flujo financiero.

## Estados mínimos del dominio

* inicial
* con jugador activo
* con jugador inactivo
* sin acudientes
* sin equipo activo
* con matrícula activa
* sin matrícula activa

## Evidencia actual

* [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts)
* [docs/backlog/frontend/EF-006-player-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-006-player-management.md)

