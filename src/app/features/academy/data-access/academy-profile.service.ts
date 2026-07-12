import { Injectable, signal } from '@angular/core';
import { MockAuthService, MockUserRole } from '@/app/core/auth/mock-auth.service';
import { AcademyProfile } from '../models/academy.model';

@Injectable({
    providedIn: 'root'
})
export class AcademyProfileService {
    private readonly store = signal<Record<MockUserRole, AcademyProfile | null>>({
        super_admin: null,
        tenant_owner: {
            id: 'ten-001',
            name: 'Academia PlayerTech Demo',
            contactEmail: 'contacto@playertechdemo.com',
            phone: '+57 3123456789',
            countryCode: '+57',
            phoneNumber: '3123456789',
            country: 'Colombia',
            department: 'Risaralda',
            city: 'Pereira',
            address: 'Calle 10 # 20-30',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        },
        academy_admin: {
            id: 'ten-002',
            name: 'Club Deportivo Norte',
            contactEmail: 'contacto@clubnorte.com',
            phone: '+51 987654321',
            countryCode: '+51',
            phoneNumber: '987654321',
            country: 'Perú',
            department: 'Lima',
            city: 'Lima',
            address: 'Av. Central 245',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        },
        staff: {
            id: 'ten-003',
            name: 'Escuela Gol Azul',
            contactEmail: 'contacto@golazul.com',
            phone: '+56 987654321',
            countryCode: '+56',
            phoneNumber: '987654321',
            country: 'Chile',
            department: 'Santiago',
            city: 'Santiago',
            address: 'Pasaje Sur 120',
            status: 'ACTIVE',
            statusLabel: 'Activa'
        }
    });

    constructor(private readonly auth: MockAuthService) {}

    getCurrentAcademy(): AcademyProfile | null {
        const current = this.store()[this.auth.getRole()];
        return current ? { ...current } : null;
    }

    updateCurrentAcademy(payload: AcademyProfile) {
        const currentRole = this.auth.getRole();

        this.store.update((academies) => ({
            ...academies,
            [currentRole]: {
                ...payload,
                phone: `${payload.countryCode} ${payload.phoneNumber}`.trim()
            }
        }));
    }
}
