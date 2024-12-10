import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-metrics',
  standalone: true,
  imports: [ChartModule, CommonModule],
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})

export class MetricsComponent implements OnInit {
  role: string = ''; // Rol del usuario (se obtiene desde el backend o servicio)
  salesData: any; // Ventas Totales
  topProductsData: any; // Productos Más Vendidos
  profitData: any; // Beneficio Neto
  criticalStock: any; // Stock Crítico
  stockData: any; // Stock Disponible
  lowStockProducts: any; // Productos Próximos a Agotarse
  activityLog: any; // Historial de Actividad
  highDemandProducts: any; // Productos con Alta Demanda

  ngOnInit() {
    // Simulación: Aquí obtienes el rol desde un servicio o backend
    this.role = 'Empleado'; // Cambiar a 'Empleado' para probar
    
    this.initializeData();
  }

  initializeData() {
    // Datos comunes
    this.salesData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
      datasets: [
        {
          label: 'Ventas Totales',
          data: [1200, 1500, 1800, 2000],
          backgroundColor: '#4F46E5'
        }
      ]
    };

    this.topProductsData = {
      labels: ['Producto A', 'Producto B', 'Producto C'],
      datasets: [
        {
          label: 'Cantidad Vendida',
          data: [300, 450, 150],
          backgroundColor: ['#34D399', '#60A5FA', '#F87171']
        }
      ]
    };

    this.profitData = {
      labels: ['Ingresos', 'Gastos'],
      datasets: [
        {
          data: [5000, 2000],
          backgroundColor: ['#10B981', '#EF4444']
        }
      ]
    };

    this.criticalStock = [
      { name: 'Producto X', stock: 5 },
      { name: 'Producto Y', stock: 3 },
      { name: 'Producto Z', stock: 2 }
    ];

    this.stockData = {
      labels: ['Producto A', 'Producto B', 'Producto C'],
      datasets: [
        {
          label: 'Stock Disponible',
          data: [50, 20, 80],
          backgroundColor: '#3B82F6'
        }
      ]
    };

    this.lowStockProducts = [
      { name: 'Producto X', stock: 5 },
      { name: 'Producto Y', stock: 3 },
      { name: 'Producto Z', stock: 2 }
    ];

    this.activityLog = [
      { date: '2024-04-01', action: 'Reposición de stock', details: 'Producto A' },
      { date: '2024-04-05', action: 'Salida de producto', details: 'Producto B' }
    ];

    this.highDemandProducts = {
      labels: ['Producto A', 'Producto B', 'Producto C'],
      datasets: [
        {
          label: 'Ventas Recientes',
          data: [30, 50, 40],
          backgroundColor: '#F59E0B'
        }
      ]
    };
  }
}
