export type TenantStatus = 'ACTIVE' | 'SUSPENDED';

export interface TenantListItem {
    id: string;
    name: string;
    contactEmail: string;
    contactName: string;
    phone: string;
    country: string;
    department: string;
    city: string;
    address: string;
    status: TenantStatus;
    createdAt: string;
}

export interface TenantForm {
    id?: string;
    name: string;
    contactEmail: string;
    contactName: string;
    phone: string;
    country: string;
    department: string;
    city: string;
    address: string;
}
