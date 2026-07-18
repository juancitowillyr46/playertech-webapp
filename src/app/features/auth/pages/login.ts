import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';
import { AuthAccessService } from '../data-access/auth-access.service';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, CommonModule, FormsModule, InputTextModule, MessageModule, PasswordModule, RouterModule],
    template: `
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-6 dark:bg-none dark:bg-surface-950 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center">
                <div class="w-full min-w-0 max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_90px_-28px_rgba(15,23,42,0.24)] dark:border-surface-800 dark:bg-surface-900">
                    <div class="min-w-0 px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
                        <div class="mb-7 text-center">
                            <p class="text-sm font-medium uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">Inicio de sesión</p>
                            <h2 class="mt-2 text-[1.9rem] font-semibold tracking-tight text-surface-900 dark:text-surface-0">Bienvenido de nuevo</h2>
                            <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">Ingresa con tu correo y contraseña para continuar.</p>
                        </div>

                        @if (apiMessage) {
                            <div class="mb-6">
                                <p-message [severity]="apiMessage.severity" [text]="apiMessage.text" [closable]="false" />
                            </div>
                        }

                        <div class="space-y-6">
                            <div class="flex flex-col gap-2">
                                <label for="email1" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo electrónico</label>
                                <input
                                    pInputText
                                    id="email1"
                                    type="text"
                                    placeholder="Ej. admin@academia.com"
                                    class="w-full"
                                    [(ngModel)]="email"
                                    name="email"
                                    (keydown)="handleEmailKeydown($event)"
                                    (paste)="handleEmailPaste($event)"
                                />
                                @if (showError('email')) {
                                    <p-message severity="error" size="small">Escribe un correo válido.</p-message>
                                }
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="password1" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contraseña</label>
                                <p-password id="password1" [(ngModel)]="password" name="password" placeholder="Ingresa tu contraseña" [toggleMask]="true" [fluid]="true" [feedback]="false"></p-password>
                                @if (showError('password')) {
                                    <p-message severity="error" size="small">Ingresa tu contraseña.</p-message>
                                }
                            </div>

                            <div class="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center gap-2">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary name="rememberme"></p-checkbox>
                                    <label for="rememberme1" class="text-slate-600 dark:text-slate-300">Recordarme</label>
                                </div>
                                <a routerLink="/auth/forgot-password" class="cursor-pointer font-medium text-sky-700 hover:underline dark:text-sky-400">Olvidé mi contraseña</a>
                            </div>

                            <div class="pt-1">
                                <p-button label="Ingresar" styleClass="w-full" type="button" [loading]="loading" [disabled]="loading" (onClick)="submit()" />
                            </div>
                        </div>

                        <div class="mt-7 border-t border-slate-200 pt-6 text-center text-sm text-slate-600 dark:border-surface-800 dark:text-slate-300">
                            ¿No tienes una cuenta?
                            <a routerLink="/auth/signup" class="font-medium text-sky-700 hover:underline dark:text-sky-400">Crear academia</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    email: string = '';

    password: string = '';

    checked: boolean = false;

    apiMessage: { severity: 'success' | 'info' | 'warn' | 'error'; text: string } | null = null;

    submitted = false;

    loading = false;

    constructor(private router: Router, private auth: AuthAccessService) {}

    handleEmailKeydown(event: KeyboardEvent) {
        const allowedControlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];

        if (allowedControlKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
            return;
        }

        const allowedPattern = /^[a-zA-Z0-9@._%+\-]$/;

        if (!allowedPattern.test(event.key)) {
            event.preventDefault();
        }
    }

    handleEmailPaste(event: ClipboardEvent) {
        const pastedText = event.clipboardData?.getData('text') ?? '';
        const sanitizedText = pastedText.replace(/[^a-zA-Z0-9@._%+\-]/g, '');

        if (pastedText !== sanitizedText) {
            event.preventDefault();
            const input = event.target as HTMLInputElement | null;

            if (input) {
                const start = input.selectionStart ?? input.value.length;
                const end = input.selectionEnd ?? input.value.length;
                const nextValue = input.value.slice(0, start) + sanitizedText + input.value.slice(end);
                this.email = nextValue;
            }
        }
    }

    showError(field: string): boolean {
        return this.submitted && !this.isFieldValid(field);
    }

    async submit() {
        this.submitted = true;
        this.apiMessage = null;

        if (!this.isFieldValid('email') || !this.isFieldValid('password')) {
            this.apiMessage = {
                severity: 'error',
                text: 'Revisa los datos antes de continuar.'
            };
            return;
        }

        this.loading = true;

        try {
            const user = await firstValueFrom(this.auth.login({
                email: this.email.trim(),
                password: this.password
            }));

            const destination = this.auth.getHomeRoute();
            this.apiMessage = {
                severity: 'success',
                text: `Sesión iniciada para ${user.fullName}.`
            };
            void this.router.navigateByUrl(destination);
        } catch (error) {
            const authError = error as AuthErrorLike | undefined;
            this.apiMessage = {
                severity: 'error',
                text: this.getLoginErrorMessage(authError)
            };
        } finally {
            this.loading = false;
        }
    }

    private isFieldValid(field: string): boolean {
        switch (field) {
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
            case 'password':
                return this.password.trim().length >= 8;
            default:
                return true;
        }
    }

    private getLoginErrorMessage(error?: AuthErrorLike): string {
        if (error?.status === 401) {
            return 'Las credenciales no son válidas.';
        }

        if (error?.status === 423) {
            return 'Tu cuenta está bloqueada o pendiente de activación.';
        }

        return 'No fue posible iniciar sesión. Intenta nuevamente.';
    }
}
