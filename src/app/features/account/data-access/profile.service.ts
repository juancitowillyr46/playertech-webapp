import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { AuthApiService } from '@/app/core/auth/auth-api.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import { AuthRole, AuthUser } from '@/app/core/auth/auth.models';
import { UserProfile } from '../models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly profileStore = signal<UserProfile | null>(null);
    readonly currentProfile = signal<UserProfile>(this.emptyProfile());

    constructor(
        private readonly authApi: AuthApiService,
        private readonly session: AuthSessionService
    ) {}

    getCurrentProfile(): UserProfile {
        const current = this.profileStore() ?? this.buildProfile(this.session.getUser()) ?? this.emptyProfile();
        return { ...current, roles: [...current.roles] };
    }

    loadCurrentProfile(): Observable<UserProfile> {
        return this.authApi.me().pipe(
            map((user) => this.buildProfile(user) ?? this.emptyProfile()),
            tap((profile) => {
                this.profileStore.set(profile);
                this.currentProfile.set(profile);
                this.session.setSession(this.toAuthUser(profile, this.session.getUser()));
            })
        );
    }

    updateCurrentProfileName(fullName: string): Observable<UserProfile> {
        return this.authApi.updateName(fullName).pipe(
            map((user) => this.buildProfile(user) ?? this.emptyProfile()),
            tap((profile) => {
                this.profileStore.set(profile);
                this.currentProfile.set(profile);
                this.session.setSession(this.toAuthUser(profile, this.session.getUser()));
            })
        );
    }

    private buildProfile(user: AuthUser | null): UserProfile | null {
        if (!user) {
            return null;
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
            primaryRoleLabel: this.session.getRoleLabel(primaryRole),
            contextLabel: this.resolveContextLabel(user),
            status: (user.status as UserProfile['status']) ?? 'ACTIVE',
            statusLabel: this.resolveStatusLabel(user.status)
        };
    }

    private resolveContextLabel(user: AuthUser): string {
        if (user.role === 'ROLE_ROOT') {
            return 'Contexto de plataforma';
        }

        return user.academyName ?? user.academyId ?? 'Sin contexto asociado';
    }

    private resolveStatusLabel(status?: string | null): string {
        switch (status) {
            case 'ACTIVE':
                return 'Activa';
            case 'INACTIVE':
                return 'Inactiva';
            case 'PENDING':
                return 'Pendiente';
            default:
                return 'Sin estado';
        }
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

    private emptyProfile(): UserProfile {
        return {
            id: '',
            fullName: '',
            email: '',
            academyId: null,
            academyName: null,
            roles: ['ROLE_USER'],
            primaryRole: 'ROLE_USER',
            primaryRoleLabel: this.session.getRoleLabel('ROLE_USER'),
            contextLabel: 'Sin sesión',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        };
    }
}
