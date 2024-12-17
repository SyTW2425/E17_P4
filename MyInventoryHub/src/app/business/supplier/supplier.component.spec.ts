import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuppliersComponent } from './supplier.component';
import { SupplierService } from '../../services/supplier/supplier.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

// Mock SupplierService
class MockSupplierService {
  getSuppliers = () =>
    of([
      { name: 'Proveedor 1', phone: '123456789', email: 'test1@example.com', address: 'Dirección 1' },
    ]);
  addSupplier = (supplier: any) => of({});
  updateSupplier = (name: string, supplier: any) => of({});
  deleteSupplier = (name: string) => of({});
}

describe('SuppliersComponent', () => {
  let component: SuppliersComponent;
  let fixture: ComponentFixture<SuppliersComponent>;
  let supplierService: SupplierService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SuppliersComponent,
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
      ],
      providers: [
        { provide: SupplierService, useClass: MockSupplierService },
        MessageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersComponent);
    component = fixture.componentInstance;
    supplierService = TestBed.inject(SupplierService);
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    expect(component.supplierForm).toBeDefined();
    expect(component.supplierForm.controls['name']).toBeDefined();
    expect(component.supplierForm.controls['phone']).toBeDefined();
    expect(component.supplierForm.controls['email']).toBeDefined();
    expect(component.supplierForm.controls['address']).toBeDefined();
  });

  it('debería cargar los proveedores correctamente', () => {
    spyOn(supplierService, 'getSuppliers').and.callThrough();
    component.fetchSuppliers();
    expect(supplierService.getSuppliers).toHaveBeenCalled();
    expect(component.suppliers.length).toBe(1);
    expect(component.suppliers[0].name).toBe('Proveedor 1');
  });

});
