import { Injectable } from '@angular/core';
import { ProductService } from '../../services/product-service/product.service';
import { WarehouseService } from '../../services/warehouse-service/warehouse.service';
import { AuthService } from '../../services/auth/auth.service';

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
  token: string | null = null;
  warehouses: any[] = [];
  products: any[] = [];
  warehouseStats: WarehouseStats = {
    totalStock: 0,
    totalInvested: 0,
    totalEarned: 0,
  };
  productStats: { [key: string]: ProductStats } = {}; // Tipo para indexar por producto

  constructor(
    private warehouseService: WarehouseService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

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

  calculateMonthlyEarnings(products: any[]): { [month: string]: number } {
    const earningsByMonth: { [month: string]: number } = {};

    products.forEach((product) => {
      const stats = this.productStats[product._id];
      const productEarnings = stats.earned;

      const soldMonth = new Date(product.spoil).getMonth(); // Esto obtiene el mes de la fecha de venta (0 = enero, 11 = diciembre)

      // Sumar las ganancias a la fecha correspondiente del mes
      if (earningsByMonth[soldMonth]) {
        earningsByMonth[soldMonth] += productEarnings;
      } else {
        earningsByMonth[soldMonth] = productEarnings;
      }
    });

    // Asegurar que todos los meses (0 a 11) estén presentes en los datos (si no se vendieron productos en un mes, se pone 0)
    for (let i = 0; i < 12; i++) {
      if (!earningsByMonth[i]) {
        earningsByMonth[i] = 0;
      }
    }

    return earningsByMonth;
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
}
