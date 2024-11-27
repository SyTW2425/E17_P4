import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryDistributionComponent } from './inventory-distribution.component';

describe('InventoryDistributionComponent', () => {
  let component: InventoryDistributionComponent;
  let fixture: ComponentFixture<InventoryDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
