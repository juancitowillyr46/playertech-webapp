import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    AcademyApiEnvelope,
    AcademyApiProfile,
    AcademyApiTaxProfile,
    AcademyProfile,
    AcademyProfileUpdateRequest,
    AcademyShieldResource,
    AcademyTaxProfile,
    AcademyTaxProfileUpdateRequest
} from '../models/academy.model';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';

@Injectable({
    providedIn: 'root'
})
export class AcademyApiService {
    private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

    constructor(private readonly http: HttpClient) {}

    getProfile(): Observable<AcademyApiProfile> {
        return this.http.get<AcademyApiEnvelope<AcademyApiProfile> | AcademyApiProfile>(this.url('/api/v1/academy/me')).pipe(
            map((response) => this.unwrap(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    updateProfile(payload: AcademyProfileUpdateRequest): Observable<AcademyApiProfile> {
        return this.http.put<AcademyApiEnvelope<AcademyApiProfile> | AcademyApiProfile>(this.url('/api/v1/academy/me'), payload).pipe(
            map((response) => this.unwrap(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    getTaxProfile(): Observable<AcademyApiTaxProfile> {
        return this.http.get<AcademyApiEnvelope<AcademyApiTaxProfile> | AcademyApiTaxProfile>(this.url('/api/v1/academy/me/tax-profile')).pipe(
            map((response) => this.unwrap(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    updateTaxProfile(payload: AcademyTaxProfileUpdateRequest): Observable<AcademyApiTaxProfile> {
        return this.http.put<AcademyApiEnvelope<AcademyApiTaxProfile> | AcademyApiTaxProfile>(this.url('/api/v1/academy/me/tax-profile'), payload).pipe(
            map((response) => this.unwrap(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    uploadShield(shield: Blob): Observable<AcademyApiProfile> {
        const formData = new FormData();
        formData.append('shield', shield);

        return this.http.post<AcademyApiEnvelope<AcademyApiProfile> | AcademyApiProfile>(this.url('/api/v1/academy/me/shield'), formData).pipe(
            map((response) => this.unwrap(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    mapProfile(apiProfile: AcademyApiProfile): AcademyProfile {
        return {
            id: apiProfile.id,
            name: apiProfile.name ?? '',
            contactEmail: apiProfile.contactEmail ?? '',
            phone: apiProfile.phone ?? '',
            countryCode: this.resolveCountryCode(apiProfile.phone),
            phoneNumber: this.resolvePhoneNumber(apiProfile.phone),
            country: apiProfile.country ?? '',
            department: apiProfile.department ?? '',
            city: apiProfile.city ?? '',
            address: apiProfile.address ?? '',
            status: this.resolveStatus(apiProfile.status),
            statusLabel: this.resolveStatusLabel(apiProfile.status),
            shieldUrl: apiProfile.shield?.url ?? null,
            shieldFileName: apiProfile.shield?.url ? this.extractFileName(apiProfile.shield.url) : null
        };
    }

    mapTaxProfile(apiTaxProfile: AcademyApiTaxProfile, academy?: AcademyProfile | null): AcademyTaxProfile {
        return {
            legalName: academy?.name ?? '',
            taxIdType: apiTaxProfile.taxIdType ?? '',
            taxIdNumber: apiTaxProfile.taxIdNumber ?? '',
            taxCheckDigit: apiTaxProfile.taxCheckDigit ?? '',
            taxRegime: apiTaxProfile.taxRegime ?? '',
            billingEmail: apiTaxProfile.billingEmail ?? '',
            fiscalAddress: academy?.address ?? '',
            fiscalCity: academy?.city ?? '',
            fiscalCountry: academy?.country ?? ''
        };
    }

    private unwrap<T>(response: AcademyApiEnvelope<T> | T): T {
        if (typeof response === 'object' && response !== null && 'data' in response && response.data !== undefined) {
            return response.data;
        }

        return response as T;
    }

    private normalizeError(error: unknown): AuthErrorLike {
        if (typeof error === 'object' && error !== null && 'status' in error) {
            const httpError = error as { status?: number; error?: unknown; statusText?: string };
            const detail = this.extractErrorText(httpError.error, ['detail', 'message', 'title']);
            return {
                status: httpError.status ?? 0,
                message: detail ?? httpError.statusText ?? 'Request failed',
                detail
            };
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

    private resolveStatus(status?: string | null): AcademyProfile['status'] {
        return status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE';
    }

    private resolveStatusLabel(status?: string | null): string {
        switch (status) {
            case 'SUSPENDED':
                return 'Suspendida';
            case 'ACTIVE':
            default:
                return 'Activa';
        }
    }

    private resolveCountryCode(phone: string): string {
        const normalized = phone.replace(/\s+/g, '');

        if (normalized.startsWith('+57')) {
            return '+57';
        }
        if (normalized.startsWith('+51')) {
            return '+51';
        }
        if (normalized.startsWith('+56')) {
            return '+56';
        }
        if (normalized.startsWith('+593')) {
            return '+593';
        }
        if (normalized.startsWith('+52')) {
            return '+52';
        }
        if (normalized.startsWith('+34')) {
            return '+34';
        }

        return '+57';
    }

    private resolvePhoneNumber(phone: string): string {
        const normalized = phone.replace(/\s+/g, '');
        const countryCode = this.resolveCountryCode(normalized);

        if (normalized.startsWith(countryCode)) {
            return normalized.slice(countryCode.length).trim();
        }

        return normalized.replace(/^\+\d+/, '').trim();
    }

    private extractFileName(url: string): string {
        try {
            const pathname = new URL(url).pathname;
            return pathname.split('/').filter(Boolean).pop() ?? 'Escudo institucional';
        } catch {
            return 'Escudo institucional';
        }
    }

    private url(path: string): string {
        return `${this.baseUrl}${path}`;
    }
}
