import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  token: string | null = null; 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.loadToken(); // Obtiene el token al inicializar
    this.loadUserProfile();
  }

  // Método para obtener el token
  loadToken(): void {
    this.token = this.authService.getToken(); // Usa el método del AuthService
    if (!this.token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
    }
  }

  loadUserProfile(): void {
    const user = this.authService.getUserDetails(); // Asume que el servicio tiene un método para obtener detalles del usuario
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.token) {
      this.authService.updateUserProfile(this.token, this.profileForm.value).subscribe(
        () => alert('Perfil actualizado con éxito'),
        (error) => console.error('Error al actualizar el perfil', error)
      );
    } else {
      console.error('Token no válido. No se puede actualizar el perfil.');
    }
  }

  onChangePassword(): void {
    this.router.navigate(['/password']); // Redirecciona a una futura página de cambio de contraseña
  }
}
