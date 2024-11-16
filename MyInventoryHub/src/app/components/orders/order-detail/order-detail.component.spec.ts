import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDetailComponent } from './order-detail.component';
import { Order } from '../../../models/order.model';
import { By } from '@angular/platform-browser';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display order details correctly when an order is provided', () => {
    // Arrange
    const mockOrder: Order = {
      id: 1,
      supplierId: 101,
      orderDate: new Date('2024-01-01'),
      deliveryDate: new Date('2024-01-05'),
      status: 'PENDING',
      orderItems: [
        { productId: 201, quantity: 2, unitPrice: 50 },
        { productId: 202, quantity: 1, unitPrice: 100 }
      ]
    };
  
    component.order = mockOrder;
    fixture.detectChanges(); // Importante para actualizar el DOM
  
    const compiled = fixture.nativeElement;
  
    // Act & Assert
    expect(compiled.querySelector('h2').textContent).toContain('Detalles de la Orden #1');
    expect(compiled.querySelector('p:nth-child(2)').textContent).toContain('Proveedor ID: 101');
    expect(compiled.querySelector('p:nth-child(3)').textContent).toContain('Fecha de Pedido:');
    expect(compiled.querySelector('p:nth-child(5)').textContent).toContain('Estado: PENDING');
  
    // Verificar los elementos en la tabla
    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2); // Hay 2 elementos en orderItems
  
    const firstRow = rows[0].children;
    expect(firstRow[0].textContent).toContain('201'); // Producto ID del primer artículo
    expect(firstRow[1].textContent).toContain('2');   // Cantidad del primer artículo
    expect(firstRow[2].textContent).toContain('$50.00'); // Precio Unitario formateado
    expect(firstRow[3].textContent).toContain('$100.00'); // Subtotal calculado
  
    const secondRow = rows[1].children;
    expect(secondRow[0].textContent).toContain('202'); // Producto ID del segundo artículo
    expect(secondRow[1].textContent).toContain('1');   // Cantidad del segundo artículo
    expect(secondRow[2].textContent).toContain('$100.00'); // Precio Unitario formateado
    expect(secondRow[3].textContent).toContain('$100.00'); // Subtotal calculado
  });
  it('should handle undefined order input gracefully', () => {
    component.order = undefined as any; // Simulate an undefined input
    fixture.detectChanges();

    const orderDetailsElement = fixture.debugElement.query(By.css('.order-details'));
    expect(orderDetailsElement).toBeNull(); // No details should be displayed
  });
});
