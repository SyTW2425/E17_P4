import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordComponent } from './password.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

// Mock AuthService
class MockAuthService {
  getToken = () => 'mock-token';
  updateUserPassword = (token: string, currentPassword: string, newPassword: string) => of({});
  logout = () => {};
}

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordComponent, ReactiveFormsModule, HttpClientTestingModule, CommonModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el token al inicializar', () => {
    spyOn(authService, 'getToken').and.returnValue('mock-token');
    component.loadToken();
    expect(component.token).toBe('mock-token');
  });

  it('debería mostrar error si no se encuentra el token', () => {
    spyOn(authService, 'getToken').and.returnValue(null);
    spyOn(console, 'error');
    component.loadToken();
    expect(console.error).toHaveBeenCalledWith('No se encontró el token. Por favor, inicia sesión.');
  });

  it('debería validar que las contraseñas coincidan', () => {
    component.passwordForm.setValue({
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
      confirmPassword: 'differentPassword',
    });
    expect(component.passwordForm.errors).toBeTruthy();
    expect(component.passwordForm.errors?.['mismatch']).toBeTruthy();
  });

  it('debería actualizar la contraseña correctamente', () => {
    spyOn(authService, 'updateUserPassword').and.returnValue(of({}));
    spyOn(authService, 'logout');

    component.passwordForm.setValue({
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
      confirmPassword: 'newPassword',
    });
    component.onSubmit();

    expect(authService.updateUserPassword).toHaveBeenCalledWith(
      'mock-token',
      'oldPassword',
      'newPassword'
    );
    expect(authService.logout).toHaveBeenCalled();
  });

  it('debería manejar error si la contraseña actual es incorrecta', () => {
    spyOn(authService, 'updateUserPassword').and.returnValue(
      throwError(() => ({ status: 400 }))
    );
    spyOn(window, 'alert');

    component.passwordForm.setValue({
      currentPassword: 'wrongPassword',
      newPassword: 'newPassword',
      confirmPassword: 'newPassword',
    });
    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('La contraseña actual es incorrecta');
  });

  it('debería manejar error general al actualizar la contraseña', () => {
    spyOn(authService, 'updateUserPassword').and.returnValue(
      throwError(() => ({ status: 500 }))
    );
    spyOn(window, 'alert');

    component.passwordForm.setValue({
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
      confirmPassword: 'newPassword',
    });
    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Error al actualizar la contraseña');
  });
});
