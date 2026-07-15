import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { PlayerManagementService } from '@/app/features/players/data-access/player-management.service';
import { GuardianForm } from '@/app/features/players/models/player.model';

@Component({
    selector: 'app-guardian-form-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, InputTextModule, MessageModule, PageHeader, RouterModule, SelectModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="space-y-4">
            <app-page-header [breadcrumbs]="breadcrumbs" [title]="pageTitle" [subtitle]="pageSubtitle"></app-page-header>

            <div class="content-width-compact mx-auto mt-4 w-full space-y-3">
                <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <div class="space-y-4 p-3 sm:p-4">
                        <div class="form-width-2col mx-auto space-y-4">
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12">
                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Datos del acudiente</p>
                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Completa los datos principales, la identificación y el parentesco del acudiente.</p>
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="firstName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombres <span class="text-rose-500">*</span></label>
                                    <input pInputText id="firstName" type="text" [(ngModel)]="form.firstName" placeholder="Ej. María" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onNameInput('firstName', $event)" />
                                    @if (showError('firstName')) {
                                        <p-message severity="error" size="small">Ingresa los nombres del acudiente.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="lastName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Apellidos <span class="text-rose-500">*</span></label>
                                    <input pInputText id="lastName" type="text" [(ngModel)]="form.lastName" placeholder="Ej. Pérez" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onNameInput('lastName', $event)" />
                                    @if (showError('lastName')) {
                                        <p-message severity="error" size="small">Ingresa los apellidos del acudiente.</p-message>
                                    }
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
                                    <input pInputText id="documentNumber" type="text" [(ngModel)]="form.documentNumber" placeholder="Ej. 42110567" class="w-full" (input)="onDocumentInput($event)" />
                                    @if (showError('documentNumber')) {
                                        <p-message severity="error" size="small">Ingresa el número de documento.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="relationship" class="text-sm font-medium text-surface-700 dark:text-surface-200">Parentesco <span class="text-rose-500">*</span></label>
                                    <p-select id="relationship" [(ngModel)]="form.relationship" [options]="relationshipOptions" optionLabel="label" optionValue="value" placeholder="Selecciona un parentesco" class="w-full" appendTo="body" [scrollHeight]="'16rem'" />
                                    @if (showError('relationship')) {
                                        <p-message severity="error" size="small">Selecciona el parentesco del acudiente.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="phone" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono <span class="text-slate-400">(opcional)</span></label>
                                    <input pInputText id="phone" type="text" [(ngModel)]="form.phone" placeholder="Ej. +57 312 555 0021" class="w-full" (input)="onPhoneInput($event)" />
                                    @if (showError('phone')) {
                                        <p-message severity="error" size="small">Ingresa un teléfono válido.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="email" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo <span class="text-slate-400">(opcional)</span></label>
                                    <input pInputText id="email" type="text" [(ngModel)]="form.email" placeholder="Ej. maria.perez@correo.com" class="w-full" (keydown)="onEmailKeydown($event)" (paste)="onEmailPaste($event)" (input)="onEmailInput($event)" />
                                    @if (showError('email')) {
                                        <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="address" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección <span class="text-slate-400">(opcional)</span></label>
                                    <input pInputText id="address" type="text" [(ngModel)]="form.address" placeholder="Ej. Calle 25 # 14-30" class="w-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-slate-200 p-4 dark:border-surface-800">
                        <div class="form-width-2col mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" routerLink="/guardians" />
                            <p-button [label]="isEditMode ? 'Guardar cambios' : 'Guardar acudiente'" icon="pi pi-check" styleClass="w-full sm:w-auto" (onClick)="saveGuardian()" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class GuardianFormPage {
    readonly documentTypeOptions = [
        { label: 'Cédula de ciudadanía', value: 'CC' },
        { label: 'Tarjeta de identidad', value: 'TI' },
        { label: 'Cédula de extranjería', value: 'CE' },
        { label: 'Pasaporte', value: 'PASAPORTE' }
    ];
    readonly relationshipOptions = [
        { label: 'Padre', value: 'Padre' },
        { label: 'Madre', value: 'Madre' },
        { label: 'Abuelo(a)', value: 'Abuelo(a)' },
        { label: 'Tutor', value: 'Tutor' },
        { label: 'Hermano(a)', value: 'Hermano(a)' },
        { label: 'Otro', value: 'Otro' }
    ];

    submitted = false;
    guardianId: string | null = null;
    form: GuardianForm = this.emptyForm();
    breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Acudientes', routerLink: '/guardians' }, { label: 'Nuevo acudiente' }];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly playerService: PlayerManagementService,
        private readonly messageService: MessageService
    ) {
        this.guardianId = this.route.snapshot.paramMap.get('id');
        if (this.guardianId) {
            const guardian = this.playerService.getGuardianById(this.guardianId);
            if (guardian) {
                this.form = {
                    firstName: guardian.firstName,
                    lastName: guardian.lastName,
                    phone: guardian.phone,
                    email: guardian.email,
                    documentType: guardian.documentType,
                    documentNumber: guardian.documentNumber,
                    address: guardian.address,
                    relationship: guardian.relationship
                };
                this.breadcrumbs = [
                    { label: 'Inicio', routerLink: '/' },
                    { label: 'Acudientes', routerLink: '/guardians' },
                    { label: `${guardian.firstName} ${guardian.lastName}`.trim(), routerLink: `/guardians/${guardian.id}` },
                    { label: 'Editar' }
                ];
            }
        }
    }

    get isEditMode() {
        return !!this.guardianId;
    }

    get pageTitle() {
        return this.isEditMode ? 'Editar acudiente' : 'Nuevo acudiente';
    }

    get pageSubtitle() {
        return this.isEditMode ? 'Actualiza la identificación, el parentesco y los datos de contacto del acudiente.' : 'Registra un nuevo acudiente con la información necesaria para contacto y seguimiento.';
    }

    saveGuardian() {
        this.submitted = true;
        if (!this.isFormValid()) {
            this.messageService.add({ severity: 'warn', summary: 'Revisa el acudiente', detail: 'Completa los campos obligatorios antes de guardar.' });
            return;
        }

        if (this.isEditMode && this.guardianId) {
            const updated = this.playerService.updateGuardian(this.guardianId, this.form);
            if (updated) {
                this.messageService.add({ severity: 'success', summary: 'Acudiente actualizado', detail: 'Los datos del acudiente quedaron guardados en esta iteración mock.' });
                this.router.navigate(['/guardians', updated.id]);
            }
            return;
        }

        const created = this.playerService.createGuardian(this.form);
        this.messageService.add({ severity: 'success', summary: 'Acudiente creado', detail: 'El acudiente quedó registrado en esta iteración mock.' });
        this.router.navigate(['/guardians', created.id]);
    }

    showError(field: keyof GuardianForm) {
        return this.submitted && !this.isFieldValid(field);
    }

    onNameInput(field: 'firstName' | 'lastName', event: Event) {
        const input = event.target as HTMLInputElement;
        this.form[field] = this.sanitizeNameInput(input.value);
        input.value = this.form[field];
    }

    onPhoneInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.form.phone = input.value.replace(/[^\d\s()+-]/g, '');
        input.value = this.form.phone;
    }

    onEmailInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.form.email = this.sanitizeEmailInput(input.value);
        input.value = this.form.email;
    }

    onDocumentInput(event: Event) {
        const input = event.target as HTMLInputElement;
        this.form.documentNumber = input.value.replace(/[^\dA-Za-z-]/g, '');
        input.value = this.form.documentNumber;
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

    private emptyForm(): GuardianForm {
        return {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            documentType: '',
            documentNumber: '',
            address: '',
            relationship: ''
        };
    }

    private isFormValid() {
        return ['firstName', 'lastName', 'documentType', 'documentNumber', 'relationship'].every((field) => this.isFieldValid(field as keyof GuardianForm));
    }

    private isFieldValid(field: keyof GuardianForm) {
        switch (field) {
            case 'firstName':
            case 'lastName':
                return this.hasValidText(this.form[field], 2);
            case 'phone':
                return !this.form.phone.trim() || this.form.phone.replace(/\D/g, '').length >= 7;
            case 'email':
                return !this.form.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim());
            case 'documentType':
                return !!this.form.documentType;
            case 'documentNumber':
                return this.form.documentNumber.trim().length >= 5;
            case 'relationship':
                return !!this.form.relationship;
            case 'address':
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
}
