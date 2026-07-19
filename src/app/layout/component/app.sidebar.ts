import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { filter, Subject, takeUntil } from 'rxjs';
import { MockAuthService } from '@/app/core/auth/mock-auth.service';
import { ProfileService } from '@/app/features/account/data-access/profile.service';
import { AppMenu } from './app.menu';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, RouterModule, CommonModule, AvatarModule, TooltipModule],
    template: `
        <div class="layout-sidebar">
            <div class="layout-sidebar-shell">
                <div class="layout-sidebar-nav">
                    <app-menu></app-menu>
                </div>

                <div class="layout-sidebar-user">
                    @if (isUserMenuOpen) {
                        <div class="layout-user-panel" role="menu">
                            <div class="layout-user-panel-account">
                                <p-avatar [label]="userInitials()" shape="circle" styleClass="layout-user-avatar layout-user-avatar-light" />

                                <div class="layout-user-popup-meta">
                                    <span class="layout-user-name layout-user-name-light">{{ userName() }}</span>
                                    <span class="layout-user-plan">{{ userEmail() }}</span>
                                </div>
                            </div>

                            <div class="layout-user-panel-divider"></div>

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

                    <button
                        type="button"
                        class="layout-user-trigger"
                        (click)="toggleUserMenu($event)"
                        aria-haspopup="menu"
                        [attr.aria-expanded]="isUserMenuOpen"
                        [pTooltip]="desktopCollapsed() ? userName() : undefined"
                        tooltipPosition="right"
                    >
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
                overflow: visible;
                border: 1px solid var(--surface-border);
                border-radius: 0.75rem;
            }

            @media (max-width: 991px) {
                .layout-sidebar {
                    width: min(22rem, calc(100vw - 1.5rem));
                }
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
                padding-right: .25rem;
                scrollbar-width: thin;
                scrollbar-color: color-mix(in srgb, var(--primary-color) 22%, transparent) transparent;
                transition: padding-right 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
            }

            .layout-sidebar-nav::-webkit-scrollbar {
                width: .5rem;
            }

            .layout-sidebar-nav::-webkit-scrollbar-track {
                background: transparent;
            }

            .layout-sidebar-nav::-webkit-scrollbar-thumb {
                background: color-mix(in srgb, var(--primary-color) 18%, transparent);
                border-radius: 999px;
            }

            .layout-sidebar-nav::-webkit-scrollbar-thumb:hover {
                background: color-mix(in srgb, var(--primary-color) 28%, transparent);
            }

            .layout-sidebar-user {
                position: relative;
                flex: 0 0 auto;
                padding: .85rem;
                margin-top: 1rem;
                border: 1px solid var(--surface-border);
                border-radius: .75rem;
                background: white;
            }

            .layout-user-trigger {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                width: 100%;
                padding: .85rem .9rem;
                background: transparent;
                border: 0;
                border-radius: calc(var(--content-border-radius) - 2px);
                color: var(--text-color);
                cursor: pointer;
                text-align: left;
                transition: background-color var(--element-transition-duration), border-color var(--element-transition-duration), box-shadow var(--element-transition-duration);
            }

            .layout-user-trigger:hover {
                background: var(--surface-hover);
            }

            :host-context(.layout-static-inactive) .layout-sidebar-user {
                padding: .5rem;
            }

            :host-context(.layout-static-inactive) .layout-sidebar-nav {
                padding-right: 0;
            }

            :host-context(.layout-static-inactive) .layout-user-trigger {
                justify-content: center;
                padding: 0.7rem;
            }

            :host-context(.layout-static-inactive) .layout-user-meta,
            :host-context(.layout-static-inactive) .layout-user-chevron {
                display: none;
            }

            :host-context(.layout-static-inactive) .layout-user-panel {
                left: calc(100% + .75rem);
                right: auto;
                bottom: 0;
                width: 16rem;
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
                background: color-mix(in srgb, var(--primary-color) 12%, white);
                color: var(--primary-color);
            }

            .layout-user-meta,.layout-user-popup-meta {
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
                color: var(--text-color);
            }

            .layout-user-email,.layout-user-plan {
                margin-top: .15rem;
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
                color: var(--text-color-secondary);
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
                bottom: calc(100% + .75rem);
                padding: .7rem;
                border: 1px solid var(--surface-border);
                border-radius: .75rem;
                background: var(--surface-overlay);
                box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
                z-index: 1200;
            }

            .layout-user-panel-account,
            .layout-user-panel-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                width: 100%;
                padding: 0.8rem 0.85rem;
                border-radius: calc(.75rem - 2px);
                background: transparent;
                color: var(--text-color);
                text-align: left;
            }

            .layout-user-panel-item:hover {
                background: var(--surface-hover);
            }

            .layout-user-panel-account {
                border: 0;
                cursor: default;
            }

            .layout-user-panel-divider {
                height: 1px;
                margin: .45rem 0;
                background: var(--surface-border);
            }

            .layout-user-panel-item {
                font-size: 0.98rem;
                cursor: pointer;
            }

            .layout-user-panel-item i,
            .layout-user-panel-item span {
                color: inherit;
                cursor: pointer;
            }

            .layout-user-panel-item-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;
            }

            .layout-user-panel-item-between {
                justify-content: space-between;
            }

            .layout-user-panel-item-danger {
                color: var(--red-500);
            }
        `
    ]
})
export class AppSidebar implements OnInit, OnDestroy {
    layoutService = inject(LayoutService);

    router = inject(Router);

    el = inject(ElementRef);

    auth = inject(MockAuthService);

    profileService = inject(ProfileService);

    private outsideClickListener: ((event: MouseEvent) => void) | null = null;

    private destroy$ = new Subject<void>();

    isUserMenuOpen = false;

    readonly desktopCollapsed = computed(() => this.layoutService.isDesktop() && this.layoutService.layoutState().staticMenuDesktopInactive);

    readonly currentProfile = computed(() => this.profileService.currentProfile() ?? null);

    readonly userName = computed(() => this.currentProfile()?.fullName?.trim() || 'Usuario');

    readonly userEmail = computed(() => this.currentProfile()?.email?.trim() || 'Cargando...');

    readonly userPlan = computed(() => this.currentProfile()?.primaryRoleLabel || 'Sin rol');

    readonly userInitials = computed(() =>
        this.userName()
            .trim()
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part.charAt(0).toUpperCase())
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

    goToProfile() {
        this.navigateTo('/account/profile');
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
