import { Component, OnInit } from '@angular/core';
import { SalesRecordService } from '../../services/sales-record.service';
import { SalesRecord } from '../../models/salesRecord.model';

@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styleUrls: ['./sales-record.component.css']
})
export class SalesRecordComponent implements OnInit {
  salesRecords: SalesRecord[] = [];
  newSalesRecord: SalesRecord = {
    id: 0,
    productId: 0,
    customerId: 0,
    saleDate: new Date(),
    quantity: 0,
    totalAmount: 0
  };

  constructor(private salesRecordService: SalesRecordService) {}

  ngOnInit(): void {
    this.loadSalesRecords();
  }

  loadSalesRecords(): void {
    this.salesRecords = this.salesRecordService.getAllSalesRecord();
  }

  addSalesRecord(): void {
    this.salesRecordService.addSalesRecord(this.newSalesRecord);
    this.loadSalesRecords();
    this.resetForm();
  }

  deleteSalesRecord(id: number): void {
    this.salesRecordService.deleteSalesRecord(id);
    this.loadSalesRecords();
  }

  resetForm(): void {
    this.newSalesRecord = {
      id: 0,
      productId: 0,
      customerId: 0,
      saleDate: new Date(),
      quantity: 0,
      totalAmount: 0
    };
  }
}
