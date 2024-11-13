import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryTransaction } from '../../../models/inventoryTransaction.model';


@Component({
  selector: 'app-inventory-transaction-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-transaction-detail.component.html',
  styleUrl: './inventory-transaction-detail.component.css'
})
export class InventoryTransactionDetailComponent {
  @Input() transaction!: InventoryTransaction; // Recibe la transacción a mostrar
}
