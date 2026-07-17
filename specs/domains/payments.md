# Payments Domain Spec

## Objetivo

Definir el comportamiento verificable del catálogo financiero, cargos, pagos, comprobantes y recaudo rápido.

## Alcance

Incluye:

* conceptos de cobro;
* cargos pendientes;
* deuda del jugador;
* pagos;
* comprobantes;
* evidencias;
* documentos fiscales externos;
* recaudo rápido.

## Fuente de verdad actual

* [src/app/features/payments/data-access/payment-concepts.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\data-access\payment-concepts.service.ts)
* [src/app/features/payments/data-access/charges-debt.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\data-access\charges-debt.service.ts)
* [src/app/features/payments/data-access/payments.service.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\data-access\payments.service.ts)
* [src/app/features/payments/pages/payment-concepts.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payment-concepts.ts)
* [src/app/features/payments/pages/charges-debt.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\charges-debt.ts)
* [src/app/features/payments/pages/payments-history.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\payments-history.ts)
* [src/app/features/payments/pages/rapid-collection.ts](C:\Data\Source\Repos\playertech-webapp\src\app\features\payments\pages\rapid-collection.ts)
* [docs/backlog/frontend/EF-010-payment-management.md](C:\Data\Source\Repos\playertech-webapp\docs\backlog\frontend\EF-010-payment-management.md)

## Flujos

### PLY-PAY-FLW-001 Catálogo de conceptos

* Actor: staff autorizado.
* Entrada: módulo de pagos.
* Resultado: listar, crear, editar y activar o desactivar conceptos.

### PLY-PAY-FLW-002 Consulta de deuda

* Actor: staff autorizado.
* Entrada: vista financiera o detalle de jugador.
* Resultado: ver cargos, estado y saldo pendiente.

### PLY-PAY-FLW-003 Registro de pago

* Actor: staff autorizado.
* Entrada: historial o contexto de deuda.
* Resultado: registrar pago con medio, comprobante y evidencia.

### PLY-PAY-FLW-004 Recaudo rápido

* Actor: staff autorizado.
* Entrada: vista operativa de recaudo.
* Resultado: recaudar desde un contexto rápido con consolidado visible.

## Estados mínimos

* inicial;
* carga;
* vacío;
* error;
* éxito;
* pagado;
* pendiente;
* vencido;
* anulado;
* sin cargos;
* sin pagos.

## Formularios y validaciones visibles

* concepto con nombre, tipo, frecuencia y estado;
* pago con cargos seleccionables y medio de pago;
* evidencia opcional o condicionada por flujo;
* anulación con confirmación;
* no duplicar operaciones que ya quedaron registradas.

## Reglas de aceptación

* La UI debe separar concepto, cargo, pago y deuda.
* El saldo pendiente debe derivarse de cargos y no de un campo inventado.
* La anulación y el comprobante deben quedar trazables desde el pago.
* El recaudo rápido debe seguir perteneciendo al dominio financiero actual.

## Vacíos a resolver

* contrato real de pagos;
* forma oficial de comprobantes;
* reglas de evidencias y documento fiscal externo;
* manejo de errores y reversos.

## Trazabilidad inicial

* `PLY-PAY-REQ-001` gestionar conceptos de cobro
* `PLY-PAY-REQ-002` consultar deuda
* `PLY-PAY-REQ-003` registrar pagos
* `PLY-PAY-REQ-004` consultar comprobantes y soportes
* `PLY-PAY-REQ-005` ejecutar recaudo rápido

