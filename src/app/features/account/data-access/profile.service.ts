import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import { AuthUser } from '@/app/core/auth/auth.models';
import { getAuthContextLabel, getAuthRoleLabel } from '@/app/core/auth/auth.mapper';
import { UserProfile } from '../models/profile.model';
import { AuthRole } from '@/app/core/auth/auth.models';

function createEmptyProfile(): UserProfile {
    return {
        id: '',
        fullName: '',
        email: '',
        academyId: null,
        academyName: null,
        roles: ['ROLE_USER'],
        primaryRole: 'ROLE_USER',
        primaryRoleLabel: getAuthRoleLabel('ROLE_USER'),
        contextLabel: 'Sin sesión',
        status: 'ACTIVE',
        statusLabel: 'Activa'
    };
}

function resolveStatusLabel(status?: string | null): UserProfile['statusLabel'] {
    if (status === 'ACTIVE') {
        return 'Activa';
    }

    if (status === 'INACTIVE') {
        return 'Inactiva';
    }

    if (status === 'PENDING') {
        return 'Pendiente';
    }

    return 'Sin estado';
}

function mapUserToProfile(user: AuthUser | null): UserProfile {
    if (!user) {
        return createEmptyProfile();
    }

    const primaryRole = user.role ?? user.roles?.[0] ?? 'ROLE_USER';

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        academyId: user.academyId ?? null,
        academyName: user.academyName ?? null,
        roles: user.roles?.length ? [...user.roles] : [primaryRole],
        primaryRole,
        primaryRoleLabel: getAuthRoleLabel(primaryRole),
        contextLabel: getAuthContextLabel(user),
        status: (user.status as UserProfile['status']) ?? 'ACTIVE',
        statusLabel: resolveStatusLabel(user.status)
    };
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    readonly currentProfile = signal<UserProfile>(createEmptyProfile());

    constructor(
        private readonly authApi: AuthApiService,
        private readonly session: AuthSessionService
    ) {
        this.currentProfile.set(mapUserToProfile(this.session.getUser()));
    }

    getCurrentProfile(): UserProfile {
        const current = this.currentProfile();
        return { ...current, roles: [...current.roles] };
    }

    loadCurrentProfile(): Observable<UserProfile> {
        return this.authApi.me().pipe(
            map((user) => mapUserToProfile(user)),
            tap((profile) => {
                this.currentProfile.set(profile);
                this.session.setSession(this.toAuthUser(profile, this.session.getUser()));
            })
        );
    }

    updateCurrentProfileName(fullName: string): Observable<UserProfile> {
        return this.authApi.updateName(fullName).pipe(
            map((user) => mapUserToProfile(user)),
            tap((profile) => {
                this.currentProfile.set(profile);
                this.session.setSession(this.toAuthUser(profile, this.session.getUser()));
            })
        );
    }

    private toAuthUser(profile: UserProfile, previousUser: AuthUser | null): AuthUser {
        return {
            id: profile.id,
            fullName: profile.fullName,
            email: profile.email,
            academyId: profile.academyId,
            academyName: profile.academyName,
            roles: profile.roles.length ? profile.roles : [profile.primaryRole],
            role: profile.primaryRole,
            status: profile.status,
            token: previousUser?.token ?? null,
            accessToken: previousUser?.accessToken ?? null,
            refreshToken: previousUser?.refreshToken ?? null
        };
    }

}
