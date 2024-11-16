import { Component, OnInit } from '@angular/core';
import { ProductCategoryService } from '../../../services/product-category.service';
import { ProductCategory } from '../../../models/productCategory.model';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.css'
})
export class ProductCategoryListComponent implements OnInit {
  categories: ProductCategory[] = [];

  constructor(private categoryService: ProductCategoryService) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getAllCategories();
  }

  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id);
    this.categories = this.categoryService.getAllCategories(); // Actualiza la lista
  }
}
