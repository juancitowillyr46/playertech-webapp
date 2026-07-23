# Payments Flow Spec

## Propósito

Convertir el dominio financiero en flujos concretos con criterios de aceptación observables.

## Flujos cubiertos

* Payment concepts
* Debt inquiry
* Payment history
* Payment register
* Payment cancellation
* Attach evidence
* External fiscal document
* Rapid collection

## Payment concepts

### Pantalla

* [src/app/features/payments/pages/payment-concepts.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payment-concepts.ts)

### Criterios de aceptación

* Dado un usuario autorizado, cuando abre el catálogo, entonces puede listar conceptos de cobro.
* Dado un concepto inactivo, cuando se muestra, entonces debe verse claramente su estado.
* Dado un formulario inválido, cuando intenta guardar, entonces el sistema bloquea el envío.

## Debt inquiry

### Pantalla

* [src/app/features/payments/pages/charges-debt.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\charges-debt.ts)

### Criterios de aceptación

* Dado un usuario autorizado, cuando abre la vista de deuda, entonces puede ver cargos, filtros y estados financieros.
* Dado un cargo pendiente, cuando se muestra, entonces su estado debe ser legible sin ambigüedad.
* Dado un filtro activo, cuando cambia, entonces la vista debe reflejar la selección.

## Payment history

### Pantalla

* [src/app/features/payments/pages/payments-history.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payments-history.ts)

### Criterios de aceptación

* Dado un usuario autorizado, cuando abre el historial, entonces puede ver pagos con su estado.
* Dado un pago pagado, cuando se muestra, entonces debe ofrecer acciones relacionadas con comprobante o soporte.
* Dado un pago anulado, cuando se muestra, entonces el estado debe ser explícito y diferenciado.

## Payment register

### Criterios de aceptación

* Dado un usuario autorizado, cuando registra un pago, entonces debe seleccionar cargos y medio de pago.
* Dado un pago válido, cuando se guarda, entonces queda visible en el historial.
* Dado un pago con validación fallida, cuando intenta guardar, entonces el sistema bloquea la operación.

## Payment cancellation

### Criterios de aceptación

* Dado un pago pagado, cuando se anula, entonces la UI debe pedir confirmación.
* Dado un pago anulado, cuando se revisa, entonces debe conservar trazabilidad visible.

## Evidence and fiscal document

### Criterios de aceptación

* Dado un pago con evidencia, cuando se abre el detalle, entonces la evidencia debe verse o descargarse.
* Dado un pago con documento fiscal externo, cuando se revisa, entonces el vínculo debe aparecer claramente.

## Rapid collection

### Pantalla

* [src/app/features/payments/pages/rapid-collection.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\rapid-collection.ts)

### Criterios de aceptación

* Dado un usuario autorizado, cuando abre recaudo rápido, entonces puede operar sobre un contexto corto y visible.
* Dado un cargo no pagado, cuando entra al flujo, entonces puede ser incluido en el recaudo.

## Estados mínimos del dominio

* inicial
* con deuda
* sin deuda
* pago pagado
* pago anulado
* cargo pendiente
* cargo vencido
* concepto activo
* concepto inactivo

## Evidencia actual

* [src/app/features/payments/data-access/payment-concepts.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\data-access\payment-concepts.service.ts)
* [src/app/features/payments/data-access/charges-debt.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\data-access\charges-debt.service.ts)
* [src/app/features/payments/data-access/payments.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\data-access\payments.service.ts)

