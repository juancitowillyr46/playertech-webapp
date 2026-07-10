# 03-frontend-routing.md

# Frontend Routing

Este documento define la convención de rutas del frontend de PlayerTech WebApp.

La navegación debe ser clara, modular y consistente con la estructura por features.

---

# Routing Principles

* Las rutas deben reflejar contextos funcionales.
* Las rutas públicas deben separarse de las privadas.
* Las features deben cargarse con lazy loading.
* El shell debe envolver la navegación autenticada.
* La ruta no debe exponer detalles internos innecesarios.

---

# Route Zones

## Public Routes

Rutas accesibles sin iniciar sesión.

Incluyen:

* login;
* recovery flows;
* landing o landing temporal si aplica.

## Private Routes

Rutas que requieren sesión válida.

Incluyen:

* dashboard;
* features de negocio;
* vistas administrativas;
* operaciones protegidas.

---

# Shell Routes

Las rutas privadas deben vivir dentro del shell visual de la aplicación.

Ejemplo conceptual:

```text
/
└── shell
    ├── dashboard
    ├── academy
    ├── users
    ├── sports
    ├── membership
    └── payments
```

---

# Feature Routes

Cada feature debe exponer su propio archivo de rutas.

Convención:

```text
features/feature-name/feature-name.routes.ts
```

Reglas:

* las rutas de la feature se mantienen cerca de la feature;
* el router principal solo coordina carga y composición;
* las pantallas de negocio no deben declararse en rutas globales dispersas.

---

# Lazy Loading Convention

Cada feature importante debe cargarse con `loadChildren`.

Beneficios:

* mejor separación;
* menor costo inicial;
* escalabilidad;
* mantenimiento más claro.

---

# Guard Strategy

Las rutas protegidas deben usar guards cuando aplique.

Posibles controles:

* sesión activa;
* rol autorizado;
* tenant disponible;
* contexto de plataforma vs contexto de academia.

---

# Redirect Strategy

La navegación debe definir redirecciones explícitas.

Reglas:

* redirigir a login si no hay sesión;
* redirigir al dashboard o landing interna tras autenticación;
* evitar rutas ambiguas;
* mantener una wildcard route controlada.

---

# Route Naming Rules

* Las rutas deben ser legibles.
* El nombre de la ruta debe describir la intención de negocio.
* Evitar nombres demasiado técnicos.
* Evitar prefijos innecesarios que ensucien la URL.

Ejemplos:

* `auth/login`
* `academy`
* `sports/players`
* `membership/enrollments`
* `payments/list`

---

# Route Ownership

La feature dueña del contexto también es dueña de sus rutas.

El router raíz solo debe:

* componer zonas públicas y privadas;
* aplicar guards globales;
* cargar features;
* resolver redirects generales.

---

# Non Goals

No se define todavía:

* internacionalización de rutas;
* microfrontends;
* navegación compleja entre aplicaciones separadas;
* routing generado por metadata dinámica.

