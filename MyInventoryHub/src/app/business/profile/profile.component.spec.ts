import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

// Mock AuthService
class MockAuthService {
  getToken = () => 'mock-token';
  getUserDetails = () => ({
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
  });
  updateUserProfile = (token: string, data: any) => of({});
}

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule], // Import standalone component
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería cargar el token al inicializar', () => {
    spyOn(authService, 'getToken').and.returnValue('mock-token');
    component.loadToken();
    expect(component.token).toBe('mock-token');
  });

  it('debería mostrar error si no hay token al cargar', () => {
    spyOn(authService, 'getToken').and.returnValue(null);
    spyOn(console, 'error');
    component.loadToken();
    expect(console.error).toHaveBeenCalledWith('No se encontró el token. Por favor, inicia sesión.');
  });

  it('debería mostrar error si la actualización falla', () => {
    spyOn(authService, 'updateUserProfile').and.returnValue(
      throwError(() => new Error('Error'))
    );
    spyOn(console, 'error');

    component.profileForm.setValue({
      firstName: 'John',
      lastName: 'Smith',
      username: 'johndoe',
      email: 'john.doe@example.com',
    });
    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error al actualizar el perfil', jasmine.any(Error));
  });

  it('debería redirigir al formulario de cambio de contraseña', () => {
    component.onChangePassword();
    expect(router.navigate).toHaveBeenCalledWith(['/password']);
  });
});
