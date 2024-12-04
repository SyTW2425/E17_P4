import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
  selector: 'app-warehouse-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css']
})
export default class WarehouseManagementComponent {
  warehouseForm: FormGroup;
  showForm = false;
  warehouses: Warehouse[] = [
    {
      id: 1,
      name: 'Almacén 1',
      location: { address: 'Calle Falsa 123', city: 'Santa Cruz', country: 'España' },
      capacity: 500,
      currentStock: 300,
      manager: 'Juan Pérez',
      contactNumber: '123456789',
      isActive: true
    },
    {
      id: 2,
      name: 'Almacén 2',
      location: { address: 'Avenida Real 456', city: 'La Laguna', country: 'España' },
      capacity: 600,
      currentStock: 200,
      manager: 'Ana García',
      contactNumber: '987654321',
      isActive: true
    }
  ];
  selectedWarehouse: Warehouse = {
    id: 0,
    name: '',
    location: {
      address: '',
      city: '',
      country: ''
    },
    capacity: 0,
    currentStock: 0,
    manager: '',
    contactNumber: '',
    isActive: true
  };
  

  constructor(private fb: FormBuilder) {
    this.warehouseForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(0)]],
      currentStock: ['', [Validators.required, Validators.min(0)]],
      manager: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      isActive: [true]
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  createWarehouse() {
    if (this.warehouseForm.valid) {
      const warehouse = { ...this.warehouseForm.value, id: this.warehouses.length + 1 };
      this.warehouses.push(warehouse);
      this.warehouseForm.reset();
      this.showForm = false;
    }
  }

  selectWarehouse(event: Event) {
    const target = event.target as HTMLSelectElement | null;
    if (target && target.value) {  // Verifica si 'target' no es nulo y tiene un valor
      const selectedWarehouseId = Number(target.value);
      this.selectedWarehouse = this.warehouses.find(warehouse => warehouse.id === selectedWarehouseId) || this.selectedWarehouse;
    }
  }
  
  

  // Método para actualizar el almacén si es necesario
  updateWarehouse() {
    if (this.selectedWarehouse && this.warehouseForm.valid) {
      const index = this.warehouses.findIndex(w => w.id === this.selectedWarehouse!.id);
      this.warehouses[index] = { ...this.selectedWarehouse, ...this.warehouseForm.value };
      this.selectedWarehouse =  {
        id: 0,
        name: '',
        location: {
          address: '',
          city: '',
          country: ''
        },
        capacity: 0,
        currentStock: 0,
        manager: '',
        contactNumber: '',
        isActive: true
      };
      this.warehouseForm.reset();
    }
  }
}
