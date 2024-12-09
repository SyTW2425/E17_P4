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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
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

    const formData = {
      currentPassword: this.f['currentPassword'].value,
      newPassword: this.f['newPassword'].value
    };

    this.http.post('/api/change-password', formData).subscribe({
      next: (response) => {
        this.successMessage = 'Contraseña actualizada exitosamente.';
        this.errorMessage = '';
        this.passwordForm.reset();
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error al actualizar la contraseña.';
        this.successMessage = '';
      }
    });
  }
}