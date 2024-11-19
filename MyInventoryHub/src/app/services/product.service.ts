import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = []; 

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  addProduct(newProduct: Product): void {
    this.products.push(newProduct);
  }

  updateProduct(updatedProduct: Product): void {
    const index = this.products.findIndex(product => product.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
  }

  deleteProduct(id: number): void {
    this.products = this.products.filter(product => product.id !== id);
  }
}