// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductManagerComponent } from '../product/product-manager/product-manager.component';
// import { Warehouse } from '../../models/warehouse.model';

// @Component({
//   selector: 'app-warehouse-manager',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ProductManagerComponent
//   ], 
//   templateUrl: './warehouse-management.component.html',
//   styleUrls: ['./warehouse-management.component.css'],
// })
// export class WarehouseManagerComponent {
//   showCreateForm: boolean = false; // Controla la visibilidad del formulario
//   warehouses: any[] = [];
//   newWarehouse: any = {};
//   selectedWarehouseId: string = '';

//   constructor(private http: HttpClient) {}

//   toggleCreateForm(): void {
//     this.showCreateForm = !this.showCreateForm;
//   }

//   ngOnInit(): void {
//     this.fetchWarehouses();
//   }

//   createWarehouse(): void {
//     this.http.post('/api/warehouses', this.newWarehouse).subscribe(
//       (response) => {
//         console.log('Almacén creado:', response);
//         this.fetchWarehouses(); // Refresca la lista de almacenes
//         this.newWarehouse = {}; // Limpia el formulario
//         this.showCreateForm = false; // Oculta el formulario tras crear el almacén
//       },
//       (error) => {
//         console.error('Error al crear el almacén:', error);
//       }
//     );
//   }

//   fetchWarehouses(): void {
//     this.http.get('/api/warehouses').subscribe(
//       (data: any) => {
//         this.warehouses = data;
//       },
//       (error) => {
//         console.error('Error al obtener los almacenes:', error);
//       }
//     );
//   }

//   onWarehouseSelect(event: Event): void {
//     const selectedId = (event.target as HTMLSelectElement).value;
//     console.log('Almacén seleccionado:', selectedId);
//   }
// }
