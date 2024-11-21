import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SignInComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  address: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  signIn() {
    // Validación de campos obligatorios
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      this.successMessage = '';
      return;
    }

    // Recuperar usuarios almacenados
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Crear un nuevo usuario
    const newUser = {
      id: users.length + 1,
      username: this.username,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber || null,
      address: this.address || null,
      createdAt: new Date(),
    };

    // Guardar el usuario en localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Mostrar mensaje de éxito y limpiar los campos
    this.successMessage = 'Usuario registrado exitosamente.';
    this.errorMessage = '';
    this.username = '';
    this.email = '';
    this.password = '';
    this.phoneNumber = '';
    this.address = '';
  }
}
