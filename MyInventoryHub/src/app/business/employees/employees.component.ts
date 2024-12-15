import { Component, OnInit } from '@angular/core';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ToastModule, TableModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [MessageService],
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  isLoading: boolean = false;
  constructor(
    private warehouseService: WarehouseService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.fetchEmployees(token);
    }
  }

  fetchEmployees(token: string): void {
    this.isLoading = true;
    this.warehouseService.getOwnerWarehouses(token).subscribe({
      next: (warehouses) => {
        const employeeMap = new Map<string, any>();
  
        warehouses.forEach((warehouse: any) => {
          warehouse.employees.forEach((employee: any) => {
            const employeeId = employee.employeeId._id;
            const warehouseName = warehouse.name;
  
            if (employeeMap.has(employeeId)) {
              // Si el empleado ya está en el mapa, añade el almacén a su lista
              employeeMap.get(employeeId).warehouses.push(warehouseName);
            } else {
              // Si el empleado no está en el mapa, añádelo con la información inicial
              employeeMap.set(employeeId, {
                firstName: employee.employeeId.firstName,
                lastName: employee.employeeId.lastName,
                email: employee.employeeId.email,
                permissions: employee.permissions.join(', '),
                warehouses: [warehouseName],
              });
            }
          });
        });
  
        // Convertimos el mapa a una lista de empleados
        this.employees = Array.from(employeeMap.values());
        this.isLoading = false;
      },
      error: (_err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los empleados.',
        });
        this.isLoading = false;
      },
    });
  }
  
  
}
