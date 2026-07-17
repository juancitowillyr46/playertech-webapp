# Plantilla de nueva feature SDD

Usa esta plantilla cada vez que aparezca una feature nueva o una expansión importante de una existente.

## 1. Identificación

* Nombre de la feature:
* Dominio principal:
* Subdominios relacionados:
* Owner funcional:
* Fecha de apertura:

## 2. Problema que resuelve

Describe en una o dos frases qué necesidad del negocio o del usuario cubre.

## 3. Alcance inicial

Incluye solo lo que entra en esta iteración.

* Incluye:
* Excluye:

## 4. Actores

Lista de perfiles que interactúan con la feature.

* Actor 1:
* Actor 2:

## 5. Flujos principales

Enumera los flujos que sí deben existir desde el inicio.

* Flujo 1:
* Flujo 2:
* Flujo 3:

## 6. Estados visibles

Marca los estados que la interfaz debe contemplar.

* inicial
* carga
* vacío
* éxito
* error
* sin permisos
* sin datos
* confirmación

## 7. Criterios de aceptación

Escribe criterios observables siguiendo este formato:

* Dado ...
* Cuando ...
* Entonces ...

Reglas:

* un criterio por comportamiento observable;
* si hay error, describir qué ve el usuario;
* si hay permiso, indicar el rol o condición;
* si hay navegación, indicar el destino.

## 8. Rutas

* Ruta principal:
* Rutas secundarias:
* Rutas públicas:
* Rutas privadas:

## 9. UI

* Páginas:
* Componentes locales:
* Componentes compartidos a reutilizar:
* Estados vacíos/carga/error:
* Comportamiento responsive:

## 10. Data access

* Servicio o facade:
* Modelos necesarios:
* DTOs o mapeos:
* Contrato API o mock temporal:
* Manejo de errores:

## 11. Trazabilidad

Asigna IDs estables.

* `PLY-REQ-XXX`
* `PLY-UI-XXX`
* `PLY-AC-XXX`
* `PLY-FLW-XXX`
* `PLY-CMP-XXX`
* `PLY-DA-XXX`
* `PLY-TST-XXX`

## 12. Documentación mínima requerida

Antes de implementar, la feature debe tener:

* spec mínima;
* criterios de aceptación;
* trazabilidad inicial;
* decisión de ownership;
* lista de vacíos conocidos.

## 13. Caracterización

Completar solo si aplica.

* ¿requiere pruebas de caracterización?:
* ¿es un flujo crítico?:
* ¿cambia con frecuencia?:
* ¿tiene comportamiento implícito a capturar?:

## 14. Dependencias

* Depende de:
* Bloquea a:

## 15. Estado de madurez

Marca el estado actual:

* Draft
* Spec mínima
* UI definida
* Integración pendiente
* Caracterizada
* Lista para evolución

## 16. Notas

Espacio para decisiones puntuales, riesgos y aclaraciones.

