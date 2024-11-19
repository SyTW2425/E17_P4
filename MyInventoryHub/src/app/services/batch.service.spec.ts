import { TestBed } from '@angular/core/testing';
import { BatchService } from './batch.service';
import { Batch } from '../models/batch.model';

describe('BatchService', () => {
  let service: BatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar todos los lotes con getAllBatchs', () => {
    const batches: Batch[] = [
      { id: 1, productId: 101, batchNumber: 'A001', quantity: 50, expirationDate: new Date('2024-12-01'), receivedDate: new Date('2024-01-01') },
      { id: 2, productId: 102, batchNumber: 'B002', quantity: 30, expirationDate: new Date('2025-06-01'), receivedDate: new Date('2024-03-15') }
    ];
    batches.forEach(batch => service.addBatch(batch));
    expect(service.getAllBatchs()).toEqual(batches);
  });

  it('debería retornar el lote correcto con getBatchById', () => {
    const batch: Batch = { id: 1, productId: 101, batchNumber: 'A001', quantity: 50, expirationDate: new Date('2024-12-01'), receivedDate: new Date('2024-01-01') };
    service.addBatch(batch);
    expect(service.getBatchById(1)).toEqual(batch);
  });

  it('debería añadir un nuevo lote con addBatch', () => {
    const newBatch: Batch = { id: 3, productId: 103, batchNumber: 'C003', quantity: 20, expirationDate: new Date('2024-11-30'), receivedDate: new Date('2024-05-01') };
    service.addBatch(newBatch);
    expect(service.getAllBatchs()).toContain(newBatch);
  });

  it('debería actualizar un lote existente con updateBatch', () => {
    const batch: Batch = { id: 1, productId: 101, batchNumber: 'A001', quantity: 50, expirationDate: new Date('2024-12-01'), receivedDate: new Date('2024-01-01') };
    service.addBatch(batch);
    const updatedBatch: Batch = { ...batch, quantity: 75 };
    service.updateBatch(updatedBatch);
    expect(service.getBatchById(1)?.quantity).toBe(75);
  });

  it('debería eliminar un lote con deleteBatch', () => {
    const batch: Batch = { id: 1, productId: 101, batchNumber: 'A001', quantity: 50, expirationDate: new Date('2024-12-01'), receivedDate: new Date('2024-01-01') };
    service.addBatch(batch);
    service.deleteBatch(1);
    expect(service.getBatchById(1)).toBeUndefined();
  });
});
