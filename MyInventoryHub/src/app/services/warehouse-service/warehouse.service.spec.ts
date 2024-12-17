import { TestBed } from '@angular/core/testing';
import { WarehouseService } from './warehouse.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/warehouses';
  const token = 'fake-token';
  const warehouseId = 'warehouse123';
  const employeeId = 'employee123';

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const mockWarehouse = {
    name: 'Warehouse A',
    location: 'Location A',
  };

  const mockEmployee = {
    username: 'john.doe',
    permissions: ['ADD', 'EDIT'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WarehouseService],
    });

    service = TestBed.inject(WarehouseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
