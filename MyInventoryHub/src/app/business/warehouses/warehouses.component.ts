import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';

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
  styleUrls: ['./warehouses.component.css'],
})
export default class WarehouseManagerComponent implements OnInit {
  warehouseForm: FormGroup;
  showForm = false;
  warehouses: Warehouse[] = [
    {
      id: 1,
      name: 'Almacén 1',
      location: { address: 'Calle Ficticia 123', city: 'Ciudad A', country: 'País A' },
      capacity: 500,
      currentStock: 150,
      manager: 'Juan Pérez',
      contactNumber: '123456789',
      isActive: true,
    },
    {
      id: 2,
      name: 'Almacén 2',
      location: { address: 'Avenida Ficticia 456', city: 'Ciudad B', country: 'País B' },
      capacity: 600,
      currentStock: 300,
      manager: 'Ana Gómez',
      contactNumber: '987654321',
      isActive: true,
    },
    {
      id: 3,
      name: 'Almacén 3',
      location: { address: 'Calle Real 789', city: 'Ciudad C', country: 'País C' },
      capacity: 700,
      currentStock: 400,
      manager: 'Carlos López',
      contactNumber: '112233445',
      isActive: false,
    },
  ];
  filteredWarehouses: Warehouse[] = [];
  selectedWarehouse: Warehouse | null = null;

  // Simulando que el usuario es un "manager"
  currentUserRole: string = 'manager'; // Este valor debe venir de tu sistema de autenticación

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
      isActive: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadWarehouses();
  }

  // Cargar los almacenes solo para los managers
  loadWarehouses(): void {
    if (this.currentUserRole === 'manager') {
      // Los managers solo ven los almacenes activos
      this.filteredWarehouses = this.warehouses.filter(warehouse => warehouse.isActive);
    } else {
      // Si el usuario no es un manager, mostrar todos los almacenes
      // this.filteredWarehouses = [...this.warehouses];
      console.log("usuario no es manager")
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  createWarehouse(): void {
    if (this.warehouseForm.valid) {
      const newWarehouse: Warehouse = {
        id: this.warehouseForm.value.id, 
        name: this.warehouseForm.value.name,
        location: {
          address: this.warehouseForm.value.address,
          city: this.warehouseForm.value.city,
          country: this.warehouseForm.value.country,
        },
        capacity: this.warehouseForm.value.capacity,
        currentStock: this.warehouseForm.value.currentStock,
        manager: this.warehouseForm.value.manager,
        contactNumber: this.warehouseForm.value.contactNumber,
        isActive: this.warehouseForm.value.isActive,
      };
  
      this.warehouses.push(newWarehouse); // Añade el nuevo almacén a la lista
      this.loadWarehouses(); // Recarga los almacenes filtrados
      this.warehouseForm.reset();
      this.showForm = false;
    }
  }

  selectWarehouse(): void {
    if (this.selectedWarehouse) {
      console.log('Almacén seleccionado:', this.selectedWarehouse);
    }
  }

  onWarehouseSelect(warehouseId: number): void {
    this.selectedWarehouse = this.filteredWarehouses.find((wh) => wh.id === warehouseId) || null;
  }
}
