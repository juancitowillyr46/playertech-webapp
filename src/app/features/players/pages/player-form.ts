import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ImageCropperComponent, ImageCropperFileError, ImageCropperResult } from '@/app/shared/ui/image-cropper/image-cropper';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { PlayerManagementService } from '../data-access/player-management.service';
import { CategoryOption, PlayerForm, PlayerPhoto } from '../models/player.model';

interface CountryOption {
    name: string;
    dialCode: string;
    flagFile: string;
}

@Component({
    selector: 'app-player-form-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, ImageCropperComponent, InputTextModule, MessageModule, PageHeader, RouterModule, SelectModule, ToastModule],
    providers: [MessageService],
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

        <div class="space-y-4">
            <app-page-header [breadcrumbs]="breadcrumbs" title="Nuevo jugador" subtitle="Registra la información principal, la categoría y la foto del jugador."></app-page-header>

            <div class="content-width-compact mx-auto mt-4 w-full space-y-3">
                <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <div class="space-y-4 p-3 sm:p-4">
                        <div class="rounded-[0.9rem] border border-slate-200 bg-slate-50 p-4 dark:border-surface-700 dark:bg-surface-900/60 sm:p-5">
                            <div class="space-y-1.5">
                                <p class="m-0 text-base font-semibold leading-5 text-surface-900 dark:text-surface-0">Información personal</p>
                                <p class="m-0 text-sm leading-5 text-slate-500 dark:text-slate-400">Registra el documento, nombres, apellidos y datos base del jugador.</p>
                            </div>

                            <div class="mt-5 grid grid-cols-12 gap-4">
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

                            <div class="mt-6 border-t border-slate-200 pt-5 dark:border-surface-700"></div>

                            <div class="space-y-1.5">
                                <p class="m-0 text-base font-semibold leading-5 text-surface-900 dark:text-surface-0">Información de contacto</p>
                                <p class="m-0 text-sm leading-5 text-slate-500 dark:text-slate-400">Agrupa el canal de contacto directo del jugador.</p>
                            </div>

                            <div class="mt-5 grid grid-cols-12 gap-4">
                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="phoneNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Celular <span class="text-slate-400">(opcional)</span></label>
                                    <div class="grid grid-cols-12 gap-3">
                                        <p-select
                                            id="countryCode"
                                            [(ngModel)]="form.countryCode"
                                            [options]="countryOptions"
                                            optionLabel="name"
                                            optionValue="dialCode"
                                            [filter]="true"
                                            filterBy="name,dialCode"
                                            placeholder="Código"
                                            class="col-span-12 sm:col-span-4 w-full"
                                            appendTo="body"
                                            [scrollHeight]="'16rem'"
                                        >
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
                                        <input pInputText id="phoneNumber" type="text" [(ngModel)]="form.phoneNumber" placeholder="Ej. 987 654 321" class="col-span-12 sm:col-span-8 w-full" (input)="onPhoneInput($event)" />
                                    </div>
                                    @if (showError('countryCode') || showError('phoneNumber')) {
                                        <p-message severity="error" size="small">Ingresa un celular válido.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="email" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo <span class="text-slate-400">(opcional)</span></label>
                                    <input pInputText id="email" type="text" [(ngModel)]="form.email" placeholder="Ej. jugador@correo.com" class="w-full" (keydown)="onEmailKeydown($event)" (paste)="onEmailPaste($event)" (input)="onEmailInput($event)" />
                                    @if (showError('email')) {
                                        <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="rounded-[0.9rem] border border-slate-200 bg-slate-50 p-4 dark:border-surface-700 dark:bg-surface-900/60 sm:p-5">
                            <div class="space-y-1.5">
                                <p class="m-0 text-base font-semibold leading-5 text-surface-900 dark:text-surface-0">Detalle del jugador</p>
                                <p class="m-0 text-sm leading-5 text-slate-500 dark:text-slate-400">Agrega la categoría y los datos deportivos complementarios.</p>
                            </div>

                            <div class="mt-5 grid grid-cols-12 gap-4">
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
                                    <label for="federationId" class="text-sm font-medium text-surface-700 dark:text-surface-200">ID de liga <span class="text-slate-400">(opcional)</span></label>
                                    <input pInputText id="federationId" type="text" [(ngModel)]="form.federationId" placeholder="Ej. F001" class="w-full" (input)="onTextInput('federationId', $event)" />
                                </div>
                            </div>
                        </div>

                        <div class="rounded-[0.9rem] border border-slate-200 bg-slate-50 p-4 dark:border-surface-700 dark:bg-surface-900/60 sm:p-5">
                            <div class="flex flex-col gap-3">
                                <div>
                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Foto del jugador</p>
                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Elige una imagen clara y ajústala antes de guardarla.</p>
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

                    <div class="border-t border-slate-200 p-4 dark:border-surface-800">
                        <div class="form-width-2col mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" routerLink="/players" />
                            <p-button label="Guardar jugador" icon="pi pi-check" styleClass="w-full sm:w-auto" (onClick)="savePlayer()" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class PlayerFormPage {
    @ViewChild('playerPhotoCropper') playerPhotoCropper?: ImageCropperComponent;

    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Jugadores', routerLink: '/players' }, { label: 'Nuevo jugador' }];
    readonly documentTypeOptions = [
        { label: 'DNI', value: 'DNI' },
        { label: 'Cédula de extranjería', value: 'CE' },
        { label: 'Tarjeta de identidad', value: 'TI' },
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

    submitted = false;
    form: PlayerForm = this.emptyForm();
    categories: CategoryOption[] = [];
    photoPreviewUrl: string | null = null;
    photoFileName = 'Sin imagen seleccionada';
    photoBlob: Blob | null = null;

    constructor(
        private readonly playerService: PlayerManagementService,
        private readonly messageService: MessageService,
        private readonly router: Router
    ) {
        this.categories = this.playerService.listCategories();
    }

    get playerInitials() {
        const source = `${this.form.firstName} ${this.form.lastName}`.trim() || 'JP';
        return source
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((value) => value.charAt(0).toUpperCase())
            .join('');
    }

    savePlayer() {
        this.submitted = true;
        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa el jugador',
                detail: 'Completa los campos obligatorios antes de guardar.'
            });
            return;
        }

        const photo = this.photoBlob && this.photoPreviewUrl ? this.buildPhotoPayload(this.photoBlob, this.photoPreviewUrl, this.photoFileName) : null;
        const created = this.playerService.createPlayer(this.form, photo);

        this.messageService.add({
            severity: 'success',
            summary: 'Jugador creado',
            detail: 'El jugador quedó registrado en esta iteración mock.'
        });

        this.router.navigate(['/players', created.id]);
    }

    showError(field: keyof PlayerForm) {
        return this.submitted && !this.isFieldValid(field);
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

    onEmailInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.form.email = this.sanitizeEmailInput(input.value);
        input.value = this.form.email;
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
        const pasted = event.clipboardData?.getData('text') ?? '';
        if (pasted !== this.sanitizeEmailInput(pasted)) {
            event.preventDefault();
        }
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
        this.messageService.add({
            severity: 'success',
            summary: 'Foto lista',
            detail: 'La foto del jugador quedó ajustada para guardarse con el formulario.'
        });
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

    private emptyForm(): PlayerForm {
        return {
            documentType: '',
            firstName: '',
            lastName: '',
            birthDate: '',
            documentNumber: '',
            nationality: '',
            gender: '',
            federationId: '',
            dominantFoot: '',
            email: '',
            countryCode: '',
            phoneNumber: '',
            categoryId: ''
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
            case 'countryCode':
                return (!this.form.countryCode.trim() && !this.form.phoneNumber.trim()) || (!!this.form.countryCode.trim() && this.isValidPhoneNumber(this.form.countryCode, this.form.phoneNumber));
            case 'phoneNumber':
                return (!this.form.phoneNumber.trim() && !this.form.countryCode.trim()) || (!!this.form.phoneNumber.trim() && this.isValidPhoneNumber(this.form.countryCode, this.form.phoneNumber));
            case 'categoryId':
                return !!this.form.categoryId;
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
}
