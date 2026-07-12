export interface AcademyProfile {
    id: string | null;
    name: string;
    contactEmail: string;
    phone: string;
    countryCode: string;
    phoneNumber: string;
    country: string;
    department: string;
    city: string;
    address: string;
    status: 'ACTIVE' | 'SUSPENDED';
    statusLabel: string;
}
