import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest.guard';

export default [
    {
        path: '',
        canActivate: [guestGuard],
        children: [
            { path: 'access', loadComponent: () => import('./pages/access').then((m) => m.Access) },
            { path: 'error', loadComponent: () => import('./pages/error').then((m) => m.Error) },
            { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password').then((m) => m.ForgotPassword) },
            { path: 'forgot-password-success', loadComponent: () => import('./pages/forgot-password-success').then((m) => m.ForgotPasswordSuccess) },
            { path: 'login', loadComponent: () => import('./pages/login').then((m) => m.Login) },
            { path: 'signup', loadComponent: () => import('./pages/signup').then((m) => m.Signup) },
            { path: 'signup-success', loadComponent: () => import('./pages/signup-success').then((m) => m.SignupSuccess) }
        ]
    }
] as Routes;
