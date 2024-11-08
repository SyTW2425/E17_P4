import { TestBed } from '@angular/core/testing';

import { LowStockAlertService } from './low-stock-alert.service';

describe('LowStockAlertService', () => {
  let service: LowStockAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LowStockAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
