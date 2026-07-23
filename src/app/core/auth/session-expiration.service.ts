import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SessionExpirationService {
    readonly visible = signal(false);
    readonly returnUrl = signal('/academy');

    show(returnUrl?: string): void {
        if (this.visible()) {
            return;
        }

        this.returnUrl.set(returnUrl?.trim() || '/academy');
        this.visible.set(true);
    }

    hide(): void {
        this.visible.set(false);
        this.clearBackdropState();
    }

    reset(): void {
        this.visible.set(false);
        this.returnUrl.set('/academy');
        this.clearBackdropState();
    }

    clearBackdropState(): void {
        if (typeof document === 'undefined') {
            return;
        }

        document.body.classList.remove('p-overflow-hidden');
        document.body.classList.remove('blocked-scroll');
    }
}
