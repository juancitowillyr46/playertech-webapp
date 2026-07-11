import { Injectable } from '@angular/core';

export type MockUserRole = 'super_admin' | 'tenant_owner' | 'academy_admin' | 'staff';

type MockAuthState = {
    authenticated: boolean;
    role: MockUserRole;
};

const AUTH_STORAGE_KEY = 'playertech.mock-auth';

@Injectable({
    providedIn: 'root'
})
export class MockAuthService {
    private state: MockAuthState = this.readState();

    isAuthenticated(): boolean {
        return this.state.authenticated;
    }

    getRole(): MockUserRole {
        return this.state.role;
    }

    login(role: MockUserRole = 'tenant_owner') {
        this.state = {
            authenticated: true,
            role
        };
        this.persistState();
    }

    logout() {
        this.state = {
            authenticated: false,
            role: 'tenant_owner'
        };
        this.persistState();
    }

    canAccess(routePath: string): boolean {
        if (!this.isAuthenticated()) {
            return false;
        }

        if (this.state.role === 'super_admin') {
            return true;
        }

        if (routePath.startsWith('/pages') || routePath === '/' || routePath.startsWith('/dashboard')) {
            return true;
        }

        return true;
    }

    private readState(): MockAuthState {
        if (typeof localStorage === 'undefined') {
            return { authenticated: false, role: 'tenant_owner' };
        }

        const raw = localStorage.getItem(AUTH_STORAGE_KEY);

        if (!raw) {
            return { authenticated: false, role: 'tenant_owner' };
        }

        try {
            return JSON.parse(raw) as MockAuthState;
        } catch {
            return { authenticated: false, role: 'tenant_owner' };
        }
    }

    private persistState() {
        if (typeof localStorage === 'undefined') {
            return;
        }

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.state));
    }
}
