import { computed, Injectable, signal } from '@angular/core';
import { AuthRole, AuthSessionState, AuthUser } from './auth.models';
import { getAuthHomeRoute, getAuthRoleLabel, normalizeAuthSessionState, normalizeAuthUser } from './auth.mapper';

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
            user: normalizeAuthUser(user)
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
        return getAuthHomeRoute(this.primaryRole());
    }

    getRoleLabel(role: AuthRole): string {
        return getAuthRoleLabel(role);
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
            return normalizeAuthSessionState(parsed);
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
