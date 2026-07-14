import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { PlayerManagementService } from '@/app/features/players/data-access/player-management.service';
import { Guardian, GuardianLinkedPlayer } from '@/app/features/players/models/player.model';

@Component({
    selector: 'app-guardian-detail-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, PageHeader, RouterModule, TableModule, TagModule],
    template: `
        @if (guardian) {
            <div class="space-y-4">
                <app-page-header [breadcrumbs]="breadcrumbs" [title]="guardianFullName" subtitle="Consulta los datos del acudiente y revisa con qué jugadores está relacionado."></app-page-header>

                <div class="content-width-compact mx-auto mt-4 w-full space-y-3">
                    <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                        <div class="space-y-4 p-3 sm:p-4">
                            <div class="form-width-2col mx-auto space-y-4">
                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12">
                                        <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Detalle del acudiente</p>
                                        <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Verifica los datos de contacto y el parentesco registrado.</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Nombres</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ guardian.firstName }}</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Apellidos</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ guardian.lastName }}</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Correo</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ guardian.email }}</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Teléfono</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ guardian.phone }}</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Parentesco</p>
                                        <div class="mt-1"><p-tag [value]="guardian.relationship" severity="info" /></div>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Estado</p>
                                        <div class="mt-1"><p-tag [value]="guardian.status === 'ACTIVE' ? 'Activo' : 'Inactivo'" [severity]="guardian.status === 'ACTIVE' ? 'success' : 'danger'" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="border-t border-slate-200 p-4 dark:border-surface-800">
                            <div class="form-width-2col mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                <p-button label="Volver" severity="secondary" text styleClass="w-full sm:w-auto" routerLink="/guardians" />
                                <p-button label="Editar acudiente" icon="pi pi-pencil" styleClass="w-full sm:w-auto" [routerLink]="['/guardians', guardian.id, 'edit']" />
                            </div>
                        </div>
                    </div>

                    <div class="content-width-full mx-auto w-full overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                        <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                            <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Jugadores relacionados</p>
                            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Revisa en qué jugadores participa este acudiente y si figura como contacto principal.</p>
                        </div>

                        <p-table [value]="linkedPlayers" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Jugador</th>
                                    <th>Categoría</th>
                                    <th>Relación</th>
                                    <th>Estado</th>
                                    <th class="text-right">Acciones</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-player>
                                <tr>
                                    <td>{{ player.fullName }}</td>
                                    <td>{{ player.categoryName }}</td>
                                    <td>
                                        @if (player.isPrimary) {
                                            <p-tag value="Principal" severity="success" />
                                        } @else {
                                            <span class="text-sm text-slate-500 dark:text-slate-400">Contacto de apoyo</span>
                                        }
                                    </td>
                                    <td><p-tag [value]="player.status === 'ACTIVE' ? 'Activo' : 'Inactivo'" [severity]="player.status === 'ACTIVE' ? 'success' : 'danger'" /></td>
                                    <td class="text-right">
                                        <p-button label="Ver jugador" severity="secondary" [outlined]="true" size="small" [routerLink]="['/players', player.playerId]" />
                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="5" class="py-10 text-center">
                                        <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay jugadores vinculados</span>
                                            <span>Este acudiente aún no figura relacionado con jugadores en esta iteración mock.</span>
                                        </div>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>
            </div>
        } @else {
            <div class="rounded-[0.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Acudiente no encontrado</p>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">No encontramos el registro solicitado en esta iteración mock.</p>
                <div class="mt-4">
                    <p-button label="Volver al listado" routerLink="/guardians" />
                </div>
            </div>
        }
    `
})
export class GuardianDetailPage {
    guardian: Guardian | null = null;
    linkedPlayers: GuardianLinkedPlayer[] = [];
    breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Acudientes', routerLink: '/guardians' }, { label: 'Detalle' }];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly playerService: PlayerManagementService
    ) {
        const guardianId = this.route.snapshot.paramMap.get('id');
        if (!guardianId) {
            return;
        }

        this.guardian = this.playerService.getGuardianById(guardianId);
        if (!this.guardian) {
            return;
        }

        this.linkedPlayers = this.playerService.listGuardianPlayers(guardianId);
        this.breadcrumbs = [{ label: 'Inicio', routerLink: '/' }, { label: 'Acudientes', routerLink: '/guardians' }, { label: `${this.guardian.firstName} ${this.guardian.lastName}`.trim() }];
    }

    get guardianFullName() {
        return this.guardian ? `${this.guardian.firstName} ${this.guardian.lastName}`.trim() : 'Acudiente';
    }
}
