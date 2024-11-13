import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryTransaction } from '../../../models/inventoryTransaction.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventory-transaction-form.component.html',
  styleUrls: ['./inventory-transaction-form.component.css']
})
export class InventoryTransactionFormComponent {
  @Input() transaction: InventoryTransaction | null = null;
  @Output() formSubmit = new EventEmitter<InventoryTransaction>();
  transactionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      id: [null, Validators.required],
      productId: [null, Validators.required],
      transactionType: ['IN', Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]],
      transactionDate: [new Date(), Validators.required],
      warehouseId: [null, Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.transaction) {
      this.transactionForm.patchValue(this.transaction);
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      this.formSubmit.emit(this.transactionForm.value);
    }
  }
}
