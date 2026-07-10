import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, FluidModule, FormsModule, InputTextModule, PasswordModule, RouterModule, SelectModule, TextareaModule],
    template: `
        <div class="min-h-screen px-4 py-8 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_42%),linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] dark:bg-none dark:bg-surface-950">
            <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
                <div class="grid w-full overflow-hidden rounded-[2rem] border border-surface-200 bg-surface-0 shadow-2xl dark:border-surface-800 dark:bg-surface-900 md:grid-cols-[1fr_1.15fr]">
                    <div class="relative overflow-hidden bg-slate-950 px-8 py-10 text-white sm:px-12">
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_32%)]"></div>
                        <div class="relative flex h-full flex-col justify-between gap-12">
                            <div>
                                <div class="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                    <span class="text-lg font-semibold">PT</span>
                                </div>
                                <p class="text-sm uppercase tracking-[0.32em] text-cyan-200/80">Tenant Signup</p>
                                <h1 class="mt-4 max-w-sm text-4xl font-semibold leading-tight">Crea tu academia con un formulario limpio y directo.</h1>
                                <p class="mt-4 max-w-md text-sm leading-6 text-slate-300">Usamos el contrato real del backend, pero lo presentamos con una estructura simple para validar la UX antes de conectar servicios.</p>
                            </div>

                            <div class="grid gap-3 text-sm text-slate-300">
                                <div class="flex items-center gap-3">
                                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">1</span>
                                    <span>Datos de la academia y contacto principal.</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">2</span>
                                    <span>Ubicación, categoría inicial y equipo base.</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">3</span>
                                    <span>Preparado para iterar a un onboarding guiado.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="px-6 py-8 sm:px-8 lg:px-10">
                        <div class="mb-8">
                            <p class="text-sm font-medium uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400">Sign Up</p>
                            <h2 class="mt-2 text-3xl font-semibold text-surface-900 dark:text-surface-0">Registrar nueva academia</h2>
                            <p class="mt-2 text-sm text-muted-color">Completa los datos básicos para crear el tenant inicial.</p>
                        </div>

                        <p-fluid>
                            <div class="grid gap-6">
                                <div class="grid gap-4 md:grid-cols-2">
                                    <div class="flex flex-col gap-2 md:col-span-2">
                                        <label for="academyName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre de la academia</label>
                                        <input pInputText id="academyName" type="text" [(ngModel)]="form.name" placeholder="Academia PlayerTech Demo" class="w-full" />
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <label for="contactName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del contacto</label>
                                        <input pInputText id="contactName" type="text" [(ngModel)]="form.contactName" placeholder="Juan Perez" class="w-full" />
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <label for="contactEmail" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo de contacto</label>
                                        <input pInputText id="contactEmail" type="email" [(ngModel)]="form.contactEmail" placeholder="tenant.demo@example.com" class="w-full" />
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <label for="password" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contraseña</label>
                                        <p-password id="password" [(ngModel)]="form.password" placeholder="Crear contraseña" [toggleMask]="true" [fluid]="true" [feedback]="false"></p-password>
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <label for="phone" class="text-sm font-medium text-surface-700 dark:text-surface-200">Teléfono</label>
                                        <input pInputText id="phone" type="text" [(ngModel)]="form.phone" placeholder="+51 987 654 321" class="w-full" />
                                    </div>

                                    <div class="flex flex-col gap-2 md:col-span-2">
                                        <label for="address" class="text-sm font-medium text-surface-700 dark:text-surface-200">Dirección</label>
                                        <textarea pTextarea id="address" rows="3" [(ngModel)]="form.address" placeholder="Jr. Secundario 789" class="w-full"></textarea>
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <label for="city" class="text-sm font-medium text-surface-700 dark:text-surface-200">Ciudad</label>
                                        <input pInputText id="city" type="text" [(ngModel)]="form.city" placeholder="Arequipa" class="w-full" />
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <label for="categoryId" class="text-sm font-medium text-surface-700 dark:text-surface-200">Categoría inicial</label>
                                        <p-select id="categoryId" [(ngModel)]="form.categoryId" [options]="categories" optionLabel="name" optionValue="id" placeholder="Seleccionar categoría" class="w-full"></p-select>
                                    </div>

                                    <div class="flex flex-col gap-2 md:col-span-2">
                                        <label for="teamName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre del primer equipo</label>
                                        <input pInputText id="teamName" type="text" [(ngModel)]="form.teamName" placeholder="Sub 12 A" class="w-full" />
                                    </div>

                                    <div class="flex items-start gap-3 md:col-span-2">
                                        <p-checkbox [(ngModel)]="accepted" inputId="terms" binary></p-checkbox>
                                        <label for="terms" class="text-sm leading-6 text-muted-color">Acepto usar una cuenta de prueba/mock para esta iteración visual mientras se valida el flujo de onboarding.</label>
                                    </div>
                                </div>

                                <div class="flex flex-col gap-3 sm:flex-row">
                                    <p-button label="Crear academia" styleClass="w-full sm:w-auto" />
                                    <p-button label="Ya tengo cuenta" severity="secondary" styleClass="w-full sm:w-auto" routerLink="/auth/login" />
                                </div>

                                <div class="rounded-2xl border border-dashed border-surface-200 bg-surface-50 p-4 text-sm text-muted-color dark:border-surface-800 dark:bg-surface-950">
                                    Datos esperados por el backend: nombre, correo de contacto, nombre de contacto, contraseña, teléfono, dirección, ciudad, categoría inicial y nombre del equipo.
                                </div>
                            </div>
                        </p-fluid>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Signup {
    form = {
        name: 'Academia PlayerTech Demo',
        contactEmail: 'tenant.demo@example.com',
        contactName: 'Juan Perez',
        password: 'secret12345',
        phone: '+51 987 654 321',
        address: 'Jr. Secundario 789',
        city: 'Arequipa',
        categoryId: 'cat-sub-12',
        teamName: 'Sub 12 A'
    };

    accepted = true;

    categories = [
        { id: 'cat-sub-10', name: 'Sub 10' },
        { id: 'cat-sub-12', name: 'Sub 12' },
        { id: 'cat-sub-14', name: 'Sub 14' }
    ];
}
