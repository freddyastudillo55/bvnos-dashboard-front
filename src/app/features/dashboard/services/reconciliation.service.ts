import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReconciliationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/reconciliation`;

    processReconciliation(name: string, fileA: File, fileB: File): Observable<any> {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('fileA', fileA);
        formData.append('fileB', fileB);
        return this.http.post(`${this.apiUrl}/process`, formData);
    }

    getResults(processId: string, params: any): Observable<any> {
        let httpParams = new HttpParams()
            .set('page', (params.page ?? 0).toString())
            .set('size', (params.size ?? 10).toString());

        if (params.customerId && String(params.customerId).trim() !== '') {
            httpParams = httpParams.set('customerId', String(params.customerId).trim());
        }
        if (params.service && String(params.service).trim() !== '') {
            httpParams = httpParams.set('service', String(params.service).trim());
        }
        if (params.status && String(params.status).trim() !== '') {
            httpParams = httpParams.set('status', String(params.status).trim());
        }
        if (params.date && String(params.date).trim() !== '') {
            httpParams = httpParams.set('date', String(params.date).trim());
        }

        return this.http.get(`${this.apiUrl}/results/${processId}`, { params: httpParams });
    }

        getMonthlyResults(year: number, month: number, params: any): Observable<any> {
        let httpParams = new HttpParams()
            .set('year', year.toString())
            .set('month', month.toString())
            .set('page', (params.page ?? 0).toString())
            .set('size', (params.size ?? 10).toString());

        if (params.customerId && String(params.customerId).trim() !== '') {
            httpParams = httpParams.set('customerId', String(params.customerId).trim());
        }
        if (params.service && String(params.service).trim() !== '') {
            httpParams = httpParams.set('service', String(params.service).trim());
        }
        if (params.status && String(params.status).trim() !== '') {
            httpParams = httpParams.set('status', String(params.status).trim());
        }
        if (params.date && String(params.date).trim() !== '') {
            httpParams = httpParams.set('date', String(params.date).trim());
        }
        if (params.active && String(params.active).trim() !== '') {
            httpParams = httpParams.set('active', String(params.active).trim());
        }

        return this.http.get(`${this.apiUrl}/results/monthly`, { params: httpParams });
    }

    applyAdjustment(id: string, adjustmentData: { vestaAdjustedAmount: number, aaxAdjustedAmount: number, reason: string, adjustedBy: string }): Observable<any> {
        return this.http.patch(`${this.apiUrl}/results/${id}/adjust`, adjustmentData);
    }

    updateResult(id: string, data: { finalAmount: number, reconciledAt: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/results/${id}`, data);
    }

    deleteResult(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/results/${id}`);
    }
}
