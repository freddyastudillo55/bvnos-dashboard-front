import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderPaymentsBarChartComponent } from './provider-payments-bar-chart.component';

describe('ProviderPaymentsBarChart', () => {
  let component: ProviderPaymentsBarChartComponent;
  let fixture: ComponentFixture<ProviderPaymentsBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderPaymentsBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderPaymentsBarChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
