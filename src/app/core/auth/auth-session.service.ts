import { computed, Injectable, signal } from '@angular/core';
import { AcademyContext, AuthRole, AuthSessionState, AuthUser } from './auth.models';
import { getAuthHomeRoute, getAuthRoleLabel, normalizeAcademyContext, normalizeAuthSessionState, normalizeAuthUser } from './auth.mapper';

const AUTH_SESSION_STORAGE_KEY = 'playertech.auth-session';
const AUTH_STORAGE_KEY_PATTERNS = [/^playertech\./, /^md_jwt$/, /^sb-/];

@Injectable({
    providedIn: 'root'
})
export class AuthSessionService {
    private readonly state = signal<AuthSessionState>(this.readState());

    readonly session = computed(() => this.state());
    readonly user = computed(() => this.state().user);
    readonly tenantContext = computed(() => this.state().tenantContext ?? null);
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
        const current = this.state();
        this.state.set({
            authenticated: true,
            user: normalizeAuthUser(user),
            tenantContext: current.tenantContext ?? null
        });
        this.persistState();
    }

    setTenantContext(context: AcademyContext | null) {
        this.state.update((current) => ({
            ...current,
            tenantContext: context ? normalizeAcademyContext(context) : null
        }));
        this.persistState();
    }

    getTenantContext(): AcademyContext | null {
        return this.tenantContext();
    }

    clearSession() {
        this.state.set({
            authenticated: false,
            user: null,
            tenantContext: null
        });
        this.persistState();
        this.clearAuthArtifacts();
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

    clearAuthArtifacts() {
        this.clearMatchingStorageKeys(localStorage);
        this.clearMatchingStorageKeys(sessionStorage);
    }

    private clearMatchingStorageKeys(storage: Storage) {
        if (typeof storage === 'undefined') {
            return;
        }

        const keysToRemove: string[] = [];

        for (let index = 0; index < storage.length; index++) {
            const key = storage.key(index);
            if (!key) {
                continue;
            }

            if (AUTH_STORAGE_KEY_PATTERNS.some((pattern) => pattern.test(key))) {
                keysToRemove.push(key);
            }
        }

        for (const key of keysToRemove) {
            storage.removeItem(key);
        }
    }
}
