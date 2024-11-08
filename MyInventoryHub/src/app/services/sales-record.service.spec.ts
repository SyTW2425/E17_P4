import { TestBed } from '@angular/core/testing';

import { SalesRecordService } from './sales-record.service';

describe('SalesRecordService', () => {
  let service: SalesRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
