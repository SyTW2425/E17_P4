import { TestBed } from '@angular/core/testing';
import { StatisticsService } from './statistics.service';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { ProductService } from '../../services/product-service/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';

// Mock de servicios
class MockAuthService {
  getToken() {
    return 'mock-token';
  }
}

class MockWarehouseService {
  getUserWarehouses(token: string) {
    return of([{ id: 1, name: 'Almacén 1' }, { id: 2, name: 'Almacén 2' }]);
  }
}

class MockProductService {}

describe('StatisticsService', () => {
  let service: StatisticsService;
  let warehouseService: WarehouseService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatisticsService,
        { provide: WarehouseService, useClass: MockWarehouseService },
        { provide: ProductService, useClass: MockProductService },
        { provide: AuthService, useClass: MockAuthService },
      ],
    });

    service = TestBed.inject(StatisticsService);
    warehouseService = TestBed.inject(WarehouseService);
    authService = TestBed.inject(AuthService);
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería cargar el token', () => {
    spyOn(authService, 'getToken').and.returnValue('mock-token');
    service.loadToken();
    expect(service.token).toBe('mock-token');
  });

  it('debería mostrar error si no encuentra el token', () => {
    spyOn(authService, 'getToken').and.returnValue(null);
    spyOn(console, 'error');
    service.loadToken();
    expect(console.error).toHaveBeenCalledWith('No se encontró el token. Por favor, inicia sesión.');
  });

  it('debería cargar los almacenes correctamente', async () => {
    service.token = 'mock-token';
    spyOn(warehouseService, 'getUserWarehouses').and.callThrough();

    await service.loadWarehouses();
    expect(service.warehouses.length).toBe(2);
    expect(service.warehouses[0].name).toBe('Almacén 1');
  });

  it('debería manejar error al cargar los almacenes', async () => {
    service.token = 'mock-token';
    spyOn(warehouseService, 'getUserWarehouses').and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');

    await service.loadWarehouses();
    expect(console.error).toHaveBeenCalledWith('Error fetching warehouses:', jasmine.any(Error));
  });

  it('debería calcular estadísticas del almacén correctamente', () => {
    const products = [
      { price: 100, stock: 5 },
      { price: 200, stock: 2 },
      { price: 0, stock: 10 }, // Precio inválido, no debe considerarse
    ];
    const stats = service.calculateWarehouseStats(products);

    expect(stats.totalStock).toBe(7);
    expect(stats.totalInvested).toBe(900);
    expect(stats.totalEarned).toBe(180); // 20% de 900
  });

  it('debería calcular estadísticas de productos correctamente', () => {
    const products = [
      { _id: '1', price: 100, stock: 5 },
      { _id: '2', price: 200, stock: 2 },
    ];

    const stats = service.calculateProductStats(products);

    expect(stats['1'].stock).toBe(5);
    expect(stats['1'].invested).toBe(500);
    expect(stats['1'].earned).toBe(100); // 20% de 500

    expect(stats['2'].stock).toBe(2);
    expect(stats['2'].invested).toBe(400);
    expect(stats['2'].earned).toBe(80); // 20% de 400
  });

  it('debería calcular ganancias mensuales correctamente', () => {
    const products = [
      { _id: '1', price: 100, stock: 5, spoil: new Date('2024-01-15') }, // Enero
      { _id: '2', price: 200, stock: 2, spoil: new Date('2024-02-20') }, // Febrero
    ];

    // Simulamos las estadísticas de producto
    service.productStats = {
      '1': { stock: 5, invested: 500, earned: 100 },
      '2': { stock: 2, invested: 400, earned: 80 },
    };

    const monthlyEarnings = service.calculateMonthlyEarnings(products);

    expect(monthlyEarnings[0]).toBe(100); // Enero
    expect(monthlyEarnings[1]).toBe(80); // Febrero
    expect(monthlyEarnings[2]).toBe(0); // Marzo (sin productos)
  });
});

