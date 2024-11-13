import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionDetailComponent } from './inventory-transaction-detail.component';

describe('InventoryTransactionDetailComponent', () => {
  let component: InventoryTransactionDetailComponent;
  let fixture: ComponentFixture<InventoryTransactionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryTransactionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
