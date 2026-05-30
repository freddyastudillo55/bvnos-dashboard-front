import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { DashboardService } from '../../../services/dashboard.service';
import {
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ApexTooltip,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';

@Component({
  selector: 'app-service-sales-pie-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule
  ],
  templateUrl: './service-sales-pie-chart.component.html',
  styleUrl: './service-sales-pie-chart.component.css'
})
export class ServiceSalesPieChartComponent
  implements OnInit {

  @ViewChild('chart') chart!: ChartComponent;

  startDate = '';

  endDate = '';

  chartSeries: ApexNonAxisChartSeries = [];

  chartLabels: string[] = [];

  chartDetails: ApexChart = {
    type: 'pie',
    height: 380
  };

  chartLegend: ApexLegend = {
    position: 'bottom'
  };

  chartTooltip: ApexTooltip = {
    y: {
      formatter: (value) => {
        return `${value}%`;
      }
    }
  };

  chartResponsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ];

  constructor(
    private dashboardService: DashboardService
  ) { }

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

    this.loadChart();
  }

  loadChart(): void {
    this.dashboardService
      .getServiceSalesPercentage(
        this.startDate,
        this.endDate
      )
      .subscribe({
        next: (response) => {
          this.chartSeries =
            response.map(
              (item: any) => item.percentage
            );

          this.chartLabels =
            response.map(
              (item: any) => item.service
            );

          if (this.chart) {
            this.chart.updateSeries(this.chartSeries);
            this.chart.updateOptions({
              labels: this.chartLabels
            });
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}