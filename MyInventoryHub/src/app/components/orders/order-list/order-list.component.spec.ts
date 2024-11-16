import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OrderListComponent } from './order-list.component';
import { Order } from '../../../models/order.model';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let mockOrders: Order[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderListComponent]
    });
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;

    // Datos simulados
    mockOrders = [
      { id: 1, status: 'PENDING', supplierId: 123, orderDate: new Date(), deliveryDate: new Date(), orderItems: [] },
      { id: 2, status: 'SHIPPED', supplierId: 456, orderDate: new Date(), deliveryDate: new Date(), orderItems: [] }
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of orders', () => {
    component.orders = mockOrders;
    fixture.detectChanges();

    const orderElements = fixture.debugElement.queryAll(By.css('ul li'));
    expect(orderElements.length).toBe(mockOrders.length);
  });

  it('should emit the selected order on click', () => {
    spyOn(component.selectOrder, 'emit'); // Espía el evento

    component.orders = mockOrders;
    fixture.detectChanges();

    // Simula un clic en el primer elemento de la lista
    const firstOrderElement = fixture.debugElement.query(By.css('ul li'));
    firstOrderElement.triggerEventHandler('click', null);

    expect(component.selectOrder.emit).toHaveBeenCalledWith(mockOrders[0]);
  });
});
