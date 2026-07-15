import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
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
import { PaymentsNav } from '../ui/payments-nav';

@Component({
    selector: 'app-rapid-collection-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, MessageModule, PageHeader, PaymentsNav, SelectModule, TableModule, TagModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="space-y-4">
            <app-page-header
                [breadcrumbs]="breadcrumbs"
                title="Recaudo rápido"
                subtitle="Cobra los cargos del contexto activo y revisa su consolidado en una sola vista."
            ></app-page-header>

            <div class="mt-4">
                <app-payments-nav active="rapid-collection" />
            </div>

            <div class="content-width-full mx-auto w-full overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-800 sm:px-4">
                    <div class="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                        <div class="grid gap-3 md:grid-cols-2 xl:w-[42rem]">
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-surface-700 dark:text-surface-200">Contexto de recaudo</label>
                                <p-select
                                    [options]="collectionContexts"
                                    optionLabel="label"
                                    optionValue="value"
                                    [(ngModel)]="selectedContext"
                                    placeholder="Selecciona un contexto"
                                    class="w-full"
                                    appendTo="body"
                                />
                                <p class="m-0 text-xs leading-5 text-slate-500 dark:text-slate-400">Agrupa los cargos que se cobrarán dentro de la misma jornada o frente operativo.</p>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-medium text-surface-700 dark:text-surface-200">Buscar cargo</label>
                                <p-iconfield iconPosition="left" class="w-full">
                                    <p-inputicon styleClass="pi pi-search" />
                                    <input pInputText type="text" class="w-full" [(ngModel)]="searchTerm" placeholder="Buscar por jugador, acudiente o concepto" />
                                </p-iconfield>
                            </div>
                        </div>

                        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
                            <p-button label="Cobrar selección" icon="pi pi-check" styleClass="w-full sm:w-auto" [disabled]="!selectedChargeIds.length" (onClick)="registerSelectedPayments()" />
                        </div>
                    </div>
                </div>

                <div class="grid gap-2 border-b border-slate-200 bg-slate-50/70 px-3 py-3 dark:border-surface-800 dark:bg-surface-800/50 md:grid-cols-2 xl:grid-cols-4 sm:px-4">
                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-700 dark:bg-surface-900">
                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Disponibles</p>
                        <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ filteredCharges().length }}</p>
                    </div>
                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-700 dark:bg-surface-900">
                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Pendiente</p>
                        <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ pendingContextAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                    </div>
                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-700 dark:bg-surface-900">
                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Registrados hoy</p>
                        <p class="mt-2 text-2xl font-semibold text-emerald-600">{{ quickCollectionSummary.registeredCount }}</p>
                    </div>
                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-700 dark:bg-surface-900">
                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Recaudado hoy</p>
                        <p class="mt-2 text-2xl font-semibold text-emerald-600">{{ quickCollectionSummary.totalCollected | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                    </div>
                </div>

                @if (selectedChargeIds.length) {
                    <div class="border-b border-slate-200 bg-emerald-50/70 px-3 py-3 dark:border-surface-800 dark:bg-emerald-400/10 sm:px-4">
                        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div class="space-y-1">
                                <p class="m-0 text-sm font-semibold text-emerald-800 dark:text-emerald-300">Selección lista para cobro</p>
                                <p class="m-0 text-sm text-emerald-700/90 dark:text-emerald-200/90">
                                    {{ selectedChargeIds.length }} cargo(s) por {{ selectedPendingAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
                                </p>
                            </div>

                            <div class="flex flex-col gap-2 sm:flex-row">
                                <p-button label="Limpiar selección" severity="secondary" styleClass="w-full sm:w-auto" (onClick)="clearSelection()" />
                                <p-button label="Cobrar ahora" icon="pi pi-check" styleClass="w-full sm:w-auto" (onClick)="registerSelectedPayments()" />
                            </div>
                        </div>
                    </div>
                }

                <div class="space-y-3 p-3 sm:hidden">
                    @for (charge of filteredCharges(); track charge.id) {
                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ charge.playerName }}</p>
                                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ charge.guardianName }}</p>
                                </div>
                                <p-tag [value]="charge.status === 'OVERDUE' ? 'Vencido' : 'Pendiente'" [severity]="charge.status === 'OVERDUE' ? 'danger' : 'warn'" />
                            </div>

                            <div class="mt-3 space-y-2 text-sm">
                            <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Concepto:</span> {{ charge.conceptName }}</p>
                            <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Pendiente:</span> {{ charge.pendingAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                            <p class="m-0"><span class="font-medium text-surface-900 dark:text-surface-0">Vence:</span> {{ formatDate(charge.dueDate) }}</p>
                        </div>

                            <div class="mt-3 flex flex-col gap-2">
                            <p-button label="Cobrar ahora" styleClass="w-full" (onClick)="registerSinglePayment(charge)" />
                            </div>
                        </div>
                    } @empty {
                        <div class="rounded-[0.85rem] border border-dashed border-slate-300 px-4 py-10 text-center dark:border-surface-700">
                            <p class="m-0 text-base font-medium text-surface-900 dark:text-surface-0">No hay cargos disponibles en este contexto</p>
                            <p class="mt-2 mb-0 text-sm text-slate-500 dark:text-slate-400">Prueba con otro contexto o espera a que existan cargos pendientes.</p>
                        </div>
                    }
                </div>

                <p-table [value]="filteredCharges()" responsiveLayout="scroll" dataKey="id" [(selection)]="selectedCharges" styleClass="hidden sm:block text-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 3rem">
                                <p-tableHeaderCheckbox />
                            </th>
                            <th style="min-width: 15rem">Jugador</th>
                            <th style="min-width: 12rem">Acudiente</th>
                            <th style="min-width: 12rem">Concepto</th>
                            <th style="min-width: 10rem">Vence</th>
                            <th style="min-width: 10rem">Pendiente</th>
                            <th style="min-width: 8rem">Estado</th>
                            <th style="min-width: 10rem" class="text-right">Acción</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-charge>
                        <tr>
                            <td>
                                <p-tableCheckbox [value]="charge" />
                            </td>
                            <td>
                                <div class="space-y-1">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ charge.playerName }}</p>
                                    <p class="m-0 text-xs text-slate-500 dark:text-slate-400">{{ charge.categoryName }}</p>
                                </div>
                            </td>
                            <td>{{ charge.guardianName }}</td>
                            <td>{{ charge.conceptName }}</td>
                            <td>{{ formatDate(charge.dueDate) }}</td>
                            <td>{{ charge.pendingAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                            <td><p-tag [value]="charge.status === 'OVERDUE' ? 'Vencido' : 'Pendiente'" [severity]="charge.status === 'OVERDUE' ? 'danger' : 'warn'" /></td>
                            <td>
                                <div class="flex justify-end">
                                    <p-button label="Cobrar" size="small" (onClick)="registerSinglePayment(charge)" />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="8" class="py-10 text-center">
                                <p class="m-0 text-base font-medium text-surface-900 dark:text-surface-0">No hay cargos disponibles en este contexto</p>
                                <p class="mt-2 mb-0 text-sm text-slate-500 dark:text-slate-400">Prueba con otro contexto o espera a que existan cargos pendientes.</p>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>

                <div class="border-t border-slate-200 px-3 py-3 dark:border-surface-800 sm:px-4">
                    <div class="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                        <div class="rounded-[0.85rem] border border-slate-200 bg-slate-50/70 p-4 dark:border-surface-700 dark:bg-surface-800/50">
                            <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Consolidado del contexto</p>
                            <div class="mt-3 grid gap-2 sm:grid-cols-3">
                                <div>
                                    <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Contexto</p>
                                    <p class="mt-1 mb-0 text-sm text-surface-900 dark:text-surface-0">{{ selectedContext || 'Sin seleccionar' }}</p>
                                </div>
                                <div>
                                    <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Pagos</p>
                                    <p class="mt-1 mb-0 text-sm text-surface-900 dark:text-surface-0">{{ quickCollectionSummary.registeredCount }}</p>
                                </div>
                                <div>
                                    <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Monto</p>
                                    <p class="mt-1 mb-0 text-sm text-surface-900 dark:text-surface-0">{{ quickCollectionSummary.totalCollected | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                            <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Últimos pagos registrados</p>
                            <div class="mt-3 space-y-2">
                                @for (payment of contextPayments().slice(0, 3); track payment.id) {
                                    <div class="rounded-[0.75rem] border border-slate-200 px-3 py-2 text-sm dark:border-surface-700">
                                        <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ payment.playerName }}</p>
                                        <p class="mt-1 mb-0 text-slate-500 dark:text-slate-400">{{ payment.amount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }} · {{ payment.conceptName }}</p>
                                    </div>
                                } @empty {
                                    <p class="m-0 text-sm text-slate-500 dark:text-slate-400">Todavía no hay pagos registrados en este contexto.</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class RapidCollectionPage {
    private readonly chargesDebtService = inject(ChargesDebtService);
    private readonly paymentsService = inject(PaymentsService);
    private readonly messageService = inject(MessageService);

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Finanzas' }, { label: 'Recaudo rápido' }];
    readonly collectionContexts = this.chargesDebtService.getCollectionContexts();
    readonly payments = computed(() => this.paymentsService.list());

    searchTerm = '';
    selectedContext = this.collectionContexts[0]?.value ?? '';
    selectedCharges: FinancialCharge[] = [];

    readonly filteredCharges = computed(() => {
        const term = this.searchTerm.trim().toLowerCase();
        return this.chargesDebtService
            .charges()
            .filter((charge) => charge.status !== 'PAID')
            .filter((charge) => !this.selectedContext || charge.collectionContext === this.selectedContext)
            .filter((charge) => !term || [charge.playerName, charge.guardianName, charge.conceptName].join(' ').toLowerCase().includes(term));
    });

    readonly contextPayments = computed(() => this.payments().filter((payment) => payment.collectionContext === this.selectedContext));

    get selectedChargeIds() {
        return this.selectedCharges.map((charge) => charge.id);
    }

    get pendingContextAmount() {
        return this.filteredCharges().reduce((total, charge) => total + charge.pendingAmount, 0);
    }

    get selectedPendingAmount() {
        return this.selectedCharges.reduce((total, charge) => total + charge.pendingAmount, 0);
    }

    get quickCollectionSummary() {
        const payments = this.contextPayments();
        return {
            registeredCount: payments.length,
            totalCollected: payments.reduce((total, payment) => total + payment.amount, 0)
        };
    }

    registerSinglePayment(charge: FinancialCharge) {
        this.paymentsService.registerPayment(
            charge,
            {
                chargeId: charge.id,
                amount: charge.pendingAmount,
                method: 'CASH',
                note: `Recaudo rápido · ${charge.collectionContext}`
            },
            null
        );
        this.chargesDebtService.markChargeAsPaid(charge.id);
        this.selectedCharges = this.selectedCharges.filter((item) => item.id !== charge.id);
        this.messageService.add({
            severity: 'success',
            summary: 'Pago registrado',
            detail: `${charge.playerName} quedó registrado dentro del recaudo rápido.`
        });
    }

    registerSelectedPayments() {
        const charges = [...this.selectedCharges];
        charges.forEach((charge) => this.registerSinglePayment(charge));
        this.selectedCharges = [];
        this.messageService.add({
            severity: 'success',
            summary: 'Recaudo completado',
            detail: `Se registraron ${charges.length} pago(s) en el contexto seleccionado.`
        });
    }

    clearSelection() {
        this.selectedCharges = [];
    }

    formatDate(value: string) {
        return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
    }
}
