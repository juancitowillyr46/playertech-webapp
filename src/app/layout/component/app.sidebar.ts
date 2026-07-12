import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { filter, Subject, takeUntil } from 'rxjs';
import { MockAuthService, MockUserRole } from '@/app/core/auth/mock-auth.service';
import { AppMenu } from './app.menu';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, RouterModule, CommonModule, AvatarModule],
    template: `
        <div class="layout-sidebar">
            <div class="layout-sidebar-shell">
                <div class="layout-sidebar-nav">
                    <app-menu></app-menu>
                </div>

                <div class="layout-sidebar-user">
                    @if (isUserMenuOpen) {
                        <div class="layout-user-panel" role="menu">
                            <button type="button" class="layout-user-panel-account" (click)="goToProfile()">
                                <p-avatar [label]="userInitials()" shape="circle" styleClass="layout-user-avatar layout-user-avatar-light" />

                                <div class="layout-user-popup-meta">
                                    <span class="layout-user-name layout-user-name-light">{{ userName() }}</span>
                                    <span class="layout-user-plan">{{ userPlan() }}</span>
                                </div>

                                <i class="pi pi-angle-right"></i>
                            </button>

                            <div class="layout-user-panel-divider"></div>

                            <button type="button" class="layout-user-panel-item" (click)="goToUpgrade()">
                                <i class="pi pi-sparkles"></i>
                                <span>Mejorar plan</span>
                            </button>

                            <button type="button" class="layout-user-panel-item" (click)="goToPreferences()">
                                <i class="pi pi-clock"></i>
                                <span>Personalización</span>
                            </button>

                            <button type="button" class="layout-user-panel-item" (click)="goToProfile()">
                                <i class="pi pi-user"></i>
                                <span>Perfil</span>
                            </button>

                            <button type="button" class="layout-user-panel-item" (click)="goToSettings()">
                                <i class="pi pi-cog"></i>
                                <span>Configuración</span>
                            </button>

                            <div class="layout-user-panel-divider"></div>

                            <button type="button" class="layout-user-panel-item layout-user-panel-item-between" (click)="goToHelp()">
                                <div class="layout-user-panel-item-content">
                                    <i class="pi pi-question-circle"></i>
                                    <span>Ayuda</span>
                                </div>

                                <i class="pi pi-angle-right"></i>
                            </button>

                            <button type="button" class="layout-user-panel-item layout-user-panel-item-danger" (click)="logout()">
                                <i class="pi pi-sign-out"></i>
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    }

                    <button type="button" class="layout-user-trigger" (click)="toggleUserMenu($event)" aria-haspopup="menu" [attr.aria-expanded]="isUserMenuOpen">
                        <p-avatar [label]="userInitials()" shape="circle" styleClass="layout-user-avatar" />

                        <div class="layout-user-meta">
                            <span class="layout-user-name">{{ userName() }}</span>
                            <span class="layout-user-email">{{ userEmail() }}</span>
                        </div>

                        <i class="pi pi-chevron-up layout-user-chevron" [class.layout-user-chevron-open]="isUserMenuOpen"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                height: 100%;
            }

            .layout-sidebar {
                overflow: hidden;
            }

            .layout-sidebar-shell {
                display: flex;
                flex-direction: column;
                height: 100%;
                min-height: 0;
            }

            .layout-sidebar-nav {
                flex: 1 1 auto;
                min-height: 0;
                overflow-y: auto;
                padding-right: 0.25rem;
            }

            .layout-sidebar-user {
                position: relative;
                flex: 0 0 auto;
                padding-top: 1rem;
                margin-top: 1rem;
                border-top: 1px solid var(--surface-border);
            }

            .layout-user-trigger {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                width: 100%;
                padding: 0.85rem 0.9rem;
                background: var(--surface-ground);
                border: 1px solid var(--surface-border);
                border-radius: 0.9rem;
                color: var(--text-color);
                cursor: pointer;
                text-align: left;
                transition:
                    background-color var(--element-transition-duration),
                    border-color var(--element-transition-duration),
                    box-shadow var(--element-transition-duration);
            }

            .layout-user-trigger:hover {
                background: var(--surface-hover);
                border-color: color-mix(in srgb, var(--primary-color) 18%, var(--surface-border));
            }

            .layout-user-avatar {
                width: 2.6rem;
                height: 2.6rem;
                background: color-mix(in srgb, var(--primary-color) 12%, white);
                color: var(--primary-color);
                font-weight: 700;
                flex-shrink: 0;
            }

            .layout-user-avatar-light {
                background: rgba(255, 255, 255, 0.92);
                color: #0f172a;
            }

            .layout-user-meta,
            .layout-user-popup-meta {
                display: flex;
                flex-direction: column;
                min-width: 0;
            }

            .layout-user-name {
                font-size: 0.95rem;
                font-weight: 600;
                line-height: 1.2;
                color: var(--text-color);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .layout-user-name-light {
                color: #f8fafc;
            }

            .layout-user-email,
            .layout-user-plan {
                margin-top: 0.15rem;
                font-size: 0.8rem;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .layout-user-email {
                color: var(--text-color-secondary);
            }

            .layout-user-plan {
                color: rgba(248, 250, 252, 0.72);
            }

            .layout-user-chevron {
                margin-left: auto;
                font-size: 0.85rem;
                color: var(--text-color-secondary);
                transition: transform var(--element-transition-duration);
            }

            .layout-user-chevron-open {
                transform: rotate(180deg);
            }

            .layout-user-panel {
                position: absolute;
                left: 0;
                right: 0;
                bottom: calc(100% + 0.75rem);
                padding: 0.7rem;
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 1.2rem;
                background: #3a3a3a;
                box-shadow:
                    0 18px 40px rgba(15, 23, 42, 0.18),
                    0 8px 18px rgba(15, 23, 42, 0.12);
                z-index: 5;
            }

            .layout-user-panel-account,
            .layout-user-panel-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                width: 100%;
                padding: 0.8rem 0.85rem;
                border: 0;
                border-radius: 0.95rem;
                background: transparent;
                color: #f8fafc;
                cursor: pointer;
                text-align: left;
                transition: background-color var(--element-transition-duration);
            }

            .layout-user-panel-account:hover,
            .layout-user-panel-item:hover {
                background: rgba(255, 255, 255, 0.06);
            }

            .layout-user-panel-account i {
                margin-left: auto;
                color: rgba(248, 250, 252, 0.9);
            }

            .layout-user-panel-divider {
                height: 1px;
                margin: 0.45rem 0;
                background: rgba(255, 255, 255, 0.12);
            }

            .layout-user-panel-item {
                font-size: 0.98rem;
            }

            .layout-user-panel-item i,
            .layout-user-panel-item span {
                color: inherit;
            }

            .layout-user-panel-item-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .layout-user-panel-item-between {
                justify-content: space-between;
            }

            .layout-user-panel-item-danger {
                color: #fee2e2;
            }
        `
    ]
})
export class AppSidebar implements OnInit, OnDestroy {
    layoutService = inject(LayoutService);

    router = inject(Router);

    el = inject(ElementRef);

    auth = inject(MockAuthService);

    private outsideClickListener: ((event: MouseEvent) => void) | null = null;

    private destroy$ = new Subject<void>();

    isUserMenuOpen = false;

    readonly profileByRole: Record<MockUserRole, { name: string; email: string; plan: string }> = {
        super_admin: {
            name: 'Administrador Plataforma',
            email: 'admin@playertech.com',
            plan: 'Plataforma'
        },
        tenant_owner: {
            name: 'Juan Rodas',
            email: 'juan.rodas@playertech.com',
            plan: 'Gratis'
        },
        academy_admin: {
            name: 'María Pérez',
            email: 'maria.perez@playertech.com',
            plan: 'Administrador'
        },
        staff: {
            name: 'Carlos Gómez',
            email: 'carlos.gomez@playertech.com',
            plan: 'Equipo'
        }
    };

    readonly userName = computed(() => this.profileByRole[this.auth.getRole()].name);

    readonly userEmail = computed(() => this.profileByRole[this.auth.getRole()].email);

    readonly userPlan = computed(() => this.profileByRole[this.auth.getRole()].plan);

    readonly userInitials = computed(() =>
        this.userName()
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('')
    );

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();

            if (this.layoutService.isDesktop()) {
                if (state.overlayMenuActive) {
                    this.bindOutsideClickListener();
                } else {
                    this.unbindOutsideClickListener();
                }
            } else {
                if (state.mobileMenuActive) {
                    this.bindOutsideClickListener();
                } else {
                    this.unbindOutsideClickListener();
                }
            }
        });
    }

    ngOnInit() {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe((event) => {
                const navEvent = event as NavigationEnd;
                this.onRouteChange(navEvent.urlAfterRedirects);
            });

        this.onRouteChange(this.router.url);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.unbindOutsideClickListener();
    }

    toggleUserMenu(event: Event) {
        event.stopPropagation();
        this.isUserMenuOpen = !this.isUserMenuOpen;
    }

    logout() {
        this.isUserMenuOpen = false;
        this.auth.logout();
        void this.router.navigate(['/auth/login']);
    }

    goToUpgrade() {
        this.navigateTo('/pages/empty');
    }

    goToPreferences() {
        this.navigateTo('/pages/empty');
    }

    goToProfile() {
        this.navigateTo('/pages/empty');
    }

    goToSettings() {
        this.navigateTo('/pages/empty');
    }

    goToHelp() {
        this.navigateTo('/documentation');
    }

    private navigateTo(path: string) {
        this.isUserMenuOpen = false;
        void this.router.navigate([path]);
    }

    private onRouteChange(path: string) {
        this.isUserMenuOpen = false;
        this.layoutService.layoutState.update((val) => ({
            ...val,
            activePath: path,
            overlayMenuActive: false,
            staticMenuMobileActive: false,
            mobileMenuActive: false,
            menuHoverActive: false
        }));
    }

    private bindOutsideClickListener() {
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event: MouseEvent) => {
                if (this.isOutsideClicked(event)) {
                    this.isUserMenuOpen = false;
                    this.layoutService.layoutState.update((val) => ({
                        ...val,
                        overlayMenuActive: false,
                        staticMenuMobileActive: false,
                        mobileMenuActive: false,
                        menuHoverActive: false
                    }));
                }
            };

            document.addEventListener('click', this.outsideClickListener);
        }
    }

    private unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }

    private isOutsideClicked(event: MouseEvent): boolean {
        const topbarButtonEl = document.querySelector('.topbar-start > button');
        const sidebarEl = this.el.nativeElement;

        return !(
            sidebarEl?.isSameNode(event.target as Node) ||
            sidebarEl?.contains(event.target as Node) ||
            topbarButtonEl?.isSameNode(event.target as Node) ||
            topbarButtonEl?.contains(event.target as Node)
        );
    }
}
