# Players Domain Spec

## Objetivo

Definir el comportamiento verificable para alta, consulta, edición y administración de jugadores.

## Alcance

Incluye:

* listado;
* detalle;
* creación;
* edición;
* activación y desactivación;
* foto;
* preparación para matrícula, acudientes y equipos.
* evolución del perfil base del jugador con `documentType`, `documentNumber`, `nationality`, `gender`, `federationId` y `dominantFoot`.

## Fuente de verdad actual

* [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts)
* [src/app/features/players/pages/players-list.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\players-list.ts)
* [src/app/features/players/pages/player-form.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-form.ts)
* [src/app/features/players/pages/player-detail.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-detail.ts)
* [docs/backlog/frontend/EF-006-player-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-006-player-management.md)
* [docs/backlog/frontend/EF-007-guardian-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-007-guardian-management.md)
* [docs/backlog/frontend/EF-008-team-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-008-team-management.md)
* [docs/backlog/frontend/EF-009-membership-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-009-membership-management.md)

## Flujos

### PLY-PLAYER-FLW-001 Listado de jugadores

* Actor: staff autorizado.
* Entrada: ruta de listado.
* Resultado: ver jugadores con estado y acciones principales.

### PLY-PLAYER-FLW-002 Creación de jugador

* Actor: staff autorizado.
* Entrada: `/players/new`.
* Resultado: jugador creado con foto opcional y categoría seleccionada.

### PLY-PLAYER-FLW-003 Detalle y edición

* Actor: staff autorizado.
* Entrada: `/players/:id`.
* Resultado: ver y actualizar datos del jugador.

### PLY-PLAYER-FLW-004 Administración deportiva

* Actor: staff autorizado.
* Entrada: detalle del jugador.
* Resultado: gestionar acudientes, equipos y matrícula.

## Estados mínimos

* inicial;
* carga;
* vacío;
* error;
* éxito;
* inactivo;
* sin matrícula activa;
* sin acudientes;
* sin equipos activos.

## Formularios y validaciones visibles

* tipo de documento requerido;
* nombre y apellido requeridos;
* fecha de nacimiento requerida;
* documento requerido;
* nacionalidad, género, federación e pie dominante opcionales por ahora;
* categoría obligatoria;
* foto opcional;
* no duplicar asignación activa al mismo equipo;
* no eliminar acudiente primario;
* no crear matrícula si ya existe una activa.

## Reglas de aceptación

* El listado debe mostrar estado claro y acciones coherentes.
* El detalle debe priorizar información esencial y relaciones del jugador.
* La matrícula debe crear trazabilidad hacia cargos y deuda.
* La UI no debe asumir reglas de negocio no trazadas al backend.

## Vacíos a resolver

* reglas oficiales de foto;
* importación masiva;
* estados de error por relación con acudientes y equipos.

## Trazabilidad inicial

* `PLY-PLAYER-REQ-001` listar jugadores
* `PLY-PLAYER-REQ-002` crear jugador
* `PLY-PLAYER-REQ-003` ver detalle de jugador
* `PLY-PLAYER-REQ-004` actualizar jugador
* `PLY-PLAYER-REQ-005` administrar relaciones deportivas
