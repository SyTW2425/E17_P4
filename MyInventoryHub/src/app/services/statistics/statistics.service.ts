import { Injectable } from '@angular/core';

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

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  calculateWarehouseStats(products: any[]): WarehouseStats {
    let totalStock = 0;
    let totalInvested = 0;
    let totalEarned = 0;

    products.forEach((product) => {
      const price = product.price || 0;
      const stock = product.stock || 0;

      if (price > 0 && stock > 0) {
        totalStock += stock;
        totalInvested += price * stock;
        totalEarned += price * stock * 0.2; // Ganancia total del 20% sobre la inversión
      }
    });

    return { totalStock, totalInvested, totalEarned };
  }

  calculateProductStats(products: any[]): { [key: string]: ProductStats } {
    const productStats: { [key: string]: ProductStats } = {};

    products.forEach((product) => {
      const price = product.price || 0;
      const stock = product.stock || 0;

      if (price > 0 && stock > 0) {
        const profitMargin = 0.2; 
        const invested = price * stock; 
        const earned = invested * profitMargin; 
        const id = product._id || product.id || `product_${Math.random()}`;

        productStats[id] = { stock, invested, earned };
      }
    });

    return productStats;
  }

  calculateMonthlyEarnings(products: any[]): { [month: number]: number } {
    const earningsByMonth: { [month: number]: number } = {};

    products.forEach((product) => {
      const earnings = product.price * product.stock * 0.2;
      const month = new Date(product.spoil).getMonth();

      earningsByMonth[month] = (earningsByMonth[month] || 0) + earnings;
    });

    for (let i = 0; i < 12; i++) {
      if (!earningsByMonth[i]) earningsByMonth[i] = 0;
    }

    return earningsByMonth;
  }
}
