import { Component, OnInit, Input } from '@angular/core';
import { ProductCategoryService } from '../../../services/product-category.service';
import { ProductCategory } from '../../../models/productCategory.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-product-category-edit',
    standalone: true,
    imports: [],
    templateUrl: './product-category-edit.component.html',
    styleUrl: './product-category-edit.component.css'
})
export class ProductCategoryEditComponent implements OnInit {
  categoryForm: FormGroup;
  @Input() categoryId!: number;

  constructor(
    private categoryService: ProductCategoryService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const category = this.categoryService.getCategoryById(Number(id));
      if (category) {
        this.categoryForm.patchValue(category);
      }
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const updatedCategory: ProductCategory = {
        ...this.categoryForm.value,
        id: this.categoryId
      };
      this.categoryService.updateCategory(updatedCategory);
      this.router.navigate(['/categories']);
    }
  }
}