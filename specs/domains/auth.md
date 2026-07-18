# Auth Domain Spec

## Objetivo

Definir el comportamiento verificable del acceso, la recuperación de contraseña, la activación de usuario y el perfil autenticado.

## Alcance

Incluye:

* login;
* activación de usuario;
* solicitud y confirmación de restablecimiento de contraseña;
* persistencia de sesión y rehidratación inicial;
* perfil autenticado;
* visualización de rol y contexto de acceso;
* navegación pública y privada básica.

## Fuente de verdad actual

* [src/app/core/auth/auth-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\auth-api.service.ts)
* [src/app/core/auth/auth-session.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\auth-session.service.ts)
* [src/app/core/auth/mock-auth.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\mock-auth.service.ts)
* [src/app/core/guards/auth.guard.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\guards\auth.guard.ts)
* [src/app/core/guards/guest.guard.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\guards\guest.guard.ts)
* [src/app/features/auth/pages/login.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\login.ts)
* [src/app/features/auth/pages/activate.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\activate.ts)
* [src/app/features/auth/pages/signup.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\signup.ts)
* [src/app/features/auth/pages/signup-success.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\signup-success.ts)
* [src/app/features/auth/pages/forgot-password.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\forgot-password.ts)
* [src/app/features/auth/pages/reset-password.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\reset-password.ts)
* [src/app/features/account/pages/profile.ts](C:\Data\Source\Repos\playertech-webapp\src/app\features\account\pages\profile.ts)
* [docs/backlog/frontend/EF-001-auth-and-access.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-001-auth-and-access.md)

## Contrato funcional mínimo

### Endpoints consumidos por frontend

* `POST /api/v1/auth/login`
* `GET /api/v1/auth/me`
* `POST /api/v1/public/users/activate/{token}`
* `POST /api/v1/public/users/password-reset/request`
* `POST /api/v1/public/users/password-reset/confirm/{token}`
* `PUT /api/v1/auth/me/name`

### UI legal asociada al signup

* El signup público debe exponer diálogos modales separados para `Términos y condiciones` y `Tratamiento de datos personales`.
* Cada diálogo debe permitir lectura extensa con scroll interno y sin recortar el contenedor del onboarding.
* El cierre del diálogo no debe borrar el progreso del formulario.

### Roles visibles en frontend

* `ROLE_ROOT`
* `ROLE_ACADEMY_ADMIN`
* `ROLE_COACH`
* `ROLE_USER`

### Reglas de contexto

* `ROLE_ROOT` opera en contexto de plataforma.
* `ROLE_ACADEMY_ADMIN` opera en contexto tenant.
* `ROLE_COACH` es un rol funcional de academia.
* `ROLE_USER` es un rol base técnico.

## Flujos

### PLY-AUTH-FLW-001 Login

* Actor: usuario no autenticado.
* Punto de entrada: `/auth/login`.
* Resultado esperado: sesión activa, sesión persistida y redirección al contexto privado.
* Validaciones visibles: email válido y contraseña requerida.

### PLY-AUTH-FLW-002 Activación de usuario

* Actor: usuario con token de activación.
* Punto de entrada: `/auth/activate/:token`.
* Resultado esperado: contraseña definida, sesión habilitada y redirección al acceso.
* Validaciones visibles: password y confirmation obligatorios, error visible si el token es inválido o expiró.

### PLY-AUTH-FLW-003 Recuperación de contraseña

* Actor: usuario público.
* Punto de entrada: `/auth/forgot-password` y `/auth/forgot-password-success`.
* Resultado esperado: solicitud pública sin fuga de existencia de correo.
* Validaciones visibles: correo requerido y formato válido.

### PLY-AUTH-FLW-004 Confirmación de nueva contraseña

* Actor: usuario con token de recuperación.
* Punto de entrada: `/auth/reset-password/:token`.
* Resultado esperado: nueva contraseña confirmada y retorno al login.
* Validaciones visibles: password y confirmation obligatorios, error visible si el token es inválido o expiró.

### PLY-AUTH-FLW-005 Perfil autenticado

* Actor: usuario autenticado.
* Punto de entrada: `/account/profile`.
* Resultado esperado: ver datos de cuenta, rol principal, roles asociados y contexto; permitir editar sólo el nombre.

## Estados mínimos

* inicial;
* carga;
* éxito;
* error;
* sin permisos;
* token inválido o expirado;
* validación del formulario;
* confirmación de recuperación;
* sesión cargada desde `auth/me`.

## Reglas de aceptación

* El login no debe exponer credenciales inválidas como datos técnicos.
* La activación y el reset de contraseña deben ser públicos y leer el token desde la URL.
* La recuperación de contraseña no debe revelar si el correo existe.
* El perfil debe separar datos editables de datos de cuenta.
* La autorización de ruta no debe depender solo de visibilidad visual.
* El frontend no debe asumir que todos los usuarios tienen `academyId`.
* El frontend debe degradar de forma segura si aparece un rol desconocido.

## Vacíos a resolver

* contrato formal de expiración de token;
* respuesta estándar para 401, 403 y 423;
* reglas finales de shape de `auth/me` si el backend evoluciona;
* catálogo definitivo de permisos si se introduce RBAC granular.

## Trazabilidad inicial

* `PLY-AUTH-REQ-001` inicio de sesión
* `PLY-AUTH-REQ-002` activación de usuario
* `PLY-AUTH-REQ-003` recuperación de contraseña
* `PLY-AUTH-REQ-004` confirmación de nueva contraseña
* `PLY-AUTH-REQ-005` perfil autenticado
* `PLY-AUTH-REQ-006` visualización de rol y contexto

## Checklist de implementación

* [x] Consumir `POST /api/v1/auth/login`.
* [x] Persistir sesión localmente y rehidratar al iniciar.
* [x] Resolver redirección por rol/contexto.
* [x] Consumir `GET /api/v1/auth/me` para perfil autenticado.
* [x] Consumir `PUT /api/v1/auth/me/name` para actualización de nombre.
* [x] Exponer pantalla pública de activación por token.
* [x] Exponer solicitud y confirmación de restablecimiento por token.
* [x] Mostrar rol principal, roles asociados y contexto de acceso.
* [x] Mantener mensajes de error visibles para el usuario.
