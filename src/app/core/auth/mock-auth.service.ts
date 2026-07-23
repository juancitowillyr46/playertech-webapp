import { Injectable } from '@angular/core';
import { AuthRole } from './auth.models';
import { AuthSessionService } from './auth-session.service';

export type MockUserRole = 'super_admin' | 'tenant_owner' | 'academy_admin' | 'staff';

@Injectable({
    providedIn: 'root'
})
export class MockAuthService {
    constructor(private readonly session: AuthSessionService) {}

    isAuthenticated(): boolean {
        return this.session.isAuthenticated();
    }

    getRole(): MockUserRole {
        return this.mapRole(this.session.primaryRole() ?? 'ROLE_USER');
    }

    login(role: MockUserRole = 'tenant_owner') {
        this.session.setSession({
            id: 'mock-session',
            fullName: 'Usuario Demo',
            email: 'demo@playertech.com',
            academyId: role === 'super_admin' ? null : 'tenant-demo',
            academyName: role === 'super_admin' ? null : 'Academia Demo',
            roles: [this.mapLegacyRole(role)],
            role: this.mapLegacyRole(role),
            status: 'ACTIVE'
        });
    }

    logout() {
        this.session.clearSession();
    }

    canAccess(routePath: string): boolean {
        return this.isAuthenticated();
    }

    private mapRole(role: AuthRole): MockUserRole {
        switch (role) {
            case 'ROLE_ROOT':
                return 'super_admin';
            case 'ROLE_ACADEMY_ADMIN':
                return 'academy_admin';
            case 'ROLE_COACH':
                return 'staff';
            default:
                return 'tenant_owner';
        }
    }

    private mapLegacyRole(role: MockUserRole): AuthRole {
        switch (role) {
            case 'super_admin':
                return 'ROLE_ROOT';
            case 'academy_admin':
                return 'ROLE_ACADEMY_ADMIN';
            case 'staff':
                return 'ROLE_COACH';
            default:
                return 'ROLE_USER';
        }
    }
}
