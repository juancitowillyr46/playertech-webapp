import { Injectable } from '@angular/core';
import { MockAuthService, MockUserRole } from '../../../core/auth/mock-auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthAccessService {
    constructor(private readonly mockAuth: MockAuthService) {}

    login(role: MockUserRole = 'tenant_owner') {
        this.mockAuth.login(role);
    }

    logout() {
        this.mockAuth.logout();
    }

    isAuthenticated(): boolean {
        return this.mockAuth.isAuthenticated();
    }

    getRole(): MockUserRole {
        return this.mockAuth.getRole();
    }
}
