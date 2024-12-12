import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userRole: string = '';
  userName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const decodedToken = this.authService.decodeToken();
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
  }

  onLogout(): void {
    this.authService.logout();  
    //this.router.navigate(['']); 
  }
}
