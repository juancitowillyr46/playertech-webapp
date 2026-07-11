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

## Reglas de UX Relacionadas

* Mostrar error claro ante credenciales inválidas.
* Diferenciar sesión de plataforma y sesión tenant.
* Redirigir a la vista correcta según el rol.
* Mantener una experiencia visual coherente entre signup y signin.
* Guiar al usuario no técnico con etiquetas y mensajes simples.
* Reutilizar la estructura visual del SignIn para recuperación de contraseña cuando aplique.
* Mostrar una página de confirmación tipo thank-you después de solicitar la recuperación.

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

## Fuera de Alcance

* MFA.
* SSO.
* Recuperación avanzada de cuenta.

## Estado

Draft.
