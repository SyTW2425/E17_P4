import { Injectable } from '@angular/core';
import { Role } from '../models/rolAndPermision.model';
import { Permission } from '../models/rolAndPermision.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private products: Role[] = []; 

  getAllRols(): Role[] {
    return this.products;
  }

  getRolById(id: number): Role | undefined {
    return this.products.find(product => product.id === id);
  }

  addRol(newRol: Role): void {
    this.products.push(newRol);
  }

  updateRol(updatedRol: Role): void {
    const index = this.products.findIndex(product => product.id === updatedRol.id);
    if (index !== -1) {
      this.products[index] = updatedRol;
    }
  }

  deleteRol(id: number): void {
    this.products = this.products.filter(product => product.id !== id);
  }
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private products: Permission[] = []; 

  getAllPermissions(): Permission[] {
    return this.products;
  }

  getPermissionById(id: number): Permission | undefined {
    return this.products.find(product => product.id === id);
  }

  addPermission(newPermission: Permission): void {
    this.products.push(newPermission);
  }

  updatePermission(updatedPermission: Permission): void {
    const index = this.products.findIndex(product => product.id === updatedPermission.id);
    if (index !== -1) {
      this.products[index] = updatedPermission;
    }
  }

  deleteRol(id: number): void {
    this.products = this.products.filter(product => product.id !== id);
  }
}
