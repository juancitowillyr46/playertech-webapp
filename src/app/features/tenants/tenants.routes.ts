import { Routes } from '@angular/router';
import { Tenants } from './pages/tenants';

export default [
    { path: '', component: Tenants },
    { path: 'new', loadComponent: () => import('./pages/tenant-wizard').then((m) => m.TenantWizard) },
    { path: ':id/edit', loadComponent: () => import('./pages/tenant-wizard').then((m) => m.TenantWizard) }
] as Routes;
