import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api'; // URL de tu backend
  private currentUserToken: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  // Registro de usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Login de usuario
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>('http://localhost:3000/login', { email, password }).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          localStorage.setItem('token', token); // Guarda el token
          console.log('Token almacenado en localStorage');
        }
      }),
      catchError((error) => {
        console.error('Error en el inicio de sesión', error);
        return throwError(() => error);
      })
    );
  }
  /*loginUser(userData: { email: string; password: string }) {
    return this.http.post<{ token: string }>('http://localhost:3000/login', userData);
  }*/


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
    localStorage.removeItem('token');  // Elimina el token de localStorage
    this.router.navigate(['']);  // Redirige al usuario al login
  }

  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('Token decodificado:', decoded); // Inspeccionar contenido
      return decoded;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Obtener detalles del usuario desde el token almacenado
  getUserDetails() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  }

  // Actualizar perfil del usuario
  updateUserProfile(token: string, profileData: any): Observable<any> {
    console.log("token" + token);
    console.log("profileData" + profileData);
    console.log("profileData" + profileData.value);
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.apiUrl}/update-profile`, { user: this.decodeToken()?.id, data: profileData }, { headers } );
  }

  // Método para cambiar la contraseña
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
