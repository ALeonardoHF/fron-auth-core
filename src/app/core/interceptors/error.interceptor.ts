import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            switch (error.status) {
                case 403:
                    router.navigate(['/dashboard']);
                    break;
                case 429:
                    console.warn('Rate limit alcanzado - demasiadas requests');
                    break;
                case 500:
                    console.error('Error interno del servidor');
                    break;
            }
            return throwError(()=> error);
        })
    );
};