import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MockAuthService } from '../auth/mock-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(MockAuthService);
    const router = inject(Router);

    if (auth.canAccess(state.url)) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);
};
