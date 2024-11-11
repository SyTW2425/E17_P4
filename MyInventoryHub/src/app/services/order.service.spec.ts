import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { Order, OrderItem } from '../models/order.model';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have no orders', () => {
    expect(service.getAllOrders().length).toBe(0);
  });

  it('should add a new order', () => {
    const newOrder: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: []
    };
    service.addOrder(newOrder);
    expect(service.getAllOrders().length).toBe(1);
    expect(service.getAllOrders()[0]).toEqual(newOrder);
  });

  it('should get an order by ID', () => {
    const newOrder: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: []
    };
    service.addOrder(newOrder);
    const order = service.getOrderById(1);
    expect(order).toEqual(newOrder);
  });

  it('should return undefined for a non-existent order ID', () => {
    const order = service.getOrderById(999);
    expect(order).toBeUndefined();
  });

  it('should update an existing order', () => {
    const initialOrder: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: []
    };
    service.addOrder(initialOrder);

    const updatedOrder: Order = {
      ...initialOrder,
      status: 'SHIPPED'
    };
    service.updateOrder(updatedOrder);

    const order = service.getOrderById(1);
    expect(order?.status).toBe('SHIPPED');
  });

  it('should delete an order by ID', () => {
    const newOrder: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: []
    };
    service.addOrder(newOrder);
    service.deleteOrder(1);
    expect(service.getAllOrders().length).toBe(0);
  });

  it('should not delete an order if ID does not exist', () => {
    const newOrder: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: []
    };
    service.addOrder(newOrder);
    service.deleteOrder(999);
    expect(service.getAllOrders().length).toBe(1);
  });

  it('should add an item to an existing order', () => {
    const order: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: []
    };
    service.addOrder(order);

    const newItem: OrderItem = {
      productId: 1,
      quantity: 5,
      unitPrice: 10
    };
    service.addOrderItem(1, newItem);

    const updatedOrder = service.getOrderById(1);
    expect(updatedOrder?.orderItems.length).toBe(1);
    expect(updatedOrder?.orderItems[0]).toEqual(newItem);
  });

  it('should not add an item if the order does not exist', () => {
    const newItem: OrderItem = {
      productId: 1,
      quantity: 5,
      unitPrice: 10
    };
    service.addOrderItem(999, newItem);

    expect(service.getAllOrders().length).toBe(0);
  });

  it('should remove an item from an existing order', () => {
    const order: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: [{ productId: 1, quantity: 5, unitPrice: 10 }]
    };
    service.addOrder(order);
    service.removeOrderItem(1, 1);

    const updatedOrder = service.getOrderById(1);
    expect(updatedOrder?.orderItems.length).toBe(0);
  });

  it('should not remove an item if the product ID does not exist in the order', () => {
    const order: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: [{ productId: 1, quantity: 5, unitPrice: 10 }]
    };
    service.addOrder(order);
    service.removeOrderItem(1, 999);

    const updatedOrder = service.getOrderById(1);
    expect(updatedOrder?.orderItems.length).toBe(1);
  });

  it('should update the status of an existing order', () => {
    const order: Order = {
      id: 1,
      supplierId: 1,
      orderDate: new Date(),
      status: 'PENDING',
      orderItems: []
    };
    service.addOrder(order);

    service.updateOrderStatus(1, 'SHIPPED');
    const updatedOrder = service.getOrderById(1);
    expect(updatedOrder?.status).toBe('SHIPPED');
  });

  it('should not update the status if the order ID does not exist', () => {
    service.updateOrderStatus(999, 'SHIPPED');
    expect(service.getAllOrders().length).toBe(0);
  });
});

