import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiEnvelope, AuthCredentials, AuthUser, PasswordResetConfirm, PasswordResetRequest, TenantActivationRequest, TenantSignupRequest, TenantSignupResponse } from './auth.models';
import { environment } from '../../../environments/environment';

export interface AuthErrorLike {
    status: number;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthApiService {
    constructor(private readonly http: HttpClient) {}

    private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

    login(credentials: AuthCredentials): Observable<AuthUser> {
        return this.http.post<ApiEnvelope<AuthUser> | AuthUser>(this.url('/api/v1/auth/login'), credentials).pipe(
            map((response) => this.unwrapUser(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    me(): Observable<AuthUser> {
        return this.http.get<ApiEnvelope<AuthUser> | AuthUser>(this.url('/api/v1/auth/me')).pipe(
            map((response) => this.unwrapUser(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    activateUser(token: string, payload: PasswordResetConfirm): Observable<AuthUser> {
        return this.http.post<ApiEnvelope<AuthUser> | AuthUser>(this.url(`/api/v1/public/users/activate/${encodeURIComponent(token)}`), payload).pipe(
            map((response) => this.unwrapUser(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    signupTenant(payload: TenantSignupRequest): Observable<TenantSignupResponse> {
        return this.http.post<ApiEnvelope<TenantSignupResponse> | TenantSignupResponse>(this.url('/api/v1/public/tenants/signup'), payload).pipe(
            map((response) => this.unwrapResponse(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    activateTenant(token: string, payload: TenantActivationRequest): Observable<TenantSignupResponse> {
        return this.http.post<ApiEnvelope<TenantSignupResponse> | TenantSignupResponse>(this.url(`/api/v1/public/tenants/activate/${encodeURIComponent(token)}`), payload).pipe(
            map((response) => this.unwrapResponse(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    requestPasswordReset(payload: PasswordResetRequest): Observable<void> {
        return this.http.post<void>(this.url('/api/v1/public/users/password-reset/request'), payload).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    confirmPasswordReset(token: string, payload: PasswordResetConfirm): Observable<void> {
        return this.http.post<void>(this.url(`/api/v1/public/users/password-reset/confirm/${encodeURIComponent(token)}`), payload).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    updateName(fullName: string): Observable<AuthUser> {
        return this.http.put<ApiEnvelope<AuthUser> | AuthUser>(this.url('/api/v1/auth/me/name'), { fullName }).pipe(
            map((response) => this.unwrapUser(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    private unwrapUser(response: ApiEnvelope<AuthUser> | AuthUser): AuthUser {
        if (typeof response === 'object' && response !== null && 'data' in response && response.data) {
            return response.data;
        }

        return response as AuthUser;
    }

    private unwrapResponse<T>(response: ApiEnvelope<T> | T): T {
        if (typeof response === 'object' && response !== null && 'data' in response && response.data) {
            return response.data;
        }

        return response as T;
    }

    private normalizeError(error: unknown): AuthErrorLike {
        if (error instanceof HttpErrorResponse) {
            const message = typeof error.error?.message === 'string' ? error.error.message : error.statusText || 'Request failed';
            return { status: error.status, message };
        }

        return { status: 0, message: 'Unexpected error' };
    }

    private url(path: string): string {
        if (!this.baseUrl) {
            return path;
        }

        return `${this.baseUrl}${path}`;
    }
}
