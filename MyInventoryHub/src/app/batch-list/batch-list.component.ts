import { Component, OnInit } from '@angular/core';
import { Batch } from '../models/batch.model';
import { DatePipe } from '@angular/common'; 
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-batch-list',
  standalone: true,  
  templateUrl: './batch-list.component.html',
  imports: [CommonModule, DatePipe],  
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

  constructor() {}

  ngOnInit(): void {}
}

