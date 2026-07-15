import { Injectable, signal } from '@angular/core';
import { FinancialCharge } from '../models/charge-debt.model';
import { ExternalFiscalDocument, PaymentEvidence, PaymentMethod, PaymentRecord, PaymentRecordForm, PaymentReceipt } from '../models/payment-record.model';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    private readonly paymentsState = signal<PaymentRecord[]>([
        {
            id: 'payment-001',
            playerId: 'player-002',
            playerName: 'Mateo García',
            guardianName: 'Andrea García',
            collectionContext: 'Cobro operativo sede norte',
            chargeId: 'charge-fin-004',
            conceptName: 'Uniforme',
            paymentDate: '2026-07-06T10:30:00+00:00',
            amount: 90000,
            method: 'TRANSFER',
            status: 'PAID',
            evidence: {
                name: 'comprobante-uniforme-julio.pdf',
                sizeKb: 240,
                mimeType: 'application/pdf'
            },
            receipt: {
                receiptNumber: 'RC-2026-00124',
                issuedAt: '2026-07-06T10:35:00+00:00',
                academyName: 'Academia PlayerTech Demo',
                academyCity: 'Pereira',
                academyEmail: 'contacto@academiaplayertech.com',
                playerName: 'Mateo García',
                guardianName: 'Andrea García',
                paymentMethodLabel: 'Transferencia',
                amountReceived: 90000,
                pendingBalance: 0,
                reference: 'TRX-440192',
                registeredBy: 'Juan Rodas',
                verificationCode: 'PT-24A19K',
                notes: 'Pago confirmado por transferencia bancaria.',
                items: [{ conceptName: 'Uniforme', amount: 90000 }]
            },
            externalFiscalDocument: {
                id: 'efd-001',
                name: 'factura-externa-uniforme-12458.pdf',
                issuer: 'Facturador Externo SAS',
                documentType: 'INVOICE',
                reference: 'FE-12458',
                issuedAt: '2026-07-06T10:40:00+00:00'
            },
            note: 'Pago confirmado por transferencia bancaria.'
        }
    ]);

    list(): PaymentRecord[] {
        return this.paymentsState().map((item) => ({
            ...item,
            evidence: item.evidence ? { ...item.evidence } : null,
            externalFiscalDocument: item.externalFiscalDocument ? { ...item.externalFiscalDocument } : null,
            receipt: {
                ...item.receipt,
                items: item.receipt.items.map((receiptItem) => ({ ...receiptItem }))
            }
        }));
    }

    registerPayment(charge: FinancialCharge, form: PaymentRecordForm, evidence: PaymentEvidence | null): PaymentRecord {
        const amount = Number(form.amount ?? charge.pendingAmount);
        const paymentMethodLabel = this.paymentMethodLabel(form.method ?? 'CASH');
        const payment: PaymentRecord = {
            id: `payment-${Date.now()}`,
            playerId: charge.playerId,
            playerName: charge.playerName,
            guardianName: charge.guardianName,
            collectionContext: charge.collectionContext,
            chargeId: charge.id,
            conceptName: charge.conceptName,
            paymentDate: new Date().toISOString(),
            amount,
            method: form.method ?? 'CASH',
            status: 'PAID',
            evidence,
            receipt: this.buildReceipt({
                playerName: charge.playerName,
                guardianName: charge.guardianName,
                conceptName: charge.conceptName,
                amount,
                paymentMethodLabel,
                note: form.note.trim()
            }),
            externalFiscalDocument: null,
            note: form.note.trim()
        };

        this.paymentsState.update((current) => [payment, ...current]);
        return payment;
    }

    cancelPayment(paymentId: string): PaymentRecord | null {
        let updatedPayment: PaymentRecord | null = null;

        this.paymentsState.update((current) =>
            current.map((payment) => {
                if (payment.id !== paymentId) {
                    return payment;
                }

                updatedPayment = { ...payment, status: 'CANCELLED' };
                return updatedPayment;
            })
        );

        return updatedPayment;
    }

    paymentMethodLabel(method: PaymentMethod) {
        switch (method) {
            case 'CASH':
                return 'Efectivo';
            case 'TRANSFER':
                return 'Transferencia';
            case 'CARD':
                return 'Tarjeta';
            case 'LINK':
                return 'Link de pago';
            default:
                return method;
        }
    }

    downloadReceiptPdf(payment: PaymentRecord) {
        const content = this.buildReceiptPrintableContent(payment.receipt);
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${payment.receipt.receiptNumber}.pdf`;
        anchor.click();
        URL.revokeObjectURL(url);
    }

    attachEvidence(paymentId: string, evidence: PaymentEvidence): PaymentRecord | null {
        let updatedPayment: PaymentRecord | null = null;

        this.paymentsState.update((current) =>
            current.map((payment) => {
                if (payment.id !== paymentId) {
                    return payment;
                }

                updatedPayment = { ...payment, evidence: { ...evidence } };
                return updatedPayment;
            })
        );

        return updatedPayment;
    }

    attachExternalFiscalDocument(paymentId: string, document: Omit<ExternalFiscalDocument, 'id'>): PaymentRecord | null {
        let updatedPayment: PaymentRecord | null = null;

        this.paymentsState.update((current) =>
            current.map((payment) => {
                if (payment.id !== paymentId) {
                    return payment;
                }

                updatedPayment = {
                    ...payment,
                    externalFiscalDocument: {
                        id: `efd-${Date.now()}`,
                        ...document
                    }
                };
                return updatedPayment;
            })
        );

        return updatedPayment;
    }

    private buildReceipt(input: { playerName: string; guardianName: string; conceptName: string; amount: number; paymentMethodLabel: string; note: string }): PaymentReceipt {
        const now = new Date();
        const numericStamp = now.getTime().toString().slice(-6);

        return {
            receiptNumber: `RC-2026-${numericStamp}`,
            issuedAt: now.toISOString(),
            academyName: 'Academia PlayerTech Demo',
            academyCity: 'Pereira',
            academyEmail: 'contacto@academiaplayertech.com',
            playerName: input.playerName,
            guardianName: input.guardianName,
            paymentMethodLabel: input.paymentMethodLabel,
            amountReceived: input.amount,
            pendingBalance: 0,
            reference: `PAY-${numericStamp}`,
            registeredBy: 'Juan Rodas',
            verificationCode: `PT-${numericStamp}`,
            notes: input.note,
            items: [{ conceptName: input.conceptName, amount: input.amount }]
        };
    }

    private buildReceiptPrintableContent(receipt: PaymentReceipt) {
        const itemLines = receipt.items.map((item) => `${item.conceptName}: ${new Intl.NumberFormat('es-CO').format(item.amount)}`).join('\n');

        return [
            'PLAYERTECH - COMPROBANTE ADMINISTRATIVO',
            '',
            `Academia: ${receipt.academyName}`,
            `Ciudad: ${receipt.academyCity}`,
            `Correo: ${receipt.academyEmail}`,
            `Consecutivo: ${receipt.receiptNumber}`,
            `Fecha: ${new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(receipt.issuedAt))}`,
            '',
            `Acudiente: ${receipt.guardianName}`,
            `Jugador: ${receipt.playerName}`,
            '',
            'Detalle:',
            itemLines,
            '',
            `Valor recibido: ${new Intl.NumberFormat('es-CO').format(receipt.amountReceived)}`,
            `Saldo pendiente: ${new Intl.NumberFormat('es-CO').format(receipt.pendingBalance)}`,
            `Medio de pago: ${receipt.paymentMethodLabel}`,
            `Referencia: ${receipt.reference}`,
            `Registrado por: ${receipt.registeredBy}`,
            `Codigo de verificacion: ${receipt.verificationCode}`,
            receipt.notes ? `Observaciones: ${receipt.notes}` : '',
            '',
            'Este documento es un comprobante administrativo y no constituye factura electronica.'
        ]
            .filter(Boolean)
            .join('\n');
    }
}
