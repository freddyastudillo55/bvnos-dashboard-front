import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { FormsModule }
  from '@angular/forms';

import { SalesDetailsChartComponent }
  from '../../components/sales-details-chart/sales-details-chart.component/sales-details-chart.component';

import { ServiceSalesPieChartComponent }
  from '../../components/service-sales-pie-chart/service-sales-pie-chart.component/service-sales-pie-chart.component';

import { ProviderPaymentsBarChartComponent }
from '../../components/provider-payments-bar-chart/provider-payments-bar-chart.component/provider-payments-bar-chart.component';

import { ReconciledPaymentsBarChartComponent }
from '../../components/reconciled-payments-bar-chart/reconciled-payments-bar-chart.component/reconciled-payments-bar-chart.component';

@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    SalesDetailsChartComponent,
    ServiceSalesPieChartComponent,
    ProviderPaymentsBarChartComponent,
    ReconciledPaymentsBarChartComponent
  ],

  templateUrl: './home.component.html',

  styleUrl: './home.component.css',
})
export class HomeComponent
  implements OnInit {

  startDate = '';

  endDate = '';

  ngOnInit(): void {

    const today = new Date();

    const prior = new Date();

    prior.setDate(
      today.getDate() - 30
    );

    this.startDate =
      prior.toISOString().split('T')[0];

    this.endDate =
      today.toISOString().split('T')[0];
  }
}