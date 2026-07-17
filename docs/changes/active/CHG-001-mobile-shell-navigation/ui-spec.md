# CHG-001 UI Spec

## Pantallas afectadas

* Shell principal
* Topbar
* Sidebar
* Menu item rendering

## Comportamiento esperado

### Mobile

* El sidebar debe abrirse como overlay.
* El ancho del sidebar debe permitir ver iconos y textos.
* Los labels no deben ocultarse por compartir estilos con el modo desktop colapsado.
* El menú debe seguir siendo reconocible como navegación principal.

### Desktop

* No cambiar la experiencia existente del shell desktop.
* Mantener el comportamiento de colapso desktop intacto.

## Estados

* cerrado
* abierto
* overlay visible
* scroll bloqueado
* navegación activa

## Notas de implementación

* La lógica mobile no debe depender del estado `staticMenuDesktopInactive`.
* La presentación mobile debe tener una convención propia.
* La transición entre estados abierto/cerrado debe sentirse fluida; no debe haber un cambio abrupto entre solo íconos y labels visibles.

## Trazabilidad inicial

* `PLY-UI-NAV-REQ-001` menú móvil legible
* `PLY-UI-NAV-REQ-002` textos visibles en mobile
* `PLY-UI-NAV-REQ-003` overlay y cierre consistente
* `PLY-UI-NAV-REQ-004` cierre al navegar
* `PLY-UI-NAV-REQ-005` transición fluida entre iconos y labels
