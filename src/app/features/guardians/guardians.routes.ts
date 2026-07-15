import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./pages/guardians-list').then((m) => m.GuardiansListPage) },
    { path: 'new', loadComponent: () => import('./pages/guardian-form').then((m) => m.GuardianFormPage) },
    { path: ':id', loadComponent: () => import('./pages/guardian-detail').then((m) => m.GuardianDetailPage) },
    { path: ':id/edit', loadComponent: () => import('./pages/guardian-form').then((m) => m.GuardianFormPage) }
] as Routes;
