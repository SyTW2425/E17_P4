import { TestBed } from '@angular/core/testing';
import { SalesRecordService } from './sales-record.service';
import { SalesRecord } from '../models/salesRecord.model';

describe('SalesRecordService', () => {
  let service: SalesRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially return an empty sales record list', () => {
    expect(service.getAllSalesRecord()).toEqual([]);
  });

  it('should add a new sales record', () => {
    const newSalesRecord: SalesRecord = {
      id: 1,
      productId: 101,
      customerId: 201,
      saleDate: new Date(),
      quantity: 5,
      totalAmount: 500,
    };
    service.addSalesRecord(newSalesRecord);

    const salesRecords = service.getAllSalesRecord();
    expect(salesRecords.length).toBe(1);
    expect(salesRecords[0]).toEqual(newSalesRecord);
  });

  it('should return a sales record by its ID', () => {
    const newSalesRecord: SalesRecord = {
      id: 2,
      productId: 102,
      customerId: 202,
      saleDate: new Date(),
      quantity: 3,
      totalAmount: 300,
    };
    service.addSalesRecord(newSalesRecord);

    const salesRecord = service.getSalesRecordById(2);
    expect(salesRecord).toEqual(newSalesRecord);
  });

  it('should return undefined if sales record ID does not exist', () => {
    const salesRecord = service.getSalesRecordById(999);
    expect(salesRecord).toBeUndefined();
  });

  it('should update an existing sales record', () => {
    const newSalesRecord: SalesRecord = {
      id: 3,
      productId: 103,
      customerId: 203,
      saleDate: new Date(),
      quantity: 10,
      totalAmount: 1000,
    };
    service.addSalesRecord(newSalesRecord);

    const updatedSalesRecord: SalesRecord = {
      id: 3,
      productId: 103,
      customerId: 203,
      saleDate: new Date(),
      quantity: 15,
      totalAmount: 1500,
    };
    service.updateSalesRecord(updatedSalesRecord);

    const salesRecord = service.getSalesRecordById(3);
    expect(salesRecord).toEqual(updatedSalesRecord);
  });

  it('should not update if sales record ID does not exist', () => {
    const initialCount = service.getAllSalesRecord().length;
    const nonExistentRecord: SalesRecord = {
      id: 4,
      productId: 104,
      customerId: 204,
      saleDate: new Date(),
      quantity: 2,
      totalAmount: 200,
    };
    service.updateSalesRecord(nonExistentRecord);

    // Verify that the count remains the same since no update was made
    expect(service.getAllSalesRecord().length).toBe(initialCount);
  });

  it('should delete an existing sales record', () => {
    const newSalesRecord: SalesRecord = {
      id: 5,
      productId: 105,
      customerId: 205,
      saleDate: new Date(),
      quantity: 7,
      totalAmount: 700,
    };
    service.addSalesRecord(newSalesRecord);

    service.deleteSalesRecord(5);

    const salesRecord = service.getSalesRecordById(5);
    expect(salesRecord).toBeUndefined();
    expect(service.getAllSalesRecord().length).toBe(0);
  });

  it('should do nothing if trying to delete a non-existing sales record', () => {
    const initialCount = service.getAllSalesRecord().length;
    service.deleteSalesRecord(999);
    expect(service.getAllSalesRecord().length).toBe(initialCount);
  });
});
