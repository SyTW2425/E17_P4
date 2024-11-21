import { Component } from '@angular/core';
import { ProductCategoryService } from '../../../services/product-category.service';
import { ProductCategory } from '../../../models/productCategory.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-product-category-form',
    imports: [],
    templateUrl: './product-category-form.component.html',
    styleUrl: './product-category-form.component.css'
})
export class ProductCategoryFormComponent {
  categoryForm: FormGroup;

  constructor(
    private categoryService: ProductCategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const newCategory: ProductCategory = {
        id: Date.now(), // o algún otro método para asignar un ID único
        name: this.categoryForm.value.name,
        description: this.categoryForm.value.description
      };
      this.categoryService.addCategory(newCategory);
      this.categoryForm.reset();
    }
  }
}