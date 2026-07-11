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
            contactName: 'Juan Perez',
            phone: '+57 312 345 6789',
            country: 'Colombia',
            department: 'Risaralda',
            city: 'Pereira',
            address: 'Calle 10 # 20-30',
            status: 'ACTIVE',
            createdAt: '2026-07-01'
        },
        {
            id: 'ten-002',
            name: 'Club Deportivo Norte',
            contactEmail: 'contacto@clubnorte.com',
            contactName: 'Maria Gomez',
            phone: '+51 987 654 321',
            country: 'Perú',
            department: 'Lima',
            city: 'Lima',
            address: 'Av. Central 245',
            status: 'SUSPENDED',
            createdAt: '2026-06-22'
        },
        {
            id: 'ten-003',
            name: 'Escuela Gol Azul',
            contactEmail: 'contacto@golazul.com',
            contactName: 'Carlos Rojas',
            phone: '+56 9 8765 4321',
            country: 'Chile',
            department: 'Santiago',
            city: 'Santiago',
            address: 'Pasaje Sur 120',
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
            contactName: form.contactName.trim(),
            phone: form.phone.trim(),
            country: form.country.trim(),
            department: form.department.trim(),
            city: form.city.trim(),
            address: form.address.trim(),
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
            contactName: tenant.contactName,
            phone: tenant.phone,
            country: tenant.country,
            department: tenant.department,
            city: tenant.city,
            address: tenant.address
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
