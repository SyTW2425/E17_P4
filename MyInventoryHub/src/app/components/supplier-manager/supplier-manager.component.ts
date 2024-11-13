import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-manager',
  standalone: true,
  templateUrl: './supplier-manager.component.html',
  imports: [CommonModule, FormsModule], // Asegúrate de importar FormsModule
  styleUrls: ['./supplier-manager.component.css'],
})
export class SupplierManagerComponent implements OnInit {
  suppliers: Supplier[] = [
    {
      id: 1,
      name: 'Proveedor A',
      contactName: 'Juan Pérez',
      contactEmail: 'juan.perez@empresa.com',
      contactPhone: '123456789',
      address: 'Calle Ficticia 123',
    },
    {
      id: 2,
      name: 'Proveedor B',
      contactName: 'Ana Gómez',
      contactEmail: 'ana.gomez@empresa.com',
      contactPhone: '987654321',
      address: 'Avenida Real 456',
    },
  ];

  searchCriteria: string = 'name'; // El valor predeterminado es buscar por nombre
  searchTerm: string = '';
  filteredSuppliers: Supplier[] = [];

  newSupplier: Supplier = {
    id: 0,
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  };

  isAdding: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.filteredSuppliers = [...this.suppliers];
  }

  // Función para iniciar la adición de un nuevo proveedor
  startAddSupplier(): void {
    this.isAdding = true;
  }

  // Función para añadir un nuevo proveedor
  addSupplier(): void {
    if (
      this.newSupplier.name &&
      this.newSupplier.contactName &&
      this.newSupplier.contactEmail &&
      this.newSupplier.contactPhone &&
      this.newSupplier.address
    ) {
      this.newSupplier.id = this.suppliers.length
        ? Math.max(...this.suppliers.map((s) => s.id)) + 1
        : 1;
      this.suppliers.push({ ...this.newSupplier });
      this.newSupplier = {
        id: 0,
        name: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
      };
      this.isAdding = false;
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
      if (this.searchCriteria === 'name') {
        return supplier.name
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'contactName') {
        return supplier.contactName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'contactEmail') {
        return supplier.contactEmail
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'contactPhone') {
        return supplier.contactPhone.includes(this.searchTerm);
      } else if (this.searchCriteria === 'address') {
        return supplier.address
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'id') {
        return supplier.id.toString().includes(this.searchTerm);
      }
      return false; // Si no coincide con ningún campo
    });
  }
}
