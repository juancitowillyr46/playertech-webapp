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

* HU-001 Crear sede. `Done`
* HU-002 Listar sedes. `Done`
* HU-003 Ver detalle de sede. `Done`
* HU-004 Actualizar sede. `Done`
* HU-005 Activar o inactivar sede. `Done`
* HU-006 Crear categoría. `Done`
* HU-007 Listar categorías. `Done`
* HU-008 Actualizar categoría. `Done`
* HU-009 Activar o inactivar categoría. `Done`

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
* Al guardar, la nueva sede debe reflejarse en el listado sin recargar la pantalla.
* El frontend consume el contrato real del backend para sedes.

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
* Debe operar con el contrato real del backend.

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

`Sedes` ya quedó implementado en frontend con contrato real tenant-scoped, tomando como referencia:

* la épica backend `EP-002`
* el endpoint de listado visible en Postman `GET /api/v1/academy/venues`
* la estructura del módulo backend `Venue`, que contempla crear, ver, actualizar, activar e inactivar

La UX base se conservó simple para permitir futuras extensiones sin reescritura.

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

## HU de Categorías

### HU-006 Crear categoría

Como owner o administrador de academia, quiero registrar una categoría deportiva, para organizar jugadores y equipos por rango de edad dentro de la academia.

#### Referencia backend

* Épica backend: `EP-004 Gestión de Categorías`
* Endpoint visible en Postman:
  * `POST /api/v1/academy/categories`
* Body de referencia:
  * `categoryKey`
  * `name`
  * `minAge`
  * `maxAge`
  * `description`

#### Criterios de aceptación

* Debe existir una acción principal `Nueva categoría`.
* La creación debe resolverse desde un formulario simple y consistente con la administración deportiva de la academia.
* El formulario debe contemplar como mínimo:
  * `categoryKey`
  * `name`
  * `minAge`
  * `maxAge`
  * `description`
* `categoryKey` debe ser obligatorio.
* `name` debe ser obligatorio.
* `minAge` debe ser obligatorio.
* `maxAge` debe ser obligatorio.
* `description` debe ser opcional.
* El frontend debe validar que `minAge` sea menor que `maxAge`.
* El frontend debe prevenir visualmente duplicados evidentes de nombre o clave dentro del conjunto cargado.
* Al guardar, la nueva categoría debe aparecer en el listado sin recargar la pantalla.
* El frontend consume el contrato real del backend para categorías.

#### Reglas de UX

* Mostrar edad mínima y máxima con etiquetas claras.
* Evitar lenguaje técnico como `categoryKey` en la interfaz visible.
* La acción principal debe ser inequívoca: `Guardar categoría`.
* El usuario debe entender rápidamente que la categoría define un rango etario.

### HU-007 Listar categorías

Como owner o administrador de academia, quiero consultar el listado de categorías registradas, para saber cuáles están activas y qué rangos de edad cubren.

#### Referencia backend

* Endpoint visible en Postman:
  * `GET /api/v1/academy/categories`
* Query params:
  * `page`
  * `per_page`
  * `sort`
  * `direction`
* Respuesta de referencia:
  * `data`
  * `meta`

#### Criterios de aceptación

* Debe existir una sección específica de `Categorías` dentro del contexto deportivo de la academia.
* El listado debe usar tabla o layout administrativo consistente con sedes y academias.
* Debe mostrar al menos las columnas:
  * `Nombre`
  * `Clave`
  * `Rango de edad`
  * `Estado`
* El rango de edad debe mostrarse de forma legible, por ejemplo `11 a 12 años`.
* Debe permitir búsqueda local mock por nombre o clave.
* Debe contemplar paginación mock alineada al contrato `data/meta`.
* Debe incluir acciones por registro para ver, editar y cambiar estado.
* Debe reflejar estado activo o inactivo con badges visibles.

#### Reglas de UX

* El listado debe priorizar lectura rápida del rango de edad.
* La tabla no debe saturarse con demasiados campos secundarios.
* El estado debe distinguirse visualmente sin depender solo del texto.
* Debe mantenerse usable en desktop y mobile.

### HU-008 Actualizar categoría

Como owner o administrador de academia, quiero editar una categoría existente, para corregir su nombre, clave o rango de edad cuando sea necesario.

#### Referencia backend

* Endpoint visible en Postman:
  * `PUT /api/v1/academy/categories/{categoryId}`
* Body de referencia:
  * `categoryKey`
  * `name`
  * `minAge`
  * `maxAge`
  * `description`

#### Criterios de aceptación

* Debe existir una acción `Editar` por cada categoría.
* La edición debe reutilizar el mismo formulario base de creación.
* Debe permitir modificar:
  * clave
  * nombre
  * edad mínima
  * edad máxima
  * descripción
* Debe validar obligatorios antes de guardar.
* Debe validar que `minAge` sea menor que `maxAge`.
* Al guardar, el listado mock debe reflejar el cambio sin perder contexto.
* Debe existir una acción clara para cancelar la edición.

#### Reglas de UX

* La edición debe sentirse igual a crear, sin introducir otro patrón visual innecesario.
* Si se usa diálogo, no debe afectar scroll, overlays ni selects.

## Trazabilidad frontend

### Implementación actual

* [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts)
* [src/app/features/academy/data-access/venue-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\venue-api.service.ts)
* [src/app/features/academy/data-access/category-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\category-api.service.ts)
* [src/app/features/academy/models/venue.model.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\models\venue.model.ts)
* [src/app/features/academy/models/category.model.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\models\category.model.ts)

### Decisiones documentadas

* La vista de `Academia` mantiene `Sedes` y `Categorías` dentro del tab `academy-profile`.
* La carga es diferida por tab y se evita repetir solicitudes ya resueltas.
* `Venue` y `Category` usan `page`, `per_page`, `sort` y `direction`.
* Las mutaciones refrescan el listado y preservan la trazabilidad visual del estado.
* `Category` mantiene `categoryKey` en camelCase como contrato interno y de API.
* Si el formulario crece, debe preferirse página dedicada o bloque expandible limpio.

### HU-009 Activar o inactivar categoría

Como owner o administrador de academia, quiero activar o inactivar una categoría, para controlar si sigue disponible en la operación sin eliminar su historial.

#### Referencia backend

* Endpoints visibles en Postman:
  * `PATCH /api/v1/academy/categories/{categoryId}/inactivate`
  * `PATCH /api/v1/academy/categories/{categoryId}/activate`

#### Criterios de aceptación

* Cada categoría debe permitir cambiar su estado según su estado actual.
* La acción debe pedir confirmación previa.
* Una categoría inactiva debe seguir visible en el listado.
* El cambio debe actualizar el badge de estado inmediatamente en el mock.
* El texto de confirmación debe ser claro y orientado a operación.
* El usuario debe entender que inactivar una categoría evita su uso operativo, pero no la elimina.

#### Reglas de UX

* No usar el término `eliminar` si la intención real es desactivar.
* Activar e inactivar deben distinguirse visualmente.
* El estado debe quedar visible también después del cambio, sin obligar a refrescar la pantalla.

## Estado

Done.

## Nota operativa de caché

Para `Sedes`, el frontend debe usar cache simple en memoria con `signals`.

Comportamiento esperado:

* la API se consume la primera vez que el usuario entra al tab `Sedes`;
* si el usuario cambia de tab y vuelve, se reutiliza la respuesta ya cargada;
* después de `create`, `update`, `activate`, `inactivate` o `delete`, se refresca el listado;
* no se introduce NgRx para este caso de uso;
* la implementación debe permanecer local a la feature y sencilla de seguir;
* el comportamiento actual ya usa cache simple con `signals` y paginación apoyada en `meta`.
