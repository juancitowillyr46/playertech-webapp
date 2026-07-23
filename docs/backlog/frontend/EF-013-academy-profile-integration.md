# EF-013 Perfil de Academia e Integración

## Objetivo

Integrar el perfil de academia del contexto tenant con los endpoints reales de `Academy`, manteniendo una UI clara por secciones y un flujo de guardado predecible.

## Alcance

Incluye:

* consulta de perfil general de academia;
* edición de perfil general;
* consulta de información fiscal;
* edición de información fiscal;
* actualización del escudo institucional;
* estados de carga, vacío y error;
* refresco local de datos luego de guardar;
* manejo de validaciones del backend en formato `Problem Details`.

## Fuente de verdad

* [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts)
* [src/app/features/academy/data-access/academy-profile.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\academy-profile.service.ts)
* [src/app/features/academy/data-access/academy-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\academy-api.service.ts)
* [src/app/features/academy/models/academy.model.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\models\academy.model.ts)
* [docs/backlog/frontend/EF-003-academy-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-003-academy-management.md)
* [C:\Data\Source\Repos\playertech\postman\PlayerTech.postman_collection.json](C:\Data\Source\Repos\playertech\postman\PlayerTech.postman_collection.json)

## Contrato funcional

### Endpoints

* `GET /api/v1/academy/me`
* `PUT /api/v1/academy/me`
* `GET /api/v1/academy/me/tax-profile`
* `PUT /api/v1/academy/me/tax-profile`
* `POST /api/v1/academy/me/shield`

### Payload esperado

#### Perfil general

```json
{
  "name": "Academia PlayerTech",
  "contactEmail": "contacto@academiaplayertech.com",
  "phone": "+573125953354",
  "country": "Colombia",
  "department": "Cundinamarca",
  "city": "Bogota",
  "address": "Av. Principal 123"
}
```

#### Información fiscal

```json
{
  "taxIdType": "NIT",
  "taxIdNumber": "901234567-8",
  "taxCheckDigit": "8",
  "taxRegime": "RESPONSABLE_IVA",
  "billingEmail": "facturacion@academiaplayertech.com"
}
```

#### Escudo

* `multipart/form-data`
* campo `shield`

## Reglas de UX

* Separar visualmente:
  * datos generales de academia;
  * información fiscal;
  * escudo/logo.
* Mostrar loading durante la carga inicial y durante cada guardado.
* Mostrar empty state si el usuario no tiene academia asociada.
* Mostrar error recuperable si la carga falla.
* No mezclar en un único formulario bloques con distinta intención de edición.
* Mantener el refresco local luego de guardar sin recargar toda la aplicación.
* Usar copy funcional, sin exponer nombres técnicos de endpoint.

## Reglas técnicas

* El frontend debe consumir el contexto autenticado y respetar el tenant activo.
* El backend devuelve `data` y `meta`; el frontend debe tomar `data` como fuente de verdad.
* Las validaciones del backend deben mostrarse de forma legible para el usuario.
* Cualquier campo compuesto por `código de país + número de teléfono` debe mapearse en dos capas al hidratar el formulario:
  * `countryCode` para el prefijo internacional.
  * `phoneNumber` para el número local sin prefijo.
* Al persistir, el frontend debe recomponer ambos valores en un único `phone` o campo equivalente del contrato.
* La misma regla aplica para Academy y para cualquier otro formulario que use el mismo patrón compuesto.
* El escudo debe enviarse como archivo real, no como base64.
* El header `Authorization` debe ser inyectado por el interceptor global.

## Escenarios esperados

### PLY-ACA-INT-001 Carga de perfil

* Actor: usuario autenticado con contexto tenant.
* Resultado esperado: se muestran datos generales, fiscales y del escudo actual.

### PLY-ACA-INT-002 Guardado de perfil general

* Actor: owner o academy admin.
* Resultado esperado: el perfil general se actualiza y la pantalla refleja el cambio sin recargar la sesión completa.

### PLY-ACA-INT-003 Guardado fiscal

* Actor: owner o academy admin.
* Resultado esperado: la información fiscal se actualiza y el resumen se refresca localmente.

### PLY-ACA-INT-004 Subida de escudo

* Actor: owner o academy admin.
* Resultado esperado: el escudo se sube como archivo y la vista previa se actualiza con el recurso persistido.

## Estados mínimos

* carga;
* vacío;
* error;
* validación;
* guardado en progreso;
* guardado exitoso.

## Criterios de aceptación

* La pantalla debe cargar datos reales desde el backend.
* La edición debe mantenerse por secciones.
* El usuario debe poder distinguir entre guardar datos generales, fiscales y escudo.
* Los mensajes de error deben ser claros y accionables.
* No debe requerirse recargar la app para ver cambios guardados.

## Trazabilidad frontend reciente

### Implementación actual

* [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts)
* [src/app/features/academy/data-access/academy-profile.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\academy-profile.service.ts)
* [src/app/features/academy/data-access/academy-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\academy-api.service.ts)

### Decisiones trazadas

* El escudo institucional no bloquea el guardado del perfil general.
* El rol editable acepta los formatos legacy y `ROLE_*` para evitar falsos negativos de permisos.
* El skeleton del bloque de escudo y el bloque de seguridad se mantuvieron en contenedor blanco para coherencia visual.
* La validación de campos obligatorios no usa el estado del escudo como requisito.

### Estado del cambio

* Implementado y verificado con build local.
