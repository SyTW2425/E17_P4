/** 
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
*/
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
/** 
 * testeando order details
import { Component } from '@angular/core';
import { Order } from './models/order.model';
import { OrderListComponent } from '../app/components/orders/order-list/order-list.component';
import { OrderDetailComponent } from '../app/components/orders/order-detail/order-detail.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <app-order-list [orders]="orders" (selectOrder)="onOrderSelected($event)"></app-order-list>
    <app-order-detail *ngIf="selectedOrder" [order]="selectedOrder!"></app-order-detail>
  `,
  standalone: true,
  imports: [CommonModule, OrderListComponent, OrderDetailComponent]
})
export class AppComponent {
  orders: Order[] = [
    {
      id: 1,
      supplierId: 123,
      orderDate: new Date(),
      deliveryDate: new Date(),
      status: 'PENDING',
      orderItems: [
        { productId: 101, quantity: 2, unitPrice: 15.0 },
        { productId: 102, quantity: 1, unitPrice: 30.0 }
      ]
    },
    {
      id: 2,
      supplierId: 456,
      orderDate: new Date(),
      status: 'SHIPPED',
      orderItems: [
        { productId: 103, quantity: 3, unitPrice: 20.0 },
        { productId: 104, quantity: 4, unitPrice: 25.0 }
      ]
    }
  ];

  selectedOrder?: Order;

  onOrderSelected(order: Order) {
    this.selectedOrder = order;
  }
}
*/
