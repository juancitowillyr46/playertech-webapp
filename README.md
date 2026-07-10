# PlayerTech WebApp

Frontend web for PlayerTech, built with Angular 21 and PrimeNG 21, to manage football academies, players, teams, memberships, payments, and operational workflows in a multi-tenant SaaS platform.

The project starts from the PrimeNG Sakai template and is being adapted into a production-oriented application for academy administration.

## Tech Stack

- Angular 21
- PrimeNG 21
- PrimeIcons
- Tailwind CSS
- TypeScript

## Requirements

- Node.js 20.19.0
- npm 10+
- The repository is intended to run with `npx` for Angular CLI commands

## Setup

Install dependencies:

```bash
npx --yes npm@10 install
```

Run the development server:

```bash
npx ng serve
```

Open the app in:

```text
http://localhost:4200/
```

## Scripts

- `npx ng serve` starts the development server
- `npx ng build` builds the application
- `npx ng test` runs unit tests

## Repository Structure

- `src/` Angular application source
- `src/assets/` Sakai layout and styling assets
- `public/` static assets

## Notes

- `origin` points to `playertech-webapp`
- `upstream` points to the original Sakai repository
- The UI is being transformed from the Sakai starter into the PlayerTech brand and workflows

## Next Frontend Steps

1. Clean the remaining Sakai demo views.
2. Define the PlayerTech frontend module structure.
3. Build the shell, navigation, and auth flow.
4. Add API integration for the first business modules.
