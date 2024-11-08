import { Injectable } from '@angular/core';
import { Warehouse } from '../models/warehouse.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private warehouses: Warehouse[] = []; 

  getAllWarehouses(): Warehouse[] {
    return this.warehouses;
  }

  getWarehouseById(id: number): Warehouse | undefined {
    return this.warehouses.find(warehouse => warehouse.id === id);
  }

  addWarehouse(newWarehouse: Warehouse): void {
    this.warehouses.push(newWarehouse);
  }

  updateWarehouse(updatedWarehouse: Warehouse): void {
    const index = this.warehouses.findIndex(warehouse => warehouse.id === updatedWarehouse.id);
    if (index !== -1) {
      this.warehouses[index] = updatedWarehouse;
    }
  }

  deleteWarehouse(id: number): void {
    this.warehouses = this.warehouses.filter(warehouse => warehouse.id !== id);
  }
}
