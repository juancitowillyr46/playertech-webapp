import { Component, computed, effect, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import { SessionExpirationService } from '@/app/core/auth/session-expiration.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [ButtonModule, CommonModule, DialogModule, AppTopbar, AppSidebar, RouterModule, AppFooter],
    template: `<div class="layout-wrapper" [ngClass]="containerClass()">
        <p-dialog
            header="Sesión expirada"
            [modal]="true"
            [closable]="false"
            [dismissableMask]="false"
            [visible]="sessionExpiration.visible()"
            (visibleChange)="sessionExpiration.visible.set($event)"
            [style]="{ width: 'min(28rem, calc(100vw - 2rem))' }"
        >
            <p class="m-0 text-sm leading-6 text-slate-600 dark:text-slate-300">Tu sesión expiró. Vuelve a iniciar sesión para continuar.</p>
            <ng-template pTemplate="footer">
                <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <p-button label="Iniciar sesión" styleClass="w-full sm:w-auto" (onClick)="goToLogin()" />
                </div>
            </ng-template>
        </p-dialog>
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask"></div>
    </div> `
})
export class AppLayout {
    layoutService = inject(LayoutService);
    readonly sessionExpiration = inject(SessionExpirationService);
    private readonly auth = inject(AuthSessionService);
    private readonly router = inject(Router);

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });
    }

    goToLogin() {
        const returnUrl = this.router.url || '/academy';
        this.sessionExpiration.hide();
        this.sessionExpiration.clearBackdropState();
        this.auth.clearSession();
        void this.router.navigate(['/auth/login'], {
            queryParams: {
                returnUrl
            }
        });
    }

    @HostListener('window:resize')
    onWindowResize() {
        if (this.layoutService.isDesktop()) {
            this.layoutService.layoutState.update((state) => ({
                ...state,
                mobileMenuActive: false,
                overlayMenuActive: false
            }));
        }
    }

    containerClass = computed(() => {
        const config = this.layoutService.layoutConfig();
        const state = this.layoutService.layoutState();
        return {
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.mobileMenuActive
        };
    })
}
