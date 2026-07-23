import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthAccessService } from '../data-access/auth-access.service';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';
import { TenantActivationStatusResponse } from '@/app/core/auth/auth.models';

@Component({
    selector: 'app-tenant-activate',
    standalone: true,
    imports: [ButtonModule, CommonModule, MessageModule, RouterModule],
    template: `
        <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(217,119,6,0.10),_transparent_24%),linear-gradient(180deg,_#f8faf7_0%,_#eef4f1_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <div class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl items-center">
                <div class="w-full rounded-[2rem] border border-emerald-950/10 bg-white px-6 py-8 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.24)] sm:px-8 sm:py-10 lg:px-10">
                    <p class="text-xs uppercase tracking-[0.32em] text-emerald-700">PlayerTech</p>

                    <h1 class="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                        @if (loading) {
                            Activando tu cuenta
                        } @else if (activationSucceeded) {
                            Tu cuenta quedó activada
                        } @else if (tokenLoaded) {
                            No pudimos activar tu cuenta
                        } @else {
                            El enlace no es válido
                        }
                    </h1>

                    <p class="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                        @if (loading) {
                            Un momento, estamos procesando el enlace.
                        } @else if (activationSucceeded) {
                            Ya puedes iniciar sesión.
                        } @else if (tokenLoaded) {
                            Este enlace ya no es válido o expiró.
                        } @else {
                            El enlace no es válido.
                        }
                    </p>

                    @if (apiMessage) {
                        <div class="mt-6">
                            <p-message [severity]="apiMessage.severity" [text]="apiMessage.text" [closable]="false" />
                        </div>
                    }

                    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                        @if (activationSucceeded) {
                            <p-button label="Ir a iniciar sesión" styleClass="w-full sm:w-auto" routerLink="/auth/login" />
                        } @else {
                            <p-button
                                label="Reintentar"
                                styleClass="w-full sm:w-auto"
                                type="button"
                                severity="secondary"
                                [loading]="loading"
                                loadingIcon="pi pi-spinner pi-spin"
                                [disabled]="loading || !tokenLoaded"
                                (onClick)="loadActivation()"
                            />
                            <p-button label="Volver al inicio" styleClass="w-full sm:w-auto" routerLink="/landing" severity="secondary" outlined="true" />
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TenantActivate implements OnInit {
    token = '';
    tokenLoaded = false;
    loading = false;
    activationSucceeded = false;
    alreadyActivated = false;
    apiMessage: { severity: 'success' | 'info' | 'warn' | 'error'; text: string } | null = null;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly cdr: ChangeDetectorRef,
        private readonly auth: AuthAccessService
    ) {}

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
        this.tokenLoaded = !!this.token;

        if (!this.tokenLoaded) {
            this.apiMessage = {
                severity: 'error',
                text: 'El enlace de activación es inválido o expiró.'
            };
            return;
        }

        void this.loadActivation();
    }

    async loadActivation(): Promise<void> {
        if (!this.tokenLoaded) {
            this.apiMessage = {
                severity: 'error',
                text: 'El enlace de activación es inválido o expiró.'
            };
            return;
        }

        this.loading = true;
        this.apiMessage = null;
        this.activationSucceeded = false;
        this.alreadyActivated = false;
        this.cdr.detectChanges();

        try {
            const response = await firstValueFrom(this.auth.checkTenantActivation(this.token));
            const data = response.data;

            if (data?.alreadyActivated) {
                this.activationSucceeded = true;
                this.alreadyActivated = true;
                this.apiMessage = {
                    severity: 'success',
                    text: 'Tu cuenta ya estaba activada.'
                };
            } else if (data?.activated) {
                this.activationSucceeded = true;
                this.apiMessage = {
                    severity: 'success',
                    text: 'Tu cuenta fue activada correctamente.'
                };
            } else {
                this.activationSucceeded = false;
                this.apiMessage = {
                    severity: 'warn',
                    text: 'La activación no pudo completarse.'
                };
            }
        } catch (error) {
            this.activationSucceeded = false;
            this.apiMessage = {
                severity: 'error',
                text: this.getErrorMessage(error as AuthErrorLike | undefined)
            };
        } finally {
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    private getErrorMessage(error?: AuthErrorLike): string {
        if (error?.status === 404) {
            return 'El enlace de activación es inválido o expiró.';
        }

        return 'No fue posible completar la activación.';
    }
}
