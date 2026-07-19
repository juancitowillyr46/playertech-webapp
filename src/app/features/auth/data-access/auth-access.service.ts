import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import { AuthCredentials, AuthUser, PasswordResetConfirm, PasswordResetRequest, PublicCategory, TenantActivationRequest, TenantActivationStatusResponse, TenantSignupRequest, TenantSignupResponse, TenantSignupSummary } from '@/app/core/auth/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthAccessService {
    private readonly signupSummaryStorageKey = 'playertech.signup.summary';

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

    signupTenant(payload: TenantSignupRequest): Observable<TenantSignupResponse> {
        return this.api.signupTenant(payload);
    }

    activateTenant(token: string, payload: TenantActivationRequest): Observable<TenantSignupResponse> {
        return this.api.activateTenant(token, payload);
    }

    checkTenantActivation(token: string): Observable<TenantActivationStatusResponse> {
        return this.api.checkTenantActivation(token);
    }

    getPublicCategories(): Observable<PublicCategory[]> {
        return this.api.getPublicCategories();
    }

    saveSignupSummary(summary: TenantSignupSummary): void {
        this.writeSignupSummary(summary);
    }

    loadSignupSummary(): TenantSignupSummary | null {
        return this.readSignupSummary();
    }

    clearSignupSummary(): void {
        this.writeSignupSummary(null);
    }

    requestPasswordReset(payload: PasswordResetRequest): Observable<void> {
        return this.api.requestPasswordReset(payload);
    }

    requestCurrentUserPasswordReset(): Observable<void> {
        return this.api.requestCurrentUserPasswordReset();
    }

    confirmPasswordReset(token: string, payload: PasswordResetConfirm): Observable<void> {
        return this.api.confirmPasswordReset(token, payload);
    }

    updateCurrentUserName(fullName: string): Observable<AuthUser> {
        return this.api.updateName(fullName).pipe(tap((user) => this.session.setSession(user)));
    }

    logout(): void {
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

    private readSignupSummary(): TenantSignupSummary | null {
        if (!this.canUseStorage()) {
            return null;
        }

        const raw = window.localStorage.getItem(this.signupSummaryStorageKey);
        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw) as TenantSignupSummary;
        } catch {
            return null;
        }
    }

    private writeSignupSummary(summary: TenantSignupSummary | null): void {
        if (!this.canUseStorage()) {
            return;
        }

        if (!summary) {
            window.localStorage.removeItem(this.signupSummaryStorageKey);
            return;
        }

        window.localStorage.setItem(this.signupSummaryStorageKey, JSON.stringify(summary));
    }

    private canUseStorage(): boolean {
        return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }
}
