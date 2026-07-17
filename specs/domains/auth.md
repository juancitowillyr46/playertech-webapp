# Auth Domain Spec

## Objetivo

Definir el comportamiento verificable del acceso, la recuperación de contraseña y el perfil del usuario autenticado.

## Alcance

Incluye:

* login;
* logout;
* recuperación de contraseña;
* rehidratación o persistencia de sesión;
* perfil del usuario autenticado;
* navegación pública y privada básica.

## Fuente de verdad actual

* [src/app/core/auth/mock-auth.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\mock-auth.service.ts)
* [src/app/core/guards/auth.guard.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\guards\auth.guard.ts)
* [src/app/core/guards/guest.guard.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\guards\guest.guard.ts)
* [src/app/features/auth/pages/login.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\login.ts)
* [src/app/features/auth/pages/forgot-password.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\forgot-password.ts)
* [src/app/features/auth/pages/reset-password.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\reset-password.ts)
* [src/app/features/auth/pages/signup.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\signup.ts)
* [docs/backlog/frontend/EF-001-auth-and-access.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-001-auth-and-access.md)

## Roles visibles en frontend

* `super_admin`
* `tenant_owner`
* `academy_admin`
* `staff`

## Flujos

### PLY-AUTH-FLW-001 Login

* Actor: usuario no autenticado.
* Punto de entrada: `/auth/login`.
* Resultado esperado: sesión activa y redirección al shell.
* Validaciones visibles: email válido y contraseña con longitud mínima.

### PLY-AUTH-FLW-002 Logout

* Actor: usuario autenticado.
* Punto de entrada: acción de menú o sidebar.
* Resultado esperado: sesión cerrada y regreso a acceso público.

### PLY-AUTH-FLW-003 Recuperación de contraseña

* Actor: usuario público.
* Punto de entrada: `/auth/forgot-password`.
* Resultado esperado: confirmación pública, luego pantalla de nueva contraseña.
* Validaciones visibles: correo requerido y formato válido.

### PLY-AUTH-FLW-004 Perfil autenticado

* Actor: usuario autenticado.
* Punto de entrada: `/account/profile`.
* Resultado esperado: ver y editar nombre, con seguridad separada.

## Estados mínimos

* inicial;
* carga;
* éxito;
* error;
* sin permisos;
* token inválido o expirado;
* validación del formulario;
* confirmación de recuperación.

## Reglas de aceptación

* El login no debe exponer credenciales inválidas como datos técnicos.
* La recuperación de contraseña debe ser pública y no revelar si el correo existe.
* La pantalla de perfil debe separar datos editables de seguridad.
* La autorización de ruta no debe depender solo de visibilidad visual.

## Vacíos a resolver

* contrato real de sesión;
* respuestas 401 y 403;
* expiración de sesión;
* fuente compartida para roles.

## Trazabilidad inicial

* `PLY-AUTH-REQ-001` inicio de sesión
* `PLY-AUTH-REQ-002` cierre de sesión
* `PLY-AUTH-REQ-003` recuperación de contraseña
* `PLY-AUTH-REQ-004` perfil autenticado

