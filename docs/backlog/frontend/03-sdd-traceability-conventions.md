# Convención de trazabilidad SDD

Este documento define una convención mínima para conectar negocio, UI, pruebas y cambios.

## Objetivo

Evitar que el frontend dependa de conocimiento implícito o de nombres sueltos sin referencia estable.

## Estructura sugerida de IDs

* `PLY-REQ-001` = requisito funcional
* `PLY-UI-001` = requisito o regla de interfaz
* `PLY-AC-001` = criterio de aceptación
* `PLY-FLW-001` = flujo de usuario
* `PLY-CMP-001` = componente relevante
* `PLY-DA-001` = servicio o contrato de data-access
* `PLY-TST-001` = prueba automatizada
* `CHG-001` = cambio documentado

## Regla de uso

Cada elemento importante del frontend debería poder seguir esta cadena:

`PLY-REQ` -> `PLY-UI` -> `PLY-AC` -> `PLY-FLW` -> `PLY-CMP` -> `PLY-DA` -> `PLY-TST`

## Criterios de aplicación

* Un requisito puede tener varios criterios de aceptación.
* Un criterio puede impactar varios componentes.
* Un componente no debería inventar reglas de negocio que no estén trazadas.
* Un test debe poder citar el requisito o criterio que valida.

## Reglas de escritura

* Usar IDs cortos y estables.
* No reutilizar el mismo ID para conceptos distintos.
* No renombrar IDs salvo corrección documental mayor.
* Mantener el prefijo del producto consistente en todo el frontend.

## Ejemplo mínimo

* `PLY-REQ-001` - El usuario puede iniciar sesión.
* `PLY-UI-001` - La pantalla de login debe mostrar errores de credenciales de forma clara.
* `PLY-AC-001` - Si faltan campos obligatorios, no se permite enviar el formulario.
* `PLY-FLW-001` - Login -> dashboard.
* `PLY-CMP-001` - `LoginPage`
* `PLY-DA-001` - `AuthAccessService`
* `PLY-TST-001` - prueba de caracterización del flujo de acceso.

## Uso esperado en este repo

* enlazar backlog con specs;
* marcar qué está confirmado y qué sigue siendo mock;
* dar soporte a una futura auditoría o refactor sin perder contexto.
