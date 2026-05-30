import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private apiUrl =
        `${environment.apiUrl}/api/dashboard`;

    constructor(
        private http: HttpClient
    ) { }

    getSalesDetails(
        startDate: string,
        endDate: string
    ): Observable<any[]> {

        const params = new HttpParams()
            .set('startDate', startDate)
            .set('endDate', endDate);

        return this.http.get<any[]>(
            `${this.apiUrl}/sales-details`,
            { params }
        );
    }

    getServiceSalesPercentage(
        startDate: string,
        endDate: string
    ) {

        return this.http.get<any[]>(
            `${this.apiUrl}/service-sales-percentage`,
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );
    }

    getProviderPaymentsReport() {
        return this.http.get<any[]>(
            `${this.apiUrl}/provider-payments`
        );
    }

    getReconciledPaymentsLastSixMonths() {
        return this.http.get<any[]>(
            `${this.apiUrl}/reconciled-payments-last-six-months`
        );
    }
    
}