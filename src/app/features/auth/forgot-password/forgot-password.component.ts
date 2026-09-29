import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingButtonDirective } from '../../../shared/directives/loading-button.directive';

 @Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, LoadingButtonDirective],
    templateUrl: './forgot-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
 })
 export class ForgotPasswordComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    loading = signal(false);
    successMsg = signal('');
    errorMsg = signal('');

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.authService.forgotPassword(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.successMsg.set('Si el email existe recibirás un link para restablecer tu contraseña.');
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Error al enviar el correo. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }
}