# Auditoría de preparación para Spec-Driven Development del frontend

Fecha: 2026-07-17

Alcance: revisión documental y de estructura del frontend `playertech-webapp` para evaluar qué tan listo está para trabajar con Spec-Driven Development (SDD) usando Codex.

Fuentes revisadas:
- [AGENTS.md](C:\Data\Source\Repos\playertech-webapp\AGENTS.md)
- [specs/00-frontend-index.md](C:\Data\Source\Repos\playertech-webapp\specs\00-frontend-index.md)
- [docs/backlog/frontend/00-frontend-backlog-index.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\00-frontend-backlog-index.md)
- [src/app.routes.ts](C:\Data\Source\Repos\playertech-webapp\src\app.routes.ts)
- [src/app/core/guards/auth.guard.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\guards\auth.guard.ts)
- [src/app/core/guards/guest.guard.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\guards\guest.guard.ts)
- [src/app/core/auth/mock-auth.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\mock-auth.service.ts)
- [src/app/features/auth/auth.routes.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\auth.routes.ts)
- [src/app/features/auth/data-access/auth-access.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\data-access\auth-access.service.ts)
- [src/app/features/players/players.routes.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\players.routes.ts)
- [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts)
- [package.json](C:\Data\Source\Repos\playertech-webapp\package.json)

## 1. Resumen Ejecutivo

El repositorio ya muestra una dirección correcta hacia un monolito modular por features, con documentación base de arquitectura y backlog funcional por épicas. Sin embargo, la madurez SDD todavía es media-baja porque gran parte del comportamiento visible está soportado por mocks, las specs todavía viven mezcladas con backlog, y no hay una cadena verificable completa entre requisito, criterio de aceptación, contrato, componente y prueba.

Lo más valioso ya existente:
- index de specs arquitectónicas en `specs/`
- backlog funcional por épicas en `docs/backlog/frontend/`
- separación inicial por `features`, `core`, `shared`, `layout`

Lo más débil para SDD:
- la fuente de verdad todavía está fragmentada entre documentación, código mock y conocimiento implícito
- no hay evidencia de pruebas automáticas en `src/` ni en `specs/`
- los servicios de dominio relevantes son simulaciones locales, no integración formal con API
- varias reglas de UI se deducen leyendo el código y no desde specs verificables

Conclusión corta: el frontend está bien encaminado para empezar SDD de forma incremental, pero todavía no puede considerarse un repositorio con trazabilidad SDD estable.

## 2. Nivel de Preparación

Escala 1 a 10.

| Área | Puntaje | Justificación |
| --- | ---: | --- |
| Documentación funcional | 7 | Existe backlog por épicas y trazabilidad preliminar en [docs/backlog/frontend/00-frontend-backlog-index.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\00-frontend-backlog-index.md), pero varios elementos siguen en estado `Mock UI` o `Partial`. |
| Especificaciones de UI | 6 | Hay índice de specs en [specs/00-frontend-index.md](C:\Data\Source\Repos\playertech-webapp\specs\00-frontend-index.md), pero no todas las decisiones están aterrizadas en documentos por feature. |
| Flujos | 6 | Se identifican flujos críticos en auth, players, guardians y payments, pero muchos están repartidos entre documentación y páginas concretas. |
| Estados | 5 | Hay estados de éxito y algunos mensajes, pero el manejo de loading, vacío, error y permisos es incompleto o implícito en varios flujos. |
| Formularios | 6 | Login, signup, reset password, player form, guardian form y payment concepts muestran validaciones, pero varias son locales y no están contrastadas con backend. |
| Integración API | 3 | La capa `data-access` existe, pero hoy se apoya en `MockAuthService` y en servicios de memoria como [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts). |
| Permisos | 4 | Hay guards y roles mock, pero la autorización real no está trazada contra reglas de backend. |
| Trazabilidad | 5 | El backlog ya asigna HUs a archivos, pero todavía no existe un sistema de IDs y enlaces consistente entre specs, UI y pruebas. |
| Pruebas | 1 | No encontré archivos `.spec.ts`, `.cy.*` ni `.test.*` en `src/` o `specs/`. |
| Preparación para Codex | 7 | [AGENTS.md](C:\Data\Source\Repos\playertech-webapp\AGENTS.md) sí fija reglas de arquitectura, pero todavía falta reforzar el proceso SDD con convenciones más precisas. |

## 3. Fuentes de Verdad Actuales

| Feature | Fuente principal hoy | Clasificación | Observación |
| --- | --- | --- | --- |
| Auth | [src/app/features/auth/pages/login.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\login.ts), [src/app/features/auth/auth.routes.ts](C:\Data\Source\Repos\playertech-webapp\src/app\features\auth\auth.routes.ts), [src/app/core/auth/mock-auth.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\mock-auth.service.ts) | Código + conocimiento implícito | El login y el acceso dependen de mock local, no de contrato autenticado real. |
| Academy | [docs/backlog/frontend/EF-003-academy-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-003-academy-management.md), [src/app/features/academy/pages/academy-profile.ts](C:\Data\Source\Repos\playertech-webapp\src/app\features\academy\pages\academy-profile.ts) | Documentación + código mock | Hay más especificación que en otras áreas, pero la UI sigue describiendo estados simulados. |
| Players | [docs/backlog/frontend/EF-006-player-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-006-player-management.md), [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts) | Documentación + código mock | El comportamiento visible está muy bien modelado en memoria, pero no existe contrato API real. |
| Guardians | [docs/backlog/frontend/EF-007-guardian-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-007-guardian-management.md), [src/app/features/guardians/pages/guardian-form.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\guardians\pages\guardian-form.ts) | Documentación + código | La relación jugador-acudiente está en UI y servicio local, no en backend verificado. |
| Payments | [docs/backlog/frontend/EF-010-payment-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-010-payment-management.md), [src/app/features/payments/pages/payment-concepts.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payment-concepts.ts) | Documentación + código mock | Hay un dominio muy avanzado en UI, pero la evidencia técnica sigue siendo simulada. |
| Routing | [src/app.routes.ts](C:\Data\Source\Repos\playertech-webapp\src\app.routes.ts), [src/app/features/auth/auth.routes.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\auth.routes.ts), [src/app/features/players/players.routes.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\players.routes.ts) | Código | La navegación está definida, aunque hay mezcla entre páginas legacy y features. |
| Pruebas | `ninguna identificable` | Ninguna fuente identificable | No encontré pruebas automatizadas en el árbol revisado. |
| OpenAPI | `ninguna identificable` | Ninguna fuente identificable | No vi archivo OpenAPI ni contrato equivalente en el repo. |

## 4. Especificaciones Existentes

### Utilizables

- [specs/00-frontend-index.md](C:\Data\Source\Repos\playertech-webapp\specs\00-frontend-index.md) como mapa arquitectónico general.
- [docs/backlog/frontend/00-frontend-backlog-index.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\00-frontend-backlog-index.md) como inventario funcional preliminar.
- Los backlog files por épica, por ejemplo [docs/backlog/frontend/EF-006-player-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-006-player-management.md) y [docs/backlog/frontend/EF-010-payment-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-010-payment-management.md), porque ya contienen rutas, estados y partes del alcance.

### Incompletas

- Las specs de dominio y UI todavía no cubren toda la cadena requisito -> criterio -> estado -> componente -> prueba.
- Hay estados `Done (Mock UI)` que no deberían tomarse como evidencia final de negocio.
- Falta una convención formal de IDs para trazabilidad.

### Contradictorias o ambiguas

- El backlog marca varios flujos como `Done`, pero el código asociado usa servicios mock o memoria local.
- `MockAuthService.canAccess()` devuelve `true` para casi cualquier ruta autenticada, lo que debilita el valor de los guards como política real.

### Inexistentes o no identificables

- No encontré contrato OpenAPI.
- No encontré pruebas automatizadas.
- No encontré un documento explícito de fuente de verdad para permisos o errores.

## 5. Comportamientos Implícitos Encontrados

Estos comportamientos se deducen leyendo código, no desde una spec formal. Deben validarse antes de convertirse en requisito estable.

| Feature | Archivo | Comportamiento implícito | Riesgo |
| --- | --- | --- | --- |
| Auth | [src/app/core/auth/mock-auth.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\core\auth\mock-auth.service.ts) | Un usuario autenticado puede acceder prácticamente a todo; `super_admin` tiene acceso total y el resto también termina con `true`. | Alto |
| Auth | [src/app/features/auth/pages/login.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\login.ts) | El login valida email y contraseña mínimamente y siempre autentica como `tenant_owner`. | Alto |
| Auth | [src/app/features/auth/pages/reset-password.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\auth\pages\reset-password.ts) | La nueva contraseña requiere al menos 8 caracteres y coincidencia con confirmación. | Medio |
| Players | [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts) | La creación de matrícula genera dos cargos iniciales automáticamente. | Alto |
| Players | [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts) | No se permite duplicar una asignación activa al mismo equipo. | Medio |
| Guardians | [src/app/features/players/data-access/player-management.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\players\data-access\player-management.service.ts) | No se elimina la relación del acudiente primario. | Medio |
| Payments | [src/app/features/payments/pages/payment-concepts.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payment-concepts.ts) | El estado visible de concepto depende de un toggle `ACTIVE`/`INACTIVE`. | Medio |
| Payments | [src/app/features/payments/pages/payments-history.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payments-history.ts) | Las anulaciones y confirmaciones están modeladas en UI con `ConfirmationService` y `MessageService`, no como contrato externo. | Medio |
| Routing | [src/app.routes.ts](C:\Data\Source\Repos\playertech-webapp\src\app.routes.ts) | El dashboard raíz convive con rutas legacy de `pages` y con features modernas. | Medio |

## 6. Flujos Críticos Sin Especificar

Prioridad alta:
- recuperación de sesión y expiración real de token
- resolución de permisos por rol y por tenant
- alta de jugador con fotos, acudientes, matrícula y cargos
- registro de pago y anulación con efectos financieros
- creación y edición de conceptos de cobro
- onboarding de tenant / academia

Prioridad media:
- manejo de errores 401 y 403
- reintento, estados vacíos y carga en listados principales
- carga masiva de jugadores y adjuntos de pago

## 7. Vacíos Críticos

| Vacío | Severidad | Motivo |
| --- | --- | --- |
| Pruebas automatizadas ausentes | Crítico | Sin tests no hay evidencia de comportamiento estable para SDD. |
| Contrato API/OpenAPI ausente | Crítico | No hay una fuente compartida para modelos y validaciones contractuales. |
| Permisos reales no trazados | Alto | Los guards están basados en mock, así que la autorización es frágil. |
| Estados de error/vacío incompletos | Alto | Varios flujos solo describen el caso feliz. |
| Trazabilidad entre docs y componentes | Alto | Hay backlinks manuales, pero no IDs consistentes ni una cadena completa. |
| Duplicación de lógica de negocio en frontend | Medio | La UI simula reglas que probablemente deberían vivir en backend o contrato compartido. |
| Mezcla de template y producto | Medio | El árbol aún arrastra páginas `uikit`, `crud`, `landing` y `pages` junto con features reales. |

## 8. Contradicciones

- El backlog declara muchos flujos como `Done` o `Done (Mock UI)`, pero el código usa servicios de memoria y autenticación mock.
- Las specs sugieren un monolito modular por features, pero todavía coexisten rutas legacy de template con features de negocio.
- Los permisos aparecen en guards y roles mock, pero no hay evidencia de reglas coherentes provenientes del backend.
- Se documentan contratos API concretos en algunos backlog files, pero no hay un contrato técnico navegable dentro del repo.

## 9. Propuesta de Estructura SDD

La estructura propuesta en el prompt es razonable, pero yo la adaptaría a la realidad actual del repo así:

```text
/
├── AGENTS.md
├── docs/
│   ├── product/
│   ├── ux/
│   ├── architecture/
│   ├── standards/
│   └── backlog/
│       └── frontend/
├── specs/
│   ├── architecture/
│   ├── domains/
│   ├── routing/
│   ├── ui/
│   ├── data-access/
│   └── testing/
├── changes/
│   ├── active/
│   └── archived/
└── skills/
```

Propósito por carpeta:
- `docs/product`: reglas y contexto de negocio compartido con backend
- `docs/ux`: decisiones de experiencia, flujos, estados y accesibilidad
- `docs/architecture`: boundaries, capas y reglas de evolución del frontend
- `docs/standards`: convenciones transversales, trazabilidad y naming
- `docs/backlog/frontend`: backlog funcional vivo, útil para priorización
- `specs/*`: especificaciones verificables y versionables por tema
- `changes/active`: propuesta de cambio con criterios de aceptación y plan de prueba
- `changes/archived`: historial de cambios cerrados

## 10. Documentos Iniciales Recomendados

1. `specs/domains/auth.md`
1. `specs/domains/players.md`
1. `specs/domains/payments.md`
1. `specs/routing.md`
1. `specs/ui/states-and-feedback.md`
1. `specs/testing-strategy.md`
1. `docs/standards/trazabilidad.md`

Por qué primero:
- cubren los flujos con mayor impacto funcional
- permiten separar comportamiento estable de comportamiento mock
- ayudan a que Codex y el equipo compartan la misma lectura del producto

## 11. Features Prioritarias

1. Auth and Access
1. Tenant Onboarding
1. Player Management
1. Membership Management
1. Payment Management
1. Academy Management
1. Guardian Management
1. Team Management
1. Staff Management

## 12. Estrategia de Adopción Incremental

### Fase 1: Documentación mínima confiable
- consolidar specs por dominio
- agregar IDs de trazabilidad
- separar claramente `mock UI` de comportamiento confirmado

### Fase 2: Caracterización
- convertir flujos actuales en pruebas de caracterización
- capturar estados y reglas realmente visibles

### Fase 3: Contratos
- introducir o enlazar OpenAPI
- alinear DTOs y enums compartidos

### Fase 4: Refuerzo de trazabilidad
- conectar requisito -> UI -> componente -> prueba
- mantener backlog y specs sincronizados

### Fase 5: Automatización y refactorización
- reemplazar mocks por integración real cuando ya haya contrato estable
- refactorizar solo después de tener cobertura mínima

## 13. Riesgos de Adopción

- duplicación con backend si las reglas de negocio se copian al frontend
- specs desactualizadas si no se enlazan a un ciclo de revisión
- modelos manuales inconsistentes sin contrato compartido
- exceso de documentación sin ownership claro
- criterios de aceptación ambiguos si no se escriben en formato verificable
- refactorización prematura antes de tener caracterización

## 14. Recomendaciones para AGENTS.md

Agregar o reforzar estas reglas:
- la fuente de verdad funcional debe vivir en specs versionadas, no en mocks
- toda feature nueva debe nacer con doc de alcance, criterios de aceptación y mapa de rutas
- no convertir UI mock en regla de negocio sin validación
- no introducir estado global nuevo sin especificación
- toda regla relevante debe tener trazabilidad hacia archivo y símbolo
- distinguir explícitamente `mock`, `placeholder`, `caracterización` y `contrato real`
- documentar antes de refactorizar

## 15. Plan de Trabajo Propuesto

1. Consolidar una spec por dominio prioritario.
   - Dependencia: ninguna.
   - Riesgo: bajo.
   - Criterio de fin: cada dominio crítico tiene alcance, flujos y estados mínimos.
2. Definir esquema de trazabilidad.
   - Dependencia: specs base.
   - Riesgo: bajo.
   - Criterio de fin: IDs consistentes para requisito, UI y prueba.
3. Crear caracterización de auth, players y payments.
   - Dependencia: definición de flujos.
   - Riesgo: medio.
   - Criterio de fin: tests que describen el comportamiento actual.
4. Alinear contratos API con backlog.
   - Dependencia: inventario de flujos.
   - Riesgo: medio.
   - Criterio de fin: cada flujo importante tiene fuente de contrato identificable.
5. Separar mock UI de comportamiento confirmado.
   - Dependencia: caracterización.
   - Riesgo: medio.
   - Criterio de fin: el backlog marca claramente lo simulado.
6. Empezar integración real por dominio prioritario.
   - Dependencia: contrato y tests mínimos.
   - Riesgo: alto.
   - Criterio de fin: un flujo real funcionando sin romper los casos caracterizados.

## 16. Decisiones Pendientes

- ¿Qué backend o documento contractual será la fuente de verdad para roles y permisos?
- ¿Existe un OpenAPI que no esté todavía en el repo?
- ¿Qué flujos `Mock UI` deben tratarse como definición válida y cuáles solo como placeholder?
- ¿Cuál será la carpeta oficial para `changes/` y quién la mantendrá?
- ¿Se conservarán temporalmente las páginas legacy del template o se planificará su retiro?

## Cierre

Este repositorio ya tiene material suficiente para arrancar una adopción SDD incremental, pero hoy la evidencia sigue apoyándose demasiado en mocks y backlog descriptivo. La mejor siguiente jugada es convertir los dominios críticos en specs verificables y tests de caracterización, antes de tocar refactors amplios.
