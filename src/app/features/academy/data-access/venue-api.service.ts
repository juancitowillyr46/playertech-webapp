import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';
import { VenueApiEnvelope, VenueApiMeta, VenueApiVenue, VenueListResult, VenueStatusPatchResponse, VenueUpsertRequest } from '../models/venue.model';

@Injectable({
    providedIn: 'root'
})
export class VenueApiService {
    private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

    constructor(private readonly http: HttpClient) {}

    list(params?: Record<string, string | number | boolean | undefined>): Observable<VenueListResult> {
        return this.http
            .get<VenueApiEnvelope<VenueApiVenue[]> | VenueApiVenue[]>(this.url('/api/v1/academy/venues'), { params: this.toHttpParams(params) })
            .pipe(
                map((response) => this.unwrapList(response)),
                catchError((error) => throwError(() => this.normalizeError(error)))
            );
    }

    getById(venueId: string): Observable<VenueApiVenue> {
        return this.http.get<VenueApiEnvelope<VenueApiVenue> | VenueApiVenue>(this.url(`/api/v1/academy/venues/${encodeURIComponent(venueId)}`)).pipe(
            map((response) => this.unwrapItem(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    create(payload: VenueUpsertRequest): Observable<VenueApiVenue> {
        return this.http.post<VenueApiEnvelope<VenueApiVenue> | VenueApiVenue>(this.url('/api/v1/academy/venues'), payload).pipe(
            map((response) => this.unwrapItem(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    update(venueId: string, payload: VenueUpsertRequest): Observable<VenueApiVenue> {
        return this.http.put<VenueApiEnvelope<VenueApiVenue> | VenueApiVenue>(this.url(`/api/v1/academy/venues/${encodeURIComponent(venueId)}`), payload).pipe(
            map((response) => this.unwrapItem(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    activate(venueId: string): Observable<void | VenueStatusPatchResponse> {
        return this.http.patch<void | VenueStatusPatchResponse>(this.url(`/api/v1/academy/venues/${encodeURIComponent(venueId)}/activate`), {}).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    inactivate(venueId: string): Observable<void | VenueStatusPatchResponse> {
        return this.http.patch<void | VenueStatusPatchResponse>(this.url(`/api/v1/academy/venues/${encodeURIComponent(venueId)}/inactivate`), {}).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    delete(venueId: string): Observable<void> {
        return this.http.delete<void>(this.url(`/api/v1/academy/venues/${encodeURIComponent(venueId)}`)).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    private unwrapList(response: VenueApiEnvelope<VenueApiVenue[]> | VenueApiVenue[]): VenueListResult {
        if (Array.isArray(response)) {
            return { data: response, meta: null };
        }

        return { data: Array.isArray(response.data) ? response.data : [], meta: this.normalizeMeta(response.meta) };
    }

    private unwrapItem(response: VenueApiEnvelope<VenueApiVenue> | VenueApiVenue): VenueApiVenue {
        if (typeof response === 'object' && response !== null && 'data' in response && response.data) {
            return response.data as VenueApiVenue;
        }

        return response as VenueApiVenue;
    }

    private normalizeMeta(meta: VenueApiMeta | null | undefined): VenueApiMeta | null {
        return meta ?? null;
    }

    private normalizeError(error: unknown): AuthErrorLike {
        if (error instanceof HttpErrorResponse) {
            const detail = this.extractErrorText(error.error, ['detail', 'message', 'title', 'error']);
            return { status: error.status, message: detail ?? error.statusText ?? 'Request failed', detail };
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

    private toHttpParams(params?: Record<string, string | number | boolean | undefined>) {
        const httpParams: Record<string, string> = {};
        for (const [key, value] of Object.entries(params ?? {})) {
            if (value !== undefined && value !== null && `${value}`.trim()) {
                httpParams[key] = `${value}`;
            }
        }
        return httpParams;
    }

    private url(path: string): string {
        return `${this.baseUrl}${path}`;
    }
}
