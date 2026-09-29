import { Component, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
    selector: 'app-two-factor-recovery',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './two-factor-recovery.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoFactorRecoveryComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    loading = signal(false);
    sent = signal(false);
    errorMsg = signal('');

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    submit(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return}
        this.loading.set(true);
        this.errorMsg.set('');
        const email = this.form.value.email!;
        this.authService.recoveryRequest(email).subscribe({
            next: () => { this.sent.set(true); this.loading.set(false); },
            error: () => { this.errorMsg.set('Error al enviar. Intenta de nuevo.'); this.loading.set(false); }
        });
    }
}