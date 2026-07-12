import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { TenantForm } from '../models/tenant.model';
import { TenantManagementService } from '../data-access/tenant-management.service';

type WizardStepKey = 'academy' | 'admin' | 'team';

interface WizardStep {
    key: WizardStepKey;
    title: string;
    subtitle: string;
    fields: string[];
}

interface CountryOption {
    name: string;
    dialCode: string;
    flagFile: string;
}

interface LocationDepartment {
    name: string;
    cities: string[];
}

@Component({
    selector: 'app-tenant-wizard',
    standalone: true,
    imports: [ButtonModule, CommonModule, ConfirmDialogModule, FormsModule, InputTextModule, MessageModule, PageHeader, RouterModule, SelectModule, ToastModule],
    providers: [ConfirmationService, MessageService, TenantManagementService],
    template: `
        <p-toast />
        <p-confirmdialog />

        <div class="space-y-4">
            <app-page-header [breadcrumbs]="headerBreadcrumbs" title="Academias" [subtitle]="headerSubtitle">
                <p-button headerActions label="Volver" severity="secondary" outlined styleClass="w-full sm:w-auto" routerLink="/tenants" />
            </app-page-header>

            <div class="mx-auto mt-4 w-full max-w-5xl overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <div class="border-b border-slate-200 px-4 py-4 dark:border-surface-800">
                    <div class="grid gap-2 sm:grid-cols-3">
                        @for (step of wizardSteps; track step.key; let index = $index) {
                            <button
                                type="button"
                                class="flex items-start gap-3 rounded-[0.8rem] border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-100"
                                [class.border-sky-300]="index === currentStep"
                                [class.bg-sky-50]="index === currentStep"
                                [class.border-emerald-300]="index < currentStep"
                                [class.bg-emerald-50]="index < currentStep"
                                [class.border-slate-200]="index > currentStep"
                                [class.bg-white]="index > currentStep"
                                [disabled]="index > currentStep"
                                (click)="goToStep(index)"
                            >
                                <span
                                    class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                                    [class.bg-sky-500]="index === currentStep"
                                    [class.text-white]="index === currentStep"
                                    [class.bg-emerald-500]="index < currentStep"
                                    [class.text-white]="index < currentStep"
                                    [class.bg-slate-100]="index > currentStep"
                                    [class.text-slate-500]="index > currentStep"
                                >
                                    @if (isStepDone(index)) {
                                        <i class="pi pi-check text-xs"></i>
                                    } @else {
                                        {{ index + 1 }}
                                    }
                                </span>
                                <span class="min-w-0">
                                    <span class="block text-sm font-medium leading-5 text-surface-900 dark:text-surface-0">{{ step.title }}</span>
                                    <span class="mt-0.5 block text-xs leading-4 text-slate-500 dark:text-slate-400">{{ step.subtitle }}</span>
                                </span>
                            </button>
                        }
                    </div>
                </div>

                <div class="mx-auto w-full max-w-4xl space-y-6 px-4 py-5 sm:px-5 sm:py-6">
                    @if (currentStep === 0) {
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 flex flex-col gap-2">
                                <label for="name" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre de la academia <span class="text-rose-500">*</span></label>
                                <input pInputText id="name" type="text" [(ngModel)]="form.name" name="name" placeholder="Ej. Academia PlayerTech" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onAcademyNameInput($event)" />
                                @if (showError('name')) {
                                    <p-message severity="error" size="small">Ingresa el nombre de la academia.</p-message>
                                }
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="contactEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo principal <span class="text-rose-500">*</span></label>
                                <input pInputText id="contactEmail" type="text" [(ngModel)]="form.contactEmail" name="contactEmail" placeholder="Ej. contacto@academia.com" class="w-full" (keydown)="onEmailKeydown($event)" (paste)="onEmailPaste($event)" (input)="onEmailInput('contactEmail')" />
                                @if (showError('contactEmail')) {
                                    <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                }
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="phoneNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono <span class="text-rose-500">*</span></label>
                                <div class="grid grid-cols-12 gap-3">
                                    <p-select id="countryCode" [(ngModel)]="form.countryCode" name="countryCode" [options]="locationCountryOptions" optionLabel="name" optionValue="dialCode" [filter]="true" filterBy="name,dialCode" placeholder="Código" class="col-span-12 md:col-span-4 w-full" (onChange)="onPhoneCountryCodeChange()">
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
                                <p-select id="country" [(ngModel)]="form.country" name="country" [options]="locationCountryOptions" optionLabel="name" optionValue="name" [filter]="true" filterBy="name" placeholder="Selecciona país de operación" class="w-full" (onChange)="onLocationCountryChange()" />
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
                                <label for="citySelect" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad <span class="text-rose-500">*</span></label>
                                <p-select id="citySelect" [(ngModel)]="form.city" name="city" [options]="departmentCities" placeholder="Selecciona una ciudad" class="w-full" [filter]="true" />
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
                    }

                    @if (currentStep === 1) {
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="adminName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del usuario inicial <span class="text-rose-500">*</span></label>
                                <input pInputText id="adminName" type="text" [(ngModel)]="form.adminName" name="adminName" placeholder="Ej. Juan Pérez" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onAdminNameInput($event)" />
                                @if (showError('adminName')) {
                                    <p-message severity="error" size="small">Ingresa el nombre del usuario inicial.</p-message>
                                }
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="adminEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo del usuario inicial <span class="text-rose-500">*</span></label>
                                <input pInputText id="adminEmail" type="text" [(ngModel)]="form.adminEmail" name="adminEmail" placeholder="Ej. admin@academia.com" class="w-full" (keydown)="onEmailKeydown($event)" (paste)="onEmailPaste($event)" (input)="onEmailInput('adminEmail')" />
                                @if (showError('adminEmail')) {
                                    <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                }
                            </div>
                        </div>
                    }

                    @if (currentStep === 2) {
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="categoryId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Categoría inicial <span class="text-rose-500">*</span></label>
                                <p-select id="categoryId" [(ngModel)]="form.categoryId" name="categoryId" [options]="categoryOptions" optionLabel="label" optionValue="id" placeholder="Selecciona una categoría" class="w-full" [filter]="true" filterBy="label" />
                                @if (showError('categoryId')) {
                                    <p-message severity="error" size="small">Selecciona la categoría inicial.</p-message>
                                }
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="teamName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del primer equipo <span class="text-rose-500">*</span></label>
                                <input pInputText id="teamName" type="text" [(ngModel)]="form.teamName" name="teamName" placeholder="Ej. Sub 12 A" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onTeamNameInput($event)" />
                                @if (showError('teamName')) {
                                    <p-message severity="error" size="small">Ingresa el nombre del equipo.</p-message>
                                }
                            </div>
                        </div>

                        <div class="rounded-[0.9rem] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-surface-700 dark:bg-surface-900/40">
                            <p class="text-sm font-medium text-surface-900 dark:text-surface-0">Resumen de creación</p>
                            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">La academia, el usuario inicial y el primer equipo quedarán listos en una sola operación.</p>
                            <div class="mt-4 grid gap-3 sm:grid-cols-3">
                                <div class="rounded-[0.8rem] bg-white px-4 py-3 shadow-sm dark:bg-surface-900">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Academia</p>
                                    <p class="mt-1 text-sm font-medium text-surface-900 dark:text-surface-0">{{ form.name || 'Pendiente' }}</p>
                                </div>
                                <div class="rounded-[0.8rem] bg-white px-4 py-3 shadow-sm dark:bg-surface-900">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Usuario inicial</p>
                                    <p class="mt-1 text-sm font-medium text-surface-900 dark:text-surface-0">{{ form.adminName || 'Pendiente' }}</p>
                                </div>
                                <div class="rounded-[0.8rem] bg-white px-4 py-3 shadow-sm dark:bg-surface-900">
                                    <p class="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Equipo</p>
                                    <p class="mt-1 text-sm font-medium text-surface-900 dark:text-surface-0">{{ form.teamName || 'Pendiente' }}</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div class="border-t border-slate-200 px-4 py-4 dark:border-surface-800">
                    <div class="mx-auto flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" routerLink="/tenants" />
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                        @if (currentStep > 0) {
                            <p-button label="Anterior" severity="secondary" outlined styleClass="w-full sm:w-auto" (onClick)="prevStep()" />
                        }
                        <p-button
                            [label]="currentStep < 2 ? 'Continuar' : (form.id ? 'Guardar cambios' : 'Crear academia')"
                            [icon]="currentStep < 2 ? 'pi pi-arrow-right' : 'pi pi-check'"
                            [iconPos]="currentStep < 2 ? 'right' : 'left'"
                            styleClass="w-full sm:w-auto"
                            (onClick)="currentStep < 2 ? nextStep() : saveTenant()"
                        />
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TenantWizard implements OnInit {
    currentStep = 0;
    stepSubmitted: boolean[] = [false, false, false];
    form: TenantForm = this.emptyForm();

    headerBreadcrumbs: PageHeaderBreadcrumb[] = [];

    readonly fallbackFlag = 'assets/flags/pe.svg';

    readonly wizardSteps: WizardStep[] = [
        {
            key: 'academy',
            title: 'Datos de la academia',
            subtitle: 'Información principal y ubicación.',
            fields: ['name', 'contactEmail', 'countryCode', 'phoneNumber', 'country', 'department', 'city', 'address']
        },
        {
            key: 'admin',
            title: 'Usuario inicial',
            subtitle: 'Acceso administrativo inicial.',
            fields: ['adminName', 'adminEmail']
        },
        {
            key: 'team',
            title: 'Equipo inicial',
            subtitle: 'Categoría y primer equipo.',
            fields: ['categoryId', 'teamName']
        }
    ];

    readonly categoryOptions = [
        { id: 'cat-sub-4', label: 'SUB 4 (3-4 años)' },
        { id: 'cat-sub-5', label: 'SUB 5 (4-5 años)' },
        { id: 'cat-sub-6', label: 'SUB 6 (5-6 años)' },
        { id: 'cat-sub-7', label: 'SUB 7 (6-7 años)' },
        { id: 'cat-sub-8', label: 'SUB 8 (7-8 años)' },
        { id: 'cat-sub-9', label: 'SUB 9 (8-9 años)' },
        { id: 'cat-sub-10', label: 'SUB 10 (9-10 años)' },
        { id: 'cat-sub-11', label: 'SUB 11 (10-11 años)' },
        { id: 'cat-sub-12', label: 'SUB 12 (11-12 años)' },
        { id: 'cat-sub-13', label: 'SUB 13 (12-13 años)' },
        { id: 'cat-sub-14', label: 'SUB 14 (13-14 años)' }
    ];

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
            { name: 'Tolima', cities: ['Ibagué', 'Espinal', 'Honda'] },
            { name: 'Valle del Cauca', cities: ['Cali', 'Palmira', 'Buga'] }
        ],
        Perú: [
            { name: 'Lima', cities: ['Lima', 'Miraflores', 'Surco', 'San Isidro'] },
            { name: 'Arequipa', cities: ['Arequipa', 'Yanahuara', 'Cayma'] },
            { name: 'Cusco', cities: ['Cusco', 'Santiago', 'Wanchaq'] },
            { name: 'La Libertad', cities: ['Trujillo', 'Huanchaco', 'Víctor Larco'] }
        ],
        Chile: [
            { name: 'Región Metropolitana', cities: ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa'] },
            { name: 'Valparaíso', cities: ['Valparaíso', 'Viña del Mar', 'Concón'] },
            { name: 'Biobío', cities: ['Concepción', 'Talcahuano', 'Chiguayante'] }
        ],
        Ecuador: [
            { name: 'Pichincha', cities: ['Quito', 'Cumbayá', 'Tumbaco'] },
            { name: 'Guayas', cities: ['Guayaquil', 'Daule', 'Samborondón'] },
            { name: 'Azuay', cities: ['Cuenca', 'Gualaceo', 'Paute'] }
        ],
        México: [
            { name: 'Ciudad de México', cities: ['Coyoacán', 'Benito Juárez', 'Miguel Hidalgo'] },
            { name: 'Jalisco', cities: ['Guadalajara', 'Zapopan', 'Tlaquepaque'] },
            { name: 'Nuevo León', cities: ['Monterrey', 'San Nicolás', 'Guadalupe'] }
        ],
        España: [
            { name: 'Madrid', cities: ['Madrid', 'Alcobendas', 'Getafe'] },
            { name: 'Cataluña', cities: ['Barcelona', 'Badalona', 'Sabadell'] },
            { name: 'Andalucía', cities: ['Sevilla', 'Málaga', 'Córdoba'] }
        ]
    };

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly tenantService: TenantManagementService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            const existing = this.tenantService.getById(id);
            if (existing) {
                this.form = existing;
            }
        }

        this.syncHeaderState();
    }

    get headerSubtitle(): string {
        return this.form.id ? 'Actualiza la información principal de la academia.' : 'Completa la información para registrar una nueva academia.';
    }

    get locationCountryOptions(): CountryOption[] {
        return this.countryOptions;
    }

    get departmentOptions(): LocationDepartment[] {
        return this.locationCatalog[this.form.country] ?? [];
    }

    get departmentCities(): string[] {
        const department = this.departmentOptions.find((item) => item.name === this.form.department);
        return department?.cities ?? [];
    }

    goToStep(stepIndex: number) {
        if (stepIndex <= this.currentStep) {
            this.currentStep = stepIndex;
        }
    }

    nextStep() {
        this.stepSubmitted[this.currentStep] = true;
        if (!this.isStepValid(this.currentStep)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa este paso',
                detail: 'Completa los campos obligatorios para continuar.'
            });
            return;
        }
        this.currentStep = Math.min(this.currentStep + 1, this.wizardSteps.length - 1);
    }

    prevStep() {
        this.currentStep = Math.max(this.currentStep - 1, 0);
    }

    saveTenant() {
        this.stepSubmitted = [true, true, true];
        if (!this.isWizardValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa los campos',
                detail: 'Completa la información obligatoria antes de continuar.'
            });
            return;
        }

        this.tenantService.save(this.form);
        this.messageService.add({
            severity: 'success',
            summary: 'Listo',
            detail: this.form.id ? 'Academia actualizada' : 'Academia creada'
        });
        this.router.navigate(['/tenants']);
    }

    showError(field: string): boolean {
        return this.stepSubmitted[this.currentStep] && !this.isFieldValid(field);
    }

    isStepDone(stepIndex: number): boolean {
        return stepIndex < this.currentStep && this.isStepValid(stepIndex);
    }

    onAcademyNameInput(event: Event) {
        this.form.name = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onAdminNameInput(event: Event) {
        this.form.adminName = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onTeamNameInput(event: Event) {
        this.form.teamName = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onAddressInput(event: Event) {
        this.form.address = this.sanitizeAddressInput((event.target as HTMLInputElement).value);
    }

    onPhoneInput(event: Event) {
        this.form.phoneNumber = this.sanitizePhoneInput((event.target as HTMLInputElement).value);
    }

    onEmailInput(field: 'contactEmail' | 'adminEmail') {
        this.form[field] = this.sanitizeEmailInput(this.form[field]);
    }

    onLocationCountryChange() {
        this.form.department = '';
        this.form.city = '';
    }

    onPhoneCountryCodeChange() {}

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
        const sanitizedText = this.sanitizeAddressInput(pastedText);
        if (pastedText !== sanitizedText) {
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
        const sanitizedText = this.sanitizeEmailInput(pastedText);
        if (pastedText !== sanitizedText) {
            event.preventDefault();
        }
    }

    private isWizardValid(): boolean {
        return this.wizardSteps.every((_, index) => this.isStepValid(index));
    }

    private isStepValid(stepIndex: number): boolean {
        return this.wizardSteps[stepIndex].fields.every((field) => this.isFieldValid(field));
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
            case 'adminName':
                return this.hasValidText(this.form.adminName, 2);
            case 'adminEmail':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.adminEmail.trim());
            case 'categoryId':
                return !!this.form.categoryId.trim();
            case 'teamName':
                return this.hasValidText(this.form.teamName, 2);
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

    private emptyForm(): TenantForm {
        return {
            name: '',
            contactEmail: '',
            phone: '',
            countryCode: '+57',
            country: 'Colombia',
            department: '',
            city: '',
            address: '',
            phoneNumber: '',
            adminName: '',
            adminEmail: '',
            categoryId: '',
            teamName: ''
        };
    }

    private syncHeaderState() {
        this.headerBreadcrumbs = [
            { label: 'Inicio', routerLink: '/' },
            { label: 'Academias', routerLink: '/tenants' },
            { label: this.form.id ? 'Editar academia' : 'Nueva academia' }
        ];
    }
}
