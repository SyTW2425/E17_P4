import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['registerUser']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,         // Importa el componente standalone
        ReactiveFormsModule,       // Necesario para formularios reactivos
        HttpClientTestingModule,   // Simula el HttpClient
        RouterTestingModule        // Simula el router
      ],
      providers: [
        { provide: AuthService, useValue: authSpy } // Proporciona un mock de AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form successfully when valid', () => {
    authServiceSpy.registerUser.and.returnValue(of({ message: 'Success' }));
    component.form.setValue({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: 'user'
    });

    component.onSubmit();

    expect(authServiceSpy.registerUser).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });
  });

  it('should not submit the form when invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.registerUser).not.toHaveBeenCalled();
  });
});
