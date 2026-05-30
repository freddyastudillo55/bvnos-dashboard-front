import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersComponent } from '../providers.component/providers.component';

describe('ProvidersComponent', () => {
  let component: ProvidersComponent;
  let fixture: ComponentFixture<ProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvidersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProvidersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
