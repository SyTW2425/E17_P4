import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierComponent } from './supplier.component';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';

describe('SupplierComponent', () => {
  let component: SupplierComponent;
  let fixture: ComponentFixture<SupplierComponent>;
  let supplierService: SupplierService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierComponent],
      providers: [SupplierService]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierComponent);
    component = fixture.componentInstance;
    supplierService = TestBed.inject(SupplierService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load suppliers on initialization', () => {
    const testSuppliers: Supplier[] = [
      { id: 1, name: 'Supplier A', contactName: 'John Doe', contactEmail: 'john@example.com', contactPhone: '1234567890', address: '123 Main St' }
    ];
    spyOn(supplierService, 'getAllSuppliers').and.returnValue(testSuppliers);

    component.ngOnInit();

    expect(component.suppliers.length).toBe(1);
    expect(component.suppliers).toEqual(testSuppliers);
  });

  it('should add a supplier and reset form', () => {
    const newSupplier: Supplier = { id: 2, name: 'Supplier B', contactName: 'Jane Smith', contactEmail: 'jane@example.com', contactPhone: '0987654321', address: '456 Side St' };
    component.newSupplier = newSupplier;

    spyOn(supplierService, 'addSupplier').and.callThrough();
    spyOn(component, 'loadSuppliers').and.callThrough();
    component.addSupplier();

    expect(supplierService.addSupplier).toHaveBeenCalledWith(newSupplier);
    expect(component.loadSuppliers).toHaveBeenCalled();
    expect(component.newSupplier).toEqual({ id: 0, name: '', contactName: '', contactEmail: '', contactPhone: '', address: '' });
  });

  it('should delete a supplier by ID', () => {
    const supplierId = 1;
    spyOn(supplierService, 'deleteSupplier').and.callThrough();
    spyOn(component, 'loadSuppliers').and.callThrough();

    component.deleteSupplier(supplierId);

    expect(supplierService.deleteSupplier).toHaveBeenCalledWith(supplierId);
    expect(component.loadSuppliers).toHaveBeenCalled();
  });
});
