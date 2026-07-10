# 06-frontend-ui-conventions.md

# Frontend UI Conventions

Este documento define las convenciones visuales y de experiencia de usuario del frontend.

La prioridad es consistencia, claridad y una interfaz preparada para uso operativo real.

---

# UI Principles

* La interfaz debe ser funcional antes que ornamental.
* La consistencia visual debe ser alta entre features.
* La jerarquía visual debe ayudar a operar rápido.
* La UI debe adaptarse a escritorio y móvil.
* Las pantallas deben comunicar estado con claridad.

---

# Layout Conventions

* usar un shell persistente para navegación autenticada;
* mantener una estructura clara de sidebar/topbar/content;
* reservar espacio para títulos, acciones y estado;
* evitar layouts distintos sin razón funcional.

---

# Forms

* usar etiquetas claras;
* agrupar campos por intención;
* validar temprano;
* mostrar errores cerca del campo;
* no depender solo del color para comunicar error;
* mantener acciones primarias y secundarias diferenciadas.

---

# Tables and Lists

* priorizar legibilidad;
* permitir filtros cuando el volumen lo justifique;
* destacar acciones frecuentes;
* usar empty state cuando no haya datos;
* evitar tablas densas sin jerarquía visual.

---

# Empty States

Un empty state debe explicar:

* qué falta;
* por qué podría estar vacío;
* qué puede hacer el usuario ahora.

---

# Loading States

* mostrar feedback inmediato;
* evitar pantallas mudas;
* usar skeletons o indicadores claros cuando sea útil;
* no bloquear innecesariamente la interacción.

---

# Error States

* mostrar mensajes comprensibles;
* distinguir error de validación, red y negocio;
* ofrecer siguiente acción cuando tenga sentido;
* no esconder el problema detrás de un mensaje genérico.

---

# Post-Submit Confirmation

Después de completar un flujo crítico como `signup` o activación inicial, la UI debe mostrar una pantalla de confirmación o cierre cuando el backend haya aceptado la operación.

Reglas:

* confirmar explícitamente el resultado de la acción;
* explicar el siguiente paso con lenguaje simple;
* ofrecer una acción principal clara;
* evitar dejar al usuario en una pantalla muda o ambigua;
* mantener el tono acorde al contexto del usuario, especialmente en flujos de onboarding.

---

# Responsive Behavior

La app debe funcionar bien en:

* escritorio;
* tablet;
* móvil.

Reglas:

* priorizar operaciones críticas en escritorio;
* asegurar navegación usable en pantallas pequeñas;
* evitar componentes que solo funcionen con anchos grandes.

---

# Visual Consistency

La consistencia debe cubrir:

* tipografía;
* espaciado;
* estados de interacción;
* jerarquía de botones;
* patrones de formulario;
* tratamiento de mensajes y alertas.

---

# Non Goals

No se define todavía:

* un design system completo desde el inicio;
* motion avanzada como requisito base;
* personalización visual por academia en la primera fase;
* experimentación libre sin reglas compartidas.
