export interface PlayerPhoto {
    path: string;
    url: string;
    mimeType: string;
    size: number;
    checksum: string;
}

export interface Player {
    id: string;
    academyId: string;
    categoryId: string;
    categoryName: string;
    documentType: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    documentNumber: string;
    nationality: string | null;
    gender: string | null;
    federationId: string | null;
    dominantFoot: string | null;
    email: string | null;
    phoneNumber: string | null;
    status: 'ACTIVE' | 'INACTIVE';
    photo: PlayerPhoto | null;
}

export interface PlayerForm {
    documentType: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    documentNumber: string;
    nationality: string;
    gender: string;
    federationId: string;
    dominantFoot: string;
    email: string;
    phoneNumber: string;
    categoryId: string;
}

export interface Guardian {
    id: string;
    academyId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    documentType: string;
    documentNumber: string;
    address: string;
    relationship: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface PlayerGuardianRelation {
    id: string;
    academyId: string;
    playerId: string;
    isPrimary: boolean;
    guardian: Guardian;
}

export interface GuardianForm {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    documentType: string;
    documentNumber: string;
    address: string;
    relationship: string;
}

export interface CategoryOption {
    id: string;
    name: string;
}

export interface TeamOption {
    id: string;
    academyId: string;
    name: string;
    categoryId: string;
    categoryName: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface PlayerTeamAssignment {
    id: string;
    academyId: string;
    playerId: string;
    teamId: string;
    teamName: string;
    teamCategoryName: string;
    startDate: string;
    endDate: string | null;
    isPrimary: boolean;
}

export interface PlayerTeamAssignmentForm {
    teamId: string;
    startDate: string;
    markAsPrimary: boolean;
}

export interface GuardianLinkedPlayer {
    relationId: string;
    playerId: string;
    fullName: string;
    categoryName: string;
    isPrimary: boolean;
    status: 'ACTIVE' | 'INACTIVE';
}

export type MembershipStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';
export type InitialChargeStatus = 'PENDING' | 'PAID';

export interface PlayerMembership {
    id: string;
    academyId: string;
    playerId: string;
    primaryGuardianId: string;
    status: MembershipStatus;
    startedAt: string;
    endedAt: string | null;
}

export interface PlayerMembershipHistoryItem {
    id: string;
    playerId: string;
    primaryGuardianId: string;
    status: MembershipStatus;
    startedAt: string;
    endedAt: string | null;
}

export interface PlayerInitialCharge {
    id: string;
    membershipId: string;
    paymentConceptId: string;
    conceptCode: string;
    conceptName: string;
    description: string;
    amount: string;
    dueDate: string;
    sourceLabel: string;
    status: InitialChargeStatus;
}

export interface PlayerChargeForm {
    conceptId: string;
    conceptCode: string;
    conceptName: string;
    amount: string;
    dueDate: string;
    description: string;
    nextStep: 'CHARGE_ONLY' | 'CHARGE_AND_PAYMENT';
}
