import { Injectable } from '@angular/core';
import { Order, OrderItem } from '../models/order.model'; 
import { __extends, __assign } from 'tslib'; 

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = []; // Arreglo de órdenes simulado

  // Obtener todas las órdenes
  getAllOrders(): Order[] {
    return this.orders;
  }

  // Obtener una orden por ID
  getOrderById(id: number): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  // Añadir una nueva orden
  addOrder(newOrder: Order): void {
    this.orders.push(newOrder);
  }

  // Actualizar una orden existente
  updateOrder(updatedOrder: Order): void {
    const index = this.orders.findIndex(order => order.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }
  }

  // Eliminar una orden
  deleteOrder(id: number): void {
    this.orders = this.orders.filter(order => order.id !== id);
  }

  // Añadir un artículo a una orden
  addOrderItem(orderId: number, newItem: OrderItem): void {
    const order = this.orders.find(order => order.id === orderId);
    if (order) {
      order.orderItems.push(newItem);
    }
  }

  // Eliminar un artículo de una orden
  removeOrderItem(orderId: number, productId: number): void {
    const order = this.orders.find(order => order.id === orderId);
    if (order) {
      order.orderItems = order.orderItems.filter(item => item.productId !== productId);
    }
  }

  // Cambiar el estado de la orden
  updateOrderStatus(orderId: number, status: 'PENDING' | 'SHIPPED' | 'RECEIVED' | 'CANCELLED'): void {
    const order = this.orders.find(order => order.id === orderId);
    if (order) {
      order.status = status;
    }
  }
}
