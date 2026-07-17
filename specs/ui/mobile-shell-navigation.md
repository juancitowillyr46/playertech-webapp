# Mobile Shell Navigation Spec

## Objetivo

Definir el comportamiento visual y de interacción del menú lateral en mobile para que la navegación siga siendo clara, legible y usable.

## Alcance

Incluye:

* apertura y cierre del menú desde la burger;
* ancho del panel lateral en mobile;
* visibilidad de textos e iconos;
* overlay y bloqueo de scroll;
* navegación principal del shell;
* consistencia visual del menú con el resto de la app.

## Contexto actual

El comportamiento actual del menú móvil se define en:

* [src/app/layout/component/app.layout.ts](C:\Data\Source\Repos\playertech-webapp\src\app\layout\component\app.layout.ts)
* [src/app/layout/component/app.sidebar.ts](C:\Data\Source\Repos\playertech-webapp\src\app\layout\component\app.sidebar.ts)
* [src/app/layout/component/app.menu.ts](C:\Data\Source\Repos\playertech-webapp\src\app\layout\component\app.menu.ts)
* [src/app/layout/component/app.menuitem.ts](C:\Data\Source\Repos\playertech-webapp\src\app\layout\component\app.menuitem.ts)
* [src/assets/layout/_responsive.scss](C:\Data\Source\Repos\playertech-webapp\src\assets\layout\_responsive.scss)
* [src/assets/layout/_menu.scss](C:\Data\Source\Repos\playertech-webapp\src\assets\layout\_menu.scss)

## Decisión de UX

En mobile, el menú lateral debe priorizar legibilidad sobre compactación extrema.

### Regla propuesta

* Los íconos deben mantenerse.
* Los textos del menú también deben mantenerse visibles en mobile.
* El panel no debe ocupar un ancho desproporcionado que deje solo una columna de íconos flotando visualmente.
* La navegación debe sentirse como un menú usable, no como un rail de iconos sin contexto.

## Flujo

### PLY-UI-NAV-FLW-001 Abrir menú móvil

* Actor: usuario autenticado en mobile.
* Entrada: burger del topbar.
* Resultado esperado: el sidebar se despliega como overlay legible.

### PLY-UI-NAV-FLW-002 Cerrar menú móvil

* Actor: usuario autenticado en mobile.
* Entrada: acción explícita del usuario, cambio de ruta o click fuera.
* Resultado esperado: el sidebar se oculta y el contenido principal vuelve a quedar libre.

### PLY-UI-NAV-FLW-003 Navegar desde menú móvil

* Actor: usuario autenticado en mobile.
* Entrada: item del menú.
* Resultado esperado: la ruta navega y el menú se cierra.

## Criterios de aceptación

* Dado un usuario en mobile, cuando abre la burger, entonces el menú lateral debe mostrarse como panel legible y no como una franja vacía con solo iconos.
* Dado un usuario en mobile, cuando el menú se abre, entonces los textos de las opciones deben permanecer visibles.
* Dado un usuario en mobile, cuando el menú se muestra, entonces el ancho del panel debe ser proporcional al contenido y a la lectura de labels.
* Dado un usuario en mobile, cuando toca fuera del panel o navega a una ruta, entonces el menú se cierra.
* Dado un usuario en mobile, cuando el menú está abierto, entonces el scroll del body debe bloquearse.
* Dado un usuario autenticado, cuando selecciona una opción del menú, entonces la navegación debe suceder sin dejar el panel abierto.

## Estados mínimos

* cerrado;
* abierto;
* overlay visible;
* scroll bloqueado;
* navegación activa;
* item activo.

## Reglas de implementación esperadas

* El responsive no debe reutilizar el estado de `staticMenuDesktopInactive` para ocultar textos en mobile.
* El comportamiento mobile debe tener su propia convención visual, distinta del colapsado desktop.
* Los textos del menú no deben desaparecer solo por reutilizar estilos pensados para sidebar contraído de escritorio.
* El overlay móvil debe priorizar claridad de lectura y no economía extrema de ancho.

## Vacíos a resolver

* ancho exacto recomendado del panel en mobile;
* si el menú debe ocupar casi todo el viewport o una fracción fija;
* si el header de cada sección debe seguir visible;
* si se desea un patrón con labels siempre visibles o una variante compacta con texto secundario.

## Trazabilidad inicial

* `PLY-UI-NAV-REQ-001` menú móvil legible
* `PLY-UI-NAV-REQ-002` textos visibles en mobile
* `PLY-UI-NAV-REQ-003` overlay y cierre consistente
* `PLY-UI-NAV-REQ-004` cierre al navegar

