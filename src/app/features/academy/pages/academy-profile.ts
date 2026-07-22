import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { catchError, finalize, of } from 'rxjs';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import { AuthAccessService } from '@/app/features/auth/data-access/auth-access.service';
import { ImageCropperComponent, ImageCropperFileError, ImageCropperResult } from '@/app/shared/ui/image-cropper/image-cropper';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { AcademyProfileService } from '../data-access/academy-profile.service';
import { AcademyProfile, AcademyProfileUpdateRequest, AcademyTaxProfile, AcademyTaxProfileUpdateRequest } from '../models/academy.model';
import { CategoryApiService } from '../data-access/category-api.service';
import { CategoryApiCategory as AcademyCategory, CategoryApiMeta as AcademyCategoryApiMeta, CategoryUpsertRequest as AcademyCategoryUpsertRequest } from '../models/category.model';
import { VenueApiService } from '../data-access/venue-api.service';
import { VenueApiMeta, VenueApiVenue, VenueUpsertRequest } from '../models/venue.model';
import { Menu } from 'primeng/menu';

interface CountryOption {
    name: string;
    dialCode: string;
    flagFile: string;
}

interface LocationDepartment {
    name: string;
    cities: string[];
}

interface AcademyVenueForm {
    name: string;
    address: string;
    country: string;
    department: string;
    city: string;
    countryCode: string;
    phoneNumber: string;
    notes: string;
}

interface AcademyCategoryForm {
    categoryKey: string;
    name: string;
    minAge: string;
    maxAge: string;
    description: string;
}

interface AcademyTeam {
    id: string;
    name: string;
    categoryId: string;
    categoryName: string;
    status: 'ACTIVE' | 'INACTIVE';
}

interface AcademyTeamForm {
    name: string;
    categoryId: string;
}

interface AcademyStaffMember {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    role: 'ROLE_ACADEMY_ADMIN' | 'ROLE_COACH';
    accessMode: 'INVITATION' | 'PASSWORD';
    status: 'ACTIVE' | 'PENDING_ACTIVATION' | 'INACTIVE';
}

interface AcademyStaffForm {
    fullName: string;
    email: string;
    role: AcademyStaffMember['role'] | '';
    status: AcademyStaffMember['status'];
    sendInvitation: boolean;
    password: string;
    passwordConfirmation: string;
}

interface AcademyTeamStaffAssignment {
    assignmentId: string;
    staffId: string;
    userId: string;
    teamId: string;
    fullName: string;
    email: string;
    role: 'HEAD_COACH' | 'ASSISTANT_COACH' | 'GOALKEEPER_COACH' | 'FITNESS_COACH' | 'NUTRITIONIST' | 'PHYSIOTHERAPIST';
    status: 'ACTIVE' | 'INACTIVE';
}

interface AcademyTeamStaffForm {
    staffId: string;
    role: AcademyTeamStaffAssignment['role'] | '';
}

@Component({
    selector: 'app-academy-profile-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, ConfirmDialogModule, DialogModule, FormsModule, IconFieldModule, ImageCropperComponent, InputIconModule, InputTextModule, MenuModule, MessageModule, PageHeader, ProgressBarModule, RadioButtonModule, RouterModule, SelectModule, SkeletonModule, TableModule, TabsModule, TagModule, TextareaModule, ToastModule, TooltipModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <p-toast />
        <p-confirmDialog />
        <p-dialog
            header="Sesión expirada"
            [modal]="true"
            [closable]="false"
            [dismissableMask]="false"
            [visible]="sessionExpiredDialogVisible()"
            (visibleChange)="sessionExpiredDialogVisible.set($event)"
            [style]="{ width: 'min(28rem, calc(100vw - 2rem))' }"
        >
            <p class="m-0 text-sm leading-6 text-slate-600 dark:text-slate-300">Tu sesión expiró. Vuelve a iniciar sesión para continuar.</p>
            <ng-template pTemplate="footer">
                <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <p-button label="Iniciar sesión" styleClass="w-full sm:w-auto" (onClick)="goToLogin()" />
                </div>
            </ng-template>
        </p-dialog>
        <p-dialog
            header="Escudo institucional"
            [modal]="true"
            [closable]="true"
            [dismissableMask]="true"
            [visible]="shieldPreviewDialogVisible"
            (visibleChange)="shieldPreviewDialogVisible = $event"
            [style]="{ width: 'min(32rem, calc(100vw - 2rem))' }"
        >
            @if (shieldPreviewUrl) {
                <div class="flex items-center justify-center">
                    <img [src]="shieldPreviewUrl" alt="Escudo institucional" class="max-h-[70vh] w-full rounded-[1rem] object-contain" />
                </div>
            }
        </p-dialog>
        <app-image-cropper
            #shieldCropper
            title="Ajustar escudo institucional"
            subtitle="Ajusta el encuadre y confirma la imagen que se mostrará en tu academia."
            [maxFileSizeMb]="3"
            [allowedFileExtensions]="['png', 'jpg', 'jpeg', 'svg']"
            (applied)="onShieldApplied($event)"
            (fileError)="onShieldFileError($event)"
        />

        <div class="space-y-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
            <app-page-header [breadcrumbs]="breadcrumbs" title="Academia" subtitle="Actualiza la información principal, fiscal y visual de tu academia."></app-page-header>

            @if (informationLoadError() && activeTab === 'information') {
                <div class="rounded-[0.75rem] border border-rose-200 bg-rose-50 p-5 text-rose-900 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100">
                    <p class="m-0 text-base font-semibold">No pudimos cargar la academia</p>
                    <p class="mt-1 text-sm leading-6">{{ informationLoadError() }}</p>
                    <div class="mt-4">
                        <p-button label="Reintentar" severity="danger" outlined styleClass="w-full sm:w-auto" [loading]="informationLoading()" loadingIcon="pi pi-spinner pi-spin" (onClick)="loadInformation()" />
                    </div>
                </div>
            } @else if (!academy && activeTab === 'information' && !informationLoading()) {
                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Sin academia asociada</p>
                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Este usuario no tiene una academia vinculada. Este panel aplica para owner o administrador de academia.</p>
                </div>
            } @else {
                <div
                    class="mx-auto mt-4 w-full space-y-3 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0"
                    [class.content-width-compact]="activeTab === 'information' || activeTab === 'categories' || activeTab === 'teams'"
                    [class.content-width-comfortable]="activeTab === 'venues'"
                    [class.content-width-full]="activeTab === 'staff'"
                >
                    <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                        <p-tabs [value]="activeTab">
                            <p-tablist class="overflow-x-auto">
                                <p-tab value="information" (click)="onTabClicked('information')">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-building text-sm"></i>
                                        <span>Información</span>
                                    </span>
                                </p-tab>
                                <p-tab value="venues" (click)="onTabClicked('venues')">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-map-marker text-sm"></i>
                                        <span>Sedes</span>
                                    </span>
                                </p-tab>
                                <p-tab value="categories" (click)="onTabClicked('categories')">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-tag text-sm"></i>
                                        <span>Categorías</span>
                                    </span>
                                </p-tab>
                                <p-tab value="teams" (click)="onTabClicked('teams')">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-users text-sm"></i>
                                        <span>Equipos</span>
                                    </span>
                                </p-tab>
                                <p-tab value="staff" (click)="onTabClicked('staff')">
                                    <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                        <i class="pi pi-id-card text-sm"></i>
                                        <span>Staff</span>
                                    </span>
                                </p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel value="information">
                                    <div class="space-y-4 p-3 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:p-4 sm:pb-4">
                                        @if (informationLoading()) {
                                            <div class="space-y-5">
                                                <div class="space-y-3">
                                                    <p-skeleton width="10rem" height="1.1rem"></p-skeleton>
                                                    <p-skeleton width="22rem" height="0.9rem"></p-skeleton>
                                                </div>
                                                <div class="grid grid-cols-12 gap-4">
                                                    <div class="col-span-12 flex flex-col gap-2">
                                                        <p-skeleton width="9rem" height="0.9rem"></p-skeleton>
                                                        <p-skeleton height="2.75rem"></p-skeleton>
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                        <p-skeleton width="8rem" height="0.9rem"></p-skeleton>
                                                        <p-skeleton height="2.75rem"></p-skeleton>
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                        <p-skeleton width="7rem" height="0.9rem"></p-skeleton>
                                                        <p-skeleton height="2.75rem"></p-skeleton>
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                        <p-skeleton width="7rem" height="0.9rem"></p-skeleton>
                                                        <p-skeleton height="2.75rem"></p-skeleton>
                                                    </div>
                                                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                        <p-skeleton width="7rem" height="0.9rem"></p-skeleton>
                                                        <p-skeleton height="2.75rem"></p-skeleton>
                                                    </div>
                                                </div>
                                                <div class="rounded-[0.9rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900/40">
                                                    <div class="flex flex-col gap-2">
                                                        <p-skeleton width="11rem" height="1rem"></p-skeleton>
                                                        <p-skeleton width="18rem" height="0.85rem"></p-skeleton>
                                                    </div>
                                                    <div class="mt-4 rounded-[0.9rem] border border-slate-200 bg-white px-4 py-6 dark:border-surface-700 dark:bg-surface-900">
                                                        <div class="flex flex-col items-center gap-4 text-center sm:gap-5">
                                                            <p-skeleton width="5rem" height="5rem" borderRadius="1rem"></p-skeleton>
                                                            <div class="space-y-2">
                                                                <p-skeleton width="8rem" height="1rem"></p-skeleton>
                                                                <p-skeleton width="10rem" height="0.85rem"></p-skeleton>
                                                            </div>
                                                            <p-skeleton width="100%" height="2.75rem" borderRadius="0.75rem" class="sm:w-[9rem]"></p-skeleton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        <div class="grid grid-cols-12 gap-4" [hidden]="informationLoading()">
                                            <div class="col-span-12">
                                                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Información general</p>
                                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Estos datos identifican a tu academia dentro de la plataforma.</p>
                                            </div>

                                            <div class="col-span-12 flex flex-col gap-2">
                                                <label for="name" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre de la academia <span class="text-rose-500">*</span></label>
                                                <input pInputText id="name" type="text" [(ngModel)]="form.name" name="name" placeholder="Ej. Academia PlayerTech" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onAcademyNameInput($event)" />
                                                @if (showError('name')) {
                                                    <p-message severity="error" size="small">Ingresa el nombre de la academia.</p-message>
                                                }
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="contactEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo principal <span class="text-rose-500">*</span></label>
                                                <input pInputText id="contactEmail" type="text" [(ngModel)]="form.contactEmail" name="contactEmail" placeholder="Ej. contacto@academia.com" class="w-full" (keydown)="onEmailKeydown($event)" (paste)="onEmailPaste($event)" (input)="onEmailInput()" />
                                                @if (showError('contactEmail')) {
                                                    <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                                }
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="phoneNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono <span class="text-rose-500">*</span></label>
                                                <div class="grid grid-cols-12 gap-3">
                                                    <p-select id="countryCode" [(ngModel)]="form.countryCode" name="countryCode" [options]="countryOptions" optionLabel="name" optionValue="dialCode" [filter]="true" filterBy="name,dialCode" placeholder="Código" class="col-span-12 md:col-span-4 w-full">
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
                                                    <input pInputText id="phoneNumber" type="text" [(ngModel)]="form.phoneNumber" name="phoneNumber" placeholder="Ej. 3123456789" class="col-span-12 md:col-span-8 w-full" (input)="onPhoneInput($event)" />
                                                </div>
                                                @if (showError('countryCode') || showError('phoneNumber')) {
                                                    <p-message severity="error" size="small">Ingresa un teléfono válido.</p-message>
                                                }
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="country" class="text-sm font-medium text-surface-700 dark:text-surface-200">País <span class="text-rose-500">*</span></label>
                                                <p-select id="country" [(ngModel)]="form.country" name="country" [options]="countryOptions" optionLabel="name" optionValue="name" [filter]="true" filterBy="name" placeholder="Selecciona país de operación" class="w-full" (onChange)="onLocationCountryChange()" />
                                                @if (showError('country')) {
                                                    <p-message severity="error" size="small">Selecciona el país de operación.</p-message>
                                                }
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="department" class="text-sm font-medium text-surface-700 dark:text-surface-200">Departamento <span class="text-rose-500">*</span></label>
                                                <p-select id="department" [(ngModel)]="form.department" name="department" [options]="departmentOptions" optionLabel="name" optionValue="name" [filter]="true" filterBy="name" placeholder="Selecciona un departamento" class="w-full" (onChange)="onDepartmentChange()" />
                                                @if (showError('department')) {
                                                    <p-message severity="error" size="small">Selecciona el departamento.</p-message>
                                                }
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="city" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad <span class="text-rose-500">*</span></label>
                                                <p-select id="city" [(ngModel)]="form.city" name="city" [options]="departmentCities" placeholder="Selecciona una ciudad" class="w-full" [filter]="true" />
                                                @if (showError('city')) {
                                                    <p-message severity="error" size="small">Selecciona la ciudad.</p-message>
                                                }
                                            </div>

                                            <div class="col-span-12 flex flex-col gap-2">
                                                <label for="address" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección <span class="text-rose-500">*</span></label>
                                                <input pInputText id="address" type="text" [(ngModel)]="form.address" name="address" placeholder="Ej. Calle 10 # 20-30" class="w-full" (keydown)="onAddressKeydown($event)" (paste)="onAddressPaste($event)" (input)="onAddressInput($event)" />
                                                @if (showError('address')) {
                                                    <p-message severity="error" size="small">Ingresa la dirección.</p-message>
                                                }
                                            </div>

                                            <div class="col-span-12 rounded-[0.9rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900/40">
                                                <div class="flex flex-col gap-2">
                                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Escudo institucional</p>
                                                </div>

                                                <div class="mt-4 flex flex-col items-center gap-4 py-1 text-center sm:gap-5">
                                                    @if (shieldPreviewUrl) {
                                                        <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50 transition hover:opacity-95 dark:border-surface-700 dark:bg-surface-800 sm:h-28 sm:w-28">
                                                            <img [src]="shieldPreviewUrl" alt="Escudo institucional" class="h-full w-full cursor-pointer object-cover" (click)="openShieldPreviewDialog()" />
                                                        </div>
                                                    } @else {
                                                        <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50 text-sky-700 dark:border-surface-700 dark:bg-surface-800 sm:h-24 sm:w-24">
                                                            <i class="pi pi-image text-2xl text-slate-400"></i>
                                                        </div>
                                                    }

                                                    <input #shieldInput type="file" accept="image/png,image/jpeg,image/jpg,image/svg+xml" class="hidden" (change)="onShieldSelected($event)" />
                                                    @if (shieldPreviewUrl) {
                                                        <div class="flex flex-wrap justify-center gap-2">
                                                            <p-button label="Ver imagen" icon="pi pi-search" styleClass="w-full sm:w-auto" severity="secondary" text [disabled]="shieldUploadSaving || shieldDeleteSaving" (onClick)="openShieldPreviewDialog()" />
                                                            <p-button label="Cambiar imagen" icon="pi pi-refresh" styleClass="w-full sm:w-auto" severity="secondary" text [disabled]="shieldUploadSaving || shieldDeleteSaving" (onClick)="shieldInput.click()" />
                                                            <p-button label="Quitar imagen" icon="pi pi-trash" styleClass="w-full sm:w-auto" severity="danger" text [loading]="shieldDeleteSaving" loadingIcon="pi pi-spinner pi-spin" [disabled]="shieldUploadSaving || shieldDeleteSaving" (onClick)="removeShield()" />
                                                        </div>
                                                    } @else {
                                                        <p-button label="Seleccionar archivo" icon="pi pi-upload" styleClass="w-full sm:w-auto" severity="secondary" [disabled]="shieldUploadSaving || shieldDeleteSaving" (onClick)="shieldInput.click()" />
                                                    }

                                                    <p class="m-0 max-w-[18rem] text-center text-xs leading-5 text-slate-500 dark:text-slate-400">Archivos permitidos: PNG, JPG, JPEG o SVG. Tamaño máximo: 3 MB.</p>

                                                    @if (hasPendingShieldChanges) {
                                                        <div class="mt-1 w-full text-left">
                                                            @if (shieldUploadSaving) {
                                                                <div class="space-y-1">
                                                                    <div class="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                                        <i class="pi pi-spinner pi-spin"></i>
                                                                        <span>Guardando...</span>
                                                                    </div>
                                                                    <p-progressBar mode="indeterminate" [style]="{ height: '0.25rem' }" />
                                                                </div>
                                                            } @else {
                                                                <div class="flex w-full justify-center">
                                                                    <p-button label="Guardar escudo" icon="pi pi-upload" styleClass="w-full sm:w-auto" [loading]="shieldUploadSaving" loadingIcon="pi pi-spinner pi-spin" [disabled]="shieldUploadSaving || shieldDeleteSaving || !shieldCroppedBlob" (onClick)="saveShield()" />
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                    </div>

                                    @if (informationLoading()) {
                                        <div class="sticky bottom-0 z-10 bg-white/95 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm dark:bg-surface-900/95 sm:static sm:bg-transparent sm:py-4 sm:backdrop-blur-0">
                                            <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                                <p-skeleton width="7rem" height="2.75rem" borderRadius="0.75rem"></p-skeleton>
                                                <p-skeleton width="9rem" height="2.75rem" borderRadius="0.75rem"></p-skeleton>
                                            </div>
                                        </div>
                                    } @else {
                                        <div class="sticky bottom-0 z-10 bg-white/95 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm dark:bg-surface-900/95 sm:static sm:bg-transparent sm:py-4 sm:backdrop-blur-0">
                                            <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                                <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" [disabled]="informationLoading()" routerLink="/" />
                                                <p-button label="Guardar datos" icon="pi pi-check" styleClass="w-full sm:w-auto" [loading]="saving" loadingIcon="pi pi-spinner pi-spin" [disabled]="saving || informationLoading()" (onClick)="save()" />
                                            </div>
                                        </div>
                                    }
                                    </div>
                                </p-tabpanel>

                                <p-tabpanel value="venues">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4">
                                            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div class="space-y-1">
                                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Sedes</p>
                                                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Administra las sedes donde opera la academia.</p>
                                                </div>
                                                <div class="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">
                                                    <p-button label="Agregar sede" icon="pi pi-plus" styleClass="w-full md:min-w-[11.5rem] md:w-auto" (onClick)="openVenueDialog()" />
                                                </div>
                                            </div>
                                        </div>

                                        @if (venueLoading()) {
                                            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
                                                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                                        <p-skeleton width="14rem" height="1.1rem"></p-skeleton>
                                                        <p-skeleton width="10rem" height="2.25rem" borderRadius="0.75rem"></p-skeleton>
                                                    </div>
                                                </div>
                                                <div class="p-3 sm:p-4">
                                                    <div class="space-y-3">
                                                        @for (row of [1, 2, 3, 4]; track row) {
                                                            <div class="grid grid-cols-12 gap-3 rounded-[0.75rem] border border-slate-100 p-3 dark:border-surface-800">
                                                                <div class="col-span-12 md:col-span-4"><p-skeleton width="70%" height="1rem"></p-skeleton></div>
                                                                <div class="col-span-6 md:col-span-2"><p-skeleton width="85%" height="1rem"></p-skeleton></div>
                                                                <div class="col-span-6 md:col-span-2"><p-skeleton width="75%" height="1rem"></p-skeleton></div>
                                                                <div class="col-span-6 md:col-span-2"><p-skeleton width="65%" height="1rem"></p-skeleton></div>
                                                                <div class="col-span-6 md:col-span-2 flex justify-end"><p-skeleton width="2.5rem" height="2.5rem" borderRadius="9999px"></p-skeleton></div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div class="flex flex-col gap-3 border-t border-slate-200 px-3 py-3 dark:border-surface-700 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                                                    <div class="flex items-center gap-2">
                                                        <p-skeleton width="11rem" height="0.9rem"></p-skeleton>
                                                        <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                    </div>
                                                    <div class="flex items-center gap-2">
                                                        <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                        <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                        <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                        <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                        <p-skeleton width="3.75rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                        <p-skeleton width="4rem" height="0.9rem"></p-skeleton>
                                                    </div>
                                                </div>
                                            </div>
                                        } @else if (venueError()) {
                                            <div class="rounded-[0.75rem] border border-rose-200 bg-rose-50 p-5 text-rose-900 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100">
                                                <p class="m-0 text-base font-semibold">No pudimos cargar las sedes</p>
                                                <p class="mt-1 text-sm leading-6">{{ venueError() }}</p>
                                                <div class="mt-4">
                                                    <p-button label="Reintentar" severity="danger" outlined styleClass="w-full sm:w-auto" [loading]="venueLoading()" loadingIcon="pi pi-spinner pi-spin" (onClick)="loadVenues()" />
                                                </div>
                                            </div>
                                        } @else {
                                            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
                                            <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                                    <p-iconfield iconPosition="left" class="w-full sm:max-w-md">
                                                        <p-inputicon styleClass="pi pi-search" />
                                                        <input pInputText type="text" [(ngModel)]="venueSearch" placeholder="Buscar por nombre o descripción" class="w-full" />
                                                    </p-iconfield>
                                                </div>
                                            </div>

                                            <p-table
                                                [value]="filteredVenues"
                                                [tableStyle]="{ 'min-width': '100%' }"
                                                responsiveLayout="scroll"
                                                styleClass="text-sm"
                                                [paginator]="true"
                                                [rows]="venueRows"
                                                [first]="(venuePage - 1) * venueRows"
                                                [totalRecords]="venueTotalRecords"
                                                [rowsPerPageOptions]="[10, 20, 50]"
                                                paginatorDropdownAppendTo="body"
                                                [loading]="venueLoading()"
                                                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} sedes"
                                                [showCurrentPageReport]="true"
                                                (onPage)="onVenuePageChange($event)"
                                            >
                                                <ng-template pTemplate="header">
                                                    <tr>
                                                        <th class="w-[40%]">Nombre</th>
                                                        <th class="w-[18%]">Ciudad</th>
                                                        <th class="w-[18%]">Teléfono</th>
                                                        <th class="w-[12%]">Estado</th>
                                                        <th class="w-[12%] text-right">Acciones</th>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="body" let-venue>
                                                    <tr>
                                                        <td class="align-top">
                                                            <div class="flex flex-col gap-1">
                                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ venue.name }}</span>
                                                                <span class="text-sm text-slate-500 dark:text-slate-400">{{ getVenueLocationSummary(venue) }}</span>
                                                            </div>
                                                        </td>
                                                        <td class="align-top">
                                                            <span class="text-surface-900 dark:text-surface-0">{{ venue.city || '-' }}</span>
                                                        </td>
                                                        <td class="align-top">
                                                            <span class="text-surface-900 dark:text-surface-0">{{ venue.phone || '-' }}</span>
                                                        </td>
                                                        <td class="align-top">
                                                            <div class="inline-flex items-center gap-2">
                                                                <p-tag [value]="getVenueStatusLabel(venue.status)" [severity]="getVenueStatusSeverity(venue.status)" />
                                                                @if (venueStatusUpdatingId === venue.id) {
                                                                    <i class="pi pi-spinner pi-spin text-sm text-slate-500 dark:text-slate-400" aria-hidden="true"></i>
                                                                }
                                                            </div>
                                                        </td>
                                                        <td class="align-top">
                                                            <div class="flex justify-end">
                                                                <p-menu #venueActionsMenu [popup]="true" appendTo="body" [model]="venueActionItems"></p-menu>
                                                                <p-button
                                                                    icon="pi pi-ellipsis-h"
                                                                    [text]="true"
                                                                    rounded
                                                                    severity="secondary"
                                                                    [disabled]="venueStatusUpdatingId === venue.id"
                                                                    (onClick)="openVenueActionsMenu($event, venueActionsMenu, venue)"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="emptymessage">
                                                    <tr>
                                                        <td colspan="5" class="py-10 text-center">
                                                            <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                                <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay sedes registradas</span>
                                                                <span>Agrega la primera sede para empezar a organizar la operación de la academia.</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </ng-template>
                                            </p-table>
                                        </div>
                                        }
                                    </div>
                                </p-tabpanel>

                                <p-tabpanel value="categories">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4">
                                            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div class="space-y-1">
                                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Categorías</p>
                                                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Organiza jugadores y equipos según las edades que manejará la academia.</p>
                                                </div>
                                                <div class="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">
                                                    <p-button label="Nueva categoría" icon="pi pi-plus" styleClass="w-full md:min-w-[11.5rem] md:w-auto" (onClick)="openCategoryDialog()" />
                                                </div>
                                            </div>
                                        </div>

                                        @if (categoryLoading()) {
                                            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
                                                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                    <div class="flex items-center justify-between gap-3">
                                                        <p-skeleton width="14rem" height="1rem"></p-skeleton>
                                                        <p-skeleton width="10rem" height="2.75rem" borderRadius="0.75rem"></p-skeleton>
                                                    </div>
                                                </div>

                                                <div class="space-y-3 p-3 sm:p-4">
                                                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4">
                                                        <div class="grid grid-cols-12 items-center gap-4">
                                                            <div class="col-span-12 md:col-span-4"><p-skeleton width="70%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="85%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="75%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="65%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2 flex justify-end"><p-skeleton width="2.5rem" height="2.5rem" borderRadius="9999px"></p-skeleton></div>
                                                        </div>
                                                    </div>
                                                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4">
                                                        <div class="grid grid-cols-12 items-center gap-4">
                                                            <div class="col-span-12 md:col-span-4"><p-skeleton width="70%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="85%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="75%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="65%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2 flex justify-end"><p-skeleton width="2.5rem" height="2.5rem" borderRadius="9999px"></p-skeleton></div>
                                                        </div>
                                                    </div>
                                                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4">
                                                        <div class="grid grid-cols-12 items-center gap-4">
                                                            <div class="col-span-12 md:col-span-4"><p-skeleton width="70%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="85%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="75%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="65%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2 flex justify-end"><p-skeleton width="2.5rem" height="2.5rem" borderRadius="9999px"></p-skeleton></div>
                                                        </div>
                                                    </div>
                                                    <div class="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4">
                                                        <div class="grid grid-cols-12 items-center gap-4">
                                                            <div class="col-span-12 md:col-span-4"><p-skeleton width="70%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="85%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="75%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2"><p-skeleton width="65%" height="1rem"></p-skeleton></div>
                                                            <div class="col-span-6 md:col-span-2 flex justify-end"><p-skeleton width="2.5rem" height="2.5rem" borderRadius="9999px"></p-skeleton></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="border-t border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                    <div class="flex items-center justify-between gap-3">
                                                        <p-skeleton width="11rem" height="0.9rem"></p-skeleton>
                                                        <div class="flex items-center gap-2">
                                                            <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                            <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                            <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                            <p-skeleton width="2.25rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                            <p-skeleton width="3.75rem" height="2rem" borderRadius="0.75rem"></p-skeleton>
                                                            <p-skeleton width="4rem" height="0.9rem"></p-skeleton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        } @else if (categoryError()) {
                                            <div class="rounded-[0.75rem] border border-rose-200 bg-rose-50 p-5 text-rose-900 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100">
                                                <p class="m-0 text-base font-semibold">No pudimos cargar las categorías</p>
                                                <p class="mt-1 text-sm leading-6">{{ categoryError() }}</p>
                                                <div class="mt-4">
                                                    <p-button label="Reintentar" severity="danger" outlined styleClass="w-full sm:w-auto" [loading]="categoryLoading()" loadingIcon="pi pi-spinner pi-spin" (onClick)="loadCategories()" />
                                                </div>
                                            </div>
                                        } @else {
                                            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
                                                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                                        <p-iconfield iconPosition="left" class="w-full sm:max-w-md">
                                                            <p-inputicon styleClass="pi pi-search" />
                                                            <input pInputText type="text" [(ngModel)]="categorySearch" placeholder="Buscar por nombre, clave o descripción" class="w-full" />
                                                        </p-iconfield>
                                                        <button
                                                            type="button"
                                                            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-surface-700 dark:text-slate-400 dark:hover:border-surface-500 dark:hover:text-slate-200"
                                                            pTooltip="Busca por nombre, clave o descripción."
                                                            tooltipPosition="left"
                                                            aria-label="Ayuda de búsqueda"
                                                        >
                                                            <i class="pi pi-info-circle text-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                <p-table
                                                    [value]="filteredCategories"
                                                    [tableStyle]="{ 'min-width': '100%' }"
                                                    responsiveLayout="scroll"
                                                    styleClass="text-sm"
                                                    [paginator]="true"
                                                    [rows]="categoryRows"
                                                    [first]="(categoryPage - 1) * categoryRows"
                                                    [totalRecords]="categoryTotalRecords"
                                                    [rowsPerPageOptions]="[10, 20, 50]"
                                                    [paginatorDropdownAppendTo]="'body'"
                                                    (onPage)="onCategoryPageChange($event)"
                                                >
                                                    <ng-template pTemplate="header">
                                                        <tr>
                                                            <th>Nombre</th>
                                                            <th>Edad</th>
                                                            <th>Estado</th>
                                                            <th class="text-right">Acciones</th>
                                                        </tr>
                                                    </ng-template>
                                                    <ng-template pTemplate="body" let-category>
                                                        <tr class="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-surface-800/70" (click)="openCategoryDetail(category)">
                                                            <td>
                                                                <div class="flex flex-col gap-1">
                                                                    <span class="font-medium text-surface-900 dark:text-surface-0">{{ category.name }}</span>
                                                                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ category.description || '-' }}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="flex flex-col gap-1">
                                                                    <span class="text-surface-900 dark:text-surface-0">{{ getCategoryAgeRangeLabel(category) }}</span>
                                                                    <span class="text-xs text-slate-500 dark:text-slate-400">{{ category.categoryKey || '-' }}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p-tag [value]="getCategoryStatusLabel(category.status)" [severity]="getCategoryStatusSeverity(category.status)" />
                                                            </td>
                                                            <td>
                                                                <div class="flex justify-end" (click)="$event.stopPropagation()">
                                                                    <p-menu #categoryActionsMenu [popup]="true" appendTo="body" [model]="categoryActionItems"></p-menu>
                                                                    <p-button
                                                                        icon="pi pi-ellipsis-h"
                                                                        [text]="true"
                                                                        rounded
                                                                        severity="secondary"
                                                                        [disabled]="categoryStatusUpdatingId === category.id"
                                                                        [loading]="categoryStatusUpdatingId === category.id"
                                                                        loadingIcon="pi pi-spinner pi-spin"
                                                                        (onClick)="openCategoryActionsMenu($event, categoryActionsMenu, category)"
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </ng-template>
                                                    <ng-template pTemplate="emptymessage">
                                                        <tr>
                                                            <td colspan="4" class="py-10 text-center">
                                                                <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay categorías registradas</span>
                                                                    <span>Crea la primera categoría para empezar a ordenar jugadores y equipos por edad.</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </ng-template>
                                                </p-table>
                                            </div>
                                        }
                                    </div>
                                </p-tabpanel>

                                <p-tabpanel value="teams">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4">
                                            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div class="space-y-1">
                                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Equipos</p>
                                                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Crea y organiza los equipos que participarán en cada categoría de la academia.</p>
                                                </div>
                                                <div class="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">
                                                    <p-button label="Nuevo equipo" icon="pi pi-plus" styleClass="w-full md:min-w-[11.5rem] md:w-auto" (onClick)="openTeamDialog()" />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
                                            <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                                    <p-iconfield iconPosition="left" class="w-full sm:max-w-md">
                                                        <p-inputicon styleClass="pi pi-search" />
                                                        <input pInputText type="text" [(ngModel)]="teamSearch" placeholder="Buscar por nombre o categoría" class="w-full" />
                                                    </p-iconfield>
                                                    <button
                                                        type="button"
                                                        class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-surface-700 dark:text-slate-400 dark:hover:border-surface-500 dark:hover:text-slate-200"
                                                        pTooltip="Busca por nombre o categoría."
                                                        tooltipPosition="left"
                                                        aria-label="Ayuda de búsqueda"
                                                    >
                                                        <i class="pi pi-info-circle text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <p-table [value]="filteredTeams" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                                                <ng-template pTemplate="header">
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Categoría</th>
                                                        <th>Estado</th>
                                                        <th class="text-right">Acciones</th>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="body" let-team>
                                                    <tr class="cursor-pointer transition hover:bg-slate-50 dark:hover:bg-surface-800/70" (click)="openTeamDialog(team)">
                                                        <td>
                                                            <span class="font-medium text-surface-900 dark:text-surface-0">{{ team.name }}</span>
                                                        </td>
                                                        <td>
                                                            <span class="text-surface-900 dark:text-surface-0">{{ team.categoryName }}</span>
                                                        </td>
                                                        <td>
                                                            <p-tag [value]="getTeamStatusLabel(team.status)" [severity]="getTeamStatusSeverity(team.status)" />
                                                        </td>
                                                        <td>
                                                            <div class="flex justify-end" (click)="$event.stopPropagation()">
                                                                <p-menu #teamActionsMenu [popup]="true" appendTo="body" [model]="teamActionItems"></p-menu>
                                                                <p-button icon="pi pi-ellipsis-h" [text]="true" rounded severity="secondary" (onClick)="openTeamActionsMenu($event, teamActionsMenu, team)" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="emptymessage">
                                                    <tr>
                                                        <td colspan="4" class="py-10 text-center">
                                                            <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                                <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay equipos registrados</span>
                                                                <span>Crea el primer equipo para empezar a ordenar la operación deportiva por categoría.</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </ng-template>
                                            </p-table>
                                        </div>
                                    </div>
                                </p-tabpanel>

                                <p-tabpanel value="staff">
                                    <div class="space-y-4 p-3 sm:p-4">
                                        <div class="rounded-[0.75rem] border border-slate-200 bg-white px-3 py-3 dark:border-surface-700 dark:bg-surface-900 sm:px-4">
                                            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div class="space-y-1">
                                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Staff</p>
                                                    <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Registra entrenadores y administradores deportivos con acceso a la plataforma antes de asignarlos a equipos.</p>
                                                </div>
                                                <div class="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-end">
                                                    <p-button label="Agregar staff" icon="pi pi-plus" styleClass="w-full md:min-w-[11.5rem] md:w-auto" (onClick)="openStaffDialog()" />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
                                            <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <p-iconfield iconPosition="left" class="w-full sm:max-w-md">
                                                        <p-inputicon styleClass="pi pi-search" />
                                                        <input pInputText type="text" [(ngModel)]="staffSearch" placeholder="Buscar por nombre o correo" class="w-full" />
                                                    </p-iconfield>
                                                    <div class="flex items-center gap-2 self-start sm:self-auto">
                                                        <button
                                                            type="button"
                                                            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 dark:border-surface-700 dark:text-slate-400 dark:hover:border-surface-500 dark:hover:text-slate-200"
                                                            pTooltip="Desde aquí registras el staff. La asignación a equipos se hace dentro del detalle de cada equipo."
                                                            tooltipPosition="left"
                                                            aria-label="Ayuda de staff"
                                                        >
                                                            <i class="pi pi-info-circle text-sm"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <p-table [value]="filteredStaffMembers" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                                                <ng-template pTemplate="header">
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Correo</th>
                                                        <th>Rol del sistema</th>
                                                        <th>Estado</th>
                                                        <th class="text-right">Acciones</th>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="body" let-staff>
                                                    <tr>
                                                        <td>
                                                            <span class="font-medium text-surface-900 dark:text-surface-0">{{ staff.fullName }}</span>
                                                        </td>
                                                        <td>
                                                            <span class="text-surface-900 dark:text-surface-0">{{ staff.email }}</span>
                                                        </td>
                                                        <td>
                                                            <span class="text-surface-900 dark:text-surface-0">{{ getSystemRoleLabel(staff.role) }}</span>
                                                        </td>
                                                        <td>
                                                            <p-tag [value]="getStaffStatusLabel(staff.status)" [severity]="getStaffStatusSeverity(staff.status)" />
                                                        </td>
                                                        <td>
                                                            <div class="flex justify-end gap-2">
                                                                <p-menu #staffActionsMenu [popup]="true" appendTo="body" [model]="staffActionItems"></p-menu>
                                                                <p-button icon="pi pi-ellipsis-h" [text]="true" rounded severity="secondary" (onClick)="openStaffActionsMenu($event, staffActionsMenu, staff)" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="emptymessage">
                                                    <tr>
                                                        <td colspan="5" class="py-10 text-center">
                                                            <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                                <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay staff registrado</span>
                                                                <span>Crea el primer miembro del staff para luego asignarlo a uno o varios equipos.</span>
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

                <p-dialog [(visible)]="venueDialogVisible" [modal]="true" [draggable]="false" [resizable]="false" [style]="{ width: '34rem' }" [breakpoints]="{ '960px': '42rem', '640px': '96vw' }" [header]="venueDialogMode === 'create' ? 'Agregar sede' : 'Editar sede'" (onHide)="resetVenueDialog()">
                    <div class="space-y-4">
                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Completa la información principal para registrar esta sede.</p>

                        <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="venueName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre de la sede <span class="text-rose-500">*</span></label>
                                    <input pInputText id="venueName" type="text" [(ngModel)]="venueForm.name" placeholder="Ej. Sede Norte" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onVenueNameInput($event)" />
                                    @if (showVenueError('name')) {
                                        <p-message severity="error" size="small">Ingresa el nombre de la sede.</p-message>
                                    }
                                </div>

                                <div class="hidden">
                                    <label for="venueCountry" class="text-sm font-medium text-surface-700 dark:text-surface-200">País</label>
                                    <p-select id="venueCountry" [(ngModel)]="venueForm.country" name="venueCountry" [options]="countryOptions" optionLabel="name" optionValue="name" [filter]="true" filterBy="name,dialCode" placeholder="Selecciona país" class="w-full" appendTo="body" (onChange)="onVenueLocationCountryChange()" />
                                </div>

                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="venuePhoneNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono <span class="text-slate-500">(opcional)</span></label>
                                    <div class="grid grid-cols-12 gap-3">
                                        <p-select id="venueCountryCode" [(ngModel)]="venueForm.countryCode" name="venueCountryCode" [options]="countryOptions" optionLabel="dialCode" optionValue="dialCode" [filter]="true" filterBy="name,dialCode" placeholder="Código" class="col-span-12 sm:col-span-4 md:col-span-3 lg:col-span-3 w-full min-w-0" appendTo="body">
                                            <ng-template #selectedItem let-option>
                                                <span class="flex items-center gap-2">
                                                    <img [src]="option?.flagFile ?? fallbackFlag" [alt]="option?.name ?? 'País'" class="h-4 w-6 rounded-sm object-cover" />
                                                    <span>{{ option?.dialCode ?? 'Código' }}</span>
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
                                        <input pInputText id="venuePhoneNumber" type="text" [(ngModel)]="venueForm.phoneNumber" name="venuePhoneNumber" placeholder="Ej. 3123456789" class="col-span-12 sm:col-span-8 md:col-span-9 lg:col-span-9 w-full min-w-0" (input)="onVenuePhoneNumberInput($event)" />
                                    </div>
                                    @if (showVenueError('countryCode') || showVenueError('phoneNumber')) {
                                        <p-message severity="error" size="small">Ingresa un teléfono válido.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="venueDepartment" class="text-sm font-medium text-surface-700 dark:text-surface-200">Departamento <span class="text-slate-500">(opcional)</span></label>
                                    <p-select id="venueDepartment" [(ngModel)]="venueForm.department" name="venueDepartment" [options]="venueDepartmentOptions" optionLabel="name" optionValue="name" [filter]="true" filterBy="name" placeholder="Selecciona departamento" class="w-full" appendTo="body" (onChange)="onVenueDepartmentChange()" />
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="venueCity" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad <span class="text-slate-500">(opcional)</span></label>
                                    <p-select id="venueCity" [(ngModel)]="venueForm.city" name="venueCity" [options]="venueCities" placeholder="Selecciona ciudad" class="w-full" appendTo="body" [filter]="true" />
                                </div>

                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="venueAddress" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección <span class="text-slate-500">(opcional)</span></label>
                                    <input pInputText id="venueAddress" type="text" [(ngModel)]="venueForm.address" placeholder="Ej. Calle 20 # 15-40" class="w-full" (keydown)="onAddressKeydown($event)" (paste)="onAddressPaste($event)" (input)="onVenueAddressInput($event)" />
                                </div>
                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="venueNotes" class="text-sm font-medium text-surface-700 dark:text-surface-200">Notas <span class="text-slate-500">(opcional)</span></label>
                                    <textarea pTextarea id="venueNotes" [(ngModel)]="venueForm.notes" rows="3" placeholder="Notas internas o referencias operativas" class="w-full"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ng-template pTemplate="footer">
                        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="resetVenueDialog()" />
                            <p-button [label]="venueDialogMode === 'create' ? 'Crear sede' : 'Guardar cambios'" styleClass="w-full sm:w-auto" [loading]="venueSaving" loadingIcon="pi pi-spinner pi-spin" (onClick)="saveVenue()" />
                        </div>
                    </ng-template>
                </p-dialog>
                <p-dialog [(visible)]="venueDetailVisible" [modal]="true" [draggable]="false" [resizable]="false" [style]="{ width: '34rem' }" [breakpoints]="{ '960px': '42rem', '640px': '96vw' }" header="Detalle de sede" (onHide)="venueDetailVisible = false">
                    @if (selectedVenue) {
                        <div class="space-y-4 text-sm">
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Nombre</p>
                                <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ selectedVenue.name }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Dirección</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedVenue.address || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Ciudad</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedVenue.city || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">País</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedVenue.country || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Departamento</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedVenue.department || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Teléfono</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedVenue.phone || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Notas</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedVenue.notes || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Sede principal</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedVenue.isPrimary ? 'Sí' : 'No' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Estado</p>
                                <p-tag [value]="getVenueStatusLabel(selectedVenue.status)" [severity]="getVenueStatusSeverity(selectedVenue.status)" />
                            </div>
                        </div>
                    }
                </p-dialog>

                <p-dialog
                    [(visible)]="categoryDialogVisible"
                    [modal]="true"
                    [draggable]="false"
                    [resizable]="false"
                    [style]="{ width: '34rem' }"
                    [breakpoints]="{ '960px': '42rem', '640px': '96vw' }"
                    [header]="categoryDialogMode === 'create' ? 'Nueva categoría' : 'Editar categoría'"
                    (onHide)="resetCategoryDialog()"
                >
                    <div class="space-y-3">
                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Completa el nombre, la clave y el rango de edad para dejar lista esta categoría.</p>

                        <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="categoryName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre de la categoría <span class="text-rose-500">*</span></label>
                                    <input pInputText id="categoryName" type="text" [(ngModel)]="categoryForm.name" placeholder="Ej. Sub 12" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onCategoryNameInput($event)" />
                                    @if (showCategoryError('name')) {
                                        <p-message severity="error" size="small">Ingresa el nombre de la categoría.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="minAge" class="text-sm font-medium text-surface-700 dark:text-surface-200">Edad mínima <span class="text-rose-500">*</span></label>
                                    <input pInputText id="minAge" type="text" inputmode="numeric" maxlength="2" [(ngModel)]="categoryForm.minAge" placeholder="Ej. 11" class="w-full" (input)="onCategoryAgeInput('minAge', $event)" />
                                    <p class="m-0 text-xs text-slate-500 dark:text-slate-400">Mínimo 4 años, máximo 99.</p>
                                    @if (showCategoryError('minAge')) {
                                        <p-message severity="error" size="small">La edad mínima debe estar entre 4 y 99 años.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="maxAge" class="text-sm font-medium text-surface-700 dark:text-surface-200">Edad máxima <span class="text-rose-500">*</span></label>
                                    <input pInputText id="maxAge" type="text" inputmode="numeric" maxlength="2" [(ngModel)]="categoryForm.maxAge" placeholder="Ej. 12" class="w-full" (input)="onCategoryAgeInput('maxAge', $event)" />
                                    <p class="m-0 text-xs text-slate-500 dark:text-slate-400">Debe ser igual o mayor que la edad mínima.</p>
                                    @if (showCategoryError('maxAge')) {
                                        <p-message severity="error" size="small">La edad máxima debe estar entre 4 y 99 años y no puede ser menor que la mínima.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="categoryDescription" class="text-sm font-medium text-surface-700 dark:text-surface-200">Descripción <span class="text-slate-500">(opcional)</span></label>
                                    <textarea pTextarea id="categoryDescription" [(ngModel)]="categoryForm.description" rows="3" placeholder="Opcional" class="w-full resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ng-template pTemplate="footer">
                        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="resetCategoryDialog()" />
                            <p-button [label]="categoryDialogMode === 'create' ? 'Crear categoría' : 'Guardar cambios'" styleClass="w-full sm:w-auto" [loading]="categorySaving" loadingIcon="pi pi-spinner pi-spin" (onClick)="saveCategory()" />
                        </div>
                    </ng-template>
                </p-dialog>

                <p-dialog [(visible)]="categoryDetailVisible" [modal]="true" [draggable]="false" [resizable]="false" [style]="{ width: '34rem' }" [breakpoints]="{ '960px': '42rem', '640px': '96vw' }" header="Detalle de categoría" (onHide)="categoryDetailVisible = false">
                    @if (selectedCategory) {
                        <div class="space-y-4 text-sm">
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Nombre</p>
                                <p class="m-0 font-medium text-surface-900 dark:text-surface-0">{{ selectedCategory.name }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Clave</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedCategory.categoryKey || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Academia</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedCategory.academyId || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Edad mínima</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedCategory.minAge ?? '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Edad máxima</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedCategory.maxAge ?? '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Descripción</p>
                                <p class="m-0 text-surface-900 dark:text-surface-0">{{ selectedCategory.description || '-' }}</p>
                            </div>
                            <div>
                                <p class="m-0 text-xs uppercase tracking-wide text-slate-500">Estado</p>
                                <p-tag [value]="getCategoryStatusLabel(selectedCategory.status)" [severity]="getCategoryStatusSeverity(selectedCategory.status)" />
                            </div>
                        </div>
                    }

                    <ng-template pTemplate="footer">
                        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <p-button label="Editar" severity="secondary" outlined styleClass="w-full sm:w-auto" (onClick)="selectedCategory && openCategoryDialog(selectedCategory)" />
                            <p-button
                                [label]="selectedCategory?.status === 'ACTIVE' ? 'Desactivar' : 'Activar'"
                                styleClass="w-full sm:w-auto"
                                [severity]="selectedCategory?.status === 'ACTIVE' ? 'danger' : 'primary'"
                                [loading]="selectedCategory ? categoryStatusUpdatingId === selectedCategory.id : false"
                                loadingIcon="pi pi-spinner pi-spin"
                                (onClick)="selectedCategory && toggleCategoryStatus(selectedCategory)"
                            />
                        </div>
                    </ng-template>
                </p-dialog>

                <p-dialog
                    [(visible)]="teamDialogVisible"
                    [modal]="true"
                    [draggable]="false"
                    [resizable]="false"
                    [style]="{ width: '34rem' }"
                    [breakpoints]="{ '960px': '42rem', '640px': '96vw' }"
                    [header]="teamDialogMode === 'create' ? 'Nuevo equipo' : 'Editar equipo'"
                    (onHide)="resetTeamDialog()"
                >
                    <div class="space-y-3">
                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Completa el nombre y selecciona la categoría a la que pertenece este equipo.</p>

                        <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="teamName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del equipo <span class="text-rose-500">*</span></label>
                                    <input pInputText id="teamName" type="text" [(ngModel)]="teamForm.name" placeholder="Ej. Sub 12 A" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onTeamNameInput($event)" />
                                    @if (showTeamError('name')) {
                                        <p-message severity="error" size="small">Ingresa el nombre del equipo.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="teamCategoryId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Categoría <span class="text-rose-500">*</span></label>
                                    <p-select
                                        id="teamCategoryId"
                                        [(ngModel)]="teamForm.categoryId"
                                        [options]="activeCategoryOptions"
                                        optionLabel="name"
                                        optionValue="id"
                                        [filter]="true"
                                        filterBy="name"
                                        placeholder="Selecciona una categoría"
                                        class="w-full"
                                        appendTo="body"
                                        [scrollHeight]="'16rem'"
                                    />
                                    @if (showTeamError('categoryId')) {
                                        <p-message severity="error" size="small">Selecciona una categoría.</p-message>
                                    }
                                </div>
                            </div>
                        </div>

                        @if (teamDialogMode === 'edit' && selectedTeam) {
                            <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
                                <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4 sm:py-4">
                                    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div class="space-y-1.5">
                                            <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Cuerpo técnico</p>
                                            <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Asigna y organiza las personas que acompañan la operación técnica de este equipo.</p>
                                        </div>
                                        <div class="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                                            <p-button label="Asignar" icon="pi pi-plus" severity="secondary" [outlined]="true" styleClass="w-full sm:w-auto" (onClick)="openTeamStaffDialog()" />
                                        </div>
                                    </div>
                                </div>

                                <p-table [value]="selectedTeamStaffAssignments" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                                    <ng-template pTemplate="header">
                                        <tr>
                                            <th>Miembro</th>
                                            <th>Rol técnico</th>
                                            <th>Estado</th>
                                            <th class="text-right">Acciones</th>
                                        </tr>
                                    </ng-template>
                                    <ng-template pTemplate="body" let-assignment>
                                        <tr>
                                            <td>
                                                <div class="flex flex-col gap-1">
                                                    <span class="font-medium text-surface-900 dark:text-surface-0">{{ assignment.fullName }}</span>
                                                    <span class="text-sm text-slate-500 dark:text-slate-400">{{ assignment.email }}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="text-surface-900 dark:text-surface-0">{{ getTechnicalRoleLabel(assignment.role) }}</span>
                                            </td>
                                            <td>
                                                <p-tag [value]="getStaffAssignmentStatusLabel(assignment.status)" [severity]="getStaffAssignmentStatusSeverity(assignment.status)" />
                                            </td>
                                            <td>
                                                <div class="flex justify-end">
                                                    <p-menu #teamStaffActionsMenu [popup]="true" appendTo="body" [model]="teamStaffActionItems"></p-menu>
                                                    <p-button icon="pi pi-ellipsis-h" [text]="true" rounded severity="secondary" (onClick)="openTeamStaffActionsMenu($event, teamStaffActionsMenu, assignment)" />
                                                </div>
                                            </td>
                                        </tr>
                                    </ng-template>
                                    <ng-template pTemplate="emptymessage">
                                        <tr>
                                            <td colspan="4" class="py-10 text-center">
                                                <div class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">Todavía no hay integrantes asignados</span>
                                                    <span>Asigna el primer integrante del cuerpo técnico para este equipo.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                        } @else if (teamDialogMode === 'create') {
                            <div class="rounded-[0.75rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500 dark:border-surface-700 dark:bg-surface-900/50 dark:text-slate-400">
                                Guarda primero el equipo para luego asignar su cuerpo técnico desde este mismo detalle.
                            </div>
                        }
                    </div>

                    <ng-template pTemplate="footer">
                        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="resetTeamDialog()" />
                            <p-button [label]="teamDialogMode === 'create' ? 'Crear equipo' : 'Guardar cambios'" styleClass="w-full sm:w-auto" (onClick)="saveTeam()" />
                        </div>
                    </ng-template>
                </p-dialog>

                <p-dialog
                    [(visible)]="teamStaffDialogVisible"
                    [modal]="true"
                    [draggable]="false"
                    [resizable]="false"
                    [style]="{ width: '34rem' }"
                    [breakpoints]="{ '960px': '42rem', '640px': '96vw' }"
                    [header]="teamStaffDialogMode === 'create' ? 'Asignar staff' : 'Editar rol técnico'"
                    (onHide)="resetTeamStaffDialog()"
                >
                    <div class="space-y-3">
                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            @if (selectedTeam) {
                                Asigna un integrante del cuerpo técnico a {{ selectedTeam.name }} y define su rol operativo.
                            } @else {
                                Selecciona primero un equipo para continuar.
                            }
                        </p>

                        <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="teamStaffMember" class="text-sm font-medium text-surface-700 dark:text-surface-200">Integrante <span class="text-rose-500">*</span></label>
                                    <p-select
                                        id="teamStaffMember"
                                        [(ngModel)]="teamStaffForm.staffId"
                                        [options]="availableStaffOptions"
                                        optionLabel="fullName"
                                        optionValue="id"
                                        [filter]="true"
                                        filterBy="fullName,email"
                                        placeholder="Selecciona un miembro disponible"
                                        class="w-full"
                                        [disabled]="teamStaffDialogMode === 'edit'"
                                        appendTo="body"
                                        [scrollHeight]="'16rem'"
                                    >
                                        <ng-template #item let-option>
                                            <div class="flex flex-col">
                                                <span>{{ option.fullName }}</span>
                                                <span class="text-xs text-slate-500 dark:text-slate-400">{{ option.email }}</span>
                                            </div>
                                        </ng-template>
                                    </p-select>
                                    @if (showTeamStaffError('staffId')) {
                                        <p-message severity="error" size="small">Selecciona un integrante.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="teamStaffRole" class="text-sm font-medium text-surface-700 dark:text-surface-200">Rol técnico <span class="text-rose-500">*</span></label>
                                    <p-select id="teamStaffRole" [(ngModel)]="teamStaffForm.role" [options]="technicalRoleOptions" optionLabel="label" optionValue="value" placeholder="Selecciona un rol técnico" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                                    @if (showTeamStaffError('role')) {
                                        <p-message severity="error" size="small">Selecciona el rol técnico.</p-message>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <ng-template pTemplate="footer">
                        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="resetTeamStaffDialog()" />
                            <p-button [label]="teamStaffDialogMode === 'create' ? 'Asignar' : 'Guardar cambios'" styleClass="w-full sm:w-auto" (onClick)="saveTeamStaffAssignment()" />
                        </div>
                    </ng-template>
                </p-dialog>

                <p-dialog
                    [(visible)]="staffDialogVisible"
                    [modal]="true"
                    [draggable]="false"
                    [resizable]="false"
                    [style]="{ width: '38rem' }"
                    [breakpoints]="{ '960px': '42rem', '640px': '96vw' }"
                    [header]="staffDialogMode === 'create' ? 'Nuevo staff' : 'Editar staff'"
                    (onHide)="resetStaffDialog()"
                >
                    <div class="space-y-4">
                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            @if (staffDialogMode === 'create') {
                                Registra un nuevo integrante del staff y deja listo su acceso a la plataforma.
                            } @else {
                                Actualiza los datos del integrante y gestiona su acceso desde un solo lugar.
                            }
                        </p>

                        <div class="rounded-[0.75rem] border border-slate-200 bg-white p-3 dark:border-surface-700 dark:bg-surface-900 sm:p-4">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="staffFullName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre completo <span class="text-rose-500">*</span></label>
                                    <input pInputText id="staffFullName" type="text" [(ngModel)]="staffForm.fullName" placeholder="Ej. Juan Pérez" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onStaffNameInput($event)" />
                                    @if (showStaffError('fullName')) {
                                        <p-message severity="error" size="small">Ingresa el nombre completo.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="staffEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo electrónico <span class="text-rose-500">*</span></label>
                                    <input pInputText id="staffEmail" type="text" [(ngModel)]="staffForm.email" placeholder="Ej. entrenador@academia.com" class="w-full" (keydown)="onEmailKeydown($event)" (paste)="onEmailPaste($event)" (input)="onStaffEmailInput($event)" />
                                    @if (showStaffError('email')) {
                                        <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="staffRole" class="text-sm font-medium text-surface-700 dark:text-surface-200">Rol funcional del sistema <span class="text-rose-500">*</span></label>
                                    <p-select id="staffRole" [(ngModel)]="staffForm.role" [options]="systemRoleOptions" optionLabel="label" optionValue="value" placeholder="Selecciona un rol" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                                    @if (showStaffError('role')) {
                                        <p-message severity="error" size="small">Selecciona el rol funcional.</p-message>
                                    }
                                </div>

                                @if (staffDialogMode === 'edit') {
                                    <div class="col-span-12 flex flex-col gap-2">
                                        <label for="staffStatus" class="text-sm font-medium text-surface-700 dark:text-surface-200">Estado de acceso <span class="text-rose-500">*</span></label>
                                        <p-select id="staffStatus" [(ngModel)]="staffForm.status" [options]="staffStatusOptions" optionLabel="label" optionValue="value" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                                    </div>
                                }

                                <div class="col-span-12 flex flex-col gap-3">
                                    <div class="flex flex-col gap-1">
                                        <p class="m-0 text-sm font-medium text-surface-700 dark:text-surface-200">Modo de acceso <span class="text-rose-500">*</span></p>
                                        <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Define cómo se entregará el acceso inicial.</p>
                                    </div>

                                    <div class="grid gap-3 md:grid-cols-2">
                                        <label
                                            class="flex cursor-pointer items-start gap-3 rounded-[0.75rem] border px-4 py-3 transition"
                                            [class.border-sky-500]="staffForm.sendInvitation"
                                            [class.bg-sky-50]="staffForm.sendInvitation"
                                            [class.border-slate-200]="!staffForm.sendInvitation"
                                            [class.bg-white]="!staffForm.sendInvitation"
                                        >
                                            <p-radiobutton [(ngModel)]="staffForm.sendInvitation" [value]="true" inputId="staffInvitationMode" />
                                            <span class="min-w-0">
                                                <span class="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-surface-0">
                                                    Invitación por correo
                                                    <i class="pi pi-info-circle text-xs text-slate-400" pTooltip="El sistema enviará un correo para que la persona active su acceso." tooltipPosition="top"></i>
                                                </span>
                                            </span>
                                        </label>

                                        <label
                                            class="flex cursor-pointer items-start gap-3 rounded-[0.75rem] border px-4 py-3 transition"
                                            [class.border-sky-500]="!staffForm.sendInvitation"
                                            [class.bg-sky-50]="!staffForm.sendInvitation"
                                            [class.border-slate-200]="staffForm.sendInvitation"
                                            [class.bg-white]="staffForm.sendInvitation"
                                        >
                                            <p-radiobutton [(ngModel)]="staffForm.sendInvitation" [value]="false" inputId="staffPasswordMode" />
                                            <span class="min-w-0">
                                                <span class="flex items-center gap-2 text-sm font-semibold text-surface-900 dark:text-surface-0">
                                                    Contraseña manual
                                                    <i class="pi pi-info-circle text-xs text-slate-400" pTooltip="La cuenta queda creada con una contraseña inicial definida desde la plataforma." tooltipPosition="top"></i>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                @if (shouldShowStaffPasswordFields()) {
                                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                        <label for="staffPassword" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contraseña <span class="text-rose-500">*</span></label>
                                        <input pInputText id="staffPassword" type="password" [(ngModel)]="staffForm.password" placeholder="Mínimo 8 caracteres" class="w-full" />
                                        @if (showStaffError('password')) {
                                            <p-message severity="error" size="small">Ingresa una contraseña válida.</p-message>
                                        }
                                    </div>

                                    <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                        <label for="staffPasswordConfirmation" class="text-sm font-medium text-surface-700 dark:text-surface-200">Confirmar contraseña <span class="text-rose-500">*</span></label>
                                        <input pInputText id="staffPasswordConfirmation" type="password" [(ngModel)]="staffForm.passwordConfirmation" placeholder="Confirma la contraseña" class="w-full" />
                                        @if (showStaffError('passwordConfirmation')) {
                                            <p-message severity="error" size="small">Las contraseñas deben coincidir.</p-message>
                                        }
                                    </div>
                                }
                            </div>
                        </div>

                        @if (staffDialogMode === 'edit' && selectedStaffMember && selectedStaffMember.accessMode === 'INVITATION' && selectedStaffMember.status === 'PENDING_ACTIVATION') {
                            <div class="rounded-[0.75rem] border border-slate-200 bg-slate-50 p-3 dark:border-surface-700 dark:bg-surface-900/60 sm:p-4">
                                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p class="m-0 text-sm font-semibold text-surface-900 dark:text-surface-0">Invitación pendiente</p>
                                        <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Puedes reenviar el correo de activación si la persona todavía no completa su acceso.</p>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <p-button label="Reenviar invitación" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="resendStaffInvitation(selectedStaffMember!)" />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <ng-template pTemplate="footer">
                        <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="resetStaffDialog()" />
                            <p-button [label]="staffDialogMode === 'create' ? 'Crear miembro' : 'Guardar cambios'" styleClass="w-full sm:w-auto" (onClick)="saveStaff()" />
                        </div>
                    </ng-template>
                </p-dialog>
            }
        </div>
    `
})
export class AcademyProfilePage implements OnInit, OnDestroy {
    @ViewChild('shieldCropper') shieldCropper?: ImageCropperComponent;

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Academia' }];
    readonly fallbackFlag = 'assets/flags/pe.svg';
    readonly countryOptions: CountryOption[] = [
        { name: 'Colombia', dialCode: '+57', flagFile: 'assets/flags/co.svg' },
        { name: 'Perú', dialCode: '+51', flagFile: 'assets/flags/pe.svg' },
        { name: 'Chile', dialCode: '+56', flagFile: 'assets/flags/cl.svg' },
        { name: 'Ecuador', dialCode: '+593', flagFile: 'assets/flags/ec.svg' },
        { name: 'México', dialCode: '+52', flagFile: 'assets/flags/mx.svg' },
        { name: 'España', dialCode: '+34', flagFile: 'assets/flags/es.svg' }
    ];

    readonly locationCatalog: Record<string, LocationDepartment[]> = {
        Colombia: [
            { name: 'Antioquia', cities: ['Medellín', 'Itagüí', 'Bello', 'Envigado'] },
            { name: 'Bogotá D.C.', cities: ['Bogotá'] },
            { name: 'Risaralda', cities: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'] },
            { name: 'Santander', cities: ['Bucaramanga', 'Floridablanca', 'Girón'] },
            { name: 'Valle del Cauca', cities: ['Cali', 'Palmira', 'Buga'] }
        ],
        Perú: [
            { name: 'Lima', cities: ['Lima', 'Miraflores', 'Surco', 'San Isidro'] },
            { name: 'Arequipa', cities: ['Arequipa', 'Yanahuara', 'Cayma'] },
            { name: 'Cusco', cities: ['Cusco', 'Santiago', 'Wanchaq'] }
        ],
        Chile: [
            { name: 'Región Metropolitana', cities: ['Santiago', 'Providencia', 'Las Condes'] },
            { name: 'Valparaíso', cities: ['Valparaíso', 'Viña del Mar', 'Concón'] }
        ],
        Ecuador: [
            { name: 'Pichincha', cities: ['Quito', 'Cumbayá', 'Tumbaco'] },
            { name: 'Guayas', cities: ['Guayaquil', 'Daule', 'Samborondón'] }
        ],
        México: [
            { name: 'Ciudad de México', cities: ['Coyoacán', 'Benito Juárez', 'Miguel Hidalgo'] },
            { name: 'Jalisco', cities: ['Guadalajara', 'Zapopan', 'Tlaquepaque'] }
        ],
        España: [
            { name: 'Madrid', cities: ['Madrid', 'Alcobendas', 'Getafe'] },
            { name: 'Cataluña', cities: ['Barcelona', 'Badalona', 'Sabadell'] }
        ]
    };

    submitted = false;
    taxSubmitted = false;
    readonly informationLoading = signal(true);
    readonly informationLoadCompleted = signal(false);
    readonly informationLoadError = signal<string | null>(null);
    readonly taxLoading = signal(false);
    readonly taxLoadCompleted = signal(false);
    readonly taxLoadError = signal<string | null>(null);
    activeTab: 'information' | 'tax' | 'venues' | 'categories' | 'teams' | 'staff' = 'information';
    academy: AcademyProfile | null;
    form: AcademyProfile;
    taxProfile: AcademyTaxProfile | null;
    taxForm: AcademyTaxProfile;
    shieldFileName = 'Sin imagen seleccionada';
    shieldPreviewUrl: string | null = null;
    hasPendingShieldChanges = false;
    shieldCroppedBlob: Blob | null = null;
    saving = false;
    taxSaving = false;
    shieldUploadSaving = false;
    shieldDeleteSaving = false;
    shieldPreviewDialogVisible = false;
    readonly sessionExpiredDialogVisible = signal(false);
    private sessionExpiredTimeoutId: ReturnType<typeof setTimeout> | null = null;
    selectedVenue: VenueApiVenue | null = null;
    venueSearch = '';
    venueSubmitted = false;
    venueDialogVisible = false;
    venueDialogMode: 'create' | 'edit' = 'create';
    editingVenueId: string | null = null;
    venueForm: AcademyVenueForm = this.emptyVenueForm();
    readonly venueLoading = signal(false);
    readonly venueLoaded = signal(false);
    venueSaving = false;
    readonly venueError = signal<string | null>(null);
    venueListMeta: VenueApiMeta | null = null;
    venuePage = 1;
    venueRows = 20;
    venueStatusUpdatingId: string | null = null;
    venueDetailVisible = false;
    readonly categoryLoading = signal(false);
    readonly categoryLoaded = signal(false);
    readonly categoryError = signal<string | null>(null);
    categoryListMeta: AcademyCategoryApiMeta | null = null;
    categoryPage = 1;
    categoryRows = 20;
    categorySaving = false;
    categoryStatusUpdatingId: string | null = null;
    categoryDetailVisible = false;
    selectedCategory: AcademyCategory | null = null;
    categorySearch = '';
    categorySubmitted = false;
    categoryDialogVisible = false;
    categoryDialogMode: 'create' | 'edit' = 'create';
    editingCategoryId: string | null = null;
    categoryForm: AcademyCategoryForm = this.emptyCategoryForm();
    selectedTeam: AcademyTeam | null = null;
    teamSearch = '';
    teamSubmitted = false;
    teamDialogVisible = false;
    teamDialogMode: 'create' | 'edit' = 'create';
    editingTeamId: string | null = null;
    teamForm: AcademyTeamForm = this.emptyTeamForm();
    selectedTeamStaffAssignment: AcademyTeamStaffAssignment | null = null;
    teamStaffDialogVisible = false;
    teamStaffDialogMode: 'create' | 'edit' = 'create';
    teamStaffSubmitted = false;
    editingTeamStaffAssignmentId: string | null = null;
    teamStaffForm: AcademyTeamStaffForm = this.emptyTeamStaffForm();
    selectedStaffMember: AcademyStaffMember | null = null;
    staffSearch = '';
    staffSubmitted = false;
    staffDialogVisible = false;
    staffDialogMode: 'create' | 'edit' = 'create';
    editingStaffId: string | null = null;
    staffForm: AcademyStaffForm = this.emptyStaffForm();
    venues: VenueApiVenue[] = [];
    categories: AcademyCategory[] = [];
    venueActionItems: MenuItem[] = [
        {
            label: 'Ver detalle',
            icon: 'pi pi-eye',
            command: () => {
                if (this.selectedVenue) {
                    this.openVenueDetail(this.selectedVenue);
                }
            }
        },
        {
            label: 'Editar sede',
            icon: 'pi pi-pencil',
            command: () => {
                if (this.selectedVenue) {
                    this.openVenueDialog(this.selectedVenue);
                }
            }
        },
        {
            label: 'Cambiar estado',
            icon: 'pi pi-refresh',
            command: () => {
                if (this.selectedVenue) {
                    this.toggleVenueStatus(this.selectedVenue);
                }
            }
        }
    ];
    categoryActionItems: MenuItem[] = [
        {
            label: 'Ver detalle',
            icon: 'pi pi-eye',
            command: () => {
                if (this.selectedCategory) {
                    this.openCategoryDetail(this.selectedCategory);
                }
            }
        },
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                if (this.selectedCategory) {
                    this.openCategoryDialog(this.selectedCategory);
                }
            }
        },
        {
            label: 'Cambiar estado',
            icon: 'pi pi-refresh',
            command: () => {
                if (this.selectedCategory) {
                    this.toggleCategoryStatus(this.selectedCategory);
                }
            }
        }
    ];
    teams: AcademyTeam[] = [
        {
            id: 'team-001',
            name: 'Sub 12 A',
            categoryId: 'category-001',
            categoryName: 'Sub 12',
            status: 'ACTIVE'
        },
        {
            id: 'team-002',
            name: 'Sub 14 Proyección',
            categoryId: 'category-002',
            categoryName: 'Sub 14',
            status: 'INACTIVE'
        },
        {
            id: 'team-003',
            name: 'Semillero Norte',
            categoryId: 'category-003',
            categoryName: 'Sub 8',
            status: 'ACTIVE'
        },
        {
            id: 'team-004',
            name: 'Formativo Azul',
            categoryId: 'category-004',
            categoryName: 'Sub 10',
            status: 'ACTIVE'
        },
        {
            id: 'team-005',
            name: 'Juvenil A',
            categoryId: 'category-006',
            categoryName: 'Juvenil',
            status: 'ACTIVE'
        }
    ];
    staffMembers: AcademyStaffMember[] = [
        {
            id: 'staff-001',
            userId: 'user-201',
            fullName: 'Juan Pérez',
            email: 'juan.perez@academia.com',
            role: 'ROLE_COACH',
            accessMode: 'PASSWORD',
            status: 'ACTIVE'
        },
        {
            id: 'staff-002',
            userId: 'user-202',
            fullName: 'María Gómez',
            email: 'maria.gomez@academia.com',
            role: 'ROLE_COACH',
            accessMode: 'PASSWORD',
            status: 'ACTIVE'
        },
        {
            id: 'staff-003',
            userId: 'user-203',
            fullName: 'Carlos Rojas',
            email: 'carlos.rojas@academia.com',
            role: 'ROLE_ACADEMY_ADMIN',
            accessMode: 'INVITATION',
            status: 'PENDING_ACTIVATION'
        },
        {
            id: 'staff-004',
            userId: 'user-204',
            fullName: 'Sandra León',
            email: 'sandra.leon@academia.com',
            role: 'ROLE_COACH',
            accessMode: 'PASSWORD',
            status: 'ACTIVE'
        },
        {
            id: 'staff-005',
            userId: 'user-205',
            fullName: 'Felipe Castro',
            email: 'felipe.castro@academia.com',
            role: 'ROLE_ACADEMY_ADMIN',
            accessMode: 'PASSWORD',
            status: 'INACTIVE'
        }
    ];
    teamStaffAssignments: AcademyTeamStaffAssignment[] = [
        {
            assignmentId: 'assignment-001',
            staffId: 'staff-001',
            userId: 'user-201',
            teamId: 'team-001',
            fullName: 'Juan Pérez',
            email: 'juan.perez@academia.com',
            role: 'HEAD_COACH',
            status: 'ACTIVE'
        },
        {
            assignmentId: 'assignment-002',
            staffId: 'staff-002',
            userId: 'user-202',
            teamId: 'team-001',
            fullName: 'María Gómez',
            email: 'maria.gomez@academia.com',
            role: 'ASSISTANT_COACH',
            status: 'ACTIVE'
        },
        {
            assignmentId: 'assignment-003',
            staffId: 'staff-003',
            userId: 'user-203',
            teamId: 'team-003',
            fullName: 'Carlos Rojas',
            email: 'carlos.rojas@academia.com',
            role: 'FITNESS_COACH',
            status: 'ACTIVE'
        }
    ];
    teamActionItems: MenuItem[] = [
        {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => {
                if (this.selectedTeam) {
                    this.openTeamDialog(this.selectedTeam);
                }
            }
        },
        {
            label: 'Cambiar estado',
            icon: 'pi pi-refresh',
            command: () => {
                if (this.selectedTeam) {
                    this.toggleTeamStatus(this.selectedTeam);
                }
            }
        }
    ];
    teamStaffActionItems: MenuItem[] = [
        {
            label: 'Editar rol',
            icon: 'pi pi-pencil',
            command: () => {
                if (this.selectedTeamStaffAssignment) {
                    this.openTeamStaffDialog(this.selectedTeamStaffAssignment);
                }
            }
        },
        {
            label: 'Retirar del equipo',
            icon: 'pi pi-times',
            command: () => {
                if (this.selectedTeamStaffAssignment) {
                    this.removeTeamStaffAssignment(this.selectedTeamStaffAssignment);
                }
            }
        }
    ];
    technicalRoleOptions: { label: string; value: AcademyTeamStaffAssignment['role'] }[] = [
        { label: 'Entrenador principal', value: 'HEAD_COACH' },
        { label: 'Entrenador asistente', value: 'ASSISTANT_COACH' },
        { label: 'Entrenador de porteros', value: 'GOALKEEPER_COACH' },
        { label: 'Preparador físico', value: 'FITNESS_COACH' },
        { label: 'Nutricionista', value: 'NUTRITIONIST' },
        { label: 'Fisioterapia', value: 'PHYSIOTHERAPIST' }
    ];
    systemRoleOptions: { label: string; value: AcademyStaffMember['role'] }[] = [
        { label: 'Administrador de academia', value: 'ROLE_ACADEMY_ADMIN' },
        { label: 'Entrenador', value: 'ROLE_COACH' }
    ];
    taxIdTypeOptions = [
        { label: 'NIT', value: 'NIT' },
        { label: 'RUC', value: 'RUC' },
        { label: 'RUT', value: 'RUT' },
        { label: 'Cédula', value: 'CEDULA' },
        { label: 'Pasaporte', value: 'PASAPORTE' }
    ];
    taxRegimeOptions = [
        { label: 'Responsable de IVA', value: 'RESPONSABLE_IVA' },
        { label: 'No responsable de IVA', value: 'NO_RESPONSABLE_IVA' },
        { label: 'Régimen general', value: 'REGIMEN_GENERAL' },
        { label: 'Régimen simplificado', value: 'REGIMEN_SIMPLIFICADO' }
    ];
    staffStatusOptions: { label: string; value: AcademyStaffMember['status'] }[] = [
        { label: 'Activo', value: 'ACTIVE' },
        { label: 'Inactivo', value: 'INACTIVE' },
        { label: 'Pendiente de activación', value: 'PENDING_ACTIVATION' }
    ];
    staffActionItems: MenuItem[] = [];

    constructor(
        private readonly academyService: AcademyProfileService,
        private readonly venueService: VenueApiService,
        private readonly categoryService: CategoryApiService,
        private readonly auth: AuthSessionService,
        private readonly authAccess: AuthAccessService,
        private readonly route: ActivatedRoute,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService,
        private readonly router: Router
    ) {
        this.academy = this.academyService.getCurrentAcademy();
        this.form = this.academy ?? this.emptyForm();
        this.taxProfile = this.academyService.getCurrentTaxProfile();
        this.taxForm = this.taxProfile ?? this.emptyTaxForm();
        this.selectedTeam = this.teams[0] ?? null;
    }

    ngOnInit() {
        void this.loadTenantContextSilently();
        this.loadInformation();
        setTimeout(() => this.applyInitialTabFromFragment());
    }

    ngOnDestroy() {
        this.clearSessionExpiredTimeout();
    }

    get academyInitials(): string {
        return (this.form.name || 'Academia')
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('');
    }

    get departmentOptions(): LocationDepartment[] {
        return this.locationCatalog[this.form.country] ?? [];
    }

    get departmentCities(): string[] {
        const department = this.departmentOptions.find((item) => item.name === this.form.department);
        return department?.cities ?? [];
    }

    get venueDepartmentOptions(): LocationDepartment[] {
        return this.locationCatalog[this.venueForm.country] ?? [];
    }

    get venueCities(): string[] {
        const department = this.venueDepartmentOptions.find((item) => item.name === this.venueForm.department);
        return department?.cities ?? [];
    }

    get venueCountryFlag(): string {
        return this.countryOptions.find((option) => option.name === this.venueForm.country)?.flagFile ?? this.fallbackFlag;
    }

    get filteredVenues(): VenueApiVenue[] {
        const query = this.venueSearch.trim().toLowerCase();
        if (!query) {
            return this.venues;
        }

        return this.venues.filter((venue) => [venue.name, venue.city ?? '', venue.department ?? '', venue.country ?? '', venue.address ?? '', venue.phone ?? ''].some((value) => value.toLowerCase().includes(query)));
    }

    get venueTotalRecords(): number {
        return this.resolveVenueMetaTotal(this.venueListMeta) ?? this.venues.length;
    }

    getVenueLocationSummary(venue: VenueApiVenue): string {
        return [venue.address, venue.department, venue.country].filter((value): value is string => !!value && value.trim().length > 0).join(' · ') || 'Sin dirección registrada';
    }

    private resolveVenueMetaTotal(meta: VenueApiMeta | null): number | null {
        if (!meta) {
            return null;
        }

        const total = meta.total ?? meta.totalItems;
        return typeof total === 'number' ? total : null;
    }

    get categoryTotalRecords(): number {
        return this.resolveCategoryMetaTotal(this.categoryListMeta) ?? this.categories.length;
    }

    private resolveCategoryMetaTotal(meta: AcademyCategoryApiMeta | null): number | null {
        if (!meta) {
            return null;
        }

        const total = meta.total ?? meta.totalItems;
        return typeof total === 'number' ? total : null;
    }

    get filteredCategories(): AcademyCategory[] {
        const query = this.categorySearch.trim().toLowerCase();
        if (!query) {
            return this.categories;
        }

        return this.categories.filter((category) => [category.name ?? '', category.categoryKey ?? '', category.description ?? ''].some((value) => value.toLowerCase().includes(query)));
    }

    get filteredTeams(): AcademyTeam[] {
        const query = this.teamSearch.trim().toLowerCase();
        if (!query) {
            return this.teams;
        }

        return this.teams.filter((team) => [team.name, team.categoryName].some((value) => value.toLowerCase().includes(query)));
    }

    get filteredStaffMembers(): AcademyStaffMember[] {
        const query = this.staffSearch.trim().toLowerCase();
        if (!query) {
            return this.staffMembers;
        }

        return this.staffMembers.filter((staff) => [staff.fullName, staff.email, this.getSystemRoleLabel(staff.role)].some((value) => value.toLowerCase().includes(query)));
    }

    get activeCategoryOptions(): Pick<AcademyCategory, 'id' | 'name'>[] {
        return this.categories.filter((category) => category.status === 'ACTIVE').map((category) => ({ id: category.id, name: category.name }));
    }

    get taxIdentificationSummary(): string {
        const type = this.getTaxOptionLabel(this.taxIdTypeOptions, this.taxForm.taxIdType);
        const number = this.taxForm.taxIdNumber.trim();
        const checkDigit = this.taxForm.taxCheckDigit.trim();

        if (!type && !number) {
            return 'No configurado';
        }

        const base = [type, number].filter(Boolean).join(' ');
        return checkDigit ? `${base} · DV ${checkDigit}` : base;
    }

    get taxBillingSummary(): string {
        return this.taxForm.billingEmail.trim() || 'No configurado';
    }

    get taxLocationSummary(): string {
        const location = [this.taxForm.fiscalCity.trim(), this.taxForm.fiscalCountry.trim()].filter(Boolean).join(', ');
        return location || 'Ubicación fiscal no configurada';
    }

    get isTaxSummaryConfigured(): boolean {
        return !!(this.taxForm.legalName.trim() && this.taxForm.taxIdType.trim() && this.taxForm.taxIdNumber.trim() && this.taxForm.billingEmail.trim());
    }

    get selectedTeamStaffAssignments(): AcademyTeamStaffAssignment[] {
        const selectedTeam = this.selectedTeam;

        if (!selectedTeam) {
            return [];
        }

        return this.teamStaffAssignments.filter((assignment) => assignment.teamId === selectedTeam.id);
    }

    get availableStaffOptions(): AcademyStaffMember[] {
        if (this.teamStaffDialogMode === 'edit' && this.editingTeamStaffAssignmentId) {
            return this.staffMembers.filter((staff) => staff.status === 'ACTIVE');
        }

        const assignedIds = new Set(this.selectedTeamStaffAssignments.map((assignment) => assignment.staffId));
        return this.staffMembers.filter((staff) => staff.status === 'ACTIVE' && !assignedIds.has(staff.id));
    }

    loadInformation() {
        this.informationLoading.set(true);
        this.informationLoadError.set(null);

        this.academyService
            .loadCurrentAcademy()
            .pipe(
                finalize(() => {
                    this.informationLoading.set(false);
                    this.informationLoadCompleted.set(true);
                })
            )
            .subscribe({
                next: (academy) => {
                    const nextAcademy = academy ?? this.academyService.getCurrentAcademy();
                    this.academy = nextAcademy;
                    this.form = nextAcademy ?? this.emptyForm();
                    this.applyShieldState(nextAcademy);
                },
                error: (error: AuthErrorLike) => {
                    if (error.status === 401) {
                        this.showSessionExpiredDialog();
                        return;
                    }

                    this.informationLoadError.set(this.resolveErrorMessage(error, 'No pudimos cargar la información de la academia.'));
                }
            });
    }

    loadTaxProfile() {
        this.taxLoading.set(true);
        this.taxLoadError.set(null);

        this.academyService
            .loadCurrentTaxProfile()
            .pipe(
                finalize(() => {
                    this.taxLoading.set(false);
                    this.taxLoadCompleted.set(true);
                })
            )
            .subscribe({
                next: (taxProfile) => {
                    const nextTaxProfile = taxProfile ?? this.academyService.getCurrentTaxProfile();
                    this.taxProfile = nextTaxProfile;
                    this.taxForm = nextTaxProfile ?? this.emptyTaxForm();
                },
                error: (error: AuthErrorLike) => {
                    this.taxLoadError.set(this.resolveErrorMessage(error, 'No pudimos cargar la información fiscal.'));
                }
            });
    }

    onTabSelected(tab: 'information' | 'venues' | 'categories' | 'teams' | 'staff') {
        this.activeTab = tab;

        if (tab === 'information' && !this.informationLoadCompleted() && !this.informationLoading()) {
            this.loadInformation();
        } else if (tab === 'venues') {
            this.ensureVenuesLoaded();
        } else if (tab === 'categories') {
            this.ensureCategoriesLoaded();
        }
    }

    onTabClicked(tab: 'information' | 'venues' | 'categories' | 'teams' | 'staff') {
        this.onTabSelected(tab);
        void this.router.navigate([], {
            relativeTo: this.route,
            fragment: tab,
            replaceUrl: true
        });
    }

    private loadTenantContextSilently() {
        return this.authAccess.loadTenantContext().pipe(catchError(() => of(null))).subscribe();
    }

    private showSessionExpiredDialog(): void {
        this.informationLoading.set(false);
        this.taxLoading.set(false);
        this.sessionExpiredDialogVisible.set(true);
        this.clearSessionExpiredTimeout();
        this.sessionExpiredTimeoutId = setTimeout(() => {
            if (this.sessionExpiredDialogVisible()) {
                this.goToLogin();
            }
        }, 30000);
    }

    private applyInitialTabFromFragment() {
        const fragment = this.route.snapshot.fragment as 'information' | 'venues' | 'categories' | 'teams' | 'staff' | null;
        if (fragment === 'venues' || fragment === 'categories' || fragment === 'teams' || fragment === 'staff' || fragment === 'information') {
            this.onTabSelected(fragment);
            return;
        }

        this.onTabSelected('information');
    }

    save() {
        this.submitted = true;

        if (!this.academy || !this.canEditAcademy() || !this.isFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa la información',
                detail: 'Completa los campos obligatorios antes de guardar.'
            });
            return;
        }

        this.saving = true;
        this.academyService.updateCurrentAcademy(this.buildAcademyUpdatePayload()).subscribe({
            next: (academy) => {
                this.academy = academy;
                this.form = academy;
                this.applyShieldState(academy);
                this.taxProfile = this.taxProfile ?? this.emptyTaxForm();
                this.taxForm = this.taxProfile;
                this.messageService.add({
                    severity: 'info',
                    summary: 'Academia actualizada',
                    detail: 'Los datos generales se guardaron correctamente.'
                });
                this.saving = false;
            },
            error: (error: AuthErrorLike) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'No se pudo guardar',
                    detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                });
                this.saving = false;
            }
        });
    }

    saveTaxProfile() {
        this.taxSubmitted = true;

        if (!this.canEditAcademy() || !this.isTaxFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa la información fiscal',
                detail: 'Completa los campos obligatorios antes de guardar.'
            });
            return;
        }

        this.taxSaving = true;
        this.academyService.updateCurrentTaxProfile(this.buildTaxProfileUpdatePayload()).subscribe({
            next: (taxProfile) => {
                this.taxProfile = taxProfile;
                this.taxForm = taxProfile;
                this.messageService.add({
                    severity: 'info',
                    summary: 'Información fiscal actualizada',
                    detail: 'Los datos fiscales se guardaron correctamente.'
                });
                this.taxSaving = false;
            },
            error: (error: AuthErrorLike) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'No se pudo guardar',
                    detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                });
                this.taxSaving = false;
            }
        });
    }

    saveShield() {
        if (!this.shieldCroppedBlob || this.shieldUploadSaving) {
            return;
        }

        this.shieldUploadSaving = true;
        this.academyService.updateCurrentShield(this.shieldCroppedBlob).subscribe({
            next: (academy) => {
                this.academy = academy;
                this.form = academy;
                this.applyShieldState(academy);
                this.messageService.add({
                    severity: 'info',
                    summary: 'Escudo actualizado',
                    detail: 'La imagen se guardó correctamente.'
                });
                this.shieldUploadSaving = false;
            },
            error: (error: AuthErrorLike) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'No se pudo guardar',
                    detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                });
                this.shieldUploadSaving = false;
            }
        });
    }

    resetTaxForm() {
        this.taxSubmitted = false;
        this.taxForm = this.taxProfile ?? this.emptyTaxForm();
    }

    onShieldSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        this.shieldCropper?.openWithFile(file);
        input.value = '';
    }

    onShieldFileError(error: ImageCropperFileError) {
        if (error.reason === 'file-too-large') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Archivo demasiado pesado',
                detail: `Selecciona una imagen de hasta ${error.maxFileSizeMb} MB.`
            });
            return;
        }

        if (error.reason === 'invalid-file-type') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Formato no permitido',
                detail: `Usa un archivo ${error.allowedFileExtensions.map((item) => item.toUpperCase()).join(', ')}.`
            });
        }
    }

    openShieldPreviewDialog() {
        if (!this.shieldPreviewUrl) {
            return;
        }

        this.shieldPreviewDialogVisible = true;
    }

    onShieldApplied(result: ImageCropperResult) {
        this.shieldPreviewUrl = result.dataUrl;
        this.shieldFileName = result.fileName;
        this.shieldCroppedBlob = result.blob;
        this.hasPendingShieldChanges = true;

        this.messageService.add({
            severity: 'info',
            summary: 'Vista previa actualizada',
            detail: 'La nueva imagen quedó lista para guardarse con el formulario.'
        });
    }

    openVenueActionsMenu(event: Event, menu: Menu, venue: VenueApiVenue) {
        this.selectedVenue = venue;
        this.venueActionItems = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    if (this.selectedVenue) {
                        this.openVenueDialog(this.selectedVenue);
                    }
                }
            },
            {
                label: venue.status === 'ACTIVE' ? 'Desactivar' : 'Reactivar',
                icon: venue.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-refresh',
                command: () => {
                    if (this.selectedVenue) {
                        this.toggleVenueStatus(this.selectedVenue);
                    }
                }
            }
        ];

        menu.toggle(event);
    }

    openVenueDetail(venue: VenueApiVenue) {
        this.selectedVenue = venue;
        this.venueDetailVisible = true;
    }

    openCategoryActionsMenu(event: Event, menu: Menu, category: AcademyCategory) {
        this.selectedCategory = category;
        this.categoryActionItems = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    if (this.selectedCategory) {
                        this.openCategoryDialog(this.selectedCategory);
                    }
                }
            },
            {
                label: category.status === 'ACTIVE' ? 'Desactivar' : 'Reactivar',
                icon: category.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-refresh',
                command: () => {
                    if (this.selectedCategory) {
                        this.toggleCategoryStatus(this.selectedCategory);
                    }
                }
            }
        ];

        menu.toggle(event);
    }

    openTeamActionsMenu(event: Event, menu: Menu, team: AcademyTeam) {
        this.selectedTeam = team;
        this.teamActionItems = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    if (this.selectedTeam) {
                        this.openTeamDialog(this.selectedTeam);
                    }
                }
            },
            {
                label: team.status === 'ACTIVE' ? 'Desactivar' : 'Reactivar',
                icon: team.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-refresh',
                command: () => {
                    if (this.selectedTeam) {
                        this.toggleTeamStatus(this.selectedTeam);
                    }
                }
            }
        ];

        menu.toggle(event);
    }

    openTeamStaffActionsMenu(event: Event, menu: Menu, assignment: AcademyTeamStaffAssignment) {
        this.selectedTeamStaffAssignment = assignment;
        this.teamStaffActionItems = [
            {
                label: 'Editar rol',
                icon: 'pi pi-pencil',
                command: () => {
                    if (this.selectedTeamStaffAssignment) {
                        this.openTeamStaffDialog(this.selectedTeamStaffAssignment);
                    }
                }
            },
            {
                label: 'Retirar del equipo',
                icon: 'pi pi-times',
                command: () => {
                    if (this.selectedTeamStaffAssignment) {
                        this.removeTeamStaffAssignment(this.selectedTeamStaffAssignment);
                    }
                }
            }
        ];

        menu.toggle(event);
    }

    openStaffActionsMenu(event: Event, menu: Menu, staff: AcademyStaffMember) {
        this.selectedStaffMember = staff;
        this.staffActionItems = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => {
                    this.openStaffDialog(staff);
                }
            },
            {
                label: staff.status === 'ACTIVE' ? 'Desactivar' : 'Reactivar',
                icon: staff.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-refresh',
                command: () => {
                    this.toggleStaffStatus(staff);
                }
            }
        ];

        if (staff.accessMode === 'INVITATION' && staff.status === 'PENDING_ACTIVATION') {
            this.staffActionItems.splice(2, 0, {
                label: 'Reenviar invitación',
                icon: 'pi pi-envelope',
                command: () => {
                    this.resendStaffInvitation(staff);
                }
            });
        }

        menu.toggle(event);
    }

    removeShield() {
        if (this.shieldUploadSaving || this.shieldDeleteSaving) {
            return;
        }

        if (this.hasPendingShieldChanges && this.shieldCroppedBlob) {
            this.applyShieldState(this.academy);
            this.messageService.add({
                severity: 'info',
                summary: 'Cambio cancelado',
                detail: 'La imagen volvió al estado anterior.'
            });
            return;
        }

        if (!this.academy?.shieldUrl) {
            this.applyShieldState(this.academy);
            return;
        }

        this.shieldDeleteSaving = true;
        this.academyService.deleteCurrentShield().subscribe({
            next: () => {
                const updatedAcademy = this.academy
                    ? {
                          ...this.academy,
                          shieldUrl: null,
                          shieldFileName: null
                      }
                    : null;

                this.academy = updatedAcademy;
                if (updatedAcademy) {
                    this.form = updatedAcademy;
                }
                this.applyShieldState(updatedAcademy);
                this.messageService.add({
                    severity: 'info',
                    summary: 'Escudo eliminado',
                    detail: 'El escudo ya no se mostrará en la academia.'
                });
                this.shieldDeleteSaving = false;
            },
            error: (error: AuthErrorLike) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'No se pudo eliminar',
                    detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                });
                this.shieldDeleteSaving = false;
            }
        });
    }

    private buildAcademyUpdatePayload(): AcademyProfileUpdateRequest {
        return {
            name: this.form.name.trim(),
            contactEmail: this.form.contactEmail.trim(),
            phone: `${this.form.countryCode.trim()}${this.form.phoneNumber.trim()}`.trim(),
            country: this.form.country.trim(),
            department: this.form.department.trim(),
            city: this.form.city.trim(),
            address: this.form.address.trim()
        };
    }

    private buildTaxProfileUpdatePayload(): AcademyTaxProfileUpdateRequest {
        return {
            taxIdType: this.taxForm.taxIdType.trim(),
            taxIdNumber: this.taxForm.taxIdNumber.trim(),
            taxCheckDigit: this.taxForm.taxCheckDigit.trim(),
            taxRegime: this.taxForm.taxRegime.trim(),
            billingEmail: this.taxForm.billingEmail.trim()
        };
    }

    private applyShieldState(academy: AcademyProfile | null) {
        this.shieldPreviewUrl = academy?.shieldUrl ?? null;
        this.shieldFileName = academy?.shieldFileName ?? (academy?.shieldUrl ? 'Escudo actual' : 'Sin imagen seleccionada');
        this.hasPendingShieldChanges = false;
        this.shieldCroppedBlob = null;
    }

    private resolveErrorMessage(error: AuthErrorLike | undefined, fallback: string): string {
        return error?.detail?.trim() || error?.message?.trim() || fallback;
    }

    goToLogin() {
        this.sessionExpiredDialogVisible.set(false);
        this.clearSessionExpiredTimeout();
        this.auth.clearSession();
        void this.router.navigate(['/auth/login'], {
            queryParams: {
                returnUrl: '/academy'
            }
        });
    }

    private clearSessionExpiredTimeout() {
        if (this.sessionExpiredTimeoutId) {
            clearTimeout(this.sessionExpiredTimeoutId);
            this.sessionExpiredTimeoutId = null;
        }
    }

    loadVenues() {
        this.venueLoading.set(true);
        this.venueError.set(null);

        this.venueService.list({ page: this.venuePage, per_page: this.venueRows, sort: 'created_at', direction: 'DESC' }).pipe(finalize(() => this.venueLoading.set(false))).subscribe({
            next: (response) => {
                this.venues = response.data;
                this.venueListMeta = response.meta;
                this.venueLoaded.set(true);
            },
            error: (error: AuthErrorLike) => {
                this.venueError.set(this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.'));
            }
        });
    }

    loadCategories() {
        this.categoryLoading.set(true);
        this.categoryError.set(null);

        this.categoryService.list({ page: this.categoryPage, per_page: this.categoryRows, sort: 'created_at', direction: 'DESC' }).pipe(finalize(() => this.categoryLoading.set(false))).subscribe({
            next: (response) => {
                this.categories = response.data;
                this.categoryListMeta = response.meta;
                this.categoryLoaded.set(true);
            },
            error: (error: AuthErrorLike) => {
                this.categoryError.set(this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.'));
            }
        });
    }

    ensureVenuesLoaded() {
        if (this.venueLoaded() || this.venueLoading()) {
            return;
        }

        this.loadVenues();
    }

    ensureCategoriesLoaded() {
        if (this.categoryLoaded() || this.categoryLoading()) {
            return;
        }

        this.loadCategories();
    }

    onVenuePageChange(event: { page?: number; first?: number; rows?: number }) {
        const rows = event.rows ?? this.venueRows;
        const page = typeof event.page === 'number' ? event.page + 1 : Math.floor((event.first ?? 0) / rows) + 1;

        if (page === this.venuePage && rows === this.venueRows) {
            return;
        }

        this.venuePage = page;
        this.venueRows = rows;
        this.loadVenues();
    }

    onCategoryPageChange(event: { page?: number; first?: number; rows?: number }) {
        const rows = event.rows ?? this.categoryRows;
        const page = typeof event.page === 'number' ? event.page + 1 : Math.floor((event.first ?? 0) / rows) + 1;

        if (page === this.categoryPage && rows === this.categoryRows) {
            return;
        }

        this.categoryPage = page;
        this.categoryRows = rows;
        this.loadCategories();
    }

    refreshVenues() {
        this.venueLoaded.set(false);
        this.loadVenues();
    }

    refreshCategories() {
        this.categoryLoaded.set(false);
        this.loadCategories();
    }

    openVenueDialog(venue?: VenueApiVenue) {
        this.venueSubmitted = false;
        this.venueDialogMode = venue ? 'edit' : 'create';
        this.editingVenueId = venue?.id ?? null;
        this.venueForm = venue
            ? {
                  name: venue.name,
                  address: venue.address ?? '',
                  country: venue.country ?? this.form.country ?? 'Colombia',
                  department: venue.department ?? '',
                  city: venue.city ?? '',
                  countryCode: this.resolveVenueCountryCode(venue.phone ?? ''),
                  phoneNumber: this.resolveVenuePhoneNumber(venue.phone ?? ''),
                  notes: typeof venue.notes === 'string' ? venue.notes : ''
              }
            : this.emptyVenueForm();
        this.venueDialogVisible = true;
    }

    resetVenueDialog() {
        this.venueDialogVisible = false;
        this.venueSubmitted = false;
        this.editingVenueId = null;
        this.venueDialogMode = 'create';
        this.venueForm = this.emptyVenueForm();
    }

    openCategoryDialog(category?: AcademyCategory) {
        this.categorySubmitted = false;
        this.categoryDialogMode = category ? 'edit' : 'create';
        this.editingCategoryId = category?.id ?? null;
        this.categoryForm = category
            ? {
                  categoryKey: category.categoryKey ?? this.buildCategoryKey(category.name),
                  name: category.name,
                  minAge: String(category.minAge),
                  maxAge: String(category.maxAge),
                  description: category.description ?? ''
              }
            : this.emptyCategoryForm();
        this.categoryDialogVisible = true;
    }

    openCategoryDetail(category: AcademyCategory) {
        this.selectedCategory = category;
        this.categoryDetailVisible = true;

        if (!this.categoryLoaded() || !this.categoryHasDetail(category)) {
            void this.loadCategoryDetail(category.id);
        }
    }

    resetCategoryDialog() {
        this.categoryDialogVisible = false;
        this.categorySubmitted = false;
        this.editingCategoryId = null;
        this.categoryDialogMode = 'create';
        this.categoryForm = this.emptyCategoryForm();
    }

    openTeamDialog(team?: AcademyTeam) {
        this.teamSubmitted = false;
        this.teamDialogMode = team ? 'edit' : 'create';
        this.editingTeamId = team?.id ?? null;
        this.selectedTeam = team ?? null;
        this.teamForm = team
            ? {
                  name: team.name,
                  categoryId: team.categoryId
              }
            : this.emptyTeamForm();
        this.teamDialogVisible = true;
    }

    resetTeamDialog() {
        this.teamDialogVisible = false;
        this.teamSubmitted = false;
        this.editingTeamId = null;
        this.teamDialogMode = 'create';
        this.teamForm = this.emptyTeamForm();
        this.selectedTeam = this.teams[0] ?? null;
    }

    openTeamStaffDialog(assignment?: AcademyTeamStaffAssignment) {
        this.teamStaffSubmitted = false;
        this.selectedTeamStaffAssignment = assignment ?? null;
        this.editingTeamStaffAssignmentId = assignment?.assignmentId ?? null;
        this.teamStaffDialogMode = assignment ? 'edit' : 'create';
        this.teamStaffForm = assignment
            ? {
                  staffId: assignment.staffId,
                  role: assignment.role
              }
            : this.emptyTeamStaffForm();
        this.teamStaffDialogVisible = true;
    }

    resetTeamStaffDialog() {
        this.teamStaffDialogVisible = false;
        this.teamStaffSubmitted = false;
        this.editingTeamStaffAssignmentId = null;
        this.teamStaffDialogMode = 'create';
        this.teamStaffForm = this.emptyTeamStaffForm();
        this.selectedTeamStaffAssignment = null;
    }

    openStaffDialog(staff?: AcademyStaffMember) {
        this.staffSubmitted = false;
        this.staffDialogMode = staff ? 'edit' : 'create';
        this.editingStaffId = staff?.id ?? null;
        this.selectedStaffMember = staff ?? null;
        this.staffForm = staff
            ? {
                  fullName: staff.fullName,
                  email: staff.email,
                  role: staff.role,
                  status: staff.status,
                  sendInvitation: staff.accessMode === 'INVITATION',
                  password: '',
                  passwordConfirmation: ''
              }
            : this.emptyStaffForm();
        this.staffDialogVisible = true;
    }

    resetStaffDialog() {
        this.staffDialogVisible = false;
        this.staffSubmitted = false;
        this.staffDialogMode = 'create';
        this.editingStaffId = null;
        this.staffForm = this.emptyStaffForm();
        this.selectedStaffMember = null;
    }

    setStaffAccessMode(sendInvitation: boolean) {
        this.staffForm.sendInvitation = sendInvitation;
        if (sendInvitation) {
            this.staffForm.password = '';
            this.staffForm.passwordConfirmation = '';
        }
    }

    saveVenue() {
        this.venueSubmitted = true;

        if (!this.isVenueFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa la sede',
                detail: 'Completa los campos obligatorios antes de guardar.'
            });
            return;
        }

        this.venueSaving = true;
        const payload = this.buildVenuePayload();
        const request$ = this.venueDialogMode === 'create' ? this.venueService.create(payload) : this.editingVenueId ? this.venueService.update(this.editingVenueId, payload) : null;
        if (!request$) {
            this.venueSaving = false;
            return;
        }

        request$.pipe(finalize(() => (this.venueSaving = false))).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: this.venueDialogMode === 'create' ? 'Sede agregada' : 'Sede actualizada',
                    detail: 'Los cambios quedaron guardados correctamente.'
                });
                this.resetVenueDialog();
                this.refreshVenues();
            },
            error: (error: AuthErrorLike) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'No pudimos guardar la sede',
                    detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                });
            }
        });
    }

    saveCategory() {
        this.categorySubmitted = true;

        if (!this.isCategoryFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa la categoría',
                detail: 'Completa correctamente los campos obligatorios antes de guardar.'
            });
            return;
        }

        this.categorySaving = true;
        const payload = this.buildCategoryPayload();
        const request$ =
            this.categoryDialogMode === 'create'
                ? this.categoryService.create(payload)
                : this.editingCategoryId
                  ? this.categoryService.update(this.editingCategoryId, payload)
                  : null;

        if (!request$) {
            this.categorySaving = false;
            return;
        }

        request$.pipe(finalize(() => (this.categorySaving = false))).subscribe({
            next: (category) => {
                this.messageService.add({
                    severity: 'success',
                    summary: this.categoryDialogMode === 'create' ? 'Categoría agregada' : 'Categoría actualizada',
                    detail: 'Los cambios quedaron guardados correctamente.'
                });
                this.resetCategoryDialog();
                this.refreshCategories();
                this.selectedCategory = category;
            },
            error: (error: AuthErrorLike) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'No pudimos guardar la categoría',
                    detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                });
            }
        });
    }

    saveTeam() {
        this.teamSubmitted = true;

        if (!this.isTeamFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa el equipo',
                detail: 'Completa correctamente los campos obligatorios antes de guardar.'
            });
            return;
        }

        const trimmedName = this.teamForm.name.trim();
        const selectedCategory = this.categories.find((category) => category.id === this.teamForm.categoryId);

        if (!selectedCategory) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Categoría no disponible',
                detail: 'Selecciona una categoría activa para continuar.'
            });
            return;
        }

        if (this.teamDialogMode === 'create') {
            this.teams = [
                {
                    id: `team-${Date.now()}`,
                    name: trimmedName,
                    categoryId: selectedCategory.id,
                    categoryName: selectedCategory.name,
                    status: 'ACTIVE'
                },
                ...this.teams
            ];

            this.messageService.add({
                severity: 'success',
                summary: 'Equipo agregado',
                detail: 'El nuevo equipo quedó registrado en esta iteración mock.'
            });
        } else if (this.editingTeamId) {
            this.teams = this.teams.map((team) =>
                team.id === this.editingTeamId
                    ? {
                          ...team,
                          name: trimmedName,
                          categoryId: selectedCategory.id,
                          categoryName: selectedCategory.name
                      }
                    : team
            );

            this.messageService.add({
                severity: 'success',
                summary: 'Equipo actualizado',
                detail: 'Los cambios del equipo quedaron listos en esta iteración mock.'
            });
        }

        this.resetTeamDialog();
    }

    saveTeamStaffAssignment() {
        this.teamStaffSubmitted = true;

        if (!this.selectedTeam || !this.isTeamStaffFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa el cuerpo técnico',
                detail: 'Completa correctamente los campos obligatorios antes de guardar.'
            });
            return;
        }

        const selectedStaff = this.staffMembers.find((staff) => staff.id === this.teamStaffForm.staffId);

        if (!selectedStaff) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Miembro no disponible',
                detail: 'Selecciona un miembro activo del staff para continuar.'
            });
            return;
        }

        if (this.teamStaffDialogMode === 'create') {
            this.teamStaffAssignments = [
                {
                    assignmentId: `assignment-${Date.now()}`,
                    staffId: selectedStaff.id,
                    userId: selectedStaff.userId,
                    teamId: this.selectedTeam.id,
                    fullName: selectedStaff.fullName,
                    email: selectedStaff.email,
                    role: this.teamStaffForm.role as AcademyTeamStaffAssignment['role'],
                    status: 'ACTIVE'
                },
                ...this.teamStaffAssignments
            ];

            this.messageService.add({
                severity: 'success',
                summary: 'Miembro asignado',
                detail: 'El cuerpo técnico del equipo quedó actualizado en esta iteración mock.'
            });
        } else if (this.editingTeamStaffAssignmentId) {
            this.teamStaffAssignments = this.teamStaffAssignments.map((assignment) =>
                assignment.assignmentId === this.editingTeamStaffAssignmentId
                    ? {
                          ...assignment,
                          role: this.teamStaffForm.role as AcademyTeamStaffAssignment['role']
                      }
                    : assignment
            );

            this.messageService.add({
                severity: 'success',
                summary: 'Rol actualizado',
                detail: 'El rol técnico quedó actualizado en esta iteración mock.'
            });
        }

        this.resetTeamStaffDialog();
    }

    saveStaff() {
        this.staffSubmitted = true;

        if (!this.isStaffFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa el staff',
                detail: 'Completa correctamente los campos obligatorios antes de guardar.'
            });
            return;
        }

        const accessMode: AcademyStaffMember['accessMode'] = this.staffForm.sendInvitation ? 'INVITATION' : 'PASSWORD';
        const trimmedName = this.staffForm.fullName.trim();
        const normalizedEmail = this.staffForm.email.trim().toLowerCase();

        if (this.staffDialogMode === 'create') {
            const status: AcademyStaffMember['status'] = this.staffForm.sendInvitation ? 'PENDING_ACTIVATION' : 'ACTIVE';

            this.staffMembers = [
                {
                    id: `staff-${Date.now()}`,
                    userId: `user-${Date.now()}`,
                    fullName: trimmedName,
                    email: normalizedEmail,
                    role: this.staffForm.role as AcademyStaffMember['role'],
                    accessMode,
                    status
                },
                ...this.staffMembers
            ];

            this.messageService.add({
                severity: 'success',
                summary: 'Staff creado',
                detail: accessMode === 'INVITATION' ? 'La invitación quedó lista para enviarse al nuevo integrante.' : 'El integrante quedó creado con acceso inicial desde la plataforma.'
            });
        } else if (this.editingStaffId) {
            this.staffMembers = this.staffMembers.map((item) =>
                item.id === this.editingStaffId
                    ? {
                          ...item,
                          fullName: trimmedName,
                          email: normalizedEmail,
                          role: this.staffForm.role as AcademyStaffMember['role'],
                          status: this.staffForm.status,
                          accessMode
                      }
                    : item
            );

            this.teamStaffAssignments = this.teamStaffAssignments.map((assignment) =>
                assignment.staffId === this.editingStaffId
                    ? {
                          ...assignment,
                          fullName: trimmedName,
                          email: normalizedEmail
                      }
                    : assignment
            );

            this.messageService.add({
                severity: 'success',
                summary: 'Staff actualizado',
                detail: 'Los cambios del integrante quedaron listos en esta iteración mock.'
            });
        }

        this.resetStaffDialog();
    }

    toggleStaffStatus(staff: AcademyStaffMember) {
        const nextStatus: AcademyStaffMember['status'] = staff.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        this.staffMembers = this.staffMembers.map((item) => (item.id === staff.id ? { ...item, status: nextStatus } : item));

        this.messageService.add({
            severity: 'info',
            summary: nextStatus === 'ACTIVE' ? 'Staff reactivado' : 'Staff desactivado',
            detail: nextStatus === 'ACTIVE' ? 'El integrante volvió a quedar disponible.' : 'El integrante dejó de tener acceso activo.'
        });
    }

    resendStaffInvitation(staff: AcademyStaffMember) {
        this.messageService.add({
            severity: 'success',
            summary: 'Invitación reenviada',
            detail: `La invitación de acceso para ${staff.fullName} quedó lista en esta iteración mock.`
        });
    }

    toggleVenueStatus(venue: VenueApiVenue) {
        const nextAction = (venue.status ?? 'ACTIVE') === 'ACTIVE' ? 'inactivate' : 'activate';
        this.confirmationService.confirm({
            header: nextAction === 'inactivate' ? 'Desactivar sede' : 'Reactivar sede',
            icon: 'pi pi-exclamation-triangle',
            message: nextAction === 'inactivate' ? `¿Deseas desactivar la sede "${venue.name}"?` : `¿Deseas reactivar la sede "${venue.name}"?`,
            acceptLabel: nextAction === 'inactivate' ? 'Desactivar' : 'Reactivar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: nextAction === 'inactivate' ? 'p-button-danger' : '',
            accept: () => {
                this.venueStatusUpdatingId = venue.id;
                const request$ = nextAction === 'inactivate' ? this.venueService.inactivate(venue.id) : this.venueService.activate(venue.id);
                request$
                    .pipe(finalize(() => (this.venueStatusUpdatingId = null)))
                    .subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: nextAction === 'inactivate' ? 'Sede desactivada' : 'Sede activada',
                                detail: 'El listado se refrescó con el estado más reciente.'
                            });
                            this.refreshVenues();
                        },
                        error: (error: AuthErrorLike) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'No pudimos cambiar el estado',
                                detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                            });
                        }
                    });
            }
        });
    }

    toggleCategoryStatus(category: AcademyCategory) {
        const nextAction = category.status === 'ACTIVE' ? 'inactivate' : 'activate';
        this.confirmationService.confirm({
            header: nextAction === 'inactivate' ? 'Desactivar categoría' : 'Reactivar categoría',
            icon: 'pi pi-exclamation-triangle',
            message: nextAction === 'inactivate' ? `¿Deseas desactivar la categoría "${category.name}"?` : `¿Deseas reactivar la categoría "${category.name}"?`,
            acceptLabel: nextAction === 'inactivate' ? 'Desactivar' : 'Reactivar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: nextAction === 'inactivate' ? 'p-button-danger' : '',
            accept: () => {
                this.categoryStatusUpdatingId = category.id;
                const request$ = nextAction === 'inactivate' ? this.categoryService.inactivate(category.id) : this.categoryService.activate(category.id);
                request$
                    .pipe(finalize(() => (this.categoryStatusUpdatingId = null)))
                    .subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: nextAction === 'inactivate' ? 'Categoría desactivada' : 'Categoría activada',
                                detail: 'El listado se refrescó con el estado más reciente.'
                            });
                            this.refreshCategories();
                        },
                        error: (error: AuthErrorLike) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'No pudimos cambiar el estado',
                                detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                            });
                        }
                    });
            }
        });
    }

    toggleTeamStatus(team: AcademyTeam) {
        const nextStatus = team.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        this.teams = this.teams.map((item) => (item.id === team.id ? { ...item, status: nextStatus } : item));

        this.messageService.add({
            severity: 'info',
            summary: nextStatus === 'ACTIVE' ? 'Equipo activado' : 'Equipo inactivado',
            detail: nextStatus === 'ACTIVE' ? 'El equipo volvió a quedar disponible.' : 'El equipo dejó de estar disponible para la operación.'
        });
    }

    removeTeamStaffAssignment(assignment: AcademyTeamStaffAssignment) {
        this.teamStaffAssignments = this.teamStaffAssignments.filter((item) => item.assignmentId !== assignment.assignmentId);

        this.messageService.add({
            severity: 'info',
            summary: 'Miembro retirado',
            detail: 'La asignación fue retirada del equipo en esta iteración mock.'
        });
    }

    showVenueError(field: keyof AcademyVenueForm): boolean {
        return this.venueSubmitted && !this.isVenueFieldValid(field);
    }

    showCategoryError(field: keyof AcademyCategoryForm): boolean {
        return this.categorySubmitted && !this.isCategoryFieldValid(field);
    }

    showTeamError(field: keyof AcademyTeamForm): boolean {
        return this.teamSubmitted && !this.isTeamFieldValid(field);
    }

    showTeamStaffError(field: keyof AcademyTeamStaffForm): boolean {
        return this.teamStaffSubmitted && !this.isTeamStaffFieldValid(field);
    }

    showStaffError(field: keyof AcademyStaffForm): boolean {
        return this.staffSubmitted && !this.isStaffFieldValid(field);
    }

    onVenueNameInput(event: Event) {
        this.venueForm.name = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onVenueLocationCountryChange() {
        this.venueForm.department = '';
        this.venueForm.city = '';
    }

    onVenueDepartmentChange() {
        this.venueForm.city = '';
    }

    onVenuePhoneNumberInput(event: Event) {
        this.venueForm.phoneNumber = this.sanitizePhoneInput((event.target as HTMLInputElement).value);
    }

    onVenueAddressInput(event: Event) {
        this.venueForm.address = this.sanitizeAddressInput((event.target as HTMLInputElement).value);
    }

    onCategoryNameInput(event: Event) {
        this.categoryForm.name = this.sanitizeNameInput((event.target as HTMLInputElement).value);
        this.categoryForm.categoryKey = this.buildCategoryKey(this.categoryForm.name);
    }

    onCategoryAgeInput(field: 'minAge' | 'maxAge', event: Event) {
        const input = event.target as HTMLInputElement;
        const digits = this.sanitizeNumericInput(input.value).slice(0, 2);
        input.value = digits;
        this.categoryForm[field] = digits;
    }

    onTeamNameInput(event: Event) {
        this.teamForm.name = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onStaffNameInput(event: Event) {
        this.staffForm.fullName = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onStaffEmailInput(event: Event) {
        this.staffForm.email = this.sanitizeEmailInput((event.target as HTMLInputElement).value);
    }

    showError(field: string): boolean {
        return this.submitted && !this.isFieldValid(field);
    }

    showTaxError(field: keyof AcademyTaxProfile): boolean {
        return this.taxSubmitted && !this.isTaxFieldValid(field);
    }

    onAcademyNameInput(event: Event) {
        this.form.name = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onTaxLegalNameInput(event: Event) {
        this.taxForm.legalName = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onAddressInput(event: Event) {
        this.form.address = this.sanitizeAddressInput((event.target as HTMLInputElement).value);
    }

    onFiscalAddressInput(event: Event) {
        this.taxForm.fiscalAddress = this.sanitizeAddressInput((event.target as HTMLInputElement).value);
    }

    onPhoneInput(event: Event) {
        this.form.phoneNumber = this.sanitizePhoneInput((event.target as HTMLInputElement).value);
    }

    onTaxIdNumberInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.taxForm.taxIdNumber = input.value.replace(/[^\dA-Za-z-]/g, '');
        input.value = this.taxForm.taxIdNumber;
    }

    onTaxCheckDigitInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.taxForm.taxCheckDigit = input.value.replace(/[^\dA-Za-z]/g, '');
        input.value = this.taxForm.taxCheckDigit;
    }

    onEmailInput() {
        this.form.contactEmail = this.sanitizeEmailInput(this.form.contactEmail);
    }

    onBillingEmailInput() {
        this.taxForm.billingEmail = this.sanitizeEmailInput(this.taxForm.billingEmail);
    }

    onFiscalCityInput(event: Event) {
        this.taxForm.fiscalCity = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onLocationCountryChange() {
        this.form.department = '';
        this.form.city = '';
    }

    onDepartmentChange() {
        this.form.city = '';
    }

    onRestrictedNameKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event) || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        if (!this.isAllowedNameCharacter(event.key)) {
            event.preventDefault();
        }
    }

    onRestrictedNamePaste(event: ClipboardEvent) {
        if (!this.isAllowedNameText(event.clipboardData?.getData('text') ?? '')) {
            event.preventDefault();
        }
    }

    onAddressKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event) || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        if (!this.isAllowedAddressCharacter(event.key)) {
            event.preventDefault();
        }
    }

    onAddressPaste(event: ClipboardEvent) {
        const pastedText = event.clipboardData?.getData('text') ?? '';
        if (pastedText !== this.sanitizeAddressInput(pastedText)) {
            event.preventDefault();
        }
    }

    onEmailKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event) || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        if (!this.isAllowedEmailCharacter(event.key)) {
            event.preventDefault();
        }
    }

    onEmailPaste(event: ClipboardEvent) {
        const pastedText = event.clipboardData?.getData('text') ?? '';
        if (pastedText !== this.sanitizeEmailInput(pastedText)) {
            event.preventDefault();
        }
    }

    private canEditAcademy(): boolean {
        return ['tenant_owner', 'academy_admin', 'ROLE_TENANT_OWNER', 'ROLE_ACADEMY_ADMIN'].includes(this.auth.getRole() ?? '');
    }

    private isFormValid(): boolean {
        return ['name', 'contactEmail', 'countryCode', 'phoneNumber', 'country', 'department', 'city'].every((field) => this.isFieldValid(field));
    }

    private isTaxFormValid(): boolean {
        return ['legalName', 'taxIdType', 'taxIdNumber', 'taxRegime', 'billingEmail'].every((field) => this.isTaxFieldValid(field as keyof AcademyTaxProfile));
    }

    private isVenueFormValid(): boolean {
        return ['name', 'countryCode', 'phoneNumber'].every((field) => this.isVenueFieldValid(field as keyof AcademyVenueForm));
    }

    private isCategoryFormValid(): boolean {
        return ['categoryKey', 'name', 'minAge', 'maxAge'].every((field) => this.isCategoryFieldValid(field as keyof AcademyCategoryForm));
    }

    private isTeamFormValid(): boolean {
        return ['name', 'categoryId'].every((field) => this.isTeamFieldValid(field as keyof AcademyTeamForm));
    }

    private isTeamStaffFormValid(): boolean {
        return ['staffId', 'role'].every((field) => this.isTeamStaffFieldValid(field as keyof AcademyTeamStaffForm));
    }

    private isStaffFormValid(): boolean {
        const requiredFields: (keyof AcademyStaffForm)[] = ['fullName', 'email', 'role'];
        if (this.staffDialogMode === 'edit') {
            requiredFields.push('status');
        }
        if (this.requiresStaffPasswordFields()) {
            requiredFields.push('password', 'passwordConfirmation');
        }

        return requiredFields.every((field) => this.isStaffFieldValid(field));
    }

    private isFieldValid(field: string): boolean {
        switch (field) {
            case 'name':
                return this.hasValidText(this.form.name, 2);
            case 'contactEmail':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.contactEmail.trim());
            case 'countryCode':
                return !!this.form.countryCode.trim();
            case 'phoneNumber':
                return this.isValidPhoneNumber(this.form.countryCode, this.form.phoneNumber);
            case 'country':
                return !!this.form.country.trim();
            case 'department':
                return !!this.form.department.trim();
            case 'city':
                return !!this.form.city.trim();
            case 'address':
                return !this.form.address?.trim() || this.hasValidAddressText(this.form.address, 5);
            default:
                return true;
        }
    }

    private isTaxFieldValid(field: keyof AcademyTaxProfile): boolean {
        switch (field) {
            case 'legalName':
                return this.hasValidText(this.taxForm.legalName, 3);
            case 'taxIdType':
                return !!this.taxForm.taxIdType.trim();
            case 'taxIdNumber':
                return this.taxForm.taxIdNumber.trim().length >= 6;
            case 'taxRegime':
                return !!this.taxForm.taxRegime.trim();
            case 'billingEmail':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.taxForm.billingEmail.trim());
            case 'taxCheckDigit':
            case 'fiscalAddress':
            case 'fiscalCity':
            case 'fiscalCountry':
            default:
                return true;
        }
    }

    private getTaxOptionLabel(options: { label: string; value: string }[], value: string): string {
        return options.find((option) => option.value === value)?.label ?? value;
    }

    private isVenueFieldValid(field: keyof AcademyVenueForm): boolean {
        switch (field) {
            case 'name':
                return this.hasValidText(this.venueForm.name, 2);
            case 'country':
                return !!this.venueForm.country.trim();
            case 'department':
                return !!this.venueForm.department.trim();
            case 'city':
                return !!this.venueForm.city.trim();
            case 'countryCode':
                return !!this.venueForm.countryCode.trim();
            case 'phoneNumber':
                return !this.venueForm.phoneNumber.trim() || this.isValidPhoneNumber(this.venueForm.countryCode, this.venueForm.phoneNumber);
            case 'address':
            case 'notes':
            default:
                return true;
        }
    }

    private isCategoryFieldValid(field: keyof AcademyCategoryForm): boolean {
        const minAge = Number(this.categoryForm.minAge);
        const maxAge = Number(this.categoryForm.maxAge);
        const categoryKey = this.categoryForm.categoryKey.trim();

        switch (field) {
            case 'categoryKey':
                return /^[a-zA-Z0-9_-]+$/.test(categoryKey);
            case 'name':
                return this.hasValidText(this.categoryForm.name, 2);
            case 'minAge':
                return Number.isInteger(minAge) && minAge >= 4 && minAge <= 99 && (!Number.isInteger(maxAge) || minAge <= maxAge);
            case 'maxAge':
                return Number.isInteger(maxAge) && maxAge >= 4 && maxAge <= 99 && (!Number.isInteger(minAge) || maxAge >= minAge);
            case 'description':
            default:
                return true;
        }
    }

    private isTeamFieldValid(field: keyof AcademyTeamForm): boolean {
        switch (field) {
            case 'name':
                return this.hasValidText(this.teamForm.name, 2);
            case 'categoryId':
                return !!this.teamForm.categoryId && this.categories.some((category) => category.id === this.teamForm.categoryId && category.status === 'ACTIVE');
            default:
                return true;
        }
    }

    private isTeamStaffFieldValid(field: keyof AcademyTeamStaffForm): boolean {
        switch (field) {
            case 'staffId':
                return !!this.teamStaffForm.staffId;
            case 'role':
                return !!this.teamStaffForm.role;
            default:
                return true;
        }
    }

    private isStaffFieldValid(field: keyof AcademyStaffForm): boolean {
        switch (field) {
            case 'fullName':
                return this.hasValidText(this.staffForm.fullName, 2);
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.staffForm.email.trim()) && !this.isDuplicateStaffEmail(this.staffForm.email);
            case 'role':
                return !!this.staffForm.role;
            case 'status':
                return ['ACTIVE', 'INACTIVE', 'PENDING_ACTIVATION'].includes(this.staffForm.status);
            case 'password':
                return !this.requiresStaffPasswordFields() || this.staffForm.password.trim().length >= 8;
            case 'passwordConfirmation':
                return !this.requiresStaffPasswordFields() || (!!this.staffForm.passwordConfirmation.trim() && this.staffForm.password === this.staffForm.passwordConfirmation);
            case 'sendInvitation':
            default:
                return true;
        }
    }

    shouldShowStaffPasswordFields(): boolean {
        return this.requiresStaffPasswordFields() || (!this.staffForm.sendInvitation && this.staffDialogMode === 'create');
    }

    private requiresStaffPasswordFields(): boolean {
        if (this.staffForm.sendInvitation) {
            return false;
        }

        if (this.staffDialogMode === 'create') {
            return true;
        }

        if (this.selectedStaffMember?.accessMode === 'INVITATION') {
            return true;
        }

        return !!this.staffForm.password.trim() || !!this.staffForm.passwordConfirmation.trim();
    }

    private hasValidText(value: string, minLength: number): boolean {
        const trimmed = value.trim();
        return trimmed.length >= minLength && this.isAllowedNameText(trimmed);
    }

    private hasValidAddressText(value: string, minLength: number): boolean {
        const trimmed = value.trim();
        return trimmed.length >= minLength && /^[\p{L}\p{N}\s.#,-]+$/u.test(trimmed);
    }

    private sanitizeNameInput(value: string): string {
        return value.replace(/[^\p{L}\p{N}\s]/gu, '');
    }

    private sanitizeAddressInput(value: string): string {
        return value.replace(/[^\p{L}\p{N}\s.#,-]/gu, '');
    }

    private sanitizePhoneInput(value: string): string {
        return value.replace(/[^\d\s()+-]/g, '');
    }

    private sanitizeNumericInput(value: string): string {
        return value.replace(/[^\d]/g, '');
    }

    private sanitizeEmailInput(value: string): string {
        return value.replace(/[^a-zA-Z0-9@._%+\-]/g, '').replace(/\s+/g, '');
    }

    private isAllowedEditingKey(event: KeyboardEvent): boolean {
        return ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key);
    }

    private isAllowedNameCharacter(character: string): boolean {
        return /^[\p{L}\p{N}\s]$/u.test(character);
    }

    private isAllowedNameText(text: string): boolean {
        return /^[\p{L}\p{N}][\p{L}\p{N}\s]*$/u.test(text);
    }

    private isAllowedEmailCharacter(character: string): boolean {
        return /^[a-zA-Z0-9@._%+\-]$/.test(character);
    }

    private isAllowedAddressCharacter(character: string): boolean {
        return /^[\p{L}\p{N}\s.#,-]$/u.test(character);
    }

    private isValidPhoneNumber(countryCode: string, phoneNumber: string): boolean {
        const digits = phoneNumber.replace(/\D/g, '');

        switch (countryCode) {
            case '+51':
                return /^9\d{8}$/.test(digits);
            case '+57':
                return /^3\d{9}$/.test(digits);
            case '+56':
                return /^[2-9]\d{8}$/.test(digits);
            case '+593':
                return /^9\d{8}$/.test(digits);
            case '+52':
                return /^[1-9]\d{9}$/.test(digits);
            case '+34':
                return /^[6-9]\d{8}$/.test(digits);
            default:
                return digits.length >= 6 && digits.length <= 12;
        }
    }

    private isDuplicateCategoryName(name: string): boolean {
        const normalizedName = name.trim().toLowerCase();
        if (!normalizedName) {
            return false;
        }

        return this.categories.some((category) => category.id !== this.editingCategoryId && category.name.trim().toLowerCase() === normalizedName);
    }

    private isDuplicateCategoryKey(categoryKey: string): boolean {
        const normalizedKey = categoryKey.trim().toLowerCase();
        if (!normalizedKey) {
            return false;
        }

        return this.categories.some((category) => category.id !== this.editingCategoryId && (category.categoryKey ?? '').trim().toLowerCase() === normalizedKey);
    }

    private buildCategoryKey(name: string): string {
        return name
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    getCategoryAgeRangeLabel(category: AcademyCategory): string {
        const minAge = category.minAge ?? null;
        const maxAge = category.maxAge ?? null;

        if (minAge === null && maxAge === null) {
            return '-';
        }

        if (minAge === null) {
            return `Hasta ${maxAge} años`;
        }

        if (maxAge === null) {
            return `Desde ${minAge} años`;
        }

        return `${minAge} a ${maxAge} años`;
    }

    getCategoryStatusLabel(status: AcademyCategory['status']): string {
        switch (status) {
            case 'ACTIVE':
                return 'Activa';
            case 'INACTIVE':
                return 'Inactiva';
            default:
                return status ?? '-';
        }
    }

    getCategoryStatusSeverity(status: AcademyCategory['status']): 'success' | 'danger' {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
            default:
                return 'danger';
        }
    }

    private buildCategoryPayload(): AcademyCategoryUpsertRequest {
        const categoryKey = this.categoryForm.categoryKey.trim() || this.buildCategoryKey(this.categoryForm.name);

        return {
            categoryKey,
            name: this.categoryForm.name.trim(),
            minAge: Number(this.categoryForm.minAge),
            maxAge: Number(this.categoryForm.maxAge),
            description: this.categoryForm.description.trim() || undefined
        };
    }

    private categoryHasDetail(category: AcademyCategory): boolean {
        return typeof category.academyId === 'string' && !!category.academyId.trim();
    }

    private loadCategoryDetail(categoryId: string) {
        return this.categoryService.getById(categoryId).subscribe({
            next: (category) => {
                this.selectedCategory = category;
                this.categoryDetailVisible = true;
                this.categories = this.categories.map((item) => (item.id === category.id ? category : item));
            },
            error: (error: AuthErrorLike) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'No pudimos cargar el detalle',
                    detail: this.resolveErrorMessage(error, 'Intenta nuevamente en unos segundos.')
                });
            }
        });
    }

    private isDuplicateStaffEmail(email: string): boolean {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail) {
            return false;
        }

        return this.staffMembers.some((staff) => staff.id !== this.editingStaffId && staff.email.trim().toLowerCase() === normalizedEmail);
    }

    getTeamStatusLabel(status: AcademyTeam['status']): string {
        switch (status) {
            case 'ACTIVE':
                return 'Activo';
            case 'INACTIVE':
                return 'Inactivo';
            default:
                return status;
        }
    }

    getTeamStatusSeverity(status: AcademyTeam['status']): 'success' | 'danger' {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
            default:
                return 'danger';
        }
    }

    getTechnicalRoleLabel(role: AcademyTeamStaffAssignment['role']): string {
        switch (role) {
            case 'HEAD_COACH':
                return 'Entrenador principal';
            case 'ASSISTANT_COACH':
                return 'Entrenador asistente';
            case 'GOALKEEPER_COACH':
                return 'Entrenador de porteros';
            case 'FITNESS_COACH':
                return 'Preparador físico';
            case 'NUTRITIONIST':
                return 'Nutricionista';
            case 'PHYSIOTHERAPIST':
                return 'Fisioterapia';
            default:
                return role;
        }
    }

    getSystemRoleLabel(role: AcademyStaffMember['role']): string {
        switch (role) {
            case 'ROLE_ACADEMY_ADMIN':
                return 'Administrador de academia';
            case 'ROLE_COACH':
                return 'Entrenador';
            default:
                return role;
        }
    }

    getStaffAccessModeLabel(accessMode: AcademyStaffMember['accessMode']): string {
        switch (accessMode) {
            case 'INVITATION':
                return 'Invitación';
            case 'PASSWORD':
                return 'Contraseña';
            default:
                return accessMode;
        }
    }

    getStaffStatusLabel(status: AcademyStaffMember['status']): string {
        switch (status) {
            case 'ACTIVE':
                return 'Activo';
            case 'PENDING_ACTIVATION':
                return 'Pendiente de activación';
            case 'INACTIVE':
                return 'Inactivo';
            default:
                return status;
        }
    }

    getStaffStatusSeverity(status: AcademyStaffMember['status']): 'success' | 'warn' | 'danger' {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'PENDING_ACTIVATION':
                return 'warn';
            case 'INACTIVE':
            default:
                return 'danger';
        }
    }

    getStaffAssignmentStatusLabel(status: AcademyTeamStaffAssignment['status']): string {
        switch (status) {
            case 'ACTIVE':
                return 'Activo';
            case 'INACTIVE':
                return 'Inactivo';
            default:
                return status;
        }
    }

    getStaffAssignmentStatusSeverity(status: AcademyTeamStaffAssignment['status']): 'success' | 'danger' {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
            default:
                return 'danger';
        }
    }

    getVenueStatusLabel(status: VenueApiVenue['status']): string {
        switch (status) {
            case 'ACTIVE':
                return 'Activa';
            case 'INACTIVE':
                return 'Inactiva';
            default:
                return status ?? '-';
        }
    }

    getVenueStatusSeverity(status: VenueApiVenue['status']): 'success' | 'danger' {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'INACTIVE':
            default:
                return 'danger';
        }
    }

    private emptyForm(): AcademyProfile {
        return {
            id: null,
            name: '',
            contactEmail: '',
            phone: '',
            countryCode: '+57',
            phoneNumber: '',
            country: 'Colombia',
            department: '',
            city: '',
            address: '',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        };
    }

    private emptyTaxForm(): AcademyTaxProfile {
        return {
            legalName: this.form?.name ?? '',
            taxIdType: '',
            taxIdNumber: '',
            taxCheckDigit: '',
            taxRegime: '',
            billingEmail: this.form?.contactEmail ?? '',
            fiscalAddress: this.form?.address ?? '',
            fiscalCity: this.form?.city ?? '',
            fiscalCountry: this.form?.country ?? 'Colombia'
        };
    }

    private emptyVenueForm(): AcademyVenueForm {
        return {
            name: '',
            address: '',
            country: this.form?.country ?? 'Colombia',
            department: '',
            city: '',
            countryCode: this.form?.countryCode ?? '+57',
            phoneNumber: '',
            notes: ''
        };
    }

    private buildVenuePayload(): VenueUpsertRequest {
        return {
            name: this.venueForm.name.trim(),
            address: this.venueForm.address.trim() || undefined,
            country: this.venueForm.country.trim() || undefined,
            department: this.venueForm.department.trim() || undefined,
            city: this.venueForm.city.trim() || undefined,
            phone: `${this.venueForm.countryCode.trim()}${this.venueForm.phoneNumber.trim()}`.trim() || undefined,
            notes: this.venueForm.notes.trim() || undefined
        };
    }

    private resolveVenueCountryCode(phone: string): string {
        const normalized = phone.replace(/\s+/g, '');

        if (normalized.startsWith('+57')) return '+57';
        if (normalized.startsWith('+51')) return '+51';
        if (normalized.startsWith('+56')) return '+56';
        if (normalized.startsWith('+593')) return '+593';
        if (normalized.startsWith('+52')) return '+52';
        if (normalized.startsWith('+34')) return '+34';

        return this.form?.countryCode ?? '+57';
    }

    private resolveVenuePhoneNumber(phone: string): string {
        const normalized = phone.replace(/\s+/g, '');
        const countryCode = this.resolveVenueCountryCode(normalized);

        if (normalized.startsWith(countryCode)) {
            return normalized.slice(countryCode.length).trim();
        }

        return normalized.replace(/^\+\d+/, '').trim();
    }

    private emptyCategoryForm(): AcademyCategoryForm {
        return {
            categoryKey: '',
            name: '',
            minAge: '',
            maxAge: '',
            description: ''
        };
    }

    private emptyTeamForm(): AcademyTeamForm {
        return {
            name: '',
            categoryId: ''
        };
    }

    private emptyTeamStaffForm(): AcademyTeamStaffForm {
        return {
            staffId: '',
            role: ''
        };
    }

    private emptyStaffForm(): AcademyStaffForm {
        return {
            fullName: '',
            email: '',
            role: '',
            status: 'PENDING_ACTIVATION',
            sendInvitation: true,
            password: '',
            passwordConfirmation: ''
        };
    }
}
