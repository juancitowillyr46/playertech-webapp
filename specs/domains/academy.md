# Academy Domain Spec

## Objetivo

Definir el comportamiento verificable del perfil de academia, su edición principal, el manejo del teléfono con prefijo internacional y el flujo del escudo institucional.

## Alcance

Incluye:

* consulta del perfil de academia;
* edición de datos generales;
* separación entre `countryCode` y `phoneNumber` al hidratar el formulario;
* recomposición del teléfono antes de guardar;
* carga, reemplazo y eliminación del escudo institucional;
* vista previa del escudo;
* estados de carga, error y confirmación de acciones;
* trazabilidad de cambios hacia backend y UI.

## Fuente de verdad actual

* [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts)
* [src/app/features/academy/data-access/academy-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\academy-api.service.ts)
* [src/app/features/academy/data-access/academy-profile.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\academy-profile.service.ts)
* [docs/backlog/frontend/EF-003-academy-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-003-academy-management.md)

## Flujos

### ACD-ACADEMY-FLW-001 Consulta del perfil

* Actor: owner o admin de academia.
* Entrada: tab o pantalla de `Academia`.
* Resultado: ver datos generales e información visual de la academia.

### ACD-ACADEMY-FLW-002 Edición de datos generales

* Actor: owner o admin de academia.
* Entrada: formulario de información general.
* Resultado: actualizar nombre, correo, teléfono y ubicación de la academia.

### ACD-ACADEMY-FLW-003 Manejo del teléfono

* Actor: owner o admin de academia.
* Entrada: formulario de información general.
* Resultado: hidratar el valor completo del backend separando código de país y número local; al guardar, recomponer el valor final.

### ACD-ACADEMY-FLW-004 Gestión del escudo institucional

* Actor: owner o admin de academia.
* Entrada: bloque de `Escudo institucional`.
* Resultado: seleccionar imagen, previsualizar, recortar, guardar, reemplazar o eliminar.

## Estados mínimos

* inicial;
* carga;
* vacío;
* error;
* éxito;
* pendiente de guardado;
* subiendo escudo;
* borrando escudo;
* vista previa abierta.

## Reglas funcionales

* La academia debe mantener un único perfil editable.
* El formulario debe mostrar el teléfono en dos partes: `countryCode` y `phoneNumber`.
* Si el backend entrega el teléfono como un solo string con prefijo, la UI debe separarlo al hidratar.
* Al guardar, el frontend debe reconstruir el teléfono antes de enviar el payload.
* El escudo institucional debe subirse mediante `multipart/form-data`.
* El campo del archivo debe llamarse exactamente `shield`.
* La eliminación del escudo debe tratarse como una acción distinta con respuesta `204`.
* La UI debe permitir vista previa antes de confirmar el guardado.
* La UI debe distinguir entre guardar cambios de texto y subir/borrar el escudo.
* La UI no debe recargar todo el formulario si solo cambió el escudo.

## Reglas de UX

* Mostrar feedback claro durante la carga.
* Usar mensajes simples y consistentes para usuarios con poca experiencia técnica.
* La vista previa del escudo debe poder abrirse desde la imagen o una acción explícita.
* Mantener consistencia visual entre mobile y desktop.

## Trazabilidad inicial

* `PLY-ACADEMY-REQ-001` consultar perfil de academia
* `PLY-ACADEMY-REQ-002` editar datos generales de academia
* `PLY-ACADEMY-REQ-003` hidratar y recomponer teléfono internacional
* `PLY-ACADEMY-REQ-004` subir, reemplazar y eliminar escudo institucional
* `PLY-ACADEMY-REQ-005` previsualizar escudo institucional

