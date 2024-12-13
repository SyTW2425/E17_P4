import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { ProductService } from '../../services/product-service/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { Chart } from 'chart.js';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

import { AfterViewInit } from '@angular/core';

interface ProductStats {
  stock: number;
  invested: number;
  earned: number;
}

interface WarehouseStats {
  totalStock: number;
  totalInvested: number;
  totalEarned: number;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    ChartModule,
    FormsModule,
    NgFor,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  token: string | null = null;
  warehouses: any[] = [];
  selectedWarehouseId: string | null = null;
  selectedWarehouse: any;
  products: any[] = [];
  warehouseStats: WarehouseStats = {
    totalStock: 0,
    totalInvested: 0,
    totalEarned: 0,
  };
  productStats: { [key: string]: ProductStats } = {}; // Tipo para indexar por producto
  isOwner: boolean = false;
  data: any;
  total: any;

  options: any;

  constructor(
    private warehouseService: WarehouseService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isOwner = this.authService.isOwner();
    this.loadToken(); // Obtener el token al inicializar
    this.loadWarehouses(); // Cargar almacenes
  }

  ngAfterViewInit(): void {
    if (this.selectedWarehouseId) {
      this.generateWarehouseChartPrimeNG();
    }
    if (this.products.length > 0) {
      this.generateProductChart();
    }
  }

  loadToken(): void {
    this.token = this.authService.getToken();
    if (!this.token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
    }
  }

  loadWarehouses(): Promise<void> {
    if (!this.token) {
      console.error('No se puede cargar almacenes sin token.');
      return Promise.reject();
    }

    return this.warehouseService
      .getUserWarehouses(this.token)
      .toPromise()
      .then(
        (data) => {
          this.warehouses = data;
        },
        (error) => {
          console.error('Error fetching warehouses:', error);
        }
      );
  }

  loadProductStats(): void {
    if (!this.token || !this.selectedWarehouseId) {
      console.error(
        'No se puede cargar estadísticas sin token o almacén seleccionado.'
      );
      return;
    }

    this.productService
      .getProducts(this.token, this.selectedWarehouseId)
      .subscribe(
        (response) => {
          this.products = response;
          this.productStats = this.calculateProductStats(this.products);
          this.warehouseStats = this.calculateWarehouseStats(this.products);

          // Crear datos para el gráfico principal (dinero generado por producto)
          const productNames = this.products.map((product) => product.name);
          const productEarnings = this.products.map(
            (product) => this.productStats[product._id].earned
          );

          this.data = {
            labels: productNames,
            datasets: [
              {
                data: productEarnings,
                backgroundColor: this.generateColors(productNames.length), // Genera colores dinámicos
              },
            ],
          };

          this.options = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          };

          // Generar datos para cada producto
          // Generar datos para cada producto
          this.products.forEach((product) => {
            const stats = this.productStats[product._id];
            
            // Calcular el total (Invertido + Ganado)
            const total = stats.invested + stats.earned;
          
            product.chartData = {
              labels: ['Stock', 'Invertido', 'Ganado', 'Total'], // Nuevas categorías
              datasets: [
                {
                  label: 'Stock',
                  data: [stats.stock, null, null, null],
                  backgroundColor: '#42a5f5',
                },
                {
                  label: 'Invertido',
                  data: [null, stats.invested, null, null],
                  backgroundColor: '#66bb6a',
                },
                {
                  label: 'Ganado',
                  data: [null, null, stats.earned, null],
                  backgroundColor: '#ff7043',
                },
                {
                  label: 'Total',
                  data: [null, null, null, total],
                  backgroundColor: '#ffeb3b',
                },
              ],
            };
          
            product.chartOptions = {
              responsive: true,
              plugins: {
                legend: {
                  display: false, // Ocultar la leyenda
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Categorías',
                  },
                  // Aquí agregamos el ajuste para centrar las barras
                  ticks: {
                    padding: 10, // Espaciado entre las categorías
                  },
                  grid: {
                    offset: true, // Asegura que las barras no se "pegue" a la línea de la cuadrícula
                  },
                  // Ajustamos el espacio y centramiento de las barras
                  stacked: true,
                  barPercentage: 0.9, // Tamaño de las barras, lo puedes ajustar según tus preferencias
                  categoryPercentage: 1.0, // Esto asegura que las barras se distribuyan uniformemente y se centren
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Valores',
                  },
                },
              },
            };
          });
          
        },
        (error) => {
          console.error('Error al cargar productos:', error);
        }
      );
  }

  calculateMonthlyEarnings(products: any[]): { [key: string]: number } {
    const monthlyEarnings: { [key: string]: number } = {};
  
    products.forEach((product) => {
      const date = new Date(product.date); // Asegúrate de tener un campo 'date' en tu producto
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
  
      const earned = this.productStats[product._id]?.earned || 0;
  
      if (!monthlyEarnings[monthYear]) {
        monthlyEarnings[monthYear] = 0;
      }
      monthlyEarnings[monthYear] += earned; // Sumar las ganancias por mes
    });
  
    return monthlyEarnings;
  }
  

  calculateWarehouseStats(products: any[]): WarehouseStats {
    let totalStock = 0;
    let totalInvested = 0;
    let totalEarned = 0;

    products.forEach((product) => {
      const price = product.price || 0;
      const stock = product.stock || 0;

      // Verificar que el precio y stock son mayores que cero
      if (price > 0 && stock > 0) {
        totalStock += stock;
        totalInvested += price * stock;
        totalEarned += price * stock * 0.2; // Ganancia total del 20% sobre la inversión
      }
    });

    return {
      totalStock,
      totalInvested,
      totalEarned,
    };
  }

  calculateProductStats(products: any[]): { [key: string]: ProductStats } {
    const productStats: { [key: string]: ProductStats } = {};

    products.forEach((product) => {
      const price = product.price || 0; // Asegurarse de que el precio está definido
      const stock = product.stock || 0; // Asegurarse de que el stock está definido

      // Verificar que el precio y el stock sean mayores que 0 antes de hacer cálculos
      if (price > 0 && stock > 0) {
        const profitMargin = 0.2; // Suponiendo un margen de ganancia del 20%
        const invested = price * stock; // Total invertido en este producto
        const earned = invested * profitMargin; // Total ganado basado en la inversión

        const id = product._id || product.id || `product_${Math.random()}`; // Asegurarse de tener una clave única

        productStats[id] = {
          stock: stock,
          invested: invested,
          earned: earned,
        };
      }
    });

    return productStats;
  }

  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.508) % 360; // Generación de colores únicos basados en el índice
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  }

  generateProductChart(): void {
    const ctx = document.getElementById('productChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Stock', 'Total Investment', 'Total Earned'],
        datasets: [
          {
            label: 'Product Statistics',
            data: [
              this.warehouseStats.totalStock,
              this.warehouseStats.totalInvested,
              this.warehouseStats.totalEarned,
            ],
            backgroundColor: ['#42a5f5', '#66bb6a', '#ff7043'],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  generateWarehouseChartPrimeNG(): void {
    this.data = {
      labels: ['Total Stock', 'Total Invested', 'Total Earned'],
      datasets: [
        {
          data: [
            this.warehouseStats.totalStock,
            this.warehouseStats.totalInvested,
            this.warehouseStats.totalEarned,
          ],
          backgroundColor: ['#f44336', '#ffeb3b', '#4caf50'],
        },
      ],
    };

    this.options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  }

  onWarehouseSelect(warehouseId: string, action: string): void {
    this.selectedWarehouseId = warehouseId;
    console.log('ID del almacén seleccionado:', warehouseId);

    if (action === 'stats') {
      this.loadWarehouses()
        .then(() => {
          // Obtener información del almacén seleccionado
          const selectedWarehouse = this.warehouses.find(
            (warehouse) => warehouse._id === warehouseId
          );
          if (selectedWarehouse) {
            console.log('Información del almacén:', selectedWarehouse);
            this.selectedWarehouse = selectedWarehouse;
            this.selectedWarehouseId = selectedWarehouse._id;
          } else {
            console.error('Almacén no encontrado en la lista.');
          }
        })
        .catch((error) => {
          console.error('Error al cargar almacenes:', error);
        });
    } else if (action === 'charts') {
      this.loadWarehouses()
        .then(() => {
          const selectedWarehouse = this.warehouses.find(
            (warehouse) => warehouse._id === warehouseId
          );
          if (selectedWarehouse) {
            console.log('Información del almacén:', selectedWarehouse);
            this.selectedWarehouse = selectedWarehouse;
            this.selectedWarehouseId = selectedWarehouse._id;

            // Cargar estadísticas de productos del almacén seleccionado
            this.loadProductStats();
          } else {
            console.error('Almacén no encontrado en la lista.');
          }
        })
        .catch((error) => {
          console.error('Error al cargar almacenes:', error);
        });
    } else {
      console.error('Acción no válida:', action);
    }
  }

  onWarehouseChange(event: any) {
    console.log('Almacén seleccionado:', this.selectedWarehouse);
  }
}
