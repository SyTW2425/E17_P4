import { TestBed } from '@angular/core/testing';
import { ProductCategoryService } from './product-category.service';
import { ProductCategory } from '../models/productCategory.model';

describe('ProductCategoryService', () => {
  let service: ProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have no categories', () => {
    expect(service.getAllCategories().length).toBe(0);
  });

  it('should add a new category', () => {
    const newCategory: ProductCategory = { id: 1, name: 'Electronics', description: 'Category for electronic items' };
    service.addCategory(newCategory);
    const categories = service.getAllCategories();
    expect(categories.length).toBe(1);
    expect(categories[0]).toEqual(newCategory);
  });

  it('should get a category by ID', () => {
    const newCategory: ProductCategory = { id: 1, name: 'Electronics', description: 'Category for electronic items' };
    service.addCategory(newCategory);
    const category = service.getCategoryById(1);
    expect(category).toEqual(newCategory);
  });

  it('should return undefined for a non-existent category ID', () => {
    const category = service.getCategoryById(999);
    expect(category).toBeUndefined();
  });

  it('should update an existing category', () => {
    const initialCategory: ProductCategory = { id: 1, name: 'Electronics', description: 'Category for electronic items' };
    service.addCategory(initialCategory);

    const updatedCategory: ProductCategory = { id: 1, name: 'Updated Electronics', description: 'Updated description' };
    service.updateCategory(updatedCategory);

    const category = service.getCategoryById(1);
    expect(category).toEqual(updatedCategory);
  });

  it('should not update a category if the ID does not exist', () => {
    const initialCategory: ProductCategory = { id: 1, name: 'Electronics', description: 'Category for electronic items' };
    service.addCategory(initialCategory);

    const nonExistentUpdate: ProductCategory = { id: 999, name: 'Nonexistent', description: 'Should not update' };
    service.updateCategory(nonExistentUpdate);

    const category = service.getCategoryById(1);
    expect(category).toEqual(initialCategory);
  });

  it('should delete a category by ID', () => {
    const newCategory: ProductCategory = { id: 1, name: 'Electronics', description: 'Category for electronic items' };
    service.addCategory(newCategory);
    service.deleteCategory(1);
    const categories = service.getAllCategories();
    expect(categories.length).toBe(0);
  });

  it('should not change categories if trying to delete a non-existent ID', () => {
    const newCategory: ProductCategory = { id: 1, name: 'Electronics', description: 'Category for electronic items' };
    service.addCategory(newCategory);
    service.deleteCategory(999);
    const categories = service.getAllCategories();
    expect(categories.length).toBe(1);
    expect(categories[0]).toEqual(newCategory);
  });
});
