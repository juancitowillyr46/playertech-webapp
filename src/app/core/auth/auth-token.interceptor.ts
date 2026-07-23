import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthSessionService } from './auth-session.service';
import { SessionExpirationService } from './session-expiration.service';

export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
    const session = inject(AuthSessionService);
    const sessionExpiration = inject(SessionExpirationService);
    const token = session.getUser()?.accessToken ?? session.getUser()?.token ?? null;
    const authenticated = session.isLoggedIn();
    const requestWithToken = token?.trim()
        ? request.clone({
              setHeaders: {
                  Authorization: `Bearer ${token.trim()}`
              }
          })
        : request;

    return next(requestWithToken).pipe(
        catchError((error: unknown) => {
            if (authenticated && error instanceof HttpErrorResponse && error.status === 401) {
                sessionExpiration.show();
            }

            return throwError(() => error);
        })
    );
};
