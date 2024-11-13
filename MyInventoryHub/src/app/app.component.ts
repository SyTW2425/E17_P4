import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MyInventoryHub';
}

/** 
import { Component } from '@angular/core';
import { InventoryTransactionDetailComponent } from './components/inventory/inventory-transaction-detail/inventory-transaction-detail.component';
import { InventoryTransaction } from './models/inventoryTransaction.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InventoryTransactionDetailComponent],
  template: `
    <div style="padding: 20px;">
      <app-inventory-transaction-detail [transaction]="testTransaction"></app-inventory-transaction-detail>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Objeto de prueba
  testTransaction: InventoryTransaction = {
    id: 1,
    productId: 101,
    transactionType: 'IN',
    quantity: 50,
    transactionDate: new Date(),
    warehouseId: 1
  };
}
*/