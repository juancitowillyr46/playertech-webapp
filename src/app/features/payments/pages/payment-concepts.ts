import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { PaymentConceptsService } from '../data-access/payment-concepts.service';
import { PaymentConcept, PaymentConceptForm, PaymentConceptFrequency, PaymentConceptKind, PaymentConceptStatus } from '../models/payment-concept.model';
import { PaymentsNav } from '../ui/payments-nav';

@Component({
    selector: 'app-payment-concepts-page',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        ConfirmDialogModule,
        DialogModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputNumberModule,
        InputTextModule,
        MessageModule,
        PageHeader,
        PaymentsNav,
        RouterModule,
        SelectModule,
        TableModule,
        TagModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    styles: `
        :host ::ng-deep .payment-concepts-table .p-paginator {
            padding-inline: 1rem;
        }

        @media (max-width: 640px) {
            :host ::ng-deep .payment-concepts-table .p-paginator {
                justify-content: center;
                gap: 0.5rem;
            }
        }
    `,
    template: `
        <p-toast />
        <p-confirmdialog />

        <div class="space-y-4">
            <app-page-header [breadcrumbs]="breadcrumbs" title="Conceptos de cobro" subtitle="Define los cobros base que luego usarás en matrícula, cargos y pagos."></app-page-header>

            <div class="mt-4">
                <app-payments-nav active="concepts" />
            </div>

            <div class="mt-4 grid gap-2 grid-cols-2 xl:grid-cols-4">
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Total</p>
                    <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ concepts().length }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Activos</p>
                    <p class="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{{ activeCount }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Recurrentes</p>
                    <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ recurringCount }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Con vencimiento</p>
                    <p class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ dueDateCount }}</p>
                </div>
            </div>

            <div class="content-width-full mx-auto w-full overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <div class="border-b border-slate-200 px-4 py-4 dark:border-surface-800">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div class="flex flex-col gap-2">
                            <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Catálogo financiero</p>
                            <p class="m-0 text-sm text-slate-500 dark:text-slate-400">Mantén organizado qué se cobra, cómo se cobra y cuándo debe usarse cada concepto.</p>
                        </div>

                        <div class="flex flex-col gap-2 xl:flex-row xl:flex-wrap xl:items-center">
                            <p-iconfield iconPosition="left" class="w-full xl:w-[20rem]">
                                <p-inputicon styleClass="pi pi-search" />
                                <input pInputText type="text" class="w-full" [(ngModel)]="searchTerm" placeholder="Buscar concepto por nombre o código" />
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
                            <p-button label="Nuevo concepto" icon="pi pi-plus" styleClass="w-full xl:w-auto" (onClick)="openCreateDialog()" />
                            <p-button label="Ver cargos" icon="pi pi-arrow-right" severity="secondary" [outlined]="true" styleClass="w-full xl:w-auto" routerLink="/payments/charges" />
                        </div>
                    </div>
                </div>

                <div class="sm:hidden divide-y divide-slate-200 dark:divide-surface-800">
                    @for (concept of filteredConcepts(); track concept.id) {
                        <div class="space-y-3 px-4 py-4">
                            <div class="space-y-1">
                                <div class="flex items-start justify-between gap-3">
                                    <div class="min-w-0">
                                        <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ concept.name }}</p>
                                        <p class="m-0 text-xs text-slate-500 dark:text-slate-400">Código: {{ concept.code }}</p>
                                    </div>
                                    <p-tag [value]="getStatusLabel(concept.status)" [severity]="concept.status === 'ACTIVE' ? 'success' : 'danger'" />
                                </div>
                                <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ concept.description }}</p>
                            </div>

                            <div class="grid grid-cols-2 gap-3 text-sm">
                                <div class="space-y-1">
                                    <p class="m-0 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Tipo</p>
                                    <p class="m-0 text-surface-900 dark:text-surface-0">{{ getKindLabel(concept.kind) }}</p>
                                </div>
                                <div class="space-y-1">
                                    <p class="m-0 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Frecuencia</p>
                                    <p class="m-0 text-surface-900 dark:text-surface-0">{{ getFrequencyLabel(concept.frequency) }}</p>
                                </div>
                                <div class="space-y-1">
                                    <p class="m-0 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Valor base</p>
                                    <p class="m-0 text-surface-900 dark:text-surface-0">{{ formatCurrency(concept.defaultAmount) }}</p>
                                </div>
                                <div class="space-y-1">
                                    <p class="m-0 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Uso</p>
                                    <p-tag [value]="concept.requiresDueDate ? 'Con vencimiento' : 'Inmediato'" [severity]="concept.requiresDueDate ? 'info' : 'contrast'" />
                                </div>
                            </div>

                            <div class="flex flex-col gap-2 pt-1">
                                <p-button label="Editar" severity="secondary" [outlined]="true" styleClass="w-full" (onClick)="openEditDialog(concept)" />
                                <p-button
                                    [label]="concept.status === 'ACTIVE' ? 'Desactivar' : 'Reactivar'"
                                    [severity]="concept.status === 'ACTIVE' ? 'warn' : 'success'"
                                    [outlined]="true"
                                    styleClass="w-full"
                                    (onClick)="confirmStatusChange(concept)"
                                />
                            </div>
                        </div>
                    } @empty {
                        <div class="px-4 py-10 text-center">
                            <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span class="text-base font-medium text-surface-900 dark:text-surface-0">No hay conceptos para mostrar</span>
                                <span>Crea el primer concepto para empezar a estructurar matrícula, cargos y pagos.</span>
                            </div>
                        </div>
                    }
                </div>

                <p-table [value]="filteredConcepts()" [rows]="10" [paginator]="true" responsiveLayout="scroll" currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} conceptos" [showCurrentPageReport]="true" [rowsPerPageOptions]="[10, 20, 30]" styleClass="hidden sm:block payment-concepts-table">
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="min-width: 16rem">Concepto</th>
                            <th style="min-width: 10rem">Tipo</th>
                            <th style="min-width: 10rem">Frecuencia</th>
                            <th style="min-width: 10rem">Valor base</th>
                            <th style="min-width: 11rem">Uso operativo</th>
                            <th style="min-width: 9rem">Estado</th>
                            <th style="min-width: 12rem" class="text-right">Acciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-concept>
                        <tr>
                            <td>
                                <div class="space-y-1">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ concept.name }}</p>
                                    <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <span>{{ concept.code }}</span>
                                        <span>•</span>
                                        <span>{{ concept.description }}</span>
                                    </div>
                                </div>
                            </td>
                            <td>{{ getKindLabel(concept.kind) }}</td>
                            <td>{{ getFrequencyLabel(concept.frequency) }}</td>
                            <td>{{ formatCurrency(concept.defaultAmount) }}</td>
                            <td>
                                <p-tag [value]="concept.requiresDueDate ? 'Controla vencimiento' : 'Uso inmediato'" [severity]="concept.requiresDueDate ? 'info' : 'contrast'" />
                            </td>
                            <td>
                                <p-tag [value]="getStatusLabel(concept.status)" [severity]="concept.status === 'ACTIVE' ? 'success' : 'danger'" />
                            </td>
                            <td>
                                <div class="flex justify-end gap-2">
                                    <p-button label="Editar" severity="secondary" [outlined]="true" size="small" (onClick)="openEditDialog(concept)" />
                                    <p-button
                                        [label]="concept.status === 'ACTIVE' ? 'Desactivar' : 'Reactivar'"
                                        [severity]="concept.status === 'ACTIVE' ? 'warn' : 'success'"
                                        [outlined]="true"
                                        size="small"
                                        (onClick)="confirmStatusChange(concept)"
                                    />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="7" class="py-10 text-center">
                                <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">No hay conceptos para mostrar</span>
                                    <span>Crea el primer concepto para empezar a estructurar matrícula, cargos y pagos.</span>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>

        <p-dialog [(visible)]="dialogVisible" [modal]="true" [closable]="true" [draggable]="false" [resizable]="false" [style]="{ width: 'min(44rem, calc(100vw - 2rem))' }" [header]="dialogTitle" (onHide)="resetDialog()">
            <div class="space-y-4">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12">
                        <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Información del concepto</p>
                        <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Define el nombre, el valor base y el comportamiento del concepto dentro de la operación financiera.</p>
                    </div>

                    @if (editingConceptCode) {
                        <div class="col-span-12 md:col-span-4 flex flex-col gap-2">
                            <label for="conceptCodeReadonly" class="text-sm font-medium text-surface-700 dark:text-surface-200">Código</label>
                            <input pInputText id="conceptCodeReadonly" [ngModel]="editingConceptCode" class="w-full" [disabled]="true" />
                            <p class="m-0 text-xs leading-5 text-slate-500 dark:text-slate-400">Este código es generado por el sistema y no se edita manualmente.</p>
                        </div>
                    }

                    <div class="col-span-12 flex flex-col gap-2" [ngClass]="editingConceptCode ? 'md:col-span-8' : 'md:col-span-12'">
                        <label for="conceptName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Concepto <span class="text-rose-500">*</span></label>
                        <input pInputText id="conceptName" [(ngModel)]="form.name" placeholder="Ej. Matrícula anual" class="w-full" />
                        @if (showError('name')) {
                            <p-message severity="error" size="small">Ingresa el nombre del concepto.</p-message>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="conceptKind" class="text-sm font-medium text-surface-700 dark:text-surface-200">Tipo <span class="text-rose-500">*</span></label>
                        <p-select id="conceptKind" [options]="kindOptions" optionLabel="label" optionValue="value" [(ngModel)]="form.kind" placeholder="Selecciona un tipo" class="w-full" appendTo="body" />
                        @if (showError('kind')) {
                            <p-message severity="error" size="small">Selecciona el tipo del concepto.</p-message>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="conceptFrequency" class="text-sm font-medium text-surface-700 dark:text-surface-200">Frecuencia <span class="text-rose-500">*</span></label>
                        <p-select id="conceptFrequency" [options]="frequencyOptions" optionLabel="label" optionValue="value" [(ngModel)]="form.frequency" placeholder="Selecciona una frecuencia" class="w-full" appendTo="body" />
                        @if (showError('frequency')) {
                            <p-message severity="error" size="small">Selecciona la frecuencia operativa.</p-message>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="conceptAmount" class="text-sm font-medium text-surface-700 dark:text-surface-200">Valor base <span class="text-rose-500">*</span></label>
                        <p-inputnumber id="conceptAmount" [(ngModel)]="form.defaultAmount" mode="currency" currency="COP" locale="es-CO" inputStyleClass="w-full" styleClass="w-full" [min]="0" />
                        @if (showError('defaultAmount')) {
                            <p-message severity="error" size="small">Ingresa un valor base válido.</p-message>
                        }
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="requiresDueDate" class="text-sm font-medium text-surface-700 dark:text-surface-200">Control de vencimiento</label>
                        <p-select
                            id="requiresDueDate"
                            [options]="dueDateOptions"
                            optionLabel="label"
                            optionValue="value"
                            [(ngModel)]="form.requiresDueDate"
                            class="w-full"
                            appendTo="body"
                        />
                    </div>

                    <div class="col-span-12 flex flex-col gap-2">
                        <label for="conceptDescription" class="text-sm font-medium text-surface-700 dark:text-surface-200">Descripción <span class="text-rose-500">*</span></label>
                        <input pInputText id="conceptDescription" [(ngModel)]="form.description" placeholder="Ej. Cobro inicial para formalizar la inscripción del jugador." class="w-full" />
                        @if (showError('description')) {
                            <p-message severity="error" size="small">Describe brevemente cuándo debe usarse este concepto.</p-message>
                        }
                    </div>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="dialogVisible = false" />
                    <p-button [label]="editingConceptId ? 'Guardar cambios' : 'Crear concepto'" icon="pi pi-check" styleClass="w-full sm:w-auto" (onClick)="saveConcept()" />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class PaymentConceptsPage {
    private readonly paymentConceptsService = inject(PaymentConceptsService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly messageService = inject(MessageService);

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Conceptos de cobro' }];

    readonly statusOptions = [
        { label: 'Activos', value: 'ACTIVE' as PaymentConceptStatus },
        { label: 'Inactivos', value: 'INACTIVE' as PaymentConceptStatus }
    ];

    readonly kindOptions = [
        { label: 'Matrícula', value: 'ENROLLMENT' as PaymentConceptKind },
        { label: 'Recurrente', value: 'RECURRING' as PaymentConceptKind },
        { label: 'Extra', value: 'EXTRA' as PaymentConceptKind },
        { label: 'Administrativo', value: 'ADMINISTRATIVE' as PaymentConceptKind }
    ];

    readonly frequencyOptions = [
        { label: 'Único', value: 'ONE_TIME' as PaymentConceptFrequency },
        { label: 'Mensual', value: 'MONTHLY' as PaymentConceptFrequency },
        { label: 'Bimestral', value: 'BIMONTHLY' as PaymentConceptFrequency },
        { label: 'Trimestral', value: 'QUARTERLY' as PaymentConceptFrequency },
        { label: 'Anual', value: 'ANNUAL' as PaymentConceptFrequency }
    ];

    readonly dueDateOptions = [
        { label: 'Requiere vencimiento', value: true },
        { label: 'Sin vencimiento', value: false }
    ];

    readonly concepts = this.paymentConceptsService.list();

    readonly filteredConcepts = computed(() => {
        const term = this.searchTerm.trim().toLowerCase();
        const selectedStatus = this.selectedStatus;

        return this.concepts().filter((concept) => {
            const matchesTerm =
                !term ||
                [concept.name, concept.code, concept.description, this.getKindLabel(concept.kind), this.getFrequencyLabel(concept.frequency)]
                    .join(' ')
                    .toLowerCase()
                    .includes(term);

            const matchesStatus = !selectedStatus || concept.status === selectedStatus;
            return matchesTerm && matchesStatus;
        });
    });

    searchTerm = '';
    selectedStatus: PaymentConceptStatus | null = null;
    dialogVisible = false;
    submitted = false;
    editingConceptId: string | null = null;
    editingConceptCode = '';
    form: PaymentConceptForm = this.emptyForm();

    get activeCount() {
        return this.concepts().filter((concept) => concept.status === 'ACTIVE').length;
    }

    get recurringCount() {
        return this.concepts().filter((concept) => concept.kind === 'RECURRING').length;
    }

    get dueDateCount() {
        return this.concepts().filter((concept) => concept.requiresDueDate).length;
    }

    get dialogTitle() {
        return this.editingConceptId ? 'Editar concepto de cobro' : 'Nuevo concepto de cobro';
    }

    openCreateDialog() {
        this.editingConceptId = null;
        this.editingConceptCode = '';
        this.submitted = false;
        this.form = this.emptyForm();
        this.dialogVisible = true;
    }

    openEditDialog(concept: PaymentConcept) {
        const found = this.paymentConceptsService.getById(concept.id);
        if (!found) {
            return;
        }

        this.editingConceptId = concept.id;
        this.editingConceptCode = concept.code;
        this.submitted = false;
        this.form = found;
        this.dialogVisible = true;
    }

    saveConcept() {
        this.submitted = true;
        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa el concepto',
                detail: 'Completa los campos obligatorios antes de guardar.'
            });
            return;
        }

        const saved = this.paymentConceptsService.save({
            ...this.form,
            id: this.editingConceptId ?? undefined
        });

        this.dialogVisible = false;
        this.resetDialog();
        this.messageService.add({
            severity: 'success',
            summary: this.editingConceptId ? 'Concepto actualizado' : 'Concepto creado',
            detail: this.editingConceptId
                ? `${saved.name} quedó actualizado en esta iteración mock.`
                : `${saved.name} quedó disponible en el catálogo financiero mock.`
        });
    }

    confirmStatusChange(concept: PaymentConcept) {
        const nextStatus: PaymentConceptStatus = concept.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const nextLabel = nextStatus === 'ACTIVE' ? 'reactivar' : 'desactivar';

        this.confirmationService.confirm({
            message: `¿Quieres ${nextLabel.toLowerCase()} el concepto ${concept.name}?`,
            header: nextStatus === 'ACTIVE' ? 'Reactivar concepto' : 'Desactivar concepto',
            acceptLabel: nextStatus === 'ACTIVE' ? 'Reactivar' : 'Desactivar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.paymentConceptsService.updateStatus(concept.id, nextStatus);
                this.messageService.add({
                    severity: 'success',
                    summary: nextStatus === 'ACTIVE' ? 'Concepto reactivado' : 'Concepto desactivado',
                    detail: nextStatus === 'ACTIVE' ? 'El concepto vuelve a estar disponible para nuevos cargos.' : 'El concepto dejó de mostrarse como opción activa.'
                });
            }
        });
    }

    resetDialog() {
        this.submitted = false;
        this.editingConceptId = null;
        this.editingConceptCode = '';
        this.form = this.emptyForm();
    }

    showError(field: keyof PaymentConceptForm) {
        return this.submitted && !this.isFieldValid(field);
    }

    getKindLabel(kind: PaymentConceptKind) {
        return this.kindOptions.find((option) => option.value === kind)?.label ?? kind;
    }

    getFrequencyLabel(frequency: PaymentConceptFrequency) {
        return this.frequencyOptions.find((option) => option.value === frequency)?.label ?? frequency;
    }

    getStatusLabel(status: PaymentConceptStatus) {
        return status === 'ACTIVE' ? 'Activo' : 'Inactivo';
    }

    formatCurrency(value: number) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(value);
    }

    private isFormValid() {
        return ['name', 'description', 'kind', 'frequency', 'defaultAmount'].every((field) => this.isFieldValid(field as keyof PaymentConceptForm));
    }

    private isFieldValid(field: keyof PaymentConceptForm) {
        const value = this.form[field];

        switch (field) {
            case 'name':
            case 'description':
                return typeof value === 'string' && value.trim().length > 0;
            case 'kind':
            case 'frequency':
                return !!value;
            case 'defaultAmount':
                return typeof value === 'number' && value > 0;
            default:
                return true;
        }
    }

    private emptyForm(): PaymentConceptForm {
        return {
            name: '',
            description: '',
            kind: '',
            frequency: '',
            defaultAmount: null,
            requiresDueDate: true
        };
    }
}
