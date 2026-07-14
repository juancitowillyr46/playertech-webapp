import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Menu } from 'primeng/menu';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { PlayerManagementService } from '../data-access/player-management.service';
import { Player } from '../models/player.model';
import { Subscription } from 'rxjs';
import { inject } from '@angular/core';

@Component({
    selector: 'app-players-list-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule, MenuModule, PageHeader, RouterModule, TableModule, TagModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
        <p-menu #playerActionsMenu [popup]="true" appendTo="body" [model]="playerActionItems"></p-menu>

        <div class="space-y-4">
            <app-page-header [breadcrumbs]="breadcrumbs" title="Jugadores" subtitle="Consulta el plantel y entra al detalle de cada jugador desde un solo lugar."></app-page-header>

            <div class="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Total</p>
                    <p class="mt-4 text-3xl font-semibold text-surface-900 dark:text-surface-0">{{ players.length }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Activos</p>
                    <p class="mt-4 text-3xl font-semibold text-emerald-600">{{ activePlayersCount }}</p>
                </div>
                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Inactivos</p>
                    <p class="mt-4 text-3xl font-semibold text-rose-600">{{ inactivePlayersCount }}</p>
                </div>
            </div>

            <div class="content-width-full mx-auto w-full overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <p-iconfield iconPosition="left" class="w-full lg:max-w-md">
                            <p-inputicon styleClass="pi pi-search" />
                            <input pInputText type="text" [(ngModel)]="search" placeholder="Buscar jugador por nombre o documento" class="w-full" />
                        </p-iconfield>

                        <div class="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">
                            <p-button label="Nuevo jugador" icon="pi pi-plus" styleClass="w-full md:min-w-[11.5rem] md:w-auto" routerLink="/players/new" />
                        </div>
                    </div>
                </div>

                <p-table [value]="filteredPlayers" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Jugador</th>
                            <th>Categoría</th>
                            <th>Documento</th>
                            <th>Edad</th>
                            <th>Estado</th>
                            <th class="text-right">Acciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-player>
                        <tr class="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-surface-800/70" (click)="openPlayer(player)">
                            <td>
                                <div class="flex items-center gap-3">
                                    <div class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-50 text-sm font-semibold text-sky-700">
                                        @if (player.photo?.url) {
                                            <img [src]="player.photo!.url" [alt]="getPlayerFullName(player)" class="h-full w-full object-cover" />
                                        } @else {
                                            {{ getInitials(player) }}
                                        }
                                    </div>
                                    <div class="min-w-0">
                                        <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ getPlayerFullName(player) }}</p>
                                        <p class="m-0 text-xs text-slate-500 dark:text-slate-400">Nacimiento: {{ formatBirthDate(player.birthDate) }}</p>
                                    </div>
                                </div>
                            </td>
                            <td>{{ player.categoryName }}</td>
                            <td>{{ player.documentNumber }}</td>
                            <td>{{ getAgeLabel(player.birthDate) }}</td>
                            <td><p-tag [value]="getStatusLabel(player.status)" [severity]="getStatusSeverity(player.status)" /></td>
                            <td>
                                <div class="flex justify-end gap-2" (click)="$event.stopPropagation()">
                                    <p-button label="Ver" severity="secondary" [outlined]="true" size="small" (onClick)="openPlayer(player)" />
                                    <p-button icon="pi pi-ellipsis-h" [text]="true" rounded severity="secondary" (onClick)="openPlayerActionsMenu($event, player)" />
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="6" class="py-10 text-center">
                                <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay jugadores registrados</span>
                                    <span>Crea el primer jugador para empezar a construir el plantel de la academia.</span>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `
})
export class PlayersListPage implements OnDestroy {
    @ViewChild('playerActionsMenu') playerActionsMenu?: Menu;
    private readonly document = inject(DOCUMENT);

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Jugadores' }];

    search = '';
    players: Player[] = [];
    selectedPlayer: Player | null = null;
    playerActionItems: MenuItem[] = [];
    private readonly routerEventsSubscription: Subscription;

    constructor(
        private readonly playerService: PlayerManagementService,
        private readonly router: Router,
        private readonly messageService: MessageService
    ) {
        this.players = this.playerService.listPlayers();
        this.routerEventsSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.closePlayerActionsMenu();
            }
        });
    }

    ngOnDestroy() {
        this.closePlayerActionsMenu();
        this.routerEventsSubscription.unsubscribe();
    }

    get filteredPlayers() {
        const term = this.search.trim().toLowerCase();
        if (!term) {
            return this.players;
        }

        return this.players.filter((player) => {
            const fullName = this.getPlayerFullName(player).toLowerCase();
            return fullName.includes(term) || player.documentNumber.toLowerCase().includes(term) || player.categoryName.toLowerCase().includes(term);
        });
    }

    get activePlayersCount() {
        return this.players.filter((player) => player.status === 'ACTIVE').length;
    }

    get inactivePlayersCount() {
        return this.players.filter((player) => player.status === 'INACTIVE').length;
    }

    openPlayer(player: Player) {
        this.closePlayerActionsMenu();
        this.router.navigate(['/players', player.id]);
    }

    openPlayerActionsMenu(event: Event, player: Player) {
        this.closeDetachedPlayerMenus();
        this.selectedPlayer = player;
        this.playerActionItems = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    this.closePlayerActionsMenu();
                    this.openPlayer(player);
                }
            },
            {
                label: player.status === 'ACTIVE' ? 'Desactivar' : 'Reactivar',
                icon: player.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-refresh',
                command: () => {
                    this.closePlayerActionsMenu();
                    const updated = this.playerService.togglePlayerStatus(player.id);
                    this.players = this.playerService.listPlayers();
                    if (updated) {
                        this.messageService.add({
                            severity: 'info',
                            summary: updated.status === 'ACTIVE' ? 'Jugador reactivado' : 'Jugador desactivado',
                            detail: updated.status === 'ACTIVE' ? 'El jugador volvió a quedar disponible.' : 'El jugador dejó de estar disponible en la operación.'
                        });
                    }
                }
            }
        ];

        this.playerActionsMenu?.toggle(event);
    }

    private closePlayerActionsMenu() {
        this.playerActionsMenu?.hide();
        this.closeDetachedPlayerMenus();
    }

    private closeDetachedPlayerMenus() {
        this.document.querySelectorAll('.p-menu-overlay').forEach((element) => {
            element.remove();
        });
    }

    getPlayerFullName(player: Player) {
        return `${player.firstName} ${player.lastName}`.trim();
    }

    getInitials(player: Player) {
        return `${player.firstName.charAt(0)}${player.lastName.charAt(0)}`.toUpperCase();
    }

    getStatusLabel(status: Player['status']) {
        return status === 'ACTIVE' ? 'Activo' : 'Inactivo';
    }

    getStatusSeverity(status: Player['status']): 'success' | 'danger' {
        return status === 'ACTIVE' ? 'success' : 'danger';
    }

    formatBirthDate(value: string) {
        return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
    }

    getAgeLabel(value: string) {
        const birth = new Date(`${value}T00:00:00`);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return `${age} años`;
    }
}
