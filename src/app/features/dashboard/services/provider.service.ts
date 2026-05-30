import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface ProviderRequestDTO {
    id?: string;
    name: string;
    active?: boolean;
}

export interface ProviderDashboardResponseDTO {
    id: string;
    name: string;
    active: boolean;
    totalInPayments: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProviderService {
    private http = inject(HttpClient);
    private apiUrl =
        `${environment.apiUrl}/providers`;

    getAllProviders(): Observable<ProviderDashboardResponseDTO[]> {
        return this.http.get<ProviderDashboardResponseDTO[]>(`${this.apiUrl}/getProviders`);
    }

    getAllActiveProviders(): Observable<ProviderDashboardResponseDTO[]> {
        return this.http.get<ProviderDashboardResponseDTO[]>(`${this.apiUrl}/getActiveProviders`);
    }

    saveProvider(provider: ProviderRequestDTO): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create`, provider);
    }

    deleteProvider(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }

    updateProvider(id: string, provider: ProviderRequestDTO): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update/${id}`, provider);
    }
}