import { Injectable } from '@angular/core';
import { LowStockAlert } from '../models/lowStockAlert.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class LowStockAlertService {
  private lowStockAlerts: LowStockAlert[] = []; 

  getAllLowStockAlerts(): LowStockAlert[] {
    return this.lowStockAlerts;
  }

  getLowStockAlertById(id: number): LowStockAlert | undefined {
    return this.lowStockAlerts.find(lowStockAlert => lowStockAlert.id === id);
  }

  addLowStockAlert(newLowStockAlert: LowStockAlert): void {
    this.lowStockAlerts.push(newLowStockAlert);
  }

  updateLowStockAlert(updatedLowStockAlert: LowStockAlert): void {
    const index = this.lowStockAlerts.findIndex(lowStockAlert => lowStockAlert.id === updatedLowStockAlert.id);
    if (index !== -1) {
      this.lowStockAlerts[index] = updatedLowStockAlert;
    }
  }

  deleteLowStockAlert(id: number): void {
    this.lowStockAlerts = this.lowStockAlerts.filter(lowStockAlert => lowStockAlert.id !== id);
  }
}
