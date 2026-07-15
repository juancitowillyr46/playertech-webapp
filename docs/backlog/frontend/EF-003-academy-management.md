# FE-003 Gestión de Academias

## Objetivo

Permitir ver y administrar la academia propia o el inventario de academias desde el contexto root.

## Problema que Resuelve

La academia es el núcleo tenant de la plataforma y necesita una interfaz clara de administración.

## Valor de Negocio

Centraliza la operación institucional y el control del entorno multi-tenant.

## Actores

* Super Admin
* Tenant Owner
* Academy Admin

## Dominios Involucrados

* Academy

## Historias de Usuario

* HU-001 Consultar academia propia. `Done (Mock UI)`
* HU-002 Actualizar academia propia. `Done (Mock UI)`
* HU-003 Consultar academias desde plataforma. `Done`
* HU-004 Ver detalle de academia. `Partial`
* HU-005 Suspender o reactivar academia. `Done`
* HU-006 Subir escudo institucional. `Done (Mock UI)`
* HU-007 Navegar submódulos de academia desde tabs. `Done (Mock UI)`
* HU-008 Consultar información fiscal de la academia. `Done (Mock UI)`
* HU-009 Actualizar información fiscal de la academia. `Done (Mock UI)`
* HU-010 Mostrar resumen fiscal de la academia en contextos útiles. `Done (Mock UI)`

## Reglas de UX Relacionadas

* Diferenciar vista root y vista tenant.
* Confirmar acciones destructivas o de suspensión.
* Mantener separados los datos del usuario autenticado y los datos de la academia.
* Mantener separado el guardado de datos textuales y la carga del escudo institucional aunque el usuario perciba una sola acción final.
* Evitar exponer estados internos de la academia dentro del formulario principal del owner/admin.
* Usar a `Academia` como contenedor padre de submódulos como `Información` y `Sedes`.
* Evitar pantallas excesivamente largas apilando bloques heterogéneos cuando tabs simples resuelven mejor la navegación.
* En UI usar siempre el término `Información fiscal`, no `Datos fiscales`.
* No asumir múltiples perfiles fiscales: la academia tiene un único perfil fiscal principal/default.
* Mantener la información fiscal como bloque independiente del formulario operativo general de academia.

## Detalle de HU-001

### HU-001 Consultar academia propia

Como owner o administrador de academia, quiero consultar la información general de mi academia desde una pantalla propia y clara, para revisar sus datos institucionales sin confundirlos con mi perfil personal.

#### Criterios de aceptación

* La pantalla debe existir en una ruta propia distinta al perfil del usuario.
* Debe mostrar nombre de la academia, correo principal, teléfono, país, departamento, ciudad y dirección.
* Debe usar como referencia el contrato de `GET /api/v1/academy/me`.
* Debe funcionar con datos mock mientras no exista integración real.
* No debe mostrar campos del usuario autenticado como nombre personal, correo de login o roles.
* El estado de la academia no debe mostrarse dentro del formulario principal del owner/admin.
* Si el usuario no tiene academia asociada, la pantalla debe comunicarlo claramente.

#### Reglas de UX

* Mantener una estructura visual similar a los formularios principales ya definidos en la aplicación.
* Priorizar lectura y edición de datos institucionales por encima de indicadores secundarios.
* Evitar jerga técnica como `tenant`, `payload` o nombres de endpoint en la interfaz.

## Detalle de HU-002

### HU-002 Actualizar academia propia

Como owner o administrador de academia, quiero actualizar los datos generales de mi academia desde un formulario simple, para mantener la información institucional al día sin depender de soporte técnico.

#### Criterios de aceptación

* El formulario debe permitir editar `name`, `contactEmail`, `phone`, `country`, `department`, `address` y `city`.
* Debe usar como referencia el contrato de `PUT /api/v1/academy/me`.
* El teléfono debe mantener la misma lógica visual y validación usada en signup.
* País, departamento y ciudad deben seguir la misma lógica dependiente ya definida en otros formularios del proyecto.
* Debe validar campos obligatorios y formatos antes de guardar.
* Si el usuario solo modifica datos textuales, el sistema debe ejecutar únicamente la operación equivalente a actualización textual.
* El sistema debe funcionar con datos mock mientras no exista integración real.

#### Reglas de UX

* El usuario debe percibir una sola acción final de guardado.
* No mezclar el formulario textual con acciones administrativas como suspensión o reactivación.
* Mantener mensajes simples y orientados a tarea.

## Detalle de HU-006

### HU-006 Subir escudo institucional

Como owner o administrador de academia, quiero seleccionar, previsualizar y ajustar el escudo institucional antes de guardarlo, para asegurar que la imagen final represente correctamente a mi academia.

#### Criterios de aceptación

* La pantalla de academia debe incluir un bloque específico para `Escudo institucional`.
* El bloque debe estar visualmente separado de los datos textuales.
* Debe permitir seleccionar un archivo desde desktop o mobile.
* Al seleccionar un archivo, el flujo debe abrir un modal de previsualización y ajuste.
* El modal debe permitir al menos previsualización, zoom y recorte antes de aceptar.
* Al confirmar el modal, la imagen resultante debe actualizar solo la vista previa local dentro del formulario.
* La imagen no debe enviarse al servidor inmediatamente al cerrar el modal.
* El envío de la imagen debe quedar diferido hasta la acción final `Guardar cambios`.
* Debe usarse como referencia el contrato de `POST /api/v1/academy/me/shield`.
* El envío final no debe depender de base64 como contrato backend, sino de un archivo resultante equivalente a `Blob/File` en `multipart/form-data`.

#### Reglas de UX

* El usuario debe sentir que confirma todos sus cambios en una sola acción final.
* La previsualización local debe dejar claro que la nueva imagen aún no ha sido guardada definitivamente.
* El bloque debe ser simple: vista previa, nombre de archivo y acción principal de selección.

## Detalle de HU-007

### HU-007 Navegar submódulos de academia desde tabs

Como owner o administrador de academia, quiero navegar la gestión de mi academia mediante tabs claros dentro de la misma pantalla, para moverme entre información general y sedes sin sentir que cambio de módulo o pierdo contexto.

#### Criterios de aceptación

* La pantalla de academia debe mantener a `Academia` como contenedor padre.
* Debe existir una navegación interna por tabs, al menos con:
  * `Información`
  * `Sedes`
* El tab `Información` debe concentrar los datos institucionales y el escudo.
* El tab `Sedes` debe concentrar la mini gestión CRUD mock de sedes.
* Cambiar de tab no debe sacar al usuario de la ruta principal de academia.
* El header de academia debe mantenerse estable mientras cambia el contenido del tab.
* La navegación por tabs debe funcionar correctamente en desktop y mobile.

#### Reglas de UX

* Los tabs deben ser cortos, legibles y claramente activos.
* La tab activa debe ser muy evidente visualmente.
* No mezclar en un mismo submit los cambios de `Información` con la gestión operativa de `Sedes`.
* Si el número de tabs crece, en mobile deben poder desplazarse horizontalmente o transformarse en un selector compacto.

## Detalle de HU-008

### HU-008 Consultar información fiscal de la academia

Como owner o administrador de academia, quiero consultar la información fiscal principal de mi academia, para verificar qué datos se usarán en comprobantes operativos y procesos administrativos relacionados con pagos.

#### Criterios de aceptación

* La pantalla o tab de academia debe incluir una sección visible llamada `Información fiscal`.
* La UI debe usar como referencia `GET /api/v1/academy/me/tax-profile`.
* Deben mostrarse, con nombres funcionales amigables:
  * Razón social
  * Tipo de identificación
  * Número de identificación
  * Dígito de verificación
  * Dirección fiscal
  * Ciudad
  * País
  * Correo para facturación
* Si un dato no viene configurado, la UI debe mostrarlo como `No configurado`, `Opcional` o equivalente claro.
* El dígito de verificación debe verse como dato opcional.
* La implementación puede funcionar con mocks mientras no exista integración real.

#### Reglas de UX

* La sección debe ser simple y de lectura clara.
* No mezclar esta información con acciones como cambiar escudo, sedes o staff.
* Evitar exponer nombres técnicos del contrato backend como `taxIdType` o `billingEmail`.

## Detalle de HU-009

### HU-009 Actualizar información fiscal de la academia

Como owner o administrador de academia, quiero editar la información fiscal principal de mi academia desde un único formulario, para mantener actualizados los datos administrativos usados en comprobantes y procesos de cobro.

#### Criterios de aceptación

* Debe existir un solo formulario de edición para `Información fiscal`.
* La UI debe usar como referencia `PUT /api/v1/academy/me/tax-profile`.
* El formulario debe contemplar el mapeo funcional:
  * razón social
  * tipo de identificación
  * número de identificación
  * dígito de verificación
  * dirección fiscal
  * ciudad
  * país
  * correo para facturación
* El frontend debe considerar como contrato técnico mínimo:
  * `taxIdType`
  * `taxIdNumber`
  * `taxCheckDigit`
  * `taxRegime`
  * `billingEmail`
* El dígito de verificación debe ser opcional.
* La UI no debe inventar múltiples perfiles fiscales ni lógica de selección de perfil.
* La implementación puede operar con mocks mientras no exista integración real.

#### Reglas de UX

* El usuario debe percibir un bloque independiente, claro y corto.
* Los campos deben tener labels funcionales y no técnicos.
* Si un campo es opcional, debe indicarse sin ruido visual excesivo.

## Detalle de HU-010

### HU-010 Mostrar resumen fiscal de la academia en contextos útiles

Como usuario administrativo, quiero ver un resumen fiscal básico de la academia donde sea relevante, para entender rápidamente si la información operativa de facturación está completa.

#### Criterios de aceptación

* La UI puede mostrar un resumen fiscal breve en:
  * vista de academia propia
  * detalle útil dentro de contextos financieros
* El resumen no debe duplicar el formulario completo.
* Debe priorizar al menos:
  * razón social
  * identificación
  * correo para facturación
* Si faltan datos clave, la UI debe comunicarlo de forma simple.

#### Reglas de UX

* El resumen debe ser compacto.
* No debe competir visualmente con el contenido principal de la pantalla.
* Debe servir como lectura de estado, no como segundo formulario.

## Escenarios de Guardado

Para la edición de academia se deben contemplar explícitamente estos escenarios:

* Solo texto: ejecutar únicamente la actualización textual de academia.
* Solo escudo: ejecutar únicamente la carga del escudo institucional.
* Texto + escudo: ejecutar primero la actualización textual y luego la carga del escudo.

### Reglas para Guardado Combinado

* El usuario debe ver un solo botón principal de `Guardar cambios`.
* El frontend debe resolver internamente si hay cambios textuales, cambios de imagen o ambos.
* Si se actualiza texto y luego falla la imagen, el sistema debe comunicar un éxito parcial claro.
* Si falla la actualización textual, no debe intentarse la carga de imagen en la misma acción.

### Recomendación Técnica para Backend

Aunque el recorte y la vista previa de imagen puedan generarse localmente a partir de canvas o base64, el backend debe seguir considerando como contrato final:

* `POST /api/v1/academy/me/shield`
* `multipart/form-data`
* campo `shield`

El frontend debe poder convertir el resultado del crop a `Blob/File` antes del envío final.

## Fuera de Alcance

* Gestión de planes SaaS.
* Cobro de suscripciones.

## Estado

Done (Mock UI).

## Nota de Iteración

La implementación actual del frontend para academia se mantiene con datos mock.

En esta etapa:

* no se consumen aún `GET /api/v1/academy/me`, `PUT /api/v1/academy/me` ni `POST /api/v1/academy/me/shield`;
* la interfaz ya está separada del perfil del usuario autenticado;
* la trazabilidad se deja lista para la futura integración real sin cambiar la UX base.
