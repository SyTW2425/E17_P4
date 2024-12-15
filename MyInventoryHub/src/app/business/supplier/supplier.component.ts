// suppliers.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { SupplierService } from '../../services/supplier/supplier.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, DialogModule, ReactiveFormsModule],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [MessageService],
})
export class SuppliersComponent implements OnInit {
  suppliers: any[] = [];
  supplierForm!: FormGroup;
  showForm = false;
  isEditMode = false;
  selectedSupplierName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchSuppliers();
  }

  initForm(): void {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
    });
  }

  fetchSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => (this.suppliers = suppliers),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proveedores.' }),
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.resetForm();
  }

  resetForm(): void {
    this.supplierForm.reset();
    this.isEditMode = false;
    this.selectedSupplierName = null;
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) return;
  
    const supplierData = this.supplierForm.value;
  
    if (this.isEditMode && this.selectedSupplierName) {
      this.supplierService.updateSupplier(this.selectedSupplierName, supplierData).subscribe({
        next: () => {
          this.fetchSuppliers();
          this.showForm = false;
          this.isEditMode = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado correctamente.' });
        },
        error: (err) => {
          console.error('Error al actualizar proveedor:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el proveedor.' });
        }
      });
    } else {
      // Lógica para añadir proveedor
      this.supplierService.addSupplier(supplierData).subscribe({
        next: () => {
          this.fetchSuppliers();
          this.showForm = false;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor añadido correctamente.' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo añadir el proveedor.' });
        }
      });
    }
  }  

  openUpdateSupplierForm(supplier: any): void {
    this.selectedSupplierName = supplier.name;
    this.supplierForm.patchValue(supplier);
    this.isEditMode = true;
    this.showForm = true;
  }

  deleteSupplier(name: string): void {
    this.supplierService.deleteSupplier(name).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado correctamente.' });
        this.fetchSuppliers();
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el proveedor.' }),
    });
  }
}
