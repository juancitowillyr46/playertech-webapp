# EF-008 Team Management

## Objetivo

Permitir crear y administrar equipos deportivos desde el frontend de academia.

## Problema que Resuelve

La academia necesita organizar grupos competitivos o formativos dentro de una categoría sin depender de hojas externas o procesos manuales.

## Valor de Negocio

Facilita la operación deportiva, ordena la estructura competitiva y prepara la base para futuras asignaciones de jugadores y staff.

## Actores

* Tenant Owner
* Academy Admin
* Staff autorizado

## Dominios Involucrados

* Team
* Category
* TeamAssignment
* Player

## Referencia Backend

### Épica backend

* `EP-005 Gestión de Equipos`

### Endpoints visibles en Postman

* `POST /api/v1/academy/teams`
* `GET /api/v1/academy/teams`
* `GET /api/v1/academy/teams/{teamId}`
* `PUT /api/v1/academy/teams/{teamId}`
* `PATCH /api/v1/academy/teams/{teamId}/inactivate`
* `PATCH /api/v1/academy/teams/{teamId}/activate`

### Contrato base observable

* `name`
* `categoryId`

## Historias de Usuario

* HU-001 Crear equipo.
* HU-002 Listar equipos.
* HU-003 Ver detalle de equipo.
* HU-004 Actualizar equipo.
* HU-005 Desactivar equipo.
* HU-006 Reactivar equipo.
* HU-007 Preparar asignación de jugadores a equipo.
* HU-008 Asignar jugador a un equipo.
* HU-009 Marcar asignación como principal.
* HU-010 Cambiar equipo principal de un jugador.
* HU-011 Finalizar asignación deportiva.
* HU-012 Consultar asignaciones deportivas de un jugador.

## HU-001 Crear equipo

Como owner o administrador de academia, quiero crear un equipo dentro de una categoría, para organizar la operación deportiva de manera clara.

### Criterios de aceptación

* Debe existir una acción principal `Nuevo equipo`.
* El formulario debe contemplar como mínimo:
  * `name`
  * `categoryId`
* `name` debe ser obligatorio.
* `categoryId` debe ser obligatorio.
* La categoría debe seleccionarse desde un listado legible, no escribirse manualmente.
* Al guardar, el equipo debe aparecer de inmediato en el listado mock sin recargar la pantalla.

### Reglas de UX

* El formulario debe ser corto y directo.
* Debe usar el mismo lenguaje ya adoptado en academia, sedes y categorías.
* No debe exponer términos técnicos como `categoryId`.
* La categoría debe verse como `Categoría`.

## HU-002 Listar equipos

Como owner o administrador de academia, quiero consultar los equipos registrados, para revisar rápidamente su categoría y estado.

### Criterios de aceptación

* Debe existir una subvista de `Equipos` dentro del contexto de `Academia`.
* El listado debe mostrar al menos:
  * `Nombre`
  * `Categoría`
  * `Estado`
  * `Acciones`
* Debe permitir búsqueda local mock por nombre.
* Debe contemplar paginación mock alineada al contrato de listado.
* Debe mostrar chips o badges para el estado.

### Reglas de UX

* El listado debe priorizar lectura rápida.
* La categoría debe ser visible sin abrir detalle.
* El estado debe entenderse con un vistazo.

## HU-003 Ver detalle de equipo

Como owner o administrador de academia, quiero revisar el detalle de un equipo, para confirmar su información antes de editarlo o cambiar su estado.

### Criterios de aceptación

* Debe existir una acción de detalle o una vista equivalente desde el listado.
* El detalle debe mostrar:
  * nombre
  * categoría
  * estado
* Debe operar con mocks en esta iteración.

## HU-004 Actualizar equipo

Como owner o administrador de academia, quiero editar un equipo existente, para mantener actualizada su información operativa.

### Criterios de aceptación

* Debe existir una acción `Editar`.
* La edición debe reutilizar el mismo formulario base de creación.
* Debe permitir cambiar:
  * nombre
  * categoría
* Al guardar, el listado mock debe reflejar el cambio sin perder contexto.

### Reglas de UX

* Crear y editar deben sentirse como el mismo patrón.
* Si el formulario sigue siendo pequeño, puede resolverse en dialog.
* Si empieza a crecer por relaciones adicionales, debe migrar a página o panel dedicado.

## HU-005 Desactivar equipo

Como owner o administrador de academia, quiero inactivar un equipo, para evitar que siga operando sin borrar su historial.

### Criterios de aceptación

* Debe existir una acción de inactivación por registro.
* La acción debe pedir confirmación previa.
* El equipo debe seguir visible en el listado con estado inactivo.
* El cambio debe actualizar el badge de estado inmediatamente en mock.

### Reglas de UX

* No usar el término `Eliminar` si la intención real es inactivar.
* El mensaje debe dejar claro que el equipo deja de estar operativo.

## HU-006 Reactivar equipo

Como owner o administrador de academia, quiero reactivar un equipo inactivo, para volver a usarlo sin crearlo de nuevo.

### Criterios de aceptación

* Debe existir una acción de reactivación solo para equipos inactivos.
* Debe pedir confirmación breve antes de aplicar el cambio.
* El estado debe actualizarse inmediatamente en mock.

## HU-007 Preparar asignación de jugadores a equipo

Como owner o administrador de academia, quiero que el detalle de equipo quede listo para futuras asignaciones de jugadores, para no rediseñar la experiencia más adelante.

### Criterios de aceptación

* La primera iteración no debe implementar aún la asignación real de jugadores.
* La estructura de navegación debe permitir crecer hacia:
  * jugadores del equipo
  * staff del equipo
  * historial o actividad
* La UX inicial no debe mezclar creación de equipo con asignación de jugadores.

## HU-008 Asignar jugador a un equipo

Como administrador académico, quiero asignar un jugador a un equipo, para registrar su participación deportiva actual.

### Criterios de aceptación

* La acción debe existir desde el detalle del jugador.
* El formulario mock debe contemplar como mínimo:
  * `teamId`
  * `startDate`
* Debe permitir definir si la nueva asignación quedará como principal.
* No debe mezclar este flujo con matrícula ni con cobros.
* Al guardar, la nueva asignación debe aparecer de inmediato en el listado del jugador.

### Reglas de UX

* El lenguaje debe hablar de `participación deportiva` o `equipo`, no de contratos ni deuda.
* Si no hay equipos disponibles, la interfaz debe indicarlo con estado vacío claro.

## HU-009 Marcar asignación como principal

Como administrador académico, quiero definir cuál de los equipos activos del jugador es el principal, para reflejar correctamente su referencia deportiva actual.

### Criterios de aceptación

* La acción debe estar disponible solo para asignaciones activas no principales.
* Al marcar una asignación como principal, la anterior debe dejar de serlo.
* El cambio debe reflejarse inmediatamente en el listado mock.

## HU-010 Cambiar equipo principal de un jugador

Como administrador académico, quiero cambiar el equipo principal del jugador sin perder sus otras participaciones activas, para mantener el historial deportivo intacto.

### Criterios de aceptación

* El cambio debe operar sobre asignaciones activas existentes.
* La asignación anterior puede seguir activa aunque deje de ser principal.
* La interfaz debe mostrar con claridad cuál quedó como principal.

## HU-011 Finalizar asignación deportiva

Como administrador académico, quiero finalizar la participación del jugador en un equipo, para cerrar esa etapa sin borrar historial.

### Criterios de aceptación

* La acción debe existir solo para asignaciones activas.
* Al finalizar, la asignación debe pasar a histórico.
* Si era principal, la UI mock debe impedir la operación cuando no exista otro equipo activo que pueda asumir la principalidad.

### Reglas de UX

* No usar `Eliminar`.
* Usar una acción más precisa como `Finalizar`.

## HU-012 Consultar asignaciones deportivas de un jugador

Como administrador académico, quiero consultar las asignaciones deportivas del jugador, para distinguir su equipo principal, sus equipos activos y su historial.

### Criterios de aceptación

* Debe existir un tab o subvista `Equipos` dentro del detalle del jugador.
* El listado debe mostrar como mínimo:
  * equipo
  * categoría
  * inicio
  * fin
  * estado
  * principal
* Debe contemplar asignaciones activas e históricas.
* Debe permitir búsqueda local mock por equipo o categoría.

## Reglas de UX Relacionadas

* Mostrar la relación `equipo -> categoría` de forma explícita.
* Evitar formularios que mezclen equipo con jugadores o matrícula en la primera iteración.
* Mantener el mismo lenguaje visual de `Academia`, `Sedes` y `Categorías`.
* Priorizar una primera iteración simple: listado + formulario corto + cambio de estado.

## Decisión de Estructura UX

Para frontend, `Equipos` debe modelarse como capacidad hija de `Academia`, no como una pantalla aislada desde el primer día.

Eso implica:

* `Academia` funciona como pantalla padre.
* `Equipos` aparece como una subvista natural junto a:
  * `Información`
  * `Sedes`
  * `Categorías`
* La navegación recomendada para esta iteración es mediante tabs.

## Recomendación de Navegación

Sí, en esta etapa conviene crear un tab de `Equipos`.

### Motivo

* Un equipo pertenece a una academia.
* Además depende funcionalmente de una categoría.
* El usuario owner/admin entiende mejor esta operación dentro del contexto de academia que en un módulo desconectado.

### Límite de esta decisión

Si más adelante `Equipos` crece hacia:

* plantilla de jugadores,
* staff técnico,
* calendario,
* métricas,
* historial,

entonces podrá evolucionar a una pantalla propia sin perder la coherencia del modelo inicial.

## Estado

Done (Mock UI).
