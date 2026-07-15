export type PaymentConceptStatus = 'ACTIVE' | 'INACTIVE';
export type PaymentConceptKind = 'ENROLLMENT' | 'RECURRING' | 'EXTRA' | 'ADMINISTRATIVE';
export type PaymentConceptFrequency = 'ONE_TIME' | 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'ANNUAL';

export interface PaymentConcept {
    id: string;
    code: string;
    name: string;
    description: string;
    kind: PaymentConceptKind;
    frequency: PaymentConceptFrequency;
    defaultAmount: number;
    status: PaymentConceptStatus;
    requiresDueDate: boolean;
    createdAt: string;
}

export interface PaymentConceptForm {
    id?: string;
    name: string;
    description: string;
    kind: PaymentConceptKind | '';
    frequency: PaymentConceptFrequency | '';
    defaultAmount: number | null;
    requiresDueDate: boolean;
}
