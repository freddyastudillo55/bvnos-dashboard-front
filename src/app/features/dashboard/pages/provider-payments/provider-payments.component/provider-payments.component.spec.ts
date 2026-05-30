import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderPaymentsComponent } from './provider-payments.component';

describe('ProviderPaymentsComponent', () => {
  let component: ProviderPaymentsComponent;
  let fixture: ComponentFixture<ProviderPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderPaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderPaymentsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
