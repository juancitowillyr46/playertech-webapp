import { Routes } from '@angular/router';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'profile' },
    { path: 'profile', loadComponent: () => import('./pages/profile').then((m) => m.Profile) }
] as Routes;
