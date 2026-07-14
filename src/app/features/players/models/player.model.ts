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
    firstName: string;
    lastName: string;
    birthDate: string;
    documentNumber: string;
    status: 'ACTIVE' | 'INACTIVE';
    photo: PlayerPhoto | null;
}

export interface PlayerForm {
    firstName: string;
    lastName: string;
    birthDate: string;
    documentNumber: string;
    categoryId: string;
}

export interface Guardian {
    id: string;
    academyId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
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
    relationship: string;
}

export interface CategoryOption {
    id: string;
    name: string;
}

export interface GuardianLinkedPlayer {
    relationId: string;
    playerId: string;
    fullName: string;
    categoryName: string;
    isPrimary: boolean;
    status: 'ACTIVE' | 'INACTIVE';
}
