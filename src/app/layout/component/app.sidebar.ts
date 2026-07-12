import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { MenuModule } from 'primeng/menu';
import { filter, Subject, takeUntil } from 'rxjs';
import { MockAuthService, MockUserRole } from '@/app/core/auth/mock-auth.service';
import { AppMenu } from './app.menu';
import { LayoutService } from '@/app/layout/service/layout.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, RouterModule, CommonModule, AvatarModule, MenuModule],
    template: `
        <div class="layout-sidebar">
            <div class="layout-sidebar-shell">
                <div class="layout-sidebar-nav">
                    <app-menu></app-menu>
                </div>

                <div class="layout-sidebar-user">
                    <button type="button" class="layout-user-trigger" (click)="toggleUserMenu($event)" aria-haspopup="menu" [attr.aria-expanded]="isUserMenuOpen">
                        <p-avatar [label]="userInitials()" shape="circle" styleClass="layout-user-avatar" />

                        <div class="layout-user-meta">
                            <span class="layout-user-name">{{ userName() }}</span>
                            <span class="layout-user-email">{{ userEmail() }}</span>
                        </div>

                        <i class="pi pi-chevron-up layout-user-chevron" [class.layout-user-chevron-open]="isUserMenuOpen"></i>
                    </button>

                    <p-menu #userMenu [popup]="true" appendTo="body" [model]="userMenuItems" styleClass="layout-user-popup-menu" (onShow)="isUserMenuOpen = true" (onHide)="isUserMenuOpen = false">
                        <ng-template #start>
                            <div class="layout-user-popup-header">
                                <p-avatar [label]="userInitials()" shape="circle" styleClass="layout-user-avatar" />
                                <div class="layout-user-popup-meta">
                                    <span class="layout-user-name">{{ userName() }}</span>
                                    <span class="layout-user-email">{{ userEmail() }}</span>
                                </div>
                            </div>
                        </ng-template>
                    </p-menu>
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

            .layout-user-email {
                margin-top: 0.15rem;
                font-size: 0.8rem;
                line-height: 1.2;
                color: var(--text-color-secondary);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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

            .layout-user-popup-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.85rem 0.95rem 0.5rem;
                border-bottom: 1px solid var(--surface-border);
                margin-bottom: 0.3rem;
            }

            :host ::ng-deep .layout-user-popup-menu {
                width: 16.5rem;
                border-radius: 1rem;
                overflow: hidden;
            }

            :host ::ng-deep .layout-user-popup-menu .p-menu-list {
                padding-top: 0.25rem;
                padding-bottom: 0.35rem;
            }

            :host ::ng-deep .layout-user-popup-menu .p-menu-item-link {
                padding: 0.8rem 0.95rem;
                gap: 0.75rem;
            }
        `
    ]
})
export class AppSidebar implements OnInit, OnDestroy {
    layoutService = inject(LayoutService);

    router = inject(Router);

    el = inject(ElementRef);

    auth = inject(MockAuthService);

    userMenu = viewChild<Menu>('userMenu');

    private outsideClickListener: ((event: MouseEvent) => void) | null = null;

    private destroy$ = new Subject<void>();

    isUserMenuOpen = false;

    readonly profileByRole: Record<MockUserRole, { name: string; email: string }> = {
        super_admin: {
            name: 'Administrador Plataforma',
            email: 'admin@playertech.com'
        },
        tenant_owner: {
            name: 'Juan Rodas',
            email: 'juan.rodas@playertech.com'
        },
        academy_admin: {
            name: 'María Pérez',
            email: 'maria.perez@playertech.com'
        },
        staff: {
            name: 'Carlos Gómez',
            email: 'carlos.gomez@playertech.com'
        }
    };

    readonly userName = computed(() => this.profileByRole[this.auth.getRole()].name);

    readonly userEmail = computed(() => this.profileByRole[this.auth.getRole()].email);

    readonly userInitials = computed(() =>
        this.userName()
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('')
    );

    readonly userMenuItems: MenuItem[] = [
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
        }
    ];

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
        this.userMenu()?.toggle(event);
    }

    logout() {
        this.isUserMenuOpen = false;
        this.auth.logout();
        void this.router.navigate(['/auth/login']);
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
