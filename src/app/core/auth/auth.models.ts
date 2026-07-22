export type AuthRole = 'ROLE_ROOT' | 'ROLE_ACADEMY_ADMIN' | 'ROLE_COACH' | 'ROLE_USER' | string;

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    password: string;
    passwordConfirmation: string;
}

export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    roles: AuthRole[];
    role: AuthRole;
    academyId: string | null;
    academyName: string | null;
    status?: string | null;
    token?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
}

export interface AuthSessionState {
    authenticated: boolean;
    user: AuthUser | null;
    tenantContext?: AcademyContext | null;
}

export interface ApiEnvelope<T> {
    data?: T;
    meta?: unknown;
    message?: string;
}

export interface PublicCategory {
    id: string;
    code: string;
    name: string;
    minAge: number;
    maxAge: number;
    description: string;
    status: string;
}

export interface PublicCategoryListResponse {
    data: PublicCategory[];
}

export interface TenantAvailabilityResponse {
    data?: {
        contactEmailAvailable?: boolean;
        phoneAvailable?: boolean;
    };
    meta?: unknown;
}

export interface TenantSignupRequest {
    name: string;
    contactEmail: string;
    contactName: string;
    password: string;
    phone: string;
    country: string;
    department: string;
    city: string;
    onboardingCategoryId: string;
    teamName: string;
    acceptedTerms: boolean;
    acceptedDataProcessing: boolean;
}

export interface TenantSignupAcademy {
    id?: string;
    name?: string;
    contactEmail?: string;
    contactName?: string;
    phone?: string;
    country?: string;
    department?: string;
    city?: string;
    categoryId?: string;
    status?: string;
}

export interface TenantSignupAdmin {
    id?: string;
    fullName?: string;
    email?: string;
    role?: string;
    status?: string;
}

export interface TenantSignupTeam {
    id?: string;
    name?: string;
    categoryId?: string;
    status?: string;
}

export interface TenantSignupResponse {
    academy?: TenantSignupAcademy;
    admin?: TenantSignupAdmin;
    team?: TenantSignupTeam;
    activationRequired?: boolean;
    activationEmailSent?: boolean;
    message?: string;
}

export interface TenantActivationRequest {
    password: string;
    passwordConfirmation: string;
}

export interface TenantActivationStatus {
    email?: string;
    status?: string;
    activated?: boolean;
    alreadyActivated?: boolean;
}

export interface TenantActivationStatusResponse {
    data?: TenantActivationStatus;
    meta?: unknown;
}

export interface TenantSignupSummary {
    academyName: string;
    contactEmail: string;
    contactName: string;
    teamName: string;
    activationRequired: boolean;
    activationEmailSent: boolean;
}

export interface AcademyContext {
    mode: 'tenant' | 'platform' | string;
    userId: string;
    academyId: string | null;
    role: AuthRole;
    roles: AuthRole[];
}

export interface AcademyContextResponse {
    data?: AcademyContext;
    meta?: unknown;
}
