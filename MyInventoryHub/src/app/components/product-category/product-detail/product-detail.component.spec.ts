import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCategoryDetailComponent } from './product-detail.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProductCategoryDetailComponent', () => {
  let component: ProductCategoryDetailComponent;
  let fixture: ComponentFixture<ProductCategoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1', // Devuelve un valor de prueba para el parámetro 'id'
              },
            },
            
            params: of({ id: '1' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCategoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});