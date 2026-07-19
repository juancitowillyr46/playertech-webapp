import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { AuthAccessService } from '../data-access/auth-access.service';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';
import { PublicCategory, TenantSignupSummary } from '@/app/core/auth/auth.models';

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
                            <h1 class="mt-4 max-w-sm text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Registra tu academia</h1>
                            <p class="mt-4 max-w-sm text-sm leading-6 text-slate-600 dark:text-white/70 sm:text-base">Completa la información para comenzar.</p>

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
                                <p class="hidden text-xs uppercase tracking-[0.32em] text-emerald-700 dark:text-emerald-400 sm:block">Registro</p>
                                <h1 class="mx-auto mt-2 max-w-[12ch] text-3xl font-semibold leading-[1.08] tracking-tight text-surface-900 dark:text-surface-0 sm:mx-0 sm:max-w-none sm:text-4xl">{{ stepTitle }}</h1>
                                <p class="mx-auto mt-1.5 max-w-[28ch] text-[0.9rem] leading-5 text-slate-600 dark:text-slate-300 sm:mx-0 sm:mt-2 sm:max-w-xl sm:text-base sm:leading-6">{{ stepSubtitle }}</p>
                            </div>
                            <div class="shrink-0 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-surface-800 dark:bg-surface-950 dark:text-slate-200 sm:px-4 sm:py-2 sm:text-sm">
                                {{ currentStep }}/3
                            </div>
                        </div>

                        @if (apiMessage) {
                            <div class="mb-5">
                                <p-message [severity]="apiMessage.severity" [text]="apiMessage.text" [closable]="false" />
                            </div>
                        }

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
                                            <label for="onboardingCategoryId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Categorías</label>
                                            <p-select
                                                id="onboardingCategoryId"
                                                [(ngModel)]="form.onboardingCategoryId"
                                                name="onboardingCategoryId"
                                                [options]="publicCategories"
                                                optionLabel="name"
                                                optionValue="id"
                                                placeholder="Seleccionar categoría"
                                                class="w-full"
                                                appendTo="body"
                                                [scrollHeight]="'16rem'"
                                                [loading]="categoriesLoading"
                                                [disabled]="categoriesLoading || categoriesError || categoriesEmpty">
                                                <ng-template #item let-option>
                                                    <div class="flex flex-col gap-1">
                                                        <span class="font-medium text-surface-900 dark:text-surface-0">{{ categoryDisplayLabel(option) }}</span>
                                                        <span class="text-xs leading-5 text-slate-500 dark:text-slate-400">{{ option.description }}</span>
                                                    </div>
                                                </ng-template>
                                            </p-select>
                                            @if (categoriesLoading) {
                                                <p-message severity="info" size="small">Cargando categorías...</p-message>
                                            } @else if (categoriesEmpty) {
                                                <p-message severity="warn" size="small">No hay categorías disponibles.</p-message>
                                            } @else if (categoriesError) {
                                                <p-message severity="error" size="small">No fue posible cargar las categorías. Intenta nuevamente.</p-message>
                                            } @if (showError('onboardingCategoryId')) {
                                                <p-message severity="error" size="small">Selecciona una plantilla de onboarding.</p-message>
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
                                            <input
                                                pInputText
                                                id="contactEmail"
                                                type="text"
                                                [(ngModel)]="form.contactEmail"
                                                name="contactEmail"
                                                placeholder="tenant.demo@example.com"
                                                class="w-full"
                                                (keydown)="onEmailKeydown($event)"
                                                (paste)="onEmailPaste($event)"
                                                (input)="onEmailInput()"
                                            />
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
                                                <input pInputText id="phoneNumber" type="text" [(ngModel)]="form.phoneNumber" name="phoneNumber" placeholder="Ej. 3123456789" class="col-span-12 md:col-span-8 w-full" (input)="onPhoneInput($event)" />
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
                                                    appendTo="body"
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
                                                    class="w-full"
                                                    appendTo="body">
                                                </p-select>
                                                @if (showError('city')) {
                                                    <p-message severity="error" size="small">Selecciona la ciudad.</p-message>
                                                }
                                            </div>
                                        } @else {
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

                                        <div class="col-span-12 mt-4 flex items-start gap-3 px-1 py-0.5">
                                            <p-checkbox [(ngModel)]="accepted" inputId="terms" name="terms" binary></p-checkbox>
                                            <label for="terms" class="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                Acepto los <a class="font-medium text-sky-700 hover:underline dark:text-sky-400" href="#" (click)="openTerms($event)">términos y condiciones</a> y el <a class="font-medium text-sky-700 hover:underline dark:text-sky-400" href="#" (click)="openDataProcessing($event)">tratamiento de datos personales</a>.
                                            </label>
                                        </div>
                                        @if (showError('terms')) {
                                            <div class="col-span-12">
                                                <p-message severity="error" size="small">Acepta los términos para continuar.</p-message>
                                            </div>
                                        }

                                        <div class="col-span-12 flex items-start gap-3 px-1 py-0.5">
                                            <p-checkbox [(ngModel)]="acceptedDataProcessing" inputId="dataProcessing" name="dataProcessing" binary></p-checkbox>
                                            <label for="dataProcessing" class="text-sm leading-6 text-slate-600 dark:text-slate-300">
                                                Acepto el <a class="font-medium text-sky-700 hover:underline dark:text-sky-400" href="#" (click)="openDataProcessing($event)">tratamiento de mis datos personales</a>.
                                            </label>
                                        </div>
                                        @if (showError('dataProcessing')) {
                                            <div class="col-span-12">
                                                <p-message severity="error" size="small">Acepta el tratamiento de datos para continuar.</p-message>
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
                                        <p-button label="Crear academia" styleClass="w-full sm:w-auto" type="submit" [loading]="loading" loadingIcon="pi pi-spinner pi-spin" [disabled]="loading" />
                                    }
                                </div>

                                <div class="flex items-center justify-center sm:justify-end">
                                        <p class="text-sm text-slate-600 dark:text-slate-300">
                                            ¿Ya tienes una cuenta?
                                            <a routerLink="/auth/login" class="font-medium text-emerald-700 hover:underline dark:text-emerald-400">Iniciar sesión</a>
                                        </p>
                                    </div>
                            </div>

                            @if (loading) {
                                <div class="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-100">
                                    Estamos enviando tu solicitud. Esto puede tardar unos segundos.
                                </div>
                            }

                            @if (submissionTimedOut) {
                                <div class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
                                    La solicitud está tardando más de lo esperado. Revisa tu conexión e inténtalo nuevamente si no recibes respuesta.
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="showTermsDialog" header="Términos y condiciones" [modal]="true" [style]="{ width: '46rem' }" [breakpoints]="{ '960px': '90vw', '640px': '95vw' }" [contentStyle]="{ 'max-height': '70vh', overflow: 'auto' }">
            <div class="space-y-5 text-sm leading-6 text-surface-700 dark:text-surface-200">
                <p>Estos términos regulan el acceso y uso inicial de la plataforma PlayerTech durante el proceso de registro público de academias. Al continuar, el usuario declara que ha leído, comprendido y aceptado las condiciones aquí descritas.</p>
                <p>1. Objeto. El formulario de signup permite crear una cuenta de academia, un usuario administrador inicial y un equipo base. Esta funcionalidad está orientada a fines operativos, administrativos y de configuración inicial dentro del ecosistema PlayerTech.</p>
                <p>2. Alcance del servicio. La plataforma puede almacenar información de contacto, ubicación, categoría deportiva, nombre del equipo inicial y demás datos ingresados por el usuario para habilitar el acceso al servicio y completar el onboarding.</p>
                <p>3. Responsabilidad del usuario. Quien envía el formulario declara que la información proporcionada es veraz, actual y que tiene facultades para registrar la academia y aceptar estas condiciones en nombre de la organización.</p>
                <p>4. Uso aceptable. El usuario se compromete a no ingresar información falsa, ofensiva, ilícita o que infrinja derechos de terceros. PlayerTech podrá restringir el acceso si detecta abuso, manipulación de datos o uso indebido del sistema de alta.</p>
                <p>5. Cuentas y credenciales. La contraseña creada durante el onboarding debe mantenerse bajo reserva. El usuario es responsable por toda actividad realizada con sus credenciales, salvo que notifique un incidente de seguridad conforme a los canales habilitados.</p>
                <p>6. Disponibilidad. PlayerTech podrá suspender temporalmente el servicio por mantenimiento, mejoras de seguridad, correcciones técnicas o actualización de dependencias, procurando minimizar afectaciones al proceso de registro.</p>
                <p>7. Propiedad y licencia. La marca, el software, los diseños, los textos y el material de la plataforma pertenecen a PlayerTech o a sus licenciantes. El uso del servicio no transfiere propiedad intelectual alguna al usuario.</p>
                <p>8. Actualizaciones. Estos términos podrán modificarse cuando el producto evolucione. La versión publicada al momento del envío del formulario será la aplicable, salvo que un cambio normativo exija su actualización inmediata.</p>
                <p>9. Suspensión y terminación. PlayerTech podrá limitar, suspender o cancelar el acceso ante incumplimientos, fraude, uso malicioso o requerimientos legales. El usuario podrá dejar de usar la plataforma en cualquier momento.</p>
                <p>10. Legislación aplicable. La interpretación de estos términos se regirá por la normativa aplicable al lugar de operación y por las políticas internas del servicio, sin perjuicio de las obligaciones legales que correspondan.</p>
                <p>11. Contacto. Para consultas sobre estos términos, incidencias del onboarding o aclaraciones sobre el uso del servicio, el usuario podrá contactar a soporte a través de los canales oficiales de la plataforma.</p>
            </div>
            <ng-template #footer>
                <p-button label="Cerrar" (click)="showTermsDialog = false" />
            </ng-template>
        </p-dialog>

        <p-dialog [(visible)]="showDataProcessingDialog" header="Tratamiento de datos personales" [modal]="true" [style]="{ width: '46rem' }" [breakpoints]="{ '960px': '90vw', '640px': '95vw' }" [contentStyle]="{ 'max-height': '70vh', overflow: 'auto' }">
            <div class="space-y-5 text-sm leading-6 text-surface-700 dark:text-surface-200">
                <p>Mediante este documento se informa al usuario sobre el tratamiento de datos personales que realiza PlayerTech en el contexto del signup público de academias. La aceptación expresa de este apartado autoriza el procesamiento de la información ingresada para las finalidades descritas a continuación.</p>
                <p>1. Responsable del tratamiento. PlayerTech actúa como responsable de la información suministrada por el usuario en el formulario, incluyendo nombre de la academia, datos del contacto, teléfono, ubicación, categoría deportiva y otros campos asociados al registro.</p>
                <p>2. Finalidades. Los datos se usarán para crear la cuenta, habilitar el acceso inicial, gestionar comunicación operativa, validar identidad organizacional, prestar soporte, prevenir fraude, ejecutar mejoras del servicio y cumplir obligaciones legales o contractuales.</p>
                <p>3. Autorización. El usuario autoriza de manera previa, expresa e informada el tratamiento de sus datos personales y de los datos de la academia para las finalidades indicadas. Esta autorización comprende almacenamiento, consulta, organización, actualización, transmisión y demás operaciones necesarias para operar el servicio.</p>
                <p>4. Datos tratados. La plataforma puede recolectar información de identificación, contacto, datos de ubicación, credenciales de acceso, registros de actividad y metadatos técnicos asociados a la sesión o al dispositivo desde el cual se realiza el onboarding.</p>
                <p>5. Derechos del titular. El usuario podrá acceder, actualizar, rectificar, solicitar supresión cuando proceda, revocar la autorización y presentar consultas o reclamos sobre sus datos conforme a los canales de atención disponibles y a la normativa aplicable.</p>
                <p>6. Seguridad. PlayerTech aplica medidas razonables de seguridad administrativas, técnicas y organizativas para proteger la confidencialidad e integridad de los datos. Ningún sistema es infalible, por lo que el usuario también debe proteger sus credenciales y dispositivos.</p>
                <p>7. Conservación. Los datos serán conservados durante el tiempo necesario para cumplir las finalidades del tratamiento, las obligaciones legales y el soporte operativo del servicio. Posteriormente podrán ser eliminados o anonimizados conforme a la política aplicable.</p>
                <p>8. Transferencia y transmisión. Cuando resulte necesario para operar el servicio, PlayerTech podrá compartir datos con proveedores tecnológicos, infraestructura de nube, herramientas de mensajería o servicios de soporte, siempre bajo condiciones de confidencialidad y protección acordes al propósito del tratamiento.</p>
                <p>9. Menores de edad. Si el registro incluye datos relacionados con categorías deportivas o equipos de menores, el usuario declara contar con la autorización correspondiente para proporcionar dicha información y para que sea tratada bajo los fines del servicio.</p>
                <p>10. Canales de atención. El usuario puede solicitar aclaraciones, ejercer derechos o presentar requerimientos relacionados con protección de datos a través de los canales oficiales de PlayerTech y del correo de soporte establecido para tales efectos.</p>
                <p>11. Vigencia. Esta autorización permanecerá vigente mientras exista una relación activa con la plataforma o durante el tiempo adicional requerido por obligaciones legales, contractuales o de seguridad documental.</p>
            </div>
            <ng-template #footer>
                <p-button label="Cerrar" (click)="showDataProcessingDialog = false" />
            </ng-template>
        </p-dialog>
    `
})
export class Signup implements OnInit {
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
        city: '',
        onboardingCategoryId: '',
        teamName: ''
    };

    confirmPassword = '';
    accepted = false;
    acceptedDataProcessing = false;
    submitted = false;
    loading = false;
    submissionTimedOut = false;
    categoriesLoading = true;
    categoriesError = false;
    categoriesEmpty = false;
    showTermsDialog = false;
    showDataProcessingDialog = false;
    apiMessage: { severity: 'success' | 'info' | 'warn' | 'error'; text: string } | null = null;
    stepNavigationMessage: string | null = null;
    private submissionTimeoutHandle: ReturnType<typeof setTimeout> | null = null;
    stepSubmitted: Record<StepKey, boolean> = {
        1: false,
        2: false,
        3: false
    };

    publicCategories: PublicCategory[] = [];

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

    openTerms(event: MouseEvent) {
        event.preventDefault();
        this.showTermsDialog = true;
    }

    openDataProcessing(event: MouseEvent) {
        event.preventDefault();
        this.showDataProcessingDialog = true;
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

    constructor(
        private router: Router,
        private readonly cdr: ChangeDetectorRef,
        private readonly auth: AuthAccessService
    ) {}

    ngOnInit(): void {
        void this.loadPublicCategories();
    }

    async submit() {
        this.stepSubmitted[this.currentStep] = true;
        this.touchStepFields(3);
        this.apiMessage = null;

        if (!this.isFormValid()) {
            this.apiMessage = {
                severity: 'error',
                text: 'Revisa los campos marcados antes de continuar.'
            };
            return;
        }

        this.loading = true;
        this.submissionTimedOut = false;
        this.clearSubmissionTimeout();
        this.submissionTimeoutHandle = globalThis.setTimeout(() => {
            if (this.loading) {
                this.submissionTimedOut = true;
            }
        }, 60000);

        try {
            const result = await firstValueFrom(this.auth.signupTenant(this.buildSignupPayload()));

            this.apiMessage = {
                severity: 'success',
                text: result.activationRequired === false ? 'Cuenta creada correctamente.' : 'Cuenta creada. Revisa tu correo para activar el acceso.'
            };
            this.auth.saveSignupSummary(this.buildSignupSummary(result));
            this.navigateToSuccess(result);
        } catch (error) {
            const authError = error as AuthErrorLike | undefined;
            this.apiMessage = {
                severity: 'error',
                text: this.getSignupErrorMessage(authError)
            };
        } finally {
            this.loading = false;
            this.clearSubmissionTimeout();
        }
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

    onEmailInput() {
        this.form.contactEmail = this.sanitizeEmailInput(this.form.contactEmail);
    }

    onEmailKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event)) {
            return;
        }

        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        if (!this.isAllowedEmailCharacter(event.key)) {
            event.preventDefault();
        }
    }

    onEmailPaste(event: ClipboardEvent) {
        const pastedText = event.clipboardData?.getData('text') ?? '';
        const sanitizedText = this.sanitizeEmailInput(pastedText);

        if (pastedText !== sanitizedText) {
            event.preventDefault();
            const input = event.target as HTMLInputElement | null;

            if (input) {
                const start = input.selectionStart ?? input.value.length;
                const end = input.selectionEnd ?? input.value.length;
                const nextValue = input.value.slice(0, start) + sanitizedText + input.value.slice(end);
                this.form.contactEmail = nextValue;
            }
        }
    }

    onCountryCodeChange() {
        this.form.department = '';
        this.form.city = '';
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
        return this.currentStep === this.getFieldStep(field) && this.stepSubmitted[this.currentStep] && !this.isFieldValid(field);
    }

    private touchStepFields(step: StepKey) {
        void step;
        const fieldsByStep: Record<StepKey, string[]> = {
            1: ['name', 'onboardingCategoryId', 'teamName'],
            2: ['contactName', 'contactEmail', 'countryCode', 'phoneNumber', 'department', 'city'],
            3: ['password', 'confirmPassword', 'terms', 'dataProcessing']
        };
        void fieldsByStep;
    }

    private getFieldStep(field: string): StepKey {
        if (['name', 'onboardingCategoryId', 'teamName'].includes(field)) {
            return 1;
        }

        if (['contactName', 'contactEmail', 'countryCode', 'phoneNumber', 'department', 'city'].includes(field)) {
            return 2;
        }

        return 3;
    }

    private isStepValid(step: StepKey): boolean {
        if (step === 1) {
            return this.isFieldValid('name') && this.isFieldValid('onboardingCategoryId') && this.isFieldValid('teamName');
        }

        if (step === 2) {
            return this.isFieldValid('contactName') && this.isFieldValid('contactEmail') && this.isFieldValid('phoneNumber') && this.isFieldValid('department') && this.isFieldValid('city');
        }

        return this.isFieldValid('password') && this.isFieldValid('confirmPassword') && this.isFieldValid('terms') && this.isFieldValid('dataProcessing');
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

    private clearSubmissionTimeout() {
        if (this.submissionTimeoutHandle !== null) {
            globalThis.clearTimeout(this.submissionTimeoutHandle);
            this.submissionTimeoutHandle = null;
        }
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
            case 'city':
                return this.form.countryCode === '+57' ? !!this.form.city.trim() : this.hasValidText(this.form.city, 2);
            case 'onboardingCategoryId':
                return !!this.form.onboardingCategoryId.trim();
            case 'password':
                return this.form.password.trim().length >= 8;
            case 'confirmPassword':
                return this.form.password.trim().length >= 8 && this.form.password === this.confirmPassword;
            case 'terms':
                return this.accepted;
            case 'dataProcessing':
                return this.acceptedDataProcessing;
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

    categoryDisplayLabel(category?: Pick<PublicCategory, 'name' | 'minAge' | 'maxAge'> | null): string {
        if (!category) {
            return 'Seleccionar plantilla';
        }

        return `${category.name} (${category.minAge}-${category.maxAge} años)`;
    }

    private async loadPublicCategories(): Promise<void> {
        this.categoriesLoading = true;
        this.categoriesError = false;
        this.categoriesEmpty = false;

        this.auth.getPublicCategories().subscribe({
            next: (categories) => {
                this.publicCategories = categories;
                this.categoriesEmpty = categories.length === 0;
                this.categoriesError = false;
                this.categoriesLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.publicCategories = [];
                this.categoriesEmpty = false;
                this.categoriesError = true;
                this.categoriesLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    private buildSignupPayload() {
        return {
            name: this.form.name,
            contactEmail: this.form.contactEmail,
            contactName: this.form.contactName,
            password: this.form.password,
            phone: this.buildPhoneNumber(),
            country: this.getSelectedCountryName(),
            department: this.form.department,
            city: this.form.city,
            onboardingCategoryId: this.form.onboardingCategoryId,
            teamName: this.form.teamName,
            acceptedTerms: this.accepted,
            acceptedDataProcessing: this.acceptedDataProcessing
        };
    }

    private buildPhoneNumber(): string {
        return this.form.countryCode ? `${this.form.countryCode} ${this.form.phoneNumber}`.trim() : this.form.phoneNumber;
    }

    private getSelectedCountryName(): string {
        return this.countryCodes.find((country) => country.dialCode === this.form.countryCode)?.name ?? 'Colombia';
    }

    private navigateToSuccess(result: { academy?: { name?: string }; admin?: { email?: string; fullName?: string }; team?: { name?: string }; activationRequired?: boolean }) {
        void this.router.navigate(['/auth/signup-success'], {
            state: {
                academyName: result.academy?.name ?? this.form.name,
                contactEmail: result.admin?.email ?? this.form.contactEmail,
                contactName: result.admin?.fullName ?? this.form.contactName,
                teamName: result.team?.name ?? this.form.teamName,
                activationRequired: result.activationRequired ?? true
            }
        });
    }

    private buildSignupSummary(result: { academy?: { name?: string }; admin?: { email?: string; fullName?: string }; team?: { name?: string }; activationRequired?: boolean; activationEmailSent?: boolean }): TenantSignupSummary {
        return {
            academyName: result.academy?.name ?? this.form.name,
            contactEmail: result.admin?.email ?? this.form.contactEmail,
            contactName: result.admin?.fullName ?? this.form.contactName,
            teamName: result.team?.name ?? this.form.teamName,
            activationRequired: result.activationRequired ?? true,
            activationEmailSent: result.activationEmailSent ?? !!(result.activationRequired ?? true)
        };
    }

    private getSignupErrorMessage(error?: AuthErrorLike): string {
        if (error?.status === 400) {
            return 'Revisa los datos ingresados. Hay información que no cumple el formato esperado.';
        }

        if (error?.status === 409) {
            return 'Ya existe una academia o correo con esos datos.';
        }

        return 'No fue posible crear la academia. Intenta nuevamente.';
    }

}
