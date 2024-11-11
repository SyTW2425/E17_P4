import { Component, OnInit } from '@angular/core';
import { InventoryTransactionService } from '../../../services/inventory-transaction.service';
import { InventoryTransaction } from '../../../models/inventoryTransaction.model';

@Component({
  selector: 'app-inventory-transaction-list',
  standalone: true,
  imports: [],
  templateUrl: './inventory-transaction-list.component.html',
  styleUrls: ['./inventory-transaction-list.component.css']
})
export class InventoryTransactionListComponent implements OnInit {
  transactions: InventoryTransaction[] = [];

  constructor(private transactionService: InventoryTransactionService) {}

  ngOnInit(): void {
    this.transactions = this.transactionService.getAllTransactions();
  }
}
