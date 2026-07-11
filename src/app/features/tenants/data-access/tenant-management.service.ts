import { Injectable, signal } from '@angular/core';
import { TenantForm, TenantListItem, TenantStatus } from '../models/tenant.model';

@Injectable({
    providedIn: 'root'
})
export class TenantManagementService {
    private readonly tenantsStore = signal<TenantListItem[]>([
        {
            id: 'ten-001',
            name: 'Academia PlayerTech Demo',
            contactEmail: 'contacto@playertechdemo.com',
            phone: '+57 312 345 6789',
            countryCode: '+57',
            country: 'Colombia',
            department: 'Risaralda',
            city: 'Pereira',
            address: 'Calle 10 # 20-30',
            adminName: 'Juan Perez',
            adminEmail: 'admin@playertechdemo.com',
            categoryId: 'cat-sub-12',
            teamName: 'Sub 12 A',
            status: 'ACTIVE',
            createdAt: '2026-07-01'
        },
        {
            id: 'ten-002',
            name: 'Club Deportivo Norte',
            contactEmail: 'contacto@clubnorte.com',
            phone: '+51 987 654 321',
            countryCode: '+51',
            country: 'Perú',
            department: 'Lima',
            city: 'Lima',
            address: 'Av. Central 245',
            adminName: 'Maria Gomez',
            adminEmail: 'admin@clubnorte.com',
            categoryId: 'cat-sub-11',
            teamName: 'Sub 11 B',
            status: 'SUSPENDED',
            createdAt: '2026-06-22'
        },
        {
            id: 'ten-003',
            name: 'Escuela Gol Azul',
            contactEmail: 'contacto@golazul.com',
            phone: '+56 9 8765 4321',
            countryCode: '+56',
            country: 'Chile',
            department: 'Santiago',
            city: 'Santiago',
            address: 'Pasaje Sur 120',
            adminName: 'Carlos Rojas',
            adminEmail: 'admin@golazul.com',
            categoryId: 'cat-sub-10',
            teamName: 'Sub 10 C',
            status: 'ACTIVE',
            createdAt: '2026-06-18'
        }
    ]);

    list() {
        return this.tenantsStore;
    }

    save(form: TenantForm) {
        const current = this.tenantsStore();
        const payload: TenantListItem = {
            id: form.id ?? this.createId(),
            name: form.name.trim(),
            contactEmail: form.contactEmail.trim(),
            phone: `${form.countryCode.trim()} ${form.phoneNumber.trim()}`.trim(),
            countryCode: form.countryCode.trim(),
            country: form.country.trim(),
            department: form.department.trim(),
            city: form.city.trim(),
            address: form.address.trim(),
            adminName: form.adminName.trim(),
            adminEmail: form.adminEmail.trim(),
            categoryId: form.categoryId.trim(),
            teamName: form.teamName.trim(),
            status: 'ACTIVE',
            createdAt: form.id ? current.find((tenant) => tenant.id === form.id)?.createdAt ?? this.today() : this.today()
        };

        if (form.id) {
            this.tenantsStore.set(current.map((tenant) => (tenant.id === form.id ? payload : tenant)));
            return;
        }

        this.tenantsStore.set([payload, ...current]);
    }

    suspend(id: string) {
        this.updateStatus(id, 'SUSPENDED');
    }

    reactivate(id: string) {
        this.updateStatus(id, 'ACTIVE');
    }

    delete(id: string) {
        this.tenantsStore.set(this.tenantsStore().filter((tenant) => tenant.id !== id));
    }

    getById(id: string): TenantForm | null {
        const tenant = this.tenantsStore().find((item) => item.id === id);
        if (!tenant) {
            return null;
        }

        return {
            id: tenant.id,
            name: tenant.name,
            contactEmail: tenant.contactEmail,
            phone: tenant.phone,
            countryCode: tenant.countryCode,
            phoneNumber: tenant.phone.replace(`${tenant.countryCode}`, '').trim(),
            country: tenant.country,
            department: tenant.department,
            city: tenant.city,
            address: tenant.address,
            adminName: tenant.adminName,
            adminEmail: tenant.adminEmail,
            categoryId: tenant.categoryId,
            teamName: tenant.teamName
        };
    }

    private updateStatus(id: string, status: TenantStatus) {
        this.tenantsStore.update((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    }

    private createId(): string {
        return `ten-${Math.random().toString(36).slice(2, 7)}`;
    }

    private today(): string {
        return new Date().toISOString().slice(0, 10);
    }
}
