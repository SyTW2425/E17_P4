import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';  // Importa Router para redirección
import { AuthService } from '../../services/auth/auth.service'; // Importa el servicio de autenticación

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent {
  usernameOrEmail: string = ''; // Campo para nombre de usuario o correo electrónico
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signIn() {
    // Validación de campos obligatorios
    if (!this.usernameOrEmail || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios.';
      return;
    }

    // Enviar credenciales al servicio de autenticación
    this.authService.login(this.usernameOrEmail, this.password).subscribe({
      next: (response) => {
        // Guardar el token recibido en el localStorage
        this.authService.saveToken(response.token);

        // Redirigir a la página principal (o al dashboard)
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en el inicio de sesión:', error);
        this.errorMessage = error.error?.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
      },
    });
  }
}