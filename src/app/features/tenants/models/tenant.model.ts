export type TenantStatus = 'ACTIVE' | 'SUSPENDED';

export interface TenantListItem {
    id: string;
    name: string;
    contactEmail: string;
    phone: string;
    countryCode: string;
    country: string;
    department: string;
    city: string;
    address: string;
    adminName: string;
    adminEmail: string;
    categoryId: string;
    teamName: string;
    status: TenantStatus;
    createdAt: string;
}

export interface TenantForm {
    id?: string;
    name: string;
    contactEmail: string;
    phone: string;
    countryCode: string;
    country: string;
    department: string;
    city: string;
    address: string;
    phoneNumber: string;
    adminName: string;
    adminEmail: string;
    categoryId: string;
    teamName: string;
}
