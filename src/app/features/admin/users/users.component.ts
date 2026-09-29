import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit, DestroyRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, tap, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserTableComponent } from '../../../shared/components/user-table/user-table.component';
import { DatePipe } from '@angular/common';
import { RoleLabelPipe } from '../../../shared/pipes/role-label.pipe';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, FormsModule, UserTableComponent, DatePipe, RoleLabelPipe],
    templateUrl: './users.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    selectedUser = signal<User | null>(null);
    searchTerm = signal('');
    roleControl = new FormControl<string>('');
    roleFilter = signal('');
    templateSearch = '';

    // private allUsers = signal<User[]>([]);
    // loading = signal(true);
    // errorMsg = signal('');

    private userResult = toSignal(
        this.userService.getAll().pipe(
            catchError(() => {
                this.errorMsg.set('Error al cargar los usuarios');
                return of([]);
            }),
            tap(() => this.loading.set(false))
        ),
        { initialValue: [] }
    );

    private allUsers = computed(() => this.userResult());
    loading = signal(true);
    errorMsg = signal('');

    searchControl = new FormControl('');

    filteredUsers = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const role = this.roleFilter().toLowerCase();
        return this.allUsers().filter(u => {
            const matchesSearch = !term || u.email.toLowerCase().includes(term);
            const matchesRole = !role || u.role.toLowerCase().includes(role);
            return matchesSearch && matchesRole;
        });
    });

    ngOnInit(): void {
        this.searchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe(value => {
            this.roleFilter.set(value ?? '');
        });
    }

    onUserSelected(user: User): void {
        this.selectedUser.set(user);
        this.router.navigate(['/admin/users', user.id]);
    }
}