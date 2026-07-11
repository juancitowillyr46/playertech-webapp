import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { ForgotPassword } from './forgot-password';
import { ForgotPasswordSuccess } from './forgot-password-success';
import { Signup } from './signup';
import { SignupSuccess } from './signup-success';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'forgot-password', component: ForgotPassword },
    { path: 'forgot-password-success', component: ForgotPasswordSuccess },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'signup-success', component: SignupSuccess }
] as Routes;
