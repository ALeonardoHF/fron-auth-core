import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const requireRole = route.data['role'] as string;

    if (authService.currentRole() === requireRole) return true;
    
    return router.createUrlTree(['/dashboard']);
};