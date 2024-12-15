import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137.508) % 360;
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
  }

  prepareMonthlyEarningsChart(monthlyEarnings: { [month: number]: number }): any {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
    ];
    const data = months.map((_, i) => monthlyEarnings[i]);

    return {
      labels: months,
      datasets: [
        {
          data,
          backgroundColor: '#42a5f5',
        },
      ],
    };
  }

  prepareProductChart(products: any[], productStats: any): any {
    const labels = products.map((p) => p.name);
    const data = products.map((p) => productStats[p._id]?.earned || 0);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: this.generateColors(labels.length),
        },
      ],
    };
  }
}
