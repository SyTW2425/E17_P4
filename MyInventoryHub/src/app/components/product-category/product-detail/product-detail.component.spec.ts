import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryDetailComponent } from './product-detail.component';

describe('ProductDetailComponent', () => {
  let component: ProductCategoryDetailComponent;
  let fixture: ComponentFixture<ProductCategoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
