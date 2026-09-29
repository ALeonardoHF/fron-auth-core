import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TwoFactorSetupResponse } from '../../../core/models/auth.model';
import { CanComponentDeactivate } from '../../../core/guards/unsave-changes.guard';

@Component({
    selector: 'app-two-factor-setup',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './two-factor-setup.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoFactorSetupComponent implements OnInit, CanComponentDeactivate {
    private authService = inject(AuthService);
    private fb = inject(FormBuilder);

    setup = signal<TwoFactorSetupResponse | null>(null);
    loading = signal(true);
    enabling = signal(false);
    enabled = signal(false);
    errorMsg = signal('');
    enableError = signal('');

    form = this.fb.group({
        code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    canDeactivate(): boolean {
        return this.enabled();
    }

    ngOnInit(): void {
        this.authService.setupTwoFactor().subscribe({
            next: data => { this.setup.set(data); this.loading.set(false); },
            error: () => { this.errorMsg.set('Error al generar el QR.'); this.loading.set(false); }
        });
    }

    confirm(): void {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.enabling.set(true);
        this.enableError.set('');
        const code = this.form.value.code!;
        this.authService.enableTwoFactor(code).subscribe({
            next: () => { this.enabled.set(true); this.enabling.set(false); },
            error: () => { this.enableError.set('Código incorrecto. Intenta de nuevo.'); this.enabling.set(false); }
        });
    }
}
