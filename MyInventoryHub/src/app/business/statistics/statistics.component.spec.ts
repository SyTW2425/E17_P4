import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics.component';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { ProductService } from '../../services/product-service/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';

describe('StatisticsComponent', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;
  let mockWarehouseService: jasmine.SpyObj<WarehouseService>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockWarehouseService = jasmine.createSpyObj('WarehouseService', ['getUserWarehouses', 'getWarehouseEmployees']);
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isOwner', 'getToken']);

    await TestBed.configureTestingModule({
      imports: [StatisticsComponent], // Es standalone, se importa directamente
      providers: [
        { provide: WarehouseService, useValue: mockWarehouseService },
        { provide: ProductService, useValue: mockProductService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;
  });

  it('Debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar la lista de almacenes como un array vacío', () => {
    expect(component.warehouses).toEqual([]);
  });
  
  it('Debe llamar al servicio para obtener almacenes', () => {
    const warehousesMock = [{ _id: '1', name: 'Almacén 1' }];
    mockWarehouseService.getUserWarehouses.and.returnValue(of(warehousesMock));
  
    component.loadWarehouses();
  
    expect(mockWarehouseService.getUserWarehouses).toHaveBeenCalled();
  });
  
  it('Debe actualizar la lista de almacenes con los datos devueltos por el servicio', () => {
    const warehousesMock = [{ _id: '1', name: 'Almacén 1' }, { _id: '2', name: 'Almacén 2' }];
    mockWarehouseService.getUserWarehouses.and.returnValue(of(warehousesMock));
  
    component.loadWarehouses();
  
    expect(component.warehouses).toEqual(warehousesMock);
  });
  
  it('Debe mantener la lista de almacenes vacía si el servicio falla', () => {
    mockWarehouseService.getUserWarehouses.and.returnValue(throwError(() => new Error('Error de red')));
  
    component.loadWarehouses();
  
    expect(component.warehouses).toEqual([]);
  });
  
  

  it('Debe generar estadísticas correctas de productos', () => {
    const productsMock = [
      { _id: 'p1', price: 10, stock: 5 },
      { _id: 'p2', price: 20, stock: 3 },
    ];

    const stats = component.calculateProductStats(productsMock);

    expect(stats['p1'].invested).toBe(50); // 10 * 5
    expect(stats['p1'].earned).toBe(10);  // 20% de 50
    expect(stats['p2'].stock).toBe(3);
  });
});
