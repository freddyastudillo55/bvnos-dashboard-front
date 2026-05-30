import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserSettingsService, UserProfile } from '../../../features/dashboard/services/user-settings.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);
  private userSettingsService = inject(UserSettingsService);

  login(payload: any) {
    return this.http.post<UserProfile>(`${this.apiUrl}/login`, payload).pipe(
      map(user => {
        this.userSettingsService.setCurrentUser(user);
        return user;
      })
    );
  }
}
