import { TestBed } from '@angular/core/testing';
import { RoleService, PermissionService } from './rol-and-permision.service';
import { Role, Permission } from '../models/rolAndPermision.model';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar todos los roles con getAllRols', () => {
    const permissions: Permission[] = [
      { id: 1, name: 'Permission 1' },
      { id: 2, name: 'Permission 2', description: 'Some description' }
    ];
    const roles: Role[] = [
      { id: 1, name: 'Role 1', permissions },
      { id: 2, name: 'Role 2', permissions: [] }
    ];
    roles.forEach(role => service.addRol(role));
    expect(service.getAllRols()).toEqual(roles);
  });

  it('debería retornar el rol correcto con getRolById', () => {
    const role: Role = { id: 1, name: 'Role 1', permissions: [] };
    service.addRol(role);
    expect(service.getRolById(1)).toEqual(role);
  });

  it('debería añadir un nuevo rol con addRol', () => {
    const newRole: Role = { id: 3, name: 'Role 3', permissions: [] };
    service.addRol(newRole);
    expect(service.getAllRols()).toContain(newRole);
  });

  it('debería actualizar un rol existente con updateRol', () => {
    const role: Role = { id: 1, name: 'Role 1', permissions: [] };
    service.addRol(role);
    const updatedRole: Role = { ...role, name: 'Updated Role 1' };
    service.updateRol(updatedRole);
    expect(service.getRolById(1)?.name).toBe('Updated Role 1');
  });

  it('debería eliminar un rol con deleteRol', () => {
    const role: Role = { id: 1, name: 'Role 1', permissions: [] };
    service.addRol(role);
    service.deleteRol(1);
    expect(service.getRolById(1)).toBeUndefined();
  });
});


describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar todos los permisos con getAllPermissions', () => {
    const permissions: Permission[] = [
      { id: 1, name: 'Permission 1' },
      { id: 2, name: 'Permission 2', description: 'Some description' }
    ];
    permissions.forEach(permission => service.addPermission(permission));
    expect(service.getAllPermissions()).toEqual(permissions);
  });

  it('debería retornar el permiso correcto con getPermissionById', () => {
    const permission: Permission = { id: 1, name: 'Permission 1' };
    service.addPermission(permission);
    expect(service.getPermissionById(1)).toEqual(permission);
  });

  it('debería añadir un nuevo permiso con addPermission', () => {
    const newPermission: Permission = { id: 3, name: 'Permission 3', description: 'Description for permission 3' };
    service.addPermission(newPermission);
    expect(service.getAllPermissions()).toContain(newPermission);
  });

  it('debería actualizar un permiso existente con updatePermission', () => {
    const permission: Permission = { id: 1, name: 'Permission 1' };
    service.addPermission(permission);
    const updatedPermission: Permission = { ...permission, name: 'Updated Permission 1' };
    service.updatePermission(updatedPermission);
    expect(service.getPermissionById(1)?.name).toBe('Updated Permission 1');
  });

  it('debería eliminar un permiso con deleteRol', () => {
    const permission: Permission = { id: 1, name: 'Permission 1' };
    service.addPermission(permission);
    service.deleteRol(1);
    expect(service.getPermissionById(1)).toBeUndefined();
  });
});