import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { PageHeader, PageHeaderBreadcrumb } from '@/app/shared/ui/page-header/page-header';
import { ProfileService } from '../data-access/profile.service';
import { UserProfile } from '../models/profile.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, InputTextModule, MessageModule, PageHeader, RouterModule, ToastModule],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="space-y-4">
            <app-page-header [breadcrumbs]="breadcrumbs" title="Perfil" subtitle="Consulta tu información de acceso y actualiza tu nombre."></app-page-header>

            <div class="content-width-compact mx-auto mt-4 w-full space-y-3">
                <div class="rounded-[0.75rem] border border-slate-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900">
                    <div class="space-y-4 p-4">
                        <div class="grid grid-cols-12 gap-4">
                            <div class="col-span-12">
                                <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Información de acceso</p>
                                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Estos datos identifican tu cuenta dentro de la plataforma.</p>
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="fullName" class="text-sm font-medium text-surface-700 dark:text-surface-200">Nombre completo <span class="text-rose-500">*</span></label>
                                <input pInputText id="fullName" type="text" [(ngModel)]="editableFullName" name="fullName" placeholder="Ej. Juan Rodas" class="w-full" (keydown)="onRestrictedNameKeydown($event)" (paste)="onRestrictedNamePaste($event)" (input)="onFullNameInput($event)" />
                                @if (showError()) {
                                    <p-message severity="error" size="small">Ingresa tu nombre completo.</p-message>
                                }
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="email" class="text-sm font-medium text-surface-700 dark:text-surface-200">Correo electrónico</label>
                                <input pInputText id="email" type="text" [ngModel]="profile.email" name="email" class="w-full" [disabled]="true" />
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="primaryRole" class="text-sm font-medium text-surface-700 dark:text-surface-200">Rol principal</label>
                                <input pInputText id="primaryRole" type="text" [ngModel]="profile.primaryRoleLabel" name="primaryRole" class="w-full" [disabled]="true" />
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="status" class="text-sm font-medium text-surface-700 dark:text-surface-200">Estado</label>
                                <input pInputText id="status" type="text" [ngModel]="profile.statusLabel" name="status" class="w-full" [disabled]="true" />
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="roles" class="text-sm font-medium text-surface-700 dark:text-surface-200">Roles asociados</label>
                                <input pInputText id="roles" type="text" [ngModel]="profile.roles.join(', ')" name="roles" class="w-full" [disabled]="true" />
                            </div>

                            <div class="col-span-12 md:col-span-6 flex flex-col gap-2">
                                <label for="context" class="text-sm font-medium text-surface-700 dark:text-surface-200">Contexto</label>
                                <input pInputText id="context" type="text" [ngModel]="profile.contextLabel" name="context" class="w-full" [disabled]="true" />
                            </div>
                        </div>

                        <div class="rounded-[0.9rem] border border-slate-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-900">
                            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p class="m-0 text-base font-semibold text-surface-900 dark:text-surface-0">Seguridad</p>
                                    <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Si necesitas una nueva contraseña, te enviaremos un enlace a tu correo registrado.</p>
                                </div>
                                <p-button label="Restablecer contraseña" severity="secondary" outlined styleClass="w-full sm:w-auto" (onClick)="sendResetLink()" />
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-slate-200 p-4 dark:border-surface-800">
                        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <p-button label="Cancelar" severity="secondary" text styleClass="w-full sm:w-auto" routerLink="/" />
                            <p-button label="Guardar cambios" icon="pi pi-check" styleClass="w-full sm:w-auto" (onClick)="saveProfile()" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Profile implements OnInit {
    readonly breadcrumbs: PageHeaderBreadcrumb[] = [{ label: 'Inicio', routerLink: '/' }, { label: 'Mi cuenta' }, { label: 'Perfil' }];

    submitted = false;
    profile!: UserProfile;
    editableFullName = '';
    loading = false;

    constructor(
        private readonly profileService: ProfileService,
        private readonly messageService: MessageService,
        private readonly router: Router
    ) {
        this.profile = this.profileService.getCurrentProfile();
        this.editableFullName = this.profile.fullName;
    }

    ngOnInit() {
        this.loading = true;
        this.profileService.loadCurrentProfile().subscribe({
            next: (profile) => {
                this.profile = profile;
                this.editableFullName = profile.fullName;
                this.loading = false;
            },
            error: () => {
                this.profile = this.profileService.getCurrentProfile();
                this.editableFullName = this.profile.fullName;
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'No se pudo cargar el perfil',
                    detail: 'Intenta volver a cargar la pantalla.'
                });
            }
        });
    }

    saveProfile() {
        this.submitted = true;
        if (!this.isValidFullName()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Revisa el nombre',
                detail: 'Ingresa un nombre válido antes de guardar.'
            });
            return;
        }

        this.profileService.updateCurrentProfileName(this.editableFullName).subscribe({
            next: (profile) => {
                this.profile = profile;
                this.editableFullName = profile.fullName;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Perfil actualizado',
                    detail: 'Tu nombre fue actualizado correctamente.'
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'No se pudo actualizar',
                    detail: 'Revisa tu conexión e inténtalo otra vez.'
                });
            }
        });
    }

    sendResetLink() {
        void this.router.navigate(['/auth/forgot-password'], {
            queryParams: {
                email: this.profile.email
            }
        });
    }

    showError(): boolean {
        return this.submitted && !this.isValidFullName();
    }

    onFullNameInput(event: Event) {
        this.editableFullName = this.sanitizeNameInput((event.target as HTMLInputElement).value);
    }

    onRestrictedNameKeydown(event: KeyboardEvent) {
        if (this.isAllowedEditingKey(event) || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        if (!this.isAllowedNameCharacter(event.key)) {
            event.preventDefault();
        }
    }

    onRestrictedNamePaste(event: ClipboardEvent) {
        if (!this.isAllowedNameText(event.clipboardData?.getData('text') ?? '')) {
            event.preventDefault();
        }
    }

    private isValidFullName(): boolean {
        const trimmed = this.editableFullName.trim();
        return trimmed.length >= 2 && this.isAllowedNameText(trimmed);
    }

    private sanitizeNameInput(value: string): string {
        return value.replace(/[^\p{L}\p{N}\s]/gu, '');
    }

    private isAllowedEditingKey(event: KeyboardEvent): boolean {
        return ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key);
    }

    private isAllowedNameCharacter(character: string): boolean {
        return /^[\p{L}\p{N}\s]$/u.test(character);
    }

    private isAllowedNameText(text: string): boolean {
        return /^[\p{L}\p{N}][\p{L}\p{N}\s]*$/u.test(text);
    }

}
