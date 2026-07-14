import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { PlayerManagementService } from '@/app/features/players/data-access/player-management.service';
import { Guardian } from '@/app/features/players/models/player.model';

@Component({
    selector: 'app-guardians-list-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, MenuModule, PageHeader, RouterModule, TableModule, TagModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <p-menu #guardianActionsMenu [popup]="true" appendTo="body" [model]="guardianActionItems"></p-menu>

        <div class="space-y-4">
            <app-page-header [breadcrumbs]="breadcrumbs" title="Acudientes" subtitle="Consulta, actualiza y organiza los contactos autorizados de la academia."></app-page-header>

            <div class="mt-4 content-width-full mx-auto w-full overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <p-iconfield iconPosition="left" class="w-full lg:max-w-md">
                            <p-inputicon styleClass="pi pi-search" />
                            <input pInputText type="text" [(ngModel)]="search" placeholder="Buscar acudiente por nombre, correo o teléfono" class="w-full" />
                        </p-iconfield>

                        <div class="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">
                            <p-button label="Nuevo acudiente" icon="pi pi-plus" styleClass="w-full md:min-w-[11.5rem] md:w-auto" routerLink="/guardians/new" />
                        </div>
                    </div>
                </div>

                <p-table [value]="filteredGuardians" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Acudiente</th>
                            <th>Correo</th>
                            <th>Teléfono</th>
                            <th>Parentesco</th>
                            <th>Estado</th>
                            <th class="text-right">Acciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-guardian>
                        <tr class="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-surface-800/70" (click)="openGuardian(guardian)">
                            <td>
                                <div class="space-y-1">
                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ guardianFullName(guardian) }}</p>
                                    <p class="m-0 text-xs text-slate-500 dark:text-slate-400">Contacto autorizado de la academia</p>
                                </div>
                            </td>
                            <td>{{ guardian.email }}</td>
                            <td>{{ guardian.phone }}</td>
                            <td><p-tag [value]="guardian.relationship" severity="info" /></td>
                            <td><p-tag [value]="getStatusLabel(guardian.status)" [severity]="getStatusSeverity(guardian.status)" /></td>
                            <td>
                                <div class="flex justify-end gap-2" (click)="$event.stopPropagation()">
                                    <p-button label="Ver" severity="secondary" [outlined]="true" size="small" (onClick)="openGuardian(guardian)" />
                                    <p-button icon="pi pi-ellipsis-h" [text]="true" rounded severity="secondary" (onClick)="openGuardianActionsMenu($event, guardian)" />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="6" class="py-10 text-center">
                                <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay acudientes registrados</span>
                                    <span>Crea el primer acudiente para mantener organizados los contactos autorizados.</span>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `
})
export class GuardiansListPage implements OnDestroy {
    @ViewChild('guardianActionsMenu') guardianActionsMenu?: Menu;
    private readonly document = inject(DOCUMENT);

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Acudientes' }];

    search = '';
    guardians: Guardian[] = [];
    selectedGuardian: Guardian | null = null;
    guardianActionItems: MenuItem[] = [];
    private readonly routerEventsSubscription: Subscription;

    constructor(
        private readonly playerService: PlayerManagementService,
        private readonly router: Router,
        private readonly messageService: MessageService
    ) {
        this.loadGuardians();
        this.routerEventsSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.closeGuardianActionsMenu();
            }
        });
    }

    ngOnDestroy() {
        this.closeGuardianActionsMenu();
        this.routerEventsSubscription.unsubscribe();
    }

    get filteredGuardians() {
        const term = this.search.trim().toLowerCase();
        if (!term) {
            return this.guardians;
        }

        return this.guardians.filter((guardian) => {
            const fullName = this.guardianFullName(guardian).toLowerCase();
            return (
                fullName.includes(term) ||
                guardian.email.toLowerCase().includes(term) ||
                guardian.phone.toLowerCase().includes(term) ||
                guardian.relationship.toLowerCase().includes(term)
            );
        });
    }

    get activeGuardiansCount() {
        return this.guardians.filter((guardian) => guardian.status === 'ACTIVE').length;
    }

    get inactiveGuardiansCount() {
        return this.guardians.filter((guardian) => guardian.status === 'INACTIVE').length;
    }

    openGuardian(guardian: Guardian) {
        this.closeGuardianActionsMenu();
        this.router.navigate(['/guardians', guardian.id]);
    }

    openGuardianActionsMenu(event: Event, guardian: Guardian) {
        this.closeDetachedGuardianMenus();
        this.selectedGuardian = guardian;
        this.guardianActionItems = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    this.closeGuardianActionsMenu();
                    this.router.navigate(['/guardians', guardian.id, 'edit']);
                }
            },
            {
                label: guardian.status === 'ACTIVE' ? 'Desactivar' : 'Reactivar',
                icon: guardian.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-refresh',
                command: () => {
                    this.closeGuardianActionsMenu();
                    const updated = this.playerService.toggleGuardianStatus(guardian.id);
                    this.loadGuardians();
                    if (updated) {
                        this.messageService.add({
                            severity: 'info',
                            summary: updated.status === 'ACTIVE' ? 'Acudiente reactivado' : 'Acudiente desactivado',
                            detail: updated.status === 'ACTIVE' ? 'El acudiente volvió a quedar disponible.' : 'El acudiente dejó de estar disponible en la operación.'
                        });
                    }
                }
            }
        ];

        this.guardianActionsMenu?.toggle(event);
    }

    guardianFullName(guardian: Guardian) {
        return `${guardian.firstName} ${guardian.lastName}`.trim();
    }

    getStatusLabel(status: Guardian['status']) {
        return status === 'ACTIVE' ? 'Activo' : 'Inactivo';
    }

    getStatusSeverity(status: Guardian['status']): 'success' | 'danger' {
        return status === 'ACTIVE' ? 'success' : 'danger';
    }

    private loadGuardians() {
        this.guardians = this.playerService.listGuardians();
    }

    private closeGuardianActionsMenu() {
        this.guardianActionsMenu?.hide();
        this.closeDetachedGuardianMenus();
    }

    private closeDetachedGuardianMenus() {
        this.document.querySelectorAll('.p-menu-overlay').forEach((element) => {
            element.remove();
        });
    }
}
