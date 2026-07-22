# Matriz de trazabilidad inicial SDD

Esta matriz conecta requisitos, specs, páginas y evidencia inicial para los dominios prioritarios.

## Auth

| Requisito | Spec | UI / Archivo | Evidencia actual | Estado |
| --- | --- | --- | --- | --- |
| `PLY-AUTH-REQ-001` Inicio de sesión | [specs/domains/auth.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\auth.md) | [src/app/features/auth/pages/login.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\login.ts) | Mock UI + validaciones locales | Confirmado como comportamiento actual |
| `PLY-AUTH-REQ-002` Cierre de sesión | [specs/domains/auth.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\auth.md) | [src/app/core/auth/mock-auth.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\mock-auth.service.ts) | Persistencia local mock | Confirmado como comportamiento actual |
| `PLY-AUTH-REQ-003` Recuperación de contraseña | [specs/domains/auth.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\auth.md) | [src/app/features/auth/pages/forgot-password.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\forgot-password.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-AUTH-REQ-004` Perfil autenticado | [specs/domains/auth.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\auth.md) | [src/app/features/auth/pages/signup.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\signup.ts) | Backlog y mock UI | Parcialmente confirmado |

## Players

| Requisito | Spec | UI / Archivo | Evidencia actual | Estado |
| --- | --- | --- | --- | --- |
| `PLY-PLAYER-REQ-001` Listar jugadores | [specs/domains/players.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\players.md) | [src/app/features/players/pages/players-list.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\players-list.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-PLAYER-REQ-002` Crear jugador | [specs/domains/players.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\players.md) | [src/app/features/players/pages/player-form.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-form.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-PLAYER-REQ-003` Ver detalle de jugador | [specs/domains/players.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\players.md) | [src/app/features/players/pages/player-detail.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-detail.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-PLAYER-REQ-004` Actualizar jugador | [specs/domains/players.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\players.md) | [src/app/features/players/pages/player-detail.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-detail.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-PLAYER-REQ-005` Administrar relaciones deportivas | [specs/domains/players.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\players.md) | [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts) | Reglas de memoria local | Confirmado como comportamiento actual |

## Academy

| Requisito | Spec | UI / Archivo | Evidencia actual | Estado |
| --- | --- | --- | --- | --- |
| `PLY-ACADEMY-REQ-001` Consultar perfil de academia | [specs/domains/academy.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\academy.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | Perfil editable con tabs y carga de datos | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-002` Editar datos generales de academia | [specs/domains/academy.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\academy.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | Formulario reactivo con validaciones y guardado parcial | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-003` Hidratar y recomponer teléfono internacional | [specs/domains/academy.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\academy.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | Separación `countryCode` + `phoneNumber` al cargar y recomposición al guardar | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-004` Subir, reemplazar y eliminar escudo institucional | [specs/domains/academy.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\academy.md) | [src/app/features/academy/data-access/academy-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\academy-api.service.ts), [src/app/features/academy/data-access/academy-profile.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\academy-profile.service.ts) | Upload multipart y delete 204 | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-005` Previsualizar escudo institucional | [specs/domains/academy.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\academy.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | Diálogo de preview y acción sobre la imagen | Confirmado como comportamiento actual |

## Academy Sports Configuration

| Requisito | Spec | UI / Archivo | Evidencia actual | Estado |
| --- | --- | --- | --- | --- |
| `PLY-ACADEMY-REQ-006` Crear sede | [docs/backlog/frontend/EF-005-sports-configuration.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-005-sports-configuration.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts), [src/app/features/academy/data-access/venue-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\venue-api.service.ts) | Integración real con payload camelCase y refresco post-mutación | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-007` Listar sedes | [docs/backlog/frontend/EF-005-sports-configuration.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-005-sports-configuration.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts), [src/app/features/academy/data-access/venue-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\venue-api.service.ts) | Carga lazy por tab con `page/per_page/sort/direction` | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-008` Ver detalle de sede | [docs/backlog/frontend/EF-005-sports-configuration.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-005-sports-configuration.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | Panel de detalle desde la fila | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-009` Activar o inactivar sede | [docs/backlog/frontend/EF-005-sports-configuration.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-005-sports-configuration.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts), [src/app/features/academy/data-access/venue-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\venue-api.service.ts) | Confirm dialog, acción 204 y refresh de listado | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-010` Crear categoría | [docs/backlog/frontend/EF-005-sports-configuration.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-005-sports-configuration.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts), [src/app/features/academy/data-access/category-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\category-api.service.ts) | Payload camelCase, validación en vivo y refresh | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-011` Listar categorías | [docs/backlog/frontend/EF-005-sports-configuration.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-005-sports-configuration.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts), [src/app/features/academy/data-access/category-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\category-api.service.ts) | Carga lazy, skeleton, paginación y badges de estado | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-012` Actualizar categoría | [docs/backlog/frontend/EF-005-sports-configuration.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-005-sports-configuration.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts), [src/app/features/academy/data-access/category-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\category-api.service.ts) | Modal reutilizado y update real | Confirmado como comportamiento actual |
| `PLY-ACADEMY-REQ-013` Activar o inactivar categoría | [docs/backlog/frontend/EF-005-sports-configuration.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-005-sports-configuration.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts), [src/app/features/academy/data-access/category-api.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\data-access\category-api.service.ts) | Confirm dialog, acción 204 y refresh de listado | Confirmado como comportamiento actual |

## Payments

| Requisito | Spec | UI / Archivo | Evidencia actual | Estado |
| --- | --- | --- | --- | --- |
| `PLY-PAY-REQ-001` Gestionar conceptos de cobro | [specs/domains/payments.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\payments.md) | [src/app/features/payments/pages/payment-concepts.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payment-concepts.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-PAY-REQ-002` Consultar deuda | [specs/domains/payments.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\payments.md) | [src/app/features/payments/pages/charges-debt.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\charges-debt.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-PAY-REQ-003` Registrar pagos | [specs/domains/payments.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\payments.md) | [src/app/features/payments/pages/payments-history.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payments-history.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-PAY-REQ-004` Consultar comprobantes y soportes | [specs/domains/payments.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\payments.md) | [src/app/features/payments/pages/payments-history.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payments-history.ts) | Mock UI | Confirmado como comportamiento actual |
| `PLY-PAY-REQ-005` Ejecutar recaudo rápido | [specs/domains/payments.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\payments.md) | [src/app/features/payments/pages/rapid-collection.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\rapid-collection.ts) | Mock UI | Confirmado como comportamiento actual |

## Membership

| Requisito | Spec | UI / Archivo | Evidencia actual | Estado |
| --- | --- | --- | --- | --- |
| `PLY-MEM-REQ-001` Matrícula como habilitador | [specs/domains/membership.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\membership.md) | [src/app/features/players/pages/player-detail.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-detail.ts) | Regla operativa visible en detalle | Definido como regla de negocio |
| `PLY-MEM-REQ-002` Bloqueo de procesos sin matrícula | [specs/domains/membership.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\membership.md) | [src/app/features/players/pages/player-detail.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-detail.ts) | Mensajes y acciones condicionadas | Definido como regla de negocio |
| `PLY-MEM-REQ-003` Habilitación de procesos con matrícula | [specs/domains/membership.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\membership.md) | [src/app/features/players/pages/player-detail.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\pages\player-detail.ts) | Tabs y acciones posteriores | Definido como regla de negocio |

## Venues

| Requisito | Spec | UI / Archivo | Evidencia actual | Estado |
| --- | --- | --- | --- | --- |
| `PLY-VENUE-REQ-001` Listar sedes del tenant actual | [specs/domains/venues.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\venues.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | API tenant-scoped + cache simple con signals | Confirmado como comportamiento actual |
| `PLY-VENUE-REQ-002` Crear sede | [specs/domains/venues.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\venues.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | Modal + integración real | Confirmado como comportamiento actual |
| `PLY-VENUE-REQ-003` Ver detalle de sede | [specs/domains/venues.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\venues.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | Panel de detalle | Confirmado como comportamiento actual |
| `PLY-VENUE-REQ-004` Activar e inactivar sede | [specs/domains/venues.md](C:\Data\Source\Repos\playertech-webapp\specs\domains\venues.md) | [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\academy\pages\academy-profile.ts) | Confirm dialog + spinner por fila | Confirmado como comportamiento actual |

## Uso

* actualizar esta matriz cuando cambie una spec;
* usarla como puente entre backlog, UI y pruebas;
* agregar nuevas filas solo cuando exista una trazabilidad verificable.
