import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { Order} from '../../../models/order.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-order-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;

  constructor(private fb: FormBuilder, private orderService: OrderService) {
    this.orderForm = this.fb.group({
      id: [null, Validators.required],
      supplierId: [null, Validators.required],
      orderDate: [new Date(), Validators.required],
      deliveryDate: [null],
      status: ['PENDING', Validators.required],
      orderItems: this.fb.array([]) // Arreglo de items
    });
  }

  ngOnInit(): void {
    // Agregar un item inicial por defecto
    this.addOrderItem();
  }

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  addOrderItem(): void {
    const item = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
    this.orderItems.push(item);
  }

  removeOrderItem(index: number): void {
    this.orderItems.removeAt(index);
  }

  submitOrder(): void {
    if (this.orderForm.valid) {
      const order: Order = this.orderForm.value;
      this.orderService.addOrder(order);
      this.orderForm.reset();
      // Reiniciar el formulario, agregando un artículo por defecto
      this.orderItems.clear();
      this.addOrderItem();
    }
  }
}
