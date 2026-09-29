import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { API_URL } from '../tokens/api-url.token';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: API_URL, useValue: 'http://localhost:8080' }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null token when not authenticated', () => {
    localStorage.clear();
    expect(service.getAccessToken()).toBeNull();
  });

  it('should save and retrieve tokens', () => {
    service.saveTokens({
      accessToken: 'test-token',
      refreshToken: 'test-refresh',
      role: 'Admin'
    });
    expect(service.getAccessToken()).toBe('test-token');
    expect(service.getRefreshToken()).toBe('test-refresh');
  });

  it('should clear session on logout', () => {
    service.saveTokens({ accessToken: 'abc', refreshToken: 'xyz', role: 'Client' });
    service.clearSession();
    expect(service.getAccessToken()).toBeNull();
  });

  it('isAuthenticated should be false when no user', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });
});
