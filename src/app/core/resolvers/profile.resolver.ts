import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, tap } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

export interface ProfileData {
    me: User;
}

export const profileResolver: ResolveFn<ProfileData> = () => {
    const userService = inject(UserService);
    const authService = inject(AuthService);

    return userService.getMe().pipe(
        tap((me) => authService.setCurrentUser(me)),
        map((me) => ({ me }))
    );
};