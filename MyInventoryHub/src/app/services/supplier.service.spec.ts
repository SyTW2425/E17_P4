import { TestBed } from '@angular/core/testing';
import { SupplierService } from './supplier.service';
import { Supplier } from '../models/supplier.model';

describe('SupplierService', () => {
  let service: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially return an empty supplier list', () => {
    expect(service.getAllSuppliers()).toEqual([]);
  });

  it('should add a new supplier', () => {
    const newSupplier: Supplier = {
      id: 1,
      name: 'Supplier A',
      contactName: 'John Doe',
      contactEmail: 'johndoe@example.com',
      contactPhone: '1234567890',
      address: '123 Main St, City',
    };
    service.addSupplier(newSupplier);

    const suppliers = service.getAllSuppliers();
    expect(suppliers.length).toBe(1);
    expect(suppliers[0]).toEqual(newSupplier);
  });

  it('should return a supplier by its ID', () => {
    const newSupplier: Supplier = {
      id: 2,
      name: 'Supplier B',
      contactName: 'Jane Smith',
      contactEmail: 'janesmith@example.com',
      contactPhone: '0987654321',
      address: '456 Side St, Town',
    };
    service.addSupplier(newSupplier);

    const supplier = service.getSupplierById(2);
    expect(supplier).toEqual(newSupplier);
  });

  it('should return undefined if supplier ID does not exist', () => {
    const supplier = service.getSupplierById(999);
    expect(supplier).toBeUndefined();
  });

  it('should update an existing supplier', () => {
    const newSupplier: Supplier = {
      id: 3,
      name: 'Supplier C',
      contactName: 'Alice Johnson',
      contactEmail: 'alicejohnson@example.com',
      contactPhone: '1122334455',
      address: '789 High St, Village',
    };
    service.addSupplier(newSupplier);

    const updatedSupplier: Supplier = {
      id: 3,
      name: 'Updated Supplier C',
      contactName: 'Alice Johnson',
      contactEmail: 'alice.johnson@updated.com',
      contactPhone: '5566778899',
      address: 'New Address, Village',
    };
    service.updateSupplier(updatedSupplier);

    const supplier = service.getSupplierById(3);
    expect(supplier).toEqual(updatedSupplier);
  });

  it('should not update if supplier ID does not exist', () => {
    const initialCount = service.getAllSuppliers().length;
    const nonExistentSupplier: Supplier = {
      id: 4,
      name: 'Non-existent Supplier',
      contactName: 'Tom Unknown',
      contactEmail: 'tomunknown@example.com',
      contactPhone: '1112223333',
      address: 'Unknown Address',
    };
    service.updateSupplier(nonExistentSupplier);

    expect(service.getAllSuppliers().length).toBe(initialCount);
  });

  it('should delete an existing supplier', () => {
    const newSupplier: Supplier = {
      id: 5,
      name: 'Supplier D',
      contactName: 'George Brown',
      contactEmail: 'georgebrown@example.com',
      contactPhone: '3344556677',
      address: '100 Supplier Rd, Metropolis',
    };
    service.addSupplier(newSupplier);

    service.deleteSupplier(5);

    const supplier = service.getSupplierById(5);
    expect(supplier).toBeUndefined();
    expect(service.getAllSuppliers().length).toBe(0);
  });

  it('should do nothing if trying to delete a non-existing supplier', () => {
    const initialCount = service.getAllSuppliers().length;
    service.deleteSupplier(999);
    expect(service.getAllSuppliers().length).toBe(initialCount);
  });
});
