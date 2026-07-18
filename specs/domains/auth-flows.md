# Auth Flow Spec

## Propósito

Convertir el dominio de autenticación en flujos verificables con criterios de aceptación observables.

## Flujos cubiertos

* Login
* Logout
* Forgot password
* Reset password
* Signup
* Signup success
* Access error
* Auth error
* Profile access

## Login

### Pantalla

* [src/app/features/auth/pages/login.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\login.ts)

### Criterios de aceptación

* Dado un usuario no autenticado, cuando ingresa un email inválido, entonces el formulario no debe permitir avanzar y debe mostrar error de validación.
* Dado un usuario no autenticado, cuando ingresa una contraseña menor al mínimo definido, entonces el formulario no debe permitir avanzar y debe mostrar error de validación.
* Dado un usuario no autenticado, cuando envía credenciales válidas, entonces se activa la sesión y se redirige al shell.
* Dado un usuario autenticado, cuando vuelve a abrir la pantalla de login, entonces el sistema debe redirigirlo al contexto privado según su sesión.

### Checklist de verificación

* [x] Validación de email visible antes de enviar.
* [x] Manejo de credenciales inválidas con mensaje humano.
* [x] Redirección según rol/contexto luego del login.
* [x] Persistencia de sesión para recarga o reingreso.

## Logout

### Pantalla o punto de entrada

* menú lateral o acción de sesión en shell

### Criterios de aceptación

* Dado un usuario autenticado, cuando ejecuta logout, entonces la sesión se limpia.
* Dado un usuario autenticado, cuando ejecuta logout, entonces el sistema lo devuelve a una vista pública.

### Checklist de verificación

* [x] Limpieza de sesión local.
* [x] Redirección a vista pública.

## Forgot password

### Pantalla

* [src/app/features/auth/pages/forgot-password.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\forgot-password.ts)
* [src/app/features/auth/pages/forgot-password-success.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\forgot-password-success.ts)

### Criterios de aceptación

* Dado un usuario público, cuando abre la pantalla de recuperación, entonces ve un formulario con correo electrónico.
* Dado un usuario público, cuando envía el formulario con correo inválido, entonces se mantiene en la misma pantalla con error visible.
* Dado un usuario público, cuando envía el formulario, entonces la respuesta no debe revelar si el correo existe.
* Dado un usuario público, cuando la solicitud es aceptada, entonces se muestra una pantalla de confirmación.

### Checklist de verificación

* [x] Formulario público con email.
* [x] Estado de confirmación separado.
* [x] Mensaje genérico sin fuga de existencia de correo.

## Reset password

### Pantalla

* [src/app/features/auth/pages/reset-password.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\reset-password.ts)

### Criterios de aceptación

* Dado un usuario público con token en URL, cuando abre la pantalla, entonces puede definir nueva contraseña y confirmación.
* Dado un usuario público sin token, cuando abre la pantalla, entonces debe ver un error claro y no poder avanzar.
* Dado un usuario público con contraseña débil, cuando intenta enviar, entonces ve error de validación.
* Dado un usuario público con confirmación distinta, cuando intenta enviar, entonces el sistema bloquea el avance.

### Checklist de verificación

* [x] Lectura de token desde ruta y query.
* [x] Error visible si el token falta, expira o es inválido.
* [x] Validación de contraseña y confirmación.
* [x] Retorno al login al completar el flujo.

## Activate user

### Pantalla

* [src/app/features/auth/pages/activate.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\activate.ts)

### Criterios de aceptación

* Dado un usuario con token de activación, cuando abre la pantalla, entonces puede definir contraseña y confirmación.
* Dado un usuario con token inválido o expirado, cuando intenta avanzar, entonces ve un error claro.
* Dado un usuario activado exitosamente, entonces el sistema confirma la acción y lo devuelve al login.

### Checklist de verificación

* [x] Pantalla pública por token.
* [x] Validación de password/confirmation.
* [x] Mensaje claro ante token inválido o expirado.
* [x] Redirección al login al completar.

## Signup

### Pantalla

* [src/app/features/auth/pages/signup.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\signup.ts)
* [src/app/features/auth/pages/signup-success.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\signup-success.ts)

### Criterios de aceptación

* Dado un usuario público, cuando completa el signup, entonces el formulario debe exigir los campos definidos por la spec de auth.
* Dado un usuario público, cuando la alta es exitosa, entonces se muestra confirmación de registro.

### Checklist de verificación

* [ ] Mantener la spec de signup alineada con el contrato final.
* [ ] Revisar si signup sigue siendo un flujo activo o queda como legado.

## Profile access

### Pantalla

* [src/app/features/account/pages/profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\account\pages\profile.ts)

### Criterios de aceptación

* Dado un usuario autenticado, cuando abre su perfil, entonces puede ver sus datos editables y de cuenta.
* Dado un usuario autenticado, cuando solicita restablecer contraseña desde perfil, entonces se activa el flujo público de recuperación.

### Checklist de verificación

* [x] Consumo de `GET /api/v1/auth/me`.
* [x] Edición de nombre propio con `PUT /api/v1/auth/me/name`.
* [x] Lectura de rol principal y roles asociados.
* [x] Visualización de contexto tenant o plataforma.
* [x] Acción de restablecimiento separada del formulario principal.

## Estados mínimos del dominio

* inicial
* autenticado
* no autenticado
* acceso denegado
* validación inválida
* token faltante o inválido
* recuperación solicitada

## Evidencia actual

* [src/app/core/auth/mock-auth.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\mock-auth.service.ts)
* [src/app/core/guards/auth.guard.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\guards\auth.guard.ts)
* [src/app/core/guards/guest.guard.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\guards\guest.guard.ts)
