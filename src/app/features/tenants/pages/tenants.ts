import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { TenantListItem, TenantStatus } from '../models/tenant.model';
import { TenantManagementService } from '../data-access/tenant-management.service';

@Component({
    selector: 'app-tenants',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        CommonModule,
        ConfirmDialogModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        MenuModule,
        PageHeader,
        RouterModule,
        SelectModule,
        TableModule,
        TagModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService, TenantManagementService],
    template: `
        <p-toast />
        <p-confirmdialog />

        <div class="space-y-4">
            <app-page-header [breadcrumbs]="breadcrumbs" title="Academias" subtitle="Consulta el estado, filtra los registros y administra cada academia." />

            <div class="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-[0.68rem] font-semibold uppercase text-slate-500 dark:text-slate-400">Total</p>
                    <p class="mt-1 text-lg font-semibold tracking-tight text-surface-900 dark:text-surface-0">{{ tenants().length }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-[0.68rem] font-semibold uppercase text-slate-500 dark:text-slate-400">Activas</p>
                    <p class="mt-1 text-lg font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">{{ activeCount }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-[0.68rem] font-semibold uppercase text-slate-500 dark:text-slate-400">Suspendidas</p>
                    <p class="mt-1 text-lg font-semibold tracking-tight text-rose-600 dark:text-rose-400">{{ suspendedCount }}</p>
                </div>
            </div>

            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-surface-800 dark:bg-surface-900">
                <div class="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 dark:border-surface-800 lg:flex-row lg:items-center lg:justify-between">
                    <p-iconfield class="w-full lg:max-w-md">
                        <p-inputicon styleClass="pi pi-search" />
                        <input
                            pInputText
                            type="text"
                            class="w-full"
                            placeholder="Buscar academia"
                            [ngModel]="searchTerm()"
                            (ngModelChange)="searchTerm.set($event)"
                        />
                    </p-iconfield>

                    <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
                        <p-button label="Nuevo" icon="pi pi-plus" severity="primary" styleClass="w-full sm:w-auto" (onClick)="openNew()" />
                        <p-menu #actionsMenu [popup]="true" appendTo="body" [model]="actionsMenuItems" />
                        <p-button label="Acciones" icon="pi pi-chevron-down" severity="secondary" outlined styleClass="w-full sm:w-auto" (click)="actionsMenu.toggle($event)" />

                        <div class="relative w-full sm:w-auto">
                            <p-button label="Filtrar" icon="pi pi-filter" severity="secondary" outlined styleClass="w-full sm:w-auto" (click)="filtersPanelOpen = !filtersPanelOpen" />
                            @if (filtersPanelOpen) {
                                <div class="absolute left-0 right-0 top-full z-50 mt-2 w-full overflow-visible rounded-[0.75rem] border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)] dark:border-surface-700 dark:bg-surface-900 sm:left-auto sm:right-0 sm:w-80">
                                    <div class="border-b border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 dark:border-surface-700 dark:text-slate-200">Filtrar academias</div>
                                    <div class="space-y-4 px-4 py-4">
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Estado</label>
                                            <p-select
                                                [options]="statusFilterOptions"
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Todos"
                                                [ngModel]="filterStatus()"
                                                (ngModelChange)="filterStatus.set($event)"
                                                [showClear]="true"
                                                class="w-full"
                                            />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">País</label>
                                            <p-select
                                                [options]="countryFilterOptions"
                                                placeholder="Todos"
                                                [ngModel]="filterCountry()"
                                                (ngModelChange)="filterCountry.set($event)"
                                                [showClear]="true"
                                                class="w-full"
                                            />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Departamento</label>
                                            <p-select
                                                [options]="departmentFilterOptions"
                                                placeholder="Todos"
                                                [ngModel]="filterDepartment()"
                                                (ngModelChange)="filterDepartment.set($event)"
                                                [showClear]="true"
                                                class="w-full"
                                            />
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <label class="text-sm font-medium text-slate-700 dark:text-slate-200">Ciudad</label>
                                            <p-select
                                                [options]="cityFilterOptions"
                                                placeholder="Todos"
                                                [ngModel]="filterCity()"
                                                (ngModelChange)="filterCity.set($event)"
                                                [showClear]="true"
                                                class="w-full"
                                            />
                                        </div>
                                        <div class="flex items-center justify-end gap-2 pt-1">
                                            <p-button label="Limpiar" severity="secondary" text (onClick)="clearFilters()" />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <p-table
                    #dt
                    [value]="filteredTenants()"
                    [rows]="10"
                    [paginator]="true"
                    [rowHover]="true"
                    [(selection)]="selectedTenants"
                    [globalFilterFields]="['name', 'adminName', 'adminEmail', 'contactEmail', 'city', 'department', 'country', 'phone', 'status']"
                    dataKey="id"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} academias"
                    [showCurrentPageReport]="true"
                    [rowsPerPageOptions]="[10, 20, 30]"
                    responsiveLayout="scroll"
                    styleClass="text-sm"
                >
                    <ng-template #header>
                        <tr>
                            <th style="width: 3rem">
                                <p-tableHeaderCheckbox />
                            </th>
                            <th style="min-width: 16rem">Academia</th>
                            <th style="min-width: 15rem">Administrador</th>
                            <th style="min-width: 13rem">Ubicación</th>
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
                                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ formatDate(tenant.createdAt) }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="flex flex-col">
                                    <span class="font-medium text-surface-900 dark:text-surface-0">{{ tenant.adminName }}</span>
                                    <span class="text-sm text-slate-500 dark:text-slate-400">{{ tenant.adminEmail }}</span>
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
                                <div class="flex items-center justify-end gap-2">
                                    <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" [routerLink]="['/tenants', tenant.id, 'edit']" />
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
    `
})
export class Tenants implements OnInit {
    @ViewChild('dt') dt!: Table;

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Academias' }];

    tenants = signal<TenantListItem[]>([]);
    selectedTenants: TenantListItem[] | null = null;
    filtersPanelOpen = false;

    searchTerm = signal('');
    filterStatus = signal<TenantStatus | ''>('');
    filterCountry = signal('');
    filterDepartment = signal('');
    filterCity = signal('');

    readonly statusFilterOptions = [
        { label: 'Activas', value: 'ACTIVE' },
        { label: 'Suspendidas', value: 'SUSPENDED' }
    ];

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

    filteredTenants = computed(() => {
        const term = this.searchTerm().trim().toLowerCase();
        const status = this.filterStatus();
        const country = this.filterCountry();
        const department = this.filterDepartment();
        const city = this.filterCity();

        return this.tenants().filter((tenant) => {
            const matchesTerm =
                !term ||
                [tenant.name, tenant.adminName, tenant.adminEmail, tenant.contactEmail, tenant.city, tenant.department, tenant.country, tenant.phone, tenant.status]
                    .join(' ')
                    .toLowerCase()
                    .includes(term);

            const matchesStatus = !status || tenant.status === status;
            const matchesCountry = !country || tenant.country === country;
            const matchesDepartment = !department || tenant.department === department;
            const matchesCity = !city || tenant.city === city;

            return matchesTerm && matchesStatus && matchesCountry && matchesDepartment && matchesCity;
        });
    });

    constructor(
        private readonly tenantService: TenantManagementService,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly router: Router
    ) {}

    ngOnInit() {
        this.tenants = this.tenantService.list();
    }

    get activeCount(): number {
        return this.tenants().filter((tenant) => tenant.status === 'ACTIVE').length;
    }

    get suspendedCount(): number {
        return this.tenants().filter((tenant) => tenant.status === 'SUSPENDED').length;
    }

    get countryFilterOptions(): string[] {
        return [...new Set(this.tenants().map((tenant) => tenant.country))].sort((a, b) => a.localeCompare(b));
    }

    get departmentFilterOptions(): string[] {
        return [...new Set(this.tenants().map((tenant) => tenant.department))].sort((a, b) => a.localeCompare(b));
    }

    get cityFilterOptions(): string[] {
        return [...new Set(this.tenants().map((tenant) => tenant.city))].sort((a, b) => a.localeCompare(b));
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    clearFilters() {
        this.searchTerm.set('');
        this.filterStatus.set('');
        this.filterCountry.set('');
        this.filterDepartment.set('');
        this.filterCity.set('');
        this.filtersPanelOpen = false;
    }

    openNew() {
        this.router.navigate(['/tenants/new']);
    }

    deleteSelectedTenants() {
        if (!this.selectedTenants?.length) {
            this.messageService.add({
                severity: 'info',
                summary: 'Sin selección',
                detail: 'Selecciona al menos una academia.'
            });
            return;
        }

        this.confirmationService.confirm({
            message: `¿Eliminar ${this.selectedTenants.length} academias seleccionadas?`,
            header: 'Eliminar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tenants.set(this.tenants().filter((tenant) => !this.selectedTenants?.includes(tenant)));
                this.selectedTenants = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminadas',
                    detail: 'Las academias seleccionadas fueron eliminadas.'
                });
            }
        });
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

    formatDate(value: string) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(date);
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
}
