import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [FormsModule],
    template: `
    <div class="modal-overlay">
        <div class="modal">
        <p>{{ message() }}</p>
        <input type="text" [(ngModel)]="code" placeholder="Código TOTP" maxlength="6" />
        <button (click)="confirmed.emit(code)">Confirmar</button>
        <button (click)="cancelled.emit()">Cancelar</button>
        </div>
    </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModalComponent {
    message = input<string>('¿Estás seguro?');
    code = '';
    confirmed = output<string>();
    cancelled = output<void>();
}
