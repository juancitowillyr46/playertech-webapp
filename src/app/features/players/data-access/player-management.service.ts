import { Injectable } from '@angular/core';
import { CategoryOption, Guardian, GuardianForm, GuardianLinkedPlayer, Player, PlayerForm, PlayerGuardianRelation, PlayerInitialCharge, PlayerMembership, PlayerMembershipHistoryItem, PlayerPhoto } from '../models/player.model';

@Injectable({
    providedIn: 'root'
})
export class PlayerManagementService {
    private readonly academyId = '019f0000-0000-7000-8000-000000000001';

    private readonly categories: CategoryOption[] = [
        { id: 'category-sub-8', name: 'Sub 8' },
        { id: 'category-sub-10', name: 'Sub 10' },
        { id: 'category-sub-12', name: 'Sub 12' },
        { id: 'category-sub-14', name: 'Sub 14' },
        { id: 'category-sub-16', name: 'Sub 16' },
        { id: 'category-juvenil', name: 'Juvenil' }
    ];

    private players: Player[] = [
        {
            id: 'player-001',
            academyId: this.academyId,
            categoryId: 'category-sub-12',
            categoryName: 'Sub 12',
            firstName: 'Juan',
            lastName: 'Pérez',
            birthDate: '2013-05-12',
            documentNumber: '12345678',
            status: 'ACTIVE',
            photo: null
        },
        {
            id: 'player-002',
            academyId: this.academyId,
            categoryId: 'category-sub-14',
            categoryName: 'Sub 14',
            firstName: 'Mateo',
            lastName: 'García',
            birthDate: '2011-09-02',
            documentNumber: '10456789',
            status: 'ACTIVE',
            photo: null
        },
        {
            id: 'player-003',
            academyId: this.academyId,
            categoryId: 'category-sub-10',
            categoryName: 'Sub 10',
            firstName: 'Sofía',
            lastName: 'López',
            birthDate: '2015-01-18',
            documentNumber: '11987654',
            status: 'INACTIVE',
            photo: null
        }
    ];

    private guardians: Guardian[] = [
        {
            id: 'guardian-001',
            academyId: this.academyId,
            firstName: 'María',
            lastName: 'Pérez',
            phone: '+57 312 555 0021',
            email: 'maria.perez@example.com',
            relationship: 'Madre',
            status: 'ACTIVE'
        },
        {
            id: 'guardian-002',
            academyId: this.academyId,
            firstName: 'Carlos',
            lastName: 'Pérez',
            phone: '+57 320 444 7788',
            email: 'carlos.perez@example.com',
            relationship: 'Padre',
            status: 'ACTIVE'
        },
        {
            id: 'guardian-003',
            academyId: this.academyId,
            firstName: 'Andrea',
            lastName: 'García',
            phone: '+57 315 908 1212',
            email: 'andrea.garcia@example.com',
            relationship: 'Tía',
            status: 'ACTIVE'
        },
        {
            id: 'guardian-004',
            academyId: this.academyId,
            firstName: 'Luisa',
            lastName: 'López',
            phone: '+57 301 678 0045',
            email: 'luisa.lopez@example.com',
            relationship: 'Tutor',
            status: 'INACTIVE'
        }
    ];

    private relations: PlayerGuardianRelation[] = [
        {
            id: 'relation-001',
            academyId: this.academyId,
            playerId: 'player-001',
            isPrimary: true,
            guardian: this.guardians[0]
        },
        {
            id: 'relation-002',
            academyId: this.academyId,
            playerId: 'player-001',
            isPrimary: false,
            guardian: this.guardians[1]
        },
        {
            id: 'relation-003',
            academyId: this.academyId,
            playerId: 'player-002',
            isPrimary: true,
            guardian: this.guardians[2]
        }
    ];

    private memberships: PlayerMembership[] = [
        {
            id: 'membership-001',
            academyId: this.academyId,
            playerId: 'player-001',
            primaryGuardianId: 'guardian-001',
            status: 'ACTIVE',
            startedAt: '2026-07-07T00:00:00+00:00',
            endedAt: null
        },
        {
            id: 'membership-002',
            academyId: this.academyId,
            playerId: 'player-002',
            primaryGuardianId: 'guardian-003',
            status: 'ACTIVE',
            startedAt: '2026-07-09T00:00:00+00:00',
            endedAt: null
        },
        {
            id: 'membership-003',
            academyId: this.academyId,
            playerId: 'player-003',
            primaryGuardianId: 'guardian-004',
            status: 'WITHDRAWN',
            startedAt: '2026-03-05T00:00:00+00:00',
            endedAt: '2026-06-15T00:00:00+00:00'
        }
    ];

    private membershipHistory: PlayerMembershipHistoryItem[] = [
        {
            id: 'membership-history-001',
            playerId: 'player-001',
            primaryGuardianId: 'guardian-001',
            status: 'ACTIVE',
            startedAt: '2026-07-07T00:00:00+00:00',
            endedAt: null
        },
        {
            id: 'membership-history-002',
            playerId: 'player-002',
            primaryGuardianId: 'guardian-003',
            status: 'ACTIVE',
            startedAt: '2026-07-09T00:00:00+00:00',
            endedAt: null
        },
        {
            id: 'membership-history-003',
            playerId: 'player-003',
            primaryGuardianId: 'guardian-004',
            status: 'ACTIVE',
            startedAt: '2026-03-05T00:00:00+00:00',
            endedAt: '2026-05-02T00:00:00+00:00'
        },
        {
            id: 'membership-history-004',
            playerId: 'player-003',
            primaryGuardianId: 'guardian-004',
            status: 'SUSPENDED',
            startedAt: '2026-05-03T00:00:00+00:00',
            endedAt: '2026-05-25T00:00:00+00:00'
        },
        {
            id: 'membership-history-005',
            playerId: 'player-003',
            primaryGuardianId: 'guardian-004',
            status: 'WITHDRAWN',
            startedAt: '2026-05-26T00:00:00+00:00',
            endedAt: '2026-06-15T00:00:00+00:00'
        }
    ];

    private initialCharges: PlayerInitialCharge[] = [
        {
            id: 'charge-001',
            membershipId: 'membership-001',
            paymentConceptId: 'concept-001',
            conceptName: 'Matrícula',
            description: 'Cobro inicial de matrícula',
            amount: '150000.00',
            status: 'PENDING'
        },
        {
            id: 'charge-002',
            membershipId: 'membership-001',
            paymentConceptId: 'concept-002',
            conceptName: 'Primera mensualidad',
            description: 'Primer cargo mensual del jugador',
            amount: '120000.00',
            status: 'PENDING'
        },
        {
            id: 'charge-003',
            membershipId: 'membership-002',
            paymentConceptId: 'concept-001',
            conceptName: 'Matrícula',
            description: 'Cobro inicial de matrícula',
            amount: '150000.00',
            status: 'PAID'
        },
        {
            id: 'charge-004',
            membershipId: 'membership-002',
            paymentConceptId: 'concept-002',
            conceptName: 'Primera mensualidad',
            description: 'Primer cargo mensual del jugador',
            amount: '120000.00',
            status: 'PENDING'
        },
        {
            id: 'charge-005',
            membershipId: 'membership-003',
            paymentConceptId: 'concept-001',
            conceptName: 'Matrícula',
            description: 'Cobro inicial de matrícula',
            amount: '150000.00',
            status: 'PAID'
        }
    ];

    listPlayers(): Player[] {
        return this.players.map((player) => ({ ...player, photo: player.photo ? { ...player.photo } : null }));
    }

    getPlayerById(playerId: string): Player | null {
        const player = this.players.find((item) => item.id === playerId);
        return player ? { ...player, photo: player.photo ? { ...player.photo } : null } : null;
    }

    createPlayer(payload: PlayerForm, photo: PlayerPhoto | null): Player {
        const category = this.categories.find((item) => item.id === payload.categoryId);
        const player: Player = {
            id: `player-${Date.now()}`,
            academyId: this.academyId,
            categoryId: payload.categoryId,
            categoryName: category?.name ?? 'Sin categoría',
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
            birthDate: payload.birthDate,
            documentNumber: payload.documentNumber.trim(),
            status: 'ACTIVE',
            photo
        };

        this.players = [player, ...this.players];
        return { ...player, photo: player.photo ? { ...player.photo } : null };
    }

    updatePlayer(playerId: string, payload: PlayerForm, photo: PlayerPhoto | null): Player | null {
        const category = this.categories.find((item) => item.id === payload.categoryId);
        let updated: Player | undefined;

        this.players = this.players.map((player) => {
            if (player.id !== playerId) {
                return player;
            }

            updated = {
                ...player,
                firstName: payload.firstName.trim(),
                lastName: payload.lastName.trim(),
                birthDate: payload.birthDate,
                documentNumber: payload.documentNumber.trim(),
                categoryId: payload.categoryId,
                categoryName: category?.name ?? player.categoryName,
                photo
            };

            return updated;
        });

        return updated ? { ...updated, photo: updated.photo ? { ...updated.photo } : null } : null;
    }

    togglePlayerStatus(playerId: string): Player | null {
        let updated: Player | undefined;
        this.players = this.players.map((player) => {
            if (player.id !== playerId) {
                return player;
            }

            updated = {
                ...player,
                status: player.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            };

            return updated;
        });

        return updated ? { ...updated, photo: updated.photo ? { ...updated.photo } : null } : null;
    }

    listCategories(): CategoryOption[] {
        return this.categories.map((item) => ({ ...item }));
    }

    listGuardians(): Guardian[] {
        return this.guardians.map((guardian) => ({ ...guardian }));
    }

    getGuardianById(guardianId: string): Guardian | null {
        const guardian = this.guardians.find((item) => item.id === guardianId);
        return guardian ? { ...guardian } : null;
    }

    createGuardian(payload: GuardianForm): Guardian {
        const guardian: Guardian = {
            id: `guardian-${Date.now()}`,
            academyId: this.academyId,
            firstName: payload.firstName.trim(),
            lastName: payload.lastName.trim(),
            phone: payload.phone.trim(),
            email: payload.email.trim().toLowerCase(),
            relationship: payload.relationship,
            status: 'ACTIVE'
        };

        this.guardians = [guardian, ...this.guardians];
        return { ...guardian };
    }

    updateGuardian(guardianId: string, payload: GuardianForm): Guardian | null {
        let updated: Guardian | undefined;

        this.guardians = this.guardians.map((guardian) => {
            if (guardian.id !== guardianId) {
                return guardian;
            }

            updated = {
                ...guardian,
                firstName: payload.firstName.trim(),
                lastName: payload.lastName.trim(),
                phone: payload.phone.trim(),
                email: payload.email.trim().toLowerCase(),
                relationship: payload.relationship
            };

            return updated;
        });

        if (!updated) {
            return null;
        }

        this.relations = this.relations.map((relation) =>
            relation.guardian.id === guardianId
                ? {
                      ...relation,
                      guardian: { ...updated! }
                  }
                : relation
        );

        return { ...updated };
    }

    toggleGuardianStatus(guardianId: string): Guardian | null {
        let updated: Guardian | undefined;

        this.guardians = this.guardians.map((guardian) => {
            if (guardian.id !== guardianId) {
                return guardian;
            }

            updated = {
                ...guardian,
                status: guardian.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            };

            return updated;
        });

        if (!updated) {
            return null;
        }

        this.relations = this.relations.map((relation) =>
            relation.guardian.id === guardianId
                ? {
                      ...relation,
                      guardian: { ...updated! }
                  }
                : relation
        );

        return { ...updated };
    }

    listGuardianPlayers(guardianId: string): GuardianLinkedPlayer[] {
        return this.relations
            .filter((relation) => relation.guardian.id === guardianId)
            .map((relation) => {
                const player = this.players.find((item) => item.id === relation.playerId);
                return player
                    ? {
                          relationId: relation.id,
                          playerId: player.id,
                          fullName: `${player.firstName} ${player.lastName}`.trim(),
                          categoryName: player.categoryName,
                          isPrimary: relation.isPrimary,
                          status: player.status
                      }
                    : null;
            })
            .filter((item): item is GuardianLinkedPlayer => item !== null);
    }

    listAvailablePlayersForGuardian(guardianId: string): Player[] {
        const linkedPlayerIds = new Set(this.relations.filter((relation) => relation.guardian.id === guardianId).map((relation) => relation.playerId));
        return this.players.filter((player) => !linkedPlayerIds.has(player.id)).map((player) => ({ ...player, photo: player.photo ? { ...player.photo } : null }));
    }

    listPlayerGuardians(playerId: string): PlayerGuardianRelation[] {
        return this.relations.filter((relation) => relation.playerId === playerId).map((relation) => ({ ...relation, guardian: { ...relation.guardian } }));
    }

    getActiveMembership(playerId: string): PlayerMembership | null {
        const membership = this.memberships.find((item) => item.playerId === playerId && item.status === 'ACTIVE');
        return membership ? { ...membership } : null;
    }

    listMembershipHistory(playerId: string): PlayerMembershipHistoryItem[] {
        return this.membershipHistory.filter((item) => item.playerId === playerId).map((item) => ({ ...item }));
    }

    listInitialChargesByPlayer(playerId: string): PlayerInitialCharge[] {
        const membershipIds = new Set(this.memberships.filter((item) => item.playerId === playerId).map((item) => item.id));
        return this.initialCharges.filter((item) => membershipIds.has(item.membershipId)).map((item) => ({ ...item }));
    }

    createMembership(playerId: string, primaryGuardianId: string): PlayerMembership | null {
        const existing = this.getActiveMembership(playerId);
        if (existing) {
            return existing;
        }

        const membershipId = `membership-${Date.now()}`;
        const startedAt = new Date().toISOString();
        const membership: PlayerMembership = {
            id: membershipId,
            academyId: this.academyId,
            playerId,
            primaryGuardianId,
            status: 'ACTIVE',
            startedAt,
            endedAt: null
        };

        this.memberships = [membership, ...this.memberships.filter((item) => item.playerId !== playerId || item.status !== 'ACTIVE')];
        this.membershipHistory = [{ id: membershipId, playerId, primaryGuardianId, status: 'ACTIVE', startedAt, endedAt: null }, ...this.membershipHistory];
        this.initialCharges = [
            {
                id: `charge-${Date.now()}-1`,
                membershipId,
                paymentConceptId: 'concept-001',
                conceptName: 'Matrícula',
                description: 'Cobro inicial de matrícula',
                amount: '150000.00',
                status: 'PENDING'
            },
            {
                id: `charge-${Date.now()}-2`,
                membershipId,
                paymentConceptId: 'concept-002',
                conceptName: 'Primera mensualidad',
                description: 'Primer cargo mensual del jugador',
                amount: '120000.00',
                status: 'PENDING'
            },
            ...this.initialCharges
        ];

        return { ...membership };
    }

    suspendMembership(playerId: string): PlayerMembership | null {
        return this.changeMembershipStatus(playerId, 'SUSPENDED');
    }

    withdrawMembership(playerId: string): PlayerMembership | null {
        return this.changeMembershipStatus(playerId, 'WITHDRAWN');
    }

    getGuardianDisplayName(guardianId: string): string {
        const guardian = this.guardians.find((item) => item.id === guardianId);
        return guardian ? `${guardian.firstName} ${guardian.lastName}`.trim() : 'Sin acudiente';
    }

    getPlayerDebtSummary(playerId: string): { pendingAmount: string; pendingCharges: number } {
        const charges = this.listInitialChargesByPlayer(playerId).filter((item) => item.status === 'PENDING');
        const pendingAmount = charges.reduce((total, charge) => total + Number(charge.amount), 0);

        return {
            pendingAmount: pendingAmount.toFixed(2),
            pendingCharges: charges.length
        };
    }

    associateExistingGuardian(playerId: string, guardianId: string): PlayerGuardianRelation | null {
        const guardian = this.guardians.find((item) => item.id === guardianId);
        if (!guardian) {
            return null;
        }

        const hasPrimary = this.relations.some((relation) => relation.playerId === playerId && relation.isPrimary);
        const relation: PlayerGuardianRelation = {
            id: `relation-${Date.now()}`,
            academyId: this.academyId,
            playerId,
            isPrimary: !hasPrimary,
            guardian
        };

        this.relations = [relation, ...this.relations];
        return { ...relation, guardian: { ...guardian } };
    }

    createGuardianAndAssociate(playerId: string, payload: GuardianForm): PlayerGuardianRelation {
        const guardian = this.createGuardian(payload);
        const relation = this.associateExistingGuardian(playerId, guardian.id)!;
        return relation;
    }

    markPrimaryGuardian(playerId: string, guardianId: string): void {
        this.relations = this.relations.map((relation) =>
            relation.playerId === playerId ? { ...relation, isPrimary: relation.guardian.id === guardianId } : relation
        );
    }

    removeGuardianRelation(playerId: string, guardianId: string): { ok: boolean; reason?: 'primary-guardian' } {
        const relation = this.relations.find((item) => item.playerId === playerId && item.guardian.id === guardianId);

        if (!relation) {
            return { ok: true };
        }

        if (relation.isPrimary) {
            return { ok: false, reason: 'primary-guardian' };
        }

        this.relations = this.relations.filter((item) => item.id !== relation.id);
        return { ok: true };
    }

    private changeMembershipStatus(playerId: string, status: 'SUSPENDED' | 'WITHDRAWN'): PlayerMembership | null {
        const activeMembership = this.memberships.find((item) => item.playerId === playerId && item.status === 'ACTIVE');
        if (!activeMembership) {
            return null;
        }

        const endedAt = new Date().toISOString();
        const updated: PlayerMembership = { ...activeMembership, status, endedAt };

        this.memberships = this.memberships.map((item) => (item.id === activeMembership.id ? updated : item));
        this.membershipHistory = [
            {
                id: `${activeMembership.id}-${status.toLowerCase()}`,
                playerId,
                primaryGuardianId: activeMembership.primaryGuardianId,
                status,
                startedAt: activeMembership.startedAt,
                endedAt
            },
            ...this.membershipHistory.filter((item) => item.id !== activeMembership.id)
        ];

        return { ...updated };
    }
}
