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
    this.loadUserProfile();
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
    if (this.profileForm.valid) {
      this.authService.updateUserProfile(this.profileForm.value).subscribe(
        () => alert('Perfil actualizado con éxito'),
        (error) => console.error('Error al actualizar el perfil', error)
      );
    }
  }

  onChangePassword(): void {
    this.router.navigate(['/change-password']); // Redirecciona a una futura página de cambio de contraseña
  }
}
