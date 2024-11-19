import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { __extends, __assign } from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = []; 

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  addUser(newUser: User): void {
    this.users.push(newUser);
  }

  updateUser(updatedUser: User): void {
    const index = this.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
