import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'tax-profile' },
    { path: 'tax-profile', loadComponent: () => import('./pages/tax-profile').then((m) => m.FinanceTaxProfilePage) }
] as Routes;
