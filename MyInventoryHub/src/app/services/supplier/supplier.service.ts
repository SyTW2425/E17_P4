// supplier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private baseUrl = 'http://localhost:3000/suppliers';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getSuppliers(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getHeaders() });
  }

  addSupplier(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data, { headers: this.getHeaders() });
  }

  updateSupplier(name: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(name)}`;
    return this.http.put(url, data, { headers: this.getHeaders() });
  }
  

  deleteSupplier(name: string): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(name)}`;
    return this.http.delete(url, { headers: this.getHeaders() });
  }
}
