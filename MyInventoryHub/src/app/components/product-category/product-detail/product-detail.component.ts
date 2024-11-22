import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../../models/productCategory.model';
import { ProductCategoryService } from '../../../services/product-category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-product-detail',
    imports: [],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.css'
})
export class ProductCategoryDetailComponent implements OnInit {
  category: ProductCategory | undefined;

  constructor(
    private categoryService: ProductCategoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.category = this.categoryService.getCategoryById(id);
  }
}