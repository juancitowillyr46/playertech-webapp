import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import { AuthCredentials, AuthUser, PasswordResetConfirm, PasswordResetRequest } from '@/app/core/auth/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthAccessService {
    constructor(
        private readonly api: AuthApiService,
        private readonly session: AuthSessionService
    ) {}

    login(credentials: AuthCredentials): Observable<AuthUser> {
        return this.api.login(credentials).pipe(tap((user) => this.session.setSession(user)));
    }

    loadSession(): Observable<AuthUser> {
        return this.api.me().pipe(tap((user) => this.session.setSession(user)));
    }

    activateUser(token: string, payload: PasswordResetConfirm): Observable<AuthUser> {
        return this.api.activateUser(token, payload).pipe(tap((user) => this.session.setSession(user)));
    }

    requestPasswordReset(payload: PasswordResetRequest) {
        return this.api.requestPasswordReset(payload);
    }

    confirmPasswordReset(token: string, payload: PasswordResetConfirm) {
        return this.api.confirmPasswordReset(token, payload);
    }

    updateCurrentUserName(fullName: string): Observable<AuthUser> {
        return this.api.updateName(fullName).pipe(tap((user) => this.session.setSession(user)));
    }

    logout() {
        this.session.clearSession();
    }

    isAuthenticated(): boolean {
        return this.session.isLoggedIn();
    }

    getRole() {
        return this.session.primaryRole();
    }

    getUser() {
        return this.session.getUser();
    }

    getHomeRoute(): string {
        return this.session.getHomeRoute();
    }
}
