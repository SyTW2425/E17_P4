import { Injectable } from '@angular/core';
import { InventoryTransaction} from '../models/inventoryTransaction.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class InventoryTransactionService {
  private transactions: InventoryTransaction[] = []; // Arreglo de transacciones simulado

  // Obtener todas las transacciones
  getAllTransactions(): InventoryTransaction[] {
    return this.transactions;
  }

  // Obtener una transacción por ID
  getTransactionById(id: number): InventoryTransaction | undefined {
    return this.transactions.find(transaction => transaction.id === id);
  }

  // Añadir una nueva transacción
  addTransaction(newTransaction: InventoryTransaction): void {
    this.transactions.push(newTransaction);
  }

  // Actualizar una transacción existente
  updateTransaction(updatedTransaction: InventoryTransaction): void {
    const index = this.transactions.findIndex(transaction => transaction.id === updatedTransaction.id);
    if (index !== -1) {
      this.transactions[index] = updatedTransaction;
    }
  }

  // Eliminar una transacción
  deleteTransaction(id: number): void {
    this.transactions = this.transactions.filter(transaction => transaction.id !== id);
  }
}