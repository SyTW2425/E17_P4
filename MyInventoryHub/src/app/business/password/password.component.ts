import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  passwordForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  token: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
    this.loadToken(); 
  }

  loadToken(): void {
    this.token = this.authService.getToken() as string;
    if (!this.token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
    }
  }

  // Validador personalizado para confirmar que las nuevas contraseñas coinciden
  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  // Acceso rápido a los controles del formulario
  get f() {
    return this.passwordForm.controls;
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      return;
    }
  
    this.authService.updateUserPassword(this.token, this.f['currentPassword'].value, this.f['newPassword'].value).subscribe(
      () => {
        alert('Perfil actualizado con éxito');
        this.passwordForm.reset();
        this.authService.logout();
      },
      (error) => {
        if (error.status === 400) {
          alert('La contraseña actual es incorrecta');
        } else {
          alert('Error al actualizar la contraseña');
        }
      }
    );
  }
}