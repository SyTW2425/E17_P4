import { TestBed } from '@angular/core/testing';
import { InventoryTransactionService } from './inventory-transaction.service';
import { InventoryTransaction } from '../models/inventoryTransaction.model';

describe('InventoryTransactionService', () => {
  let service: InventoryTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have no transactions', () => {
    expect(service.getAllTransactions().length).toBe(0);
  });

  it('should add a new transaction', () => {
    const newTransaction: InventoryTransaction = {
      id: 1,
      productId: 1,
      transactionType: 'IN',
      quantity: 100,
      transactionDate: new Date(),
      warehouseId: 1
    };
    service.addTransaction(newTransaction);
    expect(service.getAllTransactions().length).toBe(1);
    expect(service.getAllTransactions()[0]).toEqual(newTransaction);
  });

  it('should get a transaction by ID', () => {
    const newTransaction: InventoryTransaction = {
      id: 1,
      productId: 1,
      transactionType: 'IN',
      quantity: 100,
      transactionDate: new Date(),
      warehouseId: 1
    };
    service.addTransaction(newTransaction);
    const transaction = service.getTransactionById(1);
    expect(transaction).toEqual(newTransaction);
  });

  it('should return undefined for a non-existent transaction ID', () => {
    const transaction = service.getTransactionById(999);
    expect(transaction).toBeUndefined();
  });

  it('should update an existing transaction', () => {
    const initialTransaction: InventoryTransaction = {
      id: 1,
      productId: 1,
      transactionType: 'IN',
      quantity: 100,
      transactionDate: new Date(),
      warehouseId: 1
    };
    service.addTransaction(initialTransaction);

    const updatedTransaction: InventoryTransaction = {
      ...initialTransaction,
      quantity: 200
    };
    service.updateTransaction(updatedTransaction);

    const transaction = service.getTransactionById(1);
    expect(transaction?.quantity).toBe(200);
  });

  it('should delete a transaction by ID', () => {
    const newTransaction: InventoryTransaction = {
      id: 1,
      productId: 1,
      transactionType: 'IN',
      quantity: 100,
      transactionDate: new Date(),
      warehouseId: 1
    };
    service.addTransaction(newTransaction);
    service.deleteTransaction(1);
    expect(service.getAllTransactions().length).toBe(0);
  });

  it('should not delete a transaction if the ID does not exist', () => {
    const newTransaction: InventoryTransaction = {
      id: 1,
      productId: 1,
      transactionType: 'IN',
      quantity: 100,
      transactionDate: new Date(),
      warehouseId: 1
    };
    service.addTransaction(newTransaction);
    service.deleteTransaction(999);
    expect(service.getAllTransactions().length).toBe(1);
  });
});
