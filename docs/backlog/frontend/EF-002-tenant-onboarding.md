# FE-002 Onboarding de Tenant

## Objetivo

Guiar el alta inicial de un tenant y su primer acceso operativo.

## Problema que Resuelve

El tenant necesita una primera experiencia controlada para comenzar a operar sin intervención manual excesiva.

## Valor de Negocio

Acelera la activación de nuevas academias dentro de la plataforma.

## Actores

* Super Admin
* Tenant Owner
* Academy Admin

## Dominios Involucrados

* Academy
* Identity
* Auth

## Historias de Usuario

* HU-001 Registrar tenant desde flujo público. `Done`
* HU-002 Validar correo de activación. `Pending`
* HU-003 Activar cuenta y definir contraseña. `Pending`
* HU-004 Primer acceso del owner/admin. `Pending`
* HU-005 Confirmar el registro con una página de cierre. `Done`
* HU-006 Separar el wizard de alta de academia en una página dedicada. `Done`

### HU-005 Confirmar el registro con una página de cierre

**Como** usuario que acaba de completar el signup de una academia,  
**quiero** ver una pantalla de confirmación clara al finalizar el registro,  
**para** saber que el proceso fue recibido correctamente y cuál es el siguiente paso.

#### Descripción

Al terminar el flujo de signup, el frontend debe mostrar una página de cierre con mensaje de confirmación, resumen breve del registro y una acción principal para continuar.

La experiencia debe ser simple y comprensible para usuarios con poca familiaridad con procesos digitales.

#### Criterios de Aceptación

* Mostrar un mensaje claro de confirmación al completar el signup.
* Indicar que se envió o se enviará un mensaje de confirmación al correo registrado.
* Mostrar un resumen breve con el nombre de la academia y el correo de contacto.
* Presentar una acción principal clara, como `Ir a iniciar sesión`.
* Mantener una acción secundaria opcional, como `Volver al inicio`.
* Evitar pantallas vacías, ambiguas o técnicas después del envío del formulario.
* Respetar la identidad visual del frontend basada en Sakai y PrimeNG.

#### Reglas de UX

* El texto debe ser simple y directo.
* El mensaje no debe sonar técnico ni burocrático.
* La página debe funcionar bien en escritorio y móvil.
* La confirmación debe transmitir cierre, tranquilidad y siguiente paso.

#### Dependencias

* Resultado exitoso del backend al registrar el tenant.
* Mensaje de confirmación asociado al flujo de onboarding.

## Reglas de UX Relacionadas

* Mostrar pasos del onboarding de forma secuencial.
* Confirmar envío de correo.
* Mostrar una página de confirmación después del signup.
* Guiar al usuario hacia la siguiente acción con un mensaje claro.
* Evitar pantallas ambiguas entre registro y activación.
* Mantener el wizard de alta en una página independiente del listado para evitar ruido visual y problemas de interacción.

### HU-006 Separar el wizard de alta de academia en una página dedicada

**Como** administrador que crea o edita una academia desde la plataforma,  
**quiero** abrir el formulario de alta en una página independiente del listado,  
**para** completar el proceso sin mezclarlo con la tabla de administración y con una jerarquía visual más clara.

#### Descripción

El alta de academia debe vivir en una vista propia, accesible desde el listado de academias.
La pantalla de listado conserva su función de administración y la pantalla de wizard concentra la captura de datos en pasos.
Esto evita saturación visual, reduce interferencias con la tabla y mejora la comprensión del flujo.

#### Criterios de Aceptación

* El listado de academias no debe contener el wizard embebido.
* La acción `Nuevo` debe llevar a una página dedicada de alta.
* La acción de edición debe llevar a la misma página dedicada en modo edición.
* La navegación entre listado y wizard debe ser clara y directa.
* El wizard debe conservar la lógica de pasos, validaciones y datos mock.
* La página del wizard debe mantener consistencia visual con el resto del frontend.
* El flujo debe funcionar correctamente en escritorio y mobile.

#### Reglas de UX

* Separar claramente la exploración del listado y la captura del formulario.
* Evitar contenedores duplicados o elementos de formulario dentro de la tabla.
* Mantener una jerarquía visual simple: contexto, pasos, campos y acciones.
* Priorizar claridad sobre compactación excesiva.

## Fuera de Alcance

* Autoservicio completo de facturación.
* Personalización avanzada del tenant en el primer acceso.

## Estado

In Progress.
