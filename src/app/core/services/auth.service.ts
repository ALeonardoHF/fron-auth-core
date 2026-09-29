import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, AuthTokens, TwoFactorRequest, RefreshRequest, RegisterRequest, ForgotPasswordRequest, TwoFactorSetupResponse } from '../models/auth.model';
import { User } from '../models/user.model';
import { API_URL } from '../tokens/api-url.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = inject(API_URL);


    // Estado con Signals
    private currentUser = signal<User | null>(null);
    isAuthenticated = computed(() => !!this.currentUser());
    currentRole = computed(() => this.currentUser()?.role ?? null);

    login(body: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body);
    }

    register(body: RegisterRequest): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/users`, body);
    }

    verifyTwoFactor(body: TwoFactorRequest): Observable<AuthTokens> {
        return this.http.post<AuthTokens>(`${this.apiUrl}/auth/2fa/verify`, body).pipe(
            tap(tokens => this.saveTokens(tokens))
        );
    }

    refreshToken(): Observable<AuthTokens> {
        const refreshToken = this.getRefreshToken();
        return this.http.post<AuthTokens>(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
            tap(tokens => this.saveTokens(tokens))
        );
    }

    forgotPassword(body: ForgotPasswordRequest): Observable<string> {
        return this.http.post(`${this.apiUrl}/auth/forgot-password`, body, {
            responseType: 'text'
        });
    }

    logout(): void {
        const refreshToken = this.getRefreshToken();
        this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken }).subscribe();
        this.clearSession();
    }

    saveTokens(tokens: AuthTokens): void {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('role', tokens.role);
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    setCurrentUser(user: User): void {
        this.currentUser.set(user);
    }

    clearSession(): void {
        localStorage.clear();
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    setupTwoFactor(): Observable<TwoFactorSetupResponse> {
        return this.http.post<TwoFactorSetupResponse>(`${this.apiUrl}/auth/2fa/setup`, {});
    }

    enableTwoFactor(code: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/auth/2fa/enable`, { code }, { responseType: 'text' });
    }

    disableTwoFactor(code: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/auth/2fa/disable`, { code }, { responseType: 'text' });
    }

    recoveryRequest(email: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/auth/2fa/recovery/request`, { email }, { responseType: 'text' });
    }

    recoveryConfirm(token: string, password: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/auth/2fa/recovery/confirm`, { token, password }, { responseType: 'text' });
    }

    changePassword(currentPassword: string, newPassword: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/auth/change-password`, { currentPassword, newPassword }, { responseType: 'text' });
    }

    logoutAll(): void {
        this.http.post(`${this.apiUrl}/auth/logout-all`, {}).subscribe();
        this.clearSession();
    }
}