import { Component, inject, signal, ChangeDetectionStrategy, OnInit, DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingButtonDirective } from '../../../shared/directives/loading-button.directive';
import { Subject } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, LoadingButtonDirective],
    templateUrl: './login.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    loading = signal(false);
    errorMsg = signal('');

    private submitClick$ = new Subject<void>();

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    ngOnInit(): void {
        this.submitClick$.pipe(
            exhaustMap(() => {
                this.loading.set(true);
                this.errorMsg.set('');
                return this.authService.login(this.form.getRawValue() as any);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: response => {
                if (response.requiresTwoFactor) {
                    this.router.navigate(['/auth/two-factor'], {
                        queryParams: { email: response.email }
                    });
                } else {
                    this.authService.saveTokens(response.auth!);
                    this.router.navigate(['/dashboard']);
                }
                this.loading.set(false);
            },
            error: (err) => {
                if (err.status === 429) {
                    this.errorMsg.set('Demasiados intentos. Espera 1 minuto e intenta de nuevo.');
                } else {
                    this.errorMsg.set('Credenciales incorrectas');
                }
                this.loading.set(false);
            }
        });
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.submitClick$.next();
    }
}
