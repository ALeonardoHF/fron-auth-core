export interface User {
    id: string;
    email: string;
    role: 'Client' | 'Admin';
    isActive?: boolean;
    lastLogin?: string;
    createdAt?: string;
    isTwoFactorEnabled?: boolean;
    displayName?: string;
}