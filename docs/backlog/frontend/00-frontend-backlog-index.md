# Frontend Backlog Index

Este índice organiza las épicas y historias de usuario del frontend de PlayerTech WebApp.

El backlog frontend refleja los flujos visibles para el usuario a partir de las épicas y HUs ya trabajadas en el backend.

Convención visual vigente:

* `docs/backlog/frontend/01-layout-width-conventions.md`

---

# Criterio de Mapeo

* Las épicas del frontend se redactan desde la experiencia de uso, no desde la infraestructura.
* Cada historia debe tener una contraparte clara en API o flujo backend.
* Las capacidades puramente técnicas del backend no generan historias frontend si no existe pantalla, navegación o interacción visible.

---

# Épicas Frontend

## EF-001 Auth and Access

Cobertura de login, logout, recuperación de sesión y control básico de acceso.

## EF-002 Tenant Onboarding

Cobertura del alta simplificada de tenant, activación y primer acceso del owner/admin.

## EF-003 Academy Management

Cobertura de consulta y administración de la academia actual y, para root, del inventario de academias.

## EF-004 User Management

Cobertura de usuarios de plataforma y usuarios administrativos del tenant.

## EF-005 Sports Configuration

Cobertura de sedes y categorías.

## EF-006 Player Management

Cobertura de alta, consulta, edición, estado, carga masiva y foto.

## EF-007 Guardian Management

Cobertura de acudientes y relaciones jugador-acudiente.

## EF-008 Team Management

Cobertura de equipos y asignaciones deportivas.

## EF-009 Membership Management

Cobertura de matrícula, historial y control administrativo.

## EF-010 Payment Management

Cobertura de conceptos, pagos, evidencias y deuda.

## EF-011 Operative Dashboard

Cobertura de la visión operativa principal del tenant.

## EF-012 Staff Management

Cobertura de alta unificada del staff, acceso y relación del staff con equipos.

---

# Orden Recomendado

1. EF-001 Auth and Access
2. EF-002 Tenant Onboarding
3. EF-003 Academy Management
4. EF-004 User Management
5. EF-005 Sports Configuration
6. EF-006 Player Management
7. EF-007 Guardian Management
8. EF-008 Team Management
9. EF-009 Membership Management
10. EF-010 Payment Management
11. EF-011 Operative Dashboard
12. EF-012 Staff Management

---

# Trazabilidad Actual

## EF-001 Auth and Access

* HU-001 Iniciar sesión → `Done` → `src/app/features/auth/pages/login.ts`
* HU-002 Cerrar sesión → `Done` → `src/app/layout/component/app.sidebar.ts`
* HU-005 Pantalla de ingreso consistente → `Done` → `src/app/features/auth/pages/login.ts`
* HU-006 Recuperar contraseña pública → `In Progress` → `src/app/features/auth/pages/forgot-password.ts`, `src/app/features/auth/pages/forgot-password-success.ts`, `src/app/features/auth/pages/reset-password.ts`
* HU-007 Perfil del usuario autenticado → `In Progress (Mock UI)` → `src/app/features/account/pages/profile.ts`, `src/app/features/account/data-access/profile.service.ts`

## EF-002 Tenant Onboarding

* HU-001 Registrar tenant desde flujo público → `Done` → `src/app/features/auth/pages/signup.ts`
* HU-005 Confirmar registro con página de cierre → `Done` → `src/app/features/auth/pages/signup-success.ts`
* HU-006 Wizard de alta en página dedicada → `Done` → `src/app/features/tenants/pages/tenant-wizard.ts`, `src/app/features/tenants/tenants.routes.ts`

## EF-003 Academy Management

* HU-001 Consultar academia propia → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`, `src/app/features/academy/data-access/academy-profile.service.ts`
* HU-002 Actualizar academia propia → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`, `src/app/features/academy/data-access/academy-profile.service.ts`
* HU-003 Consultar academias desde plataforma → `Done` → `src/app/features/tenants/pages/tenants.ts`
* HU-004 Ver detalle o edición de academia → `Partial` → `src/app/features/tenants/pages/tenant-wizard.ts`
* HU-005 Suspender o reactivar academia → `Done` → `src/app/features/tenants/pages/tenants.ts`
* HU-006 Subir escudo institucional → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`

## EF-005 Sports Configuration

* HU-001 Crear sede → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-002 Listar sedes → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-003 Ver detalle de sede → `Pending`
* HU-004 Actualizar sede → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-005 Activar o inactivar sede → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-006 Crear categoría → `Draft`
* HU-007 Listar categorías → `Draft`
* HU-008 Actualizar categoría → `Draft`
* HU-009 Activar o inactivar categoría → `Draft`

## EF-006 Player Management

* HU-001 Listar jugadores → `In Progress (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-002 Registrar jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-form.ts`
* HU-003 Ver detalle de jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Actualizar jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Desactivar jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-006 Reactivar jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-007 Subir o actualizar foto de jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-form.ts`, `src/app/features/players/pages/player-detail.ts`

## EF-007 Guardian Management

* HU-001 Listar acudientes asociados a un jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-002 Asociar acudiente existente a jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-003 Crear acudiente y asociarlo a jugador → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Cambiar acudiente principal → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Eliminar asociación jugador-acudiente → `In Progress (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-006 Preparar módulo independiente de acudientes → `Done` → `src/app/features/guardians/guardians.routes.ts`, `src/app/layout/component/app.menu.ts`, `src/app.routes.ts`
* HU-007 Listar acudientes como entidad independiente → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardians-list.ts`
* HU-008 Ver detalle de acudiente → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardian-detail.ts`
* HU-009 Crear acudiente desde módulo independiente → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`
* HU-010 Editar acudiente → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`
* HU-011 Asociar jugador existente a acudiente desde su detalle → `In Progress (Mock UI)` → `src/app/features/guardians/pages/guardian-detail.ts`

## EF-008 Team Management

* HU-001 Crear equipo → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-002 Listar equipos → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-003 Ver detalle de equipo → `Pending`
* HU-004 Actualizar equipo → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-005 Desactivar equipo → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-006 Reactivar equipo → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-007 Preparar asignación de jugadores a equipo → `In Progress (Estructura UX)` → `src/app/features/academy/pages/academy-profile.ts`, `docs/backlog/frontend/EF-008-team-management.md`

## EF-012 Staff Management

* HU-001 Dar de alta miembro del staff → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-002 Elegir modo de acceso para el staff → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-003 Listar directorio de staff de la academia → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-004 Asignar miembro del staff a un equipo → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-005 Definir rol técnico por asignación → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-006 Cambiar rol técnico → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-007 Retirar miembro del cuerpo técnico → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-008 Consultar cuerpo técnico de un equipo → `In Progress (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
