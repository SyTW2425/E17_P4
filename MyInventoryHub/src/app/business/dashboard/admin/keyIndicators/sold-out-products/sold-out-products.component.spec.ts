import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldOutProductsComponent } from './sold-out-products.component';

describe('SoldOutProductsComponent', () => {
  let component: SoldOutProductsComponent;
  let fixture: ComponentFixture<SoldOutProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldOutProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldOutProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
