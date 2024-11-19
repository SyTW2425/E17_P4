export interface LowStockAlert {
    id: number;
    productId: number;
    warehouseId: number;
    threshold: number; // cantidad mínima para activar la alerta
    createdDate: Date;
    status: 'PENDING' | 'RESOLVED';
  }
  