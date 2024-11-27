import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellMetricsComponent } from './sell-metrics.component';

describe('SellMetricsComponent', () => {
  let component: SellMetricsComponent;
  let fixture: ComponentFixture<SellMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
