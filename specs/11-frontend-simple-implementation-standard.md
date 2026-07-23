# 11-frontend-simple-implementation-standard.md

# Frontend Simple Implementation Standard

Este documento define una forma mínima y repetible de implementar código en el frontend de PlayerTech.

La intención es reducir complejidad innecesaria y mantener consistencia sin imponer una arquitectura pesada para cada cambio pequeño.

---

# Objetivo

Dar una guía práctica para implementar pantallas, flujos y ajustes de UI con el menor acoplamiento posible.

---

# Reglas Base

* Cada cambio debe vivir en su `feature` cuando tenga alcance funcional.
* El componente debe limitarse a presentar y coordinar estado local.
* La comunicación con backend debe pasar por `data-access`.
* El template no debe construir contratos ni decisiones de negocio.
* La UI debe consumir `data` como fuente de verdad cuando la API la entregue.

---

# Implementación Mínima

Para una funcionalidad nueva o ajuste pequeño:

1. identificar el dueño funcional;
2. revisar el contrato real;
3. definir el estado mínimo visible;
4. crear o ajustar la capa `data-access`;
5. conectar la UI con datos reales;
6. validar carga, error y éxito;
7. documentar la regla si afecta futuras implementaciones.

---

# Alcance por Capa

## `core`

Solo para infraestructura transversal:

* sesión;
* interceptores;
* guards;
* configuración global;
* utilidades compartidas por toda la app.

## `shared`

Solo para piezas reutilizables sin contexto de negocio:

* componentes genéricos;
* pipes;
* directivas;
* helpers puros.

## `shell`

Solo para navegación y estructura persistente:

* layout;
* sidebar;
* topbar;
* footer;
* estados globales de navegación.

## `features`

Todo lo que responda a una pregunta de negocio o una pantalla concreta.

---

# Estado y Datos

Reglas:

* usar loading solo mientras hay una petición pendiente;
* mostrar empty state si la respuesta viene vacía;
* mostrar error legible si falla la carga;
* no repetir llamadas al backend desde distintos niveles de la UI;
* no mantener datos mockeados si ya existe contrato real.
* cuando un tab depende de un único endpoint, el skeleton debe cubrir el bloque completo del tab, no solo fragmentos sueltos.

---

# UI Simple

Una pantalla simple debe seguir este orden:

* título claro;
* subtítulo corto;
* bloque principal;
* mensaje de estado cuando aplique;
* acción primaria visible;
* acción secundaria si hace falta.

Si el flujo tiene éxito, debe dejar una confirmación clara.

---

# Formularios

* usar labels visibles;
* validar por campo;
* no mostrar campos técnicos al usuario;
* mantener un solo propósito por formulario;
* bloquear submit mientras la petición esté en curso;
* mostrar feedback de envío exitoso o fallido.

---

# Loading y Feedback

* preferir skeleton o spinner solo donde aporta valor;
* no bloquear toda la pantalla si solo carga una sección;
* no ocultar el contenido útil si ya está disponible;
* evitar estados ambiguos sin explicación.

---

# Errores

* traducir errores técnicos a mensajes humanos;
* distinguir validación, sesión expirada y error genérico;
* no mostrar stack traces ni contratos crudos;
* ofrecer una acción siguiente cuando sea posible.

---

# Señales de Buena Implementación

Una implementación simple y buena debe cumplir esto:

* el componente es fácil de leer;
* el servicio hace una sola cosa;
* el estado es visible y predecible;
* no hay lógica duplicada;
* no hay mock sobrante una vez existe integración real;
* el comportamiento se entiende sin abrir demasiados archivos.

---

# Anti-patrones

Evitar:

* un componente que haga HTTP directo;
* lógica de negocio repartida entre template y TS;
* varios orígenes de verdad para el mismo dato;
* estados de carga globales cuando solo carga una sección;
* dialogs o efectos disparados desde más de un endpoint sin control;
* helpers temporales que se quedan sin intención clara.

---

# Criterio de Aceptación

Una implementación cumple este estándar si:

* está ubicada en la capa correcta;
* usa el contrato real;
* muestra estado útil al usuario;
* no sobrecomplica la feature;
* puede mantenerse sin reescritura inmediata.

---

# Relación con Otras Specs

Este documento complementa:

* [01-frontend-architecture.md](./01-frontend-architecture.md)
* [04-frontend-state-and-data-access.md](./04-frontend-state-and-data-access.md)
* [06-frontend-ui-conventions.md](./06-frontend-ui-conventions.md)
* [07-frontend-development-flow.md](./07-frontend-development-flow.md)

---

# Non Goals

No define:

* arquitectura global nueva;
* testing strategy detallada;
* diseño visual completo;
* reglas avanzadas de performance.
