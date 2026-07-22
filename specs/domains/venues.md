# Venues Domain

## Scope

El dominio `Venues` cubre la administración de sedes de una academia tenant-scoped dentro del frontend de PlayerTech.

## Purpose

Permitir listar, crear, consultar, editar, activar, inactivar y eliminar sedes sin salir del contexto de `Academy`.

## References

* API base: `/api/v1/academy/venues`
* Respuesta de listado: `{ data, meta }`
* Contrato tenant-scoped resuelto por JWT
* Implementación UI actual: `src/app/features/academy/pages/academy-profile.ts`

## Functional Requirements

* `PLY-VENUE-REQ-001` Listar sedes del tenant actual.
* `PLY-VENUE-REQ-002` Crear una sede.
* `PLY-VENUE-REQ-003` Ver detalle de una sede.
* `PLY-VENUE-REQ-004` Editar una sede.
* `PLY-VENUE-REQ-005` Activar una sede.
* `PLY-VENUE-REQ-006` Inactivar una sede.
* `PLY-VENUE-REQ-007` Eliminar una sede si la UI decide exponer esa acción.

## UI Requirements

* `PLY-VENUE-UI-001` El listado debe mostrarse dentro del tab `Sedes` del perfil de academia.
* `PLY-VENUE-UI-002` El tab debe cargar la información solo cuando se abre por primera vez.
* `PLY-VENUE-UI-003` Si ya existe cache local válido, la UI debe reutilizarlo sin volver a pedir la misma página.
* `PLY-VENUE-UI-004` La tabla debe mostrar al menos `name`, `city`, `phone` y `status`.
* `PLY-VENUE-UI-005` Los campos opcionales deben marcarse visualmente como opcionales cuando aplique.
* `PLY-VENUE-UI-006` La acción de activar o inactivar debe confirmarse con dialog estándar.
* `PLY-VENUE-UI-007` Mientras una sede cambia de estado, la fila debe mostrar un indicador visible de proceso.

## Acceptance Criteria

* `PLY-VENUE-AC-001` Si la API devuelve `204 No Content` en una mutación, el listado se refresca.
* `PLY-VENUE-AC-002` El listado soporta paginación si `meta` la expone.
* `PLY-VENUE-AC-003` El skeleton cubre la sección completa del tab durante la carga.
* `PLY-VENUE-AC-004` No se envía `academy_id`.
* `PLY-VENUE-AC-005` El frontend usa payloads camelCase.
* `PLY-VENUE-AC-006` Los errores Problem Details se traducen a mensajes legibles.

## Implementation Notes

* La implementación debe seguir el estándar simple con `signals`.
* Evitar NgRx para este dominio.
* Evitar llamadas duplicadas si el tab ya cargó.
* Documentar cambios de comportamiento relevantes en la matriz de trazabilidad.
