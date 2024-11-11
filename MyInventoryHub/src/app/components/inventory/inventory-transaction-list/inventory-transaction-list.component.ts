/**
 * ngOnInit is used to initialize the component after Angular has fully set up the component and injected dependencies.
 * It is a safe place to perform tasks like fetching data or setting up initial state, ensuring that the component 
 * is ready for interaction and rendering.
*/
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
/**
 * Adds a property that saves a list of all the inventory transactions 
 * obtained by the service.
 */
export class InventoryTransactionListComponent implements OnInit {
  transactions: InventoryTransaction[] = [];

  constructor(private transactionService: InventoryTransactionService) {}

  ngOnInit(): void {
    this.transactions = this.transactionService.getAllTransactions();
  }
}
