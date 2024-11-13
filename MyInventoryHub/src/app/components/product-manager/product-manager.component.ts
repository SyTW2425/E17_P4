import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-manager',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css']
})
export class ProductManagerComponent implements OnInit {
  products: Product[] = [];

  constructor() { }

  ngOnInit(): void {
    // Aquí cargarías los productos, por ejemplo desde una API
    this.products = [
      { id: 1, name: 'Product 1', description: 'Description 1', quantity: 10, price: 100, supplier: 'Supplier 1' },
      { id: 2, name: 'Product 2', description: 'Description 2', quantity: 20, price: 150, supplier: 'Supplier 2' }
    ];
  }

  // Métodos para agregar, editar, eliminar productos pueden ir aquí
  addProduct(product: Product): void {
    this.products.push(product);
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(product => product.id !== id);
  }

  editProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
  }
}
