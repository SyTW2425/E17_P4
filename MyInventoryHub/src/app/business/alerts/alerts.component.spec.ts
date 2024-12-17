import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsComponent } from './alerts.component';
import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../services/alerts/alert.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

// Mock Services
class MockAuthService {
  getToken = () => 'mock-token';
}

class MockAlertService {
  getAlerts = (token: string) => of([{ id: 1, message: 'Test Alert' }]);
}

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  let authService: AuthService;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsComponent], // Importar el componente standalone
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AlertService, useClass: MockAlertService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    alertService = TestBed.inject(AlertService);
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

  it('debería cargar alertas si hay un token', () => {
    spyOn(alertService, 'getAlerts').and.callThrough();
    component.token = 'mock-token';
    component.loadAlerts();
    expect(alertService.getAlerts).toHaveBeenCalledWith('mock-token');
    expect(component.alerts.length).toBeGreaterThan(0);
  });

  it('debería manejar error al cargar alertas', () => {
    spyOn(alertService, 'getAlerts').and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');
    component.token = 'mock-token';
    component.loadAlerts();
    expect(console.error).toHaveBeenCalledWith('Error al cargar alertas:', jasmine.any(Error));
  });
});
