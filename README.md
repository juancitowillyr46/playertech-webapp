# PlayerTech WebApp

Frontend web de PlayerTech, construido con Angular 21, PrimeNG 21 y Tailwind CSS para la administración operativa de academias de fútbol en un entorno SaaS multi-tenant.

El proyecto parte de una base tipo Sakai, pero su dirección arquitectónica es una aplicación modular centrada en los dominios del producto, no en la estructura del template.

## Tech Stack

- Angular 21
- PrimeNG 21
- PrimeIcons
- Tailwind CSS
- TypeScript

## Requirements

- Node.js 20.19.0
- npm 10+
- Uso de `npx` para ejecutar Angular CLI

## Setup

Instalar dependencias:

```bash
npx --yes npm@10 install
```

Levantar el servidor de desarrollo:

```bash
npx ng serve
```

El servidor de desarrollo usa `proxy.conf.js`, por lo que las llamadas a `/api/*`
se redirigen automáticamente a `http://localhost:8081`.

Si necesitas apuntar la API a otra dirección, define la variable `PLAYERTECH_API_TARGET` antes de levantar el frontend:

```bash
$env:PLAYERTECH_API_TARGET="http://192.168.1.50:8081"; npx ng serve --host 0.0.0.0
```

Abrir la app en:

```text
http://localhost:4200/
```

## Scripts

- `npx ng serve` inicia el servidor de desarrollo
- `npx ng build` construye la aplicación
- `npx ng test` ejecuta pruebas unitarias

## Architecture Direction

La aplicación se organiza como un monolito modular frontend.

Capas principales:

- `core`: autenticación, guards, interceptors, configuración global y servicios singleton
- `shared`: componentes, pipes, directivas y utilidades reutilizables
- `shell`: layout principal, navegación, sidebar, topbar y estructura persistente
- `features`: módulos funcionales del negocio

## Recommended Frontend Structure

```text
src/app/
├── core/
├── shared/
├── shell/
├── features/
└── app.routes.ts
```

## Frontend Specs

La documentación que gobierna la arquitectura y la forma de trabajo del frontend vive en `specs/`.

Índice principal:

- [`specs/00-frontend-index.md`](specs/00-frontend-index.md)
- [`specs/01-frontend-architecture.md`](specs/01-frontend-architecture.md)
- [`specs/02-frontend-domains.md`](specs/02-frontend-domains.md)
- [`specs/03-frontend-routing.md`](specs/03-frontend-routing.md)
- [`specs/04-frontend-state-and-data-access.md`](specs/04-frontend-state-and-data-access.md)
- [`specs/05-frontend-core-shared-shell.md`](specs/05-frontend-core-shared-shell.md)
- [`specs/06-frontend-ui-conventions.md`](specs/06-frontend-ui-conventions.md)
- [`specs/07-frontend-development-flow.md`](specs/07-frontend-development-flow.md)
- [`specs/08-frontend-testing-strategy.md`](specs/08-frontend-testing-strategy.md)
- [`specs/09-frontend-migration-plan.md`](specs/09-frontend-migration-plan.md)
- [`specs/11-frontend-simple-implementation-standard.md`](specs/11-frontend-simple-implementation-standard.md)
- [`specs/12-frontend-finance-navigation.md`](specs/12-frontend-finance-navigation.md)

## Notes

- `origin` apunta a `playertech-webapp`
- `upstream` apunta al template original
- La base actual todavía conserva estructura heredada de Sakai y se migrará progresivamente

## Working Rules

1. Primero se define la arquitectura.
2. Luego se documenta la convención o el cambio.
3. Después se implementa.
4. No se deja crecer `pages/` como estructura principal.
5. Cada nueva feature nace dentro de su dominio.

## Next Frontend Steps

1. Migrar gradualmente la navegación y el layout al concepto de `shell`.
2. Vaciar la carpeta heredada `pages/` a medida que se creen features reales.
3. Construir `core`, `shared` y la primera feature fundacional.
4. Mantener la documentación sincronizada con la evolución del repo.
