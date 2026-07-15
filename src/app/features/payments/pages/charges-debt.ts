import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { ChargesDebtService } from '../data-access/charges-debt.service';
import { FinancialCharge, FinancialChargeStatus } from '../models/charge-debt.model';
import { PaymentsNav } from '../ui/payments-nav';

@Component({
    selector: 'app-charges-debt-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, PageHeader, PaymentsNav, RouterModule, SelectModule, TableModule, TagModule],
    template: `
        <div class="space-y-4">
            <app-page-header
                [breadcrumbs]="breadcrumbs"
                title="Cargos y deuda"
                subtitle="Consulta saldos pendientes, vencimientos y cargos abiertos de los jugadores."
            ></app-page-header>

            <div class="mt-4">
                <app-payments-nav active="charges" />
            </div>

            <div class="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Saldo pendiente</p>
                    <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ summary.totalPendingAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Jugadores con deuda</p>
                    <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ summary.playersWithDebt }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Cargos pendientes</p>
                    <p class="mt-2 text-2xl font-semibold text-amber-600">{{ summary.pendingCharges }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Vencidos</p>
                    <p class="mt-2 text-2xl font-semibold text-rose-600">{{ summary.overdueCharges }}</p>
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
                            <p-button label="Ver pagos" icon="pi pi-arrow-right" severity="secondary" [outlined]="true" styleClass="w-full sm:w-auto" routerLink="/payments/history" />
                        </div>
                    </div>
                </div>

                <div class="space-y-3 p-3 sm:hidden">
                    @for (charge of filteredCharges(); track charge.id) {
                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ charge.playerName }}</p>
                                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ charge.categoryName }} · {{ charge.guardianName }}</p>
                                </div>
                                <p-tag [value]="statusLabel(charge.status)" [severity]="statusSeverity(charge.status)" />
                            </div>

                            <div class="mt-3 space-y-2 text-sm">
                                <div>
                                        <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Concepto</p>
                                    <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ charge.conceptName }}</p>
                                </div>
                                <div>
                                        <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Origen</p>
                                    <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ charge.sourceLabel }}</p>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Pendiente</p>
                                        <p class="mt-1 m-0 font-medium text-surface-900 dark:text-surface-0">{{ charge.pendingAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                                    </div>
                                    <div>
                                        <p class="m-0 text-xs font-medium text-slate-400 dark:text-slate-500">Vence</p>
                                        <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ formatDate(charge.dueDate) }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-3 flex flex-col gap-2">
                                <p-button label="Cobrar" styleClass="w-full" [routerLink]="['/payments/history']" [queryParams]="{ playerId: charge.playerId, chargeId: charge.id }" />
                            </div>
                        </div>
                    } @empty {
                        <div class="px-4 py-10 text-center">
                            <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span class="text-base font-medium text-surface-900 dark:text-surface-0">No hay cargos para mostrar</span>
                                <span>Cuando existan cargos operativos o de matrícula aparecerán aquí.</span>
                            </div>
                        </div>
                    }
                </div>

                <p-table [value]="filteredCharges()" responsiveLayout="scroll" styleClass="hidden sm:block text-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="min-width: 15rem">Jugador</th>
                            <th style="min-width: 12rem">Concepto</th>
                            <th style="min-width: 12rem">Origen</th>
                            <th style="min-width: 16rem">Detalle</th>
                            <th style="min-width: 9rem">Vence</th>
                            <th style="min-width: 9rem">Monto</th>
                            <th style="min-width: 9rem">Pendiente</th>
                            <th style="min-width: 8rem">Estado</th>
                            <th style="min-width: 10rem" class="text-right">Acciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-charge>
                        <tr>
                            <td>
                                <div class="space-y-1">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ charge.playerName }}</p>
                                    <p class="m-0 text-xs text-slate-500 dark:text-slate-400">{{ charge.categoryName }} · {{ charge.guardianName }}</p>
                                </div>
                            </td>
                            <td>
                                <div class="space-y-1">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ charge.conceptName }}</p>
                                    <p class="m-0 text-xs text-slate-500 dark:text-slate-400">{{ charge.conceptCode }}</p>
                                </div>
                            </td>
                            <td>{{ charge.sourceLabel }}</td>
                            <td>{{ charge.description }}</td>
                            <td>{{ formatDate(charge.dueDate) }}</td>
                            <td>{{ charge.amount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                            <td>{{ charge.pendingAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                            <td><p-tag [value]="statusLabel(charge.status)" [severity]="statusSeverity(charge.status)" /></td>
                            <td>
                                <div class="flex justify-end">
                                    <p-button label="Cobrar" size="small" [routerLink]="['/payments/history']" [queryParams]="{ playerId: charge.playerId, chargeId: charge.id }" />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="9" class="py-10 text-center">
                                <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">No hay cargos para mostrar</span>
                                    <span>Cuando existan cargos operativos o de matrícula aparecerán aquí.</span>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `
})
export class ChargesDebtPage {
    private readonly chargesDebtService = inject(ChargesDebtService);

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Finanzas' }, { label: 'Cargos y deuda' }];
    readonly statusOptions = [
        { label: 'Pendiente', value: 'PENDING' as FinancialChargeStatus },
        { label: 'Vencido', value: 'OVERDUE' as FinancialChargeStatus },
        { label: 'Pagado', value: 'PAID' as FinancialChargeStatus }
    ];

    readonly charges = this.chargesDebtService.charges;
    readonly filteredCharges = computed(() => {
        const term = this.searchTerm.trim().toLowerCase();
        const selectedStatus = this.selectedStatus;

        return this.charges().filter((charge) => {
            const matchesTerm =
                !term ||
                [charge.playerName, charge.guardianName, charge.conceptName, charge.categoryName, charge.description]
                    .join(' ')
                    .toLowerCase()
                    .includes(term);

            const matchesStatus = !selectedStatus || charge.status === selectedStatus;
            return matchesTerm && matchesStatus;
        });
    });

    searchTerm = '';
    selectedStatus: FinancialChargeStatus | null = null;

    get summary() {
        return this.chargesDebtService.getSummary();
    }

    statusLabel(status: FinancialChargeStatus) {
        if (status === 'PAID') {
            return 'Pagado';
        }

        return status === 'OVERDUE' ? 'Vencido' : 'Pendiente';
    }

    statusSeverity(status: FinancialChargeStatus): 'success' | 'warn' | 'danger' {
        if (status === 'PAID') {
            return 'success';
        }

        return status === 'OVERDUE' ? 'danger' : 'warn';
    }

    formatDate(value: string) {
        return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
    }
}
