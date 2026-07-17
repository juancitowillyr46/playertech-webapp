# Plantilla de criterios de aceptación SDD

Esta plantilla se usa para escribir criterios de aceptación que puedan verificarse sin ambigüedad.

## Regla principal

Cada criterio debe describir:

* un actor;
* una acción;
* una condición;
* un resultado observable;
* un error o estado alternativo si aplica.

## Formato recomendado

* **Dado** un `actor` en una `condición`
* **Cuando** realiza una `acción`
* **Entonces** ocurre un `resultado observable`

## Reglas de escritura

* Un criterio no debe mezclar más de un resultado principal.
* Si hay una validación, debe quedar explícita la consecuencia visual.
* Si existe error, debe indicar qué ve el usuario.
* Si una acción depende de permisos, el permiso debe mencionarse.
* Si el flujo cruza varios estados, cada estado debe poder evaluarse por separado.

## Buen ejemplo

* Dado un usuario no autenticado, cuando intenta abrir una ruta privada, entonces el sistema lo redirige a `/auth/login`.

## Mal ejemplo

* El sistema debe funcionar bien y ser claro.

## Checklist de calidad

Antes de cerrar un criterio, verificar:

* ¿se puede probar?
* ¿se puede observar?
* ¿evita ambigüedad?
* ¿no mezcla dos reglas distintas?
* ¿está alineado con backend o con una decisión explícita de frontend?

## Uso esperado

Esta plantilla se aplica en:

* specs de dominio;
* cambios activos;
* backlog de alto detalle;
* pruebas de caracterización.

