import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCategoryEditComponent } from './product-category-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('ProductCategoryEditComponent', () => {
  let component: ProductCategoryEditComponent;
  let fixture: ComponentFixture<ProductCategoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryEditComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1', // Mock del parámetro 'id'
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'), // Mock de `navigate`
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCategoryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
