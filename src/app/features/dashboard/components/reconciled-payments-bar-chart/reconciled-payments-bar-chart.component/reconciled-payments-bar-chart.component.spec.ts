import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ReconciledPaymentsBarChartComponent
} from './reconciled-payments-bar-chart.component';

describe('ReconciledPaymentsBarChartComponent', () => {

  let component:
    ReconciledPaymentsBarChartComponent;

  let fixture:
    ComponentFixture<ReconciledPaymentsBarChartComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        ReconciledPaymentsBarChartComponent
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(
        ReconciledPaymentsBarChartComponent
      );

    component =
      fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
});