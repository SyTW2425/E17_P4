// Ejemplo de product.service.ts
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = []; // Aquí puedes manejar la lista de productos localmente o desde un backend.

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  // Agrega métodos adicionales como crear, actualizar y eliminar
}
