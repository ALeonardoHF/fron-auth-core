import { Component, inject, signal, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingButtonDirective } from '../../../shared/directives/loading-button.directive';
import { TotpInputComponent } from '../../../shared/components/totp-input/totp-input.component';

@Component({
    selector: 'app-two-factor',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, LoadingButtonDirective, TotpInputComponent],
    templateUrl: './two-factor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoFactorComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    loading = signal(false);
    errorMsg = signal('');
    email = signal('');
    @ViewChild('codeInput') codeInputRef!: TotpInputComponent;

    form = this.fb.group({
        code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    ngOnInit(): void {
        const email = this.route.snapshot.queryParamMap.get('email');
        if (!email) {
            this.router.navigate(['/auth/login']);
            return;
        }
        this.email.set(email);
    }

    ngAfterViewInit(): void {
        this.codeInputRef.focus();
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMsg.set('');

        this.authService.verifyTwoFactor({
            email: this.email(),
            code: this.form.getRawValue().code!
        }).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: () => {
                this.errorMsg.set('Código inválido o expirado');
                this.loading.set(false);
            }
        });
    }
}