# FE-001 Auth y Acceso

## Objetivo

Permitir que el usuario ingrese, salga y recupere su sesión en la aplicación.

## Problema que Resuelve

Sin una capa de acceso clara, el frontend no puede separar navegación pública y privada ni aplicar contexto de usuario.

## Valor de Negocio

Habilita el uso seguro de la plataforma y la entrada a los flujos de negocio.

## Actores

* Super Admin
* Tenant Owner
* Academy Admin
* Staff

## Dominios Involucrados

* Auth
* Identity
* Academy

## Historias de Usuario

* HU-001 Iniciar sesión. `Done`
* HU-002 Cerrar sesión. `Done`
* HU-003 Recuperar acceso o rehidratar sesión. `Partial`
* HU-004 Redirigir según rol y contexto. `Partial`
* HU-005 Mostrar una pantalla de ingreso clara y consistente con el signup. `Done`
* HU-006 Recuperar contraseña con solicitud pública, confirmación y nueva contraseña por token. `Done`
* HU-007 Consultar y actualizar el perfil del usuario autenticado. `Done`
* HU-008 Activar usuario desde token público. `Done`
* HU-009 Mostrar rol principal, roles asociados y contexto de acceso. `Done`

## Reglas de UX Relacionadas

* Mostrar error claro ante credenciales inválidas.
* Diferenciar sesión de plataforma y sesión tenant.
* Redirigir a la vista correcta según el rol.
* Mantener una experiencia visual coherente entre signup y signin.
* Guiar al usuario no técnico con etiquetas y mensajes simples.
* Reutilizar la estructura visual del SignIn para recuperación de contraseña cuando aplique.
* Mostrar una página de confirmación tipo thank-you después de solicitar la recuperación.
* Mostrar el perfil con una estructura clara, editable y consistente con el resto de formularios principales.
* Separar la información editable del usuario de la acción de restablecer contraseña.

## Trazabilidad

* `PLY-AUTH-REQ-001` -> HU-001
* `PLY-AUTH-REQ-002` -> HU-002
* `PLY-AUTH-REQ-003` -> HU-006
* `PLY-AUTH-REQ-004` -> HU-007
* `PLY-AUTH-REQ-005` -> HU-008
* `PLY-AUTH-REQ-006` -> HU-009

## Detalle de HU-006

### HU-006 Recuperar contraseña con solicitud pública, confirmación y nueva contraseña por token

Como usuario que olvidó su contraseña, quiero solicitar un enlace de recuperación y definir una nueva clave desde un flujo claro y público, para recuperar mi acceso sin depender de soporte ni de pasos técnicos.

#### Criterios de aceptación

* La pantalla de solicitud debe reutilizar el estilo visual del SignIn para mantener coherencia.
* El formulario inicial debe solicitar únicamente el correo electrónico del usuario.
* La respuesta visual al solicitar el restablecimiento debe ser genérica y no revelar si el correo existe.
* Al enviar la solicitud, el flujo debe llevar a una página de confirmación similar a la thank-you page del signup.
* Debe existir una pantalla pública de nueva contraseña que lea el token desde la URL.
* La pantalla de nueva contraseña debe solicitar contraseña y confirmación.
* El formulario debe bloquear el envío si el token no existe en la URL.
* Debe mostrar un error claro si el token es inválido o expiró.
* Debe mostrar un error claro si la contraseña no cumple la regla mínima definida para frontend.
* Debe existir una acción para volver al SignIn al terminar el flujo.
* El diseño debe mantenerse alineado con el sistema visual de Sakai y la línea de auth ya definida.
* Mientras no exista integración real, el flujo debe operar con datos mock sin romper el contrato esperado por backend.

#### Reglas de UX

* No saturar la pantalla con texto explicativo.
* Mantener una jerarquía visual clara: título, ayuda breve, campo, acción principal y cierre.
* Evitar elementos de navegación innecesarios.
* Reutilizar componentes y patrones ya usados en SignIn y signup-success siempre que sea posible.
* Mantener separado este flujo público de los datos de perfil autenticado.
* El botón `Restablecer contraseña` desde perfil debe reutilizar este flujo público sin mezclar formularios inline de cambio de clave.

#### Checklist de implementación

* [x] Solicitud pública de recuperación por correo.
* [x] Pantalla de confirmación posterior a la solicitud.
* [x] Confirmación de nueva contraseña por token.
* [x] Manejo de errores visibles para token inválido o expirado.
* [x] Redirección al login al finalizar.

## Detalle de HU-007

### HU-007 Consultar y actualizar el perfil del usuario autenticado

Como usuario autenticado de la plataforma, quiero ver y actualizar mi información personal y de contacto desde una pantalla clara, para mantener mis datos al día sin depender de un flujo técnico o confuso.

#### Criterios de aceptación

* La pantalla debe mostrar la información del usuario autenticado con una estructura de formulario simple.
* El formulario debe reutilizar el lenguaje visual de los formularios principales ya definidos en la aplicación.
* Debe permitir editar el nombre del usuario autenticado.
* El correo principal debe mostrarse como dato de cuenta no editable.
* El rol principal debe mostrarse como dato visible en formato comprensible para el usuario.
* El estado de la cuenta debe mostrarse como dato visible no editable.
* La pantalla debe funcionar para usuarios con academia asociada y también para usuarios de plataforma sin tenant.
* Debe existir una sección separada para seguridad con una acción de `Restablecer contraseña`.
* La acción de restablecer contraseña no debe pedir la contraseña actual ni mostrar un formulario de cambio inline.
* Al activar `Restablecer contraseña`, el sistema debe comunicar que se enviará un enlace al correo registrado.
* La pantalla debe permitir guardar cambios y mostrar confirmación visual al completar la acción.
* La pantalla debe usar datos mock mientras se define la integración real con `GET /api/v1/auth/me` y `PUT /api/v1/auth/me/name`.

#### Reglas de UX

* Mantener la pantalla enfocada en edición de datos y no en métricas o resúmenes innecesarios.
* Usar etiquetas simples para usuarios no técnicos.
* Mostrar la seguridad como una acción independiente del formulario principal.
* Mantener jerarquía visual clara entre datos editables, datos de cuenta y seguridad.
* Aplicar las mismas reglas de validación y consistencia visual usadas en signup y formularios de academia.

#### Checklist de implementación

* [x] Consumo de `GET /api/v1/auth/me`.
* [x] Edición de nombre propio.
* [x] Visualización de correo no editable.
* [x] Visualización de rol principal y roles asociados.
* [x] Visualización de contexto de academia o plataforma.
* [x] Acción de restablecimiento de contraseña separada.

## Detalle de HU-008

### HU-008 Activar usuario desde token público

Como usuario invitado o recién creado, quiero definir mi contraseña desde un enlace de activación, para poder acceder por primera vez de forma segura.

#### Criterios de aceptación

* La pantalla debe leer el token desde la URL.
* Debe solicitar contraseña y confirmación.
* Debe mostrar un mensaje claro si el token es inválido o expiró.
* Debe confirmar la activación y dirigir al login.

#### Checklist de implementación

* [x] Ruta pública de activación.
* [x] Consumo de `POST /api/v1/public/users/activate/{token}`.
* [x] Manejo de error visible si el token no es válido.
* [x] Confirmación visual de activación exitosa.

## Detalle de HU-009

### HU-009 Mostrar rol principal, roles asociados y contexto de acceso

Como usuario autenticado, quiero ver mi rol principal y el contexto en el que opero, para entender qué capacidades tengo sin depender de abreviaturas técnicas.

#### Criterios de aceptación

* El perfil debe mostrar el rol principal en formato entendible.
* El perfil debe mostrar los roles asociados si existen.
* El perfil debe indicar si el usuario está en contexto plataforma o tenant.
* Si el usuario no tiene `academyId`, la pantalla no debe romper ni asumir contexto tenant.

#### Checklist de implementación

* [x] Interpretación de `ROLE_ROOT`, `ROLE_ACADEMY_ADMIN`, `ROLE_COACH` y `ROLE_USER`.
* [x] Etiqueta de contexto derivada del contrato de `auth/me`.
* [x] Fallback seguro para roles desconocidos.
* [x] Sin dependencia de `academyId` obligatorio.

## Fuera de Alcance

* MFA.
* SSO.
* Recuperación avanzada de cuenta.

## Estado

Done.
