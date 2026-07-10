import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';

type CountryOption = {
    name: string;
    dialCode: string;
    flag: string;
    flagFile: string;
};

type StepKey = 1 | 2 | 3;

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, CommonModule, DialogModule, FormsModule, InputTextModule, MessageModule, PasswordModule, RouterModule, SelectModule, TabsModule],
    template: `
        <div class="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-6 dark:bg-none dark:bg-surface-950 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center">
                <div class="grid w-full min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_90px_-28px_rgba(15,23,42,0.24)] dark:border-surface-800 dark:bg-surface-900 lg:grid-cols-[0.9fr_1.1fr]">
                    <div class="relative hidden overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_100%)] px-5 py-6 text-slate-900 dark:border-surface-800 dark:bg-slate-950 dark:text-white lg:block lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
                        <div class="absolute inset-0 opacity-90">
                            <div class="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.55),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.10),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.08),_transparent_24%)] dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.90),_rgba(15,23,42,0.70))]"></div>
                            <div class="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(99,102,241,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(99,102,241,0.08)_95%)] bg-[size:100%_64px,64px_100%] dark:bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.05)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.05)_95%)]"></div>
                        </div>
                        <div class="relative flex min-h-0 h-full flex-col items-center justify-center text-center lg:min-h-[28rem]">
                            <h2 class="mt-4 max-w-sm text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Registra tu academia</h2>
                            <p class="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-white/70">Completa la información para comenzar.</p>

                            <div class="mt-6 w-full max-w-sm text-left lg:mt-10">
                                <div class="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/6 sm:p-5">
                                    <div class="flex items-start gap-4">
                                        <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-[0.65rem] font-semibold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">1</span>
                                        <div class="min-w-0">
                                            <p style="margin:0" class="font-medium text-slate-900 dark:text-white">Información de la academia</p>
                                            <p style="margin:0" class="text-sm leading-5 text-slate-600 dark:text-white/65">Nombre, categoría y primer equipo.</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-4">
                                        <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-[0.65rem] font-semibold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">2</span>
                                        <div class="min-w-0">
                                            <p style="margin:0" class="font-medium text-slate-900 dark:text-white">Contacto</p>
                                            <p style="margin:0" class="text-sm leading-5 text-slate-600 dark:text-white/65">Correo, teléfono y ubicación.</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-4">
                                        <span class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-[0.65rem] font-semibold text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">3</span>
                                        <div class="min-w-0">
                                            <p style="margin:0" class="font-medium text-slate-900 dark:text-white">Contraseña</p>
                                            <p style="margin:0" class="text-sm leading-5 text-slate-600 dark:text-white/65">Contraseña y términos.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="min-w-0 px-5 py-6 sm:px-6 sm:py-7 lg:px-10 lg:py-10">
                        <div class="mb-4 flex min-w-0 flex-col gap-2 text-center sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:text-left">
                            <div class="flex min-w-0 flex-col items-center sm:items-start">
                                <p class="hidden text-[0.7rem] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400 sm:block sm:text-xs">Registro</p>
                                <h1 class="mx-auto mt-1 max-w-[11ch] text-balance !text-[1.35rem] font-semibold leading-[1.08] tracking-tight text-surface-900 dark:text-surface-0 sm:mx-0 sm:max-w-none sm:!text-[clamp(1.5rem,3vw,2rem)]">{{ stepTitle }}</h1>
                                <p class="mx-auto mt-1.5 max-w-[28ch] text-[0.9rem] leading-5 text-slate-600 dark:text-slate-300 sm:mx-0 sm:mt-2 sm:max-w-xl sm:text-sm sm:leading-6">{{ stepSubtitle }}</p>
                            </div>
                            <div class="shrink-0 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-surface-800 dark:bg-surface-950 dark:text-slate-200 sm:px-4 sm:py-2 sm:text-sm">
                                {{ currentStep }}/3
                            </div>
                        </div>

                        <div class="mb-3 min-w-0 sm:mb-8">
                            @if (stepNavigationMessage) {
                                <div class="mb-3">
                                    <p-message severity="warn" size="small">{{ stepNavigationMessage }}</p-message>
                                </div>
                            }
                            <p-tabs [value]="currentStep - 1">
                                <p-tablist class="flex min-w-0 gap-2 overflow-x-auto pb-1 text-sm sm:gap-3 sm:text-base">
                                    @for (step of steps; track step.id) {
                                        <p-tab [value]="step.id - 1" class="flex-shrink-0 whitespace-nowrap" (click)="goToStep(step.id)">
                                            <span class="flex items-center gap-2">
                                                <span
                                                    class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition"
                                                    [class.bg-sky-100]="currentStep === step.id || isStepCompleted(step.id)"
                                                    [class.text-sky-700]="currentStep === step.id || isStepCompleted(step.id)"
                                                    [class.dark:bg-sky-400/15]="currentStep === step.id || isStepCompleted(step.id)"
                                                    [class.dark:text-sky-300]="currentStep === step.id || isStepCompleted(step.id)"
                                                    [class.bg-slate-200]="currentStep !== step.id && !isStepCompleted(step.id)"
                                                    [class.text-slate-600]="currentStep !== step.id && !isStepCompleted(step.id)"
                                                    [class.dark:bg-surface-800]="currentStep !== step.id && !isStepCompleted(step.id)"
                                                    [class.dark:text-slate-300]="currentStep !== step.id && !isStepCompleted(step.id)"
                                                >
                                                    @if (isStepCompleted(step.id)) {
                                                        <i class="pi pi-check text-[0.65rem]"></i>
                                                    } @else {
                                                        {{ step.id }}
                                                    }
                                                </span>
                                                <span>{{ step.label }}</span>
                                            </span>
                                        </p-tab>
                                    }
                                </p-tablist>
                            </p-tabs>
                        </div>

                        <form class="min-w-0 space-y-7 sm:space-y-8" (ngSubmit)="submit()">
                            @if (currentStep === 1) {
                            <div class="space-y-6">
                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12 flex flex-col gap-2">
                                            <label for="academyName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre de la academia</label>
                                            <input pInputText id="academyName" type="text" [(ngModel)]="form.name" name="name" placeholder="Ej. Academia PlayerTech" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onAcademyNameInput($event)" />
                                            @if (showError('name')) {
                                                <p-message severity="error" size="small">Escribe el nombre de la academia.</p-message>
                                            }
                                        </div>

                                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                            <label for="categoryId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Categoría del equipo</label>
                                            <p-select id="categoryId" [(ngModel)]="form.categoryId" name="categoryId" [options]="categories" optionLabel="name" optionValue="id" placeholder="Seleccionar categoría" class="w-full"></p-select>
                                            @if (showError('categoryId')) {
                                                <p-message severity="error" size="small">Selecciona la categoría del equipo.</p-message>
                                            }
                                        </div>

                                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                            <label for="teamName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del equipo</label>
                                            <input pInputText id="teamName" type="text" [(ngModel)]="form.teamName" name="teamName" placeholder="Ej. Sub 12 A" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onTeamNameInput($event)" />
                                            @if (showError('teamName')) {
                                                <p-message severity="error" size="small">Escribe el nombre del equipo.</p-message>
                                            }
                                        </div>
                                    </div>

                                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:border-surface-800 dark:bg-surface-950 dark:text-slate-300">
                                        Completa la información principal de la academia.
                                    </div>
                                </div>
                            }

                            @if (currentStep === 2) {
                                <div class="space-y-6">
                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                            <label for="contactName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del contacto</label>
                                            <input pInputText id="contactName" type="text" [(ngModel)]="form.contactName" name="contactName" placeholder="Juan Perez" class="w-full" />
                                            @if (showError('contactName')) {
                                                <p-message severity="error" size="small">Escribe el nombre del contacto.</p-message>
                                            }
                                        </div>

                                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                            <label for="contactEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo electrónico</label>
                                            <input pInputText id="contactEmail" type="email" [(ngModel)]="form.contactEmail" name="contactEmail" placeholder="tenant.demo@example.com" class="w-full" />
                                            @if (showError('contactEmail')) {
                                                <p-message severity="error" size="small">Escribe un correo válido.</p-message>
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
                                                    placeholder="Colombia"
                                                    class="col-span-12 md:col-span-4 w-full"
                                                    (onChange)="onCountryCodeChange()">
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
                                                <input pInputText id="phoneNumber" type="text" [(ngModel)]="form.phoneNumber" name="phoneNumber" placeholder="Ej. 3123456789" class="col-span-12 md:col-span-8 w-full" (input)="onPhoneInput($event)" (blur)="onPhoneBlur()" />
                                            </div>
                                            @if (showError('phoneNumber')) {
                                                <p-message severity="error" size="small">Escribe un teléfono válido.</p-message>
                                            }
                                        </div>

                                        @if (form.countryCode === '+57') {
                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="department" class="text-sm font-medium text-surface-700 dark:text-surface-200">Departamento</label>
                                                <p-select
                                                    id="department"
                                                    [(ngModel)]="form.department"
                                                    name="department"
                                                    [options]="colombiaDepartments"
                                                    optionLabel="name"
                                                    optionValue="name"
                                                    placeholder="Selecciona un departamento"
                                                    class="w-full"
                                                    (onChange)="form.city = ''">
                                                </p-select>
                                                @if (showError('department')) {
                                                    <p-message severity="error" size="small">Selecciona el departamento.</p-message>
                                                }
                                            </div>
                                        }

                                        @if (form.countryCode === '+57') {
                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="city" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad</label>
                                                <p-select
                                                    id="city"
                                                    [(ngModel)]="form.city"
                                                    name="city"
                                                    [options]="departmentCities"
                                                    placeholder="Selecciona una ciudad"
                                                    class="w-full">
                                                </p-select>
                                                @if (showError('city')) {
                                                    <p-message severity="error" size="small">Selecciona la ciudad.</p-message>
                                                }
                                            </div>
                                        } @else {
                                            <div class="col-span-12 flex flex-col gap-2">
                                                <label for="address" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección</label>
                                                <input pInputText id="address" type="text" [(ngModel)]="form.address" name="address" placeholder="Ej. Jr. Secundario 789" class="w-full" />
                                                @if (showError('address')) {
                                                    <p-message severity="error" size="small">Escribe la dirección.</p-message>
                                                }
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="city" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad</label>
                                                <input pInputText id="city" type="text" [(ngModel)]="form.city" name="city" placeholder="Ej. Arequipa" class="w-full" />
                                                @if (showError('city')) {
                                                    <p-message severity="error" size="small">Escribe la ciudad.</p-message>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            }

                            @if (currentStep === 3) {
                                <div class="space-y-6">
                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                            <label for="password" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contraseña</label>
                                            <p-password id="password" [(ngModel)]="form.password" name="password" placeholder="Crea una contraseña" [toggleMask]="true" [fluid]="true" [feedback]="false"></p-password>
                                            @if (showError('password')) {
                                                <p-message severity="error" size="small">La contraseña debe tener al menos 8 caracteres.</p-message>
                                            }
                                        </div>

                                        <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                            <label for="confirmPassword" class="text-sm font-medium text-surface-700 dark:text-surface-200">Confirmar contraseña</label>
                                            <p-password id="confirmPassword" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Repite la contraseña" [toggleMask]="true" [fluid]="true" [feedback]="false"></p-password>
                                            @if (showError('confirmPassword')) {
                                                <p-message severity="error" size="small">Las contraseñas no coinciden.</p-message>
                                            }
                                        </div>

                                        <div class="col-span-12 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-surface-800 dark:bg-surface-950">
                                            <p-checkbox [(ngModel)]="accepted" inputId="terms" name="terms" binary></p-checkbox>
                                            <label for="terms" class="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                Acepto los
                                                <a class="font-medium text-sky-700 hover:underline dark:text-sky-400" href="#" (click)="openTerms($event)">términos y condiciones</a>
                                            </label>
                                        </div>
                                        @if (showError('terms')) {
                                            <div class="col-span-12">
                                                <p-message severity="error" size="small">Acepta los términos para continuar.</p-message>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }

                            <div class="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-surface-800">
                                <div class="flex flex-col gap-3 sm:flex-row">
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

                                <div class="flex items-center justify-center sm:justify-end">
                                    <p class="text-sm text-slate-600 dark:text-slate-300">
                                        ¿Ya tienes una cuenta?
                                        <a routerLink="/auth/login" class="font-medium text-sky-600 hover:underline dark:text-sky-400">Iniciar sesión</a>
                                    </p>
                                </div>
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
        { id: 3 as StepKey, label: 'Contraseña' }
    ];

    form = {
        name: '',
        contactEmail: '',
        contactName: '',
        password: '',
        countryCode: '+57',
        phoneNumber: '',
        department: '',
        address: '',
        city: '',
        categoryId: '',
        teamName: ''
    };

    confirmPassword = '';
    accepted = false;
    submitted = false;
    showTermsDialog = false;
    stepNavigationMessage: string | null = null;
    stepSubmitted: Record<StepKey, boolean> = {
        1: false,
        2: false,
        3: false
    };
    touched: Record<string, boolean> = {};

    categories = [
        { id: 'cat-sub-4', name: 'SUB 4 (3-4 años)' },
        { id: 'cat-sub-5', name: 'SUB 5 (4-5 años)' },
        { id: 'cat-sub-6', name: 'SUB 6 (5-6 años)' },
        { id: 'cat-sub-7', name: 'SUB 7 (6-7 años)' },
        { id: 'cat-sub-8', name: 'SUB 8 (7-8 años)' },
        { id: 'cat-sub-9', name: 'SUB 9 (8-9 años)' },
        { id: 'cat-sub-10', name: 'SUB 10 (9-10 años)' },
        { id: 'cat-sub-11', name: 'SUB 11 (10-11 años)' },
        { id: 'cat-sub-12', name: 'SUB 12 (11-12 años)' },
        { id: 'cat-sub-13', name: 'SUB 13 (12-13 años)' },
        { id: 'cat-sub-14', name: 'SUB 14 (13-14 años)' }
    ];

    countryCodes: CountryOption[] = [
        { name: 'Colombia', dialCode: '+57', flag: 'Colombia', flagFile: 'assets/flags/co.svg' },
        { name: 'Perú', dialCode: '+51', flag: 'Perú', flagFile: 'assets/flags/pe.svg' },
        { name: 'Chile', dialCode: '+56', flag: 'Chile', flagFile: 'assets/flags/cl.svg' },
        { name: 'Ecuador', dialCode: '+593', flag: 'Ecuador', flagFile: 'assets/flags/ec.svg' },
        { name: 'México', dialCode: '+52', flag: 'México', flagFile: 'assets/flags/mx.svg' },
        { name: 'España', dialCode: '+34', flag: 'España', flagFile: 'assets/flags/es.svg' }
    ];

    colombiaDepartments = [
        { name: 'Antioquia', cities: ['Medellín', 'Itagüí', 'Bello', 'Envigado'] },
        { name: 'Atlántico', cities: ['Barranquilla', 'Soledad', 'Malambo'] },
        { name: 'Bogotá D.C.', cities: ['Bogotá'] },
        { name: 'Bolívar', cities: ['Cartagena', 'Turbaco', 'Magangué'] },
        { name: 'Caldas', cities: ['Manizales', 'Villamaría', 'Chinchiná'] },
        { name: 'Cauca', cities: ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'] },
        { name: 'Cesar', cities: ['Valledupar', 'Aguachica', 'Bosconia'] },
        { name: 'Córdoba', cities: ['Montería', 'Cereté', 'Sahagún'] },
        { name: 'Cundinamarca', cities: ['Soacha', 'Zipaquirá', 'Facatativá'] },
        { name: 'Huila', cities: ['Neiva', 'Pitalito', 'Garzón'] },
        { name: 'Nariño', cities: ['Pasto', 'Tumaco', 'Ipiales'] },
        { name: 'Quindío', cities: ['Armenia', 'Calarcá', 'Montenegro'] },
        { name: 'Risaralda', cities: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'] },
        { name: 'Santander', cities: ['Bucaramanga', 'Floridablanca', 'Girón'] },
        { name: 'Valle del Cauca', cities: ['Cali', 'Palmira', 'Buga'] }
    ];

    fallbackFlag = 'assets/flags/pe.svg';

    get stepTitle(): string {
        if (this.currentStep === 1) return 'Información de la academia';
        if (this.currentStep === 2) return 'Contacto principal';
        return 'Contraseña y términos';
    }

    get stepSubtitle(): string {
        if (this.currentStep === 1) return 'Empecemos con la base del registro: el nombre de la academia, su categoría inicial y el primer equipo.';
        if (this.currentStep === 2) return 'Definimos quién recibirá la comunicación principal y la ubicación operativa.';
        return 'Cerramos el alta con la contraseña inicial y la aceptación de condiciones.';
    }

    stepDescription(step: StepKey): string {
        if (step === 1) return 'Datos base';
        if (step === 2) return 'Contacto y ubicación';
        return 'Contraseña';
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
            this.stepNavigationMessage = null;
            this.stepSubmitted[this.currentStep] = false;
            this.currentStep = Math.min(3, (this.currentStep + 1) as StepKey) as StepKey;
            this.stepSubmitted[this.currentStep] = false;
        } else {
            this.touchStepFields(this.currentStep);
            this.stepSubmitted[this.currentStep] = true;
            this.stepNavigationMessage = this.getStepNavigationMessage(this.currentStep);
        }
    }

    prevStep() {
        this.stepNavigationMessage = null;
        this.currentStep = Math.max(1, (this.currentStep - 1) as StepKey) as StepKey;
    }

    goToStep(step: StepKey) {
        if (step <= this.currentStep) {
            this.stepNavigationMessage = null;
            this.stepSubmitted[this.currentStep] = false;
            this.currentStep = step;
            return;
        }

        if (!this.isStepValid(this.currentStep)) {
            this.touchStepFields(this.currentStep);
            this.stepSubmitted[this.currentStep] = true;
            this.stepNavigationMessage = this.getStepNavigationMessage(this.currentStep);
            return;
        }

        this.stepNavigationMessage = null;
    }

    constructor(private router: Router) {}

    submit() {
        this.stepSubmitted[this.currentStep] = true;
        this.touchStepFields(3);

        if (!this.isFormValid()) {
            return;
        }

        void this.router.navigate(['/auth/signup-success'], {
            state: {
                academyName: this.form.name,
                contactEmail: this.form.contactEmail,
                contactName: this.form.contactName
            }
        });
    }

    onAcademyNameInput(event: Event) {
        this.form.name = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onTeamNameInput(event: Event) {
        this.form.teamName = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onPhoneInput(event: Event) {
        this.form.phoneNumber = this.sanitizePhoneInput((event.target as HTMLInputElement).value);
    }

    onPhoneBlur() {
        this.touched['phoneNumber'] = true;
    }

    onCountryCodeChange() {
        this.form.department = '';
        this.form.city = '';
        this.form.address = '';
    }

    onRestrictedNameKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event)) {
            return;
        }

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        if (!this.isAllowedNameCharacter(event.key)) {
            event.preventDefault();
        }
    }

    onRestrictedNamePaste(event: ClipboardEvent) {
        const pastedText = event.clipboardData?.getData('text') ?? '';
        if (!this.isAllowedNameText(pastedText)) {
            event.preventDefault();
        }
    }

    showError(field: string): boolean {
        return this.currentStep === this.getFieldStep(field) && (this.stepSubmitted[this.currentStep] || this.touched[field]) && !this.isFieldValid(field);
    }

    private touchStepFields(step: StepKey) {
        const fieldsByStep: Record<StepKey, string[]> = {
            1: ['name', 'categoryId', 'teamName'],
            2: ['contactName', 'contactEmail', 'countryCode', 'phoneNumber', 'department', 'address', 'city'],
            3: ['password', 'confirmPassword', 'terms']
        };

        fieldsByStep[step].forEach((field) => (this.touched[field] = true));
    }

    private getFieldStep(field: string): StepKey {
        if (['name', 'categoryId', 'teamName'].includes(field)) {
            return 1;
        }

        if (['contactName', 'contactEmail', 'countryCode', 'phoneNumber', 'department', 'address', 'city'].includes(field)) {
            return 2;
        }

        return 3;
    }

    private isStepValid(step: StepKey): boolean {
        if (step === 1) {
            return this.isFieldValid('name') && this.isFieldValid('categoryId') && this.isFieldValid('teamName');
        }

        if (step === 2) {
            return this.isFieldValid('contactName') && this.isFieldValid('contactEmail') && this.isFieldValid('phoneNumber') && this.isFieldValid('department') && this.isFieldValid('address') && this.isFieldValid('city');
        }

        return this.isFieldValid('password') && this.isFieldValid('confirmPassword') && this.isFieldValid('terms');
    }

    private getStepNavigationMessage(step: StepKey): string {
        if (step === 1) {
            return 'Completa esta sección para continuar con el siguiente paso.';
        }

        if (step === 2) {
            return 'Revisa los datos de contacto antes de seguir.';
        }

        return 'Completa la contraseña y acepta los términos para continuar.';
    }

    private isFormValid(): boolean {
        return this.isStepValid(1) && this.isStepValid(2) && this.isStepValid(3);
    }

    isStepCompleted(step: StepKey): boolean {
        return this.isStepValid(step);
    }

    private isFieldValid(field: string): boolean {
        switch (field) {
            case 'name':
                return this.hasValidText(this.form.name, 2);
            case 'teamName':
                return this.hasValidText(this.form.teamName, 2);
            case 'contactName':
                return this.hasValidText(this.form.contactName, 2);
            case 'contactEmail':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.contactEmail.trim());
            case 'countryCode':
                return !!this.form.countryCode.trim();
            case 'phoneNumber':
                return this.isValidPhoneNumber(this.form.countryCode, this.form.phoneNumber);
            case 'department':
                return this.form.countryCode !== '+57' || !!this.form.department.trim();
            case 'address':
                return this.form.countryCode === '+57' || this.form.address.trim().length >= 5;
            case 'city':
                return this.form.countryCode === '+57' ? !!this.form.city.trim() : this.hasValidText(this.form.city, 2);
            case 'categoryId':
                return !!this.form.categoryId.trim();
            case 'password':
                return this.form.password.trim().length >= 8;
            case 'confirmPassword':
                return this.form.password.trim().length >= 8 && this.form.password === this.confirmPassword;
            case 'terms':
                return this.accepted;
            default:
                return true;
        }
    }

    private hasValidText(value: string, minLength: number): boolean {
        const trimmed = value.trim();
        if (trimmed.length < minLength) {
            return false;
        }

        return this.isAllowedNameText(trimmed);
    }

    private sanitizeNameInput(value: string): string {
        return value.replace(/[^\p{L}\p{N}\s]/gu, '');
    }

    private sanitizePhoneInput(value: string): string {
        return value.replace(/[^\d\s()+-]/g, '');
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

    private isValidPhoneNumber(countryCode: string, phoneNumber: string): boolean {
        const digits = phoneNumber.replace(/\D/g, '');

        if (!countryCode.trim()) {
            return false;
        }

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

    get departmentCities(): string[] {
        const department = this.colombiaDepartments.find((item) => item.name === this.form.department);
        return department?.cities ?? [];
    }

}
