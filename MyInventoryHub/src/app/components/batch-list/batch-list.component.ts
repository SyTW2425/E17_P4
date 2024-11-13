import { Component, OnInit } from '@angular/core';
import { Batch } from '../../models/batch.model';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-batch-list',
  standalone: true,
  templateUrl: './batch-list.component.html',
  imports: [CommonModule, DatePipe, FormsModule],
  styleUrls: ['./batch-list.component.css']
})
export class BatchListComponent implements OnInit {
  batches: Batch[] = [
    {
      id: 1,
      productId: 101,
      batchNumber: 'BATCH001',
      quantity: 50,
      expirationDate: new Date('2024-12-31'),
      receivedDate: new Date('2024-01-15')
    },
    {
      id: 2,
      productId: 102,
      batchNumber: 'BATCH002',
      quantity: 30,
      expirationDate: new Date('2025-06-30'),
      receivedDate: new Date('2024-05-10')
    },
    {
      id: 3,
      productId: 103,
      batchNumber: 'BATCH003',
      quantity: 100,
      expirationDate: new Date('2024-08-20'),
      receivedDate: new Date('2024-03-01')
    }
  ];

  searchCriteria: string = 'batchId';
  searchTerm: string = '';
  filteredBatches: Batch[] = [];

  selectedBatch: Batch = {
    id: 0,
    productId: 0,
    batchNumber: '',
    quantity: 0,
    expirationDate: new Date(),
    receivedDate: new Date()
  };

  newBatch: Batch = { // Inicializamos el nuevo lote con valores por defecto
    id: 0,
    productId: 0,
    batchNumber: '',
    quantity: 0,
    expirationDate: new Date(),
    receivedDate: new Date()
  };

  isEditing: boolean = false;
  isAdding: boolean = false; // Controla la visibilidad del formulario de adición

  constructor() {}

  ngOnInit(): void {
    this.filteredBatches = [...this.batches];
  }

  filterBatches(): void {
    if (this.searchCriteria === 'batchId') {
      this.filteredBatches = this.batches.filter(batch =>
        batch.id.toString().includes(this.searchTerm)
      );
    } else if (this.searchCriteria === 'productId') {
      this.filteredBatches = this.batches.filter(batch =>
        batch.productId.toString().includes(this.searchTerm)
      );
    }
  }

  editBatch(batch: Batch): void {
    this.selectedBatch = { ...batch };
    this.isEditing = true;
  }

  saveBatch(): void {
    if (this.selectedBatch.id !== 0) {
      const index = this.batches.findIndex(batch => batch.id === this.selectedBatch.id);
      if (index !== -1) {
        this.batches[index] = { ...this.selectedBatch };
      }
      this.isEditing = false;
      this.selectedBatch = {
        id: 0,
        productId: 0,
        batchNumber: '',
        quantity: 0,
        expirationDate: new Date(),
        receivedDate: new Date()
      };
      this.filterBatches();
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedBatch = {
      id: 0,
      productId: 0,
      batchNumber: '',
      quantity: 0,
      expirationDate: new Date(),
      receivedDate: new Date()
    };
  }

  deleteBatch(batchId: number): void {
    this.batches = this.batches.filter(batch => batch.id !== batchId);
    this.filterBatches();
  }

  // Función para iniciar la adición de un nuevo lote
  startAddBatch(): void {
    this.isAdding = true;
  }

  // Función para añadir un nuevo lote
  addBatch(): void {
    if (this.newBatch.id && this.newBatch.batchNumber) {
      this.batches.push({ ...this.newBatch });
      this.newBatch = {
        id: 0,
        productId: 0,
        batchNumber: '',
        quantity: 0,
        expirationDate: new Date(),
        receivedDate: new Date()
      };
      this.isAdding = false; // Oculta el formulario de adición
      this.filterBatches();
    } else {
      alert('Por favor, completa todos los campos obligatorios');
    }
  }

  // Función para cancelar la adición de un lote
  cancelAdd(): void {
    this.isAdding = false;
    this.newBatch = {
      id: 0,
      productId: 0,
      batchNumber: '',
      quantity: 0,
      expirationDate: new Date(),
      receivedDate: new Date()
    };
  }
}