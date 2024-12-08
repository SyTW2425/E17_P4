import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { ProductService } from '../../services/product-service/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { PermissionPipe } from '../../components/pipes/permissions.pipe'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'

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
  products: any[] = [];
  selectedWarehouseId: string | null = null;
  selectedEmployeeId: string | null = null;
  selectedProductId: string | null = null;
  warehouseForm: FormGroup;
  warehouseUpdateForm: FormGroup;
  employeeUpdateForm: FormGroup;
  productForm: FormGroup;
  productUpdateForm: FormGroup;
  employeeForm: FormGroup;
  token: string | null = null; 
  isFormOpen: boolean = false;
  isUpdateEmployeeFormOpen: boolean = false;
  isProductFormOpen: boolean = false;
  isEmployeesViewOpen: boolean = false;
  isProductsViewOpen: boolean = false;
  selectedWarehouseName: string | null = null;
  isProductModalVisible: boolean = false;
  isUpdateProductFormOpen: boolean = false;


  constructor(
    private warehouseService: WarehouseService,
    private authService: AuthService,
    private productService: ProductService,
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

    this.employeeUpdateForm = this.fb.group({
      permissions: ['', [Validators.required]],
    });

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      minimunStock: [null],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      unit: [null],
      spoil: [null],
      supplier: ['', Validators.required],
    });
    this.productUpdateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      minimunStock: [null],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      unit: [null],
      spoil: [null],
      supplier: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadToken(); // Obtiene el token al inicializar
    this.loadWarehouses();
  }

  // Método para obtener el token
  loadToken(): void {
    this.token = this.authService.getToken(); // Usa el método del AuthService
    if (!this.token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
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

  // Cargar productos del almacén seleccionado
  loadProducts(): void {
    if (!this.token) {
      console.error('No se puede cargar productos sin token.');
      return;
    }
    if (this.selectedWarehouseId) {
      this.productService.getProducts(this.token, this.selectedWarehouseId).subscribe(
        (response) => {
          this.products = response;
        },
        (error) => {
          console.error('Error carga de productos:', error);
        }
      );
    }
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
  // Método para cargar productos de un almacén
  viewProducts(warehouseId: string): void {
    if (!this.token) {
      console.error('No se puede mostrar los productos sin un token.');
      return;
    }
    this.isProductsViewOpen = true;
    this.isEmployeesViewOpen = false;
    this.selectedWarehouseId = warehouseId;

    const warehouse = this.warehouses.find(wh => wh._id === warehouseId);
    this.selectedWarehouseName = warehouse ? warehouse.name : 'Almacén no encontrado';
    this.productService.getProducts(this.token, warehouseId).subscribe(
      (data) => {
        console.log('Productos cargados:', data);
        this.products = data;
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  // Ver empleados de un almacén
  viewEmployees(warehouseId: string): void {
    if (!this.token) {
      console.error('No se puede ver empleados sin token.');
      return;
    }

    this.isEmployeesViewOpen = true;
    this.isProductsViewOpen = false;

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
    if (confirm('¿Estás seguro de eliminar este almacén?')) {
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
    if (this.warehouseUpdateForm.valid) { //para obtener los valores del form
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
        () => {
          this.isFormOpen = false
          this.warehouseUpdateForm.reset()
        }

      );
    } else {
      console.log('Formulario no válido');
      this.isFormOpen = false
    }

  }
  updateEmployeePermissions(): void {
    if (!this.token || !this.selectedWarehouseId) {
      console.error('No se puede actualizar permisos sin token o almacén seleccionado.');
      return;
    }
    if (this.employeeUpdateForm.valid && this.selectedWarehouseId && this.token) {
      const permissions = this.employeeUpdateForm.value.permissions.split(',');
      this.warehouseService
        .updateEmployeePermissions(this.token, this.selectedWarehouseId, this.selectedEmployeeId!, permissions)
        .subscribe(
          (response) => {
            console.log('Permisos actualizados:', response);
            this.viewEmployees(this.selectedWarehouseId!);
          },
          (error) => {
            console.error('Error al actualizar permisos:', error);
            this.isUpdateEmployeeFormOpen = false;
          },
          () => {
            this.isUpdateEmployeeFormOpen = false
            this.employeeUpdateForm.reset()
          }
        );
    }
  }
  /// productos

  //crea un producto
  createProduct(): void {
    if (!this.token) {
      console.error('No se puede crear un producto sin token.');
      return;
    }

    if (!this.selectedWarehouseId) {
      console.error('No se puede crear un producto sin seleccionar un almacén.');
      return;
    }

    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        minimunStock: this.productForm.value.minimunStock || 0, // Valor predeterminado
        unit: this.productForm.value.unit || 'N/A', // Valor predeterminado
        spoil: this.productForm.value.spoil || null, // Mantener null si no se define
      };

      this.productService.createProduct(this.token, this.selectedWarehouseId, productData).subscribe(
        (response) => {
          console.log('Producto creado exitosamente:', response);
          this.loadProducts(); // Recargar la lista de productos
          this.productForm.reset(); // Reiniciar formulario
        },
        (error) => {
          console.error('Error al crear el producto:', error);
        }
      );
    }
  }

  //actualizar producto
  updateProduct(): void {
    if (!this.token) {
      console.error('No se puede actualizar un producto sin token.');
      return;
    }

    if (!this.selectedWarehouseId || !this.selectedProductId) {
      console.error('No se puede actualizar un producto sin seleccionar un almacén y un producto.');
      return;
    }

    if (this.productUpdateForm.valid) {
      const data = {
        name: this.productUpdateForm.value.name,
        description: this.productUpdateForm.value.description,
        stock: this.productUpdateForm.value.stock,
        minimunStock: this.productUpdateForm.value.minimunStock || 0, // Valor predeterminado
        category: this.productUpdateForm.value.category,
        price: this.productUpdateForm.value.price,
        unit: this.productUpdateForm.value.unit || 'N/A', // Valor predeterminado
        spoil: this.productUpdateForm.value.spoil || null, // Mantener null si no se define
        supplier: this.productUpdateForm.value.supplier,
      };

      this.productService.updateProduct(this.token, this.selectedWarehouseId, this.selectedProductId, data).subscribe(
        (response) => {
          console.log('Producto actualizado:', response);
          this.loadProducts(); // Recargar la lista de productos
        },
        (error) => {
          console.error('Error al actualizar el producto:', error);
        },
        () => {
          this.isUpdateProductFormOpen = false;
          this.productUpdateForm.reset();
        }
      );
    } else {
      console.log('Formulario de actualización de producto no válido');
      this.isUpdateProductFormOpen = false;
    }
  }

  // Eliminar producto
  deleteProduct(productId: string): void {
    if (!this.token) {
      console.error('No se puede eliminar un producto sin token.');
      return;
    }

    if (!this.selectedWarehouseId) {
      console.error('No se puede eliminar un producto sin seleccionar un almacén.');
      return;
    }

    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(this.token, this.selectedWarehouseId, productId).subscribe(
        (response) => {
          console.log('Producto eliminado:', response);
          this.loadProducts(); // Recargar la lista de productos
        },
        (error) => {
          console.error('Error al eliminar el producto:', error);
        }
      );
    }
  }

  //abrir formulario
  openForm(warehouseId: any): void {
    this.selectedWarehouseId = warehouseId;
    this.isFormOpen = true;
  }

  openUpdateEmployeeForm(employeeId: any): void {
    this.selectedEmployeeId = employeeId;
    this.isUpdateEmployeeFormOpen = true;
  }
  clearProductsView(): void {
    this.products = [];
    this.selectedWarehouseId = null;
  }


  openAddProductModal(warehouseId: string): void {
    this.selectedWarehouseId = warehouseId; // Guardamos el id del almacén
    this.isProductModalVisible = true; // Abrir el modal
  }
  // Método para abrir el formulario de actualización de producto
  openUpdateProductForm(productId: any): void {
    this.selectedProductId = productId;
    this.isUpdateProductFormOpen = true;
  }

}

