# FE-005 Gestión de Configuración Deportiva

## Objetivo

Administrar la base deportiva de la academia desde el frontend.

## Problema que Resuelve

La operación deportiva necesita sedes y categorías visibles y editables.

## Valor de Negocio

Da soporte a la organización básica de jugadores y equipos.

## Actores

* Tenant Owner
* Academy Admin

## Dominios Involucrados

* Academy
* Sports

## Historias de Usuario

* HU-001 Crear sede. `Draft`
* HU-002 Listar sedes. `Draft`
* HU-003 Ver detalle de sede. `Draft`
* HU-004 Actualizar sede. `Draft`
* HU-005 Activar o inactivar sede. `Draft`
* HU-006 Crear categoría.
* HU-007 Listar categorías.
* HU-008 Actualizar categoría.
* HU-009 Activar o inactivar categoría.

## Reglas de UX Relacionadas

* Mostrar rangos de edad de forma comprensible.
* Evitar formularios ambiguos para categoría.
* Indicar estado activo/inactivo en listados.
* Mantener la administración de sedes separada de equipos y jugadores.
* Priorizar nombre, ciudad, teléfono y estado como datos visibles en listado.
* Resolver altas y ediciones con formularios simples y consistentes con el resto del sistema.
* No exponer lenguaje técnico de API, tenant o payload.
* Exponer `Sedes` como una subvista natural de `Academia`, no como una pantalla aislada sin contexto.

## HU de Sedes

### HU-001 Crear sede

Como owner o administrador de academia, quiero registrar una sede de mi academia desde un formulario claro, para organizar las ubicaciones donde operan mis equipos.

#### Referencia backend

* Épica backend: `EP-002 Gestión de Sedes`
* Ruta base: `GET /api/v1/academy/venues`
* Controlador backend detectado: `VenueController`
* La colección Postman actual expone explícitamente el listado.
* La estructura backend y el módulo `Venue` indican también soporte para crear, ver, actualizar, activar e inactivar.

#### Criterios de aceptación

* Debe existir una acción principal `Nueva sede`.
* La creación debe abrir un formulario consistente con los formularios ya trabajados en academia y onboarding.
* El formulario debe contemplar como mínimo:
  * `name`
  * `address`
  * `city`
  * `phone`
  * `notes`
* `name` debe ser obligatorio.
* `city` debe ser obligatorio.
* `phone` debe seguir una validación simple y comprensible para frontend mock.
* `notes` debe ser opcional.
* Al guardar, la nueva sede debe reflejarse en el listado mock sin recargar la pantalla.
* Mientras no exista integración real, el flujo debe operar con mocks alineados al dominio `Venue`.

#### Reglas de UX

* Mantener un formulario compacto, directo y fácil de entender.
* Evitar una jerarquía visual pesada o recargada.
* Usar etiquetas simples como `Nombre de la sede`, `Ciudad`, `Teléfono` y `Notas`.
* La acción principal debe ser inequívoca: `Guardar sede`.

### HU-002 Listar sedes

Como owner o administrador de academia, quiero consultar el listado de sedes registradas, para conocer rápidamente cuáles están disponibles y en qué estado se encuentran.

#### Referencia backend

* Endpoint visible en Postman:
  * `GET /api/v1/academy/venues`
* Query params:
  * `page`
  * `per_page`
  * `sort`
  * `direction`
* Respuesta de referencia:
  * `data`
  * `meta`

#### Criterios de aceptación

* Debe existir una pantalla o sección específica de `Sedes`.
* El listado debe usar tabla o layout administrativo consistente con academias.
* Debe mostrar al menos las columnas:
  * `Nombre`
  * `Ciudad`
  * `Teléfono`
  * `Estado`
* Debe permitir búsqueda local mock por nombre o ciudad.
* Debe contemplar paginación mock alineada al contrato `data/meta`.
* Debe reflejar estado activo o inactivo con chips o badges visibles.
* Debe incluir acciones por registro para ver, editar y cambiar estado.

#### Reglas de UX

* El listado debe ser el protagonista, no las métricas.
* La búsqueda debe ser visible y fácil de usar.
* El estado debe leerse rápido sin abrir detalle.
* La tabla debe mantenerse usable en desktop y mobile.

### HU-003 Ver detalle de sede

Como owner o administrador de academia, quiero abrir el detalle de una sede, para revisar su información completa antes de editarla o cambiar su estado.

#### Criterios de aceptación

* Debe existir una acción `Ver` o equivalente desde cada fila.
* El detalle puede mostrarse como página o como panel dedicado según la arquitectura final del módulo.
* Debe mostrar los datos completos de la sede:
  * nombre
  * dirección
  * ciudad
  * teléfono
  * notas
  * estado
* Debe mantener separación entre lectura y edición.
* Debe operar con mocks mientras no exista integración real.

#### Reglas de UX

* Mostrar la información en un formato limpio y de lectura rápida.
* Evitar mezclar el detalle con acciones destructivas en el mismo bloque visual.

### HU-004 Actualizar sede

Como owner o administrador de academia, quiero editar una sede existente, para mantener actualizada la información operativa de la academia.

#### Criterios de aceptación

* Debe existir una acción `Editar` por cada sede.
* La edición debe reutilizar el mismo formulario base de creación.
* Debe permitir modificar:
  * nombre
  * dirección
  * ciudad
  * teléfono
  * notas
* Debe validar obligatorios antes de guardar.
* Al guardar, el listado mock debe reflejar el cambio sin perder contexto.
* Debe existir una acción clara para cancelar la edición.

#### Reglas de UX

* La edición debe sentirse igual a crear, sin cambiar innecesariamente el patrón visual.
* Si se usa dialog, no debe comprometer selects, scroll ni overlays.
* Si el formulario crece, debe preferirse página dedicada.

### HU-005 Activar o inactivar sede

Como owner o administrador de academia, quiero activar o inactivar una sede, para controlar si puede seguir usándose en la operación sin borrar su historial.

#### Referencia backend

* Backend detectado:
  * `PATCH /api/v1/academy/venues/{venueId}/inactivate`
  * `PATCH /api/v1/academy/venues/{venueId}/activate`

#### Criterios de aceptación

* Cada sede debe permitir cambiar su estado según su estado actual.
* La acción debe pedir confirmación previa.
* Una sede inactiva debe seguir visible en el listado.
* El cambio debe actualizar el badge de estado inmediatamente en el mock.
* El texto de confirmación debe ser claro y orientado a operación.

#### Reglas de UX

* No usar el término `delete` si la intención real es inactivar.
* La acción debe distinguirse visualmente entre activar e inactivar.
* El usuario debe entender que la sede deja de estar operativa, no que desaparece.

## Nota de Iteración

La primera iteración frontend de `Sedes` debe trabajar con mocks, tomando como referencia:

* la épica backend `EP-002`
* el endpoint de listado visible en Postman `GET /api/v1/academy/venues`
* la estructura del módulo backend `Venue`, que ya contempla crear, ver, actualizar, activar e inactivar

La integración real puede abordarse después sin cambiar la UX base.

## Decisión de Estructura UX

Para el frontend actual, `Sedes` se modela como capacidad hija de `Academia`.

Eso implica:

* `Academia` funciona como pantalla padre.
* `Sedes` vive dentro de esa pantalla como subvista navegable.
* La navegación recomendada para esta iteración es mediante tabs simples, al menos:
  * `Información`
  * `Sedes`

Esta decisión busca:

* mantener contexto institucional;
* evitar una navegación fragmentada demasiado pronto;
* permitir que el usuario entienda que una sede pertenece a su academia y no a un módulo aislado.

## Estado

Draft.
