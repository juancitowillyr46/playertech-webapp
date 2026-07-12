import { MockUserRole } from '@/app/core/auth/mock-auth.service';

export type UserAccountStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    academyId: string | null;
    academyName: string | null;
    roles: string[];
    role: MockUserRole;
    roleLabel: string;
    status: UserAccountStatus;
    statusLabel: string;
}
