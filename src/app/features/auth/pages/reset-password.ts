import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, MessageModule, PasswordModule, RouterModule],
    template: `
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-6 dark:bg-none dark:bg-surface-950 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center">
                <div class="w-full min-w-0 max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_90px_-28px_rgba(15,23,42,0.24)] dark:border-surface-800 dark:bg-surface-900">
                    <div class="min-w-0 px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
                        <div class="mb-6 text-center sm:mb-7">
                            <p class="hidden text-sm font-medium uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400 sm:block">Nueva contraseña</p>
                            <h1 class="mt-1 text-[clamp(1.55rem,6vw,1.9rem)] font-semibold tracking-tight text-surface-900 dark:text-surface-0">Restablecer contraseña</h1>
                            <p class="mx-auto mt-2 max-w-[24rem] text-sm leading-6 text-slate-600 dark:text-slate-300 sm:max-w-xl">Define una nueva contraseña para volver a ingresar con seguridad.</p>
                        </div>

                        @if (apiMessage) {
                            <div class="mb-6">
                                <p-message [severity]="apiMessage.severity" [text]="apiMessage.text" [closable]="false" />
                            </div>
                        }

                        <div class="space-y-5 sm:space-y-6">
                            <div class="flex flex-col gap-2">
                                <label for="password" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nueva contraseña</label>
                                <p-password
                                    inputId="password"
                                    [(ngModel)]="password"
                                    name="password"
                                    placeholder="Ingresa tu nueva contraseña"
                                    styleClass="w-full"
                                    inputStyleClass="w-full"
                                    [toggleMask]="true"
                                    [feedback]="false"
                                />
                                @if (showPasswordError()) {
                                    <p-message severity="error" size="small">La contraseña debe tener al menos 8 caracteres.</p-message>
                                }
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="passwordConfirmation" class="text-sm font-medium text-surface-700 dark:text-surface-200">Confirmar contraseña</label>
                                <p-password
                                    inputId="passwordConfirmation"
                                    [(ngModel)]="passwordConfirmation"
                                    name="passwordConfirmation"
                                    placeholder="Repite la nueva contraseña"
                                    styleClass="w-full"
                                    inputStyleClass="w-full"
                                    [toggleMask]="true"
                                    [feedback]="false"
                                />
                                @if (showPasswordConfirmationError()) {
                                    <p-message severity="error" size="small">Debes confirmar la contraseña.</p-message>
                                }
                                @if (showPasswordMismatchError()) {
                                    <p-message severity="error" size="small">Las contraseñas deben coincidir.</p-message>
                                }
                            </div>

                            <div class="pt-1">
                                <p-button label="Guardar nueva contraseña" styleClass="w-full" type="button" (onClick)="submit()" />
                            </div>
                        </div>

                        <div class="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600 dark:border-surface-800 dark:text-slate-300 sm:mt-7 sm:pt-6">
                            <a routerLink="/auth/login" class="font-medium text-sky-700 hover:underline dark:text-sky-400">Volver al ingreso</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ResetPassword {
    password = '';
    passwordConfirmation = '';
    token = '';
    submitted = false;

    apiMessage: { severity: 'success' | 'info' | 'warn' | 'error'; text: string } | null = null;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

        if (!this.token) {
            this.apiMessage = {
                severity: 'error',
                text: 'El enlace no es válido. Solicita uno nuevo para continuar.'
            };
        }
    }

    submit() {
        this.submitted = true;

        if (!this.token) {
            this.apiMessage = {
                severity: 'error',
                text: 'El enlace no es válido. Solicita uno nuevo para continuar.'
            };
            return;
        }

        if (this.showPasswordError() || this.showPasswordConfirmationError() || this.showPasswordMismatchError()) {
            this.apiMessage = {
                severity: 'error',
                text: 'Revisa la nueva contraseña antes de continuar.'
            };
            return;
        }

        if (['invalid-token', 'expired-token'].includes(this.token)) {
            this.apiMessage = {
                severity: 'error',
                text: 'El enlace ya no es válido o expiró. Solicita uno nuevo.'
            };
            return;
        }

        this.apiMessage = {
            severity: 'success',
            text: 'Tu contraseña fue actualizada. Ahora puedes ingresar con la nueva clave.'
        };

        setTimeout(() => {
            void this.router.navigate(['/auth/login']);
        }, 1200);
    }

    showPasswordError(): boolean {
        return this.submitted && this.password.trim().length < 8;
    }

    showPasswordConfirmationError(): boolean {
        return this.submitted && !this.passwordConfirmation.trim();
    }

    showPasswordMismatchError(): boolean {
        return this.submitted && !!this.passwordConfirmation.trim() && this.password !== this.passwordConfirmation;
    }
}
