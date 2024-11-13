import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/supplier.model'; // Cambiar a Supplier
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-manager', // Actualizado el selector
  standalone: true,
  templateUrl: './supplier-manager.component.html', // Actualizado el nombre del archivo HTML
  imports: [CommonModule, FormsModule],
  styleUrls: ['./supplier-manager.component.css'], // Actualizado el nombre del archivo de estilos
})
export class SupplierManagerComponent implements OnInit {
  suppliers: Supplier[] = [
    {
      id: 1,
      name: 'Proveedor 1',
      contactName: 'Juan Pérez',
      contactEmail: 'juan.perez@email.com',
      contactPhone: '123-456-7890',
      address: 'Calle Ficticia 123, Ciudad A',
    },
    {
      id: 2,
      name: 'Proveedor 2',
      contactName: 'Ana García',
      contactEmail: 'ana.garcia@email.com',
      contactPhone: '234-567-8901',
      address: 'Avenida Real 456, Ciudad B',
    },
    {
      id: 3,
      name: 'Proveedor 3',
      contactName: 'Carlos López',
      contactEmail: 'carlos.lopez@email.com',
      contactPhone: '345-678-9012',
      address: 'Plaza Mayor 789, Ciudad C',
    },
  ];

  searchCriteria: string = 'name'; // Filtrar por nombre por defecto
  searchTerm: string = '';
  filteredSuppliers: Supplier[] = [];

  selectedSupplier: Supplier = {
    id: 0,
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  };

  newSupplier: Supplier = {
    id: 0,
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  };

  isEditing: boolean = false;
  isAdding: boolean = false; // Controla la visibilidad del formulario de adición

  constructor() {}

  ngOnInit(): void {
    this.filteredSuppliers = [...this.suppliers];
  }

  editSupplier(supplier: Supplier): void {
    this.selectedSupplier = { ...supplier };
    this.isEditing = true;
  }

  saveSupplier(): void {
    if (this.selectedSupplier.id !== 0) {
      const index = this.suppliers.findIndex(
        (supplier) => supplier.id === this.selectedSupplier.id
      );
      if (index !== -1) {
        this.suppliers[index] = { ...this.selectedSupplier };
      }
      this.isEditing = false;
      this.selectedSupplier = {
        id: 0,
        name: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
      };
      this.filterSuppliers();
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedSupplier = {
      id: 0,
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
    };
  }

  deleteSupplier(supplierId: number): void {
    this.filteredSuppliers = this.filteredSuppliers.filter(supplier => supplier.id !== supplierId);
  }

  // Función para iniciar la adición de un nuevo proveedor
  startAddSupplier(): void {
    this.isAdding = true;
  }

  // Función para añadir un nuevo proveedor
  addSupplier(): void {
    if (this.newSupplier.id && this.newSupplier.name) {
      this.suppliers.push({ ...this.newSupplier });
      this.newSupplier = {
        id: 0,
        name: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
      };
      this.isAdding = false; // Oculta el formulario de adición
      this.filterSuppliers();
    } else {
      alert('Por favor, completa todos los campos obligatorios');
    }
  }

  // Función para cancelar la adición de un proveedor
  cancelAdd(): void {
    this.isAdding = false;
    this.newSupplier = {
      id: 0,
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
    };
  }

  // Filtrar los proveedores según el campo seleccionado
  filterSuppliers(): void {
    this.filteredSuppliers = this.suppliers.filter((supplier) => {
      if (this.searchCriteria === 'id') {
        return supplier.id.toString().includes(this.searchTerm);
      } else if (this.searchCriteria === 'name') {
        return supplier.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'contactName') {
        return supplier.contactName.toLowerCase().includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'contactEmail') {
        return supplier.contactEmail.toLowerCase().includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'contactPhone') {
        return supplier.contactPhone.includes(this.searchTerm);
      } else if (this.searchCriteria === 'address') {
        return supplier.address.toLowerCase().includes(this.searchTerm.toLowerCase());
      }
      return false; // Si no coincide con ningún campo
    });
  }
}
