import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { ChargesDebtService } from '../data-access/charges-debt.service';
import { PaymentsService } from '../data-access/payments.service';
import { FinancialCharge } from '../models/charge-debt.model';
import { PaymentEvidence, PaymentMethod, PaymentRecord, PaymentRecordForm, PaymentStatus } from '../models/payment-record.model';
import { PaymentsNav } from '../ui/payments-nav';

@Component({
    selector: 'app-payments-history-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, ConfirmDialogModule, DialogModule, FormsModule, IconFieldModule, InputIconModule, InputNumberModule, InputTextModule, MessageModule, PageHeader, PaymentsNav, RouterModule, SelectModule, TableModule, TagModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    styles: [
        `
            :host ::ng-deep .payments-dialog .p-dialog-footer {
                border-top: 0;
                padding-top: 0;
            }

            :host ::ng-deep .payment-receipt-dialog .p-dialog-content {
                padding-top: 0.5rem;
            }
        `
    ],
    template: `
        <p-toast />
        <p-confirmdialog />
        <input #receiptEvidenceInput type="file" accept=".png,.jpg,.jpeg,.pdf" class="hidden" (change)="onReceiptEvidenceSelected($event)" />
        <input #fiscalDocumentInput type="file" accept=".pdf,.png,.jpg,.jpeg" class="hidden" (change)="onFiscalDocumentSelected($event)" />

        <div class="space-y-4">
            <app-page-header
                [breadcrumbs]="breadcrumbs"
                title="Pagos"
                subtitle="Registra recaudos, revisa el historial y mantén la trazabilidad de cada pago."
            ></app-page-header>

            <div class="mt-4">
                <app-payments-nav active="payments" />
            </div>

                <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Registros</p>
                        <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ filteredPayments().length }}</p>
                    </div>
                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Recaudado</p>
                        <p class="mt-2 text-2xl font-semibold text-emerald-600">{{ paidAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                    </div>
                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Con soporte</p>
                        <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ paymentsWithEvidence }}</p>
                    </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Anulados</p>
                    <p class="mt-2 text-2xl font-semibold text-rose-600">{{ cancelledPayments }}</p>
                </div>
            </div>

            <div class="content-width-full mx-auto w-full overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-800 sm:px-4">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div class="flex flex-col gap-2 xl:flex-row xl:flex-wrap xl:items-center">
                            <p-iconfield iconPosition="left" class="w-full xl:w-[22rem]">
                                <p-inputicon styleClass="pi pi-search" />
                                <input pInputText type="text" class="w-full" [(ngModel)]="searchTerm" placeholder="Buscar por jugador, acudiente o concepto" />
                            </p-iconfield>

                            <p-select
                                class="w-full xl:w-[12rem]"
                                [options]="statusOptions"
                                optionLabel="label"
                                optionValue="value"
                                [(ngModel)]="selectedStatus"
                                placeholder="Todos los estados"
                                [showClear]="true"
                                appendTo="body"
                            />
                        </div>

                        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
                            <p-button label="Registrar pago" icon="pi pi-plus" styleClass="w-full sm:w-auto" (onClick)="openRegisterPaymentDialog()" />
                        </div>
                    </div>
                </div>

                <div class="space-y-3 p-3 sm:hidden">
                    @for (payment of filteredPayments(); track payment.id) {
                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ payment.playerName }}</p>
                                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ payment.conceptName }} · {{ payment.guardianName }}</p>
                                </div>
                                <p-tag [value]="paymentStatusLabel(payment.status)" [severity]="paymentStatusSeverity(payment.status)" />
                            </div>

                            <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
                                <div>
                                <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Monto</p>
                                <p class="mt-1 m-0 font-medium text-surface-900 dark:text-surface-0">{{ payment.amount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Medio</p>
                                <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ paymentMethodLabel(payment.method) }}</p>
                            </div>
                        </div>

                        <div class="mt-3 flex flex-col gap-2">
                                @if (payment.evidence) {
                                <div class="rounded-[0.7rem] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-surface-700 dark:bg-surface-800 dark:text-slate-300">
                                    Evidencia: {{ payment.evidence.name }}
                                </div>
                            }
                            <p-button label="Comprobante" severity="secondary" [outlined]="true" styleClass="w-full" (onClick)="openReceipt(payment)" />
                            @if (payment.status === 'PAID') {
                                <p-button label="Anular pago" severity="danger" [outlined]="true" styleClass="w-full" (onClick)="confirmCancelPayment(payment.id)" />
                            }
                        </div>
                    </div>
                    } @empty {
                        <div class="px-4 py-10 text-center">
                            <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span class="text-base font-medium text-surface-900 dark:text-surface-0">No hay pagos para mostrar</span>
                                <span>Cuando registres recaudos aparecerán aquí con su trazabilidad.</span>
                            </div>
                        </div>
                    }
                </div>

                <p-table [value]="filteredPayments()" responsiveLayout="scroll" styleClass="hidden sm:block text-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="min-width: 15rem">Jugador</th>
                            <th style="min-width: 12rem">Concepto</th>
                            <th style="min-width: 10rem">Fecha</th>
                            <th style="min-width: 9rem">Monto</th>
                            <th style="min-width: 10rem">Medio</th>
                            <th style="min-width: 10rem">Evidencia</th>
                            <th style="min-width: 8rem">Estado</th>
                            <th style="min-width: 10rem" class="text-right">Acciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-payment>
                        <tr>
                            <td>
                                <div class="space-y-1">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ payment.playerName }}</p>
                                    <p class="m-0 text-xs text-slate-500 dark:text-slate-400">{{ payment.guardianName }}</p>
                                </div>
                            </td>
                            <td>{{ payment.conceptName }}</td>
                            <td>{{ formatDateTime(payment.paymentDate) }}</td>
                            <td>{{ payment.amount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                            <td>{{ paymentMethodLabel(payment.method) }}</td>
                            <td>
                                @if (payment.evidence) {
                                    <span class="text-sm text-slate-600 dark:text-slate-300">{{ payment.evidence.name }}</span>
                                } @else {
                                    <span class="text-sm text-slate-400 dark:text-slate-500">Sin archivo</span>
                                }
                            </td>
                            <td><p-tag [value]="paymentStatusLabel(payment.status)" [severity]="paymentStatusSeverity(payment.status)" /></td>
                            <td>
                                <div class="flex justify-end gap-2">
                                    <p-button label="Comprobante" severity="secondary" [outlined]="true" size="small" (onClick)="openReceipt(payment)" />
                                    @if (payment.status === 'PAID') {
                                        <p-button label="Anular" severity="danger" [outlined]="true" size="small" (onClick)="confirmCancelPayment(payment.id)" />
                                    }
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="8" class="py-10 text-center">
                                <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">No hay pagos para mostrar</span>
                                    <span>Cuando registres recaudos aparecerán aquí con su trazabilidad.</span>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>

        <p-dialog
            [(visible)]="showRegisterPaymentDialog"
            [modal]="true"
            [draggable]="false"
            [resizable]="false"
            [dismissableMask]="true"
            [style]="{ width: 'min(44rem, calc(100vw - 2rem))' }"
            styleClass="payments-dialog"
            header="Registrar pago"
            (onHide)="resetDialog()"
        >
            <div class="space-y-4">
                <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Confirma el cargo, registra el medio y adjunta un soporte si ya lo tienes disponible.</p>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="paymentChargeId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Cargo <span class="text-rose-500">*</span></label>
                        <p-select
                            id="paymentChargeId"
                            [(ngModel)]="form.chargeId"
                            [options]="availableChargeOptions"
                            optionLabel="label"
                            optionValue="id"
                            placeholder="Selecciona un cargo"
                            class="w-full"
                            appendTo="body"
                            [filter]="true"
                            filterBy="label,playerName,guardianName"
                        />
                        @if (showError('chargeId')) {
                            <p-message severity="error" size="small">Selecciona el cargo que vas a registrar.</p-message>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="paymentMethod" class="text-sm font-medium text-surface-700 dark:text-surface-200">Medio de pago <span class="text-rose-500">*</span></label>
                        <p-select
                            id="paymentMethod"
                            [(ngModel)]="form.method"
                            [options]="methodOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Selecciona un medio"
                            class="w-full"
                            appendTo="body"
                        />
                        @if (showError('method')) {
                            <p-message severity="error" size="small">Selecciona el medio de pago.</p-message>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="paymentAmount" class="text-sm font-medium text-surface-700 dark:text-surface-200">Monto <span class="text-rose-500">*</span></label>
                        <p-inputnumber id="paymentAmount" [(ngModel)]="form.amount" mode="currency" currency="COP" locale="es-CO" inputStyleClass="w-full" styleClass="w-full" [min]="0" />
                        @if (showError('amount')) {
                            <p-message severity="error" size="small">Ingresa un monto válido.</p-message>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label class="text-sm font-medium text-surface-700 dark:text-surface-200">Evidencia</label>
                        <input #evidenceInput type="file" accept=".png,.jpg,.jpeg,.pdf" class="hidden" (change)="onEvidenceSelected($event)" />
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <p-button label="Seleccionar archivo" severity="secondary" [outlined]="true" styleClass="w-full sm:w-auto" (onClick)="evidenceInput.click()" />
                            <span class="text-sm text-slate-500 dark:text-slate-400 break-all">{{ evidenceLabel }}</span>
                        </div>
                    </div>

                    <div class="col-span-12 flex flex-col gap-2">
                        <label for="paymentNote" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nota</label>
                        <input pInputText id="paymentNote" [(ngModel)]="form.note" placeholder="Ej. Pago confirmado por transferencia inmediata." class="w-full" />
                    </div>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="showRegisterPaymentDialog = false" />
                    <p-button label="Registrar pago" icon="pi pi-check" styleClass="w-full sm:w-auto" (onClick)="savePayment()" />
                </div>
            </ng-template>
        </p-dialog>

        <p-dialog
            [(visible)]="showReceiptDialog"
            [modal]="true"
            [draggable]="false"
            [resizable]="false"
            [dismissableMask]="true"
            [style]="{ width: 'min(52rem, calc(100vw - 2rem))' }"
            styleClass="payment-receipt-dialog"
            header="Comprobante administrativo"
        >
            @if (selectedPayment) {
                <div class="space-y-4">
                    <div class="rounded-[0.85rem] border border-slate-200 bg-slate-50 p-4 dark:border-surface-700 dark:bg-surface-800">
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p class="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">PlayerTech</p>
                                <p class="mt-2 mb-0 text-lg font-semibold text-surface-900 dark:text-surface-0">{{ selectedPayment.receipt.academyName }}</p>
                                <p class="mt-1 mb-0 text-sm text-slate-500 dark:text-slate-400">{{ selectedPayment.receipt.academyCity }} · {{ selectedPayment.receipt.academyEmail }}</p>
                            </div>

                            <div class="rounded-[0.8rem] border border-slate-200 bg-white px-3 py-2 text-sm dark:border-surface-700 dark:bg-surface-900">
                                <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Consecutivo</p>
                                <p class="mt-1 mb-0 font-semibold text-surface-900 dark:text-surface-0">{{ selectedPayment.receipt.receiptNumber }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="grid gap-3 md:grid-cols-2">
                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                            <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Datos del pago</p>
                            <div class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Jugador:</span> {{ selectedPayment.receipt.playerName }}</p>
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Acudiente:</span> {{ selectedPayment.receipt.guardianName }}</p>
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Fecha:</span> {{ formatDateTime(selectedPayment.receipt.issuedAt) }}</p>
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Medio:</span> {{ selectedPayment.receipt.paymentMethodLabel }}</p>
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Referencia:</span> {{ selectedPayment.receipt.reference }}</p>
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Registrado por:</span> {{ selectedPayment.receipt.registeredBy }}</p>
                            </div>
                        </div>

                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                            <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Resumen financiero</p>
                            <div class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Valor recibido:</span> {{ selectedPayment.receipt.amountReceived | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Saldo pendiente:</span> {{ selectedPayment.receipt.pendingBalance | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                                <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Verificación:</span> {{ selectedPayment.receipt.verificationCode }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-[0.85rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Detalle de conceptos</p>
                        <div class="mt-3 overflow-hidden rounded-[0.75rem] border border-slate-200 dark:border-surface-700">
                            @for (item of selectedPayment.receipt.items; track item.conceptName + item.amount) {
                                <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-3 text-sm last:border-b-0 dark:border-surface-700">
                                    <span class="text-surface-900 dark:text-surface-0">{{ item.conceptName }}</span>
                                    <span class="font-medium text-surface-900 dark:text-surface-0">{{ item.amount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</span>
                                </div>
                            }
                        </div>
                    </div>

                    <div class="grid gap-3 md:grid-cols-2">
                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                            <div class="flex items-start justify-between gap-3">
                                <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Evidencia</p>
                                <p-button label="Adjuntar" size="small" severity="secondary" [outlined]="true" (onClick)="receiptEvidenceInput.click()" />
                            </div>
                            @if (selectedPayment.evidence) {
                                <div class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Archivo:</span> {{ selectedPayment.evidence.name }}</p>
                                    <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Peso:</span> {{ selectedPayment.evidence.sizeKb }} KB</p>
                                    <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Tipo:</span> {{ selectedPayment.evidence.mimeType }}</p>
                                </div>
                            } @else {
                                <p class="mt-3 mb-0 text-sm text-slate-500 dark:text-slate-400">Este pago no tiene evidencia adjunta todavía.</p>
                            }
                        </div>

                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                            <div class="flex items-start justify-between gap-3">
                                <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Documento fiscal externo</p>
                                <p-button label="Adjuntar" size="small" severity="secondary" [outlined]="true" (onClick)="fiscalDocumentInput.click()" />
                            </div>
                            @if (selectedPayment.externalFiscalDocument) {
                                <div class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Archivo:</span> {{ selectedPayment.externalFiscalDocument.name }}</p>
                                    <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Emisor:</span> {{ selectedPayment.externalFiscalDocument.issuer }}</p>
                                    <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Referencia:</span> {{ selectedPayment.externalFiscalDocument.reference }}</p>
                                    <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Fecha:</span> {{ formatDateTime(selectedPayment.externalFiscalDocument.issuedAt) }}</p>
                                </div>
                            } @else {
                                <p class="mt-3 mb-0 text-sm text-slate-500 dark:text-slate-400">No hay documento fiscal externo relacionado a este pago.</p>
                            }
                        </div>
                    </div>

                    <div class="rounded-[0.85rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Soportes del pago</p>
                        <div class="mt-3 grid gap-2">
                            <div class="flex items-center justify-between gap-3 rounded-[0.75rem] border border-slate-200 px-3 py-2 text-sm dark:border-surface-700">
                                <div>
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">Comprobante administrativo</p>
                                    <p class="mt-1 mb-0 text-slate-500 dark:text-slate-400">{{ selectedPayment.receipt.receiptNumber }}</p>
                                </div>
                                <p-tag value="Disponible" severity="success" />
                            </div>
                            <div class="flex items-center justify-between gap-3 rounded-[0.75rem] border border-slate-200 px-3 py-2 text-sm dark:border-surface-700">
                                <div>
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">Evidencia</p>
                                    <p class="mt-1 mb-0 text-slate-500 dark:text-slate-400">{{ selectedPayment.evidence?.name || 'Sin archivo adjunto' }}</p>
                                </div>
                                <p-tag [value]="selectedPayment.evidence ? 'Adjunta' : 'Pendiente'" [severity]="selectedPayment.evidence ? 'info' : 'warn'" />
                            </div>
                            <div class="flex items-center justify-between gap-3 rounded-[0.75rem] border border-slate-200 px-3 py-2 text-sm dark:border-surface-700">
                                <div>
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">Documento fiscal externo</p>
                                    <p class="mt-1 mb-0 text-slate-500 dark:text-slate-400">{{ selectedPayment.externalFiscalDocument?.reference || 'No asociado' }}</p>
                                </div>
                                <p-tag [value]="selectedPayment.externalFiscalDocument ? 'Asociado' : 'Opcional'" [severity]="selectedPayment.externalFiscalDocument ? 'success' : 'contrast'" />
                            </div>
                        </div>
                    </div>

                    <div class="rounded-[0.85rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
                        Este documento es un comprobante administrativo y no constituye factura electrónica.
                    </div>
                </div>
            }

            <ng-template pTemplate="footer">
                <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <p-button label="Cerrar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="showReceiptDialog = false" />
                    <p-button label="Descargar PDF" icon="pi pi-download" styleClass="w-full sm:w-auto" (onClick)="downloadReceiptPdf()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class PaymentsHistoryPage {
    private readonly route = inject(ActivatedRoute);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);
    private readonly chargesDebtService = inject(ChargesDebtService);
    private readonly paymentsService = inject(PaymentsService);

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Finanzas' }, { label: 'Pagos' }];
    readonly statusOptions = [
        { label: 'Pagado', value: 'PAID' as PaymentStatus },
        { label: 'Anulado', value: 'CANCELLED' as PaymentStatus }
    ];
    readonly methodOptions = [
        { label: 'Efectivo', value: 'CASH' as PaymentMethod },
        { label: 'Transferencia', value: 'TRANSFER' as PaymentMethod },
        { label: 'Tarjeta', value: 'CARD' as PaymentMethod },
        { label: 'Link de pago', value: 'LINK' as PaymentMethod }
    ];

    readonly charges = computed(() => this.chargesDebtService.charges().filter((item) => item.status !== 'PAID'));
    readonly payments = computed(() => this.paymentsService.list());
    readonly filteredPayments = computed(() => {
        const term = this.searchTerm.trim().toLowerCase();
        const selectedStatus = this.selectedStatus;

        return this.payments().filter((payment) => {
            const matchesPlayer = !this.playerFilter || payment.playerId === this.playerFilter;
            const matchesTerm =
                !term ||
                [payment.playerName, payment.guardianName, payment.conceptName, payment.note]
                    .join(' ')
                    .toLowerCase()
                    .includes(term);
            const matchesStatus = !selectedStatus || payment.status === selectedStatus;
            return matchesPlayer && matchesTerm && matchesStatus;
        });
    });

    searchTerm = '';
    selectedStatus: PaymentStatus | null = null;
    showRegisterPaymentDialog = false;
    showReceiptDialog = false;
    submitted = false;
    playerFilter = '';
    preferredChargeId = '';
    selectedEvidence: PaymentEvidence | null = null;
    selectedPayment: PaymentRecord | null = null;
    form: PaymentRecordForm = this.emptyForm();

    constructor() {
        this.route.queryParamMap.subscribe((params) => {
            this.playerFilter = params.get('playerId') ?? '';
            this.preferredChargeId = params.get('chargeId') ?? '';
            if (this.preferredChargeId && !this.showRegisterPaymentDialog) {
                this.form.chargeId = this.preferredChargeId;
                const charge = this.findCharge(this.preferredChargeId);
                this.form.amount = charge?.pendingAmount ?? null;
            }
        });
    }

    get paidAmount() {
        return this.filteredPayments()
            .filter((item) => item.status === 'PAID')
            .reduce((total, payment) => total + payment.amount, 0);
    }

    get paymentsWithEvidence() {
        return this.filteredPayments().filter((item) => !!item.evidence).length;
    }

    get cancelledPayments() {
        return this.filteredPayments().filter((item) => item.status === 'CANCELLED').length;
    }

    get availableChargeOptions() {
        return this.charges()
            .filter((charge) => !this.playerFilter || charge.playerId === this.playerFilter)
            .map((charge) => ({
                ...charge,
                id: charge.id,
                label: `${charge.playerName} · ${charge.conceptName}`,
                playerName: charge.playerName,
                guardianName: charge.guardianName
            }));
    }

    get evidenceLabel() {
        return this.selectedEvidence ? this.selectedEvidence.name : 'Sin archivo seleccionado';
    }

    openRegisterPaymentDialog() {
        this.submitted = false;
        this.form = this.emptyForm();
        this.selectedEvidence = null;
        if (this.preferredChargeId) {
            this.form.chargeId = this.preferredChargeId;
            const charge = this.findCharge(this.preferredChargeId);
            this.form.amount = charge?.pendingAmount ?? null;
        }
        this.showRegisterPaymentDialog = true;
    }

    onEvidenceSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) {
            return;
        }

        this.selectedEvidence = {
            name: file.name,
            sizeKb: Math.max(1, Math.round(file.size / 1024)),
            mimeType: file.type || 'application/octet-stream'
        };
        input.value = '';
    }

    savePayment() {
        this.submitted = true;
        if (!this.isValid()) {
            return;
        }

        const charge = this.findCharge(this.form.chargeId);
        if (!charge) {
            return;
        }

        const payment = this.paymentsService.registerPayment(charge, this.form, this.selectedEvidence);
        this.showRegisterPaymentDialog = false;
        this.resetDialog();
        this.messageService.add({
            severity: 'success',
            summary: 'Pago registrado',
            detail: payment.evidence ? 'El pago quedó registrado con su soporte adjunto.' : 'El pago quedó registrado correctamente.'
        });
    }

    confirmCancelPayment(paymentId: string) {
        this.confirmationService.confirm({
            header: 'Anular pago',
            message: 'Este pago dejará de contar como recaudo activo. ¿Deseas continuar?',
            acceptLabel: 'Anular',
            rejectLabel: 'Cancelar',
            accept: () => {
                const payment = this.paymentsService.cancelPayment(paymentId);
                if (!payment) {
                    return;
                }

                this.messageService.add({
                    severity: 'info',
                    summary: 'Pago anulado',
                    detail: 'El pago fue marcado como anulado.'
                });
            }
        });
    }

    openReceipt(payment: PaymentRecord) {
        this.selectedPayment = payment;
        this.showReceiptDialog = true;
    }

    onReceiptEvidenceSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file || !this.selectedPayment) {
            return;
        }

        const updated = this.paymentsService.attachEvidence(this.selectedPayment.id, {
            name: file.name,
            sizeKb: Math.max(1, Math.round(file.size / 1024)),
            mimeType: file.type || 'application/octet-stream'
        });

        if (updated) {
            this.selectedPayment = updated;
            this.messageService.add({
                severity: 'success',
                summary: 'Evidencia actualizada',
                detail: 'La evidencia quedó asociada al pago en esta iteración mock.'
            });
        }

        input.value = '';
    }

    onFiscalDocumentSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file || !this.selectedPayment) {
            return;
        }

        const updated = this.paymentsService.attachExternalFiscalDocument(this.selectedPayment.id, {
            name: file.name,
            issuer: 'Sistema fiscal externo',
            documentType: 'INVOICE',
            reference: `EXT-${Date.now().toString().slice(-6)}`,
            issuedAt: new Date().toISOString()
        });

        if (updated) {
            this.selectedPayment = updated;
            this.messageService.add({
                severity: 'success',
                summary: 'Documento asociado',
                detail: 'El documento fiscal externo quedó relacionado al pago en esta iteración mock.'
            });
        }

        input.value = '';
    }

    downloadReceiptPdf() {
        if (!this.selectedPayment) {
            return;
        }

        this.paymentsService.downloadReceiptPdf(this.selectedPayment);
        this.messageService.add({
            severity: 'success',
            summary: 'Comprobante descargado',
            detail: 'Se descargó el PDF mock del comprobante administrativo.'
        });
    }

    paymentStatusLabel(status: PaymentStatus) {
        return status === 'PAID' ? 'Pagado' : 'Anulado';
    }

    paymentStatusSeverity(status: PaymentStatus): 'success' | 'danger' {
        return status === 'PAID' ? 'success' : 'danger';
    }

    paymentMethodLabel(method: PaymentMethod) {
        return this.paymentsService.paymentMethodLabel(method);
    }

    formatDateTime(value: string) {
        return new Intl.DateTimeFormat('es-CO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(value));
    }

    resetDialog() {
        this.submitted = false;
        this.form = this.emptyForm();
        this.selectedEvidence = null;
    }

    showError(field: keyof PaymentRecordForm) {
        return this.submitted && !this.isFieldValid(field);
    }

    private findCharge(chargeId: string): FinancialCharge | undefined {
        return this.charges().find((item) => item.id === chargeId);
    }

    private emptyForm(): PaymentRecordForm {
        return {
            chargeId: '',
            amount: null,
            method: null,
            note: ''
        };
    }

    private isFieldValid(field: keyof PaymentRecordForm) {
        const value = this.form[field];
        if (field === 'chargeId') {
            return typeof value === 'string' && value.trim().length > 0;
        }

        if (field === 'amount') {
            return typeof value === 'number' && value > 0;
        }

        if (field === 'method') {
            return value !== null;
        }

        return true;
    }

    private isValid() {
        return this.isFieldValid('chargeId') && this.isFieldValid('amount') && this.isFieldValid('method');
    }
}
