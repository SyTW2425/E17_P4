import { Injectable } from '@angular/core';
import { Batch } from '../models/batch.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class BatchService {
  private batchs: Batch[] = []; 

  getAllBatchs(): Batch[] {
    return this.batchs;
  }

  getBatchById(id: number): Batch | undefined {
    return this.batchs.find(batch => batch.id === id);
  }

  addBatch(newBatch: Batch): void {
    this.batchs.push(newBatch);
  }

  updateBatch(updatedBatch: Batch): void {
    const index = this.batchs.findIndex(batch => batch.id === updatedBatch.id);
    if (index !== -1) {
      this.batchs[index] = updatedBatch;
    }
  }

  deleteBatch(id: number): void {
    this.batchs = this.batchs.filter(batch => batch.id !== id);
  }
}
