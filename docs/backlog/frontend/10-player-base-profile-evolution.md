# Evolución del perfil base del jugador

## Identificación

* Nombre de la feature: Evolución del perfil base del jugador
* Dominio principal: Player Management
* Subdominios relacionados: Membership, Payments, Guardian Management
* Owner funcional: Operación de academia
* Fecha de apertura: 2026-07-18

## Problema que resuelve

El modelo de `Player` creció en backend y el frontend debe reflejar esa evolución sin mezclar todavía datos deportivos o de camiseta. El perfil base ahora necesita mostrar y editar más atributos de identidad, manteniendo la ficha del jugador como la base operativa del dominio.

## Alcance inicial

Incluye:

* formulario de crear jugador;
* formulario de editar jugador;
* listado de jugadores;
* detalle y resúmenes visibles del jugador;
* ajuste de modelos y mocks de datos del dominio.

Excluye:

* número de camiseta;
* nombre de camiseta;
* posición;
* flujos de importación masiva;
* cambios de backend.

## Actores

* Staff autorizado
* Academy Admin
* Tenant Owner

## Flujos principales

* Crear jugador con identidad base ampliada.
* Editar jugador con el mismo contrato base.
* Consultar listado y detalle mostrando documento y atributos básicos.

## Estados visibles

* inicial
* carga
* vacío
* éxito
* error
* confirmación

## Criterios de aceptación

* Dado un usuario autorizado, cuando abre crear o editar jugador, entonces ve los campos base del contrato actual del backend.
* Dado un formulario de jugador incompleto, cuando intenta guardar, entonces la UI bloquea el envío y muestra validaciones sobre los campos obligatorios.
* Dado un jugador existente, cuando se muestra en listado o detalle, entonces se ven `documentType` y `documentNumber` como parte de su identidad.
* Dado un jugador sin datos opcionales, cuando se abre el detalle, entonces la UI muestra estado vacío por campo sin inventar valores.
* Dado el contrato actual del backend, cuando se implementa el front, entonces no se agregan campos de camiseta ni posición al modelo base.

## Rutas

* Ruta principal: `/players`
* Rutas secundarias: `/players/new`, `/players/:id`
* Rutas públicas: ninguna
* Rutas privadas: todas las anteriores

## UI

* Páginas: listado, formulario de creación y detalle/edición de jugador.
* Componentes locales: cards de resumen, tabla de jugadores, formulario base y bloque de información del perfil.
* Componentes compartidos a reutilizar: `page-header`, `p-table`, `p-select`, `p-tag`, `p-message`.
* Estados vacíos/carga/error: vacíos por campo opcional, estado vacío del listado y validación inline.
* Comportamiento responsive: mantener formularios legibles en mobile y no sobrecargar el ancho del detalle.

## Data access

* Servicio o facade: `PlayerManagementService`
* Modelos necesarios: `Player`, `PlayerForm`, `PlayerPhoto`
* DTOs o mapeos: mapeo directo del contrato backend al modelo de front
* Contrato API o mock temporal: alineado con `CreatePlayerRequest`, `UpdatePlayerRequest` y `PlayerResponse`
* Manejo de errores: validaciones UI para obligatorios y mensajes de campo cuando falte información

## Trazabilidad

* `PLY-REQ-101` ampliar perfil base del jugador
* `PLY-UI-101` mostrar documento y datos base en formularios
* `PLY-UI-102` mostrar documento y datos base en listado y detalle
* `PLY-DA-101` extender modelos y mocks del jugador
* `PLY-AC-101` guardar jugador con contrato actualizado

## Documentación mínima requerida

Antes de implementar, la feature debe tener:

* spec mínima;
* criterios de aceptación;
* trazabilidad inicial;
* decisión de ownership;
* lista de vacíos conocidos.

## Caracterización

* ¿requiere pruebas de caracterización?: no por ahora
* ¿es un flujo crítico?: sí, pero el cambio es acotado
* ¿cambia con frecuencia?: sí, por evolución del dominio
* ¿tiene comportamiento implícito a capturar?: sí, especialmente los campos fuera de `Player`

## Dependencias

* Depende de: contrato backend ya evolucionado para players
* Bloquea a: importación masiva y siguientes mejoras del perfil deportivo

## Estado de madurez

* Spec mínima

## Notas

* `number` y `name` de camiseta quedan fuera del modelo base.
* `position` sigue siendo una evolución deportiva posterior.
* Si en una iteración futura el backend vuelve obligatorios `nationality`, `gender`, `federationId` o `dominantFoot`, la UI deberá subir su nivel de validación sin rehacer el dominio.
