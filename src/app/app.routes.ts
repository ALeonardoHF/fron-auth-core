import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { profileResolver } from './core/resolvers/profile.resolver';
import { unsavedChangesGuard } from './core/guards/unsave-changes.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'two-factor',
                loadComponent: () => import('./features/auth/two-factor/two-factor.component').then(m => m.TwoFactorComponent)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
            },
            {
                path: '2fa/setup',
                loadComponent: () => import('./features/auth/two-factor-setup/two-factor-setup.component').then(m => m.TwoFactorSetupComponent),
                canActivate: [authGuard],
                canDeactivate: [unsavedChangesGuard]
            },
            {
                path: '2fa/recovery',
                loadComponent: () => import('./features/auth/two-factor-recovery/two-factor-recovery.component').then(m => m.TwoFactorRecoveryComponent)
            },
            {
                path: '2fa/recovery/confirm',
                loadComponent: () => import('./features/auth/two-factor-recovery-confirm/two-factor-recovery-confirm.component').then(m => m.TwoFactorRecoveryConfirmComponent)
            }
        ]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard],
        resolve: { user: profileResolver }
    },
    {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: 'Admin' }
    },
    {
        path: 'admin/users/:id',
        loadComponent: () => import('./features/admin/user-detail/user-detail.component').then(m => m.UserDetailComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: 'Admin' }
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
