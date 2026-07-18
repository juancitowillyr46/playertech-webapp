import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
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
import { TooltipModule } from 'primeng/tooltip';
import { ImageCropperComponent, ImageCropperFileError, ImageCropperResult } from '@/app/shared/ui/image-cropper/image-cropper';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { PlayerManagementService } from '../data-access/player-management.service';
import { CategoryOption, Guardian, GuardianForm, Player, PlayerChargeForm, PlayerForm, PlayerGuardianRelation, PlayerInitialCharge, PlayerMembership, PlayerMembershipHistoryItem, PlayerPhoto, PlayerTeamAssignment, PlayerTeamAssignmentForm, TeamOption } from '../models/player.model';
import { Subscription } from 'rxjs';

interface CountryOption {
    name: string;
    dialCode: string;
    flagFile: string;
}

@Component({
    selector: 'app-player-detail-page',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, CommonModule, DialogModule, FormsModule, IconFieldModule, ImageCropperComponent, InputIconModule, InputTextModule, MenuModule, MessageModule, PageHeader, RouterModule, SelectModule, TableModule, TabsModule, TagModule, ToastModule, TooltipModule],
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

            .membership-history {
                position: relative;
            }

            .membership-history-item {
                position: relative;
            }

            .membership-history-dot {
                position: relative;
                z-index: 1;
            }

            .membership-history-card {
                border-left-width: 4px;
                border-left-style: solid;
                transition:
                    transform 180ms ease,
                    box-shadow 180ms ease,
                    border-color 180ms ease;
            }

            .membership-history-card:hover {
                transform: translateY(-1px);
                box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
            }

            .membership-history-card-active {
                border-left-color: rgb(34 197 94);
            }

            .membership-history-card-suspended {
                border-left-color: rgb(245 158 11);
            }

            .membership-history-card-withdrawn {
                border-left-color: rgb(239 68 68);
            }

            :host ::ng-deep .player-detail-tablist {
                overflow-x: auto;
            }

            @media (max-width: 640px) {
                :host ::ng-deep .player-detail-tablist {
                    gap: 0;
                }

                :host ::ng-deep .player-detail-tablist .p-tab {
                    padding-inline: 0.65rem;
                    padding-block: 0.9rem;
                }

                :host ::ng-deep .player-detail-tablist .p-tab span {
                    font-size: 0.92rem;
                }

                :host ::ng-deep .player-detail-tablist .p-tabpanels {
                    overflow-x: hidden;
                }
            }
        `
    ],
    template: `
        <p-toast />
        <p-menu #teamActionsMenu [popup]="true" appendTo="body" [model]="teamActionItems"></p-menu>

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
                <app-page-header [breadcrumbs]="breadcrumbs" [title]="playerFullName" subtitle="Actualiza la información del jugador y administra acudientes, equipos, matrícula y cargos desde un solo lugar."></app-page-header>
                <div
                    class="mx-auto mt-4 w-full space-y-3"
                    [class.content-width-compact]="activeTab === 'information' || activeTab === 'guardians' || activeTab === 'teams' || activeTab === 'membership'"
                    [class.content-width-full]="activeTab === 'charges'"
                >
                    <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                        <p-tabs [value]="activeTab">
                            <p-tablist class="player-detail-tablist">
                                <p-tab value="information" (click)="activeTab = 'information'">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-user hidden text-sm sm:inline-block"></i>
                                        <span>Información</span>
                                    </span>
                                </p-tab>
                                <p-tab value="guardians" (click)="activeTab = 'guardians'">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-users hidden text-sm sm:inline-block"></i>
                                        <span>Acudientes</span>
                                    </span>
                                </p-tab>
                                <p-tab value="teams" (click)="activeTab = 'teams'">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-sitemap hidden text-sm sm:inline-block"></i>
                                        <span>Equipos</span>
                                    </span>
                                </p-tab>
                                <p-tab value="membership" (click)="activeTab = 'membership'">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-id-card hidden text-sm sm:inline-block"></i>
                                        <span>Matrícula</span>
                                    </span>
                                </p-tab>
                                <p-tab value="charges" (click)="activeTab = 'charges'">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-wallet hidden text-sm sm:inline-block"></i>
                                        <span>Cargos</span>
                                    </span>
                                </p-tab>
                            </p-tablist>

                            <p-tabpanels>
                                <p-tabpanel value="information">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="form-width-2col mx-auto space-y-4">
                                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Identidad</p>
                                                    <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0">{{ getDocumentLabel(player) }}</p>
                                                </div>
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Nacionalidad</p>
                                                    <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0">{{ player.nationality || 'No configurada' }}</p>
                                                </div>
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Género / Pie</p>
                                                    <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0">{{ player.gender || 'No configurado' }}</p>
                                                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ player.dominantFoot || 'Pie dominante no definido' }}</p>
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Correo</p>
                                                    <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0 break-all">{{ player.email || 'No configurado' }}</p>
                                                </div>
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Celular</p>
                                                    <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0">{{ getPhoneLabel(player) }}</p>
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-12 gap-4">
                                                <div class="col-span-12">
                                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Información básica</p>
                                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Mantén actualizados los datos personales principales del jugador.</p>
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="documentType" class="text-sm font-medium text-surface-700 dark:text-surface-200">Tipo de documento <span class="text-rose-500">*</span></label>
                                                    <p-select id="documentType" [(ngModel)]="form.documentType" [options]="documentTypeOptions" optionLabel="label" optionValue="value" placeholder="Selecciona un tipo" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                                                    @if (showError('documentType')) {
                                                        <p-message severity="error" size="small">Selecciona el tipo de documento.</p-message>
                                                    }
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="documentNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Número de documento <span class="text-rose-500">*</span></label>
                                                    <input pInputText id="documentNumber" type="text" [(ngModel)]="form.documentNumber" placeholder="Ej. 12345678" class="w-full" (input)="onDocumentInput($event)" />
                                                    @if (showError('documentNumber')) {
                                                        <p-message severity="error" size="small">Ingresa el documento del jugador.</p-message>
                                                    }
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
                                                    <label for="nationality" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nacionalidad <span class="text-slate-400">(opcional)</span></label>
                                                    <p-select id="nationality" [(ngModel)]="form.nationality" [options]="countryOptions" optionLabel="name" optionValue="name" [filter]="true" filterBy="name,dialCode" placeholder="Selecciona un país" class="w-full" appendTo="body" [scrollHeight]="'16rem'">
                                                        <ng-template #selectedItem let-option>
                                                            <span class="flex items-center gap-2">
                                                                <img [src]="option?.flagFile ?? fallbackFlag" [alt]="option?.name ?? 'País'" class="h-4 w-6 rounded-sm object-cover" />
                                                                <span>{{ option?.name ?? 'País' }}</span>
                                                            </span>
                                                        </ng-template>
                                                        <ng-template #item let-option>
                                                            <div class="flex items-center justify-between gap-3">
                                                                <span class="flex items-center gap-2">
                                                                    <img [src]="option.flagFile || fallbackFlag" [alt]="option.name" class="h-4 w-6 rounded-sm object-cover" />
                                                                    <span>{{ option.name }}</span>
                                                                </span>
                                                                <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-surface-800 dark:text-slate-300">{{ option.dialCode }}</span>
                                                            </div>
                                                        </ng-template>
                                                    </p-select>
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="gender" class="text-sm font-medium text-surface-700 dark:text-surface-200">Género <span class="text-slate-400">(opcional)</span></label>
                                                    <p-select id="gender" [(ngModel)]="form.gender" [options]="genderOptions" optionLabel="label" optionValue="value" placeholder="Selecciona un género" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                                                </div>
                                            </div>

                                            <div class="rounded-[0.75rem] border border-slate-200 bg-slate-50 p-3 dark:border-surface-700 dark:bg-surface-900/60 sm:p-4">
                                                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Información de contacto</p>
                                                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Agrupa el canal de contacto directo del jugador.</p>
                                            </div>

                                            <div class="grid grid-cols-12 gap-4">
                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="phoneNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Celular <span class="text-slate-400">(opcional)</span></label>
                                                    <div class="grid grid-cols-12 gap-3">
                                                        <p-select
                                                            id="countryCode"
                                                            [(ngModel)]="form.countryCode"
                                                            [options]="countryOptions"
                                                            optionLabel="label"
                                                            optionValue="value"
                                                            placeholder="Código"
                                                            class="col-span-12 md:col-span-4 w-full"
                                                            appendTo="body"
                                                            [scrollHeight]="'16rem'"
                                                        />
                                                        <input pInputText id="phoneNumber" type="text" [(ngModel)]="form.phoneNumber" placeholder="Ej. 987 654 321" class="col-span-12 md:col-span-8 w-full" (input)="onPhoneInput($event)" />
                                                    </div>
                                                    @if (showError('countryCode') || showError('phoneNumber')) {
                                                        <p-message severity="error" size="small">Ingresa un celular válido.</p-message>
                                                    }
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="email" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo <span class="text-slate-400">(opcional)</span></label>
                                                    <input pInputText id="email" type="text" [(ngModel)]="form.email" placeholder="Ej. jugador@correo.com" class="w-full" (keydown)="onPlayerEmailKeydown($event)" (paste)="onPlayerEmailPaste($event)" (input)="onPlayerEmailInput($event)" />
                                                    @if (showError('email')) {
                                                        <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                                    }
                                                </div>
                                            </div>

                                            <div class="rounded-[0.75rem] border border-slate-200 bg-slate-50 p-3 dark:border-surface-700 dark:bg-surface-900/60 sm:p-4">
                                                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Detalle del jugador</p>
                                                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Completa la categoría y los datos deportivos que aún no forman parte de la identidad base.</p>
                                            </div>

                                            <div class="grid grid-cols-12 gap-4">
                                                <div class="col-span-12 flex flex-col gap-2">
                                                    <label for="categoryId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Categoría <span class="text-rose-500">*</span></label>
                                                    <p-select id="categoryId" [(ngModel)]="form.categoryId" [options]="categories" optionLabel="name" optionValue="id" placeholder="Selecciona una categoría" class="w-full" />
                                                    @if (showError('categoryId')) {
                                                        <p-message severity="error" size="small">Selecciona la categoría del jugador.</p-message>
                                                    }
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="dominantFoot" class="text-sm font-medium text-surface-700 dark:text-surface-200">Pie dominante <span class="text-slate-400">(opcional)</span></label>
                                                    <p-select id="dominantFoot" [(ngModel)]="form.dominantFoot" [options]="dominantFootOptions" optionLabel="label" optionValue="value" placeholder="Selecciona una opción" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                                                </div>

                                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                    <label for="federationId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Liga <span class="text-slate-400">(opcional)</span></label>
                                                    <input pInputText id="federationId" type="text" [(ngModel)]="form.federationId" placeholder="Ej. F001" class="w-full" (input)="onTextInput('federationId', $event)" />
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
                                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Administra el acudiente principal y los contactos de apoyo del jugador.</p>
                                                </div>

                                                <div class="flex w-full flex-col gap-2 xl:w-auto xl:flex-row xl:justify-end">
                                                    <p-button label="Asociar" icon="pi pi-link" severity="secondary" [outlined]="true" styleClass="w-full xl:min-w-[10.5rem]" (onClick)="openAssociateGuardianDialog()" />
                                                    <p-button label="Nuevo acudiente" icon="pi pi-plus" styleClass="w-full xl:min-w-[12rem]" (onClick)="openCreateGuardianDialog()" />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                                            <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                                    <p-iconfield iconPosition="left" class="w-full lg:max-w-md">
                                                        <p-inputicon styleClass="pi pi-search" />
                                                        <input pInputText type="text" [(ngModel)]="guardianSearch" placeholder="Buscar acudiente por nombre, documento o teléfono" class="w-full" />
                                                    </p-iconfield>
                                                    <button
                                                        type="button"
                                                        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-surface-700 dark:text-slate-400 dark:hover:border-surface-500 dark:hover:text-slate-200"
                                                        pTooltip="Busca por nombre, documento o teléfono."
                                                        tooltipPosition="left"
                                                        aria-label="Ayuda de búsqueda"
                                                    >
                                                        <i class="pi pi-info-circle text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="space-y-3 p-3 sm:hidden">
                                                @if (filteredGuardians.length) {
                                                    @for (relation of filteredGuardians; track relation.id) {
                                                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900">
                                                            <div class="flex items-start justify-between gap-3">
                                                                <div class="min-w-0 space-y-1">
                                                                    <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">{{ guardianFullName(relation.guardian) }}</p>
                                                                    <p class="m-0 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                                                        {{ relation.isPrimary ? 'Contacto principal del jugador' : 'Contacto de apoyo del jugador' }}
                                                                    </p>
                                                                </div>
                                                                <div class="flex shrink-0 items-center gap-2">
                                                                    @if (relation.isPrimary) {
                                                                        <p-tag value="Principal" severity="success" styleClass="guardian-primary-tag" />
                                                                    }
                                                                    <p-button
                                                                        icon="pi pi-ellipsis-h"
                                                                        [text]="true"
                                                                        rounded
                                                                        severity="secondary"
                                                                        (onClick)="guardianActionsMenu && openGuardianActionsMenu($event, guardianActionsMenu, relation)"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div class="mt-3 grid grid-cols-1 gap-3 text-sm">
                                                                <div>
                                                                    <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Documento</p>
                                                                    <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ getGuardianDocumentLabel(relation.guardian) }}</p>
                                                                </div>
                                                                <div class="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Correo</p>
                                                                        <p class="mt-1 m-0 break-all text-surface-900 dark:text-surface-0">{{ relation.guardian.email || 'No configurado' }}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Teléfono</p>
                                                                        <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ relation.guardian.phone || 'No configurado' }}</p>
                                                                    </div>
                                                                </div>
                                                                <div class="grid grid-cols-2 gap-3">
                                                                    <div>
                                                                        <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Parentesco</p>
                                                                        <div class="mt-1">
                                                                            <p-tag [value]="relation.guardian.relationship" severity="info" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                } @else {
                                                    <div class="py-8 text-center">
                                                        <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                            <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay acudientes asociados</span>
                                                            <span>Asocia o crea el primer acudiente para este jugador.</span>
                                                        </div>
                                                    </div>
                                                }
                                            </div>

                                            <div class="hidden sm:block">
                                            <p-table [value]="filteredGuardians" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                                                <ng-template pTemplate="header">
                                                    <tr>
                                                        <th>Acudiente</th>
                                                        <th>Documento</th>
                                                        <th>Contacto</th>
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
                                                        <td>{{ getGuardianDocumentLabel(relation.guardian) }}</td>
                                                        <td>
                                                            <div class="space-y-1">
                                                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ relation.guardian.phone || 'No configurado' }}</p>
                                                                <p class="m-0 text-xs text-slate-500 dark:text-slate-400">{{ relation.guardian.email || 'No configurado' }}</p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p-tag styleClass="guardian-relation-tag" [value]="relation.guardian.relationship" severity="info" />
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
                                    </div>
                                </p-tabpanel>

                                <p-tabpanel value="teams">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="form-width-2col mx-auto space-y-4">
                                            <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-none dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                                                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                    <div class="space-y-1">
                                                        <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Equipos del jugador</p>
                                                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Define el equipo principal y conserva el historial deportivo del jugador.</p>
                                                    </div>

                                                    <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
                                                        <p-button label="Asignar equipo" icon="pi pi-plus" styleClass="w-full sm:w-auto sm:min-w-[11.5rem]" (onClick)="openCreateTeamAssignmentDialog()" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Equipo principal</p>
                                                    <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0 sm:text-base">{{ primaryTeamAssignment?.teamName ?? 'Sin definir' }}</p>
                                                </div>
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Asignaciones activas</p>
                                                    <p class="mt-2 text-sm font-semibold text-emerald-600 sm:text-base">{{ activeTeamAssignmentsCount }}</p>
                                                </div>
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Historial</p>
                                                    <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0 sm:text-base">{{ historicalTeamAssignmentsCount }}</p>
                                                </div>
                                            </div>

                                            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                                            <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                    <p-iconfield iconPosition="left" class="w-full lg:max-w-md">
                                                        <p-inputicon styleClass="pi pi-search" />
                                                        <input pInputText type="text" [(ngModel)]="teamAssignmentSearch" placeholder="Buscar equipo" class="w-full" />
                                                    </p-iconfield>
                                                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400 lg:max-w-sm">Consulta qué participación sigue activa y cuál quedó como referencia principal.</p>
                                                </div>
                                            </div>

                                            <div class="space-y-3 p-3 sm:hidden">
                                                @if (filteredTeamAssignments.length) {
                                                    @for (assignment of filteredTeamAssignments; track assignment.id) {
                                                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900">
                                                            <div class="flex items-start justify-between gap-3">
                                                                <div class="min-w-0 space-y-1">
                                                                    <div class="flex flex-wrap items-center gap-2">
                                                                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">{{ assignment.teamName }}</p>
                                                                        @if (assignment.isPrimary && isTeamAssignmentActive(assignment)) {
                                                                            <p-tag value="Principal" severity="success" />
                                                                        }
                                                                    </div>
                                                                    <p class="m-0 text-xs leading-5 text-slate-500 dark:text-slate-400">{{ assignment.teamCategoryName }}</p>
                                                                </div>
                                                                <p-button icon="pi pi-ellipsis-h" [text]="true" rounded severity="secondary" (onClick)="openTeamActionsMenu($event, assignment)" />
                                                            </div>

                                                            <div class="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                                                <div>
                                                                    <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Inicio</p>
                                                                    <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ formatDateOnly(assignment.startDate) }}</p>
                                                                </div>
                                                                <div>
                                                                    <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Estado</p>
                                                                    <div class="mt-1">
                                                                        <p-tag [value]="teamAssignmentStatusLabel(assignment)" [severity]="teamAssignmentStatusSeverity(assignment)" />
                                                                    </div>
                                                                </div>
                                                                <div class="sm:col-span-2">
                                                                    <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Fin</p>
                                                                    <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ assignment.endDate ? formatDateOnly(assignment.endDate) : 'Sigue activa' }}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                } @else {
                                                    <div class="py-8 text-center">
                                                        <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                            <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay asignaciones deportivas</span>
                                                            <span>Asigna el primer equipo para registrar la participación del jugador.</span>
                                                        </div>
                                                    </div>
                                                }
                                            </div>

                                            <div class="hidden sm:block">
                                                <p-table [value]="filteredTeamAssignments" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                                                    <ng-template pTemplate="header">
                                                        <tr>
                                                            <th>Equipo</th>
                                                            <th>Categoría</th>
                                                            <th>Inicio</th>
                                                            <th>Fin</th>
                                                            <th>Estado</th>
                                                            <th class="text-right">Acciones</th>
                                                        </tr>
                                                    </ng-template>
                                                    <ng-template pTemplate="body" let-assignment>
                                                        <tr>
                                                            <td>
                                                                <div class="space-y-1">
                                                                    <div class="flex flex-wrap items-center gap-2">
                                                                        <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ assignment.teamName }}</p>
                                                                        @if (assignment.isPrimary && isTeamAssignmentActive(assignment)) {
                                                                            <p-tag value="Principal" severity="success" />
                                                                        }
                                                                    </div>
                                                                    <p class="m-0 text-xs text-slate-500 dark:text-slate-400">{{ isTeamAssignmentActive(assignment) ? 'Participación vigente' : 'Participación finalizada' }}</p>
                                                                </div>
                                                            </td>
                                                            <td>{{ assignment.teamCategoryName }}</td>
                                                            <td>{{ formatDateOnly(assignment.startDate) }}</td>
                                                            <td>{{ assignment.endDate ? formatDateOnly(assignment.endDate) : 'Sigue activa' }}</td>
                                                            <td><p-tag [value]="teamAssignmentStatusLabel(assignment)" [severity]="teamAssignmentStatusSeverity(assignment)" /></td>
                                                            <td>
                                                                <div class="flex justify-end gap-2">
                                                                    <p-button icon="pi pi-ellipsis-h" [text]="true" rounded severity="secondary" (onClick)="openTeamActionsMenu($event, assignment)" />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </ng-template>
                                                    <ng-template pTemplate="emptymessage">
                                                        <tr>
                                                            <td colspan="6" class="py-10 text-center">
                                                                <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay asignaciones deportivas</span>
                                                                    <span>Asigna el primer equipo para registrar la participación del jugador.</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </ng-template>
                                                </p-table>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </p-tabpanel>

                                <p-tabpanel value="membership">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="form-width-2col mx-auto space-y-4">
                                            <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-none dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                                                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                    <div class="space-y-1">
                                                        <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Matrícula</p>
                                                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Controla el estado administrativo del jugador y define el acudiente principal responsable.</p>
                                                    </div>

                                                    @if (activeMembership) {
                                                        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
                                                            <p-button label="Suspender" severity="secondary" [outlined]="true" styleClass="w-full sm:w-auto" (onClick)="suspendMembership()" />
                                                            <p-button label="Retirar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="withdrawMembership()" />
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            @if (activeMembership) {
                                                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Estado</p>
                                                        <div class="mt-2">
                                                            <p-tag [value]="membershipStatusLabel(activeMembership.status)" [severity]="membershipStatusSeverity(activeMembership.status)" />
                                                        </div>
                                                    </div>
                                                    <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Inicio</p>
                                                        <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0 sm:text-base">{{ formatDateTime(activeMembership.startedAt) }}</p>
                                                    </div>
                                                    <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                        <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Acudiente principal</p>
                                                        <p class="mt-2 text-sm font-semibold text-surface-900 dark:text-surface-0 sm:text-base">{{ activeMembershipGuardianName }}</p>
                                                    </div>
                                                </div>
                                            } @else {
                                                <div class="rounded-[0.75rem] border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-surface-700 dark:bg-surface-900/60 sm:p-4">
                                                    <div class="space-y-4">
                                                        <div class="space-y-1">
                                                            <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Crear matrícula</p>
                                                            <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Selecciona el acudiente principal para activar la matrícula y generar los cargos iniciales del jugador.</p>
                                                        </div>

                                                        <div class="flex flex-col gap-2">
                                                            <label for="membershipGuardian" class="text-sm font-medium text-surface-700 dark:text-surface-200">Acudiente principal <span class="text-rose-500">*</span></label>
                                                            <p-select
                                                                id="membershipGuardian"
                                                                [(ngModel)]="selectedMembershipGuardianId"
                                                                [options]="membershipGuardianOptions"
                                                                optionLabel="fullName"
                                                                optionValue="id"
                                                                placeholder="Selecciona un acudiente"
                                                                class="w-full"
                                                                appendTo="body"
                                                            />
                                                            @if (membershipSubmitted && !selectedMembershipGuardianId) {
                                                                <p-message severity="error" size="small">Selecciona un acudiente principal antes de continuar.</p-message>
                                                            }
                                                        </div>

                                                        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                                            <p-button label="Crear matrícula" styleClass="w-full sm:w-auto" (onClick)="createMembership()" />
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                                                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-800 sm:px-4">
                                                    <div class="space-y-1">
                                                        <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Historial</p>
                                                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Revisa la vigencia y los cambios administrativos asociados a la matrícula del jugador.</p>
                                                    </div>
                                                </div>

                                                @if (membershipHistory.length) {
                                                    <div class="membership-history px-3 py-2 sm:px-4">
                                                        @for (item of membershipHistory; track item.id) {
                                                            <div class="membership-history-item flex gap-3 py-3 first:pt-3 last:pb-3">
                                                                <div class="flex shrink-0 pt-1">
                                                                    <span class="membership-history-dot flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-surface-700 dark:bg-surface-900">
                                                                        <i class="pi text-base" [class.pi-check-circle]="item.status === 'ACTIVE'" [class.pi-pause-circle]="item.status === 'SUSPENDED'" [class.pi-times-circle]="item.status === 'WITHDRAWN'"></i>
                                                                    </span>
                                                                </div>

                                                                <div
                                                                    class="membership-history-card min-w-0 flex-1 rounded-[0.85rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4"
                                                                    [class.membership-history-card-active]="item.status === 'ACTIVE'"
                                                                    [class.membership-history-card-suspended]="item.status === 'SUSPENDED'"
                                                                    [class.membership-history-card-withdrawn]="item.status === 'WITHDRAWN'"
                                                                >
                                                                    <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                                        <div class="min-w-0 space-y-2">
                                                                            <div class="flex flex-wrap items-center gap-2">
                                                                                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">{{ membershipEventTitle(item.status) }}</p>
                                                                                <p-tag [value]="membershipStatusLabel(item.status)" [severity]="membershipStatusSeverity(item.status)" />
                                                                            </div>
                                                                            <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Acudiente principal: <span class="font-medium text-surface-700 dark:text-surface-200">{{ guardianNameById(item.primaryGuardianId) }}</span></p>
                                                                        </div>

                                                                        <div class="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400 md:items-end md:text-right">
                                                                            <p class="m-0">Inicio: <span class="font-medium text-surface-700 dark:text-surface-200">{{ formatDateTime(item.startedAt) }}</span></p>
                                                                            <p class="m-0">Fin: <span class="font-medium text-surface-700 dark:text-surface-200">{{ item.endedAt ? formatDateTime(item.endedAt) : 'Vigente' }}</span></p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                } @else {
                                                    <div class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                                        Todavía no hay historial de matrícula para este jugador.
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </p-tabpanel>

                                <p-tabpanel value="charges">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="w-full mx-auto space-y-4">
                                            <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-none dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                                                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                    <div class="space-y-1">
                                                        <div class="flex items-center gap-2">
                                                            <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Cargos y deuda</p>
                                                            <p-button
                                                                icon="pi pi-info-circle"
                                                                severity="secondary"
                                                                [text]="true"
                                                                [rounded]="true"
                                                                styleClass="h-8 w-8 shrink-0"
                                                                pTooltip="Entender este flujo"
                                                                tooltipPosition="top"
                                                                (onClick)="showChargesHelpDialog = true"
                                                            />
                                                        </div>
                                                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Consulta los cargos activos del jugador y el saldo pendiente asociado.</p>
                                                    </div>

                                                    <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                                                        <p-button label="Nuevo cargo" icon="pi pi-plus" styleClass="w-full sm:min-w-[10.5rem] sm:w-auto" (onClick)="openCreateChargeDialog()" />
                                                        @if (player) {
                                                            <p-button label="Ver pagos" icon="pi pi-credit-card" severity="secondary" [outlined]="true" styleClass="w-full sm:min-w-[10rem] sm:w-auto" [routerLink]="['/payments/history']" [queryParams]="{ playerId: player.id }" />
                                                        }
                                                        <p-button label="Ir al módulo financiero" icon="pi pi-arrow-right" severity="secondary" [outlined]="true" styleClass="w-full sm:min-w-[12.5rem] sm:w-auto" routerLink="/payments/charges" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Saldo pendiente</p>
                                                    <p class="mt-2 text-lg font-semibold text-surface-900 dark:text-surface-0 sm:text-xl">{{ debtSummary.pendingAmount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                                                </div>
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Cargos pendientes</p>
                                                    <p class="mt-2 text-lg font-semibold text-amber-600 sm:text-xl">{{ debtSummary.pendingCharges }}</p>
                                                </div>
                                                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-4">
                                                    <p class="m-0 text-sm font-medium text-slate-500 dark:text-slate-400">Total de cargos</p>
                                                    <p class="mt-2 text-lg font-semibold text-surface-900 dark:text-surface-0 sm:text-xl">{{ initialCharges.length }}</p>
                                                </div>
                                            </div>

                                            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                                            @if (initialCharges.length) {
                                                <div class="space-y-3 p-3 sm:hidden">
                                                    @for (charge of initialCharges; track charge.id) {
                                                        <div class="rounded-[0.85rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900">
                                                            <div class="flex items-start justify-between gap-3">
                                                                <div class="min-w-0">
                                                                    <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ charge.conceptName }}</p>
                                                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ charge.description }}</p>
                                                                </div>
                                                                <p-tag [value]="chargeStatusLabel(charge.status)" [severity]="chargeStatusSeverity(charge.status)" />
                                                            </div>

                                                            <div class="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                                                <div>
                                                                    <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Monto</p>
                                                                    <p class="mt-1 m-0 font-medium text-surface-900 dark:text-surface-0">{{ charge.amount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</p>
                                                                </div>
                                                                <div>
                                                                    <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Vence</p>
                                                                    <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ formatDateOnly(charge.dueDate) }}</p>
                                                                </div>
                                                                <div class="sm:col-span-2">
                                                                    <p class="m-0 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Origen</p>
                                                                    <p class="mt-1 m-0 text-surface-900 dark:text-surface-0">{{ charge.sourceLabel }}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>

                                                <div class="hidden sm:block">
                                                <p-table [value]="initialCharges" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                                                    <ng-template pTemplate="header">
                                                        <tr>
                                                            <th>Concepto</th>
                                                            <th>Detalle</th>
                                                            <th>Vence</th>
                                                            <th>Origen</th>
                                                            <th>Monto</th>
                                                            <th>Estado</th>
                                                        </tr>
                                                    </ng-template>
                                                    <ng-template pTemplate="body" let-charge>
                                                        <tr>
                                                            <td class="font-medium text-surface-900 dark:text-surface-0">{{ charge.conceptName }}</td>
                                                            <td>{{ charge.description }}</td>
                                                            <td>{{ formatDateOnly(charge.dueDate) }}</td>
                                                            <td>{{ charge.sourceLabel }}</td>
                                                            <td>{{ charge.amount | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                                                            <td><p-tag [value]="chargeStatusLabel(charge.status)" [severity]="chargeStatusSeverity(charge.status)" /></td>
                                                        </tr>
                                                    </ng-template>
                                                </p-table>
                                                </div>
                                            } @else {
                                                <div class="px-4 py-10 text-center">
                                                    <p class="m-0 text-base font-medium text-surface-900 dark:text-surface-0">Sin cargos registrados</p>
                                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Activa la matrícula o crea un cargo manual para empezar el seguimiento financiero del jugador.</p>
                                                </div>
                                            }
                                            </div>
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
                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Registra al acudiente, completa su identificación y déjalo asociado al jugador en una sola acción.</p>

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
                            <label for="guardianPhone" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono <span class="text-slate-400">(opcional)</span></label>
                            <input pInputText id="guardianPhone" type="text" [(ngModel)]="guardianForm.phone" placeholder="Ej. +57 312 555 0021" class="w-full" (input)="onGuardianPhoneInput($event)" />
                            @if (showGuardianError('phone')) {
                                <p-message severity="error" size="small">Ingresa un teléfono válido.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="guardianEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo <span class="text-slate-400">(opcional)</span></label>
                            <input pInputText id="guardianEmail" type="text" [(ngModel)]="guardianForm.email" placeholder="Ej. maria.perez@correo.com" class="w-full" (keydown)="onEmailKeydown($event)" (paste)="onEmailPaste($event)" (input)="onGuardianEmailInput($event)" />
                            @if (showGuardianError('email')) {
                                <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="guardianDocumentType" class="text-sm font-medium text-surface-700 dark:text-surface-200">Tipo de documento <span class="text-rose-500">*</span></label>
                            <p-select id="guardianDocumentType" [(ngModel)]="guardianForm.documentType" [options]="documentTypeOptions" optionLabel="label" optionValue="value" placeholder="Selecciona un tipo" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                            @if (showGuardianError('documentType')) {
                                <p-message severity="error" size="small">Selecciona el tipo de documento.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="guardianDocumentNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Número de documento <span class="text-rose-500">*</span></label>
                            <input pInputText id="guardianDocumentNumber" type="text" [(ngModel)]="guardianForm.documentNumber" placeholder="Ej. 42110567" class="w-full" (input)="onGuardianDocumentInput($event)" />
                            @if (showGuardianError('documentNumber')) {
                                <p-message severity="error" size="small">Ingresa el número de documento.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="guardianRelationship" class="text-sm font-medium text-surface-700 dark:text-surface-200">Parentesco <span class="text-rose-500">*</span></label>
                            <p-select
                                id="guardianRelationship"
                                [(ngModel)]="guardianForm.relationship"
                                [options]="relationshipOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Selecciona un parentesco"
                                class="w-full"
                                appendTo="body"
                                [scrollHeight]="'16rem'"
                            />
                            @if (showGuardianError('relationship')) {
                                <p-message severity="error" size="small">Selecciona el parentesco del acudiente.</p-message>
                            }
                        </div>

                        <div class="col-span-12 flex flex-col gap-2">
                            <label for="guardianAddress" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección <span class="text-slate-400">(opcional)</span></label>
                            <input pInputText id="guardianAddress" type="text" [(ngModel)]="guardianForm.address" placeholder="Ej. Calle 25 # 14-30" class="w-full" />
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

            <p-dialog [(visible)]="showCreateTeamAssignmentDialog" [modal]="true" [draggable]="false" [resizable]="false" [dismissableMask]="true" [style]="{ width: 'min(40rem, calc(100vw - 2rem))' }" styleClass="player-dialog" header="Asignar equipo">
                <div class="space-y-4">
                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Define la participación deportiva del jugador y, si corresponde, déjala como principal.</p>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 flex flex-col gap-2">
                            <label for="teamAssignmentTeam" class="text-sm font-medium text-surface-700 dark:text-surface-200">Equipo <span class="text-rose-500">*</span></label>
                            @if (availableTeams.length) {
                                <p-select id="teamAssignmentTeam" [(ngModel)]="teamAssignmentForm.teamId" [options]="availableTeams" optionLabel="name" optionValue="id" placeholder="Selecciona un equipo" class="w-full" appendTo="body">
                                    <ng-template #item let-option>
                                        <div class="flex items-center justify-between gap-3">
                                            <span>{{ option.name }}</span>
                                            <span class="text-sm text-slate-500 dark:text-slate-400">{{ option.categoryName }}</span>
                                        </div>
                                    </ng-template>
                                </p-select>
                                @if (teamAssignmentSubmitted && !teamAssignmentForm.teamId) {
                                    <p-message severity="error" size="small">Selecciona el equipo que vas a asignar.</p-message>
                                }
                            } @else {
                                <div class="rounded-[0.85rem] border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-500 dark:border-surface-700 dark:bg-surface-900/60 dark:text-slate-400">
                                    No hay equipos activos disponibles para asignar en esta iteración.
                                </div>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="teamAssignmentStartDate" class="text-sm font-medium text-surface-700 dark:text-surface-200">Fecha de inicio <span class="text-rose-500">*</span></label>
                            <input pInputText id="teamAssignmentStartDate" type="date" [(ngModel)]="teamAssignmentForm.startDate" class="w-full" />
                            @if (teamAssignmentSubmitted && !teamAssignmentForm.startDate) {
                                <p-message severity="error" size="small">Selecciona la fecha de inicio de la participación.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex items-end">
                            <div class="flex w-full items-start gap-3 rounded-[0.85rem] border border-slate-200 bg-slate-50 px-3 py-3 dark:border-surface-700 dark:bg-surface-900/60">
                                <p-checkbox inputId="teamAssignmentPrimary" [(ngModel)]="teamAssignmentForm.markAsPrimary" [binary]="true" />
                                <div class="space-y-1">
                                    <label for="teamAssignmentPrimary" class="cursor-pointer text-sm font-medium text-surface-900 dark:text-surface-0">Definir como equipo principal</label>
                                    <p class="m-0 text-xs leading-5 text-slate-500 dark:text-slate-400">Si está activo, esta asignación quedará como principal entre los equipos vigentes.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="showCreateTeamAssignmentDialog = false" />
                        <p-button label="Guardar" styleClass="w-full sm:w-auto" [disabled]="!availableTeams.length" (onClick)="createTeamAssignment()" />
                    </div>
                </ng-template>
            </p-dialog>

            <p-dialog [(visible)]="showCreateChargeDialog" [modal]="true" [draggable]="false" [resizable]="false" [dismissableMask]="true" [style]="{ width: 'min(42rem, calc(100vw - 2rem))' }" styleClass="player-dialog" header="Nuevo cargo">
                <div class="space-y-4">
                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Genera una obligación para este jugador y define si después continuarás directamente al pago.</p>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="chargeConceptId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Concepto <span class="text-rose-500">*</span></label>
                            <p-select id="chargeConceptId" [(ngModel)]="chargeForm.conceptId" [options]="chargeConceptOptions" optionLabel="name" optionValue="id" placeholder="Selecciona un concepto" class="w-full" (onChange)="onChargeConceptChange()" appendTo="body" [scrollHeight]="'16rem'" />
                            @if (showChargeError('conceptId')) {
                                <p-message severity="error" size="small">Selecciona el concepto del cargo.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="chargeAmount" class="text-sm font-medium text-surface-700 dark:text-surface-200">Monto <span class="text-rose-500">*</span></label>
                            <input pInputText id="chargeAmount" type="text" [(ngModel)]="chargeForm.amount" placeholder="Ej. 120000" class="w-full" (input)="onChargeAmountInput($event)" />
                            @if (showChargeError('amount')) {
                                <p-message severity="error" size="small">Ingresa un monto válido.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="chargeDueDate" class="text-sm font-medium text-surface-700 dark:text-surface-200">Fecha de vencimiento <span class="text-rose-500">*</span></label>
                            <input pInputText id="chargeDueDate" type="date" [(ngModel)]="chargeForm.dueDate" class="w-full" />
                            @if (showChargeError('dueDate')) {
                                <p-message severity="error" size="small">Selecciona la fecha de vencimiento.</p-message>
                            }
                        </div>

                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                            <label for="chargeNextStep" class="text-sm font-medium text-surface-700 dark:text-surface-200">Después de guardar</label>
                            <p-select id="chargeNextStep" [(ngModel)]="chargeForm.nextStep" [options]="chargeNextStepOptions" optionLabel="label" optionValue="value" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                        </div>

                        <div class="col-span-12 flex flex-col gap-2">
                            <label for="chargeDescription" class="text-sm font-medium text-surface-700 dark:text-surface-200">Detalle <span class="text-rose-500">*</span></label>
                            <input pInputText id="chargeDescription" type="text" [(ngModel)]="chargeForm.description" placeholder="Ej. Uniforme oficial temporada 2026" class="w-full" />
                            @if (showChargeError('description')) {
                                <p-message severity="error" size="small">Describe el motivo del cargo.</p-message>
                            }
                        </div>
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="showCreateChargeDialog = false" />
                        <p-button label="Guardar cargo" styleClass="w-full sm:w-auto" (onClick)="saveManualCharge()" />
                    </div>
                </ng-template>
            </p-dialog>

            <p-dialog [(visible)]="showChargesHelpDialog" [modal]="true" [draggable]="false" [resizable]="false" [dismissableMask]="true" [style]="{ width: 'min(34rem, calc(100vw - 2rem))' }" styleClass="player-dialog" header="Referencia del flujo">
                <div class="space-y-4">
                    <div class="space-y-2">
                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Concepto</p>
                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Corresponde al tipo de cobro disponible para la academia.</p>
                    </div>

                    <div class="space-y-2">
                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Cargo</p>
                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Registra la obligación concreta del jugador con monto y vencimiento.</p>
                    </div>

                    <div class="space-y-2">
                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Pago</p>
                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Aplica el recaudo sobre los cargos y actualiza el saldo pendiente.</p>
                    </div>
                </div>

                <ng-template pTemplate="footer">
                    <div class="flex justify-end">
                        <p-button label="Cerrar" styleClass="w-full sm:w-auto" (onClick)="showChargesHelpDialog = false" />
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
    @ViewChild('teamActionsMenu') teamActionsMenu?: Menu;
    private readonly document = inject(DOCUMENT);

    breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Jugadores', routerLink: '/players' }, { label: 'Detalle' }];
    activeTab: 'information' | 'guardians' | 'teams' | 'membership' | 'charges' = 'information';
    submitted = false;
    guardianSubmitted = false;
    membershipSubmitted = false;
    player: Player | null = null;
    form: PlayerForm = this.emptyForm();
    categories: CategoryOption[] = [];
    relations: PlayerGuardianRelation[] = [];
    guardians: Guardian[] = [];
    teamAssignments: PlayerTeamAssignment[] = [];
    activeMembership: PlayerMembership | null = null;
    membershipHistory: PlayerMembershipHistoryItem[] = [];
    initialCharges: PlayerInitialCharge[] = [];
    selectedMembershipGuardianId = '';
    readonly relationshipOptions = [
        { label: 'Padre', value: 'Padre' },
        { label: 'Madre', value: 'Madre' },
        { label: 'Abuelo(a)', value: 'Abuelo(a)' },
        { label: 'Tutor', value: 'Tutor' },
        { label: 'Hermano(a)', value: 'Hermano(a)' },
        { label: 'Otro', value: 'Otro' }
    ];
    readonly documentTypeOptions = [
        { label: 'DNI', value: 'DNI' },
        { label: 'Cédula de ciudadanía', value: 'CC' },
        { label: 'Tarjeta de identidad', value: 'TI' },
        { label: 'Cédula de extranjería', value: 'CE' },
        { label: 'Pasaporte', value: 'PASAPORTE' }
    ];
    readonly genderOptions = [
        { label: 'Masculino', value: 'Masculino' },
        { label: 'Femenino', value: 'Femenino' },
        { label: 'Otro', value: 'Otro' },
        { label: 'Prefiero no decir', value: 'Prefiero no decir' }
    ];
    readonly dominantFootOptions = [
        { label: 'Derecho', value: 'Derecho' },
        { label: 'Izquierdo', value: 'Izquierdo' },
        { label: 'Ambidiestro', value: 'Ambidiestro' }
    ];
    readonly fallbackFlag = 'assets/flags/pe.svg';
    readonly countryOptions: CountryOption[] = [
        { name: 'Colombia', dialCode: '+57', flagFile: 'assets/flags/co.svg' },
        { name: 'Perú', dialCode: '+51', flagFile: 'assets/flags/pe.svg' },
        { name: 'Chile', dialCode: '+56', flagFile: 'assets/flags/cl.svg' },
        { name: 'Ecuador', dialCode: '+593', flagFile: 'assets/flags/ec.svg' },
        { name: 'México', dialCode: '+52', flagFile: 'assets/flags/mx.svg' },
        { name: 'España', dialCode: '+34', flagFile: 'assets/flags/es.svg' }
    ];
    guardianSearch = '';
    teamAssignmentSearch = '';
    selectedGuardianId = '';
    selectedTeamAssignment: PlayerTeamAssignment | null = null;
    showAssociateGuardianDialog = false;
    showCreateGuardianDialog = false;
    showCreateTeamAssignmentDialog = false;
    showCreateChargeDialog = false;
    showChargesHelpDialog = false;
    guardianForm: GuardianForm = this.emptyGuardianForm();
    teamAssignmentForm: PlayerTeamAssignmentForm = this.emptyTeamAssignmentForm();
    chargeSubmitted = false;
    teamAssignmentSubmitted = false;
    chargeForm: PlayerChargeForm = this.emptyChargeForm();
    guardianActionItems: MenuItem[] = [];
    teamActionItems: MenuItem[] = [];
    readonly chargeConceptOptions = [
        { id: 'concept-001', code: 'MATRICULA', name: 'Matrícula' },
        { id: 'concept-002', code: 'MENSUALIDAD', name: 'Mensualidad' },
        { id: 'concept-003', code: 'UNIFORME', name: 'Uniforme' },
        { id: 'concept-004', code: 'TORNEO', name: 'Torneo' }
    ];
    readonly chargeNextStepOptions = [
        { label: 'Solo generar cargo', value: 'CHARGE_ONLY' as const },
        { label: 'Generar cargo y continuar al pago', value: 'CHARGE_AND_PAYMENT' as const }
    ];
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
                this.closeTeamActionsMenu();
            }
        });
    }

    ngOnDestroy() {
        this.closeGuardianActionsMenu();
        this.closeTeamActionsMenu();
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
            return (
                fullName.includes(term) ||
                relation.guardian.email.toLowerCase().includes(term) ||
                relation.guardian.phone.toLowerCase().includes(term) ||
                relation.guardian.documentNumber.toLowerCase().includes(term) ||
                relation.guardian.relationship.toLowerCase().includes(term)
            );
        });
    }

    get filteredTeamAssignments() {
        const term = this.teamAssignmentSearch.trim().toLowerCase();
        if (!term) {
            return this.teamAssignments;
        }

        return this.teamAssignments.filter((assignment) => assignment.teamName.toLowerCase().includes(term) || assignment.teamCategoryName.toLowerCase().includes(term));
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

    get availableTeams() {
        return this.player ? this.playerService.listAvailableTeamsForPlayer(this.player.id) : [];
    }

    get primaryTeamAssignment() {
        return this.teamAssignments.find((assignment) => assignment.isPrimary && assignment.endDate === null) ?? null;
    }

    get activeTeamAssignmentsCount() {
        return this.teamAssignments.filter((assignment) => assignment.endDate === null).length;
    }

    get historicalTeamAssignmentsCount() {
        return this.teamAssignments.filter((assignment) => assignment.endDate !== null).length;
    }

    get membershipGuardianOptions() {
        return this.relations.map((relation) => ({
            id: relation.guardian.id,
            fullName: this.guardianFullName(relation.guardian),
            relationship: relation.guardian.relationship
        }));
    }

    get activeMembershipGuardianName() {
        return this.activeMembership ? this.guardianNameById(this.activeMembership.primaryGuardianId) : 'Sin acudiente';
    }

    get debtSummary() {
        return this.player ? this.playerService.getPlayerDebtSummary(this.player.id) : { pendingAmount: '0.00', pendingCharges: 0 };
    }

    openCreateChargeDialog() {
        this.chargeSubmitted = false;
        this.chargeForm = this.emptyChargeForm();
        this.showCreateChargeDialog = true;
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

    createMembership() {
        if (!this.player) {
            return;
        }

        this.membershipSubmitted = true;
        if (!this.selectedMembershipGuardianId) {
            this.messageService.add({ severity: 'warn', summary: 'Falta un acudiente', detail: 'Selecciona el acudiente principal para activar la matrícula.' });
            return;
        }

        const membership = this.playerService.createMembership(this.player.id, this.selectedMembershipGuardianId);
        if (!membership) {
            return;
        }

        this.selectedMembershipGuardianId = '';
        this.membershipSubmitted = false;
        this.loadMembershipData();
        this.messageService.add({ severity: 'success', summary: 'Matrícula creada', detail: 'La matrícula quedó activa y los cargos iniciales fueron generados en esta iteración mock.' });
    }

    suspendMembership() {
        if (!this.player) {
            return;
        }

        const membership = this.playerService.suspendMembership(this.player.id);
        if (!membership) {
            return;
        }

        this.loadMembershipData();
        this.messageService.add({ severity: 'info', summary: 'Matrícula suspendida', detail: 'El jugador quedó con matrícula suspendida en esta iteración mock.' });
    }

    withdrawMembership() {
        if (!this.player) {
            return;
        }

        const membership = this.playerService.withdrawMembership(this.player.id);
        if (!membership) {
            return;
        }

        this.loadMembershipData();
        this.messageService.add({ severity: 'info', summary: 'Matrícula retirada', detail: 'La matrícula del jugador quedó retirada en esta iteración mock.' });
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

    openCreateTeamAssignmentDialog() {
        this.teamAssignmentSubmitted = false;
        this.teamAssignmentForm = this.emptyTeamAssignmentForm();
        this.showCreateTeamAssignmentDialog = true;
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

    createTeamAssignment() {
        if (!this.player) {
            return;
        }

        this.teamAssignmentSubmitted = true;
        if (!this.isTeamAssignmentFormValid()) {
            this.messageService.add({ severity: 'warn', summary: 'Revisa la asignación', detail: 'Completa el equipo y la fecha de inicio antes de guardar.' });
            return;
        }

        const result = this.playerService.createTeamAssignment(this.player.id, this.teamAssignmentForm);
        if (result.reason === 'duplicate-active-assignment') {
            this.messageService.add({ severity: 'warn', summary: 'Equipo ya asignado', detail: 'El jugador ya tiene una asignación activa en ese equipo.' });
            return;
        }

        if (!result.assignment) {
            this.messageService.add({ severity: 'warn', summary: 'No se pudo asignar', detail: 'Verifica que el equipo siga disponible para esta iteración.' });
            return;
        }

        this.loadTeamAssignments();
        this.teamAssignmentForm = this.emptyTeamAssignmentForm();
        this.teamAssignmentSubmitted = false;
        this.showCreateTeamAssignmentDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Equipo asignado', detail: result.assignment.isPrimary ? 'La participación quedó creada como principal.' : 'La participación quedó creada correctamente.' });
    }

    onChargeConceptChange() {
        const concept = this.chargeConceptOptions.find((item) => item.id === this.chargeForm.conceptId);
        if (!concept) {
            this.chargeForm.conceptCode = '';
            this.chargeForm.conceptName = '';
            return;
        }

        this.chargeForm.conceptCode = concept.code;
        this.chargeForm.conceptName = concept.name;

        if (!this.chargeForm.description.trim()) {
            this.chargeForm.description = `Cargo por ${concept.name.toLowerCase()}`;
        }
    }

    onChargeAmountInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.chargeForm.amount = input.value.replace(/[^\d]/g, '');
        input.value = this.chargeForm.amount;
    }

    saveManualCharge() {
        if (!this.player) {
            return;
        }

        this.chargeSubmitted = true;
        if (!this.isChargeFormValid()) {
            this.messageService.add({ severity: 'warn', summary: 'Revisa el cargo', detail: 'Completa los datos obligatorios antes de guardar.' });
            return;
        }

        const createdCharge = this.playerService.createManualCharge(this.player.id, this.chargeForm);
        if (!createdCharge) {
            this.messageService.add({ severity: 'warn', summary: 'Sin matrícula activa', detail: 'Primero activa la matrícula del jugador para poder registrar cargos.' });
            return;
        }

        const nextStep = this.chargeForm.nextStep;
        this.loadMembershipData();
        this.showCreateChargeDialog = false;
        this.chargeForm = this.emptyChargeForm();
        this.chargeSubmitted = false;

        this.messageService.add({
            severity: 'success',
            summary: 'Cargo generado',
            detail: nextStep === 'CHARGE_AND_PAYMENT' ? 'El cargo quedó creado y ahora puedes continuar con el pago.' : 'El cargo quedó registrado en esta iteración mock.'
        });

        if (nextStep === 'CHARGE_AND_PAYMENT') {
            this.router.navigate(['/payments/history'], { queryParams: { playerId: this.player.id, chargeId: createdCharge.id } });
        }
    }

    openTeamActionsMenu(event: Event, assignment: PlayerTeamAssignment) {
        this.closeTeamActionsMenu();
        this.selectedTeamAssignment = assignment;
        this.teamActionItems = [
            ...(!assignment.isPrimary && this.isTeamAssignmentActive(assignment)
                ? [
                      {
                          label: 'Marcar principal',
                          icon: 'pi pi-star',
                          command: () => {
                              this.closeTeamActionsMenu();
                              this.markPrimaryTeamAssignment(assignment);
                          }
                      }
                  ]
                : []),
            ...(this.isTeamAssignmentActive(assignment)
                ? [
                      {
                          label: 'Finalizar',
                          icon: 'pi pi-stop-circle',
                          command: () => {
                              this.closeTeamActionsMenu();
                              this.finalizeTeamAssignment(assignment);
                          }
                      }
                  ]
                : [])
        ];

        if (!this.teamActionItems.length) {
            return;
        }

        this.teamActionsMenu?.toggle(event);
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

    markPrimaryTeamAssignment(assignment: PlayerTeamAssignment) {
        if (!this.player) {
            return;
        }

        const result = this.playerService.markPrimaryTeamAssignment(this.player.id, assignment.id);
        if (!result.ok) {
            this.messageService.add({ severity: 'warn', summary: 'No se pudo actualizar', detail: 'Solo puedes marcar como principal una asignación activa.' });
            return;
        }

        this.loadTeamAssignments();
        this.messageService.add({ severity: 'success', summary: 'Equipo principal actualizado', detail: 'La participación principal del jugador quedó actualizada.' });
    }

    finalizeTeamAssignment(assignment: PlayerTeamAssignment) {
        if (!this.player) {
            return;
        }

        const result = this.playerService.finalizeTeamAssignment(this.player.id, assignment.id);
        if (result.reason === 'missing-active-primary-replacement') {
            this.messageService.add({ severity: 'warn', summary: 'No se puede finalizar', detail: 'Este es el único equipo activo del jugador. Asigna otro equipo antes de finalizarlo.' });
            return;
        }

        if (!result.ok) {
            this.messageService.add({ severity: 'warn', summary: 'No se pudo finalizar', detail: 'La asignación ya no está activa en esta iteración.' });
            return;
        }

        this.loadTeamAssignments();
        this.messageService.add({ severity: 'success', summary: 'Participación finalizada', detail: 'La asignación del jugador quedó cerrada y el historial se conserva.' });
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

    getGuardianDocumentLabel(guardian: Guardian) {
        return `${this.getDocumentTypeLabel(guardian.documentType)} · ${guardian.documentNumber}`;
    }

    guardianNameById(guardianId: string) {
        return this.playerService.getGuardianDisplayName(guardianId);
    }

    getDocumentTypeLabel(value: string) {
        const labels: Record<string, string> = {
            DNI: 'DNI',
            CC: 'CC',
            TI: 'TI',
            CE: 'CE',
            PASAPORTE: 'Pasaporte'
        };

        return labels[value] ?? value;
    }

    membershipStatusLabel(status: PlayerMembership['status']) {
        switch (status) {
            case 'ACTIVE':
                return 'Activa';
            case 'SUSPENDED':
                return 'Suspendida';
            case 'WITHDRAWN':
                return 'Retirada';
        }
    }

    membershipEventTitle(status: PlayerMembership['status']) {
        switch (status) {
            case 'ACTIVE':
                return 'Matrícula activa';
            case 'SUSPENDED':
                return 'Matrícula suspendida';
            case 'WITHDRAWN':
                return 'Matrícula retirada';
        }
    }

    membershipStatusSeverity(status: PlayerMembership['status']): 'success' | 'warn' | 'danger' {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'SUSPENDED':
                return 'warn';
            case 'WITHDRAWN':
                return 'danger';
        }
    }

    chargeStatusLabel(status: PlayerInitialCharge['status']) {
        return status === 'PAID' ? 'Pagado' : 'Pendiente';
    }

    chargeStatusSeverity(status: PlayerInitialCharge['status']): 'success' | 'warn' {
        return status === 'PAID' ? 'success' : 'warn';
    }

    teamAssignmentStatusLabel(assignment: PlayerTeamAssignment) {
        return assignment.endDate === null ? 'Activa' : 'Finalizada';
    }

    teamAssignmentStatusSeverity(assignment: PlayerTeamAssignment): 'success' | 'contrast' {
        return assignment.endDate === null ? 'success' : 'contrast';
    }

    isTeamAssignmentActive(assignment: PlayerTeamAssignment) {
        return assignment.endDate === null;
    }

    showChargeError(field: keyof PlayerChargeForm) {
        return this.chargeSubmitted && !this.isChargeFieldValid(field);
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
        this.form.documentNumber = input.value.replace(/[^\dA-Za-z-]/g, '');
        input.value = this.form.documentNumber;
    }

    onTextInput(field: 'nationality' | 'federationId', event: Event) {
        const input = event.target as HTMLInputElement;
        this.form[field] = input.value.replace(/[^\p{L}\p{N}\s-]/gu, '');
        input.value = this.form[field];
    }

    onPhoneInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.form.phoneNumber = this.sanitizePhoneInput(input.value);
        input.value = this.form.phoneNumber;
    }

    onPlayerEmailInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.form.email = this.sanitizeEmailInput(input.value);
        input.value = this.form.email;
    }

    onPlayerEmailKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event) || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        if (!/^[a-zA-Z0-9@._%+\-]$/.test(event.key)) {
            event.preventDefault();
        }
    }

    onPlayerEmailPaste(event: ClipboardEvent) {
        const pasted = event.clipboardData?.getData('text') ?? '';
        if (pasted !== this.sanitizeEmailInput(pasted)) {
            event.preventDefault();
        }
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

    onGuardianDocumentInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.guardianForm.documentNumber = input.value.replace(/[^\dA-Za-z-]/g, '');
        input.value = this.guardianForm.documentNumber;
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
            documentType: player.documentType,
            firstName: player.firstName,
            lastName: player.lastName,
            birthDate: player.birthDate,
            documentNumber: player.documentNumber,
            nationality: player.nationality ?? '',
            gender: player.gender ?? '',
            federationId: player.federationId ?? '',
            dominantFoot: player.dominantFoot ?? '',
            email: player.email ?? '',
            countryCode: player.countryCode ?? '',
            phoneNumber: player.phoneNumber ?? '',
            categoryId: player.categoryId
        };
        this.photoPreviewUrl = player.photo?.url ?? null;
        this.photoFileName = player.photo?.path?.split('/').pop() ?? 'Sin imagen seleccionada';
        this.photoBlob = null;
        this.loadRelations();
        this.loadTeamAssignments();
        this.loadMembershipData();
    }

    private loadRelations() {
        if (!this.player) {
            this.relations = [];
            return;
        }

        this.relations = this.playerService.listPlayerGuardians(this.player.id);
    }

    private loadTeamAssignments() {
        if (!this.player) {
            this.teamAssignments = [];
            return;
        }

        this.teamAssignments = this.playerService.listPlayerTeamAssignments(this.player.id);
    }

    private loadMembershipData() {
        if (!this.player) {
            this.activeMembership = null;
            this.membershipHistory = [];
            this.initialCharges = [];
            return;
        }

        this.activeMembership = this.playerService.getActiveMembership(this.player.id);
        this.membershipHistory = this.playerService.listMembershipHistory(this.player.id);
        this.initialCharges = this.playerService.listInitialChargesByPlayer(this.player.id);
    }

    private emptyForm(): PlayerForm {
        return { documentType: '', firstName: '', lastName: '', birthDate: '', documentNumber: '', nationality: '', gender: '', federationId: '', dominantFoot: '', email: '', countryCode: '', phoneNumber: '', categoryId: '' };
    }

    private emptyGuardianForm(): GuardianForm {
        return { firstName: '', lastName: '', phone: '', email: '', documentType: '', documentNumber: '', address: '', relationship: '' };
    }

    private emptyTeamAssignmentForm(): PlayerTeamAssignmentForm {
        return { teamId: '', startDate: '', markAsPrimary: false };
    }

    private emptyChargeForm(): PlayerChargeForm {
        return {
            conceptId: '',
            conceptCode: '',
            conceptName: '',
            amount: '',
            dueDate: '',
            description: '',
            nextStep: 'CHARGE_ONLY'
        };
    }

    private isFormValid() {
        return ['documentType', 'firstName', 'lastName', 'birthDate', 'documentNumber', 'categoryId', 'email', 'countryCode', 'phoneNumber'].every((field) => this.isFieldValid(field as keyof PlayerForm));
    }

    private isFieldValid(field: keyof PlayerForm) {
        switch (field) {
            case 'documentType':
                return !!this.form.documentType;
            case 'firstName':
            case 'lastName':
                return this.hasValidText(this.form[field], 2);
            case 'birthDate':
                return !!this.form.birthDate;
            case 'documentNumber':
                return this.form.documentNumber.trim().length >= 6;
            case 'email':
                return !this.form.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim());
            case 'phoneNumber':
                return (!this.form.phoneNumber.trim() && !this.form.countryCode.trim()) || (!!this.form.phoneNumber.trim() && this.isValidPhoneNumber(this.form.countryCode, this.form.phoneNumber));
            case 'countryCode':
                return (!this.form.countryCode.trim() && !this.form.phoneNumber.trim()) || (!!this.form.countryCode.trim() && this.isValidPhoneNumber(this.form.countryCode, this.form.phoneNumber));
            case 'categoryId':
                return !!this.form.categoryId;
            default:
                return true;
        }
    }

    private isGuardianFormValid() {
        return ['firstName', 'lastName', 'documentType', 'documentNumber', 'relationship'].every((field) => this.isGuardianFieldValid(field as keyof GuardianForm));
    }

    private isTeamAssignmentFormValid() {
        return !!this.teamAssignmentForm.teamId && !!this.teamAssignmentForm.startDate;
    }

    private isChargeFormValid() {
        return ['conceptId', 'amount', 'dueDate', 'description'].every((field) => this.isChargeFieldValid(field as keyof PlayerChargeForm));
    }

    private isGuardianFieldValid(field: keyof GuardianForm) {
        switch (field) {
            case 'firstName':
            case 'lastName':
                return this.hasValidText(this.guardianForm[field], 2);
            case 'phone':
                return !this.guardianForm.phone.trim() || this.guardianForm.phone.replace(/\D/g, '').length >= 7;
            case 'email':
                return !this.guardianForm.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.guardianForm.email.trim());
            case 'documentType':
                return !!this.guardianForm.documentType;
            case 'documentNumber':
                return this.guardianForm.documentNumber.trim().length >= 5;
            case 'relationship':
                return !!this.guardianForm.relationship;
            default:
                return true;
        }
    }

    private isChargeFieldValid(field: keyof PlayerChargeForm) {
        switch (field) {
            case 'conceptId':
                return !!this.chargeForm.conceptId;
            case 'amount':
                return Number(this.chargeForm.amount) > 0;
            case 'dueDate':
                return !!this.chargeForm.dueDate;
            case 'description':
                return this.chargeForm.description.trim().length >= 4;
            case 'conceptCode':
            case 'conceptName':
            case 'nextStep':
                return true;
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

    private sanitizePhoneInput(value: string) {
        return value.replace(/[^\d\s()+-]/g, '');
    }

    private sanitizeEmailInput(value: string) {
        return value.replace(/[^a-zA-Z0-9@._%+\-]/g, '').replace(/\s+/g, '');
    }

    private isValidPhoneNumber(countryCode: string, phoneNumber: string) {
        const digits = phoneNumber.replace(/\D/g, '');
        switch (countryCode) {
            case '+51':
                return /^9\d{8}$/.test(digits);
            case '+57':
                return /^3\d{9}$/.test(digits);
            case '+56':
                return /^[2-9]\d{8}$/.test(digits);
            default:
                return digits.length >= 7;
        }
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

    getDocumentLabel(player: Player) {
        return `${this.getDocumentTypeLabel(player.documentType)} · ${player.documentNumber}`;
    }

    getPhoneLabel(player: Player) {
        if (player.phoneNumber) {
            return player.countryCode ? `${player.countryCode} ${player.phoneNumber}` : player.phoneNumber;
        }

        return player.countryCode ? `${player.countryCode} · No configurado` : 'No configurado';
    }

    formatDateTime(value: string) {
        return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
    }

    formatDateOnly(value: string) {
        return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
    }

    private closeGuardianActionsMenu() {
        this.guardianActionsMenu?.hide();
        this.closeDetachedGuardianMenus();
    }

    private closeTeamActionsMenu() {
        this.teamActionsMenu?.hide();
        this.closeDetachedGuardianMenus();
    }

    private closeDetachedGuardianMenus() {
        this.document.querySelectorAll('.p-menu-overlay').forEach((element) => {
            element.remove();
        });
    }
}
