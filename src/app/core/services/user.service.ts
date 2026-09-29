import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../tokens/api-url.token';
import { User } from '../models/user.model';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = inject(API_URL);

    getMe(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/me`);
    }

    getAll(search?: string): Observable<User[]> {
        const params: Record<string, string> = {};
        if (search) params['search'] = search;
        return this.http.get<User[]>(`${this.apiUrl}/users`, { params }).pipe(
            shareReplay(1)
        );
    }

    getById(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/users/${id}`);
    }

    updateMe(data: { displayName: string }): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/users/me`, data);
    }

}