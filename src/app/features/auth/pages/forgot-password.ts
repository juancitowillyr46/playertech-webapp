import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [ButtonModule, CommonModule, FormsModule, InputTextModule, MessageModule, RouterModule],
    template: `
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-6 dark:bg-none dark:bg-surface-950 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center">
                <div class="w-full min-w-0 max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_28px_90px_-28px_rgba(15,23,42,0.24)] dark:border-surface-800 dark:bg-surface-900">
                    <div class="min-w-0 px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
                        <div class="mb-6 text-center sm:mb-7">
                            <p class="hidden text-sm font-medium uppercase tracking-[0.24em] text-sky-700 dark:text-sky-400 sm:block">Ayuda de acceso</p>
                            <h1 class="mt-1 text-[clamp(1.55rem,6vw,1.9rem)] font-semibold tracking-tight text-surface-900 dark:text-surface-0">Recuperar contraseña</h1>
                            <p class="mx-auto mt-2 max-w-[22rem] text-sm leading-6 text-slate-600 dark:text-slate-300 sm:max-w-xl">Escribe tu correo para recibir los pasos para continuar.</p>
                        </div>

                        @if (apiMessage) {
                            <div class="mb-6">
                                <p-message [severity]="apiMessage.severity" [text]="apiMessage.text" [closable]="false" />
                            </div>
                        }

                        <div class="space-y-5 sm:space-y-6">
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
                                @if (showError()) {
                                    <p-message severity="error" size="small">Ingresa un correo válido.</p-message>
                                }
                            </div>

                            <div class="pt-1">
                                <p-button label="Enviar pasos" styleClass="w-full" type="button" (onClick)="submit()" />
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
export class ForgotPassword {
    email = '';

    submitted = false;

    apiMessage: { severity: 'success' | 'info' | 'warn' | 'error'; text: string } | null = null;

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    }

    handleEmailKeydown(event: KeyboardEvent) {
        const allowedControlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];

        if (allowedControlKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
            return;
        }

        if (!/^[a-zA-Z0-9@._%+\-]$/.test(event.key)) {
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

    showError(): boolean {
        return this.submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
    }

    submit() {
        this.submitted = true;

        if (this.showError()) {
            this.apiMessage = {
                severity: 'error',
                text: 'Revisa el correo e inténtalo de nuevo.'
            };
            return;
        }

        this.apiMessage = {
            severity: 'success',
            text: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.'
        };

        void this.router.navigate(['/auth/forgot-password-success'], {
            state: {
                email: this.email
            }
        });
    }
}
