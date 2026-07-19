import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionService } from './auth-session.service';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
    const session = inject(AuthSessionService);
    const token = session.getUser()?.accessToken ?? session.getUser()?.token ?? null;

    if (!token?.trim()) {
        return next(request);
    }

    return next(
        request.clone({
            setHeaders: {
                Authorization: `Bearer ${token.trim()}`
            }
        })
    );
};
