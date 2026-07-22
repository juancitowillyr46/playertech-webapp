# 04-frontend-state-and-data-access.md

# Frontend State and Data Access

Este documento define cómo se organizan el estado y el acceso a datos en el frontend.

La regla central es simple: la UI consume una capa de acceso a datos clara y la feature decide cómo coordinar esa información.

---

# Purpose

Separar:

* presentación;
* orquestación;
* transporte de datos;
* transformación de modelos;
* estado local.

---

# Data Access Layer

La carpeta `data-access` es la capa de comunicación con datos de una feature.

Puede incluir:

* servicios HTTP;
* facades;
* mappers;
* modelos de entrada y salida;
* stores locales si aplican.

---

# Is a Service

Sí, puede contener servicios.

Pero `data-access` no es solo un servicio aislado.

La intención es que funcione como una capa, no como un archivo único con demasiadas responsabilidades.

---

# Recommended Contents

## API Services

Encapsulan llamadas HTTP hacia backend.

Responsabilidades:

* GET, POST, PUT, DELETE;
* composición de endpoints;
* manejo básico de parámetros;
* tipado de respuestas.

## Facades

Orquestan el consumo de la feature desde la UI.

Responsabilidades:

* coordinar llamadas;
* exponer observables o signals;
* manejar loading y error state;
* simplificar el consumo desde componentes.

## Mappers

Transforman datos entre backend y frontend.

Responsabilidades:

* DTO a modelo;
* modelo a payload;
* normalización de campos;
* adaptación de fechas, enums y estados.

## Models

Definen contratos locales de la feature.

Responsabilidades:

* tipos de respuesta;
* tipos de formulario;
* tipos de vista;
* enums locales si hacen falta.

## Stores

Solo si la feature necesita estado local más elaborado.

Responsabilidades:

* cache local;
* estado de lista/detalle;
* sincronización entre vistas;
* estado de carga y error.

## Simple Signal Cache

Cuando una feature solo necesita evitar consumir dos veces la misma API, el estándar recomendado es usar `signals` locales en la propia feature o en una facade simple.

Patrón mínimo:

* `loaded` para saber si la primera carga ya ocurrió;
* `loading` para bloquear cargas paralelas;
* `error` para exponer fallos recuperables;
* `items` o `detail` como estado en memoria.

Regla de consumo:

* si `loaded` es `false`, la UI puede disparar una carga inicial;
* si `loaded` es `true`, la UI reutiliza el cache local;
* si hubo una mutación exitosa, se invalida el estado o se fuerza `refresh`;
* no se usa NgRx por defecto para este caso.

Este patrón aplica bien cuando:

* la data se consulta desde un único módulo;
* la consistencia eventual corta es aceptable;
* se quiere simplicidad operativa;
* no existe una necesidad real de store global.

---

# State Ownership

El estado debe vivir donde aporta más claridad.

Reglas:

* sesión y perfil global en `core`;
* estado visual persistente en `shell`;
* estado de negocio dentro de la feature;
* estado compartido solo cuando múltiples features realmente lo necesiten.

---

# Consumption Pattern

La UI debe consumir facades o servicios de la feature, no el backend directamente.

Flujo recomendado:

1. el componente dispara una acción;
2. la facade o servicio coordina;
3. `data-access` llama al backend;
4. el mapper adapta la respuesta;
5. el componente recibe un estado listo para renderizar.

---

# Error and Loading States

La capa de datos debe contemplar estados operativos.

Incluye:

* loading;
* success;
* empty;
* error;
* retry cuando aplique.

---

# Data Boundaries

* `data-access` no debe contener UI.
* los componentes no deben construir endpoints.
* la feature no debe mapear DTOs complejos en el template.
* el estado global no debe crecer por conveniencia.

---

# Naming Convention

Convención sugerida:

* `feature.api.ts`
* `feature.facade.ts`
* `feature.mapper.ts`
* `feature.models.ts`
* `feature.store.ts`

---

# Non Goals

No se define todavía:

* NgRx obligatorio;
* un store global para toda la app;
* cache distribuida;
* sincronización offline;
* persistencia local compleja.
