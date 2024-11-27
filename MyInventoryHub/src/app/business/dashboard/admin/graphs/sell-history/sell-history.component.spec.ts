import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellHistoryComponent } from './sell-history.component';

describe('SellHistoryComponent', () => {
  let component: SellHistoryComponent;
  let fixture: ComponentFixture<SellHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
