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

## Uso

* actualizar esta matriz cuando cambie una spec;
* usarla como puente entre backlog, UI y pruebas;
* agregar nuevas filas solo cuando exista una trazabilidad verificable.
