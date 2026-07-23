import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';
import {
    CategoryApiCategory,
    CategoryApiEnvelope,
    CategoryApiMeta,
    CategoryListResult,
    CategoryStatusPatchResponse,
    CategoryUpsertRequest
} from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryApiService {
    private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

    constructor(private readonly http: HttpClient) {}

    list(params?: Record<string, string | number | boolean | undefined>): Observable<CategoryListResult> {
        return this.http
            .get<CategoryApiEnvelope<CategoryApiCategory[]> | CategoryApiCategory[]>(this.url('/api/v1/academy/categories'), { params: this.toHttpParams(params) })
            .pipe(
                map((response) => this.unwrapList(response)),
                catchError((error) => throwError(() => this.normalizeError(error)))
            );
    }

    getById(categoryId: string): Observable<CategoryApiCategory> {
        return this.http.get<CategoryApiEnvelope<CategoryApiCategory> | CategoryApiCategory>(this.url(`/api/v1/academy/categories/${encodeURIComponent(categoryId)}`)).pipe(
            map((response) => this.unwrapItem(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    create(payload: CategoryUpsertRequest): Observable<CategoryApiCategory> {
        return this.http.post<CategoryApiEnvelope<CategoryApiCategory> | CategoryApiCategory>(this.url('/api/v1/academy/categories'), payload).pipe(
            map((response) => this.unwrapItem(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    update(categoryId: string, payload: CategoryUpsertRequest): Observable<CategoryApiCategory> {
        return this.http.put<CategoryApiEnvelope<CategoryApiCategory> | CategoryApiCategory>(this.url(`/api/v1/academy/categories/${encodeURIComponent(categoryId)}`), payload).pipe(
            map((response) => this.unwrapItem(response)),
            catchError((error) => throwError(() => this.normalizeError(error)))
        );
    }

    activate(categoryId: string): Observable<void | CategoryStatusPatchResponse> {
        return this.http.patch<void | CategoryStatusPatchResponse>(this.url(`/api/v1/academy/categories/${encodeURIComponent(categoryId)}/activate`), {}).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    inactivate(categoryId: string): Observable<void | CategoryStatusPatchResponse> {
        return this.http.patch<void | CategoryStatusPatchResponse>(this.url(`/api/v1/academy/categories/${encodeURIComponent(categoryId)}/inactivate`), {}).pipe(catchError((error) => throwError(() => this.normalizeError(error))));
    }

    private unwrapList(response: CategoryApiEnvelope<CategoryApiCategory[]> | CategoryApiCategory[]): CategoryListResult {
        if (Array.isArray(response)) {
            return { data: response, meta: null };
        }

        return { data: Array.isArray(response.data) ? response.data : [], meta: this.normalizeMeta(response.meta) };
    }

    private unwrapItem(response: CategoryApiEnvelope<CategoryApiCategory> | CategoryApiCategory): CategoryApiCategory {
        if (typeof response === 'object' && response !== null && 'data' in response && response.data) {
            return response.data as CategoryApiCategory;
        }

        return response as CategoryApiCategory;
    }

    private normalizeMeta(meta: CategoryApiMeta | null | undefined): CategoryApiMeta | null {
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
