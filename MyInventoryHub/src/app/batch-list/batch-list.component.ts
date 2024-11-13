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

  // Variables de búsqueda
  searchCriteria: string = 'batchId';
  searchTerm: string = '';
  filteredBatches: Batch[] = [];

  // Variable para manejar el lote seleccionado para editar
  selectedBatch: Batch = {
    id: 0,
    productId: 0,
    batchNumber: '',
    quantity: 0,
    expirationDate: new Date(),
    receivedDate: new Date()
  };

  // Variable para controlar la visibilidad del formulario de edición
  isEditing: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.filteredBatches = [...this.batches]; // Copia de la lista para filtrar
  }

  // Filtrar los lotes en función de la búsqueda
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

  // Establecer el lote seleccionado para editar
  editBatch(batch: Batch): void {
    this.selectedBatch = { ...batch }; // Hacemos una copia del lote para editar
    this.isEditing = true; // Mostrar el formulario de edición
  }

  // Guardar los cambios del lote editado
  saveBatch(): void {
    if (this.selectedBatch.id !== 0) { // Verificamos que el ID no sea el valor por defecto
      // Encontramos el índice del lote en el arreglo original
      const index = this.batches.findIndex(batch => batch.id === this.selectedBatch.id);
      if (index !== -1) {
        // Actualizamos el lote
        this.batches[index] = { ...this.selectedBatch };
      }
      // Ocultar el formulario de edición y resetear selectedBatch
      this.isEditing = false;
      this.selectedBatch = { // Reiniciamos con valores predeterminados
        id: 0,
        productId: 0,
        batchNumber: '',
        quantity: 0,
        expirationDate: new Date(),
        receivedDate: new Date()
      };
      this.filterBatches(); // Refiltrar después de la actualización
    }
  }

  // Cancelar la edición
  cancelEdit(): void {
    // Ocultar el formulario de edición y resetear selectedBatch
    this.isEditing = false;
    this.selectedBatch = { // Reiniciamos con valores predeterminados
      id: 0,
      productId: 0,
      batchNumber: '',
      quantity: 0,
      expirationDate: new Date(),
      receivedDate: new Date()
    };
  }

  // Eliminar un lote
  deleteBatch(batchId: number): void {
    this.batches = this.batches.filter(batch => batch.id !== batchId);
    this.filterBatches(); // Refiltrar después de eliminar
  }
}
