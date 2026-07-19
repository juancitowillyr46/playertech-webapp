import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AcademyContext, AcademyContextResponse, ApiEnvelope, AuthCredentials, AuthUser, PasswordResetConfirm, PasswordResetRequest, PublicCategory, PublicCategoryListResponse, TenantActivationRequest, TenantActivationStatusResponse, TenantSignupRequest, TenantSignupResponse } from './auth.models';
import { environment } from '../../../environments/environment';

export interface AuthErrorLike {
    status: number;
    message: string;
    detail?: string;
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

    academyContext(): Observable<AcademyContext> {
        return this.http.get<ApiEnvelope<AcademyContext> | AcademyContextResponse | AcademyContext>(this.url('/api/v1/academy/context')).pipe(
            map((response) => this.unwrapAcademyContext(response)),
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

    getPublicCategories(): Observable<PublicCategory[]> {
        return this.http.get<ApiEnvelope<PublicCategory[]> | PublicCategoryListResponse | PublicCategory[]>(this.url('/api/v1/public/categories')).pipe(
            map((response) => this.unwrapArrayResponse(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    activateTenant(token: string, payload: TenantActivationRequest): Observable<TenantSignupResponse> {
        return this.http.post<ApiEnvelope<TenantSignupResponse> | TenantSignupResponse>(this.url(`/api/v1/public/tenants/activate/${encodeURIComponent(token)}`), payload).pipe(
            map((response) => this.unwrapResponse(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    checkTenantActivation(token: string): Observable<TenantActivationStatusResponse> {
        return this.http.get<TenantActivationStatusResponse>(this.url(`/api/v1/public/tenants/activate/${encodeURIComponent(token)}`)).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    requestPasswordReset(payload: PasswordResetRequest): Observable<void> {
        return this.http.post<void>(this.url('/api/v1/public/users/password-reset/request'), payload).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    requestCurrentUserPasswordReset(): Observable<void> {
        return this.http.post<void>(this.url('/api/v1/auth/me/password-reset/request'), undefined).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
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
        if (typeof response === 'object' && response !== null && 'data' in response && response.data !== undefined) {
            return response.data;
        }

        return response as AuthUser;
    }

    private unwrapResponse<T>(response: ApiEnvelope<T> | T): T {
        if (typeof response === 'object' && response !== null && 'data' in response && response.data !== undefined) {
            return response.data;
        }

        return response as T;
    }

    private unwrapAcademyContext(response: ApiEnvelope<AcademyContext> | AcademyContextResponse | AcademyContext): AcademyContext {
        if (typeof response === 'object' && response !== null && 'data' in response && response.data !== undefined) {
            return response.data as AcademyContext;
        }

        return response as AcademyContext;
    }

    private unwrapArrayResponse(response: ApiEnvelope<PublicCategory[]> | PublicCategoryListResponse | PublicCategory[]): PublicCategory[] {
        if (Array.isArray(response)) {
            return response;
        }

        if (typeof response === 'object' && response !== null && 'data' in response && Array.isArray(response.data)) {
            return response.data;
        }

        return [];
    }

    private normalizeError(error: unknown): AuthErrorLike {
        if (error instanceof HttpErrorResponse) {
            const payload = error.error;
            const detail = this.extractErrorText(payload, ['detail', 'message', 'title']);
            const message = detail ?? error.statusText ?? 'Request failed';
            return { status: error.status, message, detail };
        }

        return { status: 0, message: 'Unexpected error' };
    }

    private extractErrorText(payload: unknown, keys: string[]): string | undefined {
        if (!payload || typeof payload !== 'object') {
            return undefined;
        }

        for (const key of keys) {
            const value = (payload as Record<string, unknown>)[key];
            if (typeof value === 'string' && value.trim()) {
                return value.trim();
            }
        }

        return undefined;
    }

    private url(path: string): string {
        if (!this.baseUrl) {
            return path;
        }

        return `${this.baseUrl}${path}`;
    }
}
