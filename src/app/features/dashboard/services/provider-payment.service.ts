import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface ProviderPaymentRequestDTO {
    id?: string;
    providerId: string;
    providerName: string;
    amount: number;
    paymentDate: string;
    status: 'Paid' | 'Pending';
    description: string;
}

export interface ProviderPaymentResponseDTO {
    id: string;
    providerId: string;
    providerName: string;
    amount: number;
    paymentDate: string;
    status: 'Paid' | 'Pending';
    description: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProviderPaymentService {
    private http = inject(HttpClient);
    private apiUrl =
        `${environment.apiUrl}/provider-payments`;

    getAllPayments(): Observable<ProviderPaymentResponseDTO[]> {
        return this.http.get<ProviderPaymentResponseDTO[]>(`${this.apiUrl}/getPayments`);
    }

    getAllActivePayments(): Observable<ProviderPaymentResponseDTO[]> {
        return this.http.get<ProviderPaymentResponseDTO[]>(`${this.apiUrl}/getActivePayments`);
    }

    getPaymentsByProvider(providerId: string): Observable<ProviderPaymentResponseDTO[]> {
        return this.http.get<ProviderPaymentResponseDTO[]>(`${this.apiUrl}/getPaymentsByProvider/${providerId}`);
    }

    savePayment(payment: ProviderPaymentRequestDTO): Observable<ProviderPaymentResponseDTO> {
        return this.http.post<ProviderPaymentResponseDTO>(`${this.apiUrl}/create`, payment);
    }

    updatePayment(id: string, payment: ProviderPaymentRequestDTO): Observable<ProviderPaymentResponseDTO> {
        return this.http.put<ProviderPaymentResponseDTO>(`${this.apiUrl}/update/${id}`, payment);
    }

    deletePayment(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
    }
}