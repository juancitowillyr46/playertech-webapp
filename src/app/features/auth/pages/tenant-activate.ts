import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { AuthAccessService } from '../data-access/auth-access.service';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';

@Component({
    selector: 'app-tenant-activate',
    standalone: true,
    imports: [ButtonModule, CardModule, CommonModule, MessageModule, RouterModule],
    template: `
        <div class="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.10),_transparent_24%),linear-gradient(180deg,_#f8faf7_0%,_#eef4f1_100%)] px-4 py-6 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-2xl items-center justify-center">
                <div class="w-full overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white px-5 py-6 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.24)] sm:px-7 sm:py-8 lg:px-10 lg:py-10">
                    <div class="mb-6">
                        <p class="text-xs uppercase tracking-[0.35em] text-emerald-700/80">PlayerTech</p>
                        <h1 class="mt-3 text-3xl font-semibold tracking-tight text-balance text-slate-900 sm:text-4xl">
                            @if (activationSucceeded) {
                                Tu cuenta quedó activada
                            } @else {
                                Estamos validando tu enlace
                            }
                        </h1>
                        <p class="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                            @if (activationSucceeded) {
                                Ya puedes iniciar sesión.
                            } @else if (hasToken) {
                                Estamos revisando tu enlace.
                            } @else {
                                El enlace no es válido.
                            }
                        </p>
                    </div>

                    @if (loading) {
                        <div class="mb-5">
                            <p-message severity="info" [text]="'Validando tu enlace de activación...'" [closable]="false" />
                        </div>
                    }

                    @if (apiMessage) {
                        <div class="mb-5">
                            <p-message [severity]="apiMessage.severity" [text]="apiMessage.text" [closable]="false" />
                        </div>
                    }

                    <div class="space-y-4">
                        <div class="flex flex-col gap-3 sm:flex-row">
                            @if (activationSucceeded) {
                                <p-button label="Ir a iniciar sesión" routerLink="/auth/login" styleClass="w-full sm:w-auto" />
                            } @else {
                                <p-button label="Reintentar" styleClass="w-full sm:w-auto" [loading]="loading" [disabled]="loading || !hasToken" (onClick)="loadActivation()" />
                                <p-button label="Volver al inicio" routerLink="/landing" severity="secondary" outlined styleClass="w-full sm:w-auto" />
                            }
                        </div>

                        @if (activationSucceeded) {
                            <p class="text-sm leading-6 text-slate-600">Tu academia ya está lista.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TenantActivate implements OnInit {
    token = '';
    hasToken = false;
    loading = false;
    activationSucceeded = false;
    apiMessage: { severity: 'success' | 'info' | 'warn' | 'error'; text: string } | null = null;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly auth: AuthAccessService
    ) {}

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
        this.hasToken = !!this.token;

        if (!this.token) {
            this.apiMessage = {
                severity: 'error',
                text: 'El enlace no es válido.'
            };
            return;
        }

        void this.loadActivation();
    }

    async loadActivation(): Promise<void> {
        if (!this.token) {
            this.apiMessage = {
                severity: 'error',
                text: 'El enlace no es válido.'
            };
            return;
        }

        this.loading = true;
        this.apiMessage = null;

        try {
            await firstValueFrom(this.auth.checkTenantActivation(this.token));
            this.activationSucceeded = true;
            this.apiMessage = {
                severity: 'success',
                text: 'Cuenta activada correctamente. Ya puedes iniciar sesión.'
            };
        } catch (error) {
            this.activationSucceeded = false;
            this.apiMessage = {
                severity: 'error',
                text: this.getTokenErrorMessage(error as AuthErrorLike | undefined)
            };
        } finally {
            this.loading = false;
        }
    }

    private getTokenErrorMessage(error?: AuthErrorLike): string {
        if (error?.status === 400 || error?.status === 401 || error?.status === 404) {
            return 'El enlace expiró o no es válido.';
        }

        return 'No fue posible completar la activación.';
    }
}
