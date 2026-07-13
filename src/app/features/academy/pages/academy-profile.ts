import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MockAuthService } from '@/app/core/auth/mock-auth.service';
import { ImageCropperComponent, ImageCropperFileError, ImageCropperResult } from '@/app/shared/ui/image-cropper/image-cropper';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { AcademyProfileService } from '../data-access/academy-profile.service';
import { AcademyProfile } from '../models/academy.model';
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

interface AcademyVenue {
    id: string;
    name: string;
    address: string;
    city: string;
    phone: string;
    status: 'ACTIVE' | 'INACTIVE';
}

interface AcademyVenueForm {
    name: string;
    address: string;
    city: string;
    phone: string;
}

@Component({
    selector: 'app-academy-profile-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, FormsModule, ImageCropperComponent, InputTextModule, MenuModule, MessageModule, PageHeader, RouterModule, SelectModule, TableModule, TabsModule, TagModule, TextareaModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />
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
            <app-page-header [breadcrumbs]="breadcrumbs" title="Academia" subtitle="Actualiza la información principal y los datos de contacto de tu academia."></app-page-header>

            @if (!academy) {
                <div class="rounded-[0.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Sin academia asociada</p>
                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Este usuario no tiene una academia vinculada. Este panel aplica para owner o administrador de academia.</p>
                </div>
            } @else {
                <div class="form-width-2col mx-auto mt-4 w-full space-y-3 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
                    <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                        <p-tabs [value]="activeTab">
                            <p-tablist class="overflow-x-auto">
                                <p-tab value="information" (click)="activeTab = 'information'">Información</p-tab>
                                <p-tab value="venues" (click)="activeTab = 'venues'">Sedes</p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel value="information">
                                    <div class="space-y-4 p-3 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:p-4 sm:pb-4">
                                        <div class="grid grid-cols-12 gap-4">
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
                                        </div>

                                        <div class="rounded-[0.9rem] border border-slate-200 bg-slate-50 p-4 dark:border-surface-700 dark:bg-surface-900/40">
                                            <div class="flex flex-col gap-2">
                                                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Escudo institucional</p>
                                                <p class="text-sm leading-6 text-slate-500 dark:text-slate-400">Elige una imagen clara y ajústala antes de guardarla.</p>
                                            </div>

                                            <div class="mt-4 flex flex-col gap-4 rounded-[0.85rem] border border-dashed border-slate-300 bg-white p-4 dark:border-surface-600 dark:bg-surface-900">
                                                <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                    <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] border border-slate-200 bg-slate-50 dark:border-surface-700 dark:bg-surface-900/60">
                                                        @if (shieldPreviewUrl) {
                                                            <img [src]="shieldPreviewUrl" alt="Escudo institucional" class="h-full w-full object-cover" />
                                                        } @else {
                                                            <span class="text-xl font-semibold text-sky-700 dark:text-sky-300">{{ academyInitials }}</span>
                                                        }
                                                    </div>

                                                    <div class="min-w-0 flex-1">
                                                        <p class="m-0 text-sm font-medium text-surface-900 dark:text-surface-0">{{ shieldFileName }}</p>
                                                        <p class="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
                                                            @if (hasPendingShieldChanges) {
                                                                Imagen lista para guardarse.
                                                            } @else {
                                                                Formatos recomendados: PNG o SVG.
                                                            }
                                                        </p>
                                                        <p class="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">Tamaño máximo: 3 MB.</p>
                                                    </div>
                                                </div>

                                                <div class="flex flex-col gap-2 sm:flex-row">
                                                    <input #shieldInput type="file" class="hidden" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" (change)="onShieldSelected($event)" />
                                                    <p-button label="Seleccionar archivo" severity="secondary" outlined styleClass="w-full sm:w-auto" (onClick)="shieldInput.click()" />
                                                    @if (shieldPreviewUrl) {
                                                        <p-button label="Ajustar imagen" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="reopenShieldDialog()" />
                                                        <p-button label="Quitar imagen" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="removeShield()" />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm dark:border-surface-800 dark:bg-surface-900/95 sm:static sm:bg-transparent sm:p-4 sm:backdrop-blur-0">
                                        <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:justify-end">
                                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full" routerLink="/" />
                                            <p-button label="Guardar cambios" icon="pi pi-check" styleClass="w-full" (onClick)="save()" />
                                        </div>
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
                                                <div class="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                                                    <p-button label="Agregar sede" icon="pi pi-plus" styleClass="w-full sm:w-auto" (onClick)="openVenueDialog()" />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white dark:border-surface-700 dark:bg-surface-900">
                                            <div class="border-b border-slate-200 px-3 py-3 dark:border-surface-700 sm:px-4">
                                                <div class="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-3">
                                                    <input pInputText type="text" [(ngModel)]="venueSearch" placeholder="Buscar sede por nombre, ciudad o dirección" class="w-full lg:max-w-md" />
                                                    <p class="m-0 text-sm leading-5 text-slate-500 dark:text-slate-400 lg:text-right">Actualiza la información y el estado de cada sede.</p>
                                                </div>
                                            </div>

                                            <p-table [value]="filteredVenues" [tableStyle]="{ 'min-width': '100%' }" responsiveLayout="scroll" styleClass="text-sm">
                                                <ng-template pTemplate="header">
                                                    <tr>
                                                        <th>Nombre</th>
                                                        <th>Ciudad</th>
                                                        <th>Teléfono</th>
                                                        <th>Estado</th>
                                                        <th class="text-right">Acciones</th>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="body" let-venue>
                                                    <tr>
                                                        <td>
                                                            <div class="flex flex-col gap-1">
                                                                <span class="font-medium text-surface-900 dark:text-surface-0">{{ venue.name }}</span>
                                                                <span class="text-sm text-slate-500 dark:text-slate-400">{{ venue.address || 'Sin dirección registrada' }}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span class="text-surface-900 dark:text-surface-0">{{ venue.city || 'Sin ciudad' }}</span>
                                                        </td>
                                                        <td>
                                                            <span class="text-surface-900 dark:text-surface-0">{{ venue.phone || 'Sin teléfono' }}</span>
                                                        </td>
                                                        <td>
                                                            <p-tag [value]="getVenueStatusLabel(venue.status)" [severity]="getVenueStatusSeverity(venue.status)" />
                                                        </td>
                                                        <td>
                                                            <div class="flex justify-end">
                                                                <p-menu #venueActionsMenu [popup]="true" appendTo="body" [model]="venueActionItems"></p-menu>
                                                                <p-button
                                                                    icon="pi pi-ellipsis-h"
                                                                    [text]="true"
                                                                    rounded
                                                                    severity="secondary"
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
                                    </div>
                                </p-tabpanel>
                            </p-tabpanels>
                        </p-tabs>
                    </div>
                </div>

                <p-dialog [(visible)]="venueDialogVisible" [modal]="true" [draggable]="false" [resizable]="false" [style]="{ width: '34rem' }" [breakpoints]="{ '960px': '42rem', '640px': '96vw' }" [header]="venueDialogMode === 'create' ? 'Agregar sede' : 'Editar sede'" (onHide)="resetVenueDialog()">
                    <div class="space-y-3">
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

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="venueCity" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad <span class="text-rose-500">*</span></label>
                                    <input pInputText id="venueCity" type="text" [(ngModel)]="venueForm.city" placeholder="Ej. Pereira" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onVenueCityInput($event)" />
                                    @if (showVenueError('city')) {
                                        <p-message severity="error" size="small">Ingresa la ciudad.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="venuePhone" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono</label>
                                    <input pInputText id="venuePhone" type="text" [(ngModel)]="venueForm.phone" placeholder="Ej. 3123456789" class="w-full" (input)="onVenuePhoneInput($event)" />
                                    @if (showVenueError('phone')) {
                                        <p-message severity="error" size="small">Ingresa un teléfono válido.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="venueAddress" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección</label>
                                    <input pInputText id="venueAddress" type="text" [(ngModel)]="venueForm.address" placeholder="Ej. Calle 20 # 15-40" class="w-full" (keydown)="onAddressKeydown($event)" (paste)="onAddressPaste($event)" (input)="onVenueAddressInput($event)" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <ng-template pTemplate="footer">
                        <div class="border-t border-slate-200 pt-3 dark:border-surface-700">
                            <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" (onClick)="resetVenueDialog()" />
                                <p-button [label]="venueDialogMode === 'create' ? 'Guardar sede' : 'Guardar cambios'" styleClass="w-full sm:w-auto" (onClick)="saveVenue()" />
                            </div>
                        </div>
                    </ng-template>
                </p-dialog>
            }
        </div>
    `
})
export class AcademyProfilePage {
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
    activeTab: 'information' | 'venues' = 'information';
    academy: AcademyProfile | null;
    form: AcademyProfile;
    shieldFileName = 'Sin imagen seleccionada';
    shieldPreviewUrl: string | null = null;
    hasPendingShieldChanges = false;
    shieldCroppedBlob: Blob | null = null;
    selectedVenue: AcademyVenue | null = null;
    venueSearch = '';
    venueSubmitted = false;
    venueDialogVisible = false;
    venueDialogMode: 'create' | 'edit' = 'create';
    editingVenueId: string | null = null;
    venueForm: AcademyVenueForm = this.emptyVenueForm();
    venues: AcademyVenue[] = [
        {
            id: 'venue-001',
            name: 'Sede Norte',
            address: 'Av. Principal 120',
            city: 'Pereira',
            phone: '3123456789',
            status: 'ACTIVE'
        },
        {
            id: 'venue-002',
            name: 'Sede Sur',
            address: 'Carrera 18 # 32-10',
            city: 'Dosquebradas',
            phone: '3205558899',
            status: 'INACTIVE'
        }
    ];
    venueActionItems: MenuItem[] = [
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

    constructor(
        private readonly academyService: AcademyProfileService,
        private readonly auth: MockAuthService,
        private readonly messageService: MessageService
    ) {
        this.academy = this.academyService.getCurrentAcademy();
        this.form = this.academy ?? this.emptyForm();
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

    get filteredVenues(): AcademyVenue[] {
        const query = this.venueSearch.trim().toLowerCase();
        if (!query) {
            return this.venues;
        }

        return this.venues.filter((venue) => [venue.name, venue.city, venue.address].some((value) => value.toLowerCase().includes(query)));
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

        this.academyService.updateCurrentAcademy(this.form);
        this.academy = this.academyService.getCurrentAcademy();
        this.form = this.academy ?? this.emptyForm();

        this.messageService.add({
            severity: 'success',
            summary: 'Academia actualizada',
            detail: this.hasPendingShieldChanges ? 'Los datos y la nueva imagen quedaron listos en esta iteración mock.' : 'Los datos generales de la academia fueron actualizados.'
        });

        this.hasPendingShieldChanges = false;
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

    reopenShieldDialog() {
        if (!this.shieldPreviewUrl) {
            return;
        }

        this.shieldCropper?.openWithPreview(this.shieldPreviewUrl, this.shieldFileName);
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

    openVenueActionsMenu(event: Event, menu: Menu, venue: AcademyVenue) {
        this.selectedVenue = venue;
        this.venueActionItems = [
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
                label: venue.status === 'ACTIVE' ? 'Marcar como inactiva' : 'Marcar como activa',
                icon: venue.status === 'ACTIVE' ? 'pi pi-pause' : 'pi pi-play',
                command: () => {
                    if (this.selectedVenue) {
                        this.toggleVenueStatus(this.selectedVenue);
                    }
                }
            }
        ];

        menu.toggle(event);
    }

    removeShield() {
        this.shieldPreviewUrl = null;
        this.shieldFileName = 'Sin imagen seleccionada';
        this.shieldCroppedBlob = null;
        this.hasPendingShieldChanges = true;

        this.messageService.add({
            severity: 'info',
            summary: 'Imagen quitada',
            detail: 'El cambio quedó listo para guardarse con el formulario.'
        });
    }

    openVenueDialog(venue?: AcademyVenue) {
        this.venueSubmitted = false;
        this.venueDialogMode = venue ? 'edit' : 'create';
        this.editingVenueId = venue?.id ?? null;
        this.venueForm = venue
            ? {
                  name: venue.name,
                  address: venue.address,
                  city: venue.city,
                  phone: venue.phone
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

        if (this.venueDialogMode === 'create') {
            this.venues = [
                {
                    id: `venue-${Date.now()}`,
                    name: this.venueForm.name.trim(),
                    address: this.venueForm.address.trim(),
                    city: this.venueForm.city.trim(),
                    phone: this.venueForm.phone.trim(),
                    status: 'ACTIVE'
                },
                ...this.venues
            ];

            this.messageService.add({
                severity: 'success',
                summary: 'Sede agregada',
                detail: 'La nueva sede quedó registrada en esta iteración mock.'
            });
        } else if (this.editingVenueId) {
            this.venues = this.venues.map((venue) =>
                venue.id === this.editingVenueId
                    ? {
                          ...venue,
                          name: this.venueForm.name.trim(),
                          address: this.venueForm.address.trim(),
                          city: this.venueForm.city.trim(),
                          phone: this.venueForm.phone.trim()
                      }
                    : venue
            );

            this.messageService.add({
                severity: 'success',
                summary: 'Sede actualizada',
                detail: 'Los cambios de la sede quedaron listos en esta iteración mock.'
            });
        }

        this.resetVenueDialog();
    }

    toggleVenueStatus(venue: AcademyVenue) {
        const nextStatus = venue.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        this.venues = this.venues.map((item) => (item.id === venue.id ? { ...item, status: nextStatus } : item));

        this.messageService.add({
            severity: 'info',
            summary: nextStatus === 'ACTIVE' ? 'Sede activada' : 'Sede inactivada',
            detail: nextStatus === 'ACTIVE' ? 'La sede volvió a quedar disponible.' : 'La sede dejó de estar disponible para la operación.'
        });
    }

    showVenueError(field: keyof AcademyVenueForm): boolean {
        return this.venueSubmitted && !this.isVenueFieldValid(field);
    }

    onVenueNameInput(event: Event) {
        this.venueForm.name = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onVenueCityInput(event: Event) {
        this.venueForm.city = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onVenuePhoneInput(event: Event) {
        this.venueForm.phone = this.sanitizePhoneInput((event.target as HTMLInputElement).value);
    }

    onVenueAddressInput(event: Event) {
        this.venueForm.address = this.sanitizeAddressInput((event.target as HTMLInputElement).value);
    }

    showError(field: string): boolean {
        return this.submitted && !this.isFieldValid(field);
    }

    onAcademyNameInput(event: Event) {
        this.form.name = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onAddressInput(event: Event) {
        this.form.address = this.sanitizeAddressInput((event.target as HTMLInputElement).value);
    }

    onPhoneInput(event: Event) {
        this.form.phoneNumber = this.sanitizePhoneInput((event.target as HTMLInputElement).value);
    }

    onEmailInput() {
        this.form.contactEmail = this.sanitizeEmailInput(this.form.contactEmail);
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
        return ['tenant_owner', 'academy_admin'].includes(this.auth.getRole());
    }

    private isFormValid(): boolean {
        return ['name', 'contactEmail', 'countryCode', 'phoneNumber', 'country', 'department', 'city', 'address'].every((field) => this.isFieldValid(field));
    }

    private isVenueFormValid(): boolean {
        return ['name', 'city', 'phone'].every((field) => this.isVenueFieldValid(field as keyof AcademyVenueForm));
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
                return this.hasValidAddressText(this.form.address, 5);
            default:
                return true;
        }
    }

    private isVenueFieldValid(field: keyof AcademyVenueForm): boolean {
        switch (field) {
            case 'name':
                return this.hasValidText(this.venueForm.name, 2);
            case 'city':
                return this.hasValidText(this.venueForm.city, 2);
            case 'phone':
                return !this.venueForm.phone.trim() || this.isValidPhoneNumber(this.form.countryCode, this.venueForm.phone);
            case 'address':
            default:
                return true;
        }
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

    getVenueStatusLabel(status: AcademyVenue['status']): string {
        switch (status) {
            case 'ACTIVE':
                return 'Activa';
            case 'INACTIVE':
                return 'Inactiva';
            default:
                return status;
        }
    }

    getVenueStatusSeverity(status: AcademyVenue['status']): 'success' | 'danger' {
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

    private emptyVenueForm(): AcademyVenueForm {
        return {
            name: '',
            address: '',
            city: '',
            phone: ''
        };
    }
}
