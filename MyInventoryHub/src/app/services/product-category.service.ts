import { Injectable } from '@angular/core';
import { ProductCategory } from '../models/productCategory.model'; 
import { __extends, __assign } from 'tslib'; // Similar a los ejemplos previos

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  private categories: ProductCategory[] = []; // Arreglo de categorías simulado

  // Obtener todas las categorías
  getAllCategories(): ProductCategory[] {
    return this.categories;
  }

  // Obtener una categoría por ID
  getCategoryById(id: number): ProductCategory | undefined {
    return this.categories.find(category => category.id === id);
  }

  // Añadir una nueva categoría
  addCategory(newCategory: ProductCategory): void {
    this.categories.push(newCategory);
  }

  // Actualizar una categoría existente
  updateCategory(updatedCategory: ProductCategory): void {
    const index = this.categories.findIndex(category => category.id === updatedCategory.id);
    if (index !== -1) {
      this.categories[index] = updatedCategory;
    }
  }

  // Eliminar una categoría
  deleteCategory(id: number): void {
    this.categories = this.categories.filter(category => category.id !== id);
  }
}
