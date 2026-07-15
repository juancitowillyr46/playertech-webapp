# Frontend Backlog Index

Este índice organiza las épicas y historias de usuario del frontend de PlayerTech WebApp.

El backlog frontend refleja los flujos visibles para el usuario a partir de las épicas y HUs ya trabajadas en el backend.

Convención visual vigente:

* `docs/backlog/frontend/01-layout-width-conventions.md`

Convención de estado vigente:

* `Done` = flujo implementado y listo para integración o uso real en esta iteración.
* `Done (Mock UI)` = flujo frontend visible, navegable y validable con mocks, pendiente solo de integración backend real.
* `Partial` = existe implementación solo en una parte del flujo, o faltan piezas visibles relevantes para cerrarlo.
* `In Progress` = trabajo iniciado pero aún no hay una experiencia completa validable.
* `Draft` = definición documental sin implementación visible todavía.

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

Cobertura de conceptos, cargos, pagos, comprobantes, evidencias, documentos fiscales externos y deuda.

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
* HU-006 Recuperar contraseña pública → `Done (Mock UI)` → `src/app/features/auth/pages/forgot-password.ts`, `src/app/features/auth/pages/forgot-password-success.ts`, `src/app/features/auth/pages/reset-password.ts`
* HU-007 Perfil del usuario autenticado → `Done (Mock UI)` → `src/app/features/account/pages/profile.ts`, `src/app/features/account/data-access/profile.service.ts`

## EF-002 Tenant Onboarding

* HU-001 Registrar tenant desde flujo público → `Done` → `src/app/features/auth/pages/signup.ts`
* HU-005 Confirmar registro con página de cierre → `Done` → `src/app/features/auth/pages/signup-success.ts`
* HU-006 Wizard de alta en página dedicada → `Done` → `src/app/features/tenants/pages/tenant-wizard.ts`, `src/app/features/tenants/tenants.routes.ts`

## EF-003 Academy Management

* HU-001 Consultar academia propia → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`, `src/app/features/academy/data-access/academy-profile.service.ts`
* HU-002 Actualizar academia propia → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`, `src/app/features/academy/data-access/academy-profile.service.ts`
* HU-003 Consultar academias desde plataforma → `Done` → `src/app/features/tenants/pages/tenants.ts`
* HU-004 Ver detalle o edición de academia → `Partial` → `src/app/features/tenants/pages/tenant-wizard.ts`
* HU-005 Suspender o reactivar academia → `Done` → `src/app/features/tenants/pages/tenants.ts`
* HU-006 Subir escudo institucional → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-007 Navegar submódulos de academia desde tabs → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-008 Consultar información fiscal de la academia → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`, `src/app/features/academy/data-access/academy-profile.service.ts`
* HU-009 Actualizar información fiscal de la academia → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`, `src/app/features/academy/data-access/academy-profile.service.ts`
* HU-010 Mostrar resumen fiscal de la academia en contextos útiles → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`

## EF-005 Sports Configuration

* HU-001 Crear sede → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-002 Listar sedes → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-003 Ver detalle de sede → `Partial` → `src/app/features/academy/pages/academy-profile.ts`
* HU-004 Actualizar sede → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-005 Activar o inactivar sede → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-006 Crear categoría → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-007 Listar categorías → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-008 Actualizar categoría → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-009 Activar o inactivar categoría → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`

## EF-006 Player Management

* HU-001 Listar jugadores → `Done (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-002 Registrar jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-form.ts`
* HU-003 Ver detalle de jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Actualizar jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Desactivar jugador → `Done (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-006 Reactivar jugador → `Done (Mock UI)` → `src/app/features/players/pages/players-list.ts`
* HU-007 Subir o actualizar foto de jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-form.ts`, `src/app/features/players/pages/player-detail.ts`
* HU-008 Preparar vista para matrícula, equipo y acudientes → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`

## EF-007 Guardian Management

* HU-001 Listar acudientes asociados a un jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-002 Asociar acudiente existente a jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-003 Crear acudiente y asociarlo a jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Cambiar acudiente principal → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Eliminar asociación jugador-acudiente → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-006 Preparar módulo independiente de acudientes → `Done` → `src/app/features/guardians/guardians.routes.ts`, `src/app/layout/component/app.menu.ts`, `src/app.routes.ts`
* HU-007 Listar acudientes como entidad independiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardians-list.ts`
* HU-008 Ver detalle de acudiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-detail.ts`
* HU-009 Crear acudiente desde módulo independiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`
* HU-010 Editar acudiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`
* HU-011 Asociar jugador existente a acudiente desde su detalle → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-detail.ts`
* HU-012 Incluir identificación y parentesco en formularios de acudiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardian-form.ts`, `src/app/features/players/pages/player-detail.ts`
* HU-013 Mostrar identificación y parentesco en listados y detalle de acudiente → `Done (Mock UI)` → `src/app/features/guardians/pages/guardians-list.ts`, `src/app/features/guardians/pages/guardian-detail.ts`
* HU-014 Mostrar identificación y parentesco en la relación jugador-acudiente → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`

## EF-008 Team Management

* HU-001 Crear equipo → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-002 Listar equipos → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-003 Ver detalle de equipo → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-004 Actualizar equipo → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-005 Desactivar equipo → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-006 Reactivar equipo → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-007 Preparar asignación de jugadores a equipo → `Done` → `docs/backlog/frontend/EF-008-team-management.md`
* HU-008 Asignar jugador a un equipo → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-009 Marcar asignación como principal → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-010 Cambiar equipo principal de un jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-011 Finalizar asignación deportiva → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-012 Consultar asignaciones deportivas de un jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`

## EF-009 Membership Management

* HU-001 Crear matrícula desde el detalle del jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-002 Generar y mostrar cargos iniciales → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-003 Ver matrícula activa del jugador → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-004 Ver historial de matrículas → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`
* HU-005 Suspender matrícula → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-006 Retirar matrícula → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`
* HU-007 Ver saldo administrativo y cargos pendientes → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/players/data-access/player-management.service.ts`

## EF-010 Payment Management

* HU-001 Listar conceptos de cobro → `Done (Mock UI)` → `src/app/features/payments/pages/payment-concepts.ts`, `src/app/features/payments/data-access/payment-concepts.service.ts`
* HU-002 Crear concepto de cobro → `Done (Mock UI)` → `src/app/features/payments/pages/payment-concepts.ts`, `src/app/features/payments/data-access/payment-concepts.service.ts`
* HU-003 Editar concepto de cobro → `Done (Mock UI)` → `src/app/features/payments/pages/payment-concepts.ts`, `src/app/features/payments/data-access/payment-concepts.service.ts`
* HU-004 Activar o desactivar concepto de cobro → `Done (Mock UI)` → `src/app/features/payments/pages/payment-concepts.ts`, `src/app/features/payments/data-access/payment-concepts.service.ts`
* HU-005 Consultar cargos pendientes → `Done (Mock UI)` → `src/app/features/payments/pages/charges-debt.ts`, `src/app/features/payments/data-access/charges-debt.service.ts`
* HU-006 Consultar deuda consolidada del jugador → `Done (Mock UI)` → `src/app/features/payments/pages/charges-debt.ts`, `src/app/features/payments/data-access/charges-debt.service.ts`, `src/app/features/players/pages/player-detail.ts`
* HU-007 Ver estado financiero resumido desde matrícula y cargos → `Done (Mock UI)` → `src/app/features/players/pages/player-detail.ts`, `src/app/features/payments/pages/charges-debt.ts`
* HU-008 Registrar pago sobre uno o varios cargos → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-009 Registrar medio de pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-010 Ver comprobante administrativo de pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-011 Consultar historial de pagos → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-012 Anular o cancelar pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-013 Navegar desde deuda hacia cargos y pagos relacionados → `Done (Mock UI)` → `src/app/features/payments/pages/charges-debt.ts`, `src/app/features/payments/pages/payments-history.ts`, `src/app/features/players/pages/player-detail.ts`
* HU-014 Descargar comprobante administrativo en PDF → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-015 Adjuntar evidencia de pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-016 Asociar documento fiscal externo a un pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-017 Consultar soportes y adjuntos de un pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-018 Ejecutar recaudo rápido desde jornada o contexto operativo → `Done (Mock UI)` → `src/app/features/payments/pages/rapid-collection.ts`, `src/app/features/payments/data-access/charges-debt.service.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-019 Consultar reporte consolidado de recaudo rápido → `Done (Mock UI)` → `src/app/features/payments/pages/rapid-collection.ts`
* POS como evolución posterior → `Documented` → `docs/backlog/frontend/EF-010-payment-management.md`

## EF-012 Staff Management

* HU-001 Dar de alta miembro del staff → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-002 Elegir modo de acceso para el staff → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-003 Listar directorio de staff de la academia → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-004 Asignar miembro del staff a un equipo → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-005 Definir rol técnico por asignación → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-006 Cambiar rol técnico → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-007 Retirar miembro del cuerpo técnico → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
* HU-008 Consultar cuerpo técnico de un equipo → `Done (Mock UI)` → `src/app/features/academy/pages/academy-profile.ts`
