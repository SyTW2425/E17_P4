import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeesComponent } from './employees.component';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

// Mock WarehouseService
class MockWarehouseService {
  getOwnerWarehouses = () =>
    of([
      {
        name: 'Warehouse 1',
        employees: [
          {
            employeeId: {
              _id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
            permissions: ['read', 'write'],
          },
        ],
      },
      {
        name: 'Warehouse 2',
        employees: [
          {
            employeeId: {
              _id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
            },
            permissions: ['read'],
          },
          {
            employeeId: {
              _id: '2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com',
            },
            permissions: ['read'],
          },
        ],
      },
    ]);
}

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;
  let warehouseService: WarehouseService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeesComponent, CommonModule, ToastModule, TableModule], // Importar el componente standalone
      providers: [
        { provide: WarehouseService, useClass: MockWarehouseService },
        MessageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    warehouseService = TestBed.inject(WarehouseService);
    messageService = TestBed.inject(MessageService);

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar empleados correctamente', () => {
    spyOn(warehouseService, 'getOwnerWarehouses').and.callThrough();
    component.fetchEmployees('mock-token');
    expect(warehouseService.getOwnerWarehouses).toHaveBeenCalled();
    expect(component.employees.length).toBe(2);

    // Verificar los datos de los empleados
    expect(component.employees[0].firstName).toBe('John');
    expect(component.employees[0].warehouses).toContain('Warehouse 1');
    expect(component.employees[0].warehouses).toContain('Warehouse 2');

    expect(component.employees[1].firstName).toBe('Jane');
    expect(component.employees[1].warehouses).toContain('Warehouse 2');
  });
});
