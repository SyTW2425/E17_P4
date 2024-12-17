import { TestBed } from '@angular/core/testing';
import { SupplierService } from './supplier.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('SupplierService', () => {
  let service: SupplierService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3000/suppliers';
  const mockHeaders = new HttpHeaders({
    Authorization: `Bearer fake-token`,
    'Content-Type': 'application/json',
  });

  const mockSupplierData = {
    name: 'Supplier A',
    phone: '123456789',
    email: 'supplierA@example.com',
    address: '123 Street Name',
  };

  beforeEach(() => {
    // Simula el token en localStorage
    spyOn(localStorage, 'getItem').and.returnValue('fake-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupplierService],
    });

    service = TestBed.inject(SupplierService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
