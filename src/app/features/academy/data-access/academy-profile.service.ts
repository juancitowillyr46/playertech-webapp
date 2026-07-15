import { Injectable, signal } from '@angular/core';
import { MockAuthService, MockUserRole } from '@/app/core/auth/mock-auth.service';
import { AcademyProfile, AcademyTaxProfile } from '../models/academy.model';

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
    private readonly taxProfileStore = signal<Record<MockUserRole, AcademyTaxProfile | null>>({
        super_admin: null,
        tenant_owner: {
            legalName: 'Academia PlayerTech Demo SAS',
            taxIdType: 'NIT',
            taxIdNumber: '901234567',
            taxCheckDigit: '8',
            taxRegime: 'RESPONSABLE_IVA',
            billingEmail: 'facturacion@playertechdemo.com',
            fiscalAddress: 'Calle 10 # 20-30',
            fiscalCity: 'Pereira',
            fiscalCountry: 'Colombia'
        },
        academy_admin: {
            legalName: 'Club Deportivo Norte SAC',
            taxIdType: 'RUC',
            taxIdNumber: '20609876541',
            taxCheckDigit: '',
            taxRegime: 'REGIMEN_GENERAL',
            billingEmail: 'facturacion@clubnorte.com',
            fiscalAddress: 'Av. Central 245',
            fiscalCity: 'Lima',
            fiscalCountry: 'Perú'
        },
        staff: {
            legalName: 'Escuela Gol Azul SpA',
            taxIdType: 'RUT',
            taxIdNumber: '76453210',
            taxCheckDigit: '2',
            taxRegime: 'REGIMEN_GENERAL',
            billingEmail: 'facturacion@golazul.com',
            fiscalAddress: 'Pasaje Sur 120',
            fiscalCity: 'Santiago',
            fiscalCountry: 'Chile'
        }
    });

    constructor(private readonly auth: MockAuthService) {}

    getCurrentAcademy(): AcademyProfile | null {
        const current = this.store()[this.auth.getRole()];
        return current ? { ...current } : null;
    }

    getCurrentTaxProfile(): AcademyTaxProfile | null {
        const current = this.taxProfileStore()[this.auth.getRole()];
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

    updateCurrentTaxProfile(payload: AcademyTaxProfile) {
        const currentRole = this.auth.getRole();

        this.taxProfileStore.update((profiles) => ({
            ...profiles,
            [currentRole]: {
                ...payload
            }
        }));
    }
}
