import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDetailsChartComponent } from './sales-details-chart.component';

describe('SalesDetailsChartComponent', () => {
  let component: SalesDetailsChartComponent;
  let fixture: ComponentFixture<SalesDetailsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesDetailsChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesDetailsChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
