import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
    selector: 'app-two-factor-recovery-confirm',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './two-factor-recovery-confirm.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoFactorRecoveryConfirmComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    loading = signal(false);
    success = signal(false);
    errorMsg = signal('');
    private token = '';

    form = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
        if (!this.token) this.router.navigate(['/auth/login']);
    }

    submit(): void {
        if ( this.form.invalid ) { this.form.markAllAsTouched(); return; }
        this.loading.set(true);
        this.errorMsg.set('');
        const password = this.form.value.password!;
        this.authService.recoveryConfirm(this.token, password).subscribe({
            next: () => { this.success.set(true); this.loading.set(false); },
            error: () => { this.errorMsg.set('Token inválido o expirado.'); this.loading.set(false); }
        });
    }
}