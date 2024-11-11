import { TestBed } from '@angular/core/testing';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from '../models/warehouse.model';

describe('WarehouseService', () => {
  let service: WarehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially return an empty warehouse list', () => {
    expect(service.getAllWarehouses()).toEqual([]);
  });

  it('should add a new warehouse', () => {
    const newWarehouse: Warehouse = { id: 1, name: 'Warehouse A', location: 'Location A', capacity: 100 };
    service.addWarehouse(newWarehouse);

    const warehouses = service.getAllWarehouses();
    expect(warehouses.length).toBe(1);
    expect(warehouses[0]).toEqual(newWarehouse);
  });

  it('should return a warehouse by its ID', () => {
    const newWarehouse: Warehouse = { id: 2, name: 'Warehouse B', location: 'Location B', capacity: 200 };
    service.addWarehouse(newWarehouse);

    const warehouse = service.getWarehouseById(2);
    expect(warehouse).toEqual(newWarehouse);
  });

  it('should return undefined if warehouse ID does not exist', () => {
    const warehouse = service.getWarehouseById(999);
    expect(warehouse).toBeUndefined();
  });

  it('should update an existing warehouse', () => {
    const newWarehouse: Warehouse = { id: 3, name: 'Warehouse C', location: 'Location C', capacity: 300 };
    service.addWarehouse(newWarehouse);

    const updatedWarehouse: Warehouse = { id: 3, name: 'Updated Warehouse C', location: 'Updated Location C', capacity: 400 };
    service.updateWarehouse(updatedWarehouse);

    const warehouse = service.getWarehouseById(3);
    expect(warehouse).toEqual(updatedWarehouse);
  });

  it('should not update if warehouse ID does not exist', () => {
    const newWarehouse: Warehouse = { id: 4, name: 'Warehouse D', location: 'Location D', capacity: 500 };
    service.updateWarehouse(newWarehouse);

    // Check that the warehouse list is still empty since no warehouse with id 4 existed initially
    expect(service.getAllWarehouses().length).toBe(0);
  });

  it('should delete an existing warehouse', () => {
    const newWarehouse: Warehouse = { id: 5, name: 'Warehouse E', location: 'Location E', capacity: 600 };
    service.addWarehouse(newWarehouse);

    service.deleteWarehouse(5);

    const warehouse = service.getWarehouseById(5);
    expect(warehouse).toBeUndefined();
    expect(service.getAllWarehouses().length).toBe(0);
  });

  it('should do nothing if trying to delete a non-existing warehouse', () => {
    const initialCount = service.getAllWarehouses().length;
    service.deleteWarehouse(999);
    expect(service.getAllWarehouses().length).toBe(initialCount);
  });
});
