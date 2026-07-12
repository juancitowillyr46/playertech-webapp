import { computed, Injectable, signal } from '@angular/core';
import { MockAuthService, MockUserRole } from '@/app/core/auth/mock-auth.service';
import { UserProfile } from '../models/profile.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private readonly store = signal<Record<MockUserRole, UserProfile>>({
        super_admin: {
            id: 'usr-root-001',
            fullName: 'Administrador Plataforma',
            email: 'admin@playertech.com',
            academyId: null,
            academyName: null,
            roles: ['ROLE_ROOT'],
            role: 'super_admin',
            roleLabel: 'Super Admin',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        },
        tenant_owner: {
            id: 'usr-ten-001',
            fullName: 'Juan Rodas',
            email: 'juan.rodas@playertech.com',
            academyId: 'ten-001',
            academyName: 'Academia PlayerTech Demo',
            roles: ['ROLE_OWNER'],
            role: 'tenant_owner',
            roleLabel: 'Owner',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        },
        academy_admin: {
            id: 'usr-acd-001',
            fullName: 'María Pérez',
            email: 'maria.perez@playertech.com',
            academyId: 'ten-002',
            academyName: 'Club Deportivo Norte',
            roles: ['ROLE_ACADEMY_ADMIN'],
            role: 'academy_admin',
            roleLabel: 'Administrador de academia',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        },
        staff: {
            id: 'usr-stf-001',
            fullName: 'Carlos Gómez',
            email: 'carlos.gomez@playertech.com',
            academyId: 'ten-003',
            academyName: 'Escuela Gol Azul',
            roles: ['ROLE_STAFF'],
            role: 'staff',
            roleLabel: 'Staff',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        }
    });

    readonly currentProfile = computed(() => this.store()[this.auth.getRole()]);

    constructor(private readonly auth: MockAuthService) {}

    getCurrentProfile(): UserProfile {
        return { ...this.currentProfile(), roles: [...this.currentProfile().roles] };
    }

    updateCurrentProfileName(fullName: string) {
        const currentRole = this.auth.getRole();
        this.store.update((profiles) => ({
            ...profiles,
            [currentRole]: {
                ...profiles[currentRole],
                fullName: fullName.trim()
            }
        }));
    }
}
