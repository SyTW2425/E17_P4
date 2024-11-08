export interface InventoryTransaction {
    id: number;
    productId: number;
    transactionType: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    transactionDate: Date;
    warehouseId: number;
    notes?: string;
  }
  