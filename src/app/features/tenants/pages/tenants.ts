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
import { SelectModule } from 'primeng/select';
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
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        MessageModule,
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
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:px-5 sm:py-4">
                    <div class="flex items-start justify-between gap-3">
                        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total</p>
                        <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
                            <i class="pi pi-building"></i>
                        </span>
                    </div>
                    <p class="mt-2 text-[1.5rem] font-semibold tracking-tight text-surface-900 dark:text-surface-0">{{ tenants().length }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:px-5 sm:py-4">
                    <div class="flex items-start justify-between gap-3">
                        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Activas</p>
                        <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
                            <i class="pi pi-check-circle"></i>
                        </span>
                    </div>
                    <p class="mt-2 text-[1.5rem] font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">{{ activeCount }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:px-5 sm:py-4">
                    <div class="flex items-start justify-between gap-3">
                        <p class="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Suspendidas</p>
                        <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300">
                            <i class="pi pi-ban"></i>
                        </span>
                    </div>
                    <p class="mt-2 text-[1.5rem] font-semibold tracking-tight text-rose-600 dark:text-rose-400">{{ suspendedCount }}</p>
                </div>
            </div>

            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <div class="border-b border-slate-200 px-3 pt-3 pb-3 dark:border-surface-800 sm:px-4 sm:pt-4 sm:pb-4">
                    <p-toolbar
                        styleClass="mb-0 rounded-none bg-transparent p-0 shadow-none"
                        [style]="{ border: '0', background: 'transparent', boxShadow: 'none' }"
                    >
                        <ng-template #start>
                            <p-iconfield class="w-full max-w-md">
                                <p-inputicon styleClass="pi pi-search" />
                                <input pInputText type="text" class="w-full" (input)="onGlobalFilter(dt, $event)" placeholder="Buscar academia" />
                            </p-iconfield>
                        </ng-template>

                        <ng-template #end>
                            <div class="flex items-center gap-2">
                                <p-button label="Nuevo" icon="pi pi-plus" severity="secondary" class="mr-1" (onClick)="openNew()" />
                                <p-button
                                    severity="secondary"
                                    label="Eliminar"
                                    icon="pi pi-trash"
                                    outlined
                                    (onClick)="deleteSelectedTenants()"
                                    [disabled]="!selectedTenants || !selectedTenants.length"
                                />
                                <p-button label="Exportar" icon="pi pi-upload" severity="secondary" (onClick)="exportCSV()" />
                            </div>
                        </ng-template>
                    </p-toolbar>
                </div>

                <p-table
                    #dt
                    [value]="tenants()"
                    [rows]="10"
                    [columns]="cols"
                    [paginator]="true"
                    [globalFilterFields]="['name', 'contactName', 'contactEmail', 'city', 'department', 'country', 'phone', 'status']"
                    [tableStyle]="{ 'min-width': '75rem' }"
                    [(selection)]="selectedTenants"
                    [rowHover]="true"
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} academias"
                    [showCurrentPageReport]="true"
                    [rowsPerPageOptions]="[10, 20, 30]"
                >
                    <ng-template #header>
                        <tr>
                            <th style="width: 3rem">
                                <p-tableHeaderCheckbox />
                            </th>
                            <th style="min-width: 16rem">Academia</th>
                            <th style="min-width: 14rem">Contacto</th>
                            <th style="min-width: 12rem">Ubicación</th>
                            <th style="min-width: 12rem">Teléfono</th>
                            <th style="min-width: 10rem">Estado</th>
                            <th style="min-width: 12rem"></th>
                        </tr>
                    </ng-template>

                    <ng-template #body let-tenant>
                        <tr>
                            <td style="width: 3rem">
                                <p-tableCheckbox [value]="tenant" />
                            </td>
                            <td>
                                <div class="flex flex-col">
                                    <span class="font-medium text-surface-900 dark:text-surface-0">{{ tenant.name }}</span>
                                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ tenant.createdAt }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex flex-col">
                                    <span class="font-medium text-surface-900 dark:text-surface-0">{{ tenant.contactName }}</span>
                                    <span class="text-sm text-slate-500 dark:text-slate-400">{{ tenant.contactEmail }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex flex-col">
                                    <span class="text-surface-900 dark:text-surface-0">{{ tenant.city }}</span>
                                    <span class="text-sm text-slate-500 dark:text-slate-400">{{ tenant.department }}, {{ tenant.country }}</span>
                                </div>
                            </td>
                            <td class="text-surface-900 dark:text-surface-0">{{ tenant.phone }}</td>
                            <td>
                                <p-tag [value]="getStatusLabel(tenant.status)" [severity]="getSeverity(tenant.status)" />
                            </td>
                            <td>
                                <p-button icon="pi pi-pencil" class="mr-2" [rounded]="true" [outlined]="true" (click)="editTenant(tenant)" />
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
