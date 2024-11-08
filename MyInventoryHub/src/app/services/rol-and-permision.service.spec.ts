import { TestBed } from '@angular/core/testing';

import { RolAndPermisionService } from './rol-and-permision.service';

describe('RolAndPermisionService', () => {
  let service: RolAndPermisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolAndPermisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
