export interface AcademyProfile {
    id: string | null;
    name: string;
    contactEmail: string;
    phone: string;
    countryCode: string;
    phoneNumber: string;
    country: string;
    department: string;
    city: string;
    address: string;
    status: 'ACTIVE' | 'SUSPENDED';
    statusLabel: string;
    shieldUrl?: string | null;
    shieldFileName?: string | null;
}

export interface AcademyTaxProfile {
    legalName: string;
    taxIdType: string;
    taxIdNumber: string;
    taxCheckDigit: string;
    taxRegime: string;
    billingEmail: string;
    fiscalAddress: string;
    fiscalCity: string;
    fiscalCountry: string;
}

export interface AcademyShieldResource {
    path: string;
    url: string;
    mimeType: string;
    size: number;
    checksum: string;
}

export interface AcademyAuditTrail {
    createdAt?: string | null;
    createdBy?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
}

export interface AcademyApiProfile {
    id: string;
    name: string;
    contactEmail: string;
    phone: string;
    country: string;
    department: string;
    city: string;
    address?: string | null;
    shield?: AcademyShieldResource | null;
    status?: string | null;
    audit?: AcademyAuditTrail | null;
    registrationSource?: string | null;
}

export interface AcademyApiTaxProfile {
    id?: string;
    taxIdType: string;
    taxIdNumber: string;
    taxCheckDigit?: string | null;
    taxRegime: string;
    billingEmail: string;
}

export interface AcademyApiEnvelope<T> {
    data?: T;
    meta?: unknown;
}

export interface AcademyProfileUpdateRequest {
    name: string;
    contactEmail: string;
    phone: string;
    country: string;
    department: string;
    city: string;
    address?: string;
}

export interface AcademyTaxProfileUpdateRequest {
    taxIdType: string;
    taxIdNumber: string;
    taxCheckDigit?: string;
    taxRegime: string;
    billingEmail: string;
}
