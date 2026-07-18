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
}

export interface ApiEnvelope<T> {
    data?: T;
    meta?: unknown;
    message?: string;
}

export interface TenantSignupRequest {
    name: string;
    contactEmail: string;
    contactName: string;
    password: string;
    phone: string;
    country: string;
    department: string;
    address: string;
    city: string;
    categoryId: string;
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
    address?: string;
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
