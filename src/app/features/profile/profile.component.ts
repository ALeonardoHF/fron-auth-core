import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { RoleLabelPipe } from '../../shared/pipes/role-label.pipe';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return newPassword === confirm ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RoleLabelPipe],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  user = signal<User | null>(null);
  profileSaved = signal(false);
  profileError = signal('');
  passwordSaved = signal(false);
  passwordError = signal('');

  profileForm = this.fb.group({
    displayName: ['', Validators.required]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordsMatch });

  ngOnInit(): void {
    this.userService.getMe().subscribe(u => {
      this.user.set(u);
      this.profileForm.patchValue({ displayName: u.displayName ?? '' });
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.profileError.set('');
    const { displayName } = this.profileForm.getRawValue();
    this.userService.updateMe({ displayName: displayName! }).subscribe({
      next: u => { this.user.set(u); this.profileSaved.set(true); setTimeout(() => this.profileSaved.set(false), 3000); },
      error: () => this.profileError.set('Error al guardar.')
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.passwordError.set('');
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.authService.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => { this.passwordSaved.set(true); this.passwordForm.reset(); setTimeout(() => this.passwordSaved.set(false), 3000); },
      error: () => this.passwordError.set('Contraseña actual incorrecta.')
    });
  }
}
