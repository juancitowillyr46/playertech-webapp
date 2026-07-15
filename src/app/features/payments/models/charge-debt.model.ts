export type FinancialChargeStatus = 'PENDING' | 'OVERDUE' | 'PAID';

export interface FinancialCharge {
    id: string;
    playerId: string;
    playerName: string;
    categoryName: string;
    guardianName: string;
    collectionContext: string;
    conceptCode: string;
    conceptName: string;
    sourceLabel: string;
    description: string;
    dueDate: string;
    amount: number;
    paidAmount: number;
    pendingAmount: number;
    status: FinancialChargeStatus;
}

export interface FinancialDebtSummary {
    totalPendingAmount: number;
    playersWithDebt: number;
    pendingCharges: number;
    overdueCharges: number;
}
