import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskChartsComponent } from './risk-charts.component';

describe('RiskChartsComponent', () => {
  let component: RiskChartsComponent;
  let fixture: ComponentFixture<RiskChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskChartsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
