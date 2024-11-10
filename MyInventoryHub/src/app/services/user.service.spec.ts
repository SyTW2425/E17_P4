import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User, Owner, Employee } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar todos los usuarios con getAllUsers', () => {
    const users: User[] = [
      { id: 1, username: 'user1', email: 'user1@example.com', password: 'pass1', createdAt: new Date() },
      { id: 2, username: 'user2', email: 'user2@example.com', password: 'pass2', createdAt: new Date() }
    ];
    users.forEach(user => service.addUser(user));
    expect(service.getAllUsers()).toEqual(users);
  });

  it('debería retornar el usuario correcto con getUserById', () => {
    const user: User = { id: 1, username: 'user1', email: 'user1@example.com', password: 'pass1', createdAt: new Date() };
    service.addUser(user);
    expect(service.getUserById(1)).toEqual(user);
  });

  it('debería añadir un nuevo usuario con addUser', () => {
    const newUser: User = { id: 3, username: 'user3', email: 'user3@example.com', password: 'pass3', createdAt: new Date() };
    service.addUser(newUser);
    expect(service.getAllUsers()).toContain(newUser);
  });

  it('debería actualizar un usuario existente con updateUser', () => {
    const user: User = { id: 1, username: 'user1', email: 'user1@example.com', password: 'pass1', createdAt: new Date() };
    service.addUser(user);
    const updatedUser: User = { ...user, email: 'updateduser@example.com' };
    service.updateUser(updatedUser);
    expect(service.getUserById(1)?.email).toBe('updateduser@example.com');
  });

  it('debería eliminar un usuario con deleteUser', () => {
    const user: User = { id: 1, username: 'user1', email: 'user1@example.com', password: 'pass1', createdAt: new Date() };
    service.addUser(user);
    service.deleteUser(1);
    expect(service.getUserById(1)).toBeUndefined();
  });

  // Pruebas específicas para Owner
  it('debería añadir un Owner con addUser', () => {
    const owner: Owner = { 
      id: 4, 
      username: 'owner1', 
      email: 'owner1@example.com', 
      password: 'pass4', 
      createdAt: new Date(),
      storeName: 'Store A', 
      storeLocation: 'Location A'
    };
    service.addUser(owner);
    expect(service.getAllUsers()).toContain(owner);
  });

  it('debería actualizar un Owner existente con updateUser', () => {
    const owner: Owner = { 
      id: 4, 
      username: 'owner1', 
      email: 'owner1@example.com', 
      password: 'pass4', 
      createdAt: new Date(),
      storeName: 'Store A', 
      storeLocation: 'Location A'
    };
    service.addUser(owner);
    const updatedOwner: Owner = { ...owner, storeLocation: 'New Location A' };
    service.updateUser(updatedOwner);
    expect((service.getUserById(4) as Owner)?.storeLocation).toBe('New Location A');
  });

  // Pruebas específicas para Employee
  it('debería añadir un Employee con addUser', () => {
    const employee: Employee = { 
      id: 5, 
      username: 'employee1', 
      email: 'employee1@example.com', 
      password: 'pass5', 
      createdAt: new Date(),
      jobTitle: 'Cashier', 
      shift: 'morning'
    };
    service.addUser(employee);
    expect(service.getAllUsers()).toContain(employee);
  });

  it('debería actualizar un Employee existente con updateUser', () => {
    const employee: Employee = { 
      id: 5, 
      username: 'employee1', 
      email: 'employee1@example.com', 
      password: 'pass5', 
      createdAt: new Date(),
      jobTitle: 'Cashier', 
      shift: 'morning'
    };
    service.addUser(employee);
    const updatedEmployee: Employee = { ...employee, shift: 'afternoon' };
    service.updateUser(updatedEmployee);
    expect((service.getUserById(5) as Employee)?.shift).toBe('afternoon');
  });

  it('debería eliminar un Employee con deleteUser', () => {
    const employee: Employee = { 
      id: 5, 
      username: 'employee1', 
      email: 'employee1@example.com', 
      password: 'pass5', 
      createdAt: new Date(),
      jobTitle: 'Cashier', 
      shift: 'morning'
    };
    service.addUser(employee);
    service.deleteUser(5);
    expect(service.getUserById(5)).toBeUndefined();
  });
});
