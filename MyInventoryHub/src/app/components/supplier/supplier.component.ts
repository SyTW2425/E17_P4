import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { Supplier } from '../../models/supplier.model';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  newSupplier: Supplier = {
    id: 0,
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  };

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.suppliers = this.supplierService.getAllSuppliers();
  }

  addSupplier(): void {
    this.supplierService.addSupplier(this.newSupplier);
    this.loadSuppliers();
    this.resetForm();
  }

  deleteSupplier(id: number): void {
    this.supplierService.deleteSupplier(id);
    this.loadSuppliers();
  }

  resetForm(): void {
    this.newSupplier = {
      id: 0,
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: ''
    };
  }
}

