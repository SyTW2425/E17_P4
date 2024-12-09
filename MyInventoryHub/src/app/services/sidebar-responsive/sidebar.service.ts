import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarOpen = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.isSidebarOpen.asObservable();

  toggleSidebar() {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }
  closeSidebar(): void {
    this.isSidebarOpen.next(false);
  }
}
