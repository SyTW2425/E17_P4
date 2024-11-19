import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryTransactionFormComponent } from './inventory-transaction-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InventoryTransaction } from '../../../models/inventoryTransaction.model';
import { By } from '@angular/platform-browser';

describe('InventoryTransactionFormComponent', () => {
  let component: InventoryTransactionFormComponent;
  let fixture: ComponentFixture<InventoryTransactionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, InventoryTransactionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const formValues = component.transactionForm.value;
    expect(formValues).toEqual({
      id: null,
      productId: null,
      transactionType: 'IN',
      quantity: null,
      transactionDate: jasmine.any(Date),
      warehouseId: null,
      notes: '',
    });
  });

  it('should patch values to the form if transaction input is provided', () => {
    const transaction: InventoryTransaction = {
      id: 1,
      productId: 100,
      transactionType: 'OUT',
      quantity: 50,
      transactionDate: new Date('2024-01-01'),
      warehouseId: 10,
      notes: 'Test transaction',
    };
    component.transaction = transaction;
    component.ngOnInit();
    expect(component.transactionForm.value).toEqual(transaction);
  });

  it('should emit the form value when the form is valid and submitted', () => {
    spyOn(component.formSubmit, 'emit');

    const transaction: InventoryTransaction = {
      id: 1,
      productId: 100,
      transactionType: 'OUT',
      quantity: 50,
      transactionDate: new Date('2024-01-01'),
      warehouseId: 10,
      notes: 'Test transaction',
    };

    component.transactionForm.setValue(transaction);
    fixture.detectChanges();

    component.onSubmit();
    expect(component.formSubmit.emit).toHaveBeenCalledWith(transaction);
  });

  it('should not emit any value if the form is invalid', () => {
    spyOn(component.formSubmit, 'emit');

    component.transactionForm.patchValue({
      id: null,
      productId: null,
      quantity: 0, // Invalid quantity
      transactionDate: null,
      warehouseId: null,
    });
    fixture.detectChanges();

    component.onSubmit();
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should display validation errors when the form is invalid', () => {
    component.transactionForm.patchValue({
      id: null,
      productId: null,
      quantity: -1, // Invalid quantity
      transactionDate: null,
      warehouseId: null,
    });

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.transactionForm.invalid).toBeTrue();
    const quantityError = component.transactionForm.controls['quantity'].errors;
    expect(quantityError).toBeTruthy();
    expect(quantityError?.['min']).toBeTruthy();
  });
});
