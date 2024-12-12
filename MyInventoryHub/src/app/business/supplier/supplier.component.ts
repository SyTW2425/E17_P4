import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier/supplier.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [MessageService],
})
export class SuppliersComponent implements OnInit {
  suppliers: any[] = [];
  supplierForm: FormGroup;
  isLoading = false;

  constructor(
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  fetchSuppliers(): void {
    this.isLoading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los proveedores.',
        });
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      return;
    }

    const supplierData = this.supplierForm.value;
    this.supplierService.addSupplier(supplierData).subscribe({
      next: () => {
        this.fetchSuppliers();
        this.supplierForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Proveedor añadido correctamente.',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo añadir el proveedor.',
        });
      },
    });
  }
}
