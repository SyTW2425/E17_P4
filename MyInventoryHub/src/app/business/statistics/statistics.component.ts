import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { ProductService } from '../../services/product-service/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { Chart } from 'chart.js';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  token: string | null = null;
  warehouses: any[] = [];
  selectedWarehouseId: string | null = null;
  selectedWarehouse: any;
  products: any[] = [];
  warehouseStats: any = {};
  productStats: any = {};
  isOwner: boolean = false;
  
  constructor(
    private warehouseService: WarehouseService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadToken();  // Obtener el token al inicializar
    this.loadWarehouses();  // Cargar almacenes
    this.isOwner = this.authService.isOwner();
  }

  // Método para obtener el token
  loadToken(): void {
    this.token = this.authService.getToken();
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

  // Método para cargar estadísticas de productos del almacén seleccionado
  loadProductStats(): void {
    if (!this.token || !this.selectedWarehouseId) {
      console.error('No se puede cargar estadísticas de productos sin token o almacén seleccionado.');
      return;
    }

    this.productService.getProducts(this.token, this.selectedWarehouseId).subscribe(
      (response) => {
        this.products = response;
        this.productStats = this.calculateProductStats(this.products);
        this.generateProductChart();
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  // Método para cargar estadísticas del almacén
  loadWarehouseStats(): void {
    if (!this.token || !this.selectedWarehouseId) {
      console.error('No se puede cargar estadísticas del almacén sin token o almacén seleccionado.');
      return;
    }

    // Aquí puedes agregar la lógica para obtener las estadísticas del almacén
    this.warehouseService.getUserWarehouses(this.token).subscribe(
      (data) => {
        this.warehouseStats = data;
        this.generateWarehouseChart(); // Llamar para generar gráfico
      },
      (error) => {
        console.error('Error al cargar estadísticas del almacén:', error);
      }
    );
  }



  // Método para calcular estadísticas de los productos (ejemplo de total de stock)
  calculateProductStats(products: any[]): any {
    const totalStock = products.reduce((total, product) => total + product.stock, 0);
    const averagePrice = products.reduce((total, product) => total + product.price, 0) / products.length;

    return {
      totalStock,
      averagePrice
    };
  }

  // Generar gráfico de estadísticas de productos
  generateProductChart(): void {
    const ctx = document.getElementById('productChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Stock', 'Average Price'],
        datasets: [{
          label: 'Product Statistics',
          data: [this.productStats.totalStock, this.productStats.averagePrice],
          backgroundColor: ['#42a5f5', '#66bb6a']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Generar gráfico de estadísticas del almacén (ejemplo de cantidad de productos por categoría)
  generateWarehouseChart(): void {
    const ctx = document.getElementById('warehouseChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.warehouseStats),
        datasets: [{
          data: Object.values(this.warehouseStats),
          backgroundColor: ['#f44336', '#ffeb3b', '#4caf50']
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  // Seleccionar almacén y cargar estadísticas
  onWarehouseSelect(warehouseId: string): void {
    this.selectedWarehouseId = warehouseId;
    this.loadWarehouseStats();
    this.loadProductStats();
  }

  onWarehouseChange(event: any) {
    console.log('Almacén seleccionado:', this.selectedWarehouse);
    // Aquí puedes cargar estadísticas o realizar otras acciones
  }
}
