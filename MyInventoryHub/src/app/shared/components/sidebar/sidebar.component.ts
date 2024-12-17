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
  userName: string = '';
  isSidebarOpen: boolean = false;
  constructor(private authService: AuthService, private router: Router, private sidebarService: SidebarService) {}
  isOwner: boolean = false;
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