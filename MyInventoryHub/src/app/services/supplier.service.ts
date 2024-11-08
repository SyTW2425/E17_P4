import { Injectable } from '@angular/core';
import { Supplier } from '../models/supplier.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private suppliers: Supplier[] = []; 

  getAllSuppliers(): Supplier[] {
    return this.suppliers;
  }

  getSupplierById(id: number): Supplier | undefined {
    return this.suppliers.find(supplier => supplier.id === id);
  }

  addSupplier(newSupplier: Supplier): void {
    this.suppliers.push(newSupplier);
  }

  updateSupplier(updatedSupplier: Supplier): void {
    const index = this.suppliers.findIndex(supplier => supplier.id === updatedSupplier.id);
    if (index !== -1) {
      this.suppliers[index] = updatedSupplier;
    }
  }

  deleteSupplier(id: number): void {
    this.suppliers = this.suppliers.filter(supplier => supplier.id !== id);
  }
}
