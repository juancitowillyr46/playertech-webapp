import { Injectable, computed, signal } from '@angular/core';
import { FinancialCharge, FinancialDebtSummary } from '../models/charge-debt.model';

@Injectable({
    providedIn: 'root'
})
export class ChargesDebtService {
    private readonly chargesState = signal<FinancialCharge[]>([
        {
            id: 'charge-fin-001',
            playerId: 'player-001',
            playerName: 'Juan Pérez',
            categoryName: 'Sub 12',
            guardianName: 'María Pérez',
            collectionContext: 'Jornada de matrícula julio',
            conceptCode: 'MATRICULA',
            conceptName: 'Matrícula',
            sourceLabel: 'Matrícula inicial',
            description: 'Cobro inicial para formalizar la inscripción del jugador.',
            dueDate: '2026-07-20',
            amount: 150000,
            paidAmount: 0,
            pendingAmount: 150000,
            status: 'PENDING'
        },
        {
            id: 'charge-fin-002',
            playerId: 'player-001',
            playerName: 'Juan Pérez',
            categoryName: 'Sub 12',
            guardianName: 'María Pérez',
            collectionContext: 'Jornada de matrícula julio',
            conceptCode: 'MENSUALIDAD',
            conceptName: 'Mensualidad',
            sourceLabel: 'Matrícula inicial',
            description: 'Cobro del primer periodo activo del jugador.',
            dueDate: '2026-07-10',
            amount: 120000,
            paidAmount: 0,
            pendingAmount: 120000,
            status: 'OVERDUE'
        },
        {
            id: 'charge-fin-003',
            playerId: 'player-002',
            playerName: 'Mateo García',
            categoryName: 'Sub 14',
            guardianName: 'Andrea García',
            collectionContext: 'Cobro operativo sede norte',
            conceptCode: 'MENSUALIDAD',
            conceptName: 'Mensualidad',
            sourceLabel: 'Matrícula inicial',
            description: 'Cobro del periodo mensual vigente.',
            dueDate: '2026-07-25',
            amount: 120000,
            paidAmount: 0,
            pendingAmount: 120000,
            status: 'PENDING'
        },
        {
            id: 'charge-fin-004',
            playerId: 'player-002',
            playerName: 'Mateo García',
            categoryName: 'Sub 14',
            guardianName: 'Andrea García',
            collectionContext: 'Cobro operativo sede norte',
            conceptCode: 'UNIFORME',
            conceptName: 'Uniforme',
            sourceLabel: 'Cargo manual desde jugador',
            description: 'Cobro extraordinario del kit deportivo inicial.',
            dueDate: '2026-07-05',
            amount: 90000,
            paidAmount: 90000,
            pendingAmount: 0,
            status: 'PAID'
        }
    ]);

    readonly charges = computed(() => this.chargesState());

    getCollectionContexts() {
        return Array.from(new Set(this.chargesState().map((charge) => charge.collectionContext))).map((label) => ({ label, value: label }));
    }

    markChargeAsPaid(chargeId: string) {
        let updatedCharge: FinancialCharge | null = null;

        this.chargesState.update((current) =>
            current.map((charge) => {
                if (charge.id !== chargeId) {
                    return charge;
                }

                updatedCharge = {
                    ...charge,
                    paidAmount: charge.amount,
                    pendingAmount: 0,
                    status: 'PAID'
                };
                return updatedCharge;
            })
        );

        return updatedCharge;
    }

    getSummary(): FinancialDebtSummary {
        const charges = this.chargesState();
        const actionable = charges.filter((charge) => charge.status !== 'PAID');
        const totalPendingAmount = actionable.reduce((total, charge) => total + charge.pendingAmount, 0);
        const playersWithDebt = new Set(actionable.map((charge) => charge.playerId)).size;

        return {
            totalPendingAmount,
            playersWithDebt,
            pendingCharges: charges.filter((charge) => charge.status === 'PENDING').length,
            overdueCharges: charges.filter((charge) => charge.status === 'OVERDUE').length
        };
    }
}
