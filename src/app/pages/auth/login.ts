import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule],
    template: `
        <div class="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_42%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 dark:bg-none dark:bg-surface-950">
            <div class="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-surface-200 bg-surface-0 shadow-2xl dark:border-surface-800 dark:bg-surface-900">
                <div class="grid md:grid-cols-2">
                    <div class="relative overflow-hidden bg-slate-950 px-8 py-10 text-white sm:px-12">
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.18),_transparent_32%)]"></div>
                        <div class="relative flex h-full flex-col justify-between gap-10">
                            <div>
                                <div class="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                    <span class="text-lg font-semibold">PT</span>
                                </div>
                                <p class="text-sm uppercase tracking-[0.32em] text-cyan-200/80">PlayerTech</p>
                                <h1 class="mt-4 max-w-sm text-4xl font-semibold leading-tight">Accede al panel de tu academia con una interfaz limpia y clara.</h1>
                                <p class="mt-4 max-w-md text-sm leading-6 text-slate-300">Esta primera iteración prioriza lectura, concentración y una experiencia visual liviana para el acceso.</p>
                            </div>

                            <div class="grid gap-3 text-sm text-slate-300">
                                <div class="flex items-center gap-3">
                                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">1</span>
                                    <span>Inicio de sesión rápido para usuarios administrativos.</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">2</span>
                                    <span>Separación clara entre acceso y navegación interna.</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">3</span>
                                    <span>Base visual lista para iterar sobre autenticación real.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-8 sm:px-10 sm:py-10">
                        <div class="mb-8">
                            <p class="text-sm font-medium uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">Sign In</p>
                            <h2 class="mt-2 text-3xl font-semibold text-surface-900 dark:text-surface-0">Bienvenido de nuevo</h2>
                            <p class="mt-2 text-sm text-muted-color">Ingresa para continuar con la administración de tu academia.</p>
                        </div>

                        <div class="space-y-5">
                            <div class="flex flex-col gap-2">
                                <label for="email1" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo electrónico</label>
                                <input pInputText id="email1" type="text" placeholder="admin@playertech.com" class="w-full" [(ngModel)]="email" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="password1" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contraseña</label>
                                <p-password id="password1" [(ngModel)]="password" placeholder="••••••••" [toggleMask]="true" [fluid]="true" [feedback]="false"></p-password>
                            </div>

                            <div class="flex items-center justify-between gap-4 text-sm">
                                <div class="flex items-center gap-2">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary></p-checkbox>
                                    <label for="rememberme1" class="text-muted-color">Recordarme</label>
                                </div>
                                <span class="cursor-pointer font-medium text-sky-700 hover:underline dark:text-sky-400">¿Olvidaste tu contraseña?</span>
                            </div>

                            <p-button label="Ingresar" styleClass="w-full" routerLink="/" />
                        </div>

                        <div class="mt-8 border-t border-surface-200 pt-6 text-sm text-muted-color dark:border-surface-800">
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
}
