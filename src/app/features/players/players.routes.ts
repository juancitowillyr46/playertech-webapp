import { Routes } from '@angular/router';

export default [
    { path: '', loadComponent: () => import('./pages/players-list').then((m) => m.PlayersListPage) },
    { path: 'new', loadComponent: () => import('./pages/player-form').then((m) => m.PlayerFormPage) },
    { path: ':id', loadComponent: () => import('./pages/player-detail').then((m) => m.PlayerDetailPage) }
] as Routes;
