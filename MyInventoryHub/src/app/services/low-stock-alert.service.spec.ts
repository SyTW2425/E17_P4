import { TestBed } from '@angular/core/testing';
import { LowStockAlertService } from './low-stock-alert.service';
import { LowStockAlert } from '../models/lowStockAlert.model';

describe('LowStockAlertService', () => {
  let service: LowStockAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LowStockAlertService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar todas las alertas con getAllLowStockAlerts', () => {
    const alerts: LowStockAlert[] = [
      { id: 1, productId: 101, warehouseId: 201, threshold: 10, createdDate: new Date('2024-01-01'), status: 'PENDING' },
      { id: 2, productId: 102, warehouseId: 202, threshold: 5, createdDate: new Date('2024-02-15'), status: 'RESOLVED' }
    ];
    alerts.forEach(alert => service.addLowStockAlert(alert));
    expect(service.getAllLowStockAlerts()).toEqual(alerts);
  });

  it('debería retornar la alerta correcta con getLowStockAlertById', () => {
    const alert: LowStockAlert = { id: 1, productId: 101, warehouseId: 201, threshold: 10, createdDate: new Date('2024-01-01'), status: 'PENDING' };
    service.addLowStockAlert(alert);
    expect(service.getLowStockAlertById(1)).toEqual(alert);
  });

  it('debería añadir una nueva alerta con addLowStockAlert', () => {
    const newAlert: LowStockAlert = { id: 3, productId: 103, warehouseId: 203, threshold: 7, createdDate: new Date('2024-03-01'), status: 'PENDING' };
    service.addLowStockAlert(newAlert);
    expect(service.getAllLowStockAlerts()).toContain(newAlert);
  });

  it('debería actualizar una alerta existente con updateLowStockAlert', () => {
    const alert: LowStockAlert = { id: 1, productId: 101, warehouseId: 201, threshold: 10, createdDate: new Date('2024-01-01'), status: 'PENDING' };
    service.addLowStockAlert(alert);
    const updatedAlert: LowStockAlert = { ...alert, status: 'RESOLVED' };
    service.updateLowStockAlert(updatedAlert);
    expect(service.getLowStockAlertById(1)?.status).toBe('RESOLVED');
  });

  it('debería eliminar una alerta con deleteLowStockAlert', () => {
    const alert: LowStockAlert = { id: 1, productId: 101, warehouseId: 201, threshold: 10, createdDate: new Date('2024-01-01'), status: 'PENDING' };
    service.addLowStockAlert(alert);
    service.deleteLowStockAlert(1);
    expect(service.getLowStockAlertById(1)).toBeUndefined();
  });
});
