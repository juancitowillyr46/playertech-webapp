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
