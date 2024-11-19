import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar todos los productos con getAllProducts', () => {
    const products: Product[] = [
      { id: 1, name: 'Producto 1', description: 'Descripción del producto 1', quantity: 100, price: 25.5, supplier: 'Proveedor 1' },
      { id: 2, name: 'Producto 2', description: 'Descripción del producto 2', quantity: 50, price: 15.0, supplier: 'Proveedor 2' }
    ];
    products.forEach(product => service.addProduct(product));
    expect(service.getAllProducts()).toEqual(products);
  });

  it('debería retornar el producto correcto con getProductById', () => {
    const product: Product = { id: 1, name: 'Producto 1', description: 'Descripción del producto 1', quantity: 100, price: 25.5, supplier: 'Proveedor 1' };
    service.addProduct(product);
    expect(service.getProductById(1)).toEqual(product);
  });

  it('debería añadir un nuevo producto con addProduct', () => {
    const newProduct: Product = { id: 3, name: 'Producto 3', description: 'Descripción del producto 3', quantity: 75, price: 30.0, supplier: 'Proveedor 3' };
    service.addProduct(newProduct);
    expect(service.getAllProducts()).toContain(newProduct);
  });

  it('debería actualizar un producto existente con updateProduct', () => {
    const product: Product = { id: 1, name: 'Producto 1', description: 'Descripción del producto 1', quantity: 100, price: 25.5, supplier: 'Proveedor 1' };
    service.addProduct(product);
    const updatedProduct: Product = { ...product, price: 27.0 };
    service.updateProduct(updatedProduct);
    expect(service.getProductById(1)?.price).toBe(27.0);
  });

  it('debería eliminar un producto con deleteProduct', () => {
    const product: Product = { id: 1, name: 'Producto 1', description: 'Descripción del producto 1', quantity: 100, price: 25.5, supplier: 'Proveedor 1' };
    service.addProduct(product);
    service.deleteProduct(1);
    expect(service.getProductById(1)).toBeUndefined();
  });
});
