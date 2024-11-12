import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../models/warehouse.model';

describe('WarehouseComponent', () => {
  let component: WarehouseComponent;
  let fixture: ComponentFixture<WarehouseComponent>;
  let warehouseService: WarehouseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarehouseComponent],
      providers: [WarehouseService]
    }).compileComponents();

    fixture = TestBed.createComponent(WarehouseComponent);
    component = fixture.componentInstance;
    warehouseService = TestBed.inject(WarehouseService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load warehouses on initialization', () => {
    const testWarehouses: Warehouse[] = [
      { id: 1, name: 'Warehouse A', location: 'Location A', capacity: 100 }
    ];
    spyOn(warehouseService, 'getAllWarehouses').and.returnValue(testWarehouses);

    component.ngOnInit();

    expect(component.warehouses).toEqual(testWarehouses);
  });

  it('should add a warehouse and reset form', () => {
    const newWarehouse: Warehouse = { id: 2, name: 'Warehouse B', location: 'Location B', capacity: 200 };
    component.newWarehouse = newWarehouse;

    spyOn(warehouseService, 'addWarehouse').and.callThrough();
    component.addWarehouse();

    expect(warehouseService.addWarehouse).toHaveBeenCalledWith(newWarehouse);
    expect(component.warehouses).toContain(newWarehouse);
    expect(component.newWarehouse.capacity).toBe(0); // Verifica que el formulario se haya reseteado
  });

  it('should delete a warehouse by ID', () => {
    const warehouseId = 1;
    spyOn(warehouseService, 'deleteWarehouse').and.callThrough();

    component.deleteWarehouse(warehouseId);

    expect(warehouseService.deleteWarehouse).toHaveBeenCalledWith(warehouseId);
  });
});
