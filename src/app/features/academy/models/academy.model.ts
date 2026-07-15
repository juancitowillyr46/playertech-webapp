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

export interface AcademyTaxProfile {
    legalName: string;
    taxIdType: string;
    taxIdNumber: string;
    taxCheckDigit: string;
    taxRegime: string;
    billingEmail: string;
    fiscalAddress: string;
    fiscalCity: string;
    fiscalCountry: string;
}
