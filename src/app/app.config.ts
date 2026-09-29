import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { tokenRefreshInterceptor } from './core/interceptors/token-refresh.interceptor';
import { API_URL } from './core/tokens/api-url.token';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        tokenRefreshInterceptor,
        errorInterceptor
      ])
    ),
    { provide: API_URL, useValue: environment.apiUrl }
  ]
};
