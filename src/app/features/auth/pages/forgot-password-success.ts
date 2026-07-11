import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';

type ForgotPasswordSuccessState = {
    email?: string;
};

@Component({
    selector: 'app-forgot-password-success',
    standalone: true,
    imports: [AppFloatingConfigurator, ButtonModule, CardModule, CommonModule, DividerModule, RouterModule],
    template: `
        <app-floating-configurator />
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 dark:bg-none dark:bg-surface-950 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center">
                <div class="w-full rounded-[2rem] border border-slate-200 bg-white px-5 py-8 shadow-[0_28px_90px_-28px_rgba(15,23,42,0.22)] dark:border-surface-800 dark:bg-surface-900 sm:px-10 sm:py-12">
                    <div class="mx-auto flex max-w-xl flex-col items-center text-center">
                        <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-600 shadow-[0_10px_30px_-18px_rgba(14,165,233,0.65)] dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300 sm:mb-6 sm:h-20 sm:w-20">
                            <i class="pi pi-envelope text-2xl"></i>
                        </div>

                        <p class="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 sm:text-sm sm:tracking-[0.28em]">Solicitud enviada</p>
                        <h1 class="mt-3 text-[clamp(1.65rem,6vw,2.25rem)] font-semibold tracking-tight text-surface-900 dark:text-surface-0">Revisa tu correo</h1>
                        <p class="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">Te enviamos los pasos para crear una nueva contraseña.</p>

                        <p-card class="mt-7 w-full text-left sm:mt-8" styleClass="border border-slate-200 shadow-sm dark:border-surface-800">
                            <ng-template pTemplate="content">
                                <div class="space-y-5">
                                    <div class="flex items-start gap-3">
                                        <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
                                            <i class="pi pi-at"></i>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Correo</p>
                                            <p class="font-medium text-surface-900 dark:text-surface-0">{{ email }}</p>
                                        </div>
                                    </div>

                                    <p-divider />

                                    <div class="flex items-start gap-3">
                                        <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300">
                                            <i class="pi pi-clock"></i>
                                        </span>
                                        <div class="min-w-0">
                                            <p class="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Siguiente paso</p>
                                            <p class="font-medium text-surface-900 dark:text-surface-0">Abre el mensaje y sigue las instrucciones.</p>
                                        </div>
                                    </div>
                                </div>
                            </ng-template>
                        </p-card>

                        <div class="mt-7 flex w-full flex-col items-center gap-3 sm:mt-8">
                            <p-button label="Volver al ingreso" styleClass="w-full sm:w-auto" routerLink="/auth/login" />
                            <a routerLink="/auth/forgot-password" class="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400">Enviar a otro correo</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ForgotPasswordSuccess {
    email = 'tenant.demo@example.com';

    constructor(private router: Router) {
        const state = this.router.getCurrentNavigation()?.extras.state as ForgotPasswordSuccessState | undefined;
        if (state?.email) {
            this.email = state.email;
        }
    }
}
