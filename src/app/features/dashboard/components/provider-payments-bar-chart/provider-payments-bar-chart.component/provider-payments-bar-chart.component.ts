import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ChartComponent,
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels
} from 'ng-apexcharts';

import {
  DashboardService
} from '../../../services/dashboard.service';

@Component({
  selector: 'app-provider-payments-bar-chart',

  standalone: true,

  imports: [
    CommonModule,
    NgApexchartsModule
  ],

  templateUrl:
    './provider-payments-bar-chart.component.html',

  styleUrls: [
    './provider-payments-bar-chart.component.css'
  ]
})
export class ProviderPaymentsBarChartComponent
  implements OnInit {

  @ViewChild('chart')
  chart!: ChartComponent;

  chartSeries: ApexAxisChartSeries = [
    {
      name: 'Payments',
      data: []
    }
  ];

  chartDetails: ApexChart = {
    type: 'bar',
    height: 350,
    toolbar: {
      show: false
    }
  };

  chartXAxis: ApexXAxis = {
    categories: []
  };

  chartPlotOptions: ApexPlotOptions = {
    bar: {
      borderRadius: 6,
      columnWidth: '45%',
      distributed: true
    }
  };

  chartDataLabels: ApexDataLabels = {
    enabled: true
  };

  chartColors: string[] = [
    '#3b82f6',
    '#22c55e',
    '#f97316',
    '#eab308',
    '#a855f7',
    '#06b6d4',
    '#ef4444'
  ];

  dataLoaded = false;

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadChart();
  }

  loadChart(): void {
    this.dashboardService
      .getProviderPaymentsReport()
      .subscribe({
        next: (response) => {
          if (this.chart) {
            this.chart.updateOptions({
              colors: this.chartColors,
              xaxis: {
                categories: response.map(
                  (item: any) => item.providerName
                )
              }
            });

            this.chart.updateSeries([
              {
                name: 'Payments',
                data: response.map(
                  (item: any) => item.totalAmount
                )
              }
            ]);
          }
          this.dataLoaded = true;
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}