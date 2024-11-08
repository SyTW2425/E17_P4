import { Injectable } from '@angular/core';
import { SalesRecord } from '../models/salesRecord.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class SalesRecordService {
  private salesrecords: SalesRecord[] = []; 

  getAllSalesRecord(): SalesRecord[] {
    return this.salesrecords;
  }

  getSalesRecordById(id: number): SalesRecord | undefined {
    return this.salesrecords.find(salesrecord => salesrecord.id === id);
  }

  addSalesRecord(newSalesRecord: SalesRecord): void {
    this.salesrecords.push(newSalesRecord);
  }

  updateSalesRecord(updatedSalesRecord: SalesRecord): void {
    const index = this.salesrecords.findIndex(salesrecord => salesrecord.id === updatedSalesRecord.id);
    if (index !== -1) {
      this.salesrecords[index] = updatedSalesRecord;
    }
  }

  deleteSalesRecord(id: number): void {
    this.salesrecords = this.salesrecords.filter(salesrecord => salesrecord.id !== id);
  }
}