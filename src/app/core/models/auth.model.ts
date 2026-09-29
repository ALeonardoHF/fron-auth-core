export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    requiresTwoFactor: boolean;
    email: string | null;
    auth: AuthTokens | null;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    role: string;
}

export interface TwoFactorRequest {
    email: string;
    code: string;
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    role: number;
}

export interface TwoFactorSetupResponse {
    qrCodeBase64: string;
    manualCode: string;
}