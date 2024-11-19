import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderFormComponent } from './order-form.component';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, OrderFormComponent], // Usamos standalone aquí
      providers: [OrderService]
    });

    const fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with one default order item', () => {
    expect(component.orderForm).toBeTruthy();
    expect(component.orderItems.length).toBe(1); // Un solo elemento por defecto
  });

  it('should add a new order item when addOrderItem is called', () => {
    const initialLength = component.orderItems.length;
    component.addOrderItem();
    expect(component.orderItems.length).toBe(initialLength + 1);
  });

  it('should remove an order item when removeOrderItem is called', () => {
    component.addOrderItem(); // Añadimos un elemento para luego eliminarlo
    const initialLength = component.orderItems.length;
    component.removeOrderItem(0);
    expect(component.orderItems.length).toBe(initialLength - 1);
  });

  it('should call orderService.addOrder when submitOrder is called with valid data', () => {
    spyOn(orderService, 'addOrder').and.callThrough();

    const mockOrder: Order = {
      id: 1,
      supplierId: 101,
      orderDate: new Date(),
      deliveryDate: new Date(),
      status: 'PENDING',
      orderItems: [
        {
          productId: 201,
          quantity: 2,
          unitPrice: 50
        }
      ]
    };

    component.orderForm.setValue(mockOrder);
    component.submitOrder();

    expect(orderService.addOrder).toHaveBeenCalledWith(mockOrder);
  });

  it('should reset the form and order items after submitOrder is called', () => {
    const mockOrder: Order = {
      id: 1,
      supplierId: 101,
      orderDate: new Date(),
      deliveryDate: new Date(),
      status: 'PENDING',
      orderItems: [
        {
          productId: 201,
          quantity: 2,
          unitPrice: 50
        }
      ]
    };

    component.orderForm.setValue(mockOrder);
    component.submitOrder();

    // Verificamos que el formulario se reinició
    expect(component.orderForm.valid).toBeFalse();
    expect(component.orderItems.length).toBe(1); // Solo queda el item inicial
  });
});

