import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-reset-password-success',
    standalone: true,
    imports: [AppFloatingConfigurator, ButtonModule, CardModule, CommonModule, DividerModule, RouterModule],
    template: `
        <app-floating-configurator />
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-8 dark:bg-none dark:bg-surface-950 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center">
                <div class="w-full rounded-[2rem] border border-slate-200 bg-white px-5 py-8 shadow-[0_28px_90px_-28px_rgba(15,23,42,0.22)] dark:border-surface-800 dark:bg-surface-900 sm:px-10 sm:py-12">
                    <div class="mx-auto flex max-w-xl flex-col items-center text-center">
                        <div class="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_10px_30px_-18px_rgba(16,185,129,0.65)] dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300 sm:mb-6 sm:h-20 sm:w-20">
                            <i class="pi pi-check text-2xl"></i>
                        </div>

                        <p class="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400 sm:text-sm sm:tracking-[0.28em]">Contraseña actualizada</p>
                        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-surface-900 dark:text-surface-0 sm:text-4xl">Tu contraseña se cambió correctamente</h1>
                        <p class="mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">Ya puedes iniciar sesión con tu nueva contraseña.</p>

                        <p-card class="mt-7 w-full text-left sm:mt-8" styleClass="border border-slate-200 shadow-sm dark:border-surface-800">
                            <ng-template pTemplate="content">
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                                        <p class="text-[0.7rem] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Estado</p>
                                        <p class="max-w-[18rem] truncate text-right font-medium text-slate-900 dark:text-surface-0">Cambio confirmado</p>
                                    </div>

                                    <div class="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
                                        <p class="text-[0.7rem] uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Siguiente paso</p>
                                        <p class="max-w-[18rem] text-right font-medium text-slate-900 dark:text-surface-0">Ingresa con tu nueva contraseña</p>
                                    </div>
                                </div>
                            </ng-template>
                        </p-card>

                        <div class="mt-7 flex w-full flex-col items-center gap-3 sm:mt-8">
                            <p-button label="Ir a iniciar sesión" styleClass="w-full sm:w-auto" routerLink="/auth/login" />
                            <a routerLink="/landing" class="text-sm font-medium text-sky-700 hover:underline dark:text-sky-400">Volver al inicio</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ResetPasswordSuccess {}
