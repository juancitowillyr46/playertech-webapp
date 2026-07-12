import { Routes } from '@angular/router';

export default [{ path: '', loadComponent: () => import('./pages/academy-profile').then((m) => m.AcademyProfilePage) }] as Routes;
