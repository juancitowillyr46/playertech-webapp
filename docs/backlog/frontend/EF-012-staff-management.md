# EF-012 Staff Management

## Objetivo

Permitir gestionar el directorio de staff de la academia, dar de alta usuarios con acceso y asignarlos a equipos con un rol técnico específico.

## Problema que Resuelve

La academia necesita registrar entrenadores y miembros del cuerpo técnico en una sola operación de negocio, definir cómo accederán a la plataforma y luego vincularlos a uno o varios equipos sin mezclar ese proceso con la edición del equipo.

## Valor de Negocio

Reduce fricción operativa en el alta de staff, ordena la base de usuarios deportivos y prepara una experiencia clara para la asignación del cuerpo técnico por equipo.

## Actores

* Tenant Owner
* Academy Admin

## Dominios Involucrados

* Staff
* Identity
* Team
* TeamStaffAssignment

## Referencia Backend

### Épica backend

* `EP-021 Gestión de Staff y Cuerpo Técnico`

### Endpoints visibles en Postman

* `POST /api/v1/academy/staff/onboarding`
* `POST /api/v1/academy/staff/assignments`
* `PATCH /api/v1/academy/staff/assignments/{assignmentId}/role`
* `PATCH /api/v1/academy/staff/assignments/{assignmentId}/remove`
* `GET /api/v1/academy/staff/teams/{teamId}`

### Contrato base observable

* Alta unificada:
  * `fullName`
  * `email`
  * `role`
  * `sendInvitation`
  * `password`
  * `passwordConfirmation`
* Asignación a equipo:
  * `staffId`
  * `teamId`
  * `role`
* Cambio de rol técnico:
  * `role`

## Historias de Usuario

* HU-001 Dar de alta miembro del staff.
* HU-002 Elegir modo de acceso para el staff.
* HU-003 Listar directorio de staff de la academia.
* HU-004 Asignar miembro del staff a un equipo.
* HU-005 Definir rol técnico por asignación.
* HU-006 Cambiar rol técnico.
* HU-007 Retirar miembro del cuerpo técnico.
* HU-008 Consultar cuerpo técnico de un equipo.

## HU-001 Dar de alta miembro del staff

Como owner o administrador de academia, quiero registrar un nuevo integrante del staff desde una sola pantalla, para dejar listo su acceso y su disponibilidad operativa sin separar el proceso en varias acciones técnicas.

### Criterios de aceptación

* Debe existir una acción principal `Nuevo miembro del staff`.
* La pantalla debe incluir como mínimo:
  * nombre completo
  * correo
  * rol funcional del sistema
  * selector de modo de acceso
* El rol funcional debe permitir al menos:
  * `ROLE_ACADEMY_ADMIN`
  * `ROLE_COACH`
* La UI debe modelar el alta como una sola operación de negocio.
* En la iteración mock, al guardar debe agregarse el registro al directorio local de staff.

### Reglas de UX

* No dividir visualmente la creación de usuario y la creación de staff.
* El lenguaje debe hablar de `Staff`, `Entrenador` o `Integrante`, no de `userId`.
* El formulario debe sentirse alineado al patrón ya usado en `Academia` y `Perfil`.

## HU-002 Elegir modo de acceso para el staff

Como owner o administrador de academia, quiero decidir si un miembro del staff recibirá invitación por correo o si crearé su contraseña desde la plataforma, para adaptar el alta según el contexto operativo.

### Criterios de aceptación

* Debe existir un selector claro entre:
  * enviar invitación
  * crear contraseña manualmente
* Si se elige invitación, no deben mostrarse campos de contraseña.
* Si se elige contraseña manual, deben mostrarse:
  * contraseña
  * confirmar contraseña
* Deben aplicarse validaciones de formato y coincidencia en la iteración mock.
* El estado de éxito debe indicar el modo usado:
  * `INVITATION`
  * `PASSWORD`

### Reglas de UX

* El selector debe ser simple y entendible para usuarios no técnicos.
* La pantalla no debe pedir el mismo dato dos veces si el modo elegido no lo requiere.
* El copy debe explicar la diferencia sin hablar en lenguaje de backend.

## HU-003 Listar directorio de staff de la academia

Como owner o administrador de academia, quiero ver el listado de staff de la academia, para saber quiénes están disponibles antes de asignarlos a equipos.

### Criterios de aceptación

* Debe existir una subvista de `Staff` dentro de `Academia`.
* El listado debe mostrar al menos:
  * nombre
  * correo
  * rol funcional
  * estado
  * acciones
* Debe permitir búsqueda local mock.
* Debe operar con el mismo patrón visual usado en `Sedes`, `Categorías` y `Equipos`.

### Reglas de UX

* Esta vista representa el directorio de personas, no el cuerpo técnico de un equipo específico.
* El estado debe entenderse con un vistazo.
* Debe dejar claro que desde aquí se registra el staff y desde equipos se asigna.

## HU-004 Asignar miembro del staff a un equipo

Como owner o administrador de academia, quiero asignar un integrante del staff a un equipo, para dejar configurado su cuerpo técnico.

### Criterios de aceptación

* Debe existir una acción principal desde el detalle del equipo.
* La asignación debe permitir seleccionar:
  * integrante del staff
  * rol técnico
* El selector debe usar integrantes disponibles del directorio de staff.
* La asignación debe aparecer de inmediato en el listado mock del equipo.

### Reglas de UX

* La asignación no debe vivir en la pantalla raíz de staff.
* El bloque debe sentirse parte del detalle del equipo.
* La acción principal debe hablar de `Asignar integrante` o equivalente.

## HU-005 Definir rol técnico por asignación

Como owner o administrador de academia, quiero definir el rol técnico de cada integrante dentro de un equipo, para reflejar correctamente su función deportiva.

### Criterios de aceptación

* Los roles técnicos disponibles deben corresponder al backend:
  * Entrenador principal
  * Entrenador asistente
  * Entrenador de porteros
  * Preparador físico
  * Nutricionista
  * Fisioterapia
* El rol técnico debe mostrarse como texto legible, no como enum.
* El rol funcional del sistema y el rol técnico deben verse como conceptos separados.

## HU-006 Cambiar rol técnico

Como owner o administrador de academia, quiero actualizar el rol técnico de una asignación existente, para mantener vigente la estructura del cuerpo técnico.

### Criterios de aceptación

* Debe existir una acción `Editar rol` o equivalente.
* Debe poder cambiarse el rol sin eliminar la asignación.
* El cambio debe reflejarse de inmediato en la iteración mock.

## HU-007 Retirar miembro del cuerpo técnico

Como owner o administrador de academia, quiero retirar a un integrante del cuerpo técnico de un equipo, para actualizar la operación sin borrar a la persona del directorio de staff.

### Criterios de aceptación

* Debe existir una acción de retiro por asignación.
* La acción debe pedir confirmación.
* El mensaje no debe sugerir eliminación definitiva del usuario.
* La asignación debe desaparecer del listado mock del equipo.

## HU-008 Consultar cuerpo técnico de un equipo

Como owner o administrador de academia, quiero ver el cuerpo técnico activo de un equipo, para revisar rápidamente quiénes lo componen y qué rol cumple cada persona.

### Criterios de aceptación

* Debe existir un bloque visible de `Cuerpo técnico` dentro del contexto de equipo.
* El listado debe mostrar al menos:
  * nombre
  * correo
  * rol técnico
  * estado
  * acciones
* Debe operar inicialmente con mocks.

### Reglas de UX

* El bloque debe sentirse parte del detalle del equipo.
* Debe reutilizar el patrón visual ya trabajado en `Sedes`, `Categorías` y `Equipos`.

## Reglas de UX Relacionadas

* Mantener separado el `directorio de staff` del `cuerpo técnico por equipo`.
* Mostrar roles funcionales con lenguaje humano:
  * Administrador de academia
  * Entrenador
* Mostrar roles técnicos con claridad y lenguaje humano.
* Confirmar retiros del equipo con copy explícito.
* Evitar que la asignación de staff compita visualmente con la edición base del equipo.

## Decisión de Estructura UX

Con el endpoint unificado `POST /api/v1/academy/staff/onboarding`, ahora sí conviene crear un tab de `Staff` dentro de `Academia`.

Eso implica:

* `Academia` funciona como pantalla padre.
* `Staff` aparece como subvista al mismo nivel que:
  * `Información`
  * `Sedes`
  * `Categorías`
  * `Equipos`
* El tab `Staff` concentra:
  * alta unificada
  * listado del directorio
  * estado y rol funcional
* El detalle de `Equipo` sigue concentrando:
  * asignación a equipo
  * cambio de rol técnico
  * retiro del cuerpo técnico

## Recomendación de Navegación

Sí, en esta etapa conviene crear un tab de `Staff` dentro de `Academia`.

### Motivo

* Ahora existe un flujo completo de alta en una sola operación de negocio.
* El usuario ya no piensa solo en asignar personas a equipos, sino también en registrar y administrar el directorio base de staff.
* Eso reduce fricción antes de entrar al detalle de cada equipo.

### Límite de esta decisión

`Staff` no debe pasar todavía a menú principal global.

Debe seguir viviendo dentro de `Academia`, porque:

* pertenece al tenant,
* depende del contexto de academia,
* su relación con equipos sigue siendo hija del dominio deportivo local.

## Estado

Done (Mock UI).
