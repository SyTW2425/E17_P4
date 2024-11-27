import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellByCategoryComponent } from './sell-by-category.component';

describe('SellByCategoryComponent', () => {
  let component: SellByCategoryComponent;
  let fixture: ComponentFixture<SellByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellByCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
