# Checklist rápida de decisión para nuevas features

Usa esta lista cuando aparezca una nueva idea, pedido o cambio de alcance.

## 1. ¿La feature pertenece a un dominio claro?

* Sí: sigue.
* No: primero define dominio y ownership.

## 2. ¿Resuelve un problema visible para el usuario?

* Sí: sigue.
* No: probablemente no es una feature de frontend todavía.

## 3. ¿Se puede explicar en una frase simple?

* Sí: sigue.
* No: todavía está demasiado difusa para implementarla.

## 4. ¿Tiene al menos un flujo principal identificable?

* Sí: sigue.
* No: primero documenta el flujo.

## 5. ¿Tiene estados visibles previsibles?

* Sí: sigue.
* No: falta definir la experiencia.

## 6. ¿Sabemos si depende de backend, contrato o mock?

* Sí: sigue.
* No: no conviene implementarla todavía.

## 7. ¿Hay riesgo de mezclarla con otra feature?

* Sí: primero define límites.
* No: sigue.

## 8. ¿La spec mínima ya existe?

* Sí: puede pasar a UI o integración.
* No: primero crear spec mínima.

## 9. ¿Los criterios de aceptación están escritos de forma verificable?

* Sí: sigue.
* No: falta madurez documental.

## 10. ¿La feature necesita caracterización?

* Sí: si es crítica o cambiante, planificarla.
* No: no es obligatoria por ahora.

## Resultado rápido

### Va a `backlog`

Si la idea todavía está difusa, tiene dependencias poco claras o no tiene flujo principal.

### Va a `spec`

Si el dominio ya está claro, el problema es visible y hace falta formalizar alcance, flujos y aceptación.

### Va a `implementación`

Si ya tiene spec mínima, criterios verificables, rutas o pantalla clara, y el contrato o mock está entendido.

### Va a `caracterización`

Si el comportamiento es crítico, cambia mucho o ya existe una versión que conviene capturar antes de tocarla.

## Regla práctica

No pasar a código amplio si todavía no puedes responder:

* qué resuelve;
* quién lo usa;
* qué ve en pantalla;
* qué pasa si falla;
* de dónde vienen los datos;
* cómo se valida.

