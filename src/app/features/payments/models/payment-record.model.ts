export type PaymentMethod = 'CASH' | 'TRANSFER' | 'CARD' | 'LINK';
export type PaymentStatus = 'PAID' | 'CANCELLED';

export interface PaymentEvidence {
    name: string;
    sizeKb: number;
    mimeType: string;
}

export interface ExternalFiscalDocument {
    id: string;
    name: string;
    issuer: string;
    documentType: 'INVOICE' | 'CREDIT_NOTE' | 'SUPPORT';
    reference: string;
    issuedAt: string;
}

export interface PaymentReceiptItem {
    conceptName: string;
    amount: number;
}

export interface PaymentReceipt {
    receiptNumber: string;
    issuedAt: string;
    academyName: string;
    academyCity: string;
    academyEmail: string;
    playerName: string;
    guardianName: string;
    paymentMethodLabel: string;
    amountReceived: number;
    pendingBalance: number;
    reference: string;
    registeredBy: string;
    verificationCode: string;
    notes: string;
    items: PaymentReceiptItem[];
}

export interface PaymentRecord {
    id: string;
    playerId: string;
    playerName: string;
    guardianName: string;
    collectionContext: string | null;
    chargeId: string;
    conceptName: string;
    paymentDate: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    evidence: PaymentEvidence | null;
    receipt: PaymentReceipt;
    externalFiscalDocument: ExternalFiscalDocument | null;
    note: string;
}

export interface PaymentRecordForm {
    chargeId: string;
    amount: number | null;
    method: PaymentMethod | null;
    note: string;
}
