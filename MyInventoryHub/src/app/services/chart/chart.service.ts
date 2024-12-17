import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.508) % 360; // Generación de colores únicos basados en el índice
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  }

  generateProductChart(warehouseStats: any): void {
    const ctx = document.getElementById('productChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Stock', 'Total Investment', 'Total Earned'],
        datasets: [
          {
            label: 'Product Statistics',
            data: [
              warehouseStats.totalStock,
              warehouseStats.totalInvested,
              warehouseStats.totalEarned,
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

  generateProductCharts(products: any, productStats: any): void {
    products.forEach((product: any) => {
      const stats = productStats[product._id];
      const total = stats.invested + stats.earned;

      console.log(products);

      product.chartData = {
        labels: ['Stock', 'Invertido', 'Ganado', 'Total'],
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
            display: false,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Categorías',
            },
            stacked: true,
            barPercentage: 0.9,
            categoryPercentage: 1.0,
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
  }

  generateProductChartData(
    products: any,
    productStats: any,
    data: any,
    options: any
  ): void {
    const productNames = products.map((product: any) => product.name);
    const productEarnings = products.map(
      (product: any) => productStats[product._id].earned
    );

    data = {
      labels: productNames,
      datasets: [
        {
          data: productEarnings,
          backgroundColor: this.generateColors(productNames.length), // Genera colores dinámicos
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  }

  generateStockChart(products: any, stockData: any, stockOptions: any): void {
    // Preparar los datos para la gráfica de stock de productos
    const labels = products.map((product: any) => product.name); // Etiquetas con los nombres de los productos
    const stockValues = products.map((product: any) => product.stock); // Cantidades de stock de cada producto

    // Asignar los datos y opciones para el gráfico
    stockData = {
      labels: labels,
      datasets: [
        {
          label: 'Stock de Productos',
          data: stockValues,
          backgroundColor: this.generateColors(labels.length), // Genera colores dinámicos
          borderColor: '#1e88e5', // Color del borde de las barras
          borderWidth: 1,
        },
      ],
    };

    // Opciones para la gráfica
    stockOptions = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Productos',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Cantidad de Stock',
          },
          beginAtZero: true, // Asegurarse de que el eje Y comience desde cero
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  }

  generateWarehouseChartPrimeNG(
    data: any,
    warehouseStats: any,
    options: any
  ): void {
    data = {
      labels: ['Total Stock', 'Total Invested', 'Total Earned'],
      datasets: [
        {
          data: [
            warehouseStats.totalStock,
            warehouseStats.totalInvested,
            warehouseStats.totalEarned,
          ],
          backgroundColor: ['#f44336', '#ffeb3b', '#4caf50'],
        },
      ],
    };

    options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
    console.log(data);
  }

  generateMonthlyEarningsChart(
    monthlyEarnings: any,
    monthlyEarningsData: any,
    monthlyEarningsOptions: any
  ): void {
    // Calcular las ganancias mensuales
    // const monthlyEarnings = this.calculateMonthlyEarnings(this.products);



    // Organizar los datos para el gráfico
    const months = Object.keys(monthlyEarnings);
    const earnings = months.map((month) => monthlyEarnings[month]);

    monthlyEarningsData = {
      labels: months, // Meses y años (ej: "1-2024", "2-2024")
      datasets: [
        {
          label: 'Ganancias Mensuales',
          data: earnings,
          backgroundColor: '#42a5f5', // Puedes elegir otro color
        },
      ],
    };

    // Configuración para el gráfico (Barras horizontales)
    monthlyEarningsOptions = {
      responsive: true,
      indexAxis: 'y', // Esto cambia las barras a horizontales
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Ganancias',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Meses',
          },
        },
      },
      plugins: {
        legend: {
          position: 'top',
        },
      },
    };
  }

  prepareMonthlyEarningsData(monthlyEarnings: any, monthlyEarningsData: any, monthlyEarningsOptions: any  ): void {
    // const monthlyEarnings = this.calculateMonthlyEarnings(this.products);
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const earnings = months.map((month, index) => monthlyEarnings[index]);

    monthlyEarningsData = {
      labels: months,
      datasets: [
        {
          data: earnings,
          backgroundColor: '#66bb6a', // Color de las barras
        },
      ],
    };

    monthlyEarningsOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Meses',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Ganancias',
          },
        },
      },
    };
  }
}
