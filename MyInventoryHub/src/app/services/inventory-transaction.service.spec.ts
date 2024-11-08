import { TestBed } from '@angular/core/testing';

import { InventoryTransactionService } from './inventory-transaction.service';

describe('InventoryTransactionService', () => {
  let service: InventoryTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
