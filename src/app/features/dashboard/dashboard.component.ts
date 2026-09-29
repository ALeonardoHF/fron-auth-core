import { Component, inject, signal, ChangeDetectionStrategy, ChangeDetectorRef, effect, ViewContainerRef, ComponentRef } from '@angular/core';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { RoleLabelPipe } from '../../shared/pipes/role-label.pipe';
import { FormsModule } from '@angular/forms';
import { IfRoleDirective } from '../../shared/directives/if-role.directive';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs';
import { interval } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RoleLabelPipe, FormsModule, IfRoleDirective, AsyncPipe],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private vcr = inject(ViewContainerRef);
  private modalRef: ComponentRef<ConfirmModalComponent> | null = null;
  private sanitizer = inject(DomSanitizer);

  welcomeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(
    '<strong>Bienvenido</strong> al panel de <em>autenticación segura</em>.'
  );

  constructor() {
    effect(() => {
      this.notificationService.current$.subscribe(() => {
        this.cdr.markForCheck();
      });
    });
  }

  notificationService = inject(NotificationService);

  user = signal<User | null>(this.route.snapshot.data['user'].me);
  isAdmin = this.authService.currentRole;
  disabling = signal(false);
  disableCode = '';
  disableLoading = signal(false);

  currentTime$: Observable<string> = interval(1000).pipe(
    startWith(0),
    map(() => new Date().toLocaleTimeString('es-MX'))
  );

  confirmDisable(): void {
    if (!this.disableCode) return;
    this.disableLoading.set(true);
    this.authService.disableTwoFactor(this.disableCode).subscribe({
      next: () => {
        this.notificationService.show('2FA desactivado correctamente.', 'success');
        this.disableLoading.set(false);
        this.disabling.set(false);
      },
      error: () => {
        this.notificationService.show('Código incorrecto o 2FA no estaba activo.', 'error');
        this.disableLoading.set(false);
      }
    });
  }

  openDisableModal(): void {
    this.vcr.clear();
    this.modalRef = this.vcr.createComponent(ConfirmModalComponent);
    this.modalRef.setInput('message', '¿Desactivar 2FA? Ingresa tu código TOTP para confirmar.');
    this.modalRef.instance.confirmed.subscribe((code: string) => {
      this.disableCode = code;
      this.executeDisable();
    });
    this.modalRef.instance.cancelled.subscribe(() => this.closeModal());
  }

  closeModal(): void {
    this.vcr.clear();
    this.modalRef = null;
    this.disabling.set(false);
  }

  executeDisable(): void {
    if (!this.disableCode) return;
    this.closeModal();
    this.disableLoading.set(true);
    this.authService.disableTwoFactor(this.disableCode).subscribe({
      next: () => {
        this.notificationService.show('2FA desactivado correctamente.', 'success');
        this.disableLoading.set(false);
      },
      error: () => {
        this.notificationService.show('Código incorrecto o 2FA no estaba activo.', 'error');
        this.disableLoading.set(false);
      }
    });
  }


  logout(): void {
    this.authService.logout();
  }

  logoutAll(): void {
    this.authService.logoutAll();
  }

  goToUsers(): void {
    this.router.navigate(['/admin/users']);
  }
}
