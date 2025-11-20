import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsCardsComponent } from './metrics-cards.component';

describe('MetricsCardsComponent', () => {
  let component: MetricsCardsComponent;
  let fixture: ComponentFixture<MetricsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsCardsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
