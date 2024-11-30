import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
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
}
