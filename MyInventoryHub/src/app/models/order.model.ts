export interface Order {
    id: number;
    supplierId: number;
    orderDate: Date;
    deliveryDate?: Date;
    status: 'PENDING' | 'SHIPPED' | 'RECEIVED' | 'CANCELLED';
    orderItems: OrderItem[];
  }
  
  export interface OrderItem {
    productId: number;
    quantity: number;
    unitPrice: number;
  }
  