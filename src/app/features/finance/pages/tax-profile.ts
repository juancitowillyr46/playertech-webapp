import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { AcademyProfileService } from '../../academy/data-access/academy-profile.service';
import { AcademyTaxProfile, AcademyTaxProfileUpdateRequest } from '../../academy/models/academy.model';

interface SelectOption {
    label: string;
    value: string;
}

@Component({
    selector: 'app-finance-tax-profile-page',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, InputTextModule, MessageModule, PageHeader, RouterModule, SelectModule, SkeletonModule, TabsModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="space-y-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
            <app-page-header [breadcrumbs]="breadcrumbs" title="Datos fiscales" subtitle="Completa la información tributaria de la academia para emitir facturas electrónicas."></app-page-header>

            <div
                class="mx-auto mt-4 w-full space-y-3 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0"
                [class.content-width-compact]="activeTab() === 'tax-profile'"
            >
                <div class="overflow-hidden rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                <p-tabs [value]="activeTab()">
                    <p-tablist class="overflow-x-auto">
                        <p-tab value="tax-profile" (click)="activeTab.set('tax-profile')">
                            <span class="inline-flex items-center gap-2 whitespace-nowrap">
                                <i class="pi pi-file-edit text-sm"></i>
                                <span>Información fiscal</span>
                            </span>
                        </p-tab>
                    </p-tablist>

                    <p-tabpanels>
                        <p-tabpanel value="tax-profile">
                            <div class="space-y-4 p-3 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:p-4 sm:pb-4">
                                @if (loadError()) {
                                    <div class="rounded-[0.75rem] border border-rose-200 bg-rose-50 p-5 text-rose-900 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-100">
                                        <p class="m-0 text-base font-semibold">No pudimos cargar la información fiscal</p>
                                        <p class="mt-1 text-sm leading-6">{{ loadError() }}</p>
                                        <div class="mt-4">
                                            <p-button label="Reintentar" severity="danger" outlined styleClass="w-full sm:w-auto" [loading]="loading()" loadingIcon="pi pi-spinner pi-spin" (onClick)="loadTaxProfile()" />
                                        </div>
                                    </div>
                                } @else if (loading()) {
                                    <div class="space-y-5 p-1">
                                        <div class="space-y-3">
                                            <p-skeleton width="10rem" height="1.1rem"></p-skeleton>
                                            <p-skeleton width="22rem" height="0.9rem"></p-skeleton>
                                        </div>
                                        <div class="grid gap-3 md:grid-cols-3">
                                            <p-skeleton height="6rem"></p-skeleton>
                                            <p-skeleton height="6rem"></p-skeleton>
                                            <p-skeleton height="6rem"></p-skeleton>
                                        </div>
                                        <div class="grid grid-cols-12 gap-4">
                                            <div class="col-span-12">
                                                <p-skeleton width="11rem" height="1rem"></p-skeleton>
                                                <p-skeleton class="mt-2" height="0.9rem"></p-skeleton>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <p-skeleton height="2.75rem"></p-skeleton>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <p-skeleton height="2.75rem"></p-skeleton>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <p-skeleton height="2.75rem"></p-skeleton>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <p-skeleton height="2.75rem"></p-skeleton>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <p-skeleton height="2.75rem"></p-skeleton>
                                            </div>
                                            <div class="col-span-12 md:col-span-6">
                                                <p-skeleton height="2.75rem"></p-skeleton>
                                            </div>
                                        </div>
                                        <div class="flex justify-end gap-2">
                                            <p-skeleton width="7rem" height="2.5rem"></p-skeleton>
                                            <p-skeleton width="9rem" height="2.5rem"></p-skeleton>
                                        </div>
                                    </div>
                                } @else {
                                    <div class="grid grid-cols-12 gap-4">
                                        <div class="col-span-12">
                                            <div class="space-y-1">
                                                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Información fiscal</p>
                                                <p class="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">Mantén estos datos alineados con tu RUT y tu correo de facturación.</p>
                                            </div>
                                        </div>

                                        <div class="col-span-12 grid grid-cols-12 gap-4">
                                            <div class="col-span-12 flex flex-col gap-2">
                                                <label for="legalName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Razón social <span class="text-rose-500">*</span></label>
                                                <input pInputText id="legalName" type="text" [(ngModel)]="form.legalName" placeholder="Ej. Academia PlayerTech Demo SAS" class="w-full" />
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="taxIdType" class="text-sm font-medium text-surface-700 dark:text-surface-200">Tipo de identificación <span class="text-rose-500">*</span></label>
                                                <p-select id="taxIdType" [(ngModel)]="form.taxIdType" [options]="taxIdTypeOptions" optionLabel="label" optionValue="value" placeholder="Selecciona un tipo" class="w-full" appendTo="body" />
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="taxIdNumber" class="text-sm font-medium text-surface-700 dark:text-surface-200">Número de identificación <span class="text-rose-500">*</span></label>
                                                <input pInputText id="taxIdNumber" type="text" [(ngModel)]="form.taxIdNumber" placeholder="Ej. 901234567" class="w-full" />
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="taxCheckDigit" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dígito de verificación <span class="text-slate-400">(opcional)</span></label>
                                                <input pInputText id="taxCheckDigit" type="text" [(ngModel)]="form.taxCheckDigit" placeholder="Ej. 8" class="w-full" />
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="taxRegime" class="text-sm font-medium text-surface-700 dark:text-surface-200">Régimen fiscal <span class="text-rose-500">*</span></label>
                                                <p-select id="taxRegime" [(ngModel)]="form.taxRegime" [options]="taxRegimeOptions" optionLabel="label" optionValue="value" placeholder="Selecciona un régimen" class="w-full" appendTo="body" />
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="billingEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo para facturación <span class="text-rose-500">*</span></label>
                                                <input pInputText id="billingEmail" type="email" [(ngModel)]="form.billingEmail" placeholder="Ej. facturacion@academia.com" class="w-full" />
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="fiscalCountry" class="text-sm font-medium text-surface-700 dark:text-surface-200">País</label>
                                                <input pInputText id="fiscalCountry" type="text" [(ngModel)]="form.fiscalCountry" placeholder="Ej. Colombia" class="w-full" />
                                            </div>

                                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                                <label for="fiscalCity" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad</label>
                                                <input pInputText id="fiscalCity" type="text" [(ngModel)]="form.fiscalCity" placeholder="Ej. Pereira" class="w-full" />
                                            </div>

                                            <div class="col-span-12 flex flex-col gap-2">
                                                <label for="fiscalAddress" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección fiscal</label>
                                                <input pInputText id="fiscalAddress" type="text" [(ngModel)]="form.fiscalAddress" placeholder="Ej. Calle 10 # 20-30" class="w-full" />
                                            </div>
                                        </div>

                                        <div class="col-span-12 border-t border-slate-200 pt-4 dark:border-surface-800">
                                            <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                                <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" routerLink="/finance" />
                                                <p-button label="Guardar cambios" icon="pi pi-check" styleClass="w-full sm:w-auto" [loading]="saving()" loadingIcon="pi pi-spinner pi-spin" [disabled]="saving()" (onClick)="save()" />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </p-tabpanel>

                    </p-tabpanels>
                </p-tabs>
                </div>
            </div>
        </div>
    `
})
export class FinanceTaxProfilePage implements OnInit {
    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Datos fiscales' }, { label: 'Información fiscal' }];

    readonly activeTab = signal<'tax-profile'>('tax-profile');
    readonly loading = signal(true);
    readonly saving = signal(false);
    readonly loadError = signal<string | null>(null);
    form: AcademyTaxProfile = this.emptyForm();

    readonly taxIdTypeOptions: SelectOption[] = [
        { label: 'NIT', value: 'NIT' },
        { label: 'Cédula', value: 'CC' },
        { label: 'RUT', value: 'RUT' },
        { label: 'Otro', value: 'OTHER' }
    ];

    readonly taxRegimeOptions: SelectOption[] = [
        { label: 'Responsable de IVA', value: 'RESPONSABLE_IVA' },
        { label: 'No responsable de IVA', value: 'NO_RESPONSABLE_IVA' },
        { label: 'Régimen simple', value: 'REGIMEN_SIMPLE' },
        { label: 'Otro', value: 'OTHER' }
    ];

    constructor(
        private readonly academyProfileService: AcademyProfileService,
        private readonly messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.loadTaxProfile();
    }

    loadTaxProfile(): void {
        this.loading.set(true);
        this.loadError.set(null);

        this.academyProfileService
            .loadCurrentTaxProfile()
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: (taxProfile) => {
                    this.form = taxProfile ?? this.academyProfileService.getCurrentTaxProfile() ?? this.emptyForm();
                },
                error: (error: AuthErrorLike) => {
                    this.loadError.set(this.resolveMessage(error, 'No pudimos cargar la información fiscal.'));
                }
            });
    }

    save(): void {
        if (this.saving()) {
            return;
        }

        this.saving.set(true);
        this.academyProfileService
            .updateCurrentTaxProfile(this.buildPayload())
            .pipe(finalize(() => this.saving.set(false)))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Información fiscal actualizada', detail: 'Los cambios quedaron guardados correctamente.' });
                },
                error: (error: AuthErrorLike) => {
                    this.messageService.add({ severity: 'error', summary: 'No pudimos guardar los cambios', detail: this.resolveMessage(error, 'Intenta nuevamente en unos segundos.') });
                }
            });
    }

    private buildPayload(): AcademyTaxProfileUpdateRequest {
        return {
            taxIdType: this.form.taxIdType,
            taxIdNumber: this.form.taxIdNumber,
            taxCheckDigit: this.form.taxCheckDigit || undefined,
            taxRegime: this.form.taxRegime,
            billingEmail: this.form.billingEmail
        };
    }

    private emptyForm(): AcademyTaxProfile {
        return {
            legalName: '',
            taxIdType: '',
            taxIdNumber: '',
            taxCheckDigit: '',
            taxRegime: '',
            billingEmail: '',
            fiscalAddress: '',
            fiscalCity: '',
            fiscalCountry: ''
        };
    }

    private resolveMessage(error: AuthErrorLike, fallback: string): string {
        return error.detail || error.message || fallback;
    }
}
