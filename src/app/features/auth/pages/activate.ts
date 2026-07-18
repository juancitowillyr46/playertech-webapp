import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { AuthAccessService } from '../data-access/auth-access.service';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';

@Component({
    selector: 'app-activate',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, MessageModule, PasswordModule, RouterModule],
    template: `
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.10),_transparent_24%),linear-gradient(180deg,_#f8faf7_0%,_#eef4f1_100%)] px-4 py-6 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl items-center justify-center">
                <div class="w-full overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-[0_30px_90px_-30px_rgba(15,23,42,0.24)]">
                    <div class="grid lg:grid-cols-[0.95fr_1.05fr]">
                        <div class="bg-[linear-gradient(165deg,_#0f172a_0%,_#0f3d3a_48%,_#114f46_100%)] px-6 py-7 text-white sm:px-8 sm:py-10">
                            <p class="text-xs uppercase tracking-[0.35em] text-emerald-100/80">Activación pública</p>
                            <h1 class="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Confirma tu correo para terminar el alta de la academia.</h1>
                            <p class="mt-4 max-w-md text-sm leading-6 text-emerald-50/85">El enlace de activación valida que tú controlas el correo registrado y deja lista la cuenta para el primer ingreso.</p>
                            <div class="mt-8 grid gap-3">
                                <div class="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                                    <p class="text-xs uppercase tracking-[0.22em] text-emerald-100/75">Paso 1</p>
                                    <p class="mt-2 text-sm font-medium">Crea tu contraseña</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                                    <p class="text-xs uppercase tracking-[0.22em] text-emerald-100/75">Paso 2</p>
                                    <p class="mt-2 text-sm font-medium">Accede a la academia</p>
                                </div>
                            </div>
                        </div>

                        <div class="px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
                            <div class="mb-6 border-b border-slate-200 pb-5">
                                <p class="text-xs uppercase tracking-[0.28em] text-slate-500">Activar acceso</p>
                                <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Define tu contraseña</h2>
                                <p class="mt-2 text-sm leading-6 text-slate-600">Si el token no es válido o ya expiró, te mostraremos el motivo y no completarás el acceso.</p>
                            </div>

                            @if (apiMessage) {
                                <div class="mb-5">
                                    <p-message [severity]="apiMessage.severity" [text]="apiMessage.text" [closable]="false" />
                                </div>
                            }

                            <form class="space-y-5" (ngSubmit)="submit()">
                                <div class="flex flex-col gap-2">
                                    <label for="password" class="text-sm font-medium text-slate-700">Password</label>
                                    <p-password inputId="password" [(ngModel)]="password" name="password" placeholder="Crea una contraseña" styleClass="w-full" inputStyleClass="w-full" [toggleMask]="true" [feedback]="false" />
                                    @if (showPasswordError()) {
                                        <p-message severity="error" size="small">La contraseña debe tener al menos 8 caracteres.</p-message>
                                    }
                                </div>

                                <div class="flex flex-col gap-2">
                                    <label for="passwordConfirmation" class="text-sm font-medium text-slate-700">Confirmar password</label>
                                    <p-password inputId="passwordConfirmation" [(ngModel)]="passwordConfirmation" name="passwordConfirmation" placeholder="Repite la contraseña" styleClass="w-full" inputStyleClass="w-full" [toggleMask]="true" [feedback]="false" />
                                    @if (showPasswordConfirmationError()) {
                                        <p-message severity="error" size="small">Debes confirmar la contraseña.</p-message>
                                    }
                                    @if (showPasswordMismatchError()) {
                                        <p-message severity="error" size="small">Las contraseñas no coinciden.</p-message>
                                    }
                                </div>

                                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                                    Esta pantalla solo completa la activación. Primero el signup crea la academia y luego este enlace confirma tu acceso.
                                </div>

                                <p-button label="Activar cuenta" styleClass="w-full" type="submit" [loading]="loading" [disabled]="loading" />
                            </form>

                            <div class="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600">
                                <a routerLink="/auth/login" class="font-medium text-emerald-700 hover:underline">Volver al ingreso</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ActivateUser {
    password = '';
    passwordConfirmation = '';
    token = '';
    submitted = false;
    loading = false;
    apiMessage: { severity: 'success' | 'info' | 'warn' | 'error'; text: string } | null = null;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly auth: AuthAccessService
    ) {
        this.token = this.route.snapshot.paramMap.get('token') ?? this.route.snapshot.queryParamMap.get('token') ?? '';
        if (!this.token) {
            this.apiMessage = {
                severity: 'error',
                text: 'El enlace no es válido. Solicita uno nuevo para continuar.'
            };
        }
    }

    async submit() {
        this.submitted = true;
        this.apiMessage = null;

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
                text: 'Revisa la contraseña antes de continuar.'
            };
            return;
        }

        this.loading = true;

        try {
            await firstValueFrom(
                this.auth.activateTenant(this.token, {
                    password: this.password,
                    passwordConfirmation: this.passwordConfirmation
                })
            );

            this.apiMessage = {
                severity: 'success',
                text: 'Tu cuenta fue activada. Ya puedes iniciar sesión.'
            };

            setTimeout(() => {
                void this.router.navigate(['/auth/login']);
            }, 1200);
        } catch (error) {
            this.apiMessage = {
                severity: 'error',
                text: this.getTokenErrorMessage(error as AuthErrorLike | undefined)
            };
        } finally {
            this.loading = false;
        }
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

    private getTokenErrorMessage(error?: AuthErrorLike): string {
        if (error?.status === 400 || error?.status === 401 || error?.status === 404) {
            return 'El enlace ya no es válido o expiró. Solicita uno nuevo.';
        }

        return 'No fue posible activar la cuenta. Intenta nuevamente.';
    }
}
