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
  selector: 'app-reconciled-payments-bar-chart',

  standalone: true,

  imports: [
    CommonModule,
    NgApexchartsModule
  ],

  templateUrl:
    './reconciled-payments-bar-chart.component.html',

  styleUrls: [
    './reconciled-payments-bar-chart.component.css'
  ]
})
export class ReconciledPaymentsBarChartComponent
  implements OnInit {

  @ViewChild('chart')
  chart!: ChartComponent;

  chartSeries: ApexAxisChartSeries = [
    {
      name: 'Reconciled',
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

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {

    this.loadChart();
  }

  loadChart(): void {

    this.dashboardService
      .getReconciledPaymentsLastSixMonths()
      .subscribe({
        next: (response) => {

          this.chartSeries = [
            {
              name: 'Reconciled',
              data: response.map(
                (item: any) => item.totalReconciled
              )
            }
          ];

          this.chartXAxis = {
            categories: response.map(
              (item: any) => item.month
            )
          };

          if (this.chart) {

            this.chart.updateOptions({
              colors: this.chartColors,
              xaxis: this.chartXAxis
            });

            this.chart.updateSeries(
              this.chartSeries
            );
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}