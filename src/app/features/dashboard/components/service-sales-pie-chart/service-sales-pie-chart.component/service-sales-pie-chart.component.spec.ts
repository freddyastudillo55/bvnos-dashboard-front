import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSalesPieChartComponent } from './service-sales-pie-chart.component';

describe('ServiceSalesPieChartComponent', () => {
  let component: ServiceSalesPieChartComponent;
  let fixture: ComponentFixture<ServiceSalesPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceSalesPieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceSalesPieChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
