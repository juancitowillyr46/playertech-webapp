export interface VenueApiEnvelope<T> {
    data?: T;
    meta?: VenueApiMeta | null;
}

export interface VenueApiMeta {
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

export interface VenueApiVenue {
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    department?: string | null;
    phone?: string | null;
    notes?: string | null;
    isPrimary?: boolean | null;
    status?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    [key: string]: unknown;
}

export interface VenueListResult {
    data: VenueApiVenue[];
    meta: VenueApiMeta | null;
}

export interface VenueUpsertRequest {
    name: string;
    address?: string;
    city?: string;
    country?: string;
    department?: string;
    phone?: string;
    notes?: string;
}

export interface VenueStatusPatchResponse {
    data?: VenueApiVenue | null;
    meta?: VenueApiMeta | null;
}
