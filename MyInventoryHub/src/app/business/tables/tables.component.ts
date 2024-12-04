import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

interface Product {
    id: number;
    name: string;
    description: string;
    stock: number;
    category: string;
    price: number;
    supplier: string;
    maxCapacity: number;
    warehouseId: number;
    imageUrl: string;
    minPrice: number;
}

interface Warehouse {
  id: number;
  name: string;
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, FormsModule],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export default class TablesComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;
  showForm = false;
  products: Product[] = [
    {
      id: 1,
      name: 'Producto A',
      description: 'Descripción del Producto A',
      stock: 50,
      category: 'Categoría 1',
      price: 10.5,
      supplier: 'Proveedor X',
      maxCapacity: 100,
      warehouseId: 1,
      imageUrl: 'coca.png',
      minPrice: 8.5,
    },
    {
      id: 2,
      name: 'Producto B',
      description: 'Descripción del Producto B',
      stock: 15,
      category: 'Categoría 2',
      price: 20.0,
      supplier: 'Proveedor Y',
      maxCapacity: 150,
      warehouseId: 2,
      imageUrl: 'aquarius.png',
      minPrice: 16.0,
    },
    {
      id: 3,
      name: 'Producto C',
      description: 'Descripción del Producto C',
      stock: 40,
      category: 'Categoría 1',
      price: 15.0,
      supplier: 'Proveedor Z',
      maxCapacity: 50,
      warehouseId: 1,
      imageUrl: 'lays.png',
      minPrice: 11.5,
    }
  ];
  warehouses: Warehouse[] = [
    { id: 1, name: 'Almacén 1' },
    { id: 2, name: 'Almacén 2' },
    { id: 3, name: 'Almacén 3' }
  ];
  selectedWarehouse: number | null = null;  
  filteredProducts: Product[] = [...this.products];

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      description: [''],
      stock: ['', Validators.required],
      category: [''],
      price: ['', Validators.required],
      supplier: [''],
      maxCapacity: ['', Validators.required],
      warehouseId: ['', Validators.required],
      minPrice: ['', Validators.required]
    });
  }

  filterByWarehouse() {
    if (this.selectedWarehouse !== null && this.selectedWarehouse !== undefined) {
      this.filteredProducts = this.products.filter(
        product => product.warehouseId === Number(this.selectedWarehouse)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }

  onFileSelect(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }
  
  toggleForm() {
    this.showForm = !this.showForm;
  }

  createProduct() {
    if (this.productForm.valid) {
      const product = { ...this.productForm.value };
      this.products.push(product);
      this.productForm.reset();
      this.showForm = false;
    }
  }
}
