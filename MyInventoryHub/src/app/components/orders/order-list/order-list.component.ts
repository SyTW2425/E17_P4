import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent {
  @Input() orders: Order[] = []; // Recibe la lista de órdenes desde el componente padre
  @Output() selectOrder = new EventEmitter<Order>(); // Emite un evento cuando se selecciona una orden

  onSelect(order: Order) {
    this.selectOrder.emit(order);
  }
}