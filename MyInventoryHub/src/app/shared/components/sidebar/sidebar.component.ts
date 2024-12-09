import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { SidebarService } from '../../../services/sidebar-responsive/sidebar.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userName: string = '';
  isSidebarOpen: boolean = false;
  constructor(private authService: AuthService, private router: Router, private sidebarService: SidebarService) {}

  ngOnInit(): void {

    this.sidebarService.sidebarState$.subscribe(state => {
      this.isSidebarOpen = state;
    });

    const decodedToken = this.authService.decodeToken();
    if (decodedToken) {
      this.userName = decodedToken.firstName
        ? `${decodedToken.firstName} ${decodedToken.lastName || ''}`
        : decodedToken.email; 
    }
  }

  onLogout(): void {
    this.authService.logout();  
    //this.router.navigate(['']); 
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }
  
}
