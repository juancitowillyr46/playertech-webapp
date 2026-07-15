import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'concepts' },
    { path: 'concepts', loadComponent: () => import('./pages/payment-concepts').then((m) => m.PaymentConceptsPage) },
    { path: 'charges', loadComponent: () => import('./pages/charges-debt').then((m) => m.ChargesDebtPage) },
    { path: 'history', loadComponent: () => import('./pages/payments-history').then((m) => m.PaymentsHistoryPage) },
    { path: 'rapid-collection', loadComponent: () => import('./pages/rapid-collection').then((m) => m.RapidCollectionPage) }
] as Routes;
