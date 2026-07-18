import { computed, Injectable, signal } from '@angular/core';
import { AuthRole, AuthSessionState, AuthUser } from './auth.models';

const AUTH_SESSION_STORAGE_KEY = 'playertech.auth-session';

@Injectable({
    providedIn: 'root'
})
export class AuthSessionService {
    private readonly state = signal<AuthSessionState>(this.readState());

    readonly session = computed(() => this.state());
    readonly user = computed(() => this.state().user);
    readonly isAuthenticated = computed(() => this.state().authenticated);
    readonly roles = computed(() => this.state().user?.roles ?? []);
    readonly primaryRole = computed<AuthRole | null>(() => this.state().user?.role ?? null);

    isLoggedIn(): boolean {
        return this.state().authenticated;
    }

    getRole(): AuthRole | null {
        return this.primaryRole();
    }

    getUser(): AuthUser | null {
        return this.user();
    }

    setSession(user: AuthUser) {
        this.state.set({
            authenticated: true,
            user: this.normalizeUser(user)
        });
        this.persistState();
    }

    updateUser(patch: Partial<AuthUser>) {
        const current = this.state().user;
        if (!current) {
            return;
        }

        this.state.set({
            authenticated: true,
            user: this.normalizeUser({
                ...current,
                ...patch,
                roles: patch.roles ?? current.roles,
                role: patch.role ?? current.role
            })
        });
        this.persistState();
    }

    clearSession() {
        this.state.set({
            authenticated: false,
            user: null
        });
        this.persistState();
    }

    getHomeRoute(): string {
        const role = this.primaryRole();

        switch (role) {
            case 'ROLE_ROOT':
                return '/';
            case 'ROLE_ACADEMY_ADMIN':
            case 'ROLE_COACH':
                return '/academy';
            default:
                return '/account/profile';
        }
    }

    getRoleLabel(role: AuthRole): string {
        switch (role) {
            case 'ROLE_ROOT':
                return 'Plataforma';
            case 'ROLE_ACADEMY_ADMIN':
                return 'Administrador de academia';
            case 'ROLE_COACH':
                return 'Entrenador';
            case 'ROLE_USER':
                return 'Usuario base';
            default:
                return role || 'Sin rol';
        }
    }

    getContextLabel(): string {
        const user = this.user();
        if (!user) {
            return 'Sin sesión';
        }

        if (user.role === 'ROLE_ROOT') {
            return 'Contexto de plataforma';
        }

        return user.academyName ?? user.academyId ?? 'Contexto tenant';
    }

    hasTenantContext(): boolean {
        const user = this.user();
        return !!user?.academyId && user.role !== 'ROLE_ROOT';
    }

    private normalizeUser(user: AuthUser): AuthUser {
        const roles = Array.from(new Set((user.roles?.length ? user.roles : [user.role]).filter(Boolean))) as AuthRole[];
        return {
            ...user,
            roles,
            role: user.role || roles[0] || 'ROLE_USER',
            academyId: user.academyId ?? null,
            academyName: user.academyName ?? null,
            token: user.token ?? null,
            accessToken: user.accessToken ?? null,
            refreshToken: user.refreshToken ?? null,
            status: user.status ?? null
        };
    }

    private readState(): AuthSessionState {
        if (typeof localStorage === 'undefined') {
            return { authenticated: false, user: null };
        }

        const raw = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
        if (!raw) {
            return { authenticated: false, user: null };
        }

        try {
            const parsed = JSON.parse(raw) as AuthSessionState;
            if (!parsed?.user) {
                return { authenticated: false, user: null };
            }

            return {
                authenticated: !!parsed.authenticated,
                user: this.normalizeUser(parsed.user)
            };
        } catch {
            return { authenticated: false, user: null };
        }
    }

    private persistState() {
        if (typeof localStorage === 'undefined') {
            return;
        }

        localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(this.state()));
    }
}
