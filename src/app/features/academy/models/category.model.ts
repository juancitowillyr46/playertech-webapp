export interface CategoryApiEnvelope<T> {
    data?: T;
    meta?: CategoryApiMeta | null;
}

export interface CategoryApiMeta {
    page?: number;
    pageNumber?: number;
    page_size?: number;
    pageSize?: number;
    size?: number;
    total?: number;
    totalItems?: number;
    total_pages?: number;
    totalPages?: number;
}

export interface CategoryApiCategory {
    id: string;
    academyId?: string | null;
    categoryKey?: string | null;
    name: string;
    minAge?: number | null;
    maxAge?: number | null;
    description?: string | null;
    status?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    [key: string]: unknown;
}

export interface CategoryListResult {
    data: CategoryApiCategory[];
    meta: CategoryApiMeta | null;
}

export interface CategoryUpsertRequest {
    categoryKey: string;
    name: string;
    minAge: number;
    maxAge: number;
    description?: string;
}

export interface CategoryStatusPatchResponse {
    data?: CategoryApiCategory | null;
    meta?: CategoryApiMeta | null;
}
