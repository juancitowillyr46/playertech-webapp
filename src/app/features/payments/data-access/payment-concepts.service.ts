import { Injectable, signal } from '@angular/core';
import { PaymentConcept, PaymentConceptForm, PaymentConceptStatus } from '../models/payment-concept.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentConceptsService {
    private readonly conceptsStore = signal<PaymentConcept[]>([
        {
            id: 'pc-001',
            code: 'MATRICULA',
            name: 'Matrícula',
            description: 'Cobro inicial para formalizar el ingreso del jugador.',
            kind: 'ENROLLMENT',
            frequency: 'ONE_TIME',
            defaultAmount: 150000,
            status: 'ACTIVE',
            requiresDueDate: true,
            createdAt: '2026-07-01'
        },
        {
            id: 'pc-002',
            code: 'MENSUALIDAD',
            name: 'Mensualidad',
            description: 'Cobro recurrente por entrenamiento y operación mensual.',
            kind: 'RECURRING',
            frequency: 'MONTHLY',
            defaultAmount: 120000,
            status: 'ACTIVE',
            requiresDueDate: true,
            createdAt: '2026-07-01'
        },
        {
            id: 'pc-003',
            code: 'UNIFORME',
            name: 'Uniforme',
            description: 'Cobro opcional para kit deportivo institucional.',
            kind: 'EXTRA',
            frequency: 'ONE_TIME',
            defaultAmount: 180000,
            status: 'INACTIVE',
            requiresDueDate: false,
            createdAt: '2026-07-03'
        },
        {
            id: 'pc-004',
            code: 'SEGURO',
            name: 'Seguro deportivo',
            description: 'Cobertura anual asociada a la participación del jugador.',
            kind: 'ADMINISTRATIVE',
            frequency: 'ANNUAL',
            defaultAmount: 45000,
            status: 'ACTIVE',
            requiresDueDate: true,
            createdAt: '2026-07-05'
        }
    ]);

    list() {
        return this.conceptsStore;
    }

    getById(id: string): PaymentConceptForm | null {
        const concept = this.conceptsStore().find((item) => item.id === id);
        if (!concept) {
            return null;
        }

        return {
            id: concept.id,
            name: concept.name,
            description: concept.description,
            kind: concept.kind,
            frequency: concept.frequency,
            defaultAmount: concept.defaultAmount,
            requiresDueDate: concept.requiresDueDate
        };
    }

    save(form: PaymentConceptForm) {
        const previous = form.id ? this.conceptsStore().find((item) => item.id === form.id) : null;
        const payload: PaymentConcept = {
            id: form.id ?? this.createId(),
            code: previous?.code ?? this.generateCode(form.name),
            name: form.name.trim(),
            description: form.description.trim(),
            kind: form.kind as PaymentConcept['kind'],
            frequency: form.frequency as PaymentConcept['frequency'],
            defaultAmount: Number(form.defaultAmount ?? 0),
            status: form.id ? this.findStatus(form.id) : 'ACTIVE',
            requiresDueDate: form.requiresDueDate,
            createdAt: form.id ? this.findCreatedAt(form.id) : this.today()
        };

        if (form.id) {
            this.conceptsStore.update((items) => items.map((item) => (item.id === form.id ? payload : item)));
            return payload;
        }

        this.conceptsStore.update((items) => [payload, ...items]);
        return payload;
    }

    updateStatus(id: string, status: PaymentConceptStatus) {
        this.conceptsStore.update((items) => items.map((item) => (item.id === id ? { ...item, status } : item)));
    }

    private createId() {
        return `pc-${Math.random().toString(36).slice(2, 8)}`;
    }

    private generateCode(name: string) {
        const normalizedBase =
            name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toUpperCase()
                .replace(/[^A-Z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '') || 'CONCEPTO';

        const existingCodes = new Set(this.conceptsStore().map((item) => item.code));
        if (!existingCodes.has(normalizedBase)) {
            return normalizedBase;
        }

        let suffix = 2;
        let candidate = `${normalizedBase}_${suffix}`;
        while (existingCodes.has(candidate)) {
            suffix++;
            candidate = `${normalizedBase}_${suffix}`;
        }

        return candidate;
    }

    private findCreatedAt(id: string) {
        return this.conceptsStore().find((item) => item.id === id)?.createdAt ?? this.today();
    }

    private findStatus(id: string): PaymentConceptStatus {
        return this.conceptsStore().find((item) => item.id === id)?.status ?? 'ACTIVE';
    }

    private today() {
        return new Date().toISOString().slice(0, 10);
    }
}
