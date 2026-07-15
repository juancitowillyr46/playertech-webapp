# EF-010 Payment Management

## Objetivo

Construir un módulo financiero claro y profesional para la academia, permitiendo configurar conceptos de cobro, consultar cargos, registrar pagos y leer la deuda del jugador con una experiencia consistente y madura.

## Problema que Resuelve

La academia necesita pasar de una operación dispersa a un flujo financiero ordenado:

* primero definir qué se cobra;
* luego generar o consultar la deuda;
* después registrar pagos con trazabilidad;
* finalmente leer cartera y saldo pendiente por jugador.

## Valor de Negocio

Habilita control administrativo sobre:

* catálogo de cobros reutilizable;
* cargos asociados a matrícula o jugador;
* pagos registrados con medio y evidencia;
* deuda visible para seguimiento;
* base sólida para futuras extensiones tipo POS.

## Actores

* Tenant Owner
* Academy Admin
* Staff autorizado

## Dominios Involucrados

* PaymentConcept
* Charge
* Payment
* PaymentAllocation
* PaymentReceipt
* PaymentEvidence
* ExternalFiscalDocument
* Membership
* Player
* Guardian

## Enfoque de Interfaz

El módulo financiero no debe sentirse como formularios aislados, sino como un pequeño sistema SaaS interno con cinco capas visibles:

### 1. Configuración

Catálogo de `Conceptos de cobro`.

### 2. Operación

Consulta y gestión de `Cargos`.

### 3. Cobro

Registro y consulta de `Pagos`.

### 4. Comprobantes y soportes

Visualización y descarga de `Comprobantes`, `Evidencias` y `Documentos fiscales externos`.

### 5. Seguimiento

Lectura de `Deuda` y estado financiero del jugador.

## Secuencia Recomendada de Implementación Front

### Etapa 1. Conceptos de cobro como catálogo base

Primero se modela el catálogo que da contexto a todo lo demás.

Incluye ejemplos como:

* matrícula;
* mensualidad;
* inscripción;
* uniforme;
* seguro;
* recargo;
* otros cobros administrativos.

#### Regla de dominio acordada para frontend

El campo `code` no debe ser capturado por el usuario.

La interfaz debe asumir que:

* `code` es generado por backend;
* en creación no se solicita;
* en edición puede mostrarse solo como lectura si aporta contexto;
* el usuario trabaja principalmente con:
  * nombre;
  * descripción;
  * valor base;
  * frecuencia.

### Etapa 2. Cargos y deuda operativa

Después se monta la lectura de deuda real a partir de cargos.

Incluye:

* consultar cargos pendientes;
* distinguir pendiente, pagado y vencido si aplica;
* resumir deuda por jugador;
* conectar con la matrícula ya visible en el detalle del jugador.

#### Decisión de interfaz para la etapa 2

La etapa 2 se expone en dos lugares complementarios:

* un resumen dentro del detalle del jugador;
* una vista financiera propia de `Cargos y deuda` dentro del módulo `payments`.

Esto permite:

* revisar deuda en contexto individual;
* y al mismo tiempo operar una lectura más administrativa sin salir del dominio financiero.

### Etapa 3. Pagos y evidencias

Luego se habilita el registro financiero del recaudo.

Incluye:

* registrar pago;
* registrar medio;
* adjuntar evidencia;
* consultar historial;
* anular cuando corresponda.

### Etapa 4. Comprobantes y soportes

Después se consolida la lectura documental del pago.

Incluye:

* visualizar comprobante administrativo;
* descargar comprobante en PDF;
* adjuntar evidencia de pago;
* asociar documento fiscal externo cuando exista.

#### Decisión de interfaz para la etapa 4

El comprobante administrativo es parte nativa del módulo de pagos y debe percibirse como resultado natural del recaudo.

La evidencia de pago y el documento fiscal externo son soportes secundarios del pago:

* no reemplazan el comprobante administrativo;
* no deben sentirse como formularios aislados;
* deben poder visualizarse desde el detalle del pago.

### Etapa 5. Vista financiera consolidada

Finalmente se fortalece la lectura operativa.

Incluye:

* saldo pendiente;
* cargos pendientes;
* pagos aplicados;
* navegación entre deuda, cargos y pagos.

## Historias de Usuario

### Etapa 1. Conceptos de cobro

* HU-001 Listar conceptos de cobro.
* HU-002 Crear concepto de cobro sin capturar código manual.
* HU-003 Editar concepto de cobro sin modificar código generado.
* HU-004 Activar o desactivar concepto de cobro.

### Etapa 2. Cargos y deuda

* HU-005 Consultar cargos pendientes.
* HU-006 Consultar deuda consolidada del jugador.
* HU-007 Ver estado financiero resumido desde matrícula y cargos.

### Etapa 3. Pagos

* HU-008 Registrar pago sobre uno o varios cargos.
* HU-009 Registrar medio de pago.
* HU-011 Consultar historial de pagos.
* HU-012 Anular o cancelar pago según reglas del backend.

### Etapa 4. Comprobantes y soportes

* HU-010 Ver comprobante administrativo de pago.
* HU-014 Descargar comprobante administrativo en PDF.
* HU-015 Adjuntar evidencia de pago.
* HU-016 Asociar documento fiscal externo a un pago.
* HU-017 Consultar soportes y adjuntos de un pago.

### Etapa 5. Navegación financiera y recaudo rápido

* HU-013 Navegar desde deuda hacia cargos y pagos relacionados.
* HU-018 Ejecutar recaudo rápido desde jornada o contexto operativo.
* HU-019 Consultar reporte consolidado de recaudo rápido.

## Reglas de UX Relacionadas

* Separar visualmente `concepto`, `cargo`, `pago` y `deuda`.
* No mezclar configuración financiera con acciones operativas del jugador en un mismo bloque sin contexto.
* Mostrar montos, estado y vencimiento con jerarquía visual simple.
* Empezar la deuda en contexto de jugador antes de abrir una cartera global más compleja.
* Mantener el lenguaje de negocio:
  * `Conceptos de cobro`
  * `Cargos`
  * `Pagos`
  * `Comprobante`
  * `Evidencia`
  * `Documento fiscal externo`
  * `Deuda`
* Recordar siempre que `recaudo rápido` sigue siendo parte de `Pagos` y no del dominio `POS`.

## Alcance de Interfaz Propuesto

### Módulo independiente

#### Conceptos de cobro

Pantalla propia para:

* listar;
* crear;
* editar;
* activar/desactivar.

### Contexto inicial dentro de jugador

#### Cargos

Vista dentro del detalle del jugador para:

* ver cargos pendientes;
* entender origen del cobro;
* registrar pago desde el contexto correcto.

#### Pagos

Vista dentro del detalle del jugador para:

* revisar pagos aplicados;
* ver medio, comprobante y evidencia;
* consultar trazabilidad.

#### Deuda

Resumen financiero del jugador con acceso directo a cargos y pagos.

### Módulo independiente

#### Comprobantes y soportes

Vista propia o detalle enriquecido dentro de `Pagos` para:

* visualizar comprobante administrativo;
* descargar PDF;
* revisar evidencia;
* consultar documento fiscal externo asociado.

#### Recaudo rápido

Vista operativa dentro de `Pagos` para:

* seleccionar jornada o contexto;
* registrar pagos rápidamente;
* generar comprobantes individuales;
* consultar un consolidado de la jornada.

## POS como Evolución Posterior

El flujo tipo `POS` no forma parte del MVP actual.

### Motivo

El POS depende de que antes exista una base financiera consistente:

* catálogo de conceptos;
* cargos claros;
* pagos registrados;
* deuda trazable.

### Decisión

El POS se documenta como una evolución posterior que reutilizará el mismo catálogo de conceptos y el mismo dominio financiero.

### Escenario Futuro

Permitirá cobrar conceptos manuales o inmediatos como:

* uniforme;
* implementos;
* torneos;
* cobros administrativos rápidos;
* otros conceptos de mostrador.

## Reglas de Dominio Relevantes para Frontend

* `PaymentConcept` define qué se puede cobrar, pero no crea deuda.
* Toda deuda visible en frontend nace desde un `Charge`.
* Todo dinero recibido visible en frontend se modela como `Payment`.
* La relación entre pagos y cargos se entiende desde `PaymentAllocation`.
* Todo pago debe tener un comprobante administrativo generado por PlayerTech.
* El comprobante administrativo no reemplaza una factura electrónica.
* Un `ExternalFiscalDocument` es solo un documento emitido por un sistema externo y relacionado al pago.
* `Recaudo rápido` pertenece al módulo financiero actual y no implica caja ni POS.

## Trazabilidad Inicial

### Base existente

* Cargos iniciales mock ya visibles en:
  * `src/app/features/players/pages/player-detail.ts`
  * `src/app/features/players/data-access/player-management.service.ts`

### Avance actual

* Etapa 1:
  * catálogo de conceptos de cobro en mock UI
* Etapa 2:
  * resumen de cargos y deuda en detalle de jugador
  * vista financiera inicial de `Cargos y deuda` en mock UI
* Etapa 3:
  * vista inicial de `Pagos` en mock UI
  * registro de pago con medio y evidencia en mock UI
  * anulación de pago en mock UI
* Etapa 4:
  * visor de comprobante administrativo en mock UI
  * descarga de PDF mock del comprobante administrativo
  * evidencia de pago visible dentro del detalle del pago
  * documento fiscal externo visible y asociable en mock UI
  * lectura consolidada de soportes desde el detalle del pago
* Etapa 5:
  * navegación entre `Conceptos`, `Cargos y deuda` y `Pagos`
  * navegación desde jugador hacia pagos filtrados por contexto
  * vista mock de `Recaudo rápido` con contexto, selección y consolidado

## Trazabilidad Recomendada

### Etapa 4. Comprobantes y soportes

* HU-010 Ver comprobante administrativo de pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-014 Descargar comprobante administrativo en PDF → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-015 Adjuntar evidencia de pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-016 Asociar documento fiscal externo a un pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-017 Consultar soportes y adjuntos de un pago → `Done (Mock UI)` → `src/app/features/payments/pages/payments-history.ts`, `src/app/features/payments/data-access/payments.service.ts`

### Etapa 5. Navegación financiera y recaudo rápido

* HU-013 Navegar desde deuda hacia cargos y pagos relacionados → `Done (Mock UI)`
* HU-018 Ejecutar recaudo rápido desde jornada o contexto operativo → `Done (Mock UI)` → `src/app/features/payments/pages/rapid-collection.ts`, `src/app/features/payments/data-access/charges-debt.service.ts`, `src/app/features/payments/data-access/payments.service.ts`
* HU-019 Consultar reporte consolidado de recaudo rápido → `Done (Mock UI)` → `src/app/features/payments/pages/rapid-collection.ts`

## Estado

Done (Mock UI en Etapas 1, 2, 3 y 4).
