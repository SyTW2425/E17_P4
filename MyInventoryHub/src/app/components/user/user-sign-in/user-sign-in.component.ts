import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './user-sign-in.component.html',
  styleUrls: ['./user-sign-in.component.css']
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const success = this.authService.login(this.email, this.password);
    if (success) {
      this.router.navigate(['/dashboard']); // Simula la redirección
    } else {
      this.errorMessage = 'Correo electrónico o contraseña incorrectos';
    }
  }
}
