import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import * as XLSX from 'xlsx';
import { DashboardService } from '../../../services/dashboard.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexXAxis,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexTooltip,
  ApexYAxis,
  ChartComponent
} from 'ng-apexcharts';

@Component({
  selector: 'app-sales-details-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgApexchartsModule
  ],
  templateUrl: './sales-details-chart.component.html',
  styleUrl: './sales-details-chart.component.css'
})
export class SalesDetailsChartComponent implements OnChanges {

  @ViewChild('chart') chart!: ChartComponent;

  @Input()
  startDate!: string;

  @Input()
  endDate!: string;

  salesData: any[] = [];

  chartSeries: ApexAxisChartSeries = [
    {
      name: 'Sales',
      data: []
    }
  ];

  chartDetails: ApexChart = {
    type: 'area',
    height: 380,
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  };

  chartStroke: ApexStroke = {
    curve: 'smooth',
    width: 3
  };

  chartXAxis: ApexXAxis = {
    categories: []
  };

  chartYAxis: ApexYAxis = {
    labels: {
      formatter: (value) => {
        return `$${value.toFixed(0)}`;
      }
    }
  };

  chartDataLabels: ApexDataLabels = {
    enabled: false
  };

  chartFill: ApexFill = {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.25,
      opacityTo: 0.02,
      stops: [0, 100]
    }
  };

  chartGrid: ApexGrid = {
    borderColor: '#f1f5f9',
    strokeDashArray: 4
  };

  chartTooltip: ApexTooltip = {
    theme: 'light',
    y: {
      formatter: (value) => {
        return `$${value.toFixed(2)}`;
      }
    }
  };

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnChanges(
    changes: SimpleChanges
  ): void {
    if (
      this.startDate &&
      this.endDate
    ) {
      this.loadChart();
    }
  }

 loadChart(): void {
    this.dashboardService
      .getSalesDetails(
        this.startDate,
        this.endDate
      )
      .subscribe({
        next: (response) => {
          this.salesData = response;

          this.chartSeries = [
            {
              name: 'Sales',
              data: response.map(
                (item: any) => item.totalSales
              )
            }
          ];

          this.chartXAxis = {
            categories: response.map(
              (item: any) => item.date
            )
          };

          if (this.chart) {
            this.chart.updateSeries(this.chartSeries);
            this.chart.updateOptions({
              xaxis: this.chartXAxis
            });
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  exportExcel(): void {
    const worksheet =
      XLSX.utils.json_to_sheet(
        this.salesData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Sales Details'
    );

    XLSX.writeFile(
      workbook,
      'sales-details.xlsx'
    );
  }
}