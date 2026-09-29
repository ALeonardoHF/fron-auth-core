import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { API_URL } from '../tokens/api-url.token';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: API_URL, useValue: 'http://localhost:8080' }
      ]
    });
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access when token exists', () => {
    localStorage.setItem('accessToken', 'valid-token');
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBeTrue();
    localStorage.clear();
  });

  it('should redirect to login when no token', () => {
    localStorage.clear();
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).not.toBeTrue();
  });
});
