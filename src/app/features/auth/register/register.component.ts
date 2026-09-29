import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingButtonDirective } from '../../../shared/directives/loading-button.directive';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, LoadingButtonDirective],
    templateUrl: './register.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loading = signal(false);
    errorMsg = signal('');

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        role: [3] // 3 = Client por default
    }, { validators: passwordsMatch });

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMsg.set('');

        const { confirmPassword, ...body } = this.form.getRawValue();

        this.authService.register(body as any).subscribe({
            next: () => this.router.navigate(['/auth/login']),
            error: (err) => {
                if (err.status === 429) {
                    this.errorMsg.set('Demasiados intentos. Espera un momento.');
                } else {
                    this.errorMsg.set('Error al registrar. El email puede estar en uso.');
                }
                this.loading.set(false);
            }

        })
    }

}