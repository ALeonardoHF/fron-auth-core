import { Component, Input, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { RoleLabelPipe } from '../../../shared/pipes/role-label.pipe';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [RouterLink, RoleLabelPipe, DatePipe],
    templateUrl: './user-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent implements OnInit {
    @Input() id!: string;

    private userService = inject(UserService);
    user = signal<User | null>(null);
    loading = signal(true);
    errorMsg = signal('');

    ngOnInit(): void {
        this.userService.getById(this.id).subscribe({
            next: u => { this.user.set(u); this.loading.set(false); },
            error: () => { this.errorMsg.set('Usuario no encontrado.'); this.loading.set(false); }
        });
    }
}