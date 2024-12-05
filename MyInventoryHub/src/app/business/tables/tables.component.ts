import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { AuthService } from '../../services/auth/auth.service';
import { PermissionPipe } from '../../components/pipes/permissions.pipe'
import {DialogModule} from 'primeng/dialog'
import {ButtonModule} from 'primeng/button'
@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, FormsModule, PermissionPipe, DialogModule, ButtonModule],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export default class TablesComponent implements OnInit {
  warehouses: any[] = [];
  employees: any[] = [];
  selectedWarehouseId: string | null = null;
  warehouseForm: FormGroup;
  warehouseUpdateForm: FormGroup;
  employeeForm: FormGroup;
  token: string | null = null; // Cambia el valor inicial a `null`
  isFormOpen: boolean = false;
  constructor(
    private warehouseService: WarehouseService,
    private authService: AuthService, // Inyecta el AuthService
    private fb: FormBuilder
  ) {
    this.warehouseForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
    });

    this.warehouseUpdateForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
    });


    this.employeeForm = this.fb.group({
      employeeId: ['', Validators.required],
      permissions: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadToken(); // Obtén el token al inicializar
    this.loadWarehouses();
  }

  // Método para obtener el token
  loadToken(): void {
    this.token = this.authService.getToken(); // Usa el método del AuthService
    if (!this.token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
      // Opcional: Redirige al login si el token no existe
    }
  }

  // Cargar todos los almacenes del usuario
  loadWarehouses(): void {
    if (!this.token) {
      console.error('No se puede cargar almacenes sin token.');
      return;
    }

    this.warehouseService.getUserWarehouses(this.token).subscribe(
      (data) => {
        this.warehouses = data;
      },
      (error) => {
        console.error('Error fetching warehouses:', error);
      }
    );
  }
  
  loadEmployees(): void {
    if (!this.token) {
      console.error('No se puede cargar almacenes sin token.');
      return;
    }
    this.warehouseService.getWarehouseEmployees(this.token, this.selectedWarehouseId!).subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error cargando empleados.', error);
      }
    );
  }

  // Crear un nuevo almacén
  createWarehouse(): void {
    if (!this.token) {
      console.error('No se puede crear un almacén sin token.');
      return;
    }

    if (this.warehouseForm.valid) {
      this.warehouseService.createWarehouse(this.token, this.warehouseForm.value).subscribe(
        (response) => {
          console.log('Warehouse created:', response);
          this.loadWarehouses(); // Recargar la lista de almacenes
          this.warehouseForm.reset();
        },
        (error) => {
          console.error('Error creating warehouse:', error);
        }
      );
    }
  }

  // Ver empleados de un almacén
  viewEmployees(warehouseId: string): void {
    if (!this.token) {
      console.error('No se puede ver empleados sin token.');
      return;
    }

    this.selectedWarehouseId = warehouseId;
    this.warehouseService.getWarehouseEmployees(this.token, warehouseId).subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  // Asignar un empleado a un almacén
  assignEmployee(): void {
    if (!this.token || !this.selectedWarehouseId) {
      console.error('No se puede asignar empleado sin token o almacén seleccionado.');
      return;
    }

    if (this.employeeForm.valid) {
      const data = {
        username: this.employeeForm.value.userName,
        permissions: this.employeeForm.value.permissions.split(','),
      };
      console.log('GEGE: ', this.selectedWarehouseId)
      this.warehouseService.assignEmployee(this.token, this.selectedWarehouseId, data).subscribe(
        (response) => {
          console.log('Employee assigned:', response);
          this.viewEmployees(this.selectedWarehouseId!);
          this.employeeForm.reset();
        },
        (error) => {
          console.error('Error assigning employee:', error);
        }
      );
    }
  }

  assignEmployeeDirectly(warehouseId: string): void {
    if (!this.token) {
      console.error('No se puede asignar empleado sin token.');
      return;
    }
    console.log('WAREHOUSE', warehouseId)
    const userName = prompt('Introduce el username del empleado:');
    const permissions = prompt(
      'Introduce los permisos separados por comas (ADD, EDIT, DELETE):'
    );

    if (userName && permissions) {
      const data = {
        username: userName,
        permissions: permissions.split(','),
      };

      this.warehouseService.assignEmployee(this.token, warehouseId, data).subscribe(
        (response) => {
          console.log('Empleado asignado:', response);
          this.viewEmployees(warehouseId); // Actualiza la lista de empleados
        },
        (error) => {
          console.error('Error al asignar empleado:', error);
        }
      );
    }
  }

  // Eliminar almacén
  deleteWarehouse(warehouseId: string): void {
    if (!this.token) {
      console.error('No se puede eliminar un almacén sin token.');
      return;
    }
    if(confirm('¿Estás seguro de eliminar este almacén?')){
      this.warehouseService.deleteWarehouse(this.token, warehouseId).subscribe(
        (response) => {
          console.log('Almacén elimnado: ', response);
          this.loadWarehouses();
        },
        (error) => {
          console.error('Error al eliminar el almacén', error)
        }
      );
    }
  }
  //elimina empleado del almacen
  deleteEmployeeFromWarehouse(warehouseId: any, employeeId: string): void {
    if (!this.token) {
      console.error('No se puede eliminar un almacén sin token.');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este empleado del almacén?')) {
      this.warehouseService.removeEmployee(this.token, warehouseId, employeeId).subscribe(
        (response) => {
          console.log('Empleado eliminado.', response)
          this.loadEmployees();
        },
        (error) => {
          console.error('Error al eliminar al empleado', error)
        }
      );
    }
  }
  //actualizar almacen
  updateWarehouse(): void {
    if (!this.token) {
      console.error('No se puede eliminar un almacén sin token.');
      return;
    }
    if(this.warehouseUpdateForm.valid) { //para obtener los valores del form
      const data = {
        name: this.warehouseUpdateForm.value.name,
        location: this.warehouseUpdateForm.value.location,
      };

      this.warehouseService.updateWarehouse(this.token, this.selectedWarehouseId!, data).subscribe(
        (response) => {
          console.log('Almacen actualizado:', response);
          this.loadWarehouses();
        },
        (error) => {
          console.error('Error al actualizar almacén.', error);
        },
        ()=>{this.isFormOpen = false
          this.warehouseUpdateForm.reset()
        }
        
      );
    } else {
      console.log('Formulario no válido');
      this.isFormOpen = false
    }
    
  }
  //abrir formulario
  openForm(warehouseId: any): void {
    this.selectedWarehouseId = warehouseId;
    this.isFormOpen = true;
  }
}

