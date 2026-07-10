import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

type CountryOption = {
    name: string;
    dialCode: string;
};

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, DialogModule, FormsModule, InputTextModule, MessageModule, PasswordModule, RouterModule, SelectModule, TextareaModule],
    template: `
        <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-8 dark:bg-none dark:bg-surface-950">
            <div class="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center">
                <div class="pointer-events-none absolute -top-6 left-1/2 h-24 w-[28rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-transparent blur-3xl"></div>
                <div class="relative w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)] dark:border-surface-800 dark:bg-surface-900">
                    <div class="border-b border-slate-200 px-6 py-6 dark:border-surface-800 sm:px-8">
                        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-200">
                            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                            Alta de academia
                        </div>
                        <h2 class="text-3xl font-semibold tracking-tight text-surface-900 dark:text-surface-0">Registrar nueva academia</h2>
                        <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">Completa los datos básicos para crear el acceso inicial de tu academia.</p>
                    </div>

                        @if (showSummary) {
                            <div class="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
                                <div class="font-medium">Revisa los campos obligatorios.</div>
                                <ul class="mt-2 list-disc space-y-1 pl-5">
                                    @for (error of summaryErrors; track error) {
                                        <li>{{ error }}</li>
                                    }
                                </ul>
                            </div>
                        }

                    <div class="px-6 py-8 sm:px-8">
                        <form class="space-y-8" (ngSubmit)="submit()">
                            <div class="font-semibold text-lg text-surface-900 dark:text-surface-0">Academia</div>
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="academyName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre de la academia</label>
                                    <input pInputText id="academyName" type="text" [(ngModel)]="form.name" name="name" placeholder="Academia PlayerTech Demo" class="w-full" (blur)="markTouched('name')" />
                                    @if (showError('name')) {
                                        <p-message severity="error" size="small">El nombre de la academia es obligatorio.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="categoryId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Categoría inicial</label>
                                    <p-select id="categoryId" [(ngModel)]="form.categoryId" name="categoryId" [options]="categories" optionLabel="name" optionValue="id" placeholder="Seleccionar categoría" class="w-full" (onChange)="markTouched('categoryId')"></p-select>
                                    @if (showError('categoryId')) {
                                        <p-message severity="error" size="small">Debes seleccionar una categoría.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="teamName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del primer equipo</label>
                                    <input pInputText id="teamName" type="text" [(ngModel)]="form.teamName" name="teamName" placeholder="Sub 12 A" class="w-full" (blur)="markTouched('teamName')" />
                                    @if (showError('teamName')) {
                                        <p-message severity="error" size="small">Debes indicar el nombre del primer equipo.</p-message>
                                    }
                                </div>
                            </div>

                            <div class="font-semibold text-lg text-surface-900 dark:text-surface-0">Contacto principal</div>
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="contactName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del contacto</label>
                                    <input pInputText id="contactName" type="text" [(ngModel)]="form.contactName" name="contactName" placeholder="Juan Perez" class="w-full" (blur)="markTouched('contactName')" />
                                    @if (showError('contactName')) {
                                        <p-message severity="error" size="small">Debes indicar el nombre de contacto.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="contactEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo de contacto</label>
                                    <input pInputText id="contactEmail" type="email" [(ngModel)]="form.contactEmail" name="contactEmail" placeholder="tenant.demo@example.com" class="w-full" (blur)="markTouched('contactEmail')" />
                                    @if (showError('contactEmail')) {
                                        <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="phoneNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono</label>
                                    <div class="grid grid-cols-12 gap-3">
                                        <p-select
                                            id="countryCode"
                                            [(ngModel)]="form.countryCode"
                                            name="countryCode"
                                            [options]="countryCodes"
                                            optionLabel="dialCode"
                                            optionValue="dialCode"
                                            [filter]="true"
                                            filterBy="name,dialCode"
                                            placeholder="Código"
                                            class="col-span-12 sm:col-span-4 lg:col-span-4 w-full"
                                        >
                                            <ng-template #selectedItem let-option>
                                                <span>{{ option?.name ?? 'País' }}</span>
                                            </ng-template>
                                            <ng-template #item let-option>
                                                <div class="flex items-center justify-between gap-3">
                                                    <span>{{ option.name }}</span>
                                                    <span class="text-muted-color">{{ option.dialCode }}</span>
                                                </div>
                                            </ng-template>
                                        </p-select>
                                        <input pInputText id="phoneNumber" type="text" [(ngModel)]="form.phoneNumber" name="phoneNumber" placeholder="987 654 321" class="col-span-12 sm:col-span-8 lg:col-span-8 w-full" (blur)="markTouched('phoneNumber')" />
                                    </div>
                                    @if (showError('phoneNumber')) {
                                        <p-message severity="error" size="small">Ingresa un número de teléfono válido.</p-message>
                                    }
                                </div>
                            </div>

                            <div class="font-semibold text-lg text-surface-900 dark:text-surface-0">Ubicación</div>
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 flex flex-col gap-2">
                                    <label for="address" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección</label>
                                    <textarea pTextarea id="address" rows="3" [(ngModel)]="form.address" name="address" placeholder="Jr. Secundario 789" class="w-full" (blur)="markTouched('address')"></textarea>
                                    @if (showError('address')) {
                                        <p-message severity="error" size="small">La dirección es obligatoria.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="city" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad</label>
                                    <input pInputText id="city" type="text" [(ngModel)]="form.city" name="city" placeholder="Arequipa" class="w-full" (blur)="markTouched('city')" />
                                    @if (showError('city')) {
                                        <p-message severity="error" size="small">La ciudad es obligatoria.</p-message>
                                    }
                                </div>
                            </div>

                            <div class="font-semibold text-lg text-surface-900 dark:text-surface-0">Acceso y seguridad</div>
                            <div class="grid grid-cols-12 gap-4">
                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="password" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contraseña</label>
                                    <p-password id="password" [(ngModel)]="form.password" name="password" placeholder="Crear contraseña" [toggleMask]="true" [fluid]="true" [feedback]="false" (onBlur)="markTouched('password')"></p-password>
                                    @if (showError('password')) {
                                        <p-message severity="error" size="small">La contraseña debe tener al menos 8 caracteres.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                    <label for="confirmPassword" class="text-sm font-medium text-surface-700 dark:text-surface-200">Confirmar contraseña</label>
                                    <p-password id="confirmPassword" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Repite la contraseña" [toggleMask]="true" [fluid]="true" [feedback]="false" (onBlur)="markTouched('confirmPassword')"></p-password>
                                    @if (showError('confirmPassword')) {
                                        <p-message severity="error" size="small">Las contraseñas no coinciden.</p-message>
                                    }
                                </div>

                                <div class="col-span-12 flex items-start gap-3">
                                    <p-checkbox [(ngModel)]="accepted" inputId="terms" name="terms" binary (onChange)="markTouched('terms')"></p-checkbox>
                                    <label for="terms" class="text-sm leading-6 text-muted-color">
                                        Acepto los
                                        <a class="font-medium text-sky-700 hover:underline dark:text-sky-400" href="#" (click)="openTerms($event)">términos y condiciones</a>
                                    </label>
                                </div>
                                @if (showError('terms')) {
                                    <div class="col-span-12">
                                        <p-message severity="error" size="small">Debes aceptar esta condición para continuar.</p-message>
                                    </div>
                                }
                            </div>

                            <div class="flex flex-col gap-3 border-t border-slate-200 pt-2 sm:flex-row dark:border-surface-800">
                                <p-button label="Crear academia" styleClass="w-full sm:w-auto" type="submit" />
                                <p-button label="Ya tengo cuenta" severity="secondary" styleClass="w-full sm:w-auto" routerLink="/auth/login" />
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="showTermsDialog" header="Términos y condiciones" [modal]="true" [style]="{ width: '42rem' }" [breakpoints]="{ '960px': '90vw', '640px': '95vw' }">
            <div class="space-y-4 text-sm leading-6 text-surface-700 dark:text-surface-200">
                <p>Estos términos describen el uso inicial de la cuenta de demostración mientras se valida la experiencia de registro y acceso.</p>
                <p>La información ingresada en este formulario será tratada como datos de configuración de una academia dentro de la plataforma PlayerTech.</p>
                <p>Este contenido es una referencia temporal para la iteración de UX y podrá evolucionar cuando se conecte el flujo real de onboarding.</p>
            </div>
            <ng-template #footer>
                <p-button label="Cerrar" (click)="showTermsDialog = false" />
            </ng-template>
        </p-dialog>
    `
})
export class Signup {
    form = {
        name: '',
        contactEmail: '',
        contactName: '',
        password: '',
        countryCode: '+51',
        phoneNumber: '',
        address: '',
        city: '',
        categoryId: '',
        teamName: ''
    };

    confirmPassword = '';

    accepted = false;

    submitted = false;

    showTermsDialog = false;

    touched: Record<string, boolean> = {};

    categories = [
        { id: 'cat-sub-10', name: 'Sub 10' },
        { id: 'cat-sub-12', name: 'Sub 12' },
        { id: 'cat-sub-14', name: 'Sub 14' }
    ];

    countryCodes: CountryOption[] = [
        { name: 'Perú', dialCode: '+51' },
        { name: 'Colombia', dialCode: '+57' },
        { name: 'Chile', dialCode: '+56' },
        { name: 'Ecuador', dialCode: '+593' },
        { name: 'México', dialCode: '+52' },
        { name: 'España', dialCode: '+34' }
    ];

    markTouched(field: string) {
        this.touched[field] = true;
    }

    openTerms(event: MouseEvent) {
        event.preventDefault();
        this.showTermsDialog = true;
    }

    submit() {
        this.submitted = true;
        Object.keys(this.touched).forEach((field) => (this.touched[field] = true));
    }

    showError(field: string): boolean {
        return this.submitted || !!this.touched[field];
    }

    get summaryErrors(): string[] {
        const errors: string[] = [];

        if (!this.form.name.trim()) errors.push('El nombre de la academia es obligatorio.');
        if (!this.form.contactName.trim()) errors.push('El nombre de contacto es obligatorio.');
        if (!this.form.contactEmail.trim()) errors.push('El correo de contacto es obligatorio.');
        if (!this.form.password.trim() || this.form.password.length < 8) errors.push('La contraseña debe tener al menos 8 caracteres.');
        if (this.form.password !== this.confirmPassword) errors.push('Las contraseñas deben coincidir.');
        if (!this.form.phoneNumber.trim()) errors.push('El teléfono es obligatorio.');
        if (!this.form.address.trim()) errors.push('La dirección es obligatoria.');
        if (!this.form.city.trim()) errors.push('La ciudad es obligatoria.');
        if (!this.form.categoryId.trim()) errors.push('La categoría inicial es obligatoria.');
        if (!this.form.teamName.trim()) errors.push('El nombre del primer equipo es obligatorio.');
        if (!this.accepted) errors.push('Debes aceptar la condición de uso mock para continuar.');

        return errors;
    }

    get showSummary(): boolean {
        return this.submitted && this.summaryErrors.length > 0;
    }
}
