import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';  // Usamos throwError desde 'rxjs'
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // URL de tu backend
  private currentUserToken: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  // Registro de usuario
  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Login de usuario
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
     // .pipe(
       // catchError(this.handleError)
      //);
  }

  // Guardar el token en el localStorage
  saveToken(token: string): void {
    this.currentUserToken = token;
    localStorage.setItem('jwtToken', token);
  }

  // Recuperar el token
  getToken(): string | null {
    return this.currentUserToken || localStorage.getItem('jwtToken');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null; // Aquí podrías agregar más validaciones si es necesario
  }

  // Cerrar sesión
  logout(): void {
    this.currentUserToken = null;
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión
  }

  // Manejo de errores
  private handleError(error: any): Observable<any> {
    console.error('Ocurrió un error:', error);
    return throwError(error);  // Usamos throwError para emitir el error
  }
}
