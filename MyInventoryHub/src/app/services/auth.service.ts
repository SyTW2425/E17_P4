import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUsers = [
    { email: 'user@example.com', password: 'password123' },
    { email: 'admin@example.com', password: 'admin123' }
  ];

  private loggedIn = false;

  login(email: string, password: string): boolean {
    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    this.loggedIn = !!user;
    return this.loggedIn;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout(): void {
    this.loggedIn = false;
  }
}
