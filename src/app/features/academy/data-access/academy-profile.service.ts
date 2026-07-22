import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthErrorLike } from '@/app/core/auth/auth-api.service';
import { AuthSessionService } from '@/app/core/auth/auth-session.service';
import { AuthUser } from '@/app/core/auth/auth.models';
import { AuthAccessService } from '@/app/features/auth/data-access/auth-access.service';
import {
    AcademyApiProfile,
    AcademyApiTaxProfile,
    AcademyProfile,
    AcademyProfileUpdateRequest,
    AcademyTaxProfile,
    AcademyTaxProfileUpdateRequest
} from '../models/academy.model';
import { AcademyApiService } from './academy-api.service';

function createEmptyAcademy(): AcademyProfile {
    return {
        id: null,
        name: '',
        contactEmail: '',
        phone: '',
        countryCode: '+57',
        phoneNumber: '',
        country: '',
        department: '',
        city: '',
        address: '',
        status: 'ACTIVE',
        statusLabel: 'Activa',
        shieldUrl: null,
        shieldFileName: null
    };
}

function createEmptyTaxProfile(academy?: AcademyProfile | null): AcademyTaxProfile {
    return {
        legalName: academy?.name ?? '',
        taxIdType: '',
        taxIdNumber: '',
        taxCheckDigit: '',
        taxRegime: '',
        billingEmail: academy?.contactEmail ?? '',
        fiscalAddress: academy?.address ?? '',
        fiscalCity: academy?.city ?? '',
        fiscalCountry: academy?.country ?? ''
    };
}

@Injectable({
    providedIn: 'root'
})
export class AcademyProfileService {
    readonly currentAcademy = signal<AcademyProfile>(createEmptyAcademy());
    readonly currentTaxProfile = signal<AcademyTaxProfile>(createEmptyTaxProfile());

    constructor(
        private readonly api: AcademyApiService,
        private readonly authAccess: AuthAccessService,
        private readonly session: AuthSessionService
    ) {
        this.syncEmptyStateFromSession();
    }

    getCurrentAcademy(): AcademyProfile | null {
        const current = this.currentAcademy();
        return current.id ? { ...current } : null;
    }

    getCurrentTaxProfile(): AcademyTaxProfile | null {
        const current = this.currentTaxProfile();
        return current.taxIdType || current.taxIdNumber || current.billingEmail ? { ...current } : null;
    }

    loadCurrentAcademy(): Observable<AcademyProfile | null> {
        return this.api.getProfile().pipe(
            map((profile) => this.applyAcademyProfile(profile)),
            catchError((error: AuthErrorLike) => {
                if (error.status === 404) {
                    this.currentAcademy.set(createEmptyAcademy());
                    this.currentTaxProfile.set(createEmptyTaxProfile());
                    return of(null);
                }

                return throwError(() => error);
            })
        );
    }

    loadCurrentTaxProfile(): Observable<AcademyTaxProfile | null> {
        return this.api.getTaxProfile().pipe(
            map((taxProfile) => this.applyTaxProfile(taxProfile)),
            catchError((error: AuthErrorLike) => {
                if (error.status === 404) {
                    this.currentTaxProfile.set(createEmptyTaxProfile(this.currentAcademy()));
                    return of(null);
                }

                return throwError(() => error);
            })
        );
    }

    updateCurrentAcademy(payload: AcademyProfileUpdateRequest): Observable<AcademyProfile> {
        return this.api.updateProfile(payload).pipe(
            map((profile) => this.applyAcademyProfile(profile)),
            tap((profile) => this.patchSessionFromAcademy(profile))
        );
    }

    updateCurrentTaxProfile(payload: AcademyTaxProfileUpdateRequest): Observable<AcademyTaxProfile> {
        return this.api.updateTaxProfile(payload).pipe(map((profile) => this.applyTaxProfile(profile)));
    }

    updateCurrentShield(shield: Blob): Observable<AcademyProfile> {
        return this.api.uploadShield(shield).pipe(
            map((profile) => this.applyAcademyProfile(profile)),
            tap((profile) => this.patchSessionFromAcademy(profile))
        );
    }

    deleteCurrentShield(): Observable<void> {
        return this.api.deleteShield();
    }

    private applyAcademyProfile(profile: AcademyApiProfile): AcademyProfile {
        const mapped = this.api.mapProfile(profile);
        this.currentAcademy.set(mapped);
        this.currentTaxProfile.update((current) => ({
            ...current,
            legalName: current.legalName || mapped.name,
            billingEmail: current.billingEmail || mapped.contactEmail,
            fiscalAddress: current.fiscalAddress || mapped.address,
            fiscalCity: current.fiscalCity || mapped.city,
            fiscalCountry: current.fiscalCountry || mapped.country
        }));
        return mapped;
    }

    private applyTaxProfile(profile: AcademyApiTaxProfile): AcademyTaxProfile {
        const mapped = this.api.mapTaxProfile(profile, this.currentAcademy());
        this.currentTaxProfile.set(mapped);
        return mapped;
    }

    private patchSessionFromAcademy(profile: AcademyProfile): void {
        const currentUser = this.session.getUser();
        if (!currentUser) {
            return;
        }

        const nextUser: AuthUser = {
            ...currentUser,
            academyId: profile.id,
            academyName: profile.name
        };

        this.session.setSession(nextUser);
    }

    private syncEmptyStateFromSession(): void {
        const user = this.session.getUser();
        if (!user) {
            return;
        }

        this.currentAcademy.set({
            ...createEmptyAcademy(),
            id: user.academyId,
            name: user.academyName ?? ''
        });
        this.currentTaxProfile.set(createEmptyTaxProfile(this.currentAcademy()));
    }
}
