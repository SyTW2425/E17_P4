import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private apiUrl = 'http://localhost:3000/alerts'; // Endpoint para alertas

  constructor(private http: HttpClient) {}

  // Obtener alertas
  getAlerts(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(this.apiUrl, { headers });
  }
}