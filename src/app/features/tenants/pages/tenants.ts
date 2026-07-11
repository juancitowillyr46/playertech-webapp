import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TenantForm, TenantListItem, TenantStatus } from '../models/tenant.model';
import { TenantManagementService } from '../data-access/tenant-management.service';

@Component({
    selector: 'app-tenants',
    standalone: true,
    imports: [
        ButtonModule,
        CommonModule,
        ConfirmDialogModule,
        DialogModule,
        FormsModule,
        CheckboxModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        MessageModule,
        MenuModule,
        RouterModule,
        SelectModule,
        TableModule,
        TagModule,
        TextareaModule,
        ToastModule,
        ToolbarModule
    ],
    providers: [ConfirmationService, MessageService, TenantManagementService],
    template: `
        <p-toast />
        <p-confirmdialog />

        <div class="space-y-6">
            <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-4 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:px-5 sm:py-5">
                <h2 class="m-0 text-base font-medium tracking-tight text-surface-900 dark:text-surface-0 sm:text-lg">Academias</h2>
                <p class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Aquí puedes ver y administrar los equipos registrados.</p>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:px-4 sm:py-3">
                    <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Total</p>
                    <p class="mt-1 text-xl font-semibold tracking-tight text-surface-900 dark:text-surface-0">{{ tenants().length }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:px-4 sm:py-3">
                    <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Activas</p>
                    <p class="mt-1 text-xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">{{ activeCount }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:px-4 sm:py-3">
                    <p class="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Suspendidas</p>
                    <p class="mt-1 text-xl font-semibold tracking-tight text-rose-600 dark:text-rose-400">{{ suspendedCount }}</p>
                </div>
            </div>

            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-800 sm:px-4 sm:py-4">
                    <p-toolbar
                        styleClass="mb-0 rounded-none bg-transparent p-0 shadow-none"
                        [style]="{ border: '0', background: 'transparent', boxShadow: 'none' }"
                    >
                        <ng-template #start>
                            <p-iconfield class="w-full max-w-md">
                                <p-inputicon styleClass="pi pi-search" />
                                <input pInputText type="text" class="w-full" placeholder="Buscar academia" />
                            </p-iconfield>
                        </ng-template>

                        <ng-template #end>
                            <div class="flex items-center gap-2">
                                <p-button label="Nuevo" icon="pi pi-plus" severity="primary" (onClick)="openNew()" />
                                <p-menu #actionsMenu [popup]="true" [model]="actionsMenuItems" />
                                <p-button label="Acciones" icon="pi pi-chevron-down" severity="secondary" outlined (click)="actionsMenu.toggle($event)" />
                                <div class="relative">
                                    <p-button label="Filtrar" icon="pi pi-filter" severity="secondary" outlined (click)="filtersPanelOpen = !filtersPanelOpen" />
                                    @if (filtersPanelOpen) {
                                        <div class="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-surface-700 dark:bg-surface-900">
                                            <div class="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-surface-700 dark:text-slate-200">Columnas visibles</div>
                                            <div class="space-y-3 px-4 py-3">
                                                <label class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <p-checkbox [(ngModel)]="secondaryVisibleColumns.name" [binary]="true" />
                                                    Academia
                                                </label>
                                                <label class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <p-checkbox [(ngModel)]="secondaryVisibleColumns.contact" [binary]="true" />
                                                    Contacto
                                                </label>
                                                <label class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <p-checkbox [(ngModel)]="secondaryVisibleColumns.location" [binary]="true" />
                                                    Ubicación
                                                </label>
                                                <label class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <p-checkbox [(ngModel)]="secondaryVisibleColumns.phone" [binary]="true" />
                                                    Teléfono
                                                </label>
                                                <label class="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                                                    <p-checkbox [(ngModel)]="secondaryVisibleColumns.status" [binary]="true" />
                                                    Estado
                                                </label>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </ng-template>
                    </p-toolbar>
                </div>

                <p-table
                    [value]="tenants()"
                    [rows]="6"
                    [paginator]="true"
                    [rowHover]="true"
                    [(selection)]="secondarySelectedTenants"
                    [globalFilterFields]="['name', 'contactName', 'contactEmail', 'city', 'department', 'country', 'phone', 'status']"
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    [showCurrentPageReport]="true"
                    [rowsPerPageOptions]="[10, 20, 30]"
                >
                    <ng-template #header>
                        <tr>
                            <th style="width: 3rem">
                                <p-tableHeaderCheckbox />
                            </th>
                            @if (secondaryVisibleColumns.name) {
                                <th style="min-width: 16rem">Academia</th>
                            }
                            @if (secondaryVisibleColumns.contact) {
                                <th style="min-width: 14rem">Contacto</th>
                            }
                            @if (secondaryVisibleColumns.location) {
                                <th style="min-width: 12rem">Ubicación</th>
                            }
                            @if (secondaryVisibleColumns.phone) {
                                <th style="min-width: 12rem">Teléfono</th>
                            }
                            @if (secondaryVisibleColumns.status) {
                                <th style="min-width: 10rem">Estado</th>
                            }
                            <th style="min-width: 12rem"></th>
                        </tr>
                    </ng-template>

                    <ng-template #body let-tenant>
                        <tr>
                            <td style="width: 3rem">
                                <p-tableCheckbox [value]="tenant" />
                            </td>
                            @if (secondaryVisibleColumns.name) {
                                <td>
                                    <div class="flex flex-col">
                                        <span class="font-medium text-surface-900 dark:text-surface-0">{{ tenant.name }}</span>
                                        <span class="text-xs text-slate-500 dark:text-slate-400">{{ tenant.createdAt }}</span>
                                    </div>
                                </td>
                            }
                            @if (secondaryVisibleColumns.contact) {
                                <td>
                                    <div class="flex flex-col">
                                        <span class="font-medium text-surface-900 dark:text-surface-0">{{ tenant.contactName }}</span>
                                        <span class="text-sm text-slate-500 dark:text-slate-400">{{ tenant.contactEmail }}</span>
                                    </div>
                                </td>
                            }
                            @if (secondaryVisibleColumns.location) {
                                <td>
                                    <div class="flex flex-col">
                                        <span class="text-surface-900 dark:text-surface-0">{{ tenant.city }}</span>
                                        <span class="text-sm text-slate-500 dark:text-slate-400">{{ tenant.department }}, {{ tenant.country }}</span>
                                    </div>
                                </td>
                            }
                            @if (secondaryVisibleColumns.phone) {
                                <td class="text-surface-900 dark:text-surface-0">{{ tenant.phone }}</td>
                            }
                            @if (secondaryVisibleColumns.status) {
                                <td>
                                    <p-tag [value]="getStatusLabel(tenant.status)" [severity]="getSeverity(tenant.status)" />
                                </td>
                            }
                            <td>
                                <div class="flex items-center justify-end gap-2">
                                    <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" (click)="editTenant(tenant)" />
                                    <p-button
                                        *ngIf="tenant.status === 'ACTIVE'"
                                        icon="pi pi-pause"
                                        severity="warn"
                                        [rounded]="true"
                                        [outlined]="true"
                                        (click)="suspendTenant(tenant)"
                                    />
                                    <p-button
                                        *ngIf="tenant.status === 'SUSPENDED'"
                                        icon="pi pi-play"
                                        severity="success"
                                        [rounded]="true"
                                        [outlined]="true"
                                        (click)="reactivateTenant(tenant)"
                                    />
                                    <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [outlined]="true" (click)="removeTenant(tenant)" />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>

        <p-dialog [(visible)]="dialogVisible" [modal]="true" [style]="{ width: '48rem' }" [breakpoints]="{ '960px': '92vw', '640px': '96vw' }" [header]="dialogHeader">
            <div class="space-y-6">
                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-12 flex flex-col gap-2">
                        <label for="name" class="text-sm font-medium text-surface-700 dark:text-surface-200">Academia</label>
                        <input pInputText id="name" [(ngModel)]="form.name" name="name" placeholder="Ej. PlayerTech" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="contactName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contacto</label>
                        <input pInputText id="contactName" [(ngModel)]="form.contactName" name="contactName" placeholder="Ej. Juan Pérez" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="contactEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo</label>
                        <input pInputText id="contactEmail" [(ngModel)]="form.contactEmail" name="contactEmail" placeholder="Ej. correo@academia.com" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="phone" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono</label>
                        <input pInputText id="phone" [(ngModel)]="form.phone" name="phone" placeholder="Ej. +57 312 345 6789" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="country" class="text-sm font-medium text-surface-700 dark:text-surface-200">País</label>
                        <input pInputText id="country" [(ngModel)]="form.country" name="country" placeholder="Ej. Colombia" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="department" class="text-sm font-medium text-surface-700 dark:text-surface-200">Departamento</label>
                        <input pInputText id="department" [(ngModel)]="form.department" name="department" placeholder="Ej. Risaralda" class="w-full" />
                    </div>

                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                        <label for="city" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad</label>
                        <input pInputText id="city" [(ngModel)]="form.city" name="city" placeholder="Ej. Pereira" class="w-full" />
                    </div>

                    <div class="col-span-12 flex flex-col gap-2">
                        <label for="address" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección</label>
                        <textarea pTextarea id="address" [(ngModel)]="form.address" name="address" rows="3" placeholder="Ej. Calle 10 # 20-30" class="w-full"></textarea>
                    </div>
                </div>
            </div>

            <ng-template #footer>
                <p-button label="Cancelar" severity="secondary" text (onClick)="closeDialog()" />
                <p-button label="Guardar" icon="pi pi-check" (onClick)="saveTenant()" />
            </ng-template>
        </p-dialog>
    `
})
export class Tenants implements OnInit {
    @ViewChild('dt') dt!: Table;

    tenants = signal<TenantListItem[]>([]);

    selectedTenants: TenantListItem[] | null = null;

    secondarySelectedTenants: TenantListItem[] | null = null;
    filtersPanelOpen = false;
    actionsMenuItems = [
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: () => this.deleteSelectedTenants()
        },
        {
            label: 'Exportar',
            icon: 'pi pi-upload',
            command: () => this.exportCSV()
        }
    ];

    secondaryVisibleColumns = {
        name: true,
        contact: true,
        location: true,
        phone: true,
        status: true
    };

    cols!: { field: string; header: string }[];

    dialogVisible = false;

    dialogHeader = 'Nuevo tenant';

    form: TenantForm = this.emptyForm();

    constructor(
        private readonly tenantService: TenantManagementService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit() {
        this.tenants = this.tenantService.list();
        this.cols = [
            { field: 'name', header: 'Academia' },
            { field: 'contactName', header: 'Contacto' },
            { field: 'city', header: 'Ubicación' },
            { field: 'phone', header: 'Teléfono' },
            { field: 'status', header: 'Estado' }
        ];
    }

    get activeCount(): number {
        return this.tenants().filter((tenant) => tenant.status === 'ACTIVE').length;
    }

    get suspendedCount(): number {
        return this.tenants().filter((tenant) => tenant.status === 'SUSPENDED').length;
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    openNew() {
        this.form = this.emptyForm();
        this.dialogHeader = 'Nuevo tenant';
        this.dialogVisible = true;
    }

    editTenant(tenant: TenantListItem) {
        this.form = {
            id: tenant.id,
            name: tenant.name,
            contactEmail: tenant.contactEmail,
            contactName: tenant.contactName,
            phone: tenant.phone,
            country: tenant.country,
            department: tenant.department,
            city: tenant.city,
            address: tenant.address
        };
        this.dialogHeader = 'Editar tenant';
        this.dialogVisible = true;
    }

    closeDialog() {
        this.dialogVisible = false;
        this.form = this.emptyForm();
    }

    deleteSelectedTenants() {
        this.confirmationService.confirm({
            message: '¿Eliminar los tenants seleccionados?',
            header: 'Eliminar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tenants.set(this.tenants().filter((tenant) => !this.selectedTenants?.includes(tenant)));
                this.selectedTenants = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Listo',
                    detail: 'Tenants eliminados'
                });
            }
        });
    }

    saveTenant() {
        this.tenantService.save(this.form);
        this.messageService.add({
            severity: 'success',
            summary: 'Listo',
            detail: this.form.id ? 'Actualizado.' : 'Creado.'
        });
        this.closeDialog();
    }

    suspendTenant(tenant: TenantListItem) {
        this.confirmationService.confirm({
            message: `¿Suspender ${tenant.name}?`,
            header: 'Suspender',
            icon: 'pi pi-pause-circle',
            accept: () => {
                this.tenantService.suspend(tenant.id);
                this.messageService.add({ severity: 'warn', summary: 'Suspendido', detail: tenant.name });
            }
        });
    }

    reactivateTenant(tenant: TenantListItem) {
        this.confirmationService.confirm({
            message: `¿Reactivar ${tenant.name}?`,
            header: 'Reactivar',
            icon: 'pi pi-play-circle',
            accept: () => {
                this.tenantService.reactivate(tenant.id);
                this.messageService.add({ severity: 'success', summary: 'Reactivado', detail: tenant.name });
            }
        });
    }

    removeTenant(tenant: TenantListItem) {
        this.confirmationService.confirm({
            message: `¿Eliminar ${tenant.name}?`,
            header: 'Eliminar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tenantService.delete(tenant.id);
                this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: tenant.name });
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getSeverity(status: TenantStatus) {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'SUSPENDED':
                return 'danger';
            default:
                return 'info';
        }
    }

    getStatusLabel(status: TenantStatus) {
        switch (status) {
            case 'ACTIVE':
                return 'Activa';
            case 'SUSPENDED':
                return 'Suspendida';
            default:
                return status;
        }
    }

    private emptyForm(): TenantForm {
        return {
            name: '',
            contactEmail: '',
            contactName: '',
            phone: '',
            country: '',
            department: '',
            city: '',
            address: ''
        };
    }
}
