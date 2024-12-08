import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000'; 
  constructor(private http: HttpClient) {}

  // Obtener productos de un almacén
  getProducts(token: string, warehouseId: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/warehouses/${warehouseId}/products`, { headers });
  }

  // Crear un producto en un almacén
  createProduct(token: string, warehouseId: string, productData: any): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/warehouses/${warehouseId}/products`, productData, { headers });
  }

  // Actualizar un producto
  updateProduct(token: string, warehouseId: string, productId: string, productData: any): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.apiUrl}/warehouses/${warehouseId}/products/${productId}`, productData, { headers });
  }

  // Eliminar un producto
  deleteProduct(token: string, warehouseId: string, productId: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/warehouses/${warehouseId}/products/${productId}`, { headers });
  }
}
