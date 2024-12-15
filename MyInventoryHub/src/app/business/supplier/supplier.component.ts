import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
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
  imports: [ReactiveFormsModule, CommonModule, TableModule, ButtonModule, InputTextModule, DialogModule, FormsModule],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [MessageService],
})
export class SuppliersComponent implements OnInit {
  suppliers: any[] = [];
  supplierForm: FormGroup;
  isLoading = false;
  showForm = false;
  showUpdateForm: boolean = false;
  updateSupplierForm!: FormGroup;
  selectedSupplier: any = null;
  isEditMode: boolean = false; // Declaración de isEditMode

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
    this.updateSupplierForm = this.fb.group({
      name: [''],
      phone: [''],
      email: [''],
      address: ['']
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

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.isEditMode = false; // Modo de creación al abrir el formulario
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

  deleteSupplier(name: string): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no disponible');
      return;
    }

    this.supplierService.deleteSupplier(name, token).subscribe({
      next: () => {
        this.fetchSuppliers();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor eliminado correctamente' });
      },
      error: (err) => {
        console.error('Error al eliminar el proveedor:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el proveedor' });
      },
    });
  }
  
  openUpdateSupplierForm(supplier: any): void {
    if (supplier) {
      this.selectedSupplier = supplier;
      this.updateSupplierForm.patchValue({
        name: supplier.name || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || ''
      });
      this.showUpdateForm = true;
      this.isEditMode = true; // Modo de edición al abrir el formulario de actualización
    } else {
      console.error('Proveedor seleccionado no encontrado');
    }
  }
  
  closeUpdateForm(): void {
    this.showUpdateForm = false;
    this.updateSupplierForm.reset();
    this.isEditMode = false;
  }

  onUpdateSubmit(): void {
    if (this.updateSupplierForm.valid && this.selectedSupplier) {
      const updatedData = this.updateSupplierForm.value;
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token no disponible');
        return;
      }
  
      this.supplierService.updateSupplier(this.selectedSupplier.name, updatedData, token).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor actualizado correctamente' });
          this.fetchSuppliers();
          this.showUpdateForm = false;
          this.isEditMode = false;
        },
        error: (err) => {
          console.error('Error al actualizar proveedor:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el proveedor' });
        }
      });
    } else {
      console.error('Formulario no válido o proveedor no seleccionado');
    }
  }
}

