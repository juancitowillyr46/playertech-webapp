import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { PlayerManagementService } from '@/app/features/players/data-access/player-management.service';
import { Guardian, GuardianLinkedPlayer, Player } from '@/app/features/players/models/player.model';

@Component({
    selector: 'app-guardian-detail-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, FormsModule, MessageModule, PageHeader, RouterModule, SelectModule, TableModule, TagModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />

        @if (guardian) {
            <div class="space-y-4">
                <app-page-header [breadcrumbs]="breadcrumbs" [title]="guardianFullName" subtitle="Consulta la identificación, el parentesco y los jugadores relacionados con este acudiente."></app-page-header>

                <div class="content-width-compact mx-auto mt-4 w-full space-y-3">
                    <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                        <div class="space-y-4 p-3 sm:p-4">
                            <div class="form-width-2col mx-auto space-y-4">
                                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    <div class="rounded-[0.85rem] border border-slate-200 bg-slate-50 p-3 dark:border-surface-700 dark:bg-surface-900/60">
                                        <p class="m-0 text-xs font-medium text-slate-500 dark:text-slate-400">Documento</p>
                                        <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0">{{ getDocumentTypeLabel(guardian.documentType) }} · {{ guardian.documentNumber || 'No configurado' }}</p>
                                    </div>
                                    <div class="rounded-[0.85rem] border border-slate-200 bg-slate-50 p-3 dark:border-surface-700 dark:bg-surface-900/60">
                                        <p class="m-0 text-xs font-medium text-slate-500 dark:text-slate-400">Parentesco</p>
                                        <div class="mt-2">
                                            <p-tag [value]="guardian.relationship" severity="info" />
                                        </div>
                                    </div>
                                    <div class="rounded-[0.85rem] border border-slate-200 bg-slate-50 p-3 dark:border-surface-700 dark:bg-surface-900/60">
                                        <p class="m-0 text-xs font-medium text-slate-500 dark:text-slate-400">Estado</p>
                                        <div class="mt-2">
                                            <p-tag [value]="guardian.status === 'ACTIVE' ? 'Activo' : 'Inactivo'" [severity]="guardian.status === 'ACTIVE' ? 'success' : 'danger'" />
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-12">
                                        <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Detalle del acudiente</p>
                                        <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Verifica la identificación, el parentesco y los datos de contacto registrados.</p>
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
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Tipo de documento</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ getDocumentTypeLabel(guardian.documentType) }}</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Número de documento</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ guardian.documentNumber || 'No configurado' }}</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Correo</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ guardian.email || 'No configurado' }}</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Teléfono</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ guardian.phone || 'No configurado' }}</p>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Parentesco</p>
                                        <div class="mt-1"><p-tag [value]="guardian.relationship" severity="info" /></div>
                                    </div>

                                    <div class="col-span-12 md:col-span-6">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Estado</p>
                                        <div class="mt-1"><p-tag [value]="guardian.status === 'ACTIVE' ? 'Activo' : 'Inactivo'" [severity]="guardian.status === 'ACTIVE' ? 'success' : 'danger'" /></div>
                                    </div>

                                    <div class="col-span-12">
                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Dirección</p>
                                        <p class="mt-1 text-base text-surface-900 dark:text-surface-0">{{ guardian.address || 'No configurado' }}</p>
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
                            <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Jugadores relacionados</p>
                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Revisa en qué jugadores participa este acudiente y si hoy figura como contacto principal.</p>
                                </div>

                                <div class="flex w-full flex-col gap-2 xl:w-auto xl:flex-row xl:justify-end">
                                    <p-button label="Asociar jugador" icon="pi pi-link" severity="secondary" [outlined]="true" styleClass="w-full xl:min-w-[11.5rem]" (onClick)="openAssociatePlayerDialog()" />
                                </div>
                            </div>
                        </div>

                        <div class="space-y-3 p-3 sm:hidden">
                            @if (linkedPlayers.length) {
                                @for (player of linkedPlayers; track player.playerId) {
                                    <div class="rounded-[0.85rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900">
                                        <div class="flex items-start justify-between gap-3">
                                            <div class="min-w-0 space-y-1">
                                                <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">{{ player.fullName }}</p>
                                                <p class="m-0 text-xs leading-5 text-slate-500 dark:text-slate-400">{{ player.categoryName }}</p>
                                            </div>
                                            @if (player.isPrimary) {
                                                <p-tag value="Principal" severity="success" />
                                            }
                                        </div>

                                        <div class="mt-3 grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Relación</p>
                                                <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ player.isPrimary ? 'Contacto principal' : 'Contacto de apoyo' }}</p>
                                            </div>
                                            <div>
                                                <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Estado</p>
                                                <div class="mt-1">
                                                    <p-tag [value]="player.status === 'ACTIVE' ? 'Activo' : 'Inactivo'" [severity]="player.status === 'ACTIVE' ? 'success' : 'danger'" />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mt-3 flex flex-col gap-2">
                                            @if (!player.isPrimary) {
                                                <p-button label="Marcar principal" severity="secondary" [outlined]="true" styleClass="w-full" (onClick)="markAsPrimary(player)" />
                                            }
                                            <div class="grid grid-cols-2 gap-2">
                                                <p-button label="Quitar" severity="secondary" text styleClass="w-full" (onClick)="removeRelation(player)" />
                                                <p-button label="Ver jugador" severity="secondary" [outlined]="true" styleClass="w-full" [routerLink]="['/players', player.playerId]" />
                                            </div>
                                        </div>
                                    </div>
                                }
                            } @else {
                                <div class="py-8 text-center">
                                    <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay jugadores vinculados</span>
                                        <span>Asocia el primer jugador desde esta misma sección.</span>
                                    </div>
                                </div>
                            }
                        </div>

                        <div class="hidden sm:block">
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
                                    <td>
                                        <div class="flex justify-end gap-2">
                                            @if (!player.isPrimary) {
                                                <p-button label="Marcar principal" severity="secondary" [outlined]="true" size="small" (onClick)="markAsPrimary(player)" />
                                            }
                                            <p-button label="Quitar" severity="secondary" text size="small" (onClick)="removeRelation(player)" />
                                            <p-button label="Ver jugador" severity="secondary" [outlined]="true" size="small" [routerLink]="['/players', player.playerId]" />
                                        </div>
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
            </div>

            <p-dialog [(visible)]="showAssociatePlayerDialog" header="Asociar jugador" [modal]="true" [draggable]="false" [resizable]="false" [dismissableMask]="true" [breakpoints]="{ '960px': '92vw' }" [style]="{ width: '32rem' }">
                <div class="space-y-4 pb-1">
                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Selecciona un jugador disponible para vincularlo con este acudiente.</p>

                    <div class="flex flex-col gap-2">
                        <label for="playerId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Jugador <span class="text-rose-500">*</span></label>
                        <p-select
                            id="playerId"
                            [(ngModel)]="selectedPlayerId"
                            [options]="availablePlayerOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Selecciona un jugador"
                            class="w-full"
                            appendTo="body"
                            [filter]="true"
                            filterBy="label,categoryName"
                            [scrollHeight]="'16rem'"
                        >
                            <ng-template let-option #item>
                                <div class="flex items-center justify-between gap-3">
                                    <span>{{ option.label }}</span>
                                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ option.categoryName }}</span>
                                </div>
                            </ng-template>
                        </p-select>
                        @if (associateSubmitted && !selectedPlayerId) {
                            <p-message severity="error" size="small">Selecciona un jugador para continuar.</p-message>
                        }
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="showAssociatePlayerDialog = false" />
                        <p-button label="Asociar jugador" styleClass="w-full sm:w-auto" (onClick)="associatePlayer()" />
                    </div>
                </ng-template>
            </p-dialog>
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
    availablePlayers: Player[] = [];
    selectedPlayerId = '';
    showAssociatePlayerDialog = false;
    associateSubmitted = false;
    breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Acudientes', routerLink: '/guardians' }, { label: 'Detalle' }];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly playerService: PlayerManagementService,
        private readonly messageService: MessageService
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
        this.availablePlayers = this.playerService.listAvailablePlayersForGuardian(guardianId);
        this.breadcrumbs = [{ label: 'Inicio', routerLink: '/' }, { label: 'Acudientes', routerLink: '/guardians' }, { label: `${this.guardian.firstName} ${this.guardian.lastName}`.trim() }];
    }

    get guardianFullName() {
        return this.guardian ? `${this.guardian.firstName} ${this.guardian.lastName}`.trim() : 'Acudiente';
    }

    getDocumentTypeLabel(value: string) {
        const labels: Record<string, string> = {
            CC: 'Cédula de ciudadanía',
            TI: 'Tarjeta de identidad',
            CE: 'Cédula de extranjería',
            PASAPORTE: 'Pasaporte'
        };

        return (labels[value] ?? value) || 'No configurado';
    }

    get availablePlayerOptions() {
        return this.availablePlayers.map((player) => ({
            value: player.id,
            label: `${player.firstName} ${player.lastName}`.trim(),
            categoryName: player.categoryName
        }));
    }

    openAssociatePlayerDialog() {
        this.associateSubmitted = false;
        this.selectedPlayerId = '';
        this.showAssociatePlayerDialog = true;
    }

    associatePlayer() {
        if (!this.guardian) {
            return;
        }

        this.associateSubmitted = true;
        if (!this.selectedPlayerId) {
            return;
        }

        const relation = this.playerService.associateExistingGuardian(this.selectedPlayerId, this.guardian.id);
        if (!relation) {
            return;
        }

        this.refreshRelations();
        this.showAssociatePlayerDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Jugador asociado', detail: 'El acudiente quedó vinculado correctamente al jugador.' });
    }

    markAsPrimary(player: GuardianLinkedPlayer) {
        if (!this.guardian) {
            return;
        }

        this.playerService.markPrimaryGuardian(player.playerId, this.guardian.id);
        this.refreshRelations();
        this.messageService.add({ severity: 'success', summary: 'Relación actualizada', detail: 'Este acudiente quedó como contacto principal del jugador.' });
    }

    removeRelation(player: GuardianLinkedPlayer) {
        if (!this.guardian) {
            return;
        }

        const result = this.playerService.removeGuardianRelation(player.playerId, this.guardian.id);
        if (!result.ok) {
            this.messageService.add({ severity: 'warn', summary: 'No se puede quitar', detail: 'Primero define otro acudiente principal antes de quitar esta relación.' });
            return;
        }

        this.refreshRelations();
        this.messageService.add({ severity: 'success', summary: 'Relación eliminada', detail: 'El acudiente dejó de estar vinculado con ese jugador.' });
    }

    private refreshRelations() {
        if (!this.guardian) {
            return;
        }

        this.linkedPlayers = this.playerService.listGuardianPlayers(this.guardian.id);
        this.availablePlayers = this.playerService.listAvailablePlayersForGuardian(this.guardian.id);
    }
}
