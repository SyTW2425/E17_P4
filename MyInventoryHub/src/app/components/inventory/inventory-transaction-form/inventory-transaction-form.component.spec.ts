import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransactionFormComponent } from './inventory-transaction-form.component';

describe('InventoryTransactionFormComponent', () => {
  let component: InventoryTransactionFormComponent;
  let fixture: ComponentFixture<InventoryTransactionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryTransactionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
