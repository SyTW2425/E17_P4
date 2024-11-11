import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryTransactionListComponent } from './inventory-transaction-list.component';
import { InventoryTransactionService } from '../../../services/inventory-transaction.service';

// Simulación del servicio sin usar observables
class MockInventoryTransactionService {
  getAllTransactions() {
    // Devuelve un array directamente, como el servicio real
    return [
      { id: 1, productId: 101, transactionType: 'IN', quantity: 10, transactionDate: new Date(), warehouseId: 1 },
      { id: 2, productId: 102, transactionType: 'OUT', quantity: 5, transactionDate: new Date(), warehouseId: 1 }
    ];
  }
}

describe('InventoryTransactionListComponent', () => {
  let component: InventoryTransactionListComponent;
  let fixture: ComponentFixture<InventoryTransactionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryTransactionListComponent],
      providers: [
        { provide: InventoryTransactionService, useClass: MockInventoryTransactionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display transactions on init', () => {
    // Llamada a la lógica de inicialización (ngOnInit)
    component.ngOnInit();
    fixture.detectChanges();
    
    // Verificar la correcta asignación de transacciones
    expect(component.transactions.length).toBe(2);
    expect(component.transactions[0].transactionType).toBe('IN');
    expect(component.transactions[1].transactionType).toBe('OUT');
  });
});
  /**
   * This test is verifying that the transactions retrieved by the component are displayed correctly in the view (HTML template). 
   * The purpose is to ensure that the component not only retrieves the data correctly,
   * but also renders it properly to the DOM for the user to see.
   */
  /** 
  it('should display transaction details in the template', () => {
    component.ngOnInit();
    fixture.detectChanges(); //update component view to show changes
    
    // verifying data showing
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('ul').textContent).toContain('IN');
    expect(compiled.querySelector('ul').textContent).toContain('OUT');
  });
  Uncomment when HTML  for this component is ready.
  */
