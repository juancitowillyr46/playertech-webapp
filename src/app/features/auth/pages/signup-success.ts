import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AuthAccessService } from '../data-access/auth-access.service';
import { TenantSignupSummary } from '@/app/core/auth/auth.models';

type SignupSuccessState = Partial<TenantSignupSummary>;

@Component({
    selector: 'app-signup-success',
    standalone: true,
    imports: [AppFloatingConfigurator, ButtonModule, CardModule, CommonModule, DividerModule, RouterModule],
    template: `
        <app-floating-configurator />
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(15,118,110,0.14),_transparent_36%),linear-gradient(180deg,_#f8faf7_0%,_#eef4f1_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center">
                <div class="w-full overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white px-6 py-10 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.22)] sm:px-10 sm:py-12">
                    <div class="mx-auto max-w-2xl text-center">
                        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_10px_30px_-18px_rgba(16,185,129,0.6)]">
                            <i class="pi pi-check text-2xl"></i>
                        </div>

                        <p class="text-xs uppercase tracking-[0.32em] text-slate-500">Cuenta creada</p>
                        <h1 class="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Tu academia ya está registrada</h1>
                        <p class="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
                            {{ activationEmailSent ? 'Enviamos el correo de activación. Revisa tu bandeja para completar el acceso.' : 'La creación fue exitosa. Revisa tu correo y confirma el enlace para completar el acceso.' }}
                        </p>

                        <p-card class="mt-8 block w-full text-left" styleClass="border border-slate-200 shadow-sm">
                            <ng-template pTemplate="content">
                                <div class="space-y-3">
                                    <div class="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                                        <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Academia</p>
                                        <p class="max-w-[18rem] text-right font-medium text-slate-900">{{ academyName }}</p>
                                    </div>
                                    <div class="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                                        <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Contacto</p>
                                        <p class="max-w-[18rem] text-right font-medium text-slate-900">{{ contactName }}</p>
                                    </div>
                                    <div class="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                                        <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Correo</p>
                                        <p class="max-w-[18rem] truncate text-right font-medium text-slate-900">{{ contactEmail }}</p>
                                    </div>
                                    <div class="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                                        <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Equipo inicial</p>
                                        <p class="max-w-[18rem] text-right font-medium text-slate-900">{{ teamName }}</p>
                                    </div>
                                </div>

                                <div class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
                                    {{ activationRequired ? 'La cuenta queda pendiente hasta confirmar el correo.' : 'La cuenta ya puede usarse, pero siempre recomendamos revisar el correo de activación.' }}
                                </div>
                            </ng-template>
                        </p-card>

                        <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <p-button label="Ir a iniciar sesión" routerLink="/auth/login" styleClass="w-full sm:w-auto" />
                            <p-button label="Volver al inicio" routerLink="/landing" severity="secondary" outlined styleClass="w-full sm:w-auto" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class SignupSuccess {
    academyName = 'Academia PlayerTech';
    contactEmail = 'contacto@academia.com';
    contactName = 'Contacto principal';
    teamName = 'Primer equipo';
    activationRequired = true;
    activationEmailSent = true;

    constructor(
        private readonly router: Router,
        private readonly auth: AuthAccessService
    ) {
        const state = this.router.getCurrentNavigation()?.extras.state as SignupSuccessState | undefined;
        const summary = state ?? this.auth.loadSignupSummary();

        if (summary) {
            this.academyName = summary.academyName || this.academyName;
            this.contactEmail = summary.contactEmail || this.contactEmail;
            this.contactName = summary.contactName || this.contactName;
            this.teamName = summary.teamName || this.teamName;
            this.activationRequired = summary.activationRequired ?? this.activationRequired;
            this.activationEmailSent = summary.activationEmailSent ?? this.activationEmailSent;
        }
    }
}
