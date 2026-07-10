import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, CommonModule, FormsModule, InputTextModule, MessageModule, PasswordModule, RouterModule],
    template: `
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-6 dark:bg-none dark:bg-surface-950 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl items-center">
                <div class="grid w-full min-w-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_90px_-28px_rgba(15,23,42,0.24)] dark:border-surface-800 dark:bg-surface-900 lg:grid-cols-[0.95fr_1.05fr]">
                    <div class="relative hidden overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_100%)] px-5 py-6 text-slate-900 dark:border-surface-800 dark:bg-slate-950 dark:text-white lg:block lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
                        <div class="absolute inset-0 opacity-90">
                            <div class="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.58),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.08),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.06),_transparent_24%)] dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.90),_rgba(15,23,42,0.72))]"></div>
                            <div class="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(99,102,241,0.07)_95%),linear-gradient(90deg,transparent_95%,rgba(99,102,241,0.07)_95%)] bg-[size:100%_64px,64px_100%] dark:bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.04)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.04)_95%)]"></div>
                        </div>

                        <div class="relative flex min-h-0 h-full flex-col justify-center lg:min-h-[28rem]">
                            <div class="mx-auto flex max-w-xl flex-col items-center text-center">
                                <h1 class="mt-4 text-[2.45rem] font-semibold leading-tight text-slate-900 dark:text-white">Ingresa a tu academia</h1>
                                <p class="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-white/70">Usa tus datos para seguir trabajando.</p>
                            </div>
                        </div>
                    </div>

                    <div class="min-w-0 px-5 py-6 sm:px-6 sm:py-7 lg:px-10 lg:py-10">
                        <div class="mb-7 text-center sm:text-left">
                            <p class="text-sm font-medium uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">Inicio de sesión</p>
                            <h2 class="mt-2 text-[1.9rem] font-semibold tracking-tight text-surface-900 dark:text-surface-0">Bienvenido de nuevo</h2>
                            <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">Ingresa con tu correo y contraseña para continuar.</p>
                        </div>

                        <div class="space-y-6">
                            <div class="flex flex-col gap-2">
                                <label for="email1" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo electrónico</label>
                                <input pInputText id="email1" type="text" placeholder="Ej. admin@academia.com" class="w-full" [(ngModel)]="email" name="email" (blur)="markTouched('email')" />
                                @if (showError('email')) {
                                    <p-message severity="error" size="small">Escribe un correo válido.</p-message>
                                }
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="password1" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contraseña</label>
                                <p-password id="password1" [(ngModel)]="password" name="password" placeholder="Ingresa tu contraseña" [toggleMask]="true" [fluid]="true" [feedback]="false" (onBlur)="markTouched('password')"></p-password>
                                @if (showError('password')) {
                                    <p-message severity="error" size="small">Ingresa tu contraseña.</p-message>
                                }
                            </div>

                            <div class="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                                <div class="flex items-center gap-2">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary name="rememberme"></p-checkbox>
                                    <label for="rememberme1" class="text-slate-600 dark:text-slate-300">Recordarme</label>
                                </div>
                                <span class="cursor-pointer font-medium text-sky-700 hover:underline dark:text-sky-400">Recuperar contraseña</span>
                            </div>

                            <div class="pt-1">
                                <p-button label="Ingresar" styleClass="w-full" type="button" (onClick)="submit()" />
                            </div>
                        </div>

                        <div class="mt-7 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-surface-800 dark:text-slate-300">
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

    submitted = false;

    touched: Record<string, boolean> = {};

    constructor(private router: Router) {}

    markTouched(field: string) {
        this.touched[field] = true;
    }

    showError(field: string): boolean {
        return (this.submitted || this.touched[field]) && !this.isFieldValid(field);
    }

    submit() {
        this.submitted = true;

        if (!this.isFieldValid('email') || !this.isFieldValid('password')) {
            return;
        }

        void this.router.navigate(['/']);
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
}
