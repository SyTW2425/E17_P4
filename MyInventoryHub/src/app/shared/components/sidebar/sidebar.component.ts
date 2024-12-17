import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { SidebarService } from '../../../services/sidebar-responsive/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userRole: string = '';
  userName: string = '';
  isOwner: boolean = false;
  isSidebarOpen: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private sidebarService: SidebarService) {}

  ngOnInit(): void {

    this.sidebarService.sidebarState$.subscribe(state => {
      this.isSidebarOpen = state;
    });

    const decodedToken = this.authService.decodeToken();
    this.isOwner = this.authService.isOwner();
    if (decodedToken) {
      this.userName = decodedToken.firstName
        ? `${decodedToken.firstName} ${decodedToken.lastName || ''}`
        : decodedToken.email; 
    }
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.userRole = user.role;
        this.userName = `${user.firstName} ${user.lastName}`;
      },
      error: (err) => {
        console.error('Error al obtener datos del usuario:', err);
      },
    });
    
    this.isOwner = this.authService.isOwner();
    console.log('GAGA: ',this.isOwner)
  }

  onLogout(): void {
    this.authService.logout();  
    //this.router.navigate(['']); 
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }
  
}
