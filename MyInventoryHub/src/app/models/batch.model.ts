export interface Batch {
  id: number;
  productId: number;
  batchNumber: string;
  quantity: number;
  expirationDate: Date;
  receivedDate: Date;
  showDetails?: boolean; // Campo adicional para mostrar/ocultar detalles
}
