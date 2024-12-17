import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { ProductService } from '../../services/product-service/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { StatisticsService } from '../../services/statistics/statistics.service';
import { ChartService } from '../../services/chart/chart.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

// Mocks
class MockAuthService {
  getToken = () => 'mock-token';
  isOwner = () => true;
}

class MockWarehouseService {
  getUserWarehouses = () => of([{ id: '1', name: 'Warehouse 1' }]);
  getWarehouseEmployees = () => of([{ id: 'emp1', name: 'Employee 1' }]);
}

class MockProductService {
  getProducts = () =>
    of([
      { _id: 'prod1', name: 'Product 1', price: 100, stock: 5 },
      { _id: 'prod2', name: 'Product 2', price: 200, stock: 2 },
    ]);
}

class MockStatisticsService {}
class MockChartService {}

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let warehouseService: WarehouseService;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StatisticsComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        ChartModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: WarehouseService, useClass: MockWarehouseService },
        { provide: ProductService, useClass: MockProductService },
        { provide: StatisticsService, useClass: MockStatisticsService },
        { provide: ChartService, useClass: MockChartService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
    warehouseService = TestBed.inject(WarehouseService);
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el token al inicializar', () => {
    spyOn(console, 'error');
    component.loadToken();
    expect(component.token).toBe('mock-token');
  });

  it('debería cargar almacenes correctamente', async () => {
    spyOn(warehouseService, 'getUserWarehouses').and.callThrough();
    await component.loadWarehouses();
    expect(component.warehouses.length).toBe(1);
    expect(component.warehouses[0].name).toBe('Warehouse 1');
  });

  it('debería manejar errores al cargar almacenes', async () => {
    spyOn(warehouseService, 'getUserWarehouses').and.returnValue(
      throwError(() => new Error('Error'))
    );
    spyOn(console, 'error');
    await component.loadWarehouses();
    expect(console.error).toHaveBeenCalledWith('Error fetching warehouses:', jasmine.any(Error));
  });

  it('debería calcular estadísticas de productos correctamente', () => {
    const products = [
      { _id: 'prod1', price: 100, stock: 5 },
      { _id: 'prod2', price: 200, stock: 2 },
    ];
    const stats = component.calculateProductStats(products);

    expect(stats['prod1'].stock).toBe(5);
    expect(stats['prod1'].invested).toBe(500);
    expect(stats['prod1'].earned).toBe(100);

    expect(stats['prod2'].stock).toBe(2);
    expect(stats['prod2'].invested).toBe(400);
    expect(stats['prod2'].earned).toBe(80);
  });

  it('debería generar colores dinámicamente', () => {
    const colors = component.generateColors(3);
    expect(colors.length).toBe(3);
    expect(colors[0]).toContain('hsl');
  });
});
