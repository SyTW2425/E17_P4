import { Component, OnInit } from '@angular/core';
import { Batch } from '../../../models/batch.model'; // Cambiar a Batch
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-batch-list', // Actualiza el selector
  standalone: true,
  templateUrl: './batch-list.component.html', // Cambiar el nombre del archivo HTML
  imports: [CommonModule, FormsModule],
  styleUrls: ['./batch-list.component.css'], // Cambiar el nombre del archivo de estilos
})
export class BatchListComponent implements OnInit {
  batches: Batch[] = [
    {
      id: 1,
      productId: 101,
      batchNumber: 'A123',
      quantity: 50,
      expirationDate: new Date('2025-12-31'),
      receivedDate: new Date('2023-01-01'),
    },
    {
      id: 2,
      productId: 102,
      batchNumber: 'B456',
      quantity: 30,
      expirationDate: new Date('2025-06-30'),
      receivedDate: new Date('2023-05-01'),
    },
    {
      id: 3,
      productId: 103,
      batchNumber: 'C789',
      quantity: 100,
      expirationDate: new Date('2026-01-15'),
      receivedDate: new Date('2023-09-10'),
    },
  ];

  searchCriteria: string = 'batchNumber'; // Filtrar por número de lote por defecto
  searchTerm: string = '';
  filteredBatches: Batch[] = [];

  selectedBatch: Batch = {
    id: 0,
    productId: 0,
    batchNumber: '',
    quantity: 0,
    expirationDate: new Date(),
    receivedDate: new Date(),
  };

  newBatch: Batch = {
    id: 0,
    productId: 0,
    batchNumber: '',
    quantity: 0,
    expirationDate: new Date(),
    receivedDate: new Date(),
  };

  isEditing: boolean = false;
  isAdding: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.filteredBatches = [...this.batches];
  }

  editBatch(batch: Batch): void {
    this.selectedBatch = { ...batch };
    this.isEditing = true;
  }

  saveBatch(): void {
    if (this.selectedBatch.id !== 0) {
      const index = this.batches.findIndex(
        (batch) => batch.id === this.selectedBatch.id
      );
      if (index !== -1) {
        this.batches[index] = { ...this.selectedBatch };
      }
      this.isEditing = false;
      this.resetSelectedBatch();
      this.filterBatches();
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.resetSelectedBatch();
  }

  deleteBatch(batchId: number): void {
    this.filteredBatches = this.filteredBatches.filter(batch => batch.id !== batchId);
  }

  startAddBatch(): void {
    this.isAdding = true;
  }

// Función para añadir un nuevo lote (Batch)
addBatch(): void {
  if (this.newBatch.batchNumber) { // Solo se valida el número de lote
    this.newBatch.id = this.batches.length + 1; // Asignar un nuevo ID único
    this.batches.push({ ...this.newBatch });
    this.resetNewBatch(); // Resetea los campos del formulario de nuevo lote
    this.isAdding = false; // Oculta el formulario de adición
    this.filterBatches(); // Filtra los lotes para actualizar la vista
  } else {
    alert('Por favor, completa todos los campos obligatorios');
  }
}


  cancelAdd(): void {
    this.isAdding = false;
    this.resetNewBatch();
  }

  resetSelectedBatch(): void {
    this.selectedBatch = {
      id: 0,
      productId: 0,
      batchNumber: '',
      quantity: 0,
      expirationDate: new Date(),
      receivedDate: new Date(),
    };
  }

  resetNewBatch(): void {
    this.newBatch = {
      id: 0,
      productId: 0,
      batchNumber: '',
      quantity: 0,
      expirationDate: new Date(),
      receivedDate: new Date(),
    };
  }

  filterBatches(): void {
    this.filteredBatches = this.batches.filter((batch) => {
      if (this.searchCriteria === 'id') {
        return batch.id.toString().includes(this.searchTerm);
      } else if (this.searchCriteria === 'productId') {
        return batch.productId.toString().includes(this.searchTerm);
      } else if (this.searchCriteria === 'batchNumber') {
        return batch.batchNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      } else if (this.searchCriteria === 'quantity') {
        return batch.quantity.toString().includes(this.searchTerm);
      } else if (this.searchCriteria === 'expirationDate') {
        return batch.expirationDate.toISOString().includes(this.searchTerm);
      } else if (this.searchCriteria === 'receivedDate') {
        return batch.receivedDate.toISOString().includes(this.searchTerm);
      }
      return false;
    });
  }
}
