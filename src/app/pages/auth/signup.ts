import { CommonModule } from '@angular/common';
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

type StepKey = 1 | 2 | 3;

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, CommonModule, DialogModule, FormsModule, InputTextModule, MessageModule, PasswordModule, RouterModule, SelectModule, TextareaModule],
    template: `
        <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-6 dark:bg-none dark:bg-surface-950 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center">
                <div class="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_90px_-28px_rgba(15,23,42,0.24)] dark:border-surface-800 dark:bg-surface-900 lg:grid-cols-[0.9fr_1.1fr]">
                    <div class="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_100%)] px-6 py-8 text-slate-900 dark:border-surface-800 dark:bg-slate-950 dark:text-white lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
                        <div class="absolute inset-0 opacity-90">
                            <div class="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.55),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.10),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.08),_transparent_24%)] dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.90),_rgba(15,23,42,0.70))]"></div>
                            <div class="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(99,102,241,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(99,102,241,0.08)_95%)] bg-[size:100%_64px,64px_100%] dark:bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.05)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.05)_95%)]"></div>
                        </div>
                        <div class="relative flex min-h-[28rem] h-full flex-col items-center justify-center text-center">
                            <h2 class="mt-8 max-w-sm text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Crea la cuenta de tu academia</h2>
                            <p class="mt-5 max-w-sm text-sm leading-6 text-slate-600 dark:text-white/70">Completa estos datos para empezar.</p>

                            <div class="mt-10 w-full max-w-sm text-left">
                                <div class="space-y-4 rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/6">
                                    <div class="flex items-start gap-4">
                                        <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-[0.65rem] font-semibold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">1</span>
                                        <div class="min-w-0">
                                            <p style="margin:0" class="font-medium text-slate-900 dark:text-white">Datos de la academia</p>
                                            <p style="margin:0" class="text-sm leading-5 text-slate-600 dark:text-white/65">Nombre, categoría y equipo inicial.</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-4">
                                        <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-[0.65rem] font-semibold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">2</span>
                                        <div class="min-w-0">
                                            <p style="margin:0" class="font-medium text-slate-900 dark:text-white">Contacto principal</p>
                                            <p style="margin:0" class="text-sm leading-5 text-slate-600 dark:text-white/65">Correo, teléfono y ubicación.</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-4">
                                        <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-[0.65rem] font-semibold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">3</span>
                                        <div class="min-w-0">
                                            <p style="margin:0" class="font-medium text-slate-900 dark:text-white">Acceso</p>
                                            <p style="margin:0" class="text-sm leading-5 text-slate-600 dark:text-white/65">Contraseña y aceptación de términos.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-7 sm:px-8 lg:px-10 lg:py-10">
                        <div class="mb-8 flex items-center justify-between gap-4">
                            <div>
                                <p class="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Registro</p>
                                <h1 class="mt-1 text-2xl font-semibold tracking-tight text-surface-900 dark:text-surface-0">{{ stepTitle }}</h1>
                                <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">{{ stepSubtitle }}</p>
                            </div>
                            <div class="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 dark:border-surface-800 dark:bg-surface-950 dark:text-slate-200">
                                {{ currentStep }}/3
                            </div>
                        </div>

                        <div class="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-surface-800 dark:bg-surface-950">
                            <div class="grid grid-cols-3 gap-2">
                                @for (step of steps; track step.id) {
                                    <button
                                        type="button"
                                        class="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition"
                                        [class.bg-white]="currentStep === step.id"
                                        [class.text-sky-700]="currentStep === step.id"
                                        [class.shadow-sm]="currentStep === step.id"
                                        [class.border]="currentStep === step.id"
                                        [class.border-sky-200]="currentStep === step.id"
                                        [class.dark:bg-surface-900]="currentStep === step.id"
                                        [class.dark:text-sky-300]="currentStep === step.id"
                                        [class.dark:border-sky-900/40]="currentStep === step.id"
                                        [class.text-slate-500]="currentStep !== step.id"
                                        [class.dark:text-slate-400]="currentStep !== step.id"
                                        (click)="goToStep(step.id)"
                                    >
                                        <span
                                            class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition"
                                            [class.bg-sky-100]="currentStep === step.id"
                                            [class.text-sky-700]="currentStep === step.id"
                                            [class.dark:bg-sky-400/15]="currentStep === step.id"
                                            [class.dark:text-sky-300]="currentStep === step.id"
                                            [class.bg-slate-200]="currentStep !== step.id"
                                            [class.text-slate-600]="currentStep !== step.id"
                                            [class.dark:bg-surface-800]="currentStep !== step.id"
                                            [class.dark:text-slate-300]="currentStep !== step.id"
                                        >
                                            {{ step.id }}
                                        </span>
                                        <span class="leading-tight">{{ step.label }}</span>
                                    </button>
                                }
                            </div>
                        </div>

                        <form class="space-y-8" (ngSubmit)="submit()">
                            @if (currentStep === 1) {
                                <div class="space-y-6">
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

                                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-surface-800 dark:bg-surface-950 dark:text-slate-300">
                                        Esta primera sección define la base operativa de la academia. Mantenerla simple ayuda a reducir fricción desde el inicio.
                                    </div>
                                </div>
                            }

                            @if (currentStep === 2) {
                                <div class="space-y-6">
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

                                        <div class="col-span-12 flex flex-col gap-2">
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
                                                    class="col-span-12 md:col-span-4 w-full"
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
                                                <input pInputText id="phoneNumber" type="text" [(ngModel)]="form.phoneNumber" name="phoneNumber" placeholder="987 654 321" class="col-span-12 md:col-span-8 w-full" (blur)="markTouched('phoneNumber')" />
                                            </div>
                                            <p class="text-xs text-slate-500 dark:text-slate-400">El backend recibirá el teléfono concatenado en una sola cadena.</p>
                                            @if (showError('phoneNumber')) {
                                                <p-message severity="error" size="small">Ingresa un número de teléfono válido.</p-message>
                                            }
                                        </div>

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
                                </div>
                            }

                            @if (currentStep === 3) {
                                <div class="space-y-6">
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

                                        <div class="col-span-12 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-surface-800 dark:bg-surface-950">
                                            <p-checkbox [(ngModel)]="accepted" inputId="terms" name="terms" binary (onChange)="markTouched('terms')"></p-checkbox>
                                            <label for="terms" class="text-sm leading-6 text-slate-600 dark:text-slate-300">
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
                                </div>
                            }

                            <div class="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-surface-800">
                                <div class="flex gap-3">
                                    @if (currentStep > 1) {
                                        <p-button label="Atrás" severity="secondary" styleClass="w-full sm:w-auto" type="button" (onClick)="prevStep()" />
                                    }
                                    @if (currentStep < 3) {
                                        <p-button label="Continuar" styleClass="w-full sm:w-auto" type="button" (onClick)="nextStep()" />
                                    }
                                    @if (currentStep === 3) {
                                        <p-button label="Crear academia" styleClass="w-full sm:w-auto" type="submit" />
                                    }
                                </div>

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
    currentStep: StepKey = 1;

    steps = [
        { id: 1 as StepKey, label: 'Academia' },
        { id: 2 as StepKey, label: 'Contacto' },
        { id: 3 as StepKey, label: 'Acceso' }
    ];

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

    get stepTitle(): string {
        if (this.currentStep === 1) return 'Datos de la academia';
        if (this.currentStep === 2) return 'Contacto principal';
        return 'Acceso y aceptación';
    }

    get stepSubtitle(): string {
        if (this.currentStep === 1) return 'Empecemos con la base del registro: el nombre de la academia, su categoría inicial y el primer equipo.';
        if (this.currentStep === 2) return 'Definimos quién recibirá la comunicación principal y la ubicación operativa.';
        return 'Cerramos el alta con la contraseña inicial y la aceptación de condiciones.';
    }

    markTouched(field: string) {
        this.touched[field] = true;
    }

    openTerms(event: MouseEvent) {
        event.preventDefault();
        this.showTermsDialog = true;
    }

    nextStep() {
        if (this.isStepValid(this.currentStep)) {
            this.currentStep = Math.min(3, (this.currentStep + 1) as StepKey) as StepKey;
        } else {
            this.touchStepFields(this.currentStep);
            this.submitted = true;
        }
    }

    prevStep() {
        this.currentStep = Math.max(1, (this.currentStep - 1) as StepKey) as StepKey;
    }

    goToStep(step: StepKey) {
        if (step < this.currentStep || this.isStepValid(this.currentStep)) {
            this.currentStep = step;
            return;
        }

        this.touchStepFields(this.currentStep);
        this.submitted = true;
    }

    submit() {
        this.submitted = true;
        this.touchStepFields(3);

        if (!this.isFormValid()) {
            return;
        }
    }

    showError(field: string): boolean {
        return this.submitted || !!this.touched[field];
    }

    private touchStepFields(step: StepKey) {
        const fieldsByStep: Record<StepKey, string[]> = {
            1: ['name', 'categoryId', 'teamName'],
            2: ['contactName', 'contactEmail', 'countryCode', 'phoneNumber', 'address', 'city'],
            3: ['password', 'confirmPassword', 'terms']
        };

        fieldsByStep[step].forEach((field) => (this.touched[field] = true));
    }

    private isStepValid(step: StepKey): boolean {
        if (step === 1) {
            return !!this.form.name.trim() && !!this.form.categoryId.trim() && !!this.form.teamName.trim();
        }

        if (step === 2) {
            return !!this.form.contactName.trim() && !!this.form.contactEmail.trim() && !!this.form.phoneNumber.trim() && !!this.form.address.trim() && !!this.form.city.trim();
        }

        return !!this.form.password.trim() && this.form.password.length >= 8 && this.form.password === this.confirmPassword && this.accepted;
    }

    private isFormValid(): boolean {
        return this.isStepValid(1) && this.isStepValid(2) && this.isStepValid(3);
    }

}
