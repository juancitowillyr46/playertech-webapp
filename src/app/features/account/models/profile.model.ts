import { AuthRole } from '@/app/core/auth/auth.models';

export type UserAccountStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    academyId: string | null;
    academyName: string | null;
    roles: string[];
    primaryRole: AuthRole;
    primaryRoleLabel: string;
    contextLabel: string;
    status: UserAccountStatus;
    statusLabel: string;
}
