import { Routes } from '@angular/router';

import { DashboardLayoutComponent } from './layout/dashboard-layout.component';

import { HomeComponent } from './pages/home/home.component';
import { ProvidersComponent } from './pages/providers/providers.component/providers.component';
import { ProviderPaymentsComponent } from './pages/provider-payments/provider-payments.component/provider-payments.component';
import { ReconciliationComponent } from './pages/reconciliations/reconciliation.component/reconciliation.component';
import { ProfileSettingsComponent } from './pages/users/profile-settings.component';

export const DASHBOARD_ROUTES: Routes = [

    {
        path: '',
        component: DashboardLayoutComponent,

        children: [

            {
                path: 'home',
                component: HomeComponent
            },

            {
                path: 'providers',
                component: ProvidersComponent
            },

            {
                path: 'provider-payments',
                component: ProviderPaymentsComponent
            },

            {
                path: 'reconciliations',
                component: ReconciliationComponent
            },

            {
                path: 'profile',
                component: ProfileSettingsComponent
            }
        ]
    }

];