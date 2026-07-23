import { AcademyContext, AuthRole, AuthSessionState, AuthUser } from './auth.models';

const ROLE_LABELS: Record<Extract<AuthRole, 'ROLE_ROOT' | 'ROLE_ACADEMY_ADMIN' | 'ROLE_COACH' | 'ROLE_USER'>, string> = {
    ROLE_ROOT: 'Plataforma',
    ROLE_ACADEMY_ADMIN: 'Administrador de academia',
    ROLE_COACH: 'Entrenador',
    ROLE_USER: 'Usuario base'
};

const HOME_ROUTES: Partial<Record<Extract<AuthRole, 'ROLE_ROOT' | 'ROLE_ACADEMY_ADMIN' | 'ROLE_COACH' | 'ROLE_USER'>, string>> = {
    ROLE_ROOT: '/',
    ROLE_ACADEMY_ADMIN: '/academy',
    ROLE_COACH: '/academy',
    ROLE_USER: '/account/profile'
};

export function normalizeAuthUser(user: AuthUser): AuthUser {
    const roles = Array.from(new Set((user.roles?.length ? user.roles : [user.role]).filter(Boolean))) as AuthRole[];

    return {
        ...user,
        roles,
        role: user.role || roles[0] || 'ROLE_USER',
        academyId: user.academyId ?? null,
        academyName: user.academyName ?? null,
        token: user.token ?? null,
        accessToken: user.accessToken ?? null,
        refreshToken: user.refreshToken ?? null,
        status: user.status ?? null
    };
}

export function normalizeAcademyContext(context: AcademyContext): AcademyContext {
    return {
        ...context,
        academyId: context.academyId ?? null,
        roles: Array.from(new Set((context.roles?.length ? context.roles : [context.role]).filter(Boolean))) as AuthRole[],
        role: context.role || context.roles?.[0] || 'ROLE_USER'
    };
}

export function normalizeAuthSessionState(state: AuthSessionState): AuthSessionState {
    if (!state?.user) {
        return { authenticated: false, user: null };
    }

    return {
        authenticated: !!state.authenticated,
        user: normalizeAuthUser(state.user),
        tenantContext: state.tenantContext ? normalizeAcademyContext(state.tenantContext) : null
    };
}

export function getAuthRoleLabel(role: AuthRole): string {
    return (ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role) || 'Sin rol';
}

export function getAuthHomeRoute(role: AuthRole | null): string {
    return HOME_ROUTES[role as keyof typeof HOME_ROUTES] ?? '/account/profile';
}

export function getAuthContextLabel(user: AuthUser | null): string {
    if (!user) {
        return 'Sin sesión';
    }

    if (user.role === 'ROLE_ROOT') {
        return 'Contexto de plataforma';
    }

    return user.academyName ?? user.academyId ?? 'Contexto tenant';
}
