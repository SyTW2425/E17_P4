import { Component, ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Importa RouterModule


@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css'],
    imports: [CommonModule, FormsModule, RouterModule],
    standalone: true,
    encapsulation: ViewEncapsulation.None
})
export class SignInComponent {
  usernameOrEmail: string = '';  // Campo para nombre de usuario o correo electrónico
  password: string = '';
  phoneNumber: string = '';
  address: string = '';
  errorMessage: string = '';

  signIn() {
    // Validación de campos obligatorios
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    // Comprobar si el valor ingresado es un correo electrónico o un nombre de usuario
    const isEmail = this.isValidEmail(this.usernameOrEmail);
    const isUsername = !isEmail && this.usernameOrEmail.trim() !== '';

    if (!isEmail && !isUsername) {
      this.errorMessage = 'Por favor, ingresa un nombre de usuario o un correo electrónico válido.';
      return;
    }

    // Aquí puedes agregar la lógica para almacenar el nuevo usuario
    // o enviar la información al backend para crear la cuenta
    const user = {
      username: isEmail ? null : this.usernameOrEmail,  // Si es correo, el nombre de usuario es null
      email: isEmail ? this.usernameOrEmail : null,    // Si es nombre de usuario, el correo es null
      password: this.password,
      phoneNumber: this.phoneNumber,
      address: this.address
    };

    console.log('Usuario registrado:', user);

    // Limpiar el formulario después de un registro exitoso
    this.usernameOrEmail = '';
    this.password = '';
    this.phoneNumber = '';
    this.address = '';
    this.errorMessage = '';
  }

  // Método para verificar si el campo ingresado es un correo electrónico
  isValidEmail(value: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(value);
  }
}