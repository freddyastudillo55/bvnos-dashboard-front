import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  area: string;
  role: string;
  active?: boolean;
  createdAt?: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  area: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) {
      try {
        this.currentUserSubject.next(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('currentUser');
      }
    }
  }

  setCurrentUser(user: UserProfile) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.getValue();
  }

  updateUser(id: string, data: UpdateUserRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/update/${id}`, data).pipe(
      tap(updatedUser => {
        this.setCurrentUser(updatedUser);
      })
    );
  }

  clearSession() {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
