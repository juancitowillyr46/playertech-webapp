import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ImageCropperComponent, ImageCropperFileError, ImageCropperResult } from '@/app/shared/ui/image-cropper/image-cropper';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { PlayerManagementService } from '../data-access/player-management.service';
import { CategoryOption, Guardian, GuardianForm, Player, PlayerForm, PlayerGuardianRelation, PlayerPhoto } from '../models/player.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-player-detail-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, FormsModule, IconFieldModule, ImageCropperComponent, InputIconModule, InputTextModule, MenuModule, MessageModule, PageHeader, RouterModule, SelectModule, TableModule, TabsModule, TagModule, ToastModule],
    providers: [MessageService],
    styles: [
        `
            :host ::ng-deep .player-dialog .p-dialog-footer {
                border-top: 0;
                padding-top: 0;
            }

            :host ::ng-deep .player-dialog .p-dialog-content {
                padding-bottom: 1rem;
            }

            :host ::ng-deep .guardian-relation-tag .p-tag {
                font-size: 0.78rem;
                font-weight: 600;
            }

            :host ::ng-deep .guardian-primary-tag .p-tag {
                font-size: 0.72rem;
                font-weight: 600;
            }
        `
    ],
    template: `
        <p-toast />

        <app-image-cropper
            #playerPhotoCropper
            title="Ajustar foto del jugador"
            subtitle="Revisa el encuadre antes de guardar la foto del jugador."
            [maxFileSizeMb]="3"
            [allowedFileExtensions]="['png', 'jpg', 'jpeg', 'svg']"
            (applied)="onPhotoApplied($event)"
            (fileError)="onPhotoFileError($event)"
        />

        @if (player) {
            <div class="space-y-4">
                <app-page-header [breadcrumbs]="breadcrumbs" [title]="playerFullName" subtitle="Actualiza los datos del jugador y administra sus acudientes desde un solo lugar."></app-page-header>

                <div class="content-width-compact mx-auto mt-4 w-full space-y-3">
                    <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                        <p-tabs [value]="activeTab">
                            <p-tablist class="overflow-x-auto">
                                <p-tab value="information" (click)="activeTab = 'information'">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-user text-sm"></i>
                                        <span>Información</span>
                                    </span>
                                </p-tab>
                                <p-tab value="guardians" (click)="activeTab = 'guardians'">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-users text-sm"></i>
                                        <span>Acudientes</span>
                                    </span>
                                </p-tab>
                            </p-tablist>

                            <p-tabpanels>
                                <p-tabpanel value="information">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="form-width-2col mx-auto space-y-4">
                                            <div class="grid grid-cols-12 gap-4">
                                                <div class="col-span-12">
                                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Información del jugador</p>
                                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Mantén actualizados los datos personales, la categoría y la foto del jugador.</p>
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="firstName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombres <span class="text-rose-500">*</span></label>
                                                    <input pInputText id="firstName" type="text" [(ngModel)]="form.firstName" placeholder="Ej. Juan" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onNameInput('firstName', $event)" />
                                                    @if (showError('firstName')) {
                                                        <p-message severity="error" size="small">Ingresa los nombres del jugador.</p-message>
                                                    }
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="lastName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Apellidos <span class="text-rose-500">*</span></label>
                                                    <input pInputText id="lastName" type="text" [(ngModel)]="form.lastName" placeholder="Ej. Pérez" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onNameInput('lastName', $event)" />
                                                    @if (showError('lastName')) {
                                                        <p-message severity="error" size="small">Ingresa los apellidos del jugador.</p-message>
                                                    }
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="birthDate" class="text-sm font-medium text-surface-700 dark:text-surface-200">Fecha de nacimiento <span class="text-rose-500">*</span></label>
                                                    <input pInputText id="birthDate" type="date" [(ngModel)]="form.birthDate" class="w-full" />
                                                    @if (showError('birthDate')) {
                                                        <p-message severity="error" size="small">Selecciona la fecha de nacimiento.</p-message>
                                                    }
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="documentNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Documento <span class="text-rose-500">*</span></label>
                                                    <input pInputText id="documentNumber" type="text" [(ngModel)]="form.documentNumber" placeholder="Ej. 12345678" class="w-full" (input)="onDocumentInput($event)" />
                                                    @if (showError('documentNumber')) {
                                                        <p-message severity="error" size="small">Ingresa el documento del jugador.</p-message>
                                                    }
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="categoryId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Categoría <span class="text-rose-500">*</span></label>
                                                    <p-select id="categoryId" [(ngModel)]="form.categoryId" [options]="categories" optionLabel="name" optionValue="id" placeholder="Selecciona una categoría" class="w-full" />
                                                    @if (showError('categoryId')) {
                                                        <p-message severity="error" size="small">Selecciona la categoría del jugador.</p-message>
                                                    }
                                                </div>
                                            </div>

                                            <div class="rounded-[0.9rem] border border-slate-200 bg-slate-50 p-4 dark:border-surface-700 dark:bg-surface-900/60">
                                                <div class="flex flex-col gap-3">
                                                    <div>
                                                        <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Foto del jugador</p>
                                                        <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Elige una imagen clara y ajústala antes de guardar los cambios.</p>
                                                    </div>

                                                    <div class="rounded-[1rem] border border-dashed border-slate-300 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                                                        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                            <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50 text-2xl font-semibold text-sky-700 dark:border-surface-700 dark:bg-surface-800">
                                                                @if (photoPreviewUrl) {
                                                                    <img [src]="photoPreviewUrl" alt="Vista previa del jugador" class="h-full w-full object-cover" />
                                                                } @else {
                                                                    {{ playerInitials }}
                                                                }
                                                            </div>

                                                            <div class="min-w-0 flex-1 space-y-2">
                                                                <p class="m-0 text-sm font-medium text-surface-900 dark:text-surface-0">{{ photoFileName }}</p>
                                                                <p class="m-0 text-sm text-slate-500 dark:text-slate-400">Formatos recomendados: PNG o SVG.</p>
                                                                <p class="m-0 text-sm text-slate-500 dark:text-slate-400">Tamaño máximo: 3 MB.</p>
                                                                <div class="flex flex-col gap-2 sm:flex-row">
                                                                    <input #photoInput type="file" accept=".png,.jpg,.jpeg,.svg" class="hidden" (change)="onPhotoSelected($event)" />
                                                                    <p-button label="Seleccionar archivo" severity="secondary" [outlined]="true" styleClass="w-full sm:w-auto" (onClick)="photoInput.click()" />
                                                                    @if (photoPreviewUrl) {
                                                                        <p-button label="Quitar foto" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="removePhoto()" />
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="border-t border-slate-200 p-4 dark:border-surface-800">
                                        <div class="form-width-2col mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                            <p-button label="Volver" severity="secondary" text styleClass="w-full sm:w-auto" routerLink="/players" />
                                            <p-button label="Guardar cambios" icon="pi pi-check" styleClass="w-full sm:w-auto" (onClick)="savePlayer()" />
                                        </div>
                                    </div>
                                </p-tabpanel>

                                <p-tabpanel value="guardians">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-none dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                                            <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                <div>
                                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Acudientes</p>
                                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Administra los datos del acudiente principal y los contactos de apoyo del jugador.</p>
                                                </div>

                                                <div class="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">
                                                    <p-button label="Asociar acudiente" icon="pi pi-link" severity="secondary" [outlined]="true" styleClass="w-full md:min-w-[11.5rem] md:w-auto" (onClick)="openAssociateGuardianDialog()" />
                                                    <p-button label="Nuevo acudiente" icon="pi pi-plus" styleClass="w-full md:min-w-[11.5rem] md:w-auto" (onClick)="openCreateGuardianDialog()" />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                                            <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                    <p-iconfield iconPosition="left" class="w-full lg:max-w-md">
                                                        <p-inputicon styleClass="pi pi-search" />
                                                        <input pInputText type="text" [(ngModel)]="guardianSearch" placeholder="Buscar acudiente por nombre, correo o teléfono" class="w-full" />
                                                    </p-iconfield>
                                                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Identifica con claridad quién es el contacto principal del jugador.</p>
                                                </div>
                                            </div>

                                            <p-table [value]="filteredGuardians" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                                                <ng-template pTemplate="header">
                                                    <tr>
                                                        <th>Acudiente</th>
                                                        <th>Correo</th>
                                                        <th>Teléfono</th>
                                                        <th>Parentesco</th>
                                                        <th class="text-right">Acciones</th>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="body" let-relation>
                                                    <tr>
                                                        <td>
                                                            <div class="space-y-1">
                                                                <div class="flex flex-wrap items-center gap-2">
                                                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ guardianFullName(relation.guardian) }}</p>
                                                                    @if (relation.isPrimary) {
                                                                        <p-tag styleClass="guardian-primary-tag" value="Principal" severity="success" />
                                                                    }
                                                                </div>
                                                                <p class="m-0 text-xs text-slate-500 dark:text-slate-400">{{ relation.isPrimary ? 'Contacto principal del jugador' : 'Contacto de apoyo del jugador' }}</p>
                                                            </div>
                                                        </td>
                                                        <td>{{ relation.guardian.email }}</td>
                                                        <td>{{ relation.guardian.phone }}</td>
                                                        <td>
                                                            <p-tag styleClass="guardian-relation-tag" [value]="relation.kinship" severity="info" />
                                                        </td>
                                                        <td>
                                                            <div class="flex justify-end gap-2">
                                                                <p-menu #guardianActionsMenu [popup]="true" appendTo="body" [model]="guardianActionItems"></p-menu>
                                                                <p-button icon="pi pi-ellipsis-h" [text]="true" rounded severity="secondary" (onClick)="openGuardianActionsMenu($event, guardianActionsMenu, relation)" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="emptymessage">
                                                    <tr>
                                                        <td colspan="5" class="py-10 text-center">
                                                            <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                                <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay acudientes vinculados</span>
                                                                <span>Asocia un acudiente existente o crea uno nuevo desde esta misma sección.</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </ng-template>
                                            </p-table>
                                        </div>
                                    </div>
                                </p-tabpanel>
                            </p-tabpanels>
                        </p-tabs>
                    </div>
                </div>
            </div>

            <p-dialog [(visible)]="showAssociateGuardianDialog" [modal]="true" [draggable]="false" [resizable]="false" [dismissableMask]="true" [style]="{ width: 'min(40rem, calc(100vw - 2rem))' }" styleClass="player-dialog" header="Asociar acudiente">
                <div class="space-y-4">
                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Selecciona un acudiente ya registrado para relacionarlo con este jugador.</p>

                    <div class="flex flex-col gap-2">
                        <label for="guardianId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Acudiente <span class="text-rose-500">*</span></label>
                        <p-select id="guardianId" [(ngModel)]="selectedGuardianId" [options]="availableGuardians" optionLabel="fullName" optionValue="id" [filter]="true" filterBy="fullName,email,phone" placeholder="Selecciona un acudiente" class="w-full" appendTo="body" [scrollHeight]="'16rem'">
                            <ng-template #item let-option>
                                <div class="flex flex-col gap-1 py-1">
                                    <span class="font-medium text-surface-900 dark:text-surface-0">{{ option.fullName }}</span>
                                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ option.email }}</span>
                                </div>
                            </ng-template>
                        </p-select>
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="showAssociateGuardianDialog = false" />
                        <p-button label="Asociar" styleClass="w-full sm:w-auto" (onClick)="associateGuardian()" />
                    </div>
                </ng-template>
            </p-dialog>

            <p-dialog [(visible)]="showCreateGuardianDialog" [modal]="true" [draggable]="false" [resizable]="false" [dismissableMask]="true" [style]="{ width: 'min(46rem, calc(100vw - 2rem))' }" styleClass="player-dialog" header="Nuevo acudiente">
                <div class="space-y-4">
                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Registra el acudiente y déjalo asociado al jugador en una sola acción.</p>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="guardianFirstName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombres <span class="text-rose-500">*</span></label>
                            <input pInputText id="guardianFirstName" type="text" [(ngModel)]="guardianForm.firstName" placeholder="Ej. María" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onGuardianNameInput('firstName', $event)" />
                            @if (showGuardianError('firstName')) {
                                <p-message severity="error" size="small">Ingresa los nombres del acudiente.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="guardianLastName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Apellidos <span class="text-rose-500">*</span></label>
                            <input pInputText id="guardianLastName" type="text" [(ngModel)]="guardianForm.lastName" placeholder="Ej. Pérez" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onGuardianNameInput('lastName', $event)" />
                            @if (showGuardianError('lastName')) {
                                <p-message severity="error" size="small">Ingresa los apellidos del acudiente.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="guardianPhone" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono <span class="text-rose-500">*</span></label>
                            <input pInputText id="guardianPhone" type="text" [(ngModel)]="guardianForm.phone" placeholder="Ej. +57 312 555 0021" class="w-full" (input)="onGuardianPhoneInput($event)" />
                            @if (showGuardianError('phone')) {
                                <p-message severity="error" size="small">Ingresa un teléfono válido.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="guardianEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo <span class="text-rose-500">*</span></label>
                            <input pInputText id="guardianEmail" type="text" [(ngModel)]="guardianForm.email" placeholder="Ej. maria.perez@correo.com" class="w-full" (keydown)="onEmailKeydown($event)" (paste)="onEmailPaste($event)" (input)="onGuardianEmailInput($event)" />
                            @if (showGuardianError('email')) {
                                <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                            }
                        </div>
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="showCreateGuardianDialog = false" />
                        <p-button label="Guardar" styleClass="w-full sm:w-auto" (onClick)="createGuardianAndAssociate()" />
                    </div>
                </ng-template>
            </p-dialog>
        } @else {
            <div class="rounded-[0.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Jugador no encontrado</p>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">No encontramos el registro solicitado en esta iteración mock.</p>
                <div class="mt-4">
                    <p-button label="Volver al listado" routerLink="/players" />
                </div>
            </div>
        }
    `
})
export class PlayerDetailPage implements OnDestroy {
    @ViewChild('playerPhotoCropper') playerPhotoCropper?: ImageCropperComponent;
    @ViewChild('guardianActionsMenu') guardianActionsMenu?: Menu;
    private readonly document = inject(DOCUMENT);

    breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Jugadores', routerLink: '/players' }, { label: 'Detalle' }];
    activeTab: 'information' | 'guardians' = 'information';
    submitted = false;
    guardianSubmitted = false;
    player: Player | null = null;
    form: PlayerForm = this.emptyForm();
    categories: CategoryOption[] = [];
    relations: PlayerGuardianRelation[] = [];
    guardians: Guardian[] = [];
    guardianSearch = '';
    selectedGuardianId = '';
    showAssociateGuardianDialog = false;
    showCreateGuardianDialog = false;
    guardianForm: GuardianForm = this.emptyGuardianForm();
    guardianActionItems: MenuItem[] = [];
    photoPreviewUrl: string | null = null;
    photoFileName = 'Sin imagen seleccionada';
    photoBlob: Blob | null = null;
    private readonly routerEventsSubscription: Subscription;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly playerService: PlayerManagementService,
        private readonly messageService: MessageService
    ) {
        this.categories = this.playerService.listCategories();
        this.guardians = this.playerService.listGuardians();
        this.loadPlayer();
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

    get playerFullName() {
        return this.player ? `${this.player.firstName} ${this.player.lastName}`.trim() : 'Jugador';
    }

    get playerInitials() {
        const source = this.playerFullName || 'JP';
        return source
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((value) => value.charAt(0).toUpperCase())
            .join('');
    }

    get filteredGuardians() {
        const term = this.guardianSearch.trim().toLowerCase();
        if (!term) {
            return this.relations;
        }

        return this.relations.filter((relation) => {
            const fullName = this.guardianFullName(relation.guardian).toLowerCase();
            return fullName.includes(term) || relation.guardian.email.toLowerCase().includes(term) || relation.guardian.phone.toLowerCase().includes(term);
        });
    }

    get availableGuardians() {
        const linkedIds = new Set(this.relations.map((relation) => relation.guardian.id));
        return this.guardians
            .filter((guardian) => !linkedIds.has(guardian.id))
            .map((guardian) => ({
                ...guardian,
                fullName: this.guardianFullName(guardian)
            }));
    }

    savePlayer() {
        if (!this.player) {
            return;
        }

        this.submitted = true;
        if (!this.isFormValid()) {
            this.messageService.add({ severity: 'warn', summary: 'Revisa el jugador', detail: 'Completa los campos obligatorios antes de guardar.' });
            return;
        }

        const photo = this.photoBlob && this.photoPreviewUrl ? this.buildPhotoPayload(this.photoBlob, this.photoPreviewUrl, this.photoFileName) : this.player.photo;
        const updated = this.playerService.updatePlayer(this.player.id, this.form, photo ?? null);
        if (!updated) {
            return;
        }

        this.player = updated;
        this.photoPreviewUrl = updated.photo?.url ?? null;
        this.photoFileName = updated.photo?.path?.split('/').pop() ?? 'Sin imagen seleccionada';

        this.messageService.add({ severity: 'success', summary: 'Jugador actualizado', detail: 'Los cambios del jugador quedaron guardados en esta iteración mock.' });
    }

    showError(field: keyof PlayerForm) {
        return this.submitted && !this.isFieldValid(field);
    }

    openAssociateGuardianDialog() {
        this.selectedGuardianId = '';
        this.showAssociateGuardianDialog = true;
    }

    associateGuardian() {
        if (!this.player || !this.selectedGuardianId) {
            this.messageService.add({ severity: 'warn', summary: 'Selecciona un acudiente', detail: 'Elige un acudiente existente antes de asociarlo.' });
            return;
        }

        const relation = this.playerService.associateExistingGuardian(this.player.id, this.selectedGuardianId);
        if (!relation) {
            return;
        }

        this.loadRelations();
        this.guardians = this.playerService.listGuardians();
        this.showAssociateGuardianDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Acudiente asociado', detail: 'El acudiente quedó vinculado al jugador.' });
    }

    openCreateGuardianDialog() {
        this.guardianSubmitted = false;
        this.guardianForm = this.emptyGuardianForm();
        this.showCreateGuardianDialog = true;
    }

    createGuardianAndAssociate() {
        if (!this.player) {
            return;
        }

        this.guardianSubmitted = true;
        if (!this.isGuardianFormValid()) {
            this.messageService.add({ severity: 'warn', summary: 'Revisa el acudiente', detail: 'Completa los campos obligatorios antes de guardar.' });
            return;
        }

        this.playerService.createGuardianAndAssociate(this.player.id, this.guardianForm);
        this.guardians = this.playerService.listGuardians();
        this.loadRelations();
        this.showCreateGuardianDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Acudiente creado', detail: 'El acudiente quedó creado y asociado al jugador.' });
    }

    openGuardianActionsMenu(event: Event, menu: Menu, relation: PlayerGuardianRelation) {
        this.closeDetachedGuardianMenus();
        this.guardianActionItems = [
            ...(relation.isPrimary
                ? []
                : [
                      {
                          label: 'Marcar principal',
                          icon: 'pi pi-star',
                          command: () => {
                              this.closeGuardianActionsMenu();
                              this.markPrimaryGuardian(relation);
                          }
                      }
                  ]),
            {
                label: 'Quitar acudiente',
                icon: 'pi pi-trash',
                command: () => {
                    this.closeGuardianActionsMenu();
                    this.removeGuardianRelation(relation);
                }
            }
        ];

        menu.toggle(event);
    }

    markPrimaryGuardian(relation: PlayerGuardianRelation) {
        if (!this.player) {
            return;
        }

        this.playerService.markPrimaryGuardian(this.player.id, relation.guardian.id);
        this.loadRelations();
        this.messageService.add({ severity: 'success', summary: 'Principal actualizado', detail: 'El acudiente principal del jugador fue actualizado.' });
    }

    removeGuardianRelation(relation: PlayerGuardianRelation) {
        if (!this.player) {
            return;
        }

        const result = this.playerService.removeGuardianRelation(this.player.id, relation.guardian.id);
        if (!result.ok) {
            this.messageService.add({ severity: 'warn', summary: 'No se puede quitar', detail: 'Primero define otro acudiente principal antes de quitar este vínculo.' });
            return;
        }

        this.loadRelations();
        this.messageService.add({ severity: 'success', summary: 'Acudiente retirado', detail: 'La relación con el jugador fue eliminada.' });
    }

    guardianFullName(guardian: Guardian) {
        return `${guardian.firstName} ${guardian.lastName}`.trim();
    }

    showGuardianError(field: keyof GuardianForm) {
        return this.guardianSubmitted && !this.isGuardianFieldValid(field);
    }

    onNameInput(field: 'firstName' | 'lastName', event: Event) {
        const input = event.target as HTMLInputElement;
        this.form[field] = this.sanitizeNameInput(input.value);
        input.value = this.form[field];
    }

    onDocumentInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.form.documentNumber = input.value.replace(/[^\d]/g, '');
        input.value = this.form.documentNumber;
    }

    onGuardianNameInput(field: 'firstName' | 'lastName', event: Event) {
        const input = event.target as HTMLInputElement;
        this.guardianForm[field] = this.sanitizeNameInput(input.value);
        input.value = this.guardianForm[field];
    }

    onGuardianPhoneInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.guardianForm.phone = input.value.replace(/[^\d\s()+-]/g, '');
        input.value = this.guardianForm.phone;
    }

    onGuardianEmailInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.guardianForm.email = this.sanitizeEmailInput(input.value);
        input.value = this.guardianForm.email;
    }

    onPhotoSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) {
            return;
        }

        this.playerPhotoCropper?.openWithFile(file);
        input.value = '';
    }

    onPhotoApplied(result: ImageCropperResult) {
        this.photoBlob = result.blob;
        this.photoPreviewUrl = result.dataUrl;
        this.photoFileName = result.fileName;
        this.messageService.add({ severity: 'success', summary: 'Foto lista', detail: 'La foto del jugador quedó ajustada para guardarse con el formulario.' });
    }

    onPhotoFileError(error: ImageCropperFileError) {
        this.messageService.add({
            severity: 'warn',
            summary: error.reason === 'file-too-large' ? 'Archivo muy grande' : 'Formato no permitido',
            detail: error.reason === 'file-too-large' ? `Selecciona una imagen de hasta ${error.maxFileSizeMb} MB.` : `Selecciona una imagen en formato ${error.allowedFileExtensions.map((item) => item.toUpperCase()).join(', ')}.`
        });
    }

    removePhoto() {
        this.photoBlob = null;
        this.photoPreviewUrl = null;
        this.photoFileName = 'Sin imagen seleccionada';
    }

    onRestrictedNameKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event)) {
            return;
        }

        if (!/^[\p{L}\p{N}\s]$/u.test(event.key)) {
            event.preventDefault();
        }
    }

    onRestrictedNamePaste(event: ClipboardEvent) {
        const pasted = event.clipboardData?.getData('text') ?? '';
        if ([...pasted].some((character) => !/^[\p{L}\p{N}\s]$/u.test(character))) {
            event.preventDefault();
        }
    }

    onEmailKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event) || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        if (!/^[a-zA-Z0-9@._%+\-]$/.test(event.key)) {
            event.preventDefault();
        }
    }

    onEmailPaste(event: ClipboardEvent) {
        const pastedText = event.clipboardData?.getData('text') ?? '';
        if (pastedText !== this.sanitizeEmailInput(pastedText)) {
            event.preventDefault();
        }
    }

    private loadPlayer() {
        const playerId = this.route.snapshot.paramMap.get('id');
        if (!playerId) {
            this.player = null;
            return;
        }

        const player = this.playerService.getPlayerById(playerId);
        this.player = player;
        if (!player) {
            return;
        }

        this.breadcrumbs = [{ label: 'Inicio', routerLink: '/' }, { label: 'Jugadores', routerLink: '/players' }, { label: `${player.firstName} ${player.lastName}`.trim() }];
        this.form = {
            firstName: player.firstName,
            lastName: player.lastName,
            birthDate: player.birthDate,
            documentNumber: player.documentNumber,
            categoryId: player.categoryId
        };
        this.photoPreviewUrl = player.photo?.url ?? null;
        this.photoFileName = player.photo?.path?.split('/').pop() ?? 'Sin imagen seleccionada';
        this.photoBlob = null;
        this.loadRelations();
    }

    private loadRelations() {
        if (!this.player) {
            this.relations = [];
            return;
        }

        this.relations = this.playerService.listPlayerGuardians(this.player.id);
    }

    private emptyForm(): PlayerForm {
        return { firstName: '', lastName: '', birthDate: '', documentNumber: '', categoryId: '' };
    }

    private emptyGuardianForm(): GuardianForm {
        return { firstName: '', lastName: '', phone: '', email: '' };
    }

    private isFormValid() {
        return ['firstName', 'lastName', 'birthDate', 'documentNumber', 'categoryId'].every((field) => this.isFieldValid(field as keyof PlayerForm));
    }

    private isFieldValid(field: keyof PlayerForm) {
        switch (field) {
            case 'firstName':
            case 'lastName':
                return this.hasValidText(this.form[field], 2);
            case 'birthDate':
                return !!this.form.birthDate;
            case 'documentNumber':
                return this.form.documentNumber.trim().length >= 6;
            case 'categoryId':
                return !!this.form.categoryId;
            default:
                return true;
        }
    }

    private isGuardianFormValid() {
        return ['firstName', 'lastName', 'phone', 'email'].every((field) => this.isGuardianFieldValid(field as keyof GuardianForm));
    }

    private isGuardianFieldValid(field: keyof GuardianForm) {
        switch (field) {
            case 'firstName':
            case 'lastName':
                return this.hasValidText(this.guardianForm[field], 2);
            case 'phone':
                return this.guardianForm.phone.replace(/\D/g, '').length >= 7;
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.guardianForm.email.trim());
            default:
                return true;
        }
    }

    private hasValidText(value: string, minLength: number) {
        const trimmed = value.trim();
        return trimmed.length >= minLength && /^[\p{L}\p{N}][\p{L}\p{N}\s]*$/u.test(trimmed);
    }

    private sanitizeNameInput(value: string) {
        return value.replace(/[^\p{L}\p{N}\s]/gu, '');
    }

    private sanitizeEmailInput(value: string) {
        return value.replace(/[^a-zA-Z0-9@._%+\-]/g, '').replace(/\s+/g, '');
    }

    private isAllowedEditingKey(event: KeyboardEvent) {
        return ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key);
    }

    private buildPhotoPayload(blob: Blob, url: string, fileName: string): PlayerPhoto {
        return {
            path: `mock/players/${fileName}`,
            url,
            mimeType: blob.type || 'image/png',
            size: blob.size,
            checksum: `mock:${Date.now()}`
        };
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
