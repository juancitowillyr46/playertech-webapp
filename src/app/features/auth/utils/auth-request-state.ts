import { computed, signal } from '@angular/core';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';

export type AuthFeedbackSeverity = 'success' | 'info' | 'warn' | 'error';

export type AuthFeedbackMessage = {
    severity: AuthFeedbackSeverity;
    text: string;
};

export class AuthRequestState {
    readonly loading = signal(false);
    readonly submitted = signal(false);
    readonly message = signal<AuthFeedbackMessage | null>(null);

    readonly messageText = computed(() => this.message()?.text ?? '');

    start(): void {
        this.loading.set(true);
    }

    stop(): void {
        this.loading.set(false);
    }

    resetMessage(): void {
        this.message.set(null);
    }

    setError(text: string): void {
        this.message.set({ severity: 'error', text });
    }

    setSuccess(text: string): void {
        this.message.set({ severity: 'success', text });
    }

    setInfo(text: string): void {
        this.message.set({ severity: 'info', text });
    }

    setWarning(text: string): void {
        this.message.set({ severity: 'warn', text });
    }

    resolveError(error: unknown, fallback: (error?: AuthErrorLike) => string): void {
        const detail = this.extractErrorText(error);
        const authError = error as AuthErrorLike | undefined;
        this.setError(detail ?? fallback(authError));
    }

    private extractErrorText(error: unknown): string | undefined {
        if (!error || typeof error !== 'object') {
            return undefined;
        }

        const payload = error as Record<string, unknown>;
        const candidates = [payload['detail'], payload['message'], payload['title']];

        for (const candidate of candidates) {
            if (typeof candidate === 'string' && candidate.trim()) {
                return candidate.trim();
            }
        }

        const nestedError = payload['error'];
        if (nestedError && typeof nestedError === 'object') {
            const nestedPayload = nestedError as Record<string, unknown>;
            const nestedCandidates = [nestedPayload['detail'], nestedPayload['message'], nestedPayload['title']];

            for (const candidate of nestedCandidates) {
                if (typeof candidate === 'string' && candidate.trim()) {
                    return candidate.trim();
                }
            }
        }

        return undefined;
    }
}
