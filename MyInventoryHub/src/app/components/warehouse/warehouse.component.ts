import { Component, OnInit } from '@angular/core';
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../models/warehouse.model';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.css'],
    standalone: false
})
export class WarehouseComponent implements OnInit {
  warehouses: Warehouse[] = [];
  newWarehouse: Warehouse = {
    id: 0,
    name: '',
    location: '',
    capacity: 0
  };

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    this.warehouses = this.warehouseService.getAllWarehouses();
  }

  addWarehouse(): void {
    this.warehouseService.addWarehouse(this.newWarehouse);
    this.loadWarehouses();
    this.resetForm();
  }

  deleteWarehouse(id: number): void {
    this.warehouseService.deleteWarehouse(id);
    this.loadWarehouses();
  }

  resetForm(): void {
    this.newWarehouse = {
      id: 0,
      name: '',
      location: '',
      capacity: 0
    };
  }
}

