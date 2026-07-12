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

* HU-001 Iniciar sesión.
* HU-002 Cerrar sesión.
* HU-003 Recuperar acceso o rehidratar sesión.
* HU-004 Redirigir según rol y contexto.
* HU-005 Mostrar una pantalla de ingreso clara y consistente con el signup.
* HU-006 Recuperar contraseña con una pantalla consistente con el SignIn y una página de confirmación.
* HU-007 Consultar y actualizar el perfil del usuario autenticado.

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

## Detalle de HU-006

### HU-006 Recuperar contraseña con una pantalla consistente con el SignIn y una página de confirmación

Como usuario autenticado o no autenticado que olvidó su contraseña, quiero solicitar un enlace o instrucción de recuperación desde una pantalla simple y familiar, para poder restablecer mi acceso sin salir del lenguaje visual del SignIn.

#### Criterios de aceptación

* La pantalla de recuperación debe reutilizar el estilo visual del SignIn para mantener coherencia.
* El formulario debe ser simple y de un solo objetivo principal.
* El campo principal debe solicitar el correo electrónico del usuario.
* Los mensajes de ayuda deben ser breves y comprensibles para usuarios no técnicos.
* Al enviar la solicitud, el flujo debe llevar a una página de confirmación similar a la thank-you page del signup.
* La página de confirmación debe indicar que se revisó el correo o que se enviaron las instrucciones de recuperación.
* Debe existir una acción secundaria para volver al SignIn.
* El diseño debe mantenerse alineado con el sistema visual de Sakai y la línea de auth ya definida.

#### Reglas de UX

* No saturar la pantalla con texto explicativo.
* Mantener una jerarquía visual clara: título, ayuda breve, campo, acción principal y cierre.
* Evitar elementos de navegación innecesarios.
* Reutilizar componentes y patrones ya usados en SignIn y signup-success siempre que sea posible.

## Detalle de HU-007

### HU-007 Consultar y actualizar el perfil del usuario autenticado

Como usuario autenticado de la plataforma, quiero ver y actualizar mi información personal y de contacto desde una pantalla clara, para mantener mis datos al día sin depender de un flujo técnico o confuso.

#### Criterios de aceptación

* La pantalla debe mostrar la información del usuario autenticado con una estructura de formulario simple.
* El formulario debe reutilizar el lenguaje visual de los formularios principales ya definidos en la aplicación.
* Deben mostrarse campos personales y de contacto como nombre, teléfono, país, departamento, ciudad y dirección.
* El correo principal puede mostrarse como dato de cuenta si no forma parte del alcance editable.
* Debe existir una sección separada para seguridad con una acción de `Restablecer contraseña`.
* La acción de restablecer contraseña no debe pedir la contraseña actual ni mostrar un formulario de cambio inline.
* Al activar `Restablecer contraseña`, el sistema debe comunicar que se enviará un enlace al correo registrado.
* La pantalla debe permitir guardar cambios y mostrar confirmación visual al completar la acción.
* La pantalla debe usar datos mock mientras se define la integración real con `GET /api/v1/auth/me`, `POST /api/v1/academy/me` y `PUT /api/v1/academy/me`.

#### Reglas de UX

* Mantener la pantalla enfocada en edición de datos y no en métricas o resúmenes innecesarios.
* Usar etiquetas simples para usuarios no técnicos.
* Mostrar la seguridad como una acción independiente del formulario principal.
* Mantener jerarquía visual clara entre datos personales, datos de cuenta y seguridad.
* Aplicar las mismas reglas de validación y consistencia visual usadas en signup y formularios de academia.

## Fuera de Alcance

* MFA.
* SSO.
* Recuperación avanzada de cuenta.

## Estado

Draft.
