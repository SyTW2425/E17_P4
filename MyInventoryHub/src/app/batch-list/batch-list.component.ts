import { Component, OnInit } from '@angular/core';
import { Batch } from '../models/batch.model';
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

  // Variables para la búsqueda
  searchCriteria: string = 'batchId'; // Por defecto buscar por Batch ID
  searchTerm: string = '';
  filteredBatches: Batch[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filteredBatches = [...this.batches]; // Inicializar con todos los lotes
  }

  // Filtrar los lotes basados en los criterios de búsqueda
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

  // Método para editar un lote
  editBatch(batch: Batch): void {
    console.log('Edit batch', batch);
  }

  // Método para eliminar un lote
  deleteBatch(batchId: number): void {
    this.batches = this.batches.filter(batch => batch.id !== batchId);
    this.filterBatches(); // Volver a filtrar después de eliminar
    console.log('Batch deleted', batchId);
  }
}
