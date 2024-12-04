import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Warehouse } from '../models/warehouse.model';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private apiUrl = 'http://localhost:3000/api/warehouses'; // URL del backend

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los almacenes del usuario autenticado.
   * Incluye el token en los encabezados para la autenticación.
   */
  getUserWarehouses(): Observable<any> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return this.http.get(`${this.apiUrl}`, { headers });
    } else {
      return new Observable((observer) => {
        observer.error('Token no disponible');
      });
    }
  }
  
  
  

  /**
   * Crea un nuevo almacén.
   * Envía el almacén al backend y devuelve el almacén creado.
   */
  addWarehouse(newWarehouse: Warehouse): Observable<Warehouse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT del usuario
      'Content-Type': 'application/json',
    });
    return this.http.post<Warehouse>(this.apiUrl, newWarehouse, { headers });
  }

  /**
   * Actualiza un almacén existente.
   * Envía el almacén actualizado al backend.
   */
  updateWarehouse(updatedWarehouse: Warehouse): Observable<Warehouse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT del usuario
      'Content-Type': 'application/json',
    });
    return this.http.put<Warehouse>(
      `${this.apiUrl}/${updatedWarehouse.id}`,
      updatedWarehouse,
      { headers }
    );
  }

  /**
   * Elimina un almacén.
   * Envía la solicitud de eliminación al backend.
   */
  deleteWarehouse(id: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Token JWT del usuario
    });
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}
