import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service'; 
import { catchError, EMPTY, tap } from 'rxjs';

interface RegisterResponse {
  message: string;
  user?: any;  
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    RouterModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {
  form: FormGroup;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;

    const userData = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password,
      role: this.form.value.role
    };

    this.authService.registerUser(userData).pipe(
      tap((response) => {
        // Maneja el éxito
        this.loading = false;
        alert('¡Usuario registrado exitosamente!');
        console.log('Usuario registrado', response);
      }),
      catchError((error) => {
        // Maneja el error
        this.loading = false;
        alert('Error al registrar el usuario');
        console.error('Error al registrar usuario', error);
        return EMPTY; // Devuelve un observable vacío para no interrumpir el flujo
      })
    ).subscribe(); // La suscripción es necesaria para que el Observable se ejecute
  }
}

