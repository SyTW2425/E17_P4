import { Component } from '@angular/core';
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
export default class WarehouseManagerComponent {
  nextId = 3;
  warehouseForm: FormGroup;
  showForm = false;
  warehouses: Warehouse[] = [
    {
      id: 1,
      name: 'Almacén A',
      location: {
        address: 'Calle Falsa 123',
        city: 'Santa Cruz',
        country: 'España',
      },
      capacity: 200,
      currentStock: 150,
      manager: 'Juan Pérez',
      contactNumber: '123456789',
      isActive: true,
    },
    {
      id: 2,
      name: 'Almacén B',
      location: {
        address: 'Avenida Principal 456',
        city: 'La Laguna',
        country: 'España',
      },
      capacity: 300,
      currentStock: 180,
      manager: 'Ana López',
      contactNumber: '987654321',
      isActive: true,
    },
  ];
  selectedWarehouse: any;

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

  toggleForm() {
    this.showForm = !this.showForm;
  }

  // // Función para cargar almacenes (si tienes alguno en el localStorage o base de datos)
  // loadWarehouses(): void {
  //   // Aquí puedes cargar datos de un servidor o localStorage
  //   const storedWarehouses = JSON.parse(localStorage.getItem('warehouses') || '[]');
  //   this.warehouses = storedWarehouses;

  //   // Establecer el siguiente ID para que sea el próximo disponible
  //   this.nextId = this.warehouses.length ? Math.max(...this.warehouses.map(w => w.id)) + 1 : 1;
  // }

  // Función para crear un nuevo almacén
  createWarehouse(): void {
    if (this.warehouseForm.valid) {
      const newWarehouse: Warehouse = {
        id: this.nextId++, // Incremento automático del ID
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

      // Agregar el nuevo almacén a la lista
      this.warehouses.push(newWarehouse);

      // Guardar en localStorage o base de datos
      localStorage.setItem('warehouses', JSON.stringify(this.warehouses));

      // Limpiar el formulario
      this.warehouseForm.reset();
      this.showForm = false;
    }
  }

  selectWarehouse() {
    if (this.selectedWarehouse) {
      console.log('Almacén seleccionado:', this.selectedWarehouse);
    }
  }

  // Este método debería asignar el almacén completo al seleccionar uno
  onWarehouseSelect(warehouseId: number): void {
    this.selectedWarehouse = this.warehouses.find(
      (wh) => wh.id === warehouseId
    );
  }
}
