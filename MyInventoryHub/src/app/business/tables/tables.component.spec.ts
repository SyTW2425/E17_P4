import { ComponentFixture, TestBed } from '@angular/core/testing';
import TablesComponent from './tables.component';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { ProductService } from '../../services/product-service/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';

// Mock Services
class MockWarehouseService {
  getUserWarehouses = () => of([{ _id: '1', name: 'Warehouse 1', location: 'Location 1', employees: [] }]);
  getWarehouseEmployees = () => of([{ _id: 'emp1', name: 'John Doe', permissions: ['ADD'] }]);
  createWarehouse = () => of({});
  updateWarehouse = () => of({});
  deleteWarehouse = () => of({});
  assignEmployee = () => of({});
  removeEmployee = () => of({});
}

class MockProductService {
  getProducts = () => of([{ _id: 'prod1', name: 'Product 1', stock: 10, price: 50 }]);
  createProduct = () => of({});
  updateProduct = () => of({});
  deleteProduct = () => of({});
}

class MockAuthService {
  getToken = () => 'mock-token';
  isOwner = () => true;
  getUserInfo = () => ({ id: 'user123' });
}

describe('TablesComponent', () => {
  let component: TablesComponent;
  let fixture: ComponentFixture<TablesComponent>;
  let warehouseService: WarehouseService;
  let productService: ProductService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TablesComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        CheckboxModule,
        TableModule,
        PaginatorModule,
        InputTextModule,
      ],
      providers: [
        { provide: WarehouseService, useClass: MockWarehouseService },
        { provide: ProductService, useClass: MockProductService },
        { provide: AuthService, useClass: MockAuthService },
        CurrencyPipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesComponent);
    component = fixture.componentInstance;
    warehouseService = TestBed.inject(WarehouseService);
    productService = TestBed.inject(ProductService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el token al inicializar', () => {
    spyOn(authService, 'getToken').and.callThrough();
    component.loadToken();
    expect(component.token).toBe('mock-token');
  });

  it('debería cargar los almacenes correctamente', () => {
    spyOn(warehouseService, 'getUserWarehouses').and.callThrough();
    component.loadWarehouses();
    expect(warehouseService.getUserWarehouses).toHaveBeenCalled();
    expect(component.warehouses.length).toBe(1);
    expect(component.warehouses[0].name).toBe('Warehouse 1');
  });

  it('debería manejar error al cargar almacenes', () => {
    spyOn(warehouseService, 'getUserWarehouses').and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    component.loadWarehouses();
    expect(console.error).toHaveBeenCalledWith('Error fetching warehouses:', jasmine.any(Error));
  });

  it('debería cargar los productos correctamente', () => {
    spyOn(productService, 'getProducts').and.callThrough();
    component.selectedWarehouseId = '1';
    component.loadProducts();
    expect(productService.getProducts).toHaveBeenCalledWith('mock-token', '1');
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Product 1');
  });

  it('debería actualizar un almacén correctamente', () => {
    spyOn(warehouseService, 'updateWarehouse').and.callThrough();
    component.selectedWarehouseId = '1';
    component.warehouseUpdateForm.setValue({ name: 'Updated Warehouse', location: 'Updated Location' });
    component.updateWarehouse();
    expect(warehouseService.updateWarehouse).toHaveBeenCalledWith('mock-token', '1', {
      name: 'Updated Warehouse',
      location: 'Updated Location',
    });
  });

  it('debería eliminar un almacén correctamente', () => {
    spyOn(warehouseService, 'deleteWarehouse').and.callThrough();
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteWarehouse('1');
    expect(warehouseService.deleteWarehouse).toHaveBeenCalledWith('mock-token', '1');
  });

  it('debería cargar empleados correctamente', () => {
    spyOn(warehouseService, 'getWarehouseEmployees').and.callThrough();
    component.selectedWarehouseId = '1';
    component.loadEmployees();
    expect(warehouseService.getWarehouseEmployees).toHaveBeenCalledWith('mock-token', '1');
    expect(component.employees.length).toBe(1);
    expect(component.employees[0].name).toBe('John Doe');
  });

  it('debería eliminar un empleado correctamente', () => {
    spyOn(warehouseService, 'removeEmployee').and.callThrough();
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteEmployeeFromWarehouse('1', 'emp1');
    expect(warehouseService.removeEmployee).toHaveBeenCalledWith('mock-token', '1', 'emp1');
  });
});
