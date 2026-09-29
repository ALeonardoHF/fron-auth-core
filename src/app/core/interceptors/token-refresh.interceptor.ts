import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const isAuthRequest = req.url.includes('/auth/');

            const hasRefreshToken = !!authService.getRefreshToken();

            if (error.status === 401 && !isAuthRequest && hasRefreshToken) {
                return authService.refreshToken().pipe(
                    switchMap(tokens => {
                        const retryReq = req.clone({
                            setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
                        });
                        return next(retryReq);
                    }),
                    catchError(refreshError => {
                        authService.clearSession();
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};