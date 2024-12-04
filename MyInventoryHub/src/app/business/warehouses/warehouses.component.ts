import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

interface Warehouse {
  id: number;
  name: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  capacity: number;
  currentStock: number;
  manager: string;
  contactNumber: string;
  isActive: boolean;
}

@Component({
  selector: 'app-warehouse-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css']
})
export default class WarehouseManagerComponent {
  warehouseForm: FormGroup;
  showForm = false;
  warehouses: Warehouse[] = [
    {
      id: 1,
      name: 'Almacén A',
      location: { address: 'Calle Falsa 123', city: 'Santa Cruz', country: 'España' },
      capacity: 200,
      currentStock: 150,
      manager: 'Juan Pérez',
      contactNumber: '123456789',
      isActive: true,
    },
    {
      id: 2,
      name: 'Almacén B',
      location: { address: 'Avenida Principal 456', city: 'La Laguna', country: 'España' },
      capacity: 300,
      currentStock: 180,
      manager: 'Ana López',
      contactNumber: '987654321',
      isActive: true,
    }
  ];
  selectedWarehouse: number | null = null;

  constructor(private fb: FormBuilder) {
    this.warehouseForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      capacity: ['', Validators.required],
      currentStock: ['', Validators.required],
      manager: ['', Validators.required],
      contactNumber: ['', Validators.required],
      isActive: [true, Validators.required]
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  createWarehouse() {
    if (this.warehouseForm.valid) {
      // Increment the warehouse id based on the length of existing warehouses
      const newWarehouse = { ...this.warehouseForm.value, id: this.warehouses.length + 1 };
      this.warehouses.push(newWarehouse);
      this.warehouseForm.reset();
      this.showForm = false;
    }
  }

  selectWarehouse() {
    const selected = this.warehouses.find(w => w.id === this.selectedWarehouse);
    if (selected) {
      console.log('Almacén seleccionado:', selected);
    }
  }
}
